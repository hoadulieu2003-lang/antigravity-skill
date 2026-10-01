/**
 * ============================================================================
 * 🏛️ DATABASE MASTERCLASS — LAB 04: DISTRIBUTED CONSENSUS & HASHING LAB
 * ============================================================================
 * Chủ quản Khóa học (Course Owner): Anh — Lead Architect / Product Owner
 * Thực hiện (Author): Pod 4 — Distributed Consensus & Hashing Engineering Duo
 * Phiên bản (Version): 2.0 Enterprise Blueprint (Pure Node.js, Zero Dependencies)
 * 
 * Mục tiêu Lab (Lab Objectives):
 * 1. Thuật toán Đồng thuận Raft (Raft Consensus Protocol Simulator):
 *    - Mô phỏng cụm 5 nodes (Follower, Candidate, Leader).
 *    - Bầu cử Leader (RequestVote RPC & Quorum Majority N/2 + 1).
 *    - Nhân bản nhật ký (AppendEntries RPC) & Cam kết giao dịch (Commit Index).
 *    - Mô phỏng Phân rã mạng (Network Partition): Minority (2 nodes) vs Majority (3 nodes),
 *      chống Split-Brain, cô lập lệnh ghi thiểu số và hòa giải nhật ký (Log Reconciliation).
 * 2. Vòng băm Nhất quán (Consistent Hashing Ring Simulator):
 *    - Không gian băm 32-bit với Nút ảo (Virtual Nodes / Tokens).
 *    - Định tuyến nhị phân (Binary Search O(log(V*N))) trên vòng băm có thứ tự.
 *    - Đo lường độ lệch chuẩn (Standard Deviation) & Tính toán tỷ lệ di chuyển keys (K/N).
 * ============================================================================
 */

'use strict';

const crypto = require('node:crypto');
const assert = require('node:assert');

// ============================================================================
// 🎨 ANSI TERMINAL FORMATTER (Bộ định dạng đầu ra màu sắc trực quan)
// ============================================================================
const Color = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Green: '\x1b[32m',
  Red: '\x1b[31m',
  Yellow: '\x1b[33m',
  Blue: '\x1b[34m',
  Magenta: '\x1b[35m',
  Cyan: '\x1b[36m',
  White: '\x1b[37m',
  BgBlue: '\x1b[44m',
  BgGreen: '\x1b[42m',
  BgRed: '\x1b[41m',
};

function logHeader(title) {
  console.log(`\n${Color.Bright}${Color.Cyan}╔════════════════════════════════════════════════════════════════════════════════╗${Color.Reset}`);
  console.log(`${Color.Bright}${Color.Cyan}║  ${title.padEnd(76)}║${Color.Reset}`);
  console.log(`${Color.Bright}${Color.Cyan}╚════════════════════════════════════════════════════════════════════════════════╝${Color.Reset}\n`);
}

function logSubHeader(subTitle) {
  console.log(`\n${Color.Bright}${Color.Yellow}--- [ ${subTitle} ] ---${Color.Reset}`);
}

function logSuccess(msg) {
  console.log(`  ${Color.Green}✔ [SUCCESS (Thành công)]${Color.Reset} ${msg}`);
}

function logInfo(msg) {
  console.log(`  ${Color.Blue}ℹ [INFO (Thông tin)]${Color.Reset} ${msg}`);
}

function logWarn(msg) {
  console.log(`  ${Color.Yellow}⚠ [WARNING (Cảnh báo)]${Color.Reset} ${msg}`);
}

// ============================================================================
// 1. RAFT CONSENSUS SIMULATOR (MÔ PHỎNG ĐỒNG THUẬN RAFT)
// ============================================================================

/**
 * Trạng thái của một Node trong Raft (Raft Node States)
 */
const NodeState = {
  FOLLOWER: 'FOLLOWER',     // Nút theo sau (Nhận log từ Leader, sẵn sàng bỏ phiếu)
  CANDIDATE: 'CANDIDATE',   // Nút ứng cử viên (Tự ứng cử khi hết hạn election timeout)
  LEADER: 'LEADER'          // Nút trưởng nhóm (Điều phối ghi nhật ký & gửi heartbeat)
};

/**
 * Lớp đại diện cho một Node trong cụm Raft (Raft Cluster Node)
 */
class RaftNode {
  /**
   * @param {string} id - Định danh node (Node ID: e.g. "N1", "N2")
   * @param {RaftConsensusSimulator} cluster - Tham chiếu đến cụm điều phối
   */
  constructor(id, cluster) {
    this.id = id;
    this.cluster = cluster;

    // --- Persistent State on all servers (Trạng thái bền vững trên mọi node) ---
    this.currentTerm = 0;              // Nhiệm kỳ hiện tại (bắt đầu từ 0, tăng đơn điệu)
    this.votedFor = null;              // ID của candidate nhận được phiếu bầu trong term hiện tại
    this.log = [];                     // Nhật ký: mảng các { term, index, command } (1-indexed logic)

    // --- Volatile State on all servers (Trạng thái biến đổi trong bộ nhớ) ---
    this.state = NodeState.FOLLOWER;   // Trạng thái ban đầu luôn là FOLLOWER
    this.commitIndex = 0;              // Chỉ số log entry cao nhất đã được commit (chốt)
    this.lastApplied = 0;              // Chỉ số log entry cao nhất đã apply vào State Machine
    this.stateMachine = {};            // Kho dữ liệu Replicated State Machine (Key-Value Store)

    // --- Volatile State on Leaders (Trạng thái biến đổi chỉ dành riêng cho Leader) ---
    this.nextIndex = new Map();        // peerId -> index của entry tiếp theo sẽ gửi cho peer đó
    this.matchIndex = new Map();       // peerId -> index cao nhất đã được replicate trên peer đó

    // --- Candidate Volatile State (Trạng thái phục vụ ứng cử) ---
    this.votesReceived = new Set();    // Tập hợp ID các node đã bỏ phiếu cho mình

    // --- Timer Simulation (Mô phỏng bộ đếm thời gian) ---
    this.electionTimeoutTicks = 0;     // Số tick chờ trước khi khởi động bầu cử
    this.ticksSinceLastHeartbeat = 0;  // Số tick trôi qua kể từ lần cuối nhận heartbeat từ Leader
    this.resetElectionTimeout();
  }

