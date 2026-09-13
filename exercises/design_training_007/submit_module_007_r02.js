const http = require('http');
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const zipPath = path.join(baseDir, 'design_training_007_submission_r02.zip').replace(/\\/g, '/');

const messageText = `SUBMISSION_ID: DESIGN_TRAINING_007_REPAIR_001
PACKAGE: design_training_007_submission_r02.zip
SHA256: 73201ed564fe14a3f02691303108aa0bd399556184b7b94132baa8a70dedc2d2

REPAIR_STATUS:
  F01_DATA_AND_AUDIT_TRAIL: CLOSED
  F02_IA_SEPARATION: CLOSED
  F03_STABLE_ACTION_FSM: CLOSED
  F04_CRITIQUE_SCOPE: CLOSED
  F05_VERIFICATION_AND_A11Y: CLOSED

GATES:
  G01: SELF_CHECK_PASS
  G02: SELF_CHECK_PASS
  G03: SELF_CHECK_PASS
  G04: SELF_CHECK_PASS
  G05: SELF_CHECK_PASS
  G06: SELF_CHECK_PASS
  G07: SELF_CHECK_PASS
  G08: SELF_CHECK_PASS

ASSERTIONS:
  passed: 14
  total: 14
  overall: SELF_CHECK_PASS

OPEN_RISKS:
  - none

BÁO CÁO GIẢI TRÌNH CHI TIẾT SỬA CHỮA ĐỢT 1/2 (REPAIR ROUND 1):

1. F01 — Dữ Liệu Nghiệp Vụ & Bảng Đối Soát (Data & Audit Trail):
   - Đã khôi phục chính xác 8 tuple canonical chuẩn của TRIPFLOW tại mốc 18:00 13/09/2026 ICT trong cả source code (baseline/candidate) và bảng Markdown Mục 3 của Báo cáo.
   - Toàn bộ liên kết tệp đã được chuẩn hoá sang đường dẫn tương đối (ví dụ: ./DESIGN_CONTRACT.yaml), không còn sót bất kỳ đường dẫn Windows tuyệt đối nào.

2. F02 — Phân Tách Cấu Trúc Thông Tin Rạch Ròi (IA Separation):
   - Tách bạch hoàn toàn giữa:
     * Tầng 1 (Primary Workflow Navigation): Dãy nút phân đoạn "Tất cả", "Cần xử lý" (T01, T03, T06), "Đang chuẩn bị" (T04, T07), "Sẵn sàng" (T02, T05), "Đã hoàn thành" (T08).
     * Tầng 2 (Faceted Attribute Filters): Bộ lọc độc lập "Thời gian: Tất cả | Trong 48 giờ" và "Phụ trách: Tất cả | Lan | Minh | Huy | An".
   - Phép giao AND logic: Chọn "Cần xử lý" + "Huy" + query "nha xe" trả về chính xác duy nhất T06.
   - Đã bổ sung 2 bảng so sánh thực thể giữa Phương án A và Phương án B kèm ma trận đánh giá hiệu suất qua 3 kịch bản truy xuất thực tế.

3. F03 — Máy Trạng Thái Nút Tác Vụ Ổn Định Duy Nhất (Single Stable Action Element FSM):
   - Hợp nhất nút xử lý thành một phần tử DOM duy nhất (#btn-save-contact-note trên candidate và #btn-submit-contact trên baseline).
   - FSM chuyển đổi nhãn nút tại chỗ: "Lưu nhật ký" -> "Đang lưu nhật ký…" (disabled=true) -> "Thử lưu lại" (disabled=false, focus giữ tại nút) -> "Đang lưu nhật ký…" -> "Lưu nhật ký".
   - Cơ chế không chiếm đoạt con trỏ (no focus stealing on success): Focus giữ nguyên trên nút sau khi commit thành công, không tự ý nhảy về textarea hay phần tử khác.
   - Khóa chặt trạng thái nghiệp vụ: T01 vẫn duy trì trạng thái "Chờ đối tác" sau khi ghi nhật ký liên hệ thành công.

4. F04 — Giới Hạn Phạm Vi Phản Biện & Hai Thay Đổi Tối Đa (Critique Scope):
   - Đã áp dụng Common Compliance Patch (chống tràn search, target size 44px, FSM stable button, phân tầng IA) lên cả baseline, pre_critique và candidate trước.
   - Khóa hash mới: Baseline (261473702844d553...), Pre-Critique (0b32ef205e508c6e...), Candidate Final (82b214323619d7b6...).
   - Diff giữa candidate/pre_critique.html và candidate/index.html chỉ chứa DUY NHẤT 2 thay đổi thiết kế phục vụ single hypothesis:
     (1) Tái cấu trúc grid mobile (.ledger-item) thành 50px 1fr auto để neo nút Chi tiết ở hàng 1;
     (2) Thêm biểu tượng icon ngữ nghĩa (⚠️, ⏳, ✓) vào hộp thông báo FSM.
   - Đo đạc định lượng chiều cao cuộn trên mobile 390px: Pre-Critique (2950px) -> Final (2480px), giảm chính xác 470px (-15.93%).
   - Cập nhật mức độ tin cậy tri thức thành EXERCISE_SUPPORTED.
   - Bổ sung ảnh pre_critique_mobile_390x844.png (tổng cộng 12 ảnh thực nghiệm).

5. F05 — Khắc Phục Khả Năng Tiếp Cận & Harness Kiểm Thử:
   - Target size: Gỡ bỏ override 40px trên mobile; toàn bộ 20 nút/control tương tác trên cả 2 màn hình và empty state đều đạt >= 44x44 CSS px (đo thực tế bằng getBoundingClientRect() tại 390px, targetSizesPass = true).
   - Portability: Script verify_module_007.js tự động fallback require puppeteer-core, sử dụng __dirname tương đối, nhận port từ CLI hoặc process.env.CDP_PORT.
   - T10 Duplicate Guard: Dispatch đồng thời pointer click và native Enter trong lúc saving; assert attemptCount === 1, commitCount === 0.
   - T11 Native Keyboard: Log chi tiết 19 bước Tab/Enter/Shift+Tab, 0 bước rơi focus về BODY, hoàn trả focus chính xác về #btn-detail-T01.
   - T12: Quét computed style toàn bộ 189 phần tử DOM (zero motion 100%), độ tương phản từ 4.76:1 đến 17.85:1, 0 tràn ngang trên 3 viewports.
   - T14: So sánh sâu cấu trúc dữ liệu, counters, message strings và focus giữa baseline và candidate.
   - Overall Verdict: Phép hội logic conjunction nghiêm ngặt của toàn bộ T01–T14 -> PASS (exit code 0).

6. Gói Nộp Chuẩn Mực:
   - Tên gói: design_training_007_submission_r02.zip (2,211,767 bytes, pure forward slashes '/').
   - Đầy đủ 11 hạng mục bao gồm cả DESIGN_TRAINING_007_REVIEW_001.md và 12 ảnh chụp màn hình.

Kính đề nghị Architectural Controller (ChatGPT) xem xét và tiến hành thẩm định nghiệm thu độc lập cho đợt sửa chữa Repair Round 1!`;

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

  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const attached = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `document.body.innerText.includes('design_training_007_submission_r02.zip')`,
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
                  document.querySelector('button[aria-label*="Gửi"]') ||
                  document.querySelector('button[data-testid="fruitjuice-send-button"]');
      if (btn && !btn.disabled) {
        btn.focus();
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        btn.click();
        return true;
      }
      return false;
    })()`,
    returnByValue: true
  });
  console.log('[SEND] Click result:', sendRes.result?.value);

  // If click didn't trigger, try pressing Enter on textarea
  await new Promise(r => setTimeout(r, 1000));
  const checkGen = await sendCdp(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('button[aria-label*="Stop generating"], button[data-testid="stop-button"]') !== null`,
    returnByValue: true
  });

  if (!checkGen.result?.value) {
    console.log('[SEND] Re-triggering via Keyboard Enter on prompt-textarea...');
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('prompt-textarea');
        if (el) {
          el.focus();
          el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        }
      })()`,
      returnByValue: true
    });
  }

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

    if (status.hasNew && !status.isGenerating && status.fullTextLength > 100) {
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
    const reviewPath = path.join(baseDir, 'DESIGN_TRAINING_007_REVIEW_002.md');
    fs.writeFileSync(reviewPath, finalReplyText, 'utf8');
    console.log('[SAVED REVIEW] Review saved to DESIGN_TRAINING_007_REVIEW_002.md, length:', finalReplyText.length);
    console.log(finalReplyText.slice(0, 1000));
  }

  ws.close();
  process.exit(0);
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
