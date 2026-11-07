/**
 * VocaMini - Pronunciation Recorder, Phase 2
 * Offline comparison using the existing recorder and locally decoded waveform.
 * No cloud requests, automatic pronunciation scoring, or audio persistence.
 */
(() => {
  'use strict';

  const MAX_DURATION_MS = 15000;
  const WAITING_TEXT = 'Bản ghi chỉ được giữ tạm trong trình duyệt và không được tải lên máy chủ.';

  class PronunciationRecorder {
    constructor() {
      this.panel = document.getElementById('pron-record-panel');
      this.openButton = document.getElementById('btn-pron-practice');
      this.closeButton = document.getElementById('btn-pron-close');
      this.recordButton = document.getElementById('btn-pron-record');
      this.stopButton = document.getElementById('btn-pron-stop');
      this.clearButton = document.getElementById('btn-pron-clear');
      this.timerElement = document.getElementById('pron-record-timer');
      this.statusElement = document.getElementById('pron-record-status');
      this.targetElement = document.getElementById('pron-record-target');
      this.accentElement = document.getElementById('pron-record-accent');
      this.audioElement = document.getElementById('pron-record-playback');
      this.wordElement = document.getElementById('dict-display-word');
      this.accentSelect = document.getElementById('pron-accent-select');
      this.dictView = document.getElementById('view-dict');
      this.phase = 'idle';
      this.generation = 0;
      this.session = null;
      this.objectUrl = null;
      this.startedAt = 0;
      this.intervalId = null;
      this.timeoutId = null;
      this.currentWord = '';
      this.currentAccent = '';
      this.comparePanel = document.getElementById('pron-compare-panel');
      this.sampleButton = document.getElementById('btn-pron-compare-sample');
      this.selfButton = document.getElementById('btn-pron-compare-self');
      this.retryButton = document.getElementById('btn-pron-compare-retry');
      this.speedSelect = document.getElementById('pron-playback-speed');
      this.compareStatus = document.getElementById('pron-compare-status');
      this.waveform = document.getElementById('pron-user-waveform');
      this.waveMeta = document.getElementById('pron-wave-meta');
      this.asrButton = document.getElementById('btn-pron-asr');
      this.asrResult = document.getElementById('pron-asr-result');
      this.latestBlob = null;
      this.asrController = null;
      this.asrBusy = false;
    }

    init() {
      if (![this.panel, this.openButton, this.recordButton, this.stopButton,
        this.clearButton, this.audioElement, this.wordElement, this.accentSelect].every(Boolean)) {
        console.warn('Pronunciation recorder: missing DOM element');
        return;
      }

      this.openButton.addEventListener('click', () => this.togglePanel());
      this.closeButton.addEventListener('click', () => this.closePanel());
      this.recordButton.addEventListener('click', () => this.start());
      this.stopButton.addEventListener('click', () => this.stop());
      this.clearButton.addEventListener('click', () => this.clear());
      this.sampleButton?.addEventListener('click', () => this.playSample());
      this.selfButton?.addEventListener('click', () => this.playSelf());
      this.retryButton?.addEventListener('click', () => this.start());
      this.asrButton?.addEventListener('click', () => this.recognizeOffline());
      this.speedSelect?.addEventListener('change', () => {
        if (this.audioElement) this.audioElement.playbackRate = Number(this.speedSelect.value) || 1;
      });
      this.accentSelect.addEventListener('change', () => {
        this.cancel();
        this.updateTarget();
        this.message('Đã đổi giọng. Hãy nghe mẫu mới và ghi âm lại.');
      });

      new MutationObserver(() => {
        const nextWord = this.readWord();
        if (nextWord !== this.currentWord) {
          this.cancel();
          this.updateTarget();
          if (!this.panel.hidden) this.message('Từ đã thay đổi. Hãy ghi âm từ mới.');
        }
      }).observe(this.wordElement, { characterData: true, childList: true, subtree: true });

      if (this.dictView) {
        new MutationObserver(() => {
          if (!this.dictView.classList.contains('active')) this.closePanel();
        }).observe(this.dictView, { attributes: true, attributeFilter: ['class'] });
      }

      document.addEventListener('visibilitychange', () => {
        if (document.hidden && (this.phase === 'recording' || this.phase === 'requesting')) {
          this.cancel();
          this.message('Đã hủy ghi âm khi chuyển sang tab khác.');
        }
      });
      window.addEventListener('pagehide', () => this.cancel());

      // Prevent example audio from overlapping a microphone recording.
      const sample = document.getElementById('btn-dict-speak');
      if (sample) sample.addEventListener('click', () => {
        if (this.phase === 'recording' || this.phase === 'requesting') {
          this.cancel();
          this.message('Đã hủy bản ghi để phát âm mẫu.');
        }
      }, { capture: true });

      this.updateTarget();
      this.refreshButtons();
    }

    readWord() {
      const word = this.wordElement.textContent.trim();
      return word === 'Word' ? '' : word;
    }

    updateTarget() {
      this.currentWord = this.readWord();
      this.currentAccent = this.accentSelect.value === 'en-GB' ? 'en-GB' : 'en-US';
      this.targetElement.textContent = this.currentWord || '—';
      this.accentElement.textContent = this.currentAccent === 'en-GB' ? 'Anh–Anh (UK)' : 'Anh–Mỹ (US)';
    }

    togglePanel() {
      if (!this.panel.hidden) return this.closePanel();
      this.updateTarget();
      if (!this.currentWord) {
        this.message('Hãy tra một từ tiếng Anh trước khi luyện phát âm.');
        return;
      }
      this.panel.hidden = false;
      this.openButton.setAttribute('aria-expanded', 'true');
      this.message(WAITING_TEXT);
      this.refreshButtons();
    }

    closePanel() {
      this.cancel();
      this.panel.hidden = true;
      this.openButton.setAttribute('aria-expanded', 'false');
      this.message(WAITING_TEXT);
    }

    message(message) {
      this.statusElement.textContent = message;
    }

    refreshButtons() {
      this.recordButton.disabled = !(this.phase === 'idle' || this.phase === 'ready');
      this.stopButton.disabled = this.phase !== 'recording';
      this.clearButton.disabled = this.phase === 'idle';
      if (this.asrButton) this.asrButton.disabled = this.phase !== 'ready' || !this.latestBlob || this.asrBusy;
    }

    static pickMimeType() {
      const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus'
      ];
      return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
    }

    async start() {
      if (!(this.phase === 'idle' || this.phase === 'ready')) return;
      if (!this.currentWord || this.panel.hidden) return;
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        this.message('Trình duyệt không hỗ trợ ghi âm tại địa chỉ này. Hãy dùng HTTPS hoặc http://localhost:5500 trên Edge/Chrome.');
        return;
      }

      window.dispatchEvent(new Event('vocamini:stop-reference-audio'));
      this.discardAudio();
      const generation = ++this.generation;
      this.phase = 'requesting';
      this.refreshButtons();
      this.message('Đang xin quyền sử dụng microphone...');

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
        // The user may have closed the panel or changed the word while the permission prompt was open.
        if (generation !== this.generation || this.panel.hidden || this.currentWord !== this.readWord()) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const mimeType = PronunciationRecorder.pickMimeType();
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        const session = { recorder, stream, chunks: [], cancelled: false, generation };
        this.session = session;
        recorder.addEventListener('dataavailable', event => {
          if (event.data?.size) session.chunks.push(event.data);
        });
        recorder.addEventListener('error', () => {
          this.cancel();
          this.message('Lỗi ghi âm. Kiểm tra microphone rồi thử lại.');
        });
        recorder.addEventListener('stop', () => this.finish(session));

        recorder.start();
        this.phase = 'recording';
        this.startedAt = Date.now();
        this.updateTimer();
        this.intervalId = window.setInterval(() => this.updateTimer(), 250);
        this.timeoutId = window.setTimeout(() => this.stop(), MAX_DURATION_MS);
        this.message('Đang ghi âm... Đọc từ đã chọn, tối đa 15 giây.');
        this.refreshButtons();
      } catch (error) {
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (generation !== this.generation) return;
        this.session = null;
        this.phase = 'idle';
        this.refreshButtons();
        const name = error?.name || '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          this.message('Microphone đã bị từ chối. Hãy cấp quyền ở biểu tượng bên cạnh thanh địa chỉ rồi thử lại.');
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          this.message('Không tìm thấy microphone. Kiểm tra thiết bị đầu vào của Windows.');
        } else if (name === 'NotReadableError' || name === 'TrackStartError') {
          this.message('Microphone đang bận hoặc không thể mở. Hãy đóng ứng dụng khác đang sử dụng microphone.');
        } else {
          console.error('Recorder error:', error);
          this.message('Không thể bắt đầu ghi âm. Hãy kiểm tra Console và thử lại.');
        }
      }
    }

    updateTimer() {
      const elapsed = Math.min(MAX_DURATION_MS, Math.max(0, Date.now() - this.startedAt));
      this.timerElement.textContent = `00:${String(Math.floor(elapsed / 1000)).padStart(2, '0')} / 00:15`;
    }

    stop() {
      if (this.phase !== 'recording' || !this.session) return;
      this.clearTimers();
      this.updateTimer();
      this.phase = 'stopping';
      this.refreshButtons();
      this.message('Đang hoàn tất bản ghi...');
      try {
        if (this.session.recorder.state !== 'inactive') this.session.recorder.stop();
      } catch (error) {
        console.error('Stop recording failed:', error);
        this.session.stream.getTracks().forEach(track => track.stop());
        this.session = null;
        this.phase = 'idle';
        this.refreshButtons();
        this.message('Không thể hoàn tất bản ghi. Hãy thử lại.');
      }
    }

    finish(session) {
      session.stream.getTracks().forEach(track => track.stop());
      if (this.session === session) this.session = null;
      if (session.cancelled || session.generation !== this.generation) return;

      this.clearTimers();
      if (!session.chunks.length || !session.chunks.some(blob => blob.size > 0)) {
        this.phase = 'idle';
        this.message('Không thu được âm thanh. Hãy kiểm tra microphone và thử lại.');
        this.refreshButtons();
        return;
      }

      const contentType = session.recorder.mimeType || session.chunks[0].type || 'application/octet-stream';
      const blob = new Blob(session.chunks, { type: contentType });
      this.latestBlob = blob;
      if (this.asrResult) this.asrResult.textContent = 'Bấm “Kiểm tra máy nghe được gì” để nhận diện offline bằng Vosk.';
      this.objectUrl = URL.createObjectURL(blob);
      this.audioElement.src = this.objectUrl;
      this.audioElement.hidden = false;
      this.phase = 'ready';
      if (this.comparePanel) this.comparePanel.hidden = false;
      if (this.speedSelect) this.speedSelect.value = '1';
      this.audioElement.playbackRate = 1;
      if (this.compareStatus) this.compareStatus.textContent = 'Bấm A để nghe mẫu, B để nghe bản ghi của bạn.';
      this.resetSelfChecks();
      this.message('Đã ghi xong! Bấm A/B để nghe so sánh và ghi lại khi cần.');
      this.refreshButtons();
      this.analyzeAudio(blob, session.generation);
    }

    resetSelfChecks() {
      this.panel.querySelectorAll('.pron-self-check-item').forEach(item => { item.checked = false; });
    }

    playSample() {
      if (this.phase !== 'ready' || this.panel.hidden || !this.currentWord) return;
      this.audioElement.pause();
      if (this.compareStatus) this.compareStatus.textContent = `Đang phát mẫu ${this.currentAccent}. Sau đó bấm B để nghe giọng bạn.`;
      // Reuse the working Phase 1 accent-specific SoundService via its dictionary speaker.
      document.getElementById('btn-dict-speak')?.click();
    }

    async playSelf() {
      if (this.phase !== 'ready' || this.panel.hidden || !this.objectUrl) return;
      // Also stop the online sample if it is still playing, preventing overlap.
      window.dispatchEvent(new Event('vocamini:stop-reference-audio'));
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.playbackRate = Number(this.speedSelect?.value) || 1;
      if (this.compareStatus) this.compareStatus.textContent = 'Đang phát giọng bạn; nghe lại các âm đầu/cuối và nguyên âm.';
      try {
        await this.audioElement.play();
      } catch (error) {
        if (this.compareStatus) this.compareStatus.textContent = 'Không phát được bản ghi. Hãy bấm Play trên trình phát phía trên.';
      }
    }

    async analyzeAudio(blob, generation) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context || !this.waveform) {
        if (this.waveMeta) this.waveMeta.textContent = 'Trình duyệt không hỗ trợ hiển thị dạng sóng.';
        return;
      }
      let context = null;
      try {
        // Maximum recording length is 15s; decode only the user's temporary local recording.
        context = new Context();
        const buffer = await context.decodeAudioData(await blob.arrayBuffer());
        if (generation !== this.generation || !this.objectUrl || this.panel.hidden) return;
        this.drawWaveform(buffer);
        if (this.waveMeta) this.waveMeta.textContent = `Thời lượng bản ghi: ${buffer.duration.toFixed(2)} giây · Dạng sóng chỉ cho biết biên độ, không đánh giá âm vị.`;
      } catch (error) {
        if (generation === this.generation && this.waveMeta) {
          this.waveMeta.textContent = 'Không thể hiển thị dạng sóng ở định dạng này; bạn vẫn có thể nghe lại.';
        }
      } finally {
        if (context) context.close().catch(() => {});
      }
    }

    drawWaveform(audioBuffer) {
      const canvas = this.waveform;
      const g = canvas.getContext('2d');
      if (!g) return;
      const w = canvas.width;
      const h = canvas.height;
      g.clearRect(0, 0, w, h);
      const channels = [];
      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) channels.push(audioBuffer.getChannelData(ch));
      const samples = audioBuffer.length;
      const step = Math.max(1, Math.ceil(samples / w));
      g.strokeStyle = '#64748b';
      g.lineWidth = 1;
      for (let i = 0; i < w; i++) {
        const start = i * step;
        const end = Math.min(samples, start + step);
        let peak = 0;
        for (let j = start; j < end; j++) {
          for (const channel of channels) peak = Math.max(peak, Math.abs(channel[j] || 0));
        }
        const amplitude = peak * (h / 2 - 5);
        g.beginPath();
        g.moveTo(i + 0.5, h / 2 - amplitude);
        g.lineTo(i + 0.5, h / 2 + amplitude);
        g.stroke();
      }
    }

    static async encodeWav(blob) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!AudioCtx || !OfflineCtx) throw new Error('Trình duyệt không hỗ trợ chuyển âm thanh WAV.');
      const context = new AudioCtx();
      let decoded;
      try {
        decoded = await context.decodeAudioData(await blob.arrayBuffer());
      } finally {
        await context.close().catch(() => {});
      }
      if (!decoded.duration || decoded.duration > 16) throw new Error('Bản ghi cần dài từ 0 đến 15 giây.');
      const sampleRate = 16000;
      const offline = new OfflineCtx(1, Math.ceil(decoded.duration * sampleRate), sampleRate);
      const source = offline.createBufferSource();
      source.buffer = decoded;
      source.connect(offline.destination);
      source.start(0);
      const rendered = await offline.startRendering();
      const pcm = rendered.getChannelData(0);
      const bytes = new ArrayBuffer(44 + pcm.length * 2);
      const view = new DataView(bytes);
      const str = (offset, text) => { for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i)); };
      str(0, 'RIFF'); view.setUint32(4, 36 + pcm.length * 2, true); str(8, 'WAVE');
      str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
      view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true);
      view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, pcm.length * 2, true);
      for (let i = 0; i < pcm.length; i++) {
        const sample = Math.max(-1, Math.min(1, pcm[i]));
        view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      }
      return new Blob([bytes], { type: 'audio/wav' });
    }

    async recognizeOffline() {
      if (this.phase !== 'ready' || !this.latestBlob || this.asrBusy) return;
      const generation = this.generation;
      const word = this.currentWord;
      const accent = this.currentAccent;
      this.asrBusy = true;
      this.refreshButtons();
      if (this.asrResult) this.asrResult.textContent = 'Đang chuyển âm thanh sang WAV và nhận diện trên Windows...';
      const controller = new AbortController();
      this.asrController = controller;
      try {
        const wav = await PronunciationRecorder.encodeWav(this.latestBlob);
        if (generation !== this.generation || controller.signal.aborted) return;
        const response = await fetch('/api/pronunciation/recognize', {
          method: 'POST',
          headers: {
            'Content-Type': 'audio/wav',
            'X-Expected-Word': encodeURIComponent(word),
            'X-Practice-Accent': accent
          },
          body: wav,
          signal: controller.signal,
          cache: 'no-store'
        });
        // Read the response only once. A 200 response may still be empty or malformed.
        const raw = await response.text();
        let data;
        try {
          data = raw.trim() ? JSON.parse(raw) : null;
        } catch (_) {
          console.warn('Vosk API invalid JSON:', {
            status: response.status,
            contentType: response.headers.get('content-type'),
            responseBytes: raw.length
          });
          throw new Error(`API nhận diện trả JSON không hợp lệ (HTTP ${response.status}). Mở F12 → Network → recognize → Response để kiểm tra.`);
        }
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error(`API nhận diện trả nội dung rỗng hoặc không đúng định dạng (HTTP ${response.status}). Kiểm tra F12 → Network → recognize.`);
        }
        if (!response.ok) throw new Error(data.error || `API nhận diện lỗi HTTP ${response.status}`);
        if (typeof data.recognized !== 'string' || typeof data.matched !== 'boolean') {
          throw new Error('API nhận diện thiếu trường recognized hoặc matched. Kiểm tra F12 → Network → recognize.');
        }
        if (generation !== this.generation || controller.signal.aborted) return;
        const detected = data.recognized || '(không nhận diện được)';
        const notice = data.matched
          ? 'Máy nhận ra từ mục tiêu. Hãy tiếp tục nghe A/B để tự kiểm tra các âm.'
          : 'Máy chưa nhận đúng từ mục tiêu. Có thể do phát âm, tiếng ồn hoặc giới hạn của ASR.';
        if (this.asrResult) this.asrResult.textContent = `Từ mục tiêu: ${word}\nMáy nhận được: ${detected}\n${notice}\nModel US được dùng để nhận diện cả hai lựa chọn giọng; kết quả không phải điểm phát âm.`;
      } catch (error) {
        if (generation !== this.generation || controller.signal.aborted) return;
        const message = error instanceof TypeError
          ? 'Không kết nối được Vosk local. Hãy chạy server bằng Python thay vì http-server.'
          : (error?.message || 'Không thể nhận diện bản ghi.');
        if (this.asrResult) this.asrResult.textContent = `Chưa nhận diện được: ${message}`;
      } finally {
        if (this.asrController === controller) this.asrController = null;
        if (generation === this.generation) {
          this.asrBusy = false;
          this.refreshButtons();
        }
      }
    }

    clearTimers() {
      if (this.intervalId !== null) window.clearInterval(this.intervalId);
      if (this.timeoutId !== null) window.clearTimeout(this.timeoutId);
      this.intervalId = null;
      this.timeoutId = null;
    }

    discardAudio() {
      if (this.asrController) this.asrController.abort();
      this.asrController = null;
      this.asrBusy = false;
      this.latestBlob = null;
      if (this.asrResult) this.asrResult.textContent = 'Ghi âm xong rồi nhấn kiểm tra. Không gửi bản ghi lên cloud.';
      this.audioElement.pause();
      this.audioElement.removeAttribute('src');
      this.audioElement.hidden = true;
      this.audioElement.load();
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
      this.timerElement.textContent = '00:00 / 00:15';
      if (this.comparePanel) this.comparePanel.hidden = true;
      if (this.compareStatus) this.compareStatus.textContent = '';
      if (this.waveMeta) this.waveMeta.textContent = 'Chưa có bản ghi.';
      if (this.waveform) this.waveform.getContext('2d')?.clearRect(0, 0, this.waveform.width, this.waveform.height);
      this.resetSelfChecks();
    }

    cancel() {
      ++this.generation;
      this.clearTimers();
      const session = this.session;
      if (session) {
        session.cancelled = true;
        this.session = null;
        try {
          if (session.recorder.state !== 'inactive') session.recorder.stop();
        } catch (error) { console.warn('Recorder cancellation:', error); }
        session.stream.getTracks().forEach(track => track.stop());
      }
      this.discardAudio();
      this.phase = 'idle';
      this.refreshButtons();
    }

    clear() {
      this.cancel();
      this.message('Đã xóa bản ghi tạm. Bạn có thể ghi âm lại.');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const recorder = new PronunciationRecorder();
    recorder.init();
  });
})();