  /**
   * Khởi tạo bộ đếm thời gian ngẫu nhiên (Randomized Election Timeout)
   * Nhằm phân tán thời điểm timeout của các node, triệt tiêu chia phiếu (Split-Vote).
   */
  resetElectionTimeout() {
    // Khoảng ngẫu nhiên 6 đến 10 ticks (ticks giả lập thời gian thực)
    this.electionTimeoutTicks = 6 + Math.floor(Math.random() * 5);
    this.ticksSinceLastHeartbeat = 0;
  }

  /**
   * Nhịp đập đồng hồ giả lập (Tick Cycle)
   */
  tick() {
    if (this.state === NodeState.LEADER) {
      // Leader gửi AppendEntries RPC định kỳ (Heartbeat) tới các peers
      this.broadcastHeartbeats();
    } else {
      // Follower hoặc Candidate tăng bộ đếm thời gian
      this.ticksSinceLastHeartbeat++;
      if (this.ticksSinceLastHeartbeat >= this.electionTimeoutTicks) {
        this.startElection();
      }
    }
  }

  /**
   * Khởi động quá trình Bầu cử Leader (Start Election)
   * - Tăng currentTerm.
   * - Chuyển sang CANDIDATE.
   * - Tự bỏ phiếu cho chính mình (Self-vote).
   * - Gửi RequestVote RPC tới toàn bộ các node khác trong cụm.
   */
  startElection() {
    this.state = NodeState.CANDIDATE;
    this.currentTerm++;
    this.votedFor = this.id;
    this.votesReceived = new Set([this.id]);
    this.resetElectionTimeout();

    const lastLogIndex = this.log.length;
    const lastLogTerm = lastLogIndex > 0 ? this.log[lastLogIndex - 1].term : 0;

    // Phát sóng RequestVote RPC tới tất cả các peers
    for (const peerId of this.cluster.getNodeIds()) {
      if (peerId === this.id) continue;
      this.cluster.routeMessage(this.id, peerId, 'RequestVoteRPC', {
        term: this.currentTerm,
        candidateId: this.id,
        lastLogIndex,
        lastLogTerm
      });
    }
  }

  /**
   * Xử lý RequestVote RPC từ Candidate (Handle RequestVote RPC)
   * Tuân thủ quy tắc 5.2 và 5.4.1 của tài liệu Raft gốc (Diego Ongaro).
   */
  handleRequestVote(request) {
    const { term, candidateId, lastLogIndex, lastLogTerm } = request;

    // 1. Nếu term của candidate lớn hơn currentTerm của mình: hạ cấp về FOLLOWER và cập nhật term
    if (term > this.currentTerm) {
      this.currentTerm = term;
      this.state = NodeState.FOLLOWER;
      this.votedFor = null;
    }

    // 2. Nếu term nhỏ hơn currentTerm: từ chối bỏ phiếu ngay lập tức
    if (term < this.currentTerm) {
      return { term: this.currentTerm, voteGranted: false };
    }

    // 3. Kiểm tra điều kiện bỏ phiếu:
    // - Chưa bỏ phiếu cho ai khác trong term này (hoặc đã bỏ phiếu cho chính candidate này).
    // - Log của Candidate phải cập nhật bằng hoặc hơn log của mình (Log Up-To-Date Rule).
    const canVote = (this.votedFor === null || this.votedFor === candidateId);

    const myLastIndex = this.log.length;
    const myLastTerm = myLastIndex > 0 ? this.log[myLastIndex - 1].term : 0;

    // Quy tắc Log Up-To-Date:
    // So sánh term của entry cuối cùng; nếu bằng nhau, so sánh độ dài log (index)
    const isCandidateLogUpToDate = 
      (lastLogTerm > myLastTerm) || 
      (lastLogTerm === myLastTerm && lastLogIndex >= myLastIndex);

    if (canVote && isCandidateLogUpToDate) {
      this.votedFor = candidateId;
      this.resetElectionTimeout(); // Gia hạn thời gian chờ vì vừa thấy candidate hợp lệ
      return { term: this.currentTerm, voteGranted: true };
    }

    return { term: this.currentTerm, voteGranted: false };
  }

  /**
   * Xử lý phản hồi RequestVote Reply từ Peer
   */
  handleRequestVoteReply(peerId, reply) {
    if (reply.term > this.currentTerm) {
      this.currentTerm = reply.term;
      this.state = NodeState.FOLLOWER;
      this.votedFor = null;
      return;
    }

    // Chỉ đếm phiếu nếu mình vẫn đang là CANDIDATE và cùng term
    if (this.state !== NodeState.CANDIDATE || reply.term !== this.currentTerm) {
      return;
    }

    if (reply.voteGranted) {
      this.votesReceived.add(peerId);
      const majorityQuorum = this.cluster.getQuorumSize();

      // Nếu số phiếu thu thập được đạt Đa số (Quorum Majority >= ⌊N/2⌋ + 1)
      if (this.votesReceived.size >= majorityQuorum) {
        this.becomeLeader();
      }
    }
  }

  /**
   * Chuyển hóa thành LEADER khi đạt đủ Quorum phiếu bầu
   */
  becomeLeader() {
    this.state = NodeState.LEADER;
    const nextLogIndex = this.log.length + 1;

    // Khởi tạo bảng chỉ mục replication cho toàn bộ peers
    for (const peerId of this.cluster.getNodeIds()) {
      if (peerId === this.id) continue;
      this.nextIndex.set(peerId, nextLogIndex);
      this.matchIndex.set(peerId, 0);
    }

    // Gửi ngay lập tức Heartbeat rỗng để khẳng định chủ quyền, ngăn các node khác timeout
    this.broadcastHeartbeats();
  }

  /**
   * Phát sóng AppendEntries RPC (Heartbeat & Log Replication) tới tất cả các peers
   */
  broadcastHeartbeats() {
    for (const peerId of this.cluster.getNodeIds()) {
      if (peerId === this.id) continue;
      this.sendAppendEntriesTo(peerId);
    }
  }

