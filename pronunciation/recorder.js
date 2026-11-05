/**
 * VocaMini - Pronunciation Recorder, Phase 2
 * Local microphone capture and playback only. No network requests, scoring or persistence.
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
      this.objectUrl = URL.createObjectURL(blob);
      this.audioElement.src = this.objectUrl;
      this.audioElement.hidden = false;
      this.phase = 'ready';
      this.message('Đã ghi xong! Bấm Play để nghe lại. Bạn có thể ghi lại nếu chưa ưng ý.');
      this.refreshButtons();
    }

    clearTimers() {
      if (this.intervalId !== null) window.clearInterval(this.intervalId);
      if (this.timeoutId !== null) window.clearTimeout(this.timeoutId);
      this.intervalId = null;
      this.timeoutId = null;
    }

    discardAudio() {
      this.audioElement.pause();
      this.audioElement.removeAttribute('src');
      this.audioElement.hidden = true;
      this.audioElement.load();
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
      this.timerElement.textContent = '00:00 / 00:15';
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
