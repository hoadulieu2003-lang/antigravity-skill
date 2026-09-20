/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANTI LIVE AUDIO PROCESSOR
 * Handles Web Audio API capture (16kHz PCM) and playback (24kHz PCM)
 * ════════════════════════════════════════════════════════════════════════════
 */

class AntiAudioRecorder {
  constructor(options = {}) {
    this.onAudioData = options.onAudioData || (() => {});
    this.onVolume = options.onVolume || (() => {});
    this.audioContext = null;
    this.mediaStream = null;
    this.processor = null;
    this.source = null;
    this.isRecording = false;
  }

  async start() {
    if (this.isRecording) return;

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
    const inputSampleRate = this.audioContext.sampleRate;
    const targetSampleRate = 16000;

    // Sử dụng ScriptProcessorNode với bufferSize 2048 để tương thích mọi trình duyệt di động
    this.processor = this.audioContext.createScriptProcessor(2048, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);

      // 1. Tính toán âm lượng (RMS Volume) để làm hiệu ứng sóng âm Orb
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.onVolume(Math.min(1.0, rms * 5.0));

      // 2. Hạ mẫu (Downsample) từ inputSampleRate xuống 16000Hz PCM
      const downsampled = this.downsampleBuffer(inputData, inputSampleRate, targetSampleRate);

      // 3. Quy đổi sang Int16 PCM và Base64
      const pcm16 = new Int16Array(downsampled.length);
      for (let i = 0; i < downsampled.length; i++) {
        const s = Math.max(-1, Math.min(1, downsampled[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      const base64Data = this.arrayBufferToBase64(pcm16.buffer);
      this.onAudioData(base64Data);
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
    this.isRecording = true;
  }

  stop() {
    this.isRecording = false;
    if (this.processor && this.source) {
      this.processor.disconnect();
      this.source.disconnect();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.onVolume(0);
  }

  downsampleBuffer(buffer, inputRate, outputRate) {
    if (inputRate === outputRate) return buffer;
    const ratio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const idx = Math.min(Math.floor(i * ratio), buffer.length - 1);
      result[i] = buffer[idx];
    }
    return result;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

class AntiAudioPlayer {
  constructor(options = {}) {
    this.onVolume = options.onVolume || (() => {});
    this.audioContext = null;
    this.sampleRate = 24000;
    this.activeNodes = [];
    this.nextPlayTime = 0;
  }

  initContext() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass({ sampleRate: this.sampleRate });
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playChunk(base64Data) {
    this.initContext();

    // 1. Giải mã Base64 sang Int16Array PCM
    const binary = window.atob(base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);

    // 2. Chuyển sang Float32Array
    const float32 = new Float32Array(int16.length);
    let sum = 0;
    for (let i = 0; i < int16.length; i++) {
      const val = int16[i] / 32768.0;
      float32[i] = val;
      sum += val * val;
    }

    // Tính âm lượng để tạo sóng âm khi Gemini đang nói
    const rms = Math.sqrt(sum / float32.length);
    this.onVolume(Math.min(1.0, rms * 4.0));

    // 3. Tạo AudioBuffer và lên lịch phát mượt mà không bị ngắt quãng
    const audioBuffer = this.audioContext.createBuffer(1, float32.length, this.sampleRate);
    audioBuffer.getChannelData(0).set(float32);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const currentTime = this.audioContext.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime + 0.05; // Đệm 50ms chống giật
    }

    source.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;

    this.activeNodes.push(source);
    source.onended = () => {
      const idx = this.activeNodes.indexOf(source);
      if (idx !== -1) this.activeNodes.splice(idx, 1);
      if (this.activeNodes.length === 0) {
        this.onVolume(0);
      }
    };
  }

  // Cắt ngay lập tức toàn bộ âm thanh cũ khi phát hiện ngắt lời (Barge-in)
  stopAll() {
    for (const node of this.activeNodes) {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    }
    this.activeNodes = [];
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
    this.onVolume(0);
  }
}