  /**
   * Gửi AppendEntries RPC tới một peer cụ thể
   */
  sendAppendEntriesTo(peerId) {
    const nextIdx = this.nextIndex.get(peerId) || (this.log.length + 1);
    const prevLogIndex = nextIdx - 1;
    const prevLogTerm = prevLogIndex > 0 ? this.log[prevLogIndex - 1].term : 0;

    // Lấy các entry từ prevLogIndex trở đi để gửi cho follower
    const entries = this.log.slice(prevLogIndex);

    this.cluster.routeMessage(this.id, peerId, 'AppendEntriesRPC', {
      term: this.currentTerm,
      leaderId: this.id,
      prevLogIndex,
      prevLogTerm,
      entries,
      leaderCommit: this.commitIndex
    });
  }

  /**
   * Xử lý AppendEntries RPC từ Leader (Receiver Implementation)
   */
  handleAppendEntries(request) {
    const { term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit } = request;

    // 1. Phản hồi thất bại nếu term gửi sang nhỏ hơn currentTerm của mình
    if (term < this.currentTerm) {
      return { term: this.currentTerm, success: false, matchIndex: this.log.length };
    }

    // 2. Nếu nhận được heartbeat từ Leader hợp lệ có term >= currentTerm:
    // Cập nhật term và giữ trạng thái FOLLOWER
    if (term > this.currentTerm || this.state === NodeState.CANDIDATE) {
      this.currentTerm = term;
      this.state = NodeState.FOLLOWER;
      this.votedFor = null;
    }

    // Reset lại bộ đếm election timer vì Leader vẫn đang sống và kết nối tốt
    this.resetElectionTimeout();

    // 3. Kiểm tra tính toàn vẹn của nhật ký (Log Matching Property):
    // Nếu tại prevLogIndex, node không có entry nào hoặc entry có term khác prevLogTerm -> Từ chối!
    if (prevLogIndex > 0) {
      if (this.log.length < prevLogIndex) {
        return { term: this.currentTerm, success: false, matchIndex: this.log.length };
      }
      if (this.log[prevLogIndex - 1].term !== prevLogTerm) {
        // Xung đột term: báo thất bại để leader lùi nextIndex lại
        return { term: this.currentTerm, success: false, matchIndex: prevLogIndex - 1 };
      }
    }

    // 4. Hòa giải nhật ký (Log Reconciliation):
    // Nếu có entry xung đột (cùng index nhưng khác term), cắt bỏ toàn bộ entry đó và phần sau
    let insertIndex = prevLogIndex;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const existing = this.log[insertIndex];

      if (existing) {
        if (existing.term !== entry.term) {
          // Xung đột phát hiện! Cắt log từ điểm xung đột trở đi (Xóa các entry rác chưa commit)
          this.log = this.log.slice(0, insertIndex);
          this.log.push(entry);
        }
      } else {
        // Chưa có entry tại vị trí này -> append thêm vào
        this.log.push(entry);
      }
      insertIndex++;
    }

    // 5. Cập nhật commitIndex theo Leader
    if (leaderCommit > this.commitIndex) {
      this.commitIndex = Math.min(leaderCommit, this.log.length);
      this.applyLogEntries();
    }

    return { term: this.currentTerm, success: true, matchIndex: this.log.length };
  }

  /**
   * Xử lý phản hồi AppendEntries Reply từ Follower
   */
  handleAppendEntriesReply(peerId, reply) {
    if (reply.term > this.currentTerm) {
      this.currentTerm = reply.term;
      this.state = NodeState.FOLLOWER;
      this.votedFor = null;
      return;
    }

    if (this.state !== NodeState.LEADER || reply.term !== this.currentTerm) {
      return;
    }

    if (reply.success) {
      // Replicate thành công: cập nhật matchIndex và nextIndex của peer đó
      this.matchIndex.set(peerId, reply.matchIndex);
      this.nextIndex.set(peerId, reply.matchIndex + 1);

      // Kiểm tra xem có log entry nào đạt Quorum Majority để tăng commitIndex không
      this.checkAndAdvanceCommitIndex();
    } else {
      // Replicate thất bại do lệch log: lùi nextIndex của peer xuống 1 nấc và thử lại
      const currentNext = this.nextIndex.get(peerId) || 2;
      const decrementedNext = Math.max(1, Math.min(currentNext - 1, reply.matchIndex + 1));
      this.nextIndex.set(peerId, decrementedNext);
      this.sendAppendEntriesTo(peerId);
    }
  }

  /**
   * Kiểm tra và thăng cấp Commit Index trên Leader:
   * Nếu tồn tại một chỉ số N > commitIndex, sao cho phần lớn matchIndex[peer] >= N
   * và log[N - 1].term === currentTerm thì gán commitIndex = N (Raft Section 5.3 & 5.4.2).
   */
  checkAndAdvanceCommitIndex() {
    const majorityQuorum = this.cluster.getQuorumSize();
    const oldCommitIndex = this.commitIndex;

    for (let N = this.commitIndex + 1; N <= this.log.length; N++) {
      const entry = this.log[N - 1];
      // Raft Invariant: Leader chỉ được chủ động commit các entry thuộc nhiệm kỳ (term) hiện tại của chính nó
      if (entry.term === this.currentTerm) {
        let matchCount = 1; // Bản thân Leader đã lưu entry này
        for (const peerId of this.cluster.getNodeIds()) {
          if (peerId === this.id) continue;
          if ((this.matchIndex.get(peerId) || 0) >= N) {
            matchCount++;
          }
        }

        if (matchCount >= majorityQuorum) {
          this.commitIndex = N;
        }
      }
    }

    // Apply các entry đã commit vào State Machine cục bộ
    this.applyLogEntries();

    // Nếu commitIndex vừa tăng lên, phát sóng thông báo cho các Followers biết ngay (Notify followers)
    if (this.commitIndex > oldCommitIndex) {
      this.broadcastHeartbeats();
    }
  }

  /**
   * Áp dụng các log entries đã chốt (Committed) vào State Machine
   */
  applyLogEntries() {
    while (this.lastApplied < this.commitIndex) {
      this.lastApplied++;
      const entry = this.log[this.lastApplied - 1];
      if (entry && entry.command) {
        const { key, value } = entry.command;
        if (key !== undefined) {
          this.stateMachine[key] = value;
        }
      }
    }
  }

  /**
   * Nhận lệnh ghi từ Client (Client Write Request)
   */
  clientWrite(command) {
    if (this.state !== NodeState.LEADER) {
      return {
        success: false,
        reason: 'NOT_LEADER (Không phải Leader)',
        currentLeader: this.cluster.findLeaderId(),
        term: this.currentTerm
      };
    }

    // Ghi entry mới vào log cục bộ (chưa commit)
    const newEntry = {
      term: this.currentTerm,
      index: this.log.length + 1,
      command
    };
    this.log.push(newEntry);

    // Kích hoạt phát sóng AppendEntries tới các peers ngay lập tức
    this.broadcastHeartbeats();

    return {
      success: true,
      entryIndex: newEntry.index,
      term: this.currentTerm
    };
  }
}

