const fs = require('fs');
const r = JSON.parse(fs.readFileSync('tests/challenger_2_empirical_results.json'));

console.log('=== OPTION A CONTRAST RATIOS ===');
r.option_a.contrastEval.results.forEach(c => {
  console.log(`${c.ratio.toFixed(2)}:1 (req ${c.required}:1) | ${c.passes ? 'PASS' : 'FAIL'} | ${c.selector} | "${c.text}" [fg:${c.fg} bg:${c.bg}]`);
});

console.log('\n=== OPTION B CONTRAST RATIOS ===');
r.option_b.contrastEval.results.forEach(c => {
  console.log(`${c.ratio.toFixed(2)}:1 (req ${c.required}:1) | ${c.passes ? 'PASS' : 'FAIL'} | ${c.selector} | "${c.text}" [fg:${c.fg} bg:${c.bg}]`);
});
