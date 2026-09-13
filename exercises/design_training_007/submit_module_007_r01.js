const http = require('http');
const fs = require('fs');

const zipPath = 'C:/Users/game/.gemini/exercises/design_training_007/design_training_007_submission_r01.zip';

const messageText = `BÀN GIAO NGHIỆM THU: DESIGN_TRAINING_007 — Rev 001
Mã nộp: DESIGN_TRAINING_007_SUBMISSION_R01
Gói nộp: design_training_007_submission_r01.zip
SHA-256: 71c7eb9c8f80801ffb56eb6337709cbb74c6a2311c5c30bc4c947ee83b8d7f57

1. Hướng IA đã chọn và lý do:
   - Phương án B (Theo luồng xử lý nghiệp vụ): "Tất cả", "Cần xử lý" (T01, T03, T06), "Trong 48 giờ" (T01, T02), "Sẵn sàng" (T02, T05), "Đã hoàn thành" (T08).
   - Lý do: Tối ưu hoá năng suất của điều hành viên (dispatch operator) để xử lý ngay lập tức các tour có nguy cơ vỡ hợp đồng/thiếu đối tác trong ngày thay vì lọc tuần tự theo ngày tháng.

2. Hướng Art Direction đã chọn và hai đánh đổi:
   - Hướng A — Dispatch Ledger (Sổ Điều Phối Hành Trình). Bảng màu sáng Warm Paper #FAF9F6, đường kẻ hairline 1px solid #E2E8F0, chữ than đen Obsidian #0F172A (tương phản 17.85:1), điểm nhấn hổ phách Terracotta Amber #D97706 cho tiêu điểm khẩn cấp T01.
   - Đánh đổi 1: Mật độ dữ liệu cao hơn (compact ledger) đòi hỏi kỷ luật nhịp điệu 2 dòng chặt chẽ trên mobile (< 480px).
   - Đánh đổi 2: Cần bố trí nhãn nhịp điệu cột rõ ràng để tránh hiểu nhầm giữa giờ khởi hành và giờ quy chiếu.

3. Kết quả critique: hypothesis, hai thay đổi tối đa, quyết định:
   - Baseline vòng critique: pre_critique.html (SHA-256: a90bbc8c3440bd8461dce45106e6e84336d2a4932d592e833c2818f86ffd17e2).
   - Phân loại: Strength (khối tiêu điểm T01 màn hình đầu giúp định hướng thị giác tức thì), Defect (trên mobile < 480px nút Chi tiết rơi xuống dòng 3 block full-width làm vỡ nhịp điệu 2 dòng), Trade-off (giữ problem snippet ở cột tour).
   - Single Hypothesis: "Nếu tinh chỉnh CSS layout mobile (< 480px) thành lưới 50px 1fr auto để nút Chi tiết neo ở góc trên bên phải dòng 1 và bổ sung biểu tượng icon ngữ nghĩa cho hộp trạng thái FSM, giao diện sẽ đạt nhịp điệu 2 dòng chuẩn mực (CAPSTONE-002) và tăng cường nhận biết không phụ thuộc màu sắc."
   - 2 thay đổi tối đa: (1) Tái cấu trúc grid layout mobile trong candidate/index.html thành 50px 1fr auto; (2) Tinh chỉnh hộp phản hồi FSM với biểu tượng ngữ nghĩa và kiểu chữ rõ ràng.
   - Quyết định: ADOPT (chấp thuận vào Candidate Final).

4. Kết quả T01–T14:
   - T01: PASS (đủ 8 tour, T08 nguyên vẹn, T01 có tiêu điểm và đường dẫn toàn danh sách)
   - T02: PASS (tìm tiếng Việt không dấu "KHACH SAN" khớp duy nhất T01)
   - T03: PASS (giao thoa: Cần xử lý -> 3 tour; Huy -> 2 tour; nhaxe -> T06)
   - T04: PASS (Trong 48 giờ dựa trên mốc cố định 18:00 13/09/2026 -> T01, T02)
   - T05: PASS (query rỗng xyz -> empty state; xoá bộ lọc -> 8 tour, focus search)
   - T06: PASS (mở T03 -> back về ledger; bộ lọc giữ nguyên; focus hoàn trả #btn-detail-T03)
   - T07: PASS (submit rỗng & > 160 ký tự -> báo lỗi, focus textarea, attemptCount = 0)
   - T08: PASS (submit lần 1 -> saving 800ms, error đúng nội dung, draft nguyên vẹn, attemptCount = 1, commitCount = 0)
   - T09: PASS (click Thử lưu lại -> saving 800ms, success, history cập nhật, attemptCount = 2, commitCount = 1, status T01 giữ nguyên)
   - T10: PASS (duplicate guard chặn click/enter trong lúc saving)
   - T11: PASS (native keyboard journey 16 bước Tab/Enter trên mobile 390x844 không rơi focus về body, focus hoàn trả #btn-detail-T01)
   - T12: PASS (3 viewports 1440/768/390 không tràn ngang; contrast 4.76:1 - 17.85:1; zero motion 183/183 elements)
   - T13: PASS (nhập <b>Đã gọi & "xác nhận"</b> -> hiển thị text thô an toàn, không parse HTML)
   - T14: PASS (parity baseline/candidate tương đương 100% về dữ liệu, outcome và lỗi)
   - Tổng verdict tự tính: PASS | self_assessment: READY_FOR_CONTROLLER_REVIEW

5. Điểm chưa chắc chắn / giới hạn bằng chứng:
   - Để triệt tiêu 100% nguy cơ tràn ngang trên mobile hẹp, thanh search và nút Xoá bộ lọc được xếp dọc (flex-direction: column), chiếm thêm ~50px chiều cao màn hình.
   - FSM giả lập trễ mạng 800ms và lỗi lần đầu chạy trên in-memory state machine phía client, chưa kết nối backend server thực tế.

6. Danh sách tài sản trong ZIP (design_training_007_submission_r01.zip — 1605.7 KB, pure forward slash /):
   - baseline/index.html (SHA-256: 377b4572f62c607c76ac8bad2a771dfe634cb874a0521402005daa518dc75958)
   - directions/option_a.html (Direction A — Dispatch Ledger)
   - directions/option_b.html (Direction B — Departure Board)
   - candidate/pre_critique.html (SHA-256: a90bbc8c3440bd8461dce45106e6e84336d2a4932d592e833c2818f86ffd17e2)
   - candidate/index.html (SHA-256: 5b9672066670df1db8bb5e8dd4ebb051f39d2abd175ed36cc35e6bca4c777913)
   - DESIGN_CONTRACT.yaml (Hợp đồng thiết kế với semantic tokens, typography scale, carbon spacing, locked zero motion)
   - DESIGN_TRAINING_007_DIRECTIVE.md (Chỉ thị chuẩn)
   - DESIGN_TRAINING_007_REPORT.md (Báo cáo nghiệm thu đầy đủ 14 mục)
   - CHANGE_LEDGER.md (Nhật ký biến đổi 3 giai đoạn)
   - VERIFICATION.json (Bằng chứng kiểm thử tự động, verdict: PASS)
   - verify_module_007.js (Script kiểm thử tự động độc lập qua CDP)
   - screenshots/ (10 ảnh chụp màn hình DPR=2 thực tế theo đúng danh mục)

Kính đề nghị Controller (ChatGPT) xem xét và tiến hành thẩm định nghiệm thu độc lập cho Capstone Module 007!`;