/**
 * Cụm mô phỏng đồng thuận Raft (Raft Cluster Simulator)
 */
class RaftConsensusSimulator {
  /**
   * @param {string[]} nodeIds - Danh sách các node trong cụm (mặc định 5 nodes)
   */
  constructor(nodeIds = ['N1', 'N2', 'N3', 'N4', 'N5']) {
    this.nodeIds = nodeIds;
    this.nodes = new Map();
    for (const id of nodeIds) {
      this.nodes.set(id, new RaftNode(id, this));
    }

    // Quản lý Phân rã Mạng (Network Partitions)
    // Nếu active, partitions là danh sách các Set(nodeId). Hai node chỉ liên lạc được nếu cùng thuộc 1 Set.
    this.partitions = null;

    // Hàng đợi thông điệp mạng (In-flight Message Queue)
    this.messageQueue = [];
  }

  getNodeIds() {
    return this.nodeIds;
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  /**
   * Kích thước Quorum đa số: ⌊N / 2⌋ + 1
   */
  getQuorumSize() {
    return Math.floor(this.nodeIds.length / 2) + 1;
  }

  /**
   * Tìm Leader hiện tại trong cụm (nếu có)
   */
  findLeaderId() {
    for (const [id, node] of this.nodes) {
      if (node.state === NodeState.LEADER) return id;
    }
    return null;
  }

  /**
   * Thiết lập Phân rã mạng (Set Network Partition)
   * @param {string[][]} groups - Ví dụ: [['N1', 'N2'], ['N3', 'N4', 'N5']]
   */
  setPartition(groups) {
    this.partitions = groups.map(g => new Set(g));
    logWarn(`Đã kích hoạt Network Partition: [${groups.map(g => g.join(', ')).join('] vs [')}]`);
  }

  /**
   * Khôi phục kết nối mạng toàn thể (Heal Network Partition)
   */
  healPartition() {
    this.partitions = null;
    logSuccess('Mạng phân rã đã được hàn gắn (Network Partition Healed). Toàn bộ 5 nodes kết nối bình thường.');
  }

  /**
   * Kiểm tra xem 2 node có thể truyền thông điệp tới nhau không
   */
  canCommunicate(fromId, toId) {
    if (!this.partitions) return true; // Không có partition -> mọi node kết nối thông suốt
    for (const group of this.partitions) {
      if (group.has(fromId) && group.has(toId)) {
        return true;
      }
    }
    return false; // Khác phân vùng -> Packet Drop
  }

  /**
   * Định tuyến gói tin giữa 2 nodes qua bộ lọc Partition
   */
  routeMessage(fromId, toId, type, payload) {
    if (!this.canCommunicate(fromId, toId)) {
      // Rớt gói tin do đứt cáp hoặc tường lửa phân rã (Simulated Packet Drop)
      return;
    }

    // Đưa gói tin vào hàng đợi để xử lý tuần tự hoặc đồng bộ
    this.messageQueue.push({ fromId, toId, type, payload });
  }

  /**
   * Xử lý toàn bộ gói tin đang bay trong hàng đợi mạng
   */
  flushMessages() {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      const targetNode = this.nodes.get(msg.toId);
      if (!targetNode) continue;

      if (msg.type === 'RequestVoteRPC') {
        const reply = targetNode.handleRequestVote(msg.payload);
        // Trả phản hồi ngược lại cho candidate nếu đường mạng cho phép
        if (this.canCommunicate(msg.toId, msg.fromId)) {
          const sender = this.nodes.get(msg.fromId);
          if (sender) sender.handleRequestVoteReply(msg.toId, reply);
        }
      } else if (msg.type === 'AppendEntriesRPC') {
        const reply = targetNode.handleAppendEntries(msg.payload);
        // Trả phản hồi ngược lại cho leader nếu đường mạng cho phép
        if (this.canCommunicate(msg.toId, msg.fromId)) {
          const sender = this.nodes.get(msg.fromId);
          if (sender) sender.handleAppendEntriesReply(msg.toId, reply);
        }
      }
    }
  }

  /**
   * Mô phỏng chạy một số lượng ticks nhất định trên toàn cụm
   */
  stepTicks(count = 1) {
    for (let i = 0; i < count; i++) {
      // Mỗi node thực hiện nhịp tick
      for (const node of this.nodes.values()) {
        node.tick();
      }
      // Xả toàn bộ thông điệp sinh ra trong tick này
      this.flushMessages();
    }
  }

  /**
   * Ép buộc kích hoạt bầu cử trên một node cụ thể (dùng trong test case có kiểm soát)
   */
  forceElectionOn(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node ${nodeId} không tồn tại`);
    node.startElection();
    this.flushMessages();
  }
}


// ============================================================================
// 2. CONSISTENT HASHING RING (VÒNG BĂM NHẤT QUÁN & NÚT ẢO)
// ============================================================================

/**
 * Lớp triển khai Vòng băm Nhất quán (Consistent Hashing Ring with Virtual Nodes)
 */
class ConsistentHashingRing {
  /**
   * @param {number} virtualNodesPerNode - Số lượng nút ảo trên mỗi node vật lý (mặc định 100)
   */
  constructor(virtualNodesPerNode = 100) {
    this.vnodesPerNode = virtualNodesPerNode;
    this.ring = [];                       // Mảng các vị trí băm đã được sắp xếp tăng dần: number[]
    this.vnodeToNodeMap = new Map();      // hashPosition -> physicalNodeId
    this.physicalNodes = new Set();       // Tập hợp các physicalNodeId đang hoạt động
  }

  /**
   * Hàm băm 32-bit không dấu từ chuỗi ký tự (32-bit Unsigned Integer Hash)
   * Sử dụng MD5 4-bytes đầu đọc Big-Endian, phân phối đồng nhất trên [0, 2^32 - 1].
   */
  hash(key) {
    const md5Digest = crypto.createHash('md5').update(String(key)).digest();
    return md5Digest.readUInt32BE(0);
  }

  /**
   * Thêm một node vật lý vào vòng băm (Add Physical Node)
   * Tự động sinh `vnodesPerNode` nút ảo rải đều khắp không gian vòng tròn 32-bit.
   */
  addNode(nodeId) {
    if (this.physicalNodes.has(nodeId)) {
      return false; // Node đã tồn tại
    }

    this.physicalNodes.add(nodeId);

    // Sinh các vị trí nút ảo (Virtual Nodes)
    for (let i = 0; i < this.vnodesPerNode; i++) {
      const vnodeToken = `${nodeId}#vnode_${i}`;
      const hashVal = this.hash(vnodeToken);

      // Xử lý xung đột băm cực hiếm (Hash Collision avoidance)
      if (!this.vnodeToNodeMap.has(hashVal)) {
        this.ring.push(hashVal);
        this.vnodeToNodeMap.set(hashVal, nodeId);
      }
    }

