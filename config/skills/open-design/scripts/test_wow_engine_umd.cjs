/**
 * Test UMD bundle loading via CommonJS require
 */
const { createRequire } = require('module');
const fs = require('fs');
const vm = require('vm');

console.log('Testing UMD bundle execution via VM...');

const code = fs.readFileSync(__dirname + '/wow_engine.umd.js', 'utf8');

// Test 1: Node CommonJS environment
const sandboxCjs = {
  exports: {},
  module: { exports: {} },
};
vm.createContext(sandboxCjs);
vm.runInContext(code, sandboxCjs);

const exportedCjs = sandboxCjs.module.exports;
if (!exportedCjs || !exportedCjs.initSpotlight || !exportedCjs.WebAudioHaptics) {
  throw new Error('UMD CommonJS export failed');
}
console.log('✓ CommonJS require(wow_engine.umd.js) exports verified');

// Test 2: Global window environment
const sandboxWindow = {};
sandboxWindow.window = sandboxWindow;
sandboxWindow.globalThis = sandboxWindow;
vm.createContext(sandboxWindow);
vm.runInContext(code, sandboxWindow);

if (!sandboxWindow.WowEngine || !sandboxWindow.initSpotlight || !sandboxWindow.WebAudioHaptics) {
  throw new Error('UMD Window global attachment failed');
}
console.log('✓ Global window.WowEngine verified');
console.log('🎉 All UMD tests passed!');
