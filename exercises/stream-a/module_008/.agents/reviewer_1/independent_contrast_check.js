const fs = require('fs');

function srgbLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(hex1, hex2) {
  const l1 = srgbLuminance(hex1);
  const l2 = srgbLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  { id: 'PAIR-01', desc: 'Text Primary on Canvas (Option A/Candidate)', fg: '#0F172A', bg: '#FAF9F6', req: 4.5 },
  { id: 'PAIR-02', desc: 'Text Secondary on Canvas (Option A/Candidate)', fg: '#475569', bg: '#FAF9F6', req: 4.5 },
  { id: 'PAIR-03', desc: 'Brand Primary on White (Option B)', fg: '#3730A3', bg: '#FFFFFF', req: 4.5 },
  { id: 'PAIR-04', desc: 'Focus Ring on Slate Canvas (Option B)', fg: '#2563EB', bg: '#F8FAFC', req: 3.0 },
  { id: 'PAIR-05', desc: 'Focus Ring on Alabaster Canvas (Option A/Cand)', fg: '#D97706', bg: '#FAF9F6', req: 3.0 },
  { id: 'PAIR-06', desc: 'Attention Badge Text on Bg (Option A/Cand)', fg: '#B45309', bg: '#FEF3C7', req: 4.5 },
  { id: 'PAIR-07', desc: 'Error Badge Text on Bg (Option A/Cand)', fg: '#BE123C', bg: '#FFE4E6', req: 4.5 },
  { id: 'PAIR-08', desc: 'Success Badge Text on Bg (Option A/Cand)', fg: '#15803D', bg: '#DCFCE7', req: 4.5 },
  { id: 'PAIR-09', desc: 'Attention Badge Text on Bg (Option B)', fg: '#9A3412', bg: '#FFEDD5', req: 4.5 },
  { id: 'PAIR-10', desc: 'Error Badge Text on Bg (Option B)', fg: '#9F1239', bg: '#FFE4E6', req: 4.5 },
  { id: 'PAIR-11', desc: 'Success Badge Text on Bg (Option B)', fg: '#115E59', bg: '#CCFBF1', req: 4.5 },
  { id: 'PAIR-12', desc: 'Normal Badge Text on Bg (Option B)', fg: '#1E293B', bg: '#E2E8F0', req: 4.5 },
  { id: 'PAIR-13', desc: 'Normal Badge Text on Bg (Option A/Cand)', fg: '#475569', bg: '#F1F5F9', req: 4.5 },
  { id: 'PAIR-14', desc: 'Focus Ring on White (Option A/Cand)', fg: '#D97706', bg: '#FFFFFF', req: 3.0 },
  { id: 'PAIR-15', desc: 'Focus Ring on White (Option B)', fg: '#2563EB', bg: '#FFFFFF', req: 3.0 }
];

let allPass = true;
pairs.forEach(p => {
  const cr = contrast(p.fg, p.bg);
  const pass = cr >= p.req;
  if (!pass) allPass = false;
  console.log(`${p.id} | ${p.desc.padEnd(46)} | fg: ${p.fg} on bg: ${p.bg} | CR: ${cr.toFixed(4)}:1 | req: >=${p.req}:1 | ${pass ? 'PASS' : 'FAIL'}`);
});
console.log('Independent contrast calculation result: All pass?', allPass);
