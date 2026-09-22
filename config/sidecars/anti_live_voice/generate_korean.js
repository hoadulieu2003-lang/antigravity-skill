const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY || '';
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=' + apiKey;

const payload = {
  contents: [{
    parts: [{
      text: '안녕하세요! 저는 안티그래비티입니다. 구글 제미나이 AI로 직접 생성된 한국어 음성입니다. 만나서 반가워요, 좋은 하루 되세요!'
    }]
  }],
  generationConfig: {
    responseModalities: ['AUDIO'],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'Kore'
        }
      }
    }
  }
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(data => {
  if (data.error) {
    console.error('ERROR:', JSON.stringify(data.error));
    return;
  }
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const rawPcm = Buffer.from(part.inlineData.data, 'base64');
      
      // Tạo WAV header 44 bytes cho 24kHz Mono 16-bit
      const wavHeader = Buffer.alloc(44);
      const dataLen = rawPcm.length;
      const fileLen = dataLen + 36;
      const sampleRate = 24000;
      const byteRate = sampleRate * 2; // 1 channel * 2 bytes
      
      wavHeader.write('RIFF', 0);
      wavHeader.writeUInt32LE(fileLen, 4);
      wavHeader.write('WAVE', 8);
      wavHeader.write('fmt ', 12);
      wavHeader.writeUInt32LE(16, 16); // Subchunk1Size
      wavHeader.writeUInt16LE(1, 20);  // AudioFormat (PCM)
      wavHeader.writeUInt16LE(1, 22);  // NumChannels (Mono)
      wavHeader.writeUInt32LE(sampleRate, 24);
      wavHeader.writeUInt32LE(byteRate, 28);
      wavHeader.writeUInt16LE(2, 32);  // BlockAlign
      wavHeader.writeUInt16LE(16, 34); // BitsPerSample
      wavHeader.write('data', 36);
      wavHeader.writeUInt32LE(dataLen, 40);
      
      const wavBuffer = Buffer.concat([wavHeader, rawPcm]);
      
      const outPath = path.join(__dirname, 'public', 'korean_voice_sample.wav');
      const brainPath = path.join('C:\\Users\\game\\.gemini\\antigravity\\brain\\6f46af53-7f44-46a4-83e9-d518ccfc6f9f', 'korean_voice_sample.wav');
      
      fs.writeFileSync(outPath, wavBuffer);
      fs.writeFileSync(brainPath, wavBuffer);
      console.log('SUCCESS: Korean voice generated, size:', wavBuffer.length);
    }
  }
})
.catch(err => console.error(err));