    // Sắp xếp lại vòng băm để phục vụ tìm kiếm nhị phân (Binary Search)
    this.ring.sort((a, b) => a - b);
    return true;
  }

  /**
   * Gỡ bỏ một node vật lý khỏi vòng băm (Remove Physical Node)
   */
  removeNode(nodeId) {
    if (!this.physicalNodes.has(nodeId)) {
      return false;
    }

    this.physicalNodes.delete(nodeId);

    // Lọc bỏ toàn bộ vnode thuộc về nodeId
    this.ring = this.ring.filter(hashVal => {
      if (this.vnodeToNodeMap.get(hashVal) === nodeId) {
        this.vnodeToNodeMap.delete(hashVal);
        return false;
      }
      return true;
    });

    return true;
  }

  /**
   * Tìm kiếm Node vật lý chịu trách nhiệm cho một Khóa (Find Node for Key)
   * Sử dụng thuật toán Tìm kiếm Nhị phân (Binary Search O(log(V*N))) theo chiều kim đồng hồ.
   */
  getNode(key) {
    if (this.ring.length === 0) {
      return null;
    }

    const keyHash = this.hash(key);

    // Binary Search tìm phần tử đầu tiên trên vòng tròn có hashVal >= keyHash
    let low = 0;
    let high = this.ring.length - 1;
    let targetIdx = 0;

    // Nếu keyHash lớn hơn phần tử cuối cùng của ring, vòng quanh về đầu vòng (Wrap Around to index 0)
    if (keyHash > this.ring[high]) {
      targetIdx = 0;
    } else {
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (this.ring[mid] >= keyHash) {
          targetIdx = mid;
          high = mid - 1; // Tiếp tục tìm về phía trái xem có điểm nào nhỏ hơn mà vẫn >= keyHash không
        } else {
          low = mid + 1;
        }
      }
    }

    const matchedHash = this.ring[targetIdx];
    return this.vnodeToNodeMap.get(matchedHash);
  }

  /**
   * Phân tích Độ Lệch Phân Bổ Dữ Liệu (Analyze Data Distribution Statistics)
   * @param {string[]} keys - Mảng các keys thử nghiệm
   */
  analyzeDistribution(keys) {
    const distribution = new Map();
    for (const nodeId of this.physicalNodes) {
      distribution.set(nodeId, 0);
    }

    // Phân bổ từng key vào node tương ứng
    for (const key of keys) {
      const assignedNode = this.getNode(key);
      if (assignedNode) {
        distribution.set(assignedNode, distribution.get(assignedNode) + 1);
      }
    }

    const counts = Array.from(distribution.values());
    const totalKeys = keys.length;
    const nodeCount = this.physicalNodes.size;
    const mean = totalKeys / nodeCount; // Giá trị trung bình kỳ vọng (Expected Mean)

    // Tính Phương sai (Variance) & Độ lệch chuẩn (Standard Deviation)
    const variance = counts.reduce((acc, count) => acc + Math.pow(count - mean, 2), 0) / nodeCount;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = (standardDeviation / mean) * 100; // Hệ số biến thiên CV (%)

    const min = Math.min(...counts);
    const max = Math.max(...counts);

    return {
      totalKeys,
      nodeCount,
      distribution: Object.fromEntries(distribution),
      mean,
      standardDeviation: Number(standardDeviation.toFixed(2)),
      coefficientOfVariation: Number(coefficientOfVariation.toFixed(2)),
      min,
      max,
      maxMinRatio: Number((max / (min || 1)).toFixed(2))
    };
  }

  /**
   * Đo lường Số lượng và Tỷ lệ Keys bị di chuyển khi thêm một Node mới (Measure Key Migration)
   * Chứng minh Định lý Consistent Hashing: Chỉ có xấp xỉ K / N_new keys bị di chuyển,
   * hoàn toàn áp đảo thuật toán Modulo Hashing (vốn làm di chuyển ~ N/(N+1) = 80% keys).
   */
  measureMigrationOnAdd(keys, newNodeId) {
    // 1. Ghi nhận phân bổ ban đầu trước khi thêm node
    const initialMapping = new Map();
    for (const key of keys) {
      initialMapping.set(key, this.getNode(key));
    }

    // 2. Thêm node mới vào vòng băm
    this.addNode(newNodeId);

    // 3. Kiểm tra lại phân bổ sau khi thêm node
    let migratedConsistentCount = 0;
    const migrationDestinations = new Map();

    for (const key of keys) {
      const oldNode = initialMapping.get(key);
      const newNode = this.getNode(key);

      if (oldNode !== newNode) {
        migratedConsistentCount++;
        migrationDestinations.set(newNode, (migrationDestinations.get(newNode) || 0) + 1);
      }
    }

    // 4. So sánh với Thuật toán Modulo Hashing cổ điển: Hash(key) % N
    const N_old = this.physicalNodes.size - 1;
    const N_new = this.physicalNodes.size;
    let migratedModuloCount = 0;

    for (const key of keys) {
      const hashVal = this.hash(key);
      const oldBucket = hashVal % N_old;
      const newBucket = hashVal % N_new;
      if (oldBucket !== newBucket) {
        migratedModuloCount++;
      }
    }

    const total = keys.length;
    const consistentPercent = (migratedConsistentCount / total) * 100;
    const moduloPercent = (migratedModuloCount / total) * 100;
    const theoreticalPercent = (1 / N_new) * 100; // Lý thuyết K / N_new

    return {
      totalKeys: total,
      oldNodeCount: N_old,
      newNodeCount: N_new,
      migratedConsistentCount,
      consistentPercent: Number(consistentPercent.toFixed(2)),
      theoreticalPercent: Number(theoreticalPercent.toFixed(2)),
      migratedModuloCount,
      moduloPercent: Number(moduloPercent.toFixed(2)),
      churnReductionFactor: Number((moduloPercent / (consistentPercent || 0.01)).toFixed(2))
    };
  }
}