async function getPageWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const list = JSON.parse(data);
        const p = list.find(item => item.url && item.url.includes('chatgpt.com'));
        if (!p) return reject(new Error('ChatGPT tab not found on port 9222'));
        resolve(p.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const timer = setTimeout(() => reject(new Error('CDP timeout for ' + method)), 15000);
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const wsUrl = await getPageWsUrl();
  console.log('[CONNECT] WebSocket URL:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);
  console.log('[CONNECTED] Connected to ChatGPT CDP session.');

  // 1. Enable DOM
  await sendCdp(ws, 'DOM.enable');
  const doc = await sendCdp(ws, 'DOM.getDocument');
  const fileInput = await sendCdp(ws, 'DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: 'input[type="file"]'
  });

  console.log('[UPLOAD] File input nodeId:', fileInput.nodeId);
  await sendCdp(ws, 'DOM.setFileInputFiles', {
    files: [zipPath],
    nodeId: fileInput.nodeId
  });
  console.log('[UPLOAD] File assigned to input[type=file]. Waiting for card attachment...');

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const attached = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `document.body.innerText.includes('design_training_007_submission_r01.zip')`,
      returnByValue: true
    });
    if (attached.result?.value) {
      console.log(`[UPLOAD] ✓ File card appeared after ${i+1}s!`);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2500));

  // 2. Paste messageText into prompt-textarea
  console.log('[INPUT] Pasting message text into #prompt-textarea...');
  await sendCdp(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('prompt-textarea');
      if (!el) return false;
      el.focus();
      const dt = new DataTransfer();
      dt.setData('text/plain', ${JSON.stringify(messageText)});
      const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
      el.dispatchEvent(ev);
      return true;
    })()`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 2000));

  // 3. Record current assistant message count before send
  const initCountRes = await sendCdp(ws, 'Runtime.evaluate', {
    expression: `document.querySelectorAll('[data-message-author-role="assistant"]').length`,
    returnByValue: true
  });
  const initialAssistantCount = initCountRes.result?.value || 0;
  console.log(`[STATE] Current assistant messages count: ${initialAssistantCount}`);

  // 4. Click Send Button
  console.log('[SEND] Clicking send button...');
  const sendRes = await sendCdp(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[data-testid="send-button"]') ||
                  document.querySelector('button[aria-label*="Send prompt"]') ||
                  document.querySelector('button[aria-label*="Gửi"]');
      if (btn && !btn.disabled) {
        btn.click();
        return true;
      }
      return false;
    })()`,
    returnByValue: true
  });
  console.log('[SEND] Click result:', sendRes.result?.value);

  // 5. Polling for completion
  console.log('[POLL] Waiting for ChatGPT controller review response...');
  let finished = false;
  for (let m = 0; m < 120; m++) {
    await new Promise(r => setTimeout(r, 5000));
    const statusRes = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const msgs = document.querySelectorAll('[data-message-author-role="assistant"]');
        const isGenerating = document.querySelector('button[aria-label*="Stop generating"], button[data-testid="stop-button"]') !== null;
        const lastMsg = msgs[msgs.length - 1];
        const text = lastMsg ? lastMsg.innerText : '';
        return {
          count: msgs.length,
          hasNew: msgs.length > ${initialAssistantCount},
          isGenerating,
          fullTextLength: text.length,
          snippet: text.slice(-200)
        };
      })()`,
      returnByValue: true
    });
    const status = statusRes.result?.value || {};
    console.log(`[WAIT ${m * 5}s] Messages: ${status.count} (new: ${status.hasNew}), Generating: ${status.isGenerating}, Len: ${status.fullTextLength}`);

    if (status.hasNew && !status.isGenerating && status.fullTextLength > 50) {
      console.log('[COMPLETED] ChatGPT has finished generating the review decision!');
      finished = true;
      break;
    }
  }

  if (finished) {
    const finalReplyRes = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const msgs = document.querySelectorAll('[data-message-author-role="assistant"]');
        return msgs[msgs.length - 1].innerText;
      })()`,
      returnByValue: true
    });
    const finalReplyText = finalReplyRes.result?.value || '';
    fs.writeFileSync('C:/Users/game/.gemini/exercises/design_training_007/DESIGN_TRAINING_007_REVIEW_001.md', finalReplyText, 'utf8');
    console.log('[SAVED REVIEW] Review saved to DESIGN_TRAINING_007_REVIEW_001.md, length:', finalReplyText.length);
    console.log(finalReplyText.slice(0, 1000));
  }

  ws.close();
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
