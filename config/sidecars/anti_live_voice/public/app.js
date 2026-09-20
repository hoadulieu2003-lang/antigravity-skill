/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANTI LIVE VOICE — MAIN CLIENT CONTROLLER
 * 60 FPS Canvas Orb Visualizer, WebSocket Session Management & Audio Pipeline
 * ════════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const orbCanvas = document.getElementById('orbCanvas');
  const transcriptText = document.getElementById('transcriptText');
  const btnVoice = document.getElementById('btnVoice');
  const btnMute = document.getElementById('btnMute');
  const btnSettings = document.getElementById('btnSettings');
  const settingsModal = document.getElementById('settingsModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const formSettings = document.getElementById('formSettings');
  const inputApiKey = document.getElementById('inputApiKey');
  const selectVoice = document.getElementById('selectVoice');
  const localIpText = document.getElementById('localIpText');

  // Application State
  let ws = null;
  let isSessionActive = false;
  let isMuted = false;
  let currentVolume = 0;
  let targetVolume = 0;
  let activeSpeaker = 'none'; // 'user' | 'gemini' | 'none'
  let serverConfig = { hasApiKey: false, defaultVoice: 'Puck', localIp: '127.0.0.1' };

  // Audio Engines
  const recorder = new AntiAudioRecorder({
    onAudioData: (base64) => {
      if (ws && ws.readyState === WebSocket.OPEN && isSessionActive && !isMuted) {
        ws.send(JSON.stringify({ type: 'audio', data: base64 }));
      }
    },
    onVolume: (vol) => {
      if (isSessionActive && !isMuted && vol > 0.05) {
        activeSpeaker = 'user';
        targetVolume = vol;
      }
    }
  });

  const player = new AntiAudioPlayer({
    onVolume: (vol) => {
      if (isSessionActive && vol > 0.02) {
        activeSpeaker = 'gemini';
        targetVolume = vol;
        updateStatus('speaking', 'Anti đang trả lời...');
      } else if (activeSpeaker === 'gemini' && vol <= 0.02) {
        activeSpeaker = 'none';
        updateStatus('listening', 'Đang lắng nghe Anh...');
      }
    }
  });

  // 1. Khởi tạo Canvas Orb Sóng Âm 60 FPS
  const ctx = orbCanvas.getContext('2d');
  let animationFrameId = null;
  let orbPhase = 0;

  function resizeCanvas() {
    const rect = orbCanvas.getBoundingClientRect();
    orbCanvas.width = rect.width * window.devicePixelRatio;
    orbCanvas.height = rect.height * window.devicePixelRatio;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawOrb() {
    // Làm mượt âm lượng hiện tại theo targetVolume
    currentVolume += (targetVolume - currentVolume) * 0.2;
    if (activeSpeaker === 'none') {
      targetVolume = 0;
    }

    const w = orbCanvas.width;
    const h = orbCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = Math.min(w, h) * 0.28;

    ctx.clearRect(0, 0, w, h);

    orbPhase += 0.03;

    // Vòng phát sáng ngoài (Outer Glow)
    const glowRadius = baseRadius + currentVolume * 60;
    const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, glowRadius * 1.4);

    if (activeSpeaker === 'gemini') {
      // Sóng màu xanh dương khi Gemini đang nói
      glowGrad.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
      glowGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.2)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else if (activeSpeaker === 'user') {
      // Sóng màu xanh ngọc lục bảo khi Anh đang nói
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      glowGrad.addColorStop(0.6, 'rgba(52, 211, 153, 0.2)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      // Trạng thái chờ thở nhẹ nhàng
      const breath = Math.sin(orbPhase) * 0.08;
      glowGrad.addColorStop(0, `rgba(37, 99, 235, ${0.15 + breath})`);
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }

    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowRadius * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Quả cầu trung tâm (Core Gradient Orb)
    const coreGrad = ctx.createLinearGradient(
      cx - baseRadius, cy - baseRadius,
      cx + baseRadius, cy + baseRadius
    );

    if (activeSpeaker === 'gemini') {
      coreGrad.addColorStop(0, '#3B82F6');
      coreGrad.addColorStop(0.5, '#06B6D4');
      coreGrad.addColorStop(1, '#8B5CF6');
    } else if (activeSpeaker === 'user') {
      coreGrad.addColorStop(0, '#10B981');
      coreGrad.addColorStop(0.5, '#059669');
      coreGrad.addColorStop(1, '#3B82F6');
    } else {
      coreGrad.addColorStop(0, '#2563EB');
      coreGrad.addColorStop(1, '#1D4ED8');
    }

    // Hiệu ứng biến dạng sóng âm đa thùy (Morphing Waveform)
    ctx.beginPath();
    const numPoints = 64;
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const wave = Math.sin(angle * 4 + orbPhase * 2) * (currentVolume * 22) +
                   Math.cos(angle * 6 - orbPhase) * (currentVolume * 12);
      const r = baseRadius + wave;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = 'rgba(37, 99, 235, 0.35)';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;

    animationFrameId = requestAnimationFrame(drawOrb);
  }

  drawOrb();

  // 2. Cập nhật giao diện trạng thái
  function updateStatus(state, message) {
    statusBadge.className = `status-badge ${state}`;
    statusText.textContent = message;
  }

  // 3. Nạp cấu hình từ Server
  async function fetchConfig() {
    try {
      const res = await fetch('/api/config');
      serverConfig = await res.json();
      if (localIpText) {
        localIpText.textContent = `http://${serverConfig.localIp}:${serverConfig.port}`;
      }
      if (selectVoice) {
        selectVoice.value = serverConfig.defaultVoice || 'Puck';
      }
      if (!serverConfig.hasApiKey) {
        updateStatus('idle', 'Cần nhập Google AI Studio API Key');
        openSettingsModal();
      } else {
        updateStatus('idle', 'Sẵn sàng đàm thoại trực tiếp');
      }
    } catch (e) {
      console.error('Không thể lấy cấu hình server:', e);
    }
  }
  fetchConfig();

  // 4. Kết nối WebSocket và Bắt Đầu Phiên Đàm Thoại
  async function startSession() {
    if (!serverConfig.hasApiKey) {
      openSettingsModal();
      return;
    }

    try {
      updateStatus('connecting', 'Đang kết nối tới Gemini Live...');
      btnVoice.classList.add('active');

      // Khởi động Micro
      await recorder.start();

      // Kết nối WebSocket nội bộ tới Gateway
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        // Gửi thông điệp khởi tạo
        ws.send(JSON.stringify({
          type: 'init',
          voice: selectVoice ? selectVoice.value : serverConfig.defaultVoice
        }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'ready') {
            isSessionActive = true;
            updateStatus('listening', 'Đang lắng nghe Anh...');
            transcriptText.textContent = 'Em đang lắng nghe, Anh cứ nói tự nhiên nhé...';
          }

          if (msg.type === 'audio') {
            player.playChunk(msg.data);
          }

          if (msg.type === 'text') {
            transcriptText.textContent = msg.text;
          }

          if (msg.type === 'interrupted') {
            // Phát hiện Anh ngắt lời (Barge-in)! Dừng phát ngay lập tức
            player.stopAll();
            activeSpeaker = 'user';
            updateStatus('listening', 'Anh đang nói...');
          }

          if (msg.type === 'turn_complete') {
            activeSpeaker = 'none';
            updateStatus('listening', 'Đang lắng nghe Anh...');
          }

          if (msg.type === 'error') {
            alert(msg.message);
            stopSession();
          }

        } catch (err) {
          console.error('Lỗi nhận dữ liệu WebSocket:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('Lỗi WebSocket:', err);
        stopSession();
      };

      ws.onclose = () => {
        stopSession();
      };

    } catch (err) {
      alert(`Lỗi cấp quyền Micro hoặc khởi động: ${err.message}`);
      stopSession();
    }
  }

  // 5. Dừng Phiên Đàm Thoại
  function stopSession() {
    isSessionActive = false;
    btnVoice.classList.remove('active');
    activeSpeaker = 'none';

    recorder.stop();
    player.stopAll();

    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'disconnect' }));
        ws.close();
      }
      ws = null;
    }

    updateStatus('idle', 'Sẵn sàng đàm thoại trực tiếp');
    transcriptText.textContent = 'Bấm micro để bắt đầu nói chuyện cùng Anti';
  }

  // Sự kiện Nút Micro Chính
  btnVoice.addEventListener('click', () => {
    if (isSessionActive) {
      stopSession();
    } else {
      startSession();
    }
  });

  // Sự kiện Nút Tắt/Bật Micro Nhanh (Mute)
  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    btnMute.style.color = isMuted ? 'var(--brand-red)' : 'var(--text-secondary)';
    btnMute.style.borderColor = isMuted ? 'var(--brand-red)' : 'var(--border-light)';
  });

  // Quản lý Modal Cài Đặt
  function openSettingsModal() {
    settingsModal.classList.add('open');
  }
  function closeSettingsModal() {
    settingsModal.classList.remove('open');
  }

  btnSettings.addEventListener('click', openSettingsModal);
  btnCloseModal.addEventListener('click', closeSettingsModal);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettingsModal();
  });

  // Lưu Cài Đặt
  formSettings.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apiKey = inputApiKey.value.trim();
    const voice = selectVoice.value;

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiApiKey: apiKey, defaultVoice: voice })
      });
      const data = await res.json();
      if (data.success) {
        serverConfig.hasApiKey = true;
        serverConfig.defaultVoice = voice;
        closeSettingsModal();
        updateStatus('idle', 'Đã lưu cấu hình thành công!');
        inputApiKey.value = '';
      }
    } catch (err) {
      alert(`Lỗi lưu cấu hình: ${err.message}`);
    }
  });
});