// ============================================================================
// 3. BUILT-IN TEST SUITE (BỘ KIỂM THỬ TỰ ĐỘNG KHÉP KÍN)
// ============================================================================

/**
 * Test 1: Bầu cử Raft leader thành công và commit log nhất quán
 */
function testRaftElectionAndReplication() {
  logSubHeader('TEST 1: RAFT LEADER ELECTION & CONSISTENT LOG COMMIT');

  const cluster = new RaftConsensusSimulator(['N1', 'N2', 'N3', 'N4', 'N5']);
  logInfo('Khởi tạo cụm Raft 5 nodes (N1, N2, N3, N4, N5). Quorum Majority = 3 nodes.');

  // Kích hoạt bầu cử trên N1
  logInfo('Node N1 kích hoạt Bầu cử (Start Election) cho Term 1...');
  cluster.forceElectionOn('N1');

  const leaderId = cluster.findLeaderId();
  logInfo(`Trạng thái sau bầu cử: Leader được bầu là [${Color.Bright}${leaderId}${Color.Reset}] tại Term ${cluster.getNode('N1').currentTerm}`);

  assert.strictEqual(leaderId, 'N1', 'Node N1 phải trở thành Leader thành công');
  assert.strictEqual(cluster.getNode('N1').state, NodeState.LEADER, 'N1 phải ở trạng thái LEADER');
  logSuccess('Bầu cử Leader thành công: N1 nhận đủ Quorum phiếu bầu (>= 3/5 votes).');

  // Client ghi 3 lệnh dữ liệu vào Leader
  logInfo('Client gửi 3 giao dịch ghi liên tiếp tới Leader N1:');
  const commands = [
    { key: 'account:alice', value: { balance: 1000, currency: 'USD' } },
    { key: 'account:bob', value: { balance: 750, currency: 'USD' } },
    { key: 'cluster:config', value: { max_conn: 5000, read_timeout_ms: 200 } }
  ];

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    const writeRes = cluster.getNode(leaderId).clientWrite(cmd);
    assert.strictEqual(writeRes.success, true, `Lệnh ghi ${i + 1} phải thành công tại Leader`);
    cluster.flushMessages();
  }

  // Xác minh commitIndex và State Machine trên tất cả 5 nodes
  logInfo('Kiểm tra tính nhất quán State Machine trên toàn bộ 5 nodes:');
  for (const nodeId of cluster.getNodeIds()) {
    const node = cluster.getNode(nodeId);
    assert.strictEqual(node.commitIndex, 3, `Node ${nodeId} phải có commitIndex = 3`);
    assert.strictEqual(node.log.length, 3, `Node ${nodeId} phải có đúng 3 log entries`);
    assert.deepStrictEqual(
      node.stateMachine['account:alice'],
      { balance: 1000, currency: 'USD' },
      `State machine trên ${nodeId} phải lưu đúng tài khoản Alice`
    );
    assert.deepStrictEqual(
      node.stateMachine['cluster:config'],
      { max_conn: 5000, read_timeout_ms: 200 },
      `State machine trên ${nodeId} phải lưu đúng cấu hình cluster`
    );
    console.log(`    ↳ Node [${nodeId}] State: ${node.state.padEnd(9)} | Term: ${node.currentTerm} | CommitIndex: ${node.commitIndex} | LogLength: ${node.log.length} | StateMachine: OK ✔`);
  }

  logSuccess('Test 1 Passed: Toàn bộ 5 nodes đạt Đồng thuận Nhật ký (Log Consensus) 100% nhất quán.');
}

/**
 * Test 2: Xử lý Network Partition và Split-Brain đúng chuẩn Raft
 */
