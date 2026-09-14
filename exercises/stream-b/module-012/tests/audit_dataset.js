const fs = require('fs');

const CANONICAL = [
  { id: 'T01', tour: 'Hạ Long 2N1Đ', departure: '14/09/2026 07:30', assignee: 'Lan', status: 'Chờ đối tác', note: 'Khách sạn chưa xác nhận 4 phòng' },
  { id: 'T02', tour: 'Ninh Bình 1 ngày', departure: '14/09/2026 06:00', assignee: 'Minh', status: 'Sẵn sàng', note: 'Đã đủ xe, hướng dẫn viên và danh sách khách' },
  { id: 'T03', tour: 'Sapa 3N2Đ', departure: '15/09/2026 21:30', assignee: 'Huy', status: 'Thiếu hồ sơ', note: '2 khách chưa gửi CCCD' },
  { id: 'T04', tour: 'Đà Nẵng 4N3Đ', departure: '16/09/2026 08:00', assignee: 'Lan', status: 'Đang chuẩn bị', note: 'Chờ chốt danh sách suất ăn' },
  { id: 'T05', tour: 'Hà Giang 3N2Đ', departure: '17/09/2026 05:30', assignee: 'Minh', status: 'Sẵn sàng', note: 'Đã hoàn tất checklist khởi hành' },
  { id: 'T06', tour: 'Phú Quốc 3N2Đ', departure: '18/09/2026 09:10', assignee: 'Huy', status: 'Chờ đối tác', note: 'Nhà xe trung chuyển chưa xác nhận' },
  { id: 'T07', tour: 'Mộc Châu 2N1Đ', departure: '19/09/2026 06:30', assignee: 'Lan', status: 'Đang chuẩn bị', note: 'Đang rà soát danh sách phòng' },
  { id: 'T08', tour: 'Huế 3N2Đ', departure: '12/09/2026 07:00', assignee: 'An', status: 'Hoàn thành', note: 'Đoàn đã khởi hành và bàn giao nhật ký' }
];

const r = JSON.parse(fs.readFileSync('tests/challenger_2_empirical_results.json'));

function auditDataset(name, extracted) {
  console.log(`\n=== DATASET AUDIT FOR ${name.toUpperCase()} ===`);
  console.log(`Extracted tours count: ${extracted.length}`);
  
  CANONICAL.forEach(c => {
    const found = extracted.find(e => e.id === c.id);
    if (!found) {
      console.error(`[FAIL] Missing tour ID: ${c.id}`);
      return;
    }

    const tMatch = found.tour === c.tour;
    const dMatch = found.departure === c.departure;
    const aMatch = found.assignee === c.assignee;
    const sMatchExact = found.status === c.status;
    const sMatchCaseInsensitive = found.status.toLowerCase() === c.status.toLowerCase();
    const nMatch = found.note === c.note;

    console.log(`[${c.id}]`);
    console.log(`  Tour: "${found.tour}" vs "${c.tour}" -> ${tMatch ? 'EXACT' : 'MISMATCH'}`);
    console.log(`  Departure: "${found.departure}" vs "${c.departure}" -> ${dMatch ? 'EXACT' : 'MISMATCH'}`);
    console.log(`  Assignee: "${found.assignee}" vs "${c.assignee}" -> ${aMatch ? 'EXACT' : 'MISMATCH'}`);
    console.log(`  Status: "${found.status}" vs "${c.status}" -> exact:${sMatchExact}, case-insensitive:${sMatchCaseInsensitive}`);
    console.log(`  Note: "${found.note}" vs "${c.note}" -> ${nMatch ? 'EXACT' : 'MISMATCH'}`);
  });
}

auditDataset('Option A', r.option_a.dataParityEval.extractedTours);
auditDataset('Option B', r.option_b.dataParityEval.extractedTours);