function testRaftNetworkPartitionAndReconciliation() {
  logSubHeader('TEST 2: NETWORK PARTITION, SPLIT-BRAIN MITIGATION & RECONCILIATION');

  const cluster = new RaftConsensusSimulator(['N1', 'N2', 'N3', 'N4', 'N5']);
  
  // Bước 1: Ổn định ban đầu với N1 làm Leader Term 1
  cluster.forceElectionOn('N1');
  const oldLeader = cluster.findLeaderId();
  assert.strictEqual(oldLeader, 'N1');
  
  // Ghi 1 lệnh nền
  cluster.getNode('N1').clientWrite({ key: 'init:state', value: 'V1_STABLE' });
  cluster.flushMessages();
  logInfo('Cụm ban đầu hoạt động ổn định: N1 là Leader (Term 1), đã commit entry [init:state = V1_STABLE].');

  // Bước 2: Tạo Network Partition: Phân rã cụm làm 2 nhóm
  // - Nhóm Thiểu số (Minority Partition): [N1, N2] (2 nodes < Quorum 3) -> Chứa Leader cũ N1
  // - Nhóm Đa số (Majority Partition): [N3, N4, N5] (3 nodes >= Quorum 3)
  cluster.setPartition([['N1', 'N2'], ['N3', 'N4', 'N5']]);

  // Bước 3: Client gửi lệnh ghi tới Leader cũ N1 ở nhóm thiểu số
  logInfo('Client cố gắng ghi dữ liệu vào Leader cũ N1 trong nhóm Thiểu số [N1, N2]:');
  const minorityWrite = cluster.getNode('N1').clientWrite({ key: 'tx:minority', value: 'SHOULD_NOT_COMMIT' });
  assert.strictEqual(minorityWrite.success, true);
  cluster.flushMessages(); // Gói tin gửi tới N3, N4, N5 sẽ bị rớt!

  // Kiểm tra: N1 chỉ replicate được sang N2 (tổng 2 nodes). Thiếu Quorum (2 < 3) -> KHÔNG ĐƯỢC COMMIT!
  const n1Commit = cluster.getNode('N1').commitIndex;
  assert.strictEqual(n1Commit, 1, 'N1 không được phép tăng commitIndex vì không đạt Quorum đa số!');
  assert.strictEqual(cluster.getNode('N1').stateMachine['tx:minority'], undefined, 'Lệnh ghi thiểu số không được apply vào State Machine!');
  logSuccess('Phòng chống Split-Brain: Leader cũ N1 ghi nhận entry nhưng KHÔNG THỂ COMMIT do thiếu Quorum (2/5 < 3).');

  // Bước 4: Nhóm Đa số [N3, N4, N5] phát hiện mất heartbeat từ N1 -> Khởi động bầu cử mới
  logInfo('Nhóm Đa số [N3, N4, N5] hết hạn election timeout và bầu Leader mới (Term 2)...');
  cluster.forceElectionOn('N3'); // N3 ứng cử tại Term 2
  
  const newLeaderId = cluster.getNode('N3').state === NodeState.LEADER ? 'N3' : cluster.findLeaderId();
  assert.strictEqual(newLeaderId, 'N3', 'Node N3 phải đắc cử Leader mới tại phân vùng Đa số');
  assert.strictEqual(cluster.getNode('N3').currentTerm, 2, 'Leader mới N3 phải có Term = 2');
  logSuccess(`Nhóm Đa số bầu thành công Leader mới [${Color.Bright}${newLeaderId}${Color.Reset}] tại Term 2.`);

  // Bước 5: Client gửi lệnh ghi hợp lệ tới Leader mới N3
  logInfo('Client gửi giao dịch ghi hợp lệ vào Leader mới N3 trong nhóm Đa số:');
  const majorityWrite = cluster.getNode('N3').clientWrite({ key: 'tx:majority', value: 'COMMITTED_IN_TERM_2' });
  assert.strictEqual(majorityWrite.success, true);
  cluster.flushMessages();

  // Kiểm tra: N3 replicate được sang N4, N5 (tổng 3 nodes >= Quorum 3) -> COMMIT THÀNH CÔNG!
  assert.strictEqual(cluster.getNode('N3').commitIndex, 2, 'Leader mới N3 phải commit thành công entry index 2');
  assert.strictEqual(cluster.getNode('N3').stateMachine['tx:majority'], 'COMMITTED_IN_TERM_2');
  logSuccess('Nhóm Đa số [N3, N4, N5] đạt Quorum đa số và COMMIT thành công giao dịch mới.');

  // Bước 6: Hàn gắn Phân rã mạng (Heal Partition) & Hòa giải Nhật ký (Log Reconciliation)
  logInfo('Hàn gắn mạng (Healing Network Partition) — Kết nối lại toàn thể 5 nodes...');
  cluster.healPartition();

  // Leader mới N3 phát sóng Heartbeat & AppendEntries sang N1 và N2
  logInfo('Leader N3 phát sóng AppendEntries sang N1 và N2 để đồng bộ và giải quyết xung đột...');
  cluster.getNode('N3').broadcastHeartbeats();
  cluster.flushMessages();

  // Kiểm tra kết quả hòa giải (Log Reconciliation Verification):
  // 1. N1 phải thấy Term 2 > Term 1 -> Tự động thoái vị (Step down) về FOLLOWER.
  // 2. Entry chưa commit 'tx:minority' trên N1 phải bị GHI ĐÈ / CẮT BỎ (Overwritten/Truncated).
  // 3. Toàn bộ 5 nodes phải lưu trữ chính xác entry 'tx:majority' và có cùng commitIndex = 2.
  assert.strictEqual(cluster.getNode('N1').state, NodeState.FOLLOWER, 'N1 phải thoái vị về FOLLOWER');
  assert.strictEqual(cluster.getNode('N1').currentTerm, 2, 'N1 phải cập nhật lên Term 2');

  for (const id of cluster.getNodeIds()) {
    const node = cluster.getNode(id);
    assert.strictEqual(node.commitIndex, 2, `Node ${id} phải đồng thuận tại commitIndex = 2`);
    assert.strictEqual(
      node.stateMachine['tx:majority'],
      'COMMITTED_IN_TERM_2',
      `Node ${id} phải có dữ liệu commit của Term 2`
    );
    assert.strictEqual(
      node.stateMachine['tx:minority'],
      undefined,
      `Dữ liệu chưa commit từ phân vùng thiểu số phải bị triệt tiêu hoàn toàn trên node ${id}`
    );
    console.log(`    ↳ Node [${id}] State: ${node.state.padEnd(9)} | Term: ${node.currentTerm} | CommitIndex: ${node.commitIndex} | tx:majority='${node.stateMachine['tx:majority']}' ✔`);
  }

  logSuccess('Test 2 Passed: Phân rã mạng, phòng chống Split-Brain và Hòa giải Log hoàn hảo theo đặc tả Raft.');
}

/**
 * Test 3: Consistent Hashing phân bổ đều và di chuyển tối thiểu khi mở rộng node
 */
function testConsistentHashingUniformityAndMigration() {
  logSubHeader('TEST 3: CONSISTENT HASHING RING UNIFORMITY & MINIMAL KEY MIGRATION');

  const vnodeCount = 150; // 150 virtual nodes / physical node
  const ring = new ConsistentHashingRing(vnodeCount);
  const initialNodes = ['cache-node-01', 'cache-node-02', 'cache-node-03', 'cache-node-04'];

  for (const n of initialNodes) {
    ring.addNode(n);
  }
  logInfo(`Khởi tạo Consistent Hashing Ring với 4 nodes, mỗi node mang ${vnodeCount} virtual nodes (Tổng ${4 * vnodeCount} vnodes).`);

  // Tạo tập 10,000 keys giả lập lưu lượng thực tế
  const totalKeys = 10000;
  const testKeys = [];
  for (let i = 0; i < totalKeys; i++) {
    testKeys.push(`session:user_${i}_jwt_token_${(i * 7919) % 65536}`);
  }

  // Phân tích độ đồng đều phân bổ ban đầu (Distribution Uniformity)
  const statsBefore = ring.analyzeDistribution(testKeys);
  logInfo('Thống kê phân bổ dữ liệu trên 4 nodes ban đầu:');
  console.log(`    ↳ Tổng số Keys: ${statsBefore.totalKeys.toLocaleString()}`);
  console.log(`    ↳ Kỳ vọng trung bình (Mean): ${statsBefore.mean.toLocaleString()} keys/node`);
  console.log(`    ↳ Độ lệch chuẩn (Std Dev): ${statsBefore.standardDeviation} keys`);
  console.log(`    ↳ Hệ số biến thiên (CV): ${statsBefore.coefficientOfVariation}% (Mục tiêu: < 10% cho độ đồng đều cao)`);
  console.log(`    ↳ Tỷ lệ Max / Min: ${statsBefore.maxMinRatio}x`);
  console.log('    ↳ Chi tiết từng node:', statsBefore.distribution);

  assert(statsBefore.coefficientOfVariation < 15, 'Hệ số biến thiên CV phải nhỏ hơn 15%, chứng minh dữ liệu phân bổ đều');
  logSuccess('Phân bổ dữ liệu đồng nhất: Nút ảo (Virtual Nodes) giúp triệt tiêu điểm nóng (Hotspots).');

  // Mở rộng cụm: Thêm node thứ 5 ('cache-node-05') và đo lường di chuyển Keys
  logInfo('Mở rộng cụm (Scale-out): Thêm node thứ 5 [cache-node-05]...');
  const migrationStats = ring.measureMigrationOnAdd(testKeys, 'cache-node-05');

  console.log(`\n    ${Color.Bright}┌────────────────────────────────────────────────────────────────────────┐${Color.Reset}`);
  console.log(`    ${Color.Bright}│  BẢNG SO SÁNH DI CHUYỂN DỮ LIỆU KHI THÊM NODE (SCALE-OUT COMPARISON)   │${Color.Reset}`);
  console.log(`    ${Color.Bright}├────────────────────────────────────────┬───────────────┬───────────────┤${Color.Reset}`);
  console.log(`    ${Color.Bright}│ Tiêu chí đánh giá                      │ Consistent    │ Modulo Hash   │${Color.Reset}`);
  console.log(`    ${Color.Bright}│                                        │ Hashing Ring  │ Hash(k) % N   │${Color.Reset}`);
  console.log(`    ${Color.Bright}├────────────────────────────────────────┼───────────────┼───────────────┤${Color.Reset}`);
  console.log(`    │ Số keys bị di chuyển (Keys Migrated)   │ ${String(migrationStats.migratedConsistentCount).padEnd(13)} │ ${String(migrationStats.migratedModuloCount).padEnd(13)} │`);
  console.log(`    │ Tỷ lệ di chuyển thực tế (Actual %)     │ ${(migrationStats.consistentPercent + '%').padEnd(13)} │ ${(migrationStats.moduloPercent + '%').padEnd(13)} │`);
  console.log(`    │ Tỷ lệ lý thuyết (Theoretical K/N_new)  │ ${(migrationStats.theoreticalPercent + '%').padEnd(13)} │ ${(Number(((4/5)*100).toFixed(2)) + '%').padEnd(13)} │`);
  console.log(`    │ Mức giảm tải rung lắc (Churn Reduction)│ ${Color.Green}${('x' + migrationStats.churnReductionFactor + ' Lần').padEnd(13)}${Color.Reset} │ Baseline (1x) │`);
  console.log(`    ${Color.Bright}└────────────────────────────────────────┴───────────────┴───────────────┘${Color.Reset}\n`);

  // Kiểm chứng tính chất cốt lõi:
  // Consistent Hashing chỉ di chuyển xấp xỉ 1/N = 20% (+/- 4%), trong khi Modulo Hashing di chuyển ~80%
  assert(
    migrationStats.consistentPercent >= 16 && migrationStats.consistentPercent <= 24,
    `Tỷ lệ di chuyển của Consistent Hashing (${migrationStats.consistentPercent}%) phải xấp xỉ 1/5 = 20%`
  );
  assert(
    migrationStats.moduloPercent >= 75,
    `Tỷ lệ di chuyển của Modulo Hashing (${migrationStats.moduloPercent}%) phải xấp xỉ 80%`
  );
  assert(
    migrationStats.churnReductionFactor >= 3.5,
    'Consistent Hashing phải giảm rung lắc di chuyển ít nhất 3.5 lần so với Modulo Hash'
  );

  logSuccess('Test 3 Passed: Định lý Consistent Hashing được chứng minh thực nghiệm (Chỉ K/N keys di chuyển).');
}

// ============================================================================
// 4. MAIN EXECUTOR (CHẠY TOÀN BỘ PHÒNG THÍ NGHIỆM)
// ============================================================================
function runAllLabs() {
  logHeader('LAB 04: DISTRIBUTED CONSENSUS & CONSISTENT HASHING LABORATORY');
  console.log(`  ${Color.Dim}Thời gian thực thi: ${new Date().toISOString()}${Color.Reset}`);
  console.log(`  ${Color.Dim}Môi trường: Node.js ${process.version} (Zero External Dependencies)${Color.Reset}`);

  const startTime = Date.now();

  try {
    testRaftElectionAndReplication();
    testRaftNetworkPartitionAndReconciliation();
    testConsistentHashingUniformityAndMigration();

    const elapsed = Date.now() - startTime;
    console.log(`\n${Color.Bright}${Color.Green}════════════════════════════════════════════════════════════════════════════════${Color.Reset}`);
    console.log(`${Color.Bright}${Color.Green}  🎉 TẤT CẢ 3 BỘ KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC (ALL 3 LAB TESTS PASSED)!       ${Color.Reset}`);
    console.log(`${Color.Bright}${Color.Green}  ⚡ Tổng thời gian chạy: ${elapsed}ms | 100% Tiêu chuẩn Đồng thuận Raft & Băm Nhất quán${Color.Reset}`);
    console.log(`${Color.Bright}${Color.Green}════════════════════════════════════════════════════════════════════════════════${Color.Reset}\n`);
    return true;
  } catch (error) {
    console.error(`\n${Color.Bright}${Color.Red}❌ KIỂM THỬ THẤT BẠI (TEST FAILED):${Color.Reset}`, error);
    process.exit(1);
  }
}

// Chạy trực tiếp từ dòng lệnh CLI
if (require.main === module) {
  runAllLabs();
}

module.exports = {
  NodeState,
  RaftNode,
  RaftConsensusSimulator,
  ConsistentHashingRing,
  runAllLabs
};
