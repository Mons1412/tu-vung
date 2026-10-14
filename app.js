/**
 * VocaMini - Từ điển & Học từ vựng tiếng Anh
 * Complete Single Page Application JavaScript
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA & STORAGE MODULE
  // =========================================================================
  const STORAGE_KEY = 'vocamini_app_data_v1';
  const THEME_KEY = 'vocamini_theme';

  // Seed Data: 2 notebooks with high-frequency vocabulary
  const DEFAULT_DATA = {
    notebooks: [
      {
        id: 'nb_toeic_01',
        name: 'Từ vựng TOEIC trọng tâm',
        createdAt: '2026-09-01T08:00:00.000Z',
        color: '#2563eb',
        words: [
          {
            id: 'w_001',
            word: 'capacity',
            phonetic: '/kəˈpæs.ə.ti/',
            partOfSpeech: 'noun',
            meaningEn: 'the total amount that can be contained or produced',
            meaningVi: 'sức chứa, năng lực sản xuất',
            examples: [
              { en: 'The conference room has a seating capacity of 200.', vi: 'Phòng hội nghị có sức chứa 200 chỗ ngồi.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:05:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_002',
            word: 'negotiate',
            phonetic: '/nəˈɡoʊ.ʃi.eɪt/',
            partOfSpeech: 'verb',
            meaningEn: 'to discuss something in order to reach an agreement',
            meaningVi: 'đàm phán, thương lượng',
            examples: [
              { en: 'We need to negotiate a better contract with the supplier.', vi: 'Chúng ta cần đàm phán một hợp đồng tốt hơn với nhà cung cấp.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:10:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_003',
            word: 'accommodate',
            phonetic: '/əˈkɑː.mə.deɪt/',
            partOfSpeech: 'verb',
            meaningEn: 'to provide with a place to live or to be stored in',
            meaningVi: 'đáp ứng, cung cấp chỗ ở/chỗ chứa',
            examples: [
              { en: 'The hotel can accommodate up to 500 guests.', vi: 'Khách sạn có thể đón tiếp tới 500 khách.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:15:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_004',
            word: 'eligible',
            phonetic: '/ˈel.ə.dʒə.bəl/',
            partOfSpeech: 'adjective',
            meaningEn: 'having the necessary qualities or fulfilling conditions',
            meaningVi: 'đủ điều kiện, thích hợp',
            examples: [
              { en: 'Only full-time employees are eligible for the bonus.', vi: 'Chỉ nhân viên toàn thời gian mới đủ điều kiện nhận thưởng.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:20:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_005',
            word: 'implement',
            phonetic: '/ˈɪm.plə.ment/',
            partOfSpeech: 'verb',
            meaningEn: 'to put a plan or system into operation',
            meaningVi: 'thực hiện, thi hành kế hoạch',
            examples: [
              { en: 'The committee will implement new safety guidelines next month.', vi: 'Ủy ban sẽ triển khai hướng dẫn an toàn mới vào tháng tới.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:25:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_006',
            word: 'evaluate',
            phonetic: '/ɪˈvæl.ju.eɪt/',
            partOfSpeech: 'verb',
            meaningEn: 'to judge or calculate the quality or value of something',
            meaningVi: 'đánh giá, định giá',
            examples: [
              { en: 'We need to evaluate the success of the advertising campaign.', vi: 'Chúng ta cần đánh giá sự thành công của chiến dịch quảng cáo.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:30:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_007',
            word: 'comprehensive',
            phonetic: '/ˌkɑːm.prəˈhen.sɪv/',
            partOfSpeech: 'adjective',
            meaningEn: 'complete and including everything that is necessary',
            meaningVi: 'toàn diện, bao hàm nhiều mặt',
            examples: [
              { en: 'The report provides a comprehensive study of market trends.', vi: 'Báo cáo cung cấp một nghiên cứu toàn diện về xu hướng thị trường.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:35:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_008',
            word: 'anticipate',
            phonetic: '/ænˈtɪs.ə.peɪt/',
            partOfSpeech: 'verb',
            meaningEn: 'to imagine or expect that something will happen',
            meaningVi: 'dự đoán trước, lường trước',
            examples: [
              { en: 'We do not anticipate any major delays in shipment.', vi: 'Chúng tôi không lường trước sự chậm trễ lớn nào trong giao hàng.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:40:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_009',
            word: 'prioritize',
            phonetic: '/praɪˈɔːr.ə.taɪz/',
            partOfSpeech: 'verb',
            meaningEn: 'to decide what tasks are most important so you do them first',
            meaningVi: 'ưu tiên, đặt lên hàng đầu',
            examples: [
              { en: 'You must learn to prioritize your daily duties.', vi: 'Bạn phải học cách ưu tiên các nhiệm vụ hàng ngày của mình.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:45:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_010',
            word: 'preliminary',
            phonetic: '/prɪˈlɪm.ə.ner.i/',
            partOfSpeech: 'adjective',
            meaningEn: 'coming before the more important actions or events',
            meaningVi: 'sơ bộ, bước đầu',
            examples: [
              { en: 'Preliminary findings show a positive result.', vi: 'Những phát hiện sơ bộ cho thấy kết quả khả quan.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-01T08:50:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          }
        ]
      },
      {
        id: 'nb_daily_02',
        name: 'Giao tiếp hàng ngày',
        createdAt: '2026-09-02T10:00:00.000Z',
        color: '#10b981',
        words: [
          {
            id: 'w_101',
            word: 'essential',
            phonetic: '/ɪˈsen.ʃəl/',
            partOfSpeech: 'adjective',
            meaningEn: 'necessary or of the greatest importance',
            meaningVi: 'thiết yếu, cần thiết',
            examples: [
              { en: 'Good communication is essential in a team.', vi: 'Giao tiếp tốt là điều thiết yếu trong một đội ngũ.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-02T10:05:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_102',
            word: 'frequently',
            phonetic: '/ˈfriː.kwənt.li/',
            partOfSpeech: 'adverb',
            meaningEn: 'often; happening a lot of times',
            meaningVi: 'thường xuyên',
            examples: [
              { en: 'Buses depart frequently throughout the day.', vi: 'Xe buýt khởi hành thường xuyên trong suốt cả ngày.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-02T10:10:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_103',
            word: 'convenient',
            phonetic: '/kənˈviː.ni.ənt/',
            partOfSpeech: 'adjective',
            meaningEn: 'suitable for your purposes and needs without difficulty',
            meaningVi: 'tiện lợi, thuận tiện',
            examples: [
              { en: 'Is 3 PM convenient for our quick meeting?', vi: '3 giờ chiều có thuận tiện cho buổi họp nhanh của chúng ta không?' }
            ],
            imageUrl: '',
            addedAt: '2026-09-02T10:15:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_104',
            word: 'appreciate',
            phonetic: '/əˈpriː.ʃi.eɪt/',
            partOfSpeech: 'verb',
            meaningEn: 'to recognize how good someone or something is and to value them',
            meaningVi: 'trân trọng, đánh giá cao, cảm kích',
            examples: [
              { en: 'I really appreciate your timely assistance.', vi: 'Tôi thực sự cảm kích sự giúp đỡ kịp thời của bạn.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-02T10:20:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_105',
            word: 'definitely',
            phonetic: '/ˈdef.ə.nət.li/',
            partOfSpeech: 'adverb',
            meaningEn: 'without any doubt; certainly',
            meaningVi: 'chắc chắn, dứt khoát',
            examples: [
              { en: 'I will definitely join you for lunch today.', vi: 'Tôi chắc chắn sẽ cùng bạn ăn trưa hôm nay.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-02T10:25:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          },
          {
            id: 'w_106',
            word: 'hesitate',
            phonetic: '/ˈhez.ə.teɪt/',
            partOfSpeech: 'verb',
            meaningEn: 'to pause before you do something because of uncertainty',
            meaningVi: 'ngập ngừng, do dự',
            examples: [
              { en: 'Do not hesitate to ask if you have any questions.', vi: 'Đừng ngần ngại hỏi nếu bạn có bất kỳ câu hỏi nào.' }
            ],
            imageUrl: '',
            addedAt: '2026-09-02T10:30:00.000Z',
            reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
          }
        ]
      }
    ]
  };

  // Generic fallback words for distractors in quizzes
  const FALLBACK_DISTRACTORS = [
    { word: 'achieve', meaningVi: 'đạt được, hoàn thành mục tiêu' },
    { word: 'maintain', meaningVi: 'duy trì, bảo dưỡng' },
    { word: 'strategy', meaningVi: 'chiến lược, kế hoạch' },
    { word: 'efficient', meaningVi: 'hiệu quả, năng suất cao' },
    { word: 'solution', meaningVi: 'giải pháp, cách xử lý' },
    { word: 'potential', meaningVi: 'tiềm năng, khả năng phát triển' },
    { word: 'collaborate', meaningVi: 'hợp tác, phối hợp cùng làm việc' },
    { word: 'perspective', meaningVi: 'góc nhìn, quan điểm cá nhân' }
  ];

  class StorageManager {
    static getData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          this.saveData(DEFAULT_DATA);
          return DEFAULT_DATA;
        }
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error reading localStorage:', e);
        return DEFAULT_DATA;
      }
    }

    static saveData(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }

    static getNotebooks() {
      const data = this.getData();
      return data.notebooks || [];
    }

    static getNotebook(id) {
      const notebooks = this.getNotebooks();
      return notebooks.find(nb => nb.id === id) || null;
    }

    static createNotebook(name, color = '#2563eb') {
      const data = this.getData();
      const newNb = {
        id: 'nb_' + Date.now(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
        color: color || '#2563eb',
        words: []
      };
      data.notebooks.unshift(newNb);
      this.saveData(data);
      return newNb;
    }

    static updateNotebook(id, updates) {
      const data = this.getData();
      const nb = data.notebooks.find(n => n.id === id);
      if (nb) {
        Object.assign(nb, updates);
        this.saveData(data);
        return nb;
      }
      return null;
    }

    static deleteNotebook(id) {
      const data = this.getData();
      data.notebooks = data.notebooks.filter(n => n.id !== id);
      this.saveData(data);
    }

    static addWordToNotebook(notebookId, wordObj) {
      const data = this.getData();
      const nb = data.notebooks.find(n => n.id === notebookId);
      if (!nb) return false;

      // Check if word already exists in this notebook
      const existing = nb.words.find(w => w.word.toLowerCase() === wordObj.word.toLowerCase());
      if (existing) {
        return { alreadyExists: true, word: existing };
      }

      const newWord = {
        id: 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        word: wordObj.word.trim().toLowerCase(),
        phonetic: wordObj.phonetic || '',
        partOfSpeech: wordObj.partOfSpeech || 'noun',
        meaningEn: wordObj.meaningEn || '',
        meaningVi: wordObj.meaningVi || '',
        examples: wordObj.examples || [],
        imageUrl: wordObj.imageUrl || '',
        addedAt: new Date().toISOString(),
        reviewStats: { correct: 0, wrong: 0, lastReviewed: null }
      };

      nb.words.unshift(newWord);
      this.saveData(data);
      return { success: true, word: newWord };
    }

    static updateWord(notebookId, wordId, updates) {
      const data = this.getData();
      const nb = data.notebooks.find(n => n.id === notebookId);
      if (!nb) return false;
      const word = nb.words.find(w => w.id === wordId);
      if (!word) return false;

      Object.assign(word, updates);
      this.saveData(data);
      return true;
    }

    static deleteWord(notebookId, wordId) {
      const data = this.getData();
      const nb = data.notebooks.find(n => n.id === notebookId);
      if (!nb) return false;
      nb.words = nb.words.filter(w => w.id !== wordId);
      this.saveData(data);
      return true;
    }

    static bulkDeleteWords(notebookId, wordIds) {
      const data = this.getData();
      const nb = data.notebooks.find(n => n.id === notebookId);
      if (!nb) return false;
      const idSet = new Set(wordIds);
      nb.words = nb.words.filter(w => !idSet.has(w.id));
      this.saveData(data);
      return true;
    }

    static moveOrCopyWords(sourceNbId, targetNbId, wordIds, isMove = false) {
      const data = this.getData();
      const src = data.notebooks.find(n => n.id === sourceNbId);
      const tgt = data.notebooks.find(n => n.id === targetNbId);
      if (!src || !tgt) return 0;

      const wordsToTransfer = src.words.filter(w => wordIds.includes(w.id));
      let count = 0;

      wordsToTransfer.forEach(word => {
        const exists = tgt.words.some(w => w.word.toLowerCase() === word.word.toLowerCase());
        if (!exists) {
          const clone = JSON.parse(JSON.stringify(word));
          clone.id = 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
          clone.addedAt = new Date().toISOString();
          tgt.words.unshift(clone);
          count++;
        }
      });

      if (isMove) {
        src.words = src.words.filter(w => !wordIds.includes(w.id));
      }

      this.saveData(data);
      return count;
    }

    static updateWordReviewStats(wordText, isCorrect) {
      const data = this.getData();
      data.notebooks.forEach(nb => {
        nb.words.forEach(w => {
          if (w.word.toLowerCase() === wordText.toLowerCase()) {
            if (!w.reviewStats) w.reviewStats = { correct: 0, wrong: 0, lastReviewed: null };
            if (isCorrect) {
              w.reviewStats.correct = (w.reviewStats.correct || 0) + 1;
            } else {
              w.reviewStats.wrong = (w.reviewStats.wrong || 0) + 1;
            }
            w.reviewStats.lastReviewed = new Date().toISOString();
          }
        });
      });
      this.saveData(data);
    }

    static getAllWords() {
      const notebooks = this.getNotebooks();
      const all = [];
      const seen = new Set();
      notebooks.forEach(nb => {
        nb.words.forEach(w => {
          if (!seen.has(w.word.toLowerCase())) {
            seen.add(w.word.toLowerCase());
            all.push(w);
          }
        });
      });
      return all;
    }
  }

  // =========================================================================
  // 2. AUDIO & SOUND EFFECTS MODULE (Web Audio API + Web Speech)
  // =========================================================================
  class SoundService {
    static initAudioContext() {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    static playCorrectTone() {
      try {
        this.initAudioContext();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Arpeggio / pleasant rising tone
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.45);
      } catch (e) {
        console.warn('Audio feedback failed:', e);
      }
    }

    static playWrongTone() {
      try {
        this.initAudioContext();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Low buzz tone
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(130, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {
        console.warn('Audio feedback failed:', e);
      }
    }

    static currentAudio = null;

    /**
     * Hệ thống phát âm đa tầng (Multi-tier Audio Engine):
     * 1. Audio gốc từ API từ điển (audioUrl nếu có)
     * 2. Audio giọng đọc chuẩn bản xứ chất lượng cao (Youdao Oxford/Webster stream)
     * 3. Audio Google TTS trực tuyến
     * 4. Web Speech API (offline fallback)
     */
    static speak(text, rate = 0.9, customAudioUrl = null) {
      if (!text || typeof text !== 'string') return;
      const cleanWord = text.trim();
      if (!cleanWord) return;

      // Dừng audio đang phát nếu có
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (e) {}
        this.currentAudio = null;
      }

      // Tầng 1: Nếu có audioUrl từ từ điển API
      if (customAudioUrl && typeof customAudioUrl === 'string' && customAudioUrl.startsWith('http')) {
        this.playHtmlAudio(customAudioUrl, () => {
          this.playOnlineTts(cleanWord, rate);
        });
        return;
      }

      // Tầng 2 & 3 & 4
      this.playOnlineTts(cleanWord, rate);
    }

    static playOnlineTts(word, rate) {
      // Type 2 = US English (giọng Mỹ chuẩn chất lượng cao)
      const primaryUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=2`;
      const backupUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(word)}`;

      this.playHtmlAudio(primaryUrl, () => {
        this.playHtmlAudio(backupUrl, () => {
          this.playWebSpeech(word, rate);
        });
      });
    }

    static playHtmlAudio(url, onError) {
      try {
        const audio = new Audio(url);
        this.currentAudio = audio;

        let handled = false;
        const triggerError = () => {
          if (!handled) {
            handled = true;
            if (onError) onError();
          }
        };

        audio.onerror = triggerError;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            triggerError();
          });
        }
      } catch (err) {
        if (onError) onError();
      }
    }

    static playWebSpeech(text, rate = 0.9) {
      if (!('speechSynthesis' in window)) return;
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        setTimeout(() => {
          try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = rate;

            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0) {
              const englishVoice = voices.find(v => v.lang && (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')));
              if (englishVoice) {
                utterance.voice = englishVoice;
              }
            }
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.warn('SpeechSynthesis error:', e);
          }
        }, 30);
      } catch (e) {
        console.warn('SpeechSynthesis resume error:', e);
      }
    }
  }

  // Pre-load voices for SpeechSynthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // =========================================================================
  // 3. DICTIONARY API & TRANSLATION SERVICE
  // =========================================================================
  class DictionaryService {
    static cache = new Map();

    static async performFastLookup(rawWord, onUpdate) {
      const word = rawWord.trim().toLowerCase();
      if (!word) return;

      let result = {
        word: word, phonetic: '', audioUrl: '', partOfSpeech: '',
        meaningEn: '', meaningVi: '', examples: [], synonyms: [], antonyms: []
      };

      if (this.cache.has(word)) {
        onUpdate(this.cache.get(word));
        return;
      }

      // Check local saved first for instant display (fixes missing examples & phonetic for saved words)
      const allSavedWords = StorageManager.getAllWords();
      const existingSaved = allSavedWords.find(w => w.word.toLowerCase() === word);
      if (existingSaved) {
        if (existingSaved.meaningVi) result.meaningVi = existingSaved.meaningVi;
        if (existingSaved.phonetic) result.phonetic = existingSaved.phonetic;
        if (existingSaved.partOfSpeech) result.partOfSpeech = existingSaved.partOfSpeech;
        if (existingSaved.meaningEn) result.meaningEn = existingSaved.meaningEn;
        if (existingSaved.examples && existingSaved.examples.length > 0) {
          result.examples = JSON.parse(JSON.stringify(existingSaved.examples));
        }
        onUpdate(result);
      }

      // Fetch Translation API (Very Fast) - requesting both translation (dt=t) and dictionary meanings (dt=bd)
      fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&dt=bd&q=${encodeURIComponent(word)}`)
        .then(res => res.json())
        .then(data => {
          let richMeaningVi = "";
          
          if (data && data[1] && Array.isArray(data[1])) {
            const meanings = [];
            data[1].forEach(posBlock => {
               if (posBlock[1] && Array.isArray(posBlock[1])) {
                 const translations = posBlock[1].slice(0, 4);
                 meanings.push(translations.join(', '));
               }
            });
            if (meanings.length > 0) {
              richMeaningVi = meanings.join('; ');
            }
          }
          
          if (!richMeaningVi && data && data[0] && data[0][0] && data[0][0][0]) {
            richMeaningVi = data[0][0][0].toLowerCase();
          }

          if (richMeaningVi && richMeaningVi !== word.toLowerCase() && !result.meaningVi) {
            result.meaningVi = richMeaningVi;
            onUpdate(result);
          }
        })
        .catch(e => console.warn('Translation API error:', e));

      // Fetch Dictionary API (Primary)
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
        .then(res => res.ok ? res.json() : Promise.reject('Not found'))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const entry = data[0];
            
            if (entry.phonetic) result.phonetic = entry.phonetic;
            if (entry.phonetics) {
              const withAudio = entry.phonetics.find(p => p.audio && p.audio.trim().length > 0);
              if (withAudio) {
                result.audioUrl = withAudio.audio;
                if (!result.phonetic && withAudio.text) result.phonetic = withAudio.text;
              }
              if (!result.phonetic) {
                const withText = entry.phonetics.find(p => p.text);
                if (withText) result.phonetic = withText.text;
              }
            }

            if (entry.meanings && entry.meanings.length > 0) {
              const firstMeaning = entry.meanings[0];
              if (!result.partOfSpeech) result.partOfSpeech = firstMeaning.partOfSpeech || 'noun';

              if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
                if (!result.meaningEn) result.meaningEn = firstMeaning.definitions[0].definition || '';
                
                entry.meanings.forEach(m => {
                  m.definitions?.forEach(d => {
                    if (d.example && result.examples.length < 3) {
                      result.examples.push({ en: d.example, vi: '' });
                    }
                  });
                  if (m.synonyms) result.synonyms.push(...m.synonyms);
                  if (m.antonyms) result.antonyms.push(...m.antonyms);
                });
              }
            }
            result.synonyms = [...new Set(result.synonyms)].slice(0, 6);
            result.antonyms = [...new Set(result.antonyms)].slice(0, 6);
            
            this.cache.set(word, result);
            onUpdate(result);
          }
        })
        .catch(err => {
            // Fallback to Datamuse API if dictionaryapi.dev fails (often blocked or down)
            fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=d,p,r&max=1`)
              .then(res => res.json())
              .then(fallbackData => {
                 if (fallbackData && fallbackData.length > 0) {
                    const fw = fallbackData[0];
                    if (fw.defs && fw.defs.length > 0 && !result.meaningEn) {
                       // defs are usually format: "n\tdefinition text"
                       const parts = fw.defs[0].split('\t');
                       result.meaningEn = parts.length > 1 ? parts[1] : fw.defs[0];
                    }
                    if (fw.tags) {
                       const pron = fw.tags.find(t => t.startsWith('pron:'));
                       if (pron && !result.phonetic) {
                           // Convert "pron:kAH0 pAE1 sIH0 tIY0" to simpler phonetic
                           result.phonetic = '/' + pron.replace('pron:', '').toLowerCase() + '/';
                       }
                       const pos = fw.tags.find(t => ['n','v','adj','adv'].includes(t));
                       if (pos && !result.partOfSpeech) result.partOfSpeech = pos === 'n' ? 'noun' : pos === 'v' ? 'verb' : pos === 'adj' ? 'adjective' : 'adverb';
                    }
                    this.cache.set(word, result);
                    onUpdate(result);
                 } else {
                    if (!result.meaningVi) {
                       result.notFound = true;
                       onUpdate(result);
                    }
                 }
              })
              .catch(fallbackErr => {
                 if (!result.meaningVi) {
                    result.notFound = true; 
                    onUpdate(result);
                 }
              });
        });
    }
  }

  // =========================================================================
  // 4. TOAST & MODAL UI CONTROLLER
  // =========================================================================
  class AppUI {
    static showToast(message, type = 'info') {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icon = type === 'success' ? '✓' : type === 'danger' ? '✕' : 'ℹ';
      toast.innerHTML = `<span style="font-weight: bold;">${icon}</span> <span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    static openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        const input = modal.querySelector('input, select, textarea');
        if (input) setTimeout(() => input.focus(), 150);
      }
    }

    static closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
      }
    }
  }

  // =========================================================================
  // 5. MAIN CONTROLLER & ROUTER
  // =========================================================================
  class AppController {
    static currentView = 'view-dict';
    static currentNotebookId = null;
    static currentSearchResult = null;
    static autoPronounce = true;

    static async init() {
      // Check for sync code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const syncCode = urlParams.get('sync_code');
      if (syncCode) {
         try {
            const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(syncCode), (c) => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const data = JSON.parse(jsonStr);
            if (data && Array.isArray(data.notebooks)) {
              if (confirm(`Phát hiện ${data.notebooks.length} sổ tay từ liên kết chia sẻ. Bạn có muốn nạp vào máy không?`)) {
                 StorageManager.saveData(data);
                 AppUI.showToast('Đã đồng bộ dữ liệu thành công!', 'success');
              }
            }
         } catch (err) {
            console.error('Lỗi giải mã sync_code URL', err);
         }
         window.history.replaceState({}, document.title, window.location.pathname);
      }

      this.initTheme();
      
      this.autoPronounce = localStorage.getItem('vocamini_autopronounce') !== 'false';
      const apCb = document.getElementById('game-auto-pronounce-cb');
      if (apCb) {
         apCb.checked = this.autoPronounce;
         apCb.addEventListener('change', (e) => {
            this.autoPronounce = e.target.checked;
            localStorage.setItem('vocamini_autopronounce', this.autoPronounce);
         });
      }

      this.bindNavigation();
      this.bindSearchEvents();
      this.bindNotebookEvents();
      this.bindModalEvents();
      this.bindGameEvents();

      // Render initial notebooks list & stats
      NotebookController.renderNotebooks();
      StatsController.renderStats();

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
      });
    }

    static initTheme() {
      const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      this.updateThemeIcon(savedTheme);

      const themeBtn = document.getElementById('btn-toggle-theme');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme') || 'light';
          const next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem(THEME_KEY, next);
          this.updateThemeIcon(next);
        });
      }
    }

    static updateThemeIcon(theme) {
      const btn = document.getElementById('btn-toggle-theme');
      if (!btn) return;
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
    }

    static switchView(viewId) {
      this.currentView = viewId;

      // Update View Sections
      document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
      });
      const target = document.getElementById(viewId);
      if (target) target.classList.add('active');

      // Update Nav Buttons
      document.querySelectorAll('.nav-link-btn, .bottom-tab').forEach(btn => {
        if (btn.getAttribute('data-view') === viewId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Special handling on view enter
      if (viewId === 'view-notebooks') {
        NotebookController.renderNotebooks();
      } else if (viewId === 'view-learn') {
        GameHubController.renderHub();
      } else if (viewId === 'view-stats') {
        StatsController.renderStats();
      } else if (viewId === 'view-reading') {
        // Ensure input screen is visible (in case user switched away mid-session)
        const inputScreen = document.getElementById('reading-input-screen');
        const activeScreen = document.getElementById('reading-active-screen');
        if (inputScreen && inputScreen.style.display === 'none' && activeScreen && activeScreen.style.display === 'none') {
          inputScreen.style.display = 'block';
        }
      }
    }

    static bindNavigation() {
      // Desktop Nav Links
      document.querySelectorAll('.nav-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const view = btn.getAttribute('data-view');
          if (view) AppController.switchView(view);
        });
      });

      // Mobile Bottom Nav Tabs
      document.querySelectorAll('.bottom-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const view = tab.getAttribute('data-view');
          if (view) AppController.switchView(view);
        });
      });

      // Logo click -> Home / Dict
      const logo = document.querySelector('.brand');
      if (logo) {
        logo.addEventListener('click', () => AppController.switchView('view-dict'));
      }
    }

    // =======================================================================
    // SEARCH & DICTIONARY UI
    // =======================================================================
    static bindSearchEvents() {
      const form = document.getElementById('dict-search-form');
      const input = document.getElementById('dict-search-input');
      const clearBtn = document.getElementById('btn-clear-search');
      const speakBtn = document.getElementById('btn-dict-speak');
      const saveBtn = document.getElementById('btn-save-to-notebook');
      const dropdown = document.getElementById('search-autocomplete-dropdown');
      
      let debounceTimeout = null;

      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const query = input.value.trim();
          if (dropdown) dropdown.style.display = 'none';
          if (query) {
            await this.performLookup(query);
          }
        });
      }

      // Autocomplete logic
      if (input && dropdown) {
        input.addEventListener('input', (e) => {
          const query = e.target.value.trim();
          clearTimeout(debounceTimeout);
          
          if (!query) {
            dropdown.style.display = 'none';
            return;
          }

          debounceTimeout = setTimeout(async () => {
            try {
              // 1. Search local notebooks first
              const allWords = StorageManager.getAllWords();
              const localMatches = allWords
                .filter(w => w.word.startsWith(query.toLowerCase()))
                .map(w => ({ word: w.word, vi: w.meaningVi }));

              // 2. Fetch Datamuse API for English word completion
              const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(query)}`);
              let apiMatches = [];
              if (res.ok) {
                const data = await res.json();
                apiMatches = data.map(item => ({ word: item.word, vi: '' }));
              }

              // Combine and deduplicate
              const combined = [...localMatches, ...apiMatches];
              const seen = new Set();
              const finalSuggestions = [];
              for (const item of combined) {
                if (!seen.has(item.word)) {
                  seen.add(item.word);
                  finalSuggestions.push(item);
                }
                if (finalSuggestions.length >= 7) break; // Limit to 7 suggestions
              }

              if (finalSuggestions.length > 0) {
                dropdown.innerHTML = '';
                finalSuggestions.forEach(item => {
                  const div = document.createElement('div');
                  div.className = 'autocomplete-item';
                  div.innerHTML = `<span class="autocomplete-word">${item.word}</span> <span style="color: var(--text-muted); font-size: 0.85rem;">${item.vi ? '- ' + item.vi : ''}</span>`;
                  div.onmousedown = (e) => {
                    // prevent input blur
                    e.preventDefault(); 
                  };
                  div.onclick = () => {
                    input.value = item.word;
                    dropdown.style.display = 'none';
                    this.performLookup(item.word);
                  };
                  dropdown.appendChild(div);
                });
                dropdown.style.display = 'block';
              } else {
                dropdown.style.display = 'none';
              }
            } catch (err) {
              dropdown.style.display = 'none';
            }
          }, 250);
        });

        // Hide dropdown on blur
        input.addEventListener('blur', () => {
          setTimeout(() => {
            dropdown.style.display = 'none';
          }, 150);
        });
        
        // Show dropdown on focus if input is not empty
        input.addEventListener('focus', () => {
          if (input.value.trim() && dropdown.children.length > 0) {
            dropdown.style.display = 'block';
          }
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          if (dropdown) dropdown.style.display = 'none';
          input.focus();
        });
      }

      // Quick tags click
      document.querySelectorAll('.quick-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          const word = tag.textContent.trim();
          input.value = word;
          if (dropdown) dropdown.style.display = 'none';
          this.performLookup(word);
        });
      });

      // Pronunciation button
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          if (this.currentSearchResult) {
            SoundService.speak(this.currentSearchResult.word, 0.9, this.currentSearchResult.audioUrl);
          }
        });
      }

      // Save to Notebook button
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          if (!this.currentSearchResult) return;
          this.openSaveWordModal(this.currentSearchResult);
        });
      }

      // Button: Add custom word if not found
      const btnAddNotFound = document.getElementById('btn-add-not-found-word');
      if (btnAddNotFound) {
        btnAddNotFound.addEventListener('click', () => {
          const word = input.value.trim();
          this.openManualAddModal(word);
        });
      }
    }

    static async performLookup(word) {
      const card = document.getElementById('dict-result-card');
      const spinner = document.getElementById('dict-loading-state');
      const notFound = document.getElementById('dict-notfound-state');
      const welcome = document.getElementById('dict-welcome-state');

      // Hide all states initially
      if (spinner) spinner.style.display = 'none';
      if (notFound) notFound.style.display = 'none';
      if (welcome) welcome.style.display = 'none';
      card.style.display = 'block';

      // Setup initial skeleton
      this.currentSearchResult = {
        word: word, phonetic: '', audioUrl: '', partOfSpeech: '',
        meaningEn: '', meaningVi: '', examples: [], synonyms: [], antonyms: []
      };

      document.getElementById('dict-display-word').textContent = word;
      document.getElementById('dict-display-phonetic').textContent = '...';
      document.getElementById('dict-display-pos').textContent = '';
      document.getElementById('dict-display-vi').textContent = 'Đang dịch...';
      document.getElementById('dict-display-en').textContent = 'Đang tải từ điển...';
      document.getElementById('dict-examples-container').style.display = 'none';
      document.getElementById('dict-synonyms-container').style.display = 'none';

      // Auto pronounce immediately
      SoundService.speak(word);

      // Trigger the asynchronous incremental lookup
      DictionaryService.performFastLookup(word, (data) => {
        if (data.notFound) {
           card.style.display = 'none';
           if (notFound) {
             notFound.style.display = 'block';
             document.getElementById('notfound-word-label').textContent = `"${word}"`;
           }
           this.currentSearchResult = null;
           return;
        }
        
        this.currentSearchResult = { ...this.currentSearchResult, ...data };
        this.renderPartialResult(this.currentSearchResult);
      });
    }

    static renderPartialResult(data) {
      document.getElementById('dict-display-word').textContent = data.word;
      
      const ipa = document.getElementById('dict-display-phonetic');
      if (data.phonetic) ipa.textContent = data.phonetic;
      else if (data.phonetic === '') ipa.textContent = '/.../';

      const pos = document.getElementById('dict-display-pos');
      if (data.partOfSpeech) pos.textContent = `(${data.partOfSpeech})`;

      const viEl = document.getElementById('dict-display-vi');
      if (data.meaningVi) viEl.textContent = data.meaningVi;
      else if (data.meaningVi === '') viEl.textContent = 'Chưa có nghĩa tiếng Việt. Bấm "+ Lưu vào sổ" để tự thêm.';

      const enEl = document.getElementById('dict-display-en');
      if (data.meaningEn) enEl.textContent = data.meaningEn;
      else if (data.meaningEn === '') enEl.textContent = '(Không có định nghĩa tiếng Anh)';

      // Examples
      const examplesContainer = document.getElementById('dict-examples-container');
      const examplesList = document.getElementById('dict-examples-list');
      if (data.examples && data.examples.length > 0) {
        examplesContainer.style.display = 'block';
        examplesList.innerHTML = '';
        data.examples.forEach(ex => {
          const li = document.createElement('li');
          li.className = 'example-item';
          li.innerHTML = `<div class="example-en">" ${ex.en} "</div>${ex.vi ? `<div class="example-vi">${ex.vi}</div>` : ''}`;
          examplesList.appendChild(li);
        });
      } else {
        examplesContainer.style.display = 'none';
      }

      // Synonyms
      const synContainer = document.getElementById('dict-synonyms-container');
      const synBox = document.getElementById('dict-synonyms-box');
      if (data.synonyms && data.synonyms.length > 0) {
        synContainer.style.display = 'block';
        synBox.innerHTML = '';
        data.synonyms.forEach(syn => {
          const chip = document.createElement('span');
          chip.className = 'synonym-chip';
          chip.textContent = syn;
          chip.addEventListener('click', () => {
            document.getElementById('dict-search-input').value = syn;
            AppController.performLookup(syn);
          });
          synBox.appendChild(chip);
        });
      } else {
        synContainer.style.display = 'none';
      }
    }

    static openSaveWordModal(wordData) {
      const notebooks = StorageManager.getNotebooks();
      const select = document.getElementById('save-word-notebook-select');
      select.innerHTML = '';

      if (notebooks.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '-- Hãy tạo sổ tay mới bên dưới --';
        select.appendChild(opt);
      } else {
        notebooks.forEach(nb => {
          const opt = document.createElement('option');
          opt.value = nb.id;
          opt.textContent = `${nb.name} (${nb.words.length} từ)`;
          select.appendChild(opt);
        });
      }

      // Pre-fill editable fields
      document.getElementById('save-word-text').value = wordData.word;
      document.getElementById('save-word-phonetic').value = wordData.phonetic || '';
      document.getElementById('save-word-pos').value = wordData.partOfSpeech || 'noun';
      document.getElementById('save-word-meaning-vi').value = wordData.meaningVi || '';
      document.getElementById('save-word-meaning-en').value = wordData.meaningEn || '';
      document.getElementById('save-word-example').value = wordData.examples?.[0]?.en || '';

      AppUI.openModal('modal-save-word');
    }

    static openManualAddModal(prefillWord = '') {
      const notebooks = StorageManager.getNotebooks();
      const select = document.getElementById('save-word-notebook-select');
      select.innerHTML = '';

      notebooks.forEach(nb => {
        const opt = document.createElement('option');
        opt.value = nb.id;
        opt.textContent = `${nb.name} (${nb.words.length} từ)`;
        select.appendChild(opt);
      });

      document.getElementById('save-word-text').value = prefillWord;
      document.getElementById('save-word-phonetic').value = '';
      document.getElementById('save-word-pos').value = 'noun';
      document.getElementById('save-word-meaning-vi').value = '';
      document.getElementById('save-word-meaning-en').value = '';
      document.getElementById('save-word-example').value = '';

      AppUI.openModal('modal-save-word');
    }

    // =======================================================================
    // NOTEBOOK EVENTS & MODALS
    // =======================================================================
    static bindNotebookEvents() {
      // Create Notebook Button
      const btnCreateNb = document.getElementById('btn-create-notebook');
      if (btnCreateNb) {
        btnCreateNb.addEventListener('click', () => {
          document.getElementById('create-nb-name').value = '';
          AppUI.openModal('modal-create-notebook');
        });
      }

      // Back to notebooks list
      const btnBackToList = document.getElementById('btn-back-to-notebooks');
      if (btnBackToList) {
        btnBackToList.addEventListener('click', () => {
          NotebookController.backToList();
        });
      }

      // Play game with notebook
      const btnPlayNb = document.getElementById('btn-play-current-notebook');
      if (btnPlayNb) {
        btnPlayNb.addEventListener('click', () => {
          if (AppController.currentNotebookId) {
            GameHubController.startWithDeck(AppController.currentNotebookId);
          }
        });
      }

      // Add word directly into current notebook
      const btnAddWordToNb = document.getElementById('btn-add-word-to-notebook');
      if (btnAddWordToNb) {
        btnAddWordToNb.addEventListener('click', () => {
          AppController.openManualAddModal();
          if (AppController.currentNotebookId) {
            document.getElementById('save-word-notebook-select').value = AppController.currentNotebookId;
          }
        });
      }

      // Bulk Select All
      const selectAll = document.getElementById('bulk-select-all');
      if (selectAll) {
        selectAll.addEventListener('change', (e) => {
          const checked = e.target.checked;
          document.querySelectorAll('.word-checkbox').forEach(cb => {
            cb.checked = checked;
          });
          NotebookController.updateBulkBarState();
        });
      }

      // Bulk Delete
      const btnBulkDelete = document.getElementById('btn-bulk-delete');
      if (btnBulkDelete) {
        btnBulkDelete.addEventListener('click', () => {
          const selected = NotebookController.getSelectedWordIds();
          if (selected.length === 0) return;
          if (confirm(`Bạn có chắc muốn xoá ${selected.length} từ đã chọn?`)) {
            StorageManager.bulkDeleteWords(AppController.currentNotebookId, selected);
            NotebookController.renderNotebookDetail(AppController.currentNotebookId);
            AppUI.showToast(`Đã xoá ${selected.length} từ`, 'success');
          }
        });
      }

      // Bulk Learn
      const btnBulkLearn = document.getElementById('btn-bulk-learn');
      if (btnBulkLearn) {
        btnBulkLearn.addEventListener('click', () => {
          const selected = NotebookController.getSelectedWordIds();
          if (selected.length === 0) return;
          const nb = StorageManager.getNotebook(AppController.currentNotebookId);
          if (!nb) return;
          const words = nb.words.filter(w => selected.includes(w.id));
          GameHubController.startWithCustomWords(words, `Từ đã chọn (${words.length})`);
        });
      }

      // Search words within notebook
      const searchNbWords = document.getElementById('notebook-word-search-input');
      if (searchNbWords) {
        searchNbWords.addEventListener('input', (e) => {
          const term = e.target.value.toLowerCase().trim();
          NotebookController.filterWordsInDetail(term);
        });
      }
    }

    static bindModalEvents() {
      // Close modal on click close button or backdrop
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.classList.remove('active');
          }
        });
        const closeBtn = overlay.querySelector('.btn-close-modal');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
          });
        }
      });

      // Color palette picker inside modal
      document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
          const parent = opt.parentElement;
          parent.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
        });
      });

      // Submit: Create Notebook Form
      const formCreateNb = document.getElementById('form-create-notebook');
      if (formCreateNb) {
        formCreateNb.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('create-nb-name').value.trim();
          if (!name) return;

          const selectedColor = document.querySelector('#modal-create-notebook .color-option.selected')?.getAttribute('data-color') || '#2563eb';
          const newNb = StorageManager.createNotebook(name, selectedColor);
          AppUI.closeModal('modal-create-notebook');
          NotebookController.renderNotebooks();
          AppUI.showToast(`Đã tạo sổ tay "${name}"!`, 'success');
        });
      }

      // Submit: Save Word to Notebook Form
      const formSaveWord = document.getElementById('form-save-word');
      if (formSaveWord) {
        formSaveWord.addEventListener('submit', (e) => {
          e.preventDefault();
          const wordText = document.getElementById('save-word-text').value.trim();
          if (!wordText) {
            AppUI.showToast('Vui lòng nhập từ tiếng Anh!', 'danger');
            return;
          }

          let notebookId = document.getElementById('save-word-notebook-select').value;
          const newNbName = document.getElementById('save-word-new-notebook-name').value.trim();

          // If user entered a new notebook name on the fly
          if (newNbName) {
            const newNb = StorageManager.createNotebook(newNbName);
            notebookId = newNb.id;
          }

          if (!notebookId) {
            AppUI.showToast('Vui lòng chọn hoặc tạo 1 sổ tay để lưu!', 'danger');
            return;
          }

          const wordData = {
            word: wordText,
            phonetic: document.getElementById('save-word-phonetic').value.trim(),
            partOfSpeech: document.getElementById('save-word-pos').value,
            meaningVi: document.getElementById('save-word-meaning-vi').value.trim(),
            meaningEn: document.getElementById('save-word-meaning-en').value.trim(),
            examples: []
          };

          const exampleText = document.getElementById('save-word-example').value.trim();
          if (exampleText) {
            wordData.examples.push({ en: exampleText, vi: '' });
          }

          const res = StorageManager.addWordToNotebook(notebookId, wordData);
          AppUI.closeModal('modal-save-word');

          if (res.alreadyExists) {
            AppUI.showToast(`Từ "${wordText}" đã có sẵn trong sổ tay này!`, 'info');
          } else {
            AppUI.showToast(`Đã lưu "${wordText}" vào sổ tay thành công!`, 'success');
            if (AppController.currentNotebookId === notebookId) {
              NotebookController.renderNotebookDetail(notebookId);
            }
          }
        });
      }

      // Submit: Edit Word Form
      const formEditWord = document.getElementById('form-edit-word');
      if (formEditWord) {
        formEditWord.addEventListener('submit', (e) => {
          e.preventDefault();
          const nbId = document.getElementById('edit-word-notebook-id').value;
          const wordId = document.getElementById('edit-word-id').value;
          
          const updates = {
            word: document.getElementById('edit-word-text').value.trim(),
            phonetic: document.getElementById('edit-word-phonetic').value.trim(),
            partOfSpeech: document.getElementById('edit-word-pos').value,
            meaningVi: document.getElementById('edit-word-meaning-vi').value.trim(),
            meaningEn: document.getElementById('edit-word-meaning-en').value.trim(),
          };

          const exEn = document.getElementById('edit-word-example-en').value.trim();
          const exVi = document.getElementById('edit-word-example-vi').value.trim();
          if (exEn) {
            updates.examples = [{ en: exEn, vi: exVi }];
          }

          StorageManager.updateWord(nbId, wordId, updates);
          AppUI.closeModal('modal-edit-word');
          NotebookController.renderNotebookDetail(nbId);
          AppUI.showToast('Đã cập nhật từ vựng!', 'success');
        });
      }

      // Import Excel Button & Form Handling
      const btnImportExcel = document.getElementById('btn-import-excel');
      if (btnImportExcel) {
        btnImportExcel.addEventListener('click', () => {
          const select = document.getElementById('import-excel-notebook-select');
          select.innerHTML = '<option value="">-- Tạo sổ tay mới --</option>';
          const nbs = StorageManager.getNotebooks();
          nbs.forEach(nb => {
            const opt = document.createElement('option');
            opt.value = nb.id;
            opt.textContent = `${nb.name} (${nb.words.length} từ)`;
            select.appendChild(opt);
          });
          
          document.getElementById('import-excel-file').value = '';
          document.getElementById('import-excel-new-notebook-name').value = '';
          document.getElementById('import-excel-new-notebook-name').required = true;
          document.getElementById('import-excel-new-notebook-group').style.display = 'block';

          AppUI.openModal('modal-import-excel');
        });
      }
      
      const selectImportNb = document.getElementById('import-excel-notebook-select');
      if (selectImportNb) {
        selectImportNb.addEventListener('change', (e) => {
          const newNbGroup = document.getElementById('import-excel-new-notebook-group');
          const newNbName = document.getElementById('import-excel-new-notebook-name');
          if (e.target.value === '') {
            newNbGroup.style.display = 'block';
            newNbName.required = true;
          } else {
            newNbGroup.style.display = 'none';
            newNbName.required = false;
          }
        });
      }

      const formImportExcel = document.getElementById('form-import-excel');
      if (formImportExcel) {
        formImportExcel.addEventListener('submit', (e) => {
          e.preventDefault();
          const fileInput = document.getElementById('import-excel-file');
          if (!fileInput.files.length) return;
          
          let notebookId = document.getElementById('import-excel-notebook-select').value;
          const newNbName = document.getElementById('import-excel-new-notebook-name').value.trim();
          
          const file = fileInput.files[0];
          const reader = new FileReader();
          
          reader.onload = (event) => {
            try {
              const data = new Uint8Array(event.target.result);
              const workbook = XLSX.read(data, {type: 'array'});
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              
              // We assume first row might be header: word, meaning_vi, phonetic, example
              // We'll read it as array of arrays
              const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1});
              
              if (rows.length === 0) {
                 AppUI.showToast('File Excel rỗng!', 'danger');
                 return;
              }
              
              let importedCount = 0;
              let hasCreatedNew = false;
              
              // Skip header if row 0 has strings that look like headers, but to be safe we just check if it's English word
              // A simple heuristic: start at 1 if length > 1, else 0
              let startIndex = 1;
              if (rows.length === 1) startIndex = 0;
              
              for (let i = startIndex; i < rows.length; i++) {
                 const row = rows[i];
                 if (!row || row.length === 0 || !row[0]) continue;
                 
                 const wordText = String(row[0]).trim();
                 if (!wordText) continue;
                 
                 // Create notebook only when we have valid words
                 if (!notebookId && !hasCreatedNew && newNbName) {
                    const newNb = StorageManager.createNotebook(newNbName);
                    notebookId = newNb.id;
                    hasCreatedNew = true;
                 }
                 if (!notebookId) break;
                 
                 const meaningVi = row[1] ? String(row[1]).trim() : '';
                 const phonetic = row[2] ? String(row[2]).trim() : '';
                 const example = row[3] ? String(row[3]).trim() : '';
                 
                 const wordData = {
                    word: wordText,
                    phonetic: phonetic,
                    partOfSpeech: 'noun',
                    meaningVi: meaningVi,
                    meaningEn: '',
                    examples: []
                 };
                 if (example) {
                    wordData.examples.push({ en: example, vi: '' });
                 }
                 
                 StorageManager.addWordToNotebook(notebookId, wordData);
                 importedCount++;
              }
              
              AppUI.closeModal('modal-import-excel');
              NotebookController.renderNotebooks();
              if (AppController.currentNotebookId === notebookId) {
                NotebookController.renderNotebookDetail(notebookId);
              }
              AppUI.showToast(`Đã import thành công ${importedCount} từ vựng!`, 'success');
              
            } catch (err) {
              console.error(err);
              AppUI.showToast('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng.', 'danger');
            }
          };
          reader.readAsArrayBuffer(file);
        });
      }
    }

    static bindGameEvents() {
      // Exit game buttons
      document.querySelectorAll('.btn-quit-game').forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm('Bạn có muốn thoát phiên học hiện tại?')) {
            GameHubController.showHub();
          }
        });
      });
    }
  }

  // =========================================================================
  // 6. NOTEBOOK CONTROLLER
  // =========================================================================
  class NotebookController {
    static renderNotebooks() {
      const container = document.getElementById('notebooks-grid-container');
      const emptyState = document.getElementById('notebooks-empty-state');
      const detailView = document.getElementById('notebook-detail-view');
      const listView = document.getElementById('notebooks-list-view');

      if (detailView) detailView.style.display = 'none';
      if (listView) listView.style.display = 'block';

      const notebooks = StorageManager.getNotebooks();
      container.innerHTML = '';

      if (notebooks.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
      }
      if (emptyState) emptyState.style.display = 'none';

      notebooks.forEach(nb => {
        const card = document.createElement('div');
        card.className = 'notebook-card';
        card.innerHTML = `
          <div class="notebook-color-stripe" style="background-color: ${nb.color || '#2563eb'};"></div>
          <div>
            <div class="notebook-card-header">
              <div class="notebook-card-icon" style="background: ${nb.color || '#2563eb'};">
                📚
              </div>
              <span class="badge">${nb.words.length} từ</span>
            </div>
            <div class="notebook-title">${nb.name}</div>
            <div class="notebook-meta">
              <span>📅 ${new Date(nb.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
          <div class="notebook-actions">
            <button class="btn btn-secondary btn-sm btn-open-nb" data-id="${nb.id}">Mở sổ tay</button>
            <button class="btn btn-primary btn-sm btn-learn-nb" data-id="${nb.id}" ${nb.words.length === 0 ? 'disabled' : ''}>
              🎮 Học ngay
            </button>
          </div>
        `;

        // Click whole card or button to open
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-learn-nb')) {
            e.stopPropagation();
            GameHubController.startWithDeck(nb.id);
            return;
          }
          NotebookController.renderNotebookDetail(nb.id);
        });

        container.appendChild(card);
      });
    }

    static renderNotebookDetail(notebookId) {
      AppController.currentNotebookId = notebookId;
      const nb = StorageManager.getNotebook(notebookId);
      if (!nb) return;

      const listView = document.getElementById('notebooks-list-view');
      const detailView = document.getElementById('notebook-detail-view');
      listView.style.display = 'none';
      detailView.style.display = 'block';

      document.getElementById('nb-detail-title').textContent = nb.name;
      document.getElementById('nb-detail-count-badge').textContent = `${nb.words.length} từ`;

      // Reset search & selection
      const searchInput = document.getElementById('notebook-word-search-input');
      if (searchInput) searchInput.value = '';
      const selectAll = document.getElementById('bulk-select-all');
      if (selectAll) selectAll.checked = false;
      this.updateBulkBarState();

      // Render Word Items
      this.renderWordsList(nb.words);
    }

    static renderWordsList(words) {
      const container = document.getElementById('nb-words-list-container');
      const emptyBox = document.getElementById('nb-words-empty-state');
      container.innerHTML = '';

      if (words.length === 0) {
        if (emptyBox) emptyBox.style.display = 'block';
        return;
      }
      if (emptyBox) emptyBox.style.display = 'none';

      words.forEach(w => {
        const item = document.createElement('div');
        item.className = 'word-card';
        item.setAttribute('data-word-id', w.id);
        item.setAttribute('data-search-text', `${w.word} ${w.meaningVi} ${w.meaningEn}`.toLowerCase());

        item.innerHTML = `
          <input type="checkbox" class="word-checkbox" value="${w.id}">
          <div class="word-main-info">
            <div class="word-title-line">
              <span class="word-english">${w.word}</span>
              ${w.phonetic ? `<span class="word-ipa">${w.phonetic}</span>` : ''}
              <span class="badge" style="background: var(--primary-light); color: var(--primary);">${w.partOfSpeech || 'noun'}</span>
              <button class="btn-icon btn-speak-word" title="Phát âm">🔊</button>
            </div>
            <div class="word-meaning-vi">🇻🇳 ${w.meaningVi || '<i style="color:var(--text-subtle);">Chưa có nghĩa tiếng Việt</i>'}</div>
            ${w.meaningEn ? `<div class="word-example-preview" style="color:var(--text-muted);">🇬🇧 ${w.meaningEn}</div>` : ''}
            ${w.examples && w.examples.length > 0 ? `<div class="word-example-preview">Ví dụ: "${w.examples[0].en}"</div>` : ''}
          </div>
          <div class="word-card-actions">
            <button class="btn-icon btn-edit-word" title="Chỉnh sửa từ">✏️</button>
            <button class="btn-icon btn-delete-word" title="Xoá khỏi sổ">🗑️</button>
          </div>
        `;

        // Pronounce when clicking speaker or anywhere on word info
        item.querySelector('.btn-speak-word').addEventListener('click', (e) => {
          e.stopPropagation();
          SoundService.speak(w.word, 0.9, w.audioUrl);
        });

        item.querySelector('.word-main-info').addEventListener('click', () => {
          SoundService.speak(w.word, 0.9, w.audioUrl);
        });

        // Edit
        item.querySelector('.btn-edit-word').addEventListener('click', (e) => {
          e.stopPropagation();
          NotebookController.openEditWordModal(AppController.currentNotebookId, w);
        });

        // Delete single
        item.querySelector('.btn-delete-word').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Bạn có chắc muốn xoá từ "${w.word}" khỏi sổ tay này?`)) {
            StorageManager.deleteWord(AppController.currentNotebookId, w.id);
            NotebookController.renderNotebookDetail(AppController.currentNotebookId);
            AppUI.showToast(`Đã xoá "${w.word}"`, 'info');
          }
        });

        // Checkbox change
        item.querySelector('.word-checkbox').addEventListener('change', () => {
          NotebookController.updateBulkBarState();
        });

        container.appendChild(item);
      });
    }

    static filterWordsInDetail(term) {
      const cards = document.querySelectorAll('#nb-words-list-container .word-card');
      cards.forEach(card => {
        const text = card.getAttribute('data-search-text') || '';
        if (text.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    static getSelectedWordIds() {
      const checked = document.querySelectorAll('.word-checkbox:checked');
      return Array.from(checked).map(c => c.value);
    }

    static updateBulkBarState() {
      const selected = this.getSelectedWordIds();
      const bar = document.getElementById('nb-bulk-actions-bar');
      const label = document.getElementById('bulk-selected-count');
      if (selected.length > 0) {
        bar.style.display = 'flex';
        label.textContent = `Đã chọn ${selected.length} từ`;
      } else {
        bar.style.display = 'none';
      }
    }

    static openEditWordModal(notebookId, word) {
      document.getElementById('edit-word-notebook-id').value = notebookId;
      document.getElementById('edit-word-id').value = word.id;
      document.getElementById('edit-word-text').value = word.word;
      document.getElementById('edit-word-phonetic').value = word.phonetic || '';
      document.getElementById('edit-word-pos').value = word.partOfSpeech || 'noun';
      document.getElementById('edit-word-meaning-vi').value = word.meaningVi || '';
      document.getElementById('edit-word-meaning-en').value = word.meaningEn || '';
      document.getElementById('edit-word-example-en').value = word.examples?.[0]?.en || '';
      document.getElementById('edit-word-example-vi').value = word.examples?.[0]?.vi || '';

      AppUI.openModal('modal-edit-word');
    }

    static backToList() {
      AppController.currentNotebookId = null;
      this.renderNotebooks();
    }
  }

  // =========================================================================
  // 7. VOCABULARY GAME ENGINES (Scramble, Quiz, Flashcards)
  // =========================================================================

  // Thuật toán xáo trộn chuẩn Fisher-Yates (Knuth) đảm bảo 100% ngẫu nhiên tuyệt đối
  function shuffleArray(array) {
    if (!Array.isArray(array) || array.length <= 1) return [...(array || [])];
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  class GameHubController {
    static selectedDeckId = 'all';
    static currentSessionWords = [];
    static customTitle = '';
    static selectedNotebookIds = new Set(); // Using Set to store selected notebook IDs

    static renderHub() {
      this.showHub();

      const checkboxList = document.getElementById('game-notebooks-checkbox-list');
      const checkAllBtn = document.getElementById('game-check-all-notebooks');
      
      if (!checkboxList) return;

      checkboxList.innerHTML = '';
      const notebooks = StorageManager.getNotebooks();
      
      // If none selected yet or coming from 'all', select all by default
      if (this.selectedNotebookIds.size === 0) {
         notebooks.forEach(nb => this.selectedNotebookIds.add(nb.id));
         if (checkAllBtn) checkAllBtn.checked = true;
      }

      notebooks.forEach(nb => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '8px';
        label.style.cursor = 'pointer';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'word-checkbox game-nb-cb';
        cb.value = nb.id;
        cb.checked = this.selectedNotebookIds.has(nb.id);

        cb.addEventListener('change', () => {
          if (cb.checked) {
            this.selectedNotebookIds.add(nb.id);
          } else {
            this.selectedNotebookIds.delete(nb.id);
          }
          this.syncCheckAllState();
          this.updateDeckWordCount();
        });

        const span = document.createElement('span');
        span.textContent = `Sổ tay: ${nb.name} (${nb.words.length} từ)`;

        label.appendChild(cb);
        label.appendChild(span);
        checkboxList.appendChild(label);
      });

      if (checkAllBtn) {
        this.syncCheckAllState();
        checkAllBtn.onclick = (e) => {
          const isChecked = e.target.checked;
          const cbs = document.querySelectorAll('.game-nb-cb');
          cbs.forEach(cb => {
            cb.checked = isChecked;
            if (isChecked) this.selectedNotebookIds.add(cb.value);
            else this.selectedNotebookIds.delete(cb.value);
          });
          this.updateDeckWordCount();
        };
      }

      this.updateDeckWordCount();

      // Game Mode cards click
      document.getElementById('mode-scramble-card').onclick = () => {
        this.launchGame('scramble');
      };
      document.getElementById('mode-quiz-en-vi-card').onclick = () => {
        this.launchGame('quiz_en_vi');
      };
      document.getElementById('mode-quiz-vi-en-card').onclick = () => {
        this.launchGame('quiz_vi_en');
      };
      document.getElementById('mode-flashcard-card').onclick = () => {
        this.launchGame('flashcard');
      };
    }

    static syncCheckAllState() {
      const checkAllBtn = document.getElementById('game-check-all-notebooks');
      if (!checkAllBtn) return;
      const total = StorageManager.getNotebooks().length;
      checkAllBtn.checked = (total > 0 && this.selectedNotebookIds.size === total);
    }

    static updateDeckWordCount() {
      const words = this.getWordsForCurrentSelection();
      const badge = document.getElementById('game-deck-count-badge');
      if (badge) {
        badge.textContent = `${words.length} từ khả dụng`;
      }
    }

    static getWordsForCurrentSelection() {
      if (this.currentSessionWords.length > 0 && this.customTitle) {
        return this.currentSessionWords;
      }
      const notebooks = StorageManager.getNotebooks();
      let combinedWords = [];
      notebooks.forEach(nb => {
        if (this.selectedNotebookIds.has(nb.id)) {
          combinedWords = combinedWords.concat(nb.words);
        }
      });
      // Deduplicate words if they exist in multiple notebooks
      const uniqueWords = [];
      const seen = new Set();
      combinedWords.forEach(w => {
         if (!seen.has(w.word.toLowerCase())) {
            seen.add(w.word.toLowerCase());
            uniqueWords.push(w);
         }
      });
      return uniqueWords;
    }

    static startWithDeck(notebookId) {
      this.selectedNotebookIds = new Set([notebookId]);
      this.customTitle = '';
      this.currentSessionWords = [];
      AppController.switchView('view-learn');
      this.renderHub();
    }

    static startWithCustomWords(words, title) {
      this.currentSessionWords = words;
      this.customTitle = title;
      AppController.switchView('view-learn');
      this.renderHub();
      const badge = document.getElementById('game-deck-count-badge');
      if (badge) badge.textContent = `${words.length} từ (${title})`;
    }

    static showHub() {
      document.getElementById('game-hub-view').style.display = 'block';
      document.getElementById('game-screen-scramble').style.display = 'none';
      document.getElementById('game-screen-quiz').style.display = 'none';
      document.getElementById('game-screen-flashcard').style.display = 'none';
      document.getElementById('game-screen-summary').style.display = 'none';
    }

    static launchGame(mode) {
      const words = this.getWordsForCurrentSelection();
      if (words.length === 0) {
        AppUI.showToast('Chưa có từ vựng nào trong bộ đã chọn để học! Hãy tra và lưu từ trước.', 'danger');
        return;
      }

      document.getElementById('game-hub-view').style.display = 'none';

      // Shuffle words for study session with Fisher-Yates
      const shuffled = shuffleArray(words);

      if (mode === 'scramble') {
        WordScrambleEngine.start(shuffled);
      } else if (mode === 'quiz_en_vi') {
        QuizEngine.start(shuffled, 'EN_TO_VI');
      } else if (mode === 'quiz_vi_en') {
        QuizEngine.start(shuffled, 'VI_TO_EN');
      } else if (mode === 'flashcard') {
        FlashcardEngine.start(shuffled);
      }
    }
  }

  // =========================================================================
  // 8. GAME 1: WORD SCRAMBLE ENGINE
  // =========================================================================
  class WordScrambleEngine {
    static words = [];
    static currentIndex = 0;
    static currentWordObj = null;
    static targetWord = '';
    static placedSlots = [];
    static scrambledBank = [];
    static mistakes = [];
    static score = 0;

    static start(wordsList) {
      this.words = shuffleArray(wordsList);
      this.currentIndex = 0;
      this.mistakes = [];
      this.score = 0;

      const screen = document.getElementById('game-screen-scramble');
      screen.style.display = 'block';

      this.loadWord();
    }

    static loadWord() {
      if (this.currentIndex >= this.words.length) {
        this.finishGame();
        return;
      }

      const screen = document.getElementById('game-screen-scramble');
      screen.style.display = 'block';

      this.currentWordObj = this.words[this.currentIndex];
      // Clean word letters: only letters, uppercase
      this.targetWord = this.currentWordObj.word.toUpperCase().trim();
      
      // Update Progress
      const progress = ((this.currentIndex) / this.words.length) * 100;
      document.getElementById('scramble-progress-fill').style.width = `${progress}%`;
      document.getElementById('scramble-progress-text').textContent = `${this.currentIndex + 1}/${this.words.length}`;
      document.getElementById('scramble-score-text').textContent = `Điểm: ${this.score}`;

      // Clue & Info
      document.getElementById('scramble-clue-vi').textContent = this.currentWordObj.meaningVi || 'Sắp xếp chữ cái';
      document.getElementById('scramble-clue-pos').textContent = `(${this.currentWordObj.partOfSpeech || 'từ vựng'})`;

      // Speaker button
      const speakBtn = document.getElementById('btn-scramble-speak');
      speakBtn.onclick = () => SoundService.speak(this.currentWordObj.word, 0.9, this.currentWordObj.audioUrl);

      // Tự động phát âm từ vựng ngay khi hiện từ
      SoundService.speak(this.currentWordObj.word, 0.9, this.currentWordObj.audioUrl);

      // Scramble letters
      const lettersArr = this.targetWord.split('').map((char, originalIndex) => ({
        id: 'char_' + originalIndex,
        char: char,
        placed: false
      }));

      // Ensure shuffle is different from target
      let shuffled = shuffleArray(lettersArr);
      if (shuffled.map(l => l.char).join('') === this.targetWord && this.targetWord.length > 2) {
        shuffled.reverse();
      }
      this.scrambledBank = shuffled;
      this.placedSlots = new Array(this.targetWord.length).fill(null);

      this.renderSlots();
      this.renderLettersPool();

      // Skip & Hint buttons
      document.getElementById('btn-scramble-skip').onclick = () => {
        this.mistakes.push(this.currentWordObj);
        StorageManager.updateWordReviewStats(this.currentWordObj.word, false);
        this.showAnswerAndNext();
      };
    }

    static renderSlots() {
      const container = document.getElementById('scramble-slots-container');
      container.innerHTML = '';

      for (let i = 0; i < this.targetWord.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'scramble-slot';
        const placed = this.placedSlots[i];

        if (placed) {
          slot.textContent = placed.char;
          slot.classList.add('filled');
          // Click slot to undo
          slot.onclick = () => this.undoSlot(i);
        } else {
          slot.textContent = '';
        }
        container.appendChild(slot);
      }
    }

    static renderLettersPool() {
      const container = document.getElementById('scramble-letters-pool');
      container.innerHTML = '';

      this.scrambledBank.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = item.char;
        btn.id = item.id;

        if (item.placed) {
          btn.classList.add('disabled');
          btn.disabled = true;
        } else {
          btn.onclick = () => this.onLetterClicked(item, btn);
        }

        container.appendChild(btn);
      });
    }

    static onLetterClicked(item, btnElement) {
      // Find current empty slot index
      const nextSlotIndex = this.placedSlots.findIndex(s => s === null);
      if (nextSlotIndex === -1) return;

      const expectedChar = this.targetWord[nextSlotIndex];

      // REQUIREMENT: Check if chosen letter is correct for current position
      if (item.char === expectedChar) {
        // CORRECT: Snap into slot
        item.placed = true;
        this.placedSlots[nextSlotIndex] = item;
        this.renderSlots();
        this.renderLettersPool();

        // Check if fully solved
        if (!this.placedSlots.includes(null)) {
          this.onWordCompleted();
        }
      } else {
        // WRONG: Immediate feedback (gentle shake + red), returned for user to retry
        SoundService.playWrongTone();
        btnElement.classList.add('wrong-shake');
        setTimeout(() => {
          btnElement.classList.remove('wrong-shake');
        }, 400);

        // Record mistake for review
        if (!this.mistakes.some(w => w.word === this.currentWordObj.word)) {
          this.mistakes.push(this.currentWordObj);
        }
      }
    }

    static undoSlot(slotIndex) {
      const placed = this.placedSlots[slotIndex];
      if (!placed) return;

      placed.placed = false;
      this.placedSlots[slotIndex] = null;
      this.renderSlots();
      this.renderLettersPool();
    }

    static onWordCompleted() {
      SoundService.playCorrectTone();
      this.score += 10;
      StorageManager.updateWordReviewStats(this.currentWordObj.word, true);

      // Highlight slots green
      document.querySelectorAll('.scramble-slot').forEach(slot => {
        slot.classList.add('correct');
      });

      // Auto advance after 1.2 seconds
      setTimeout(() => {
        this.currentIndex++;
        this.loadWord();
      }, 1200);
    }

    static showAnswerAndNext() {
      // Fill all slots with correct answer
      const container = document.getElementById('scramble-slots-container');
      container.innerHTML = '';
      for (let i = 0; i < this.targetWord.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'scramble-slot correct';
        slot.textContent = this.targetWord[i];
        container.appendChild(slot);
      }

      AppUI.showToast(`Đáp án đúng: ${this.targetWord}`, 'info');
      setTimeout(() => {
        this.currentIndex++;
        this.loadWord();
      }, 1500);
    }

    static finishGame() {
      document.getElementById('game-screen-scramble').style.display = 'none';
      GameSummaryController.showSummary({
        gameTitle: 'Sắp xếp chữ cái',
        totalQuestions: this.words.length,
        correctCount: this.words.length - this.mistakes.length,
        wrongCount: this.mistakes.length,
        mistakes: this.mistakes,
        onReplay: () => WordScrambleEngine.start(this.words),
        onReplayWrong: () => WordScrambleEngine.start(this.mistakes)
      });
    }
  }

  // =========================================================================
  // 9. GAME 2: TRẮC NGHIỆM ENGINE (Quiz: Anh-Việt & Việt-Anh)
  // =========================================================================
  class QuizEngine {
    static words = [];
    static mode = 'EN_TO_VI'; // 'EN_TO_VI' or 'VI_TO_EN'
    static currentIndex = 0;
    static currentWordObj = null;
    static mistakes = [];
    static score = 0;
    static canAnswer = true;

    static start(wordsList, mode = 'EN_TO_VI') {
      this.words = shuffleArray(wordsList);
      this.mode = mode;
      this.currentIndex = 0;
      this.mistakes = [];
      this.score = 0;

      const screen = document.getElementById('game-screen-quiz');
      screen.style.display = 'block';

      this.loadQuestion();
    }

    static loadQuestion() {
      if (this.currentIndex >= this.words.length) {
        this.finishGame();
        return;
      }

      this.canAnswer = true;
      this.currentWordObj = this.words[this.currentIndex];

      // Update progress & stats
      const progress = ((this.currentIndex) / this.words.length) * 100;
      document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
      document.getElementById('quiz-progress-text').textContent = `${this.currentIndex + 1}/${this.words.length}`;
      document.getElementById('quiz-score-text').textContent = `Điểm: ${this.score}`;

      const promptLabel = document.getElementById('quiz-prompt-label');
      const promptText = document.getElementById('quiz-prompt-text');
      const promptSub = document.getElementById('quiz-prompt-sub');
      const speakBtn = document.getElementById('btn-quiz-speak');

      if (this.mode === 'EN_TO_VI') {
        promptLabel.textContent = 'CHỌN NGHĨA TIẾNG VIỆT ĐÚNG:';
        promptText.textContent = this.currentWordObj.word;
        promptSub.textContent = `${this.currentWordObj.phonetic || ''} (${this.currentWordObj.partOfSpeech || 'từ'})`;
        speakBtn.style.display = 'inline-flex';
        speakBtn.onclick = () => SoundService.speak(this.currentWordObj.word, 0.9, this.currentWordObj.audioUrl);
        // Tự động phát âm câu hỏi tiếng Anh
        SoundService.speak(this.currentWordObj.word, 0.9, this.currentWordObj.audioUrl);
      } else {
        promptLabel.textContent = 'CHỌN TỪ TIẾNG ANH ĐÚNG:';
        promptText.textContent = this.currentWordObj.meaningVi || this.currentWordObj.word;
        promptSub.textContent = `(${this.currentWordObj.partOfSpeech || 'từ vựng'})`;
        speakBtn.style.display = 'none';
      }

      // Generate 4 options (1 correct + 3 distractors)
      const options = this.generateOptions();
      this.renderOptions(options);
    }

    static generateOptions() {
      const correctText = this.mode === 'EN_TO_VI' ? this.currentWordObj.meaningVi : this.currentWordObj.word;
      const options = [{ text: correctText, isCorrect: true }];

      // Pool for distractors
      const pool = [...this.words, ...FALLBACK_DISTRACTORS];
      const seen = new Set([correctText.toLowerCase()]);

      // Shuffle pool
      const shuffledPool = shuffleArray(pool);

      for (let item of shuffledPool) {
        if (options.length >= 4) break;
        const candidate = this.mode === 'EN_TO_VI' ? (item.meaningVi || item.meaningEn) : item.word;
        if (candidate && !seen.has(candidate.toLowerCase())) {
          seen.add(candidate.toLowerCase());
          options.push({ text: candidate, isCorrect: false });
        }
      }

      // If still less than 4, add generic distractors
      const fallbackList = ['hoàn thành', 'duy trì', 'thực hiện', 'phát triển'];
      let fbIdx = 0;
      while (options.length < 4) {
        const fb = fallbackList[fbIdx++] || `Lựa chọn ${options.length + 1}`;
        if (!seen.has(fb.toLowerCase())) {
          seen.add(fb.toLowerCase());
          options.push({ text: fb, isCorrect: false });
        }
      }

      // Shuffle the 4 options
      return shuffleArray(options);
    }

    static renderOptions(options) {
      const container = document.getElementById('quiz-options-grid');
      container.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `
          <span class="quiz-option-letter">${letters[idx]}</span>
          <span>${opt.text}</span>
        `;

        btn.onclick = () => {
          if (!this.canAnswer) return;
          this.handleAnswer(opt, btn, options);
        };

        container.appendChild(btn);
      });
    }

    static handleAnswer(selectedOpt, btnElement, allOptions) {
      this.canAnswer = false;
      const allBtns = document.querySelectorAll('.quiz-option-btn');

      if (selectedOpt.isCorrect) {
        // CORRECT
        SoundService.playCorrectTone();
        btnElement.classList.add('selected-correct');
        this.score += 10;
        StorageManager.updateWordReviewStats(this.currentWordObj.word, true);
      } else {
        // WRONG
        SoundService.playWrongTone();
        btnElement.classList.add('selected-wrong');
        this.mistakes.push(this.currentWordObj);
        StorageManager.updateWordReviewStats(this.currentWordObj.word, false);

        // Highlight correct answer
        allOptions.forEach((opt, idx) => {
          if (opt.isCorrect && allBtns[idx]) {
            allBtns[idx].classList.add('highlight-correct');
          }
        });
      }

      // Next after 1.2s
      setTimeout(() => {
        this.currentIndex++;
        this.loadQuestion();
      }, 1200);
    }

    static finishGame() {
      document.getElementById('game-screen-quiz').style.display = 'none';
      const title = this.mode === 'EN_TO_VI' ? 'Trắc nghiệm (Anh → Việt)' : 'Trắc nghiệm (Việt → Anh)';
      GameSummaryController.showSummary({
        gameTitle: title,
        totalQuestions: this.words.length,
        correctCount: this.words.length - this.mistakes.length,
        wrongCount: this.mistakes.length,
        mistakes: this.mistakes,
        onReplay: () => QuizEngine.start(this.words, this.mode),
        onReplayWrong: () => QuizEngine.start(this.mistakes, this.mode)
      });
    }
  }

  // =========================================================================
  // 10. GAME 3: FLASHCARDS ENGINE
  // =========================================================================
  class FlashcardEngine {
    static words = [];
    static currentIndex = 0;
    static currentWordObj = null;
    static isFlipped = false;
    static mastered = [];
    static needReview = [];

    static start(wordsList) {
      this.words = shuffleArray(wordsList);
      this.currentIndex = 0;
      this.mastered = [];
      this.needReview = [];

      const screen = document.getElementById('game-screen-flashcard');
      screen.style.display = 'block';

      this.loadCard();

      // Flip card on click
      const cardInner = document.getElementById('flashcard-inner');
      cardInner.onclick = () => this.flip();

      // Action buttons
      document.getElementById('btn-flashcard-again').onclick = () => this.recordResult(false);
      document.getElementById('btn-flashcard-good').onclick = () => this.recordResult(true);
    }

    static loadCard() {
      if (this.currentIndex >= this.words.length) {
        this.finish();
        return;
      }

      this.isFlipped = false;
      const cardInner = document.getElementById('flashcard-inner');
      cardInner.classList.remove('is-flipped');

      this.currentWordObj = this.words[this.currentIndex];

      // Progress
      const progress = (this.currentIndex / this.words.length) * 100;
      document.getElementById('flashcard-progress-fill').style.width = `${progress}%`;
      document.getElementById('flashcard-progress-text').textContent = `${this.currentIndex + 1}/${this.words.length}`;

      // Front
      document.getElementById('flashcard-front-word').textContent = this.currentWordObj.word;
      document.getElementById('flashcard-front-phonetic').textContent = this.currentWordObj.phonetic || '';
      document.getElementById('btn-flashcard-speak').onclick = (e) => {
        e.stopPropagation();
        SoundService.speak(this.currentWordObj.word, 0.9, this.currentWordObj.audioUrl);
      };

      // Back
      document.getElementById('flashcard-back-vi').textContent = this.currentWordObj.meaningVi || '(Chưa có nghĩa)';
      document.getElementById('flashcard-back-en').textContent = this.currentWordObj.meaningEn || '';
      const exEl = document.getElementById('flashcard-back-example');
      if (this.currentWordObj.examples && this.currentWordObj.examples.length > 0) {
        exEl.textContent = `"${this.currentWordObj.examples[0].en}"`;
        exEl.style.display = 'block';
      } else {
        exEl.style.display = 'none';
      }

      // Tự động phát âm khi hiện thẻ
      SoundService.speak(this.currentWordObj.word, 0.9, this.currentWordObj.audioUrl);
    }

    static flip() {
      const cardInner = document.getElementById('flashcard-inner');
      this.isFlipped = !this.isFlipped;
      cardInner.classList.toggle('is-flipped', this.isFlipped);
      if (this.currentWordObj) {
        SoundService.speak(this.currentWordObj.word, 0.9, this.currentWordObj.audioUrl);
      }
    }

    static recordResult(isMastered) {
      if (isMastered) {
        this.mastered.push(this.currentWordObj);
        StorageManager.updateWordReviewStats(this.currentWordObj.word, true);
        SoundService.playCorrectTone();
      } else {
        this.needReview.push(this.currentWordObj);
        StorageManager.updateWordReviewStats(this.currentWordObj.word, false);
        SoundService.playWrongTone();
      }

      this.currentIndex++;
      this.loadCard();
    }

    static finish() {
      document.getElementById('game-screen-flashcard').style.display = 'none';
      GameSummaryController.showSummary({
        gameTitle: 'Flashcard Lật Thẻ',
        totalQuestions: this.words.length,
        correctCount: this.mastered.length,
        wrongCount: this.needReview.length,
        mistakes: this.needReview,
        onReplay: () => FlashcardEngine.start(this.words),
        onReplayWrong: () => FlashcardEngine.start(this.needReview)
      });
    }
  }

  // =========================================================================
  // 11. GAME SUMMARY CONTROLLER
  // =========================================================================
  class GameSummaryController {
    static showSummary({ gameTitle, totalQuestions, correctCount, wrongCount, mistakes, onReplay, onReplayWrong }) {
      const screen = document.getElementById('game-screen-summary');
      screen.style.display = 'block';

      const pct = Math.round((correctCount / totalQuestions) * 100) || 0;
      document.getElementById('summary-game-title').textContent = gameTitle;
      document.getElementById('summary-score-percent').textContent = `${pct}%`;
      document.getElementById('summary-correct-count').textContent = correctCount;
      document.getElementById('summary-wrong-count').textContent = wrongCount;

      const circle = document.getElementById('summary-score-circle');
      if (circle) {
        circle.style.setProperty('--score-pct', pct);
      }

      // Render Wrong Words
      const wrongListContainer = document.getElementById('summary-wrong-list-container');
      const wrongList = document.getElementById('summary-wrong-list');
      const btnReplayWrong = document.getElementById('btn-summary-replay-wrong');
      wrongList.innerHTML = '';

      if (mistakes && mistakes.length > 0) {
        wrongListContainer.style.display = 'block';
        btnReplayWrong.style.display = 'inline-flex';

        mistakes.forEach(w => {
          const item = document.createElement('div');
          item.className = 'card';
          item.style.padding = '10px 14px';
          item.style.marginBottom = '8px';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';

          item.innerHTML = `
            <div>
              <span style="font-weight: 700; color: var(--text-main); font-size: 1.05rem;">${w.word}</span>
              <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">${w.phonetic || ''}</span>
              <div style="font-size: 0.9rem; color: var(--primary); font-weight: 500;">${w.meaningVi || ''}</div>
            </div>
            <button class="btn-icon btn-speak-sm" title="Phát âm">🔊</button>
          `;

          item.querySelector('.btn-speak-sm').onclick = () => SoundService.speak(w.word, 0.9, w.audioUrl);
          wrongList.appendChild(item);
        });

        btnReplayWrong.onclick = () => {
          screen.style.display = 'none';
          onReplayWrong();
        };
      } else {
        wrongListContainer.style.display = 'none';
        btnReplayWrong.style.display = 'none';
      }

      // Replay All button
      document.getElementById('btn-summary-replay-all').onclick = () => {
        screen.style.display = 'none';
        onReplay();
      };

      // Back to Hub
      document.getElementById('btn-summary-back-hub').onclick = () => {
        screen.style.display = 'none';
        GameHubController.showHub();
      };
    }
  }

  // =========================================================================
  // 12. STATS & SETTINGS CONTROLLER
  // =========================================================================
  class StatsController {
    static renderStats() {
      const notebooks = StorageManager.getNotebooks();
      const allWords = StorageManager.getAllWords();

      let totalReviews = 0;
      let totalCorrect = 0;
      let masteredWords = 0;

      allWords.forEach(w => {
        if (w.reviewStats) {
          const correct = w.reviewStats.correct || 0;
          const wrong = w.reviewStats.wrong || 0;
          totalReviews += (correct + wrong);
          totalCorrect += correct;
          if (correct >= 3 && wrong === 0) masteredWords++;
        }
      });

      const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

      const elTotalWords = document.getElementById('stat-total-words');
      const elTotalNbs = document.getElementById('stat-total-notebooks');
      const elTotalReviews = document.getElementById('stat-total-reviews');
      const elAccuracy = document.getElementById('stat-accuracy-rate');

      if (elTotalWords) elTotalWords.textContent = allWords.length;
      if (elTotalNbs) elTotalNbs.textContent = notebooks.length;
      if (elTotalReviews) elTotalReviews.textContent = totalReviews;
      if (elAccuracy) elAccuracy.textContent = `${accuracy}%`;

      // Export / Import Data handlers
      const btnExport = document.getElementById('btn-export-data');
      if (btnExport) {
        btnExport.onclick = () => this.exportData();
      }

      const inputImport = document.getElementById('input-import-file');
      if (inputImport) {
        inputImport.onchange = (e) => this.importData(e);
      }

      const btnSyncCode = document.getElementById('btn-sync-code');
      if (btnSyncCode) {
        btnSyncCode.onclick = () => {
          AppUI.openModal('modal-sync-code');
          this.initSyncCodeModal();
        };
      }

      const btnCopySyncCode = document.getElementById('btn-copy-sync-code');
      if (btnCopySyncCode) {
        btnCopySyncCode.onclick = () => {
          const codeInput = document.getElementById('sync-code-output');
          if (codeInput && codeInput.value) {
            navigator.clipboard.writeText(codeInput.value).then(() => {
              AppUI.showToast('Đã sao chép mã đồng bộ!', 'success');
            }).catch(() => {
              codeInput.select();
              document.execCommand('copy');
              AppUI.showToast('Đã sao chép mã đồng bộ!', 'success');
            });
          }
        };
      }

      const btnApplySyncCode = document.getElementById('btn-apply-sync-code');
      if (btnApplySyncCode) {
        btnApplySyncCode.onclick = () => {
          this.applySyncCode();
        };
      }

      const btnReset = document.getElementById('btn-reset-default-data');
      if (btnReset) {
        btnReset.onclick = () => {
          if (confirm('Khôi phục lại dữ liệu mẫu ban đầu? Tất cả từ đã lưu tự tạo sẽ bị ghi đè!')) {
            StorageManager.saveData(DEFAULT_DATA);
            NotebookController.renderNotebooks();
            this.renderStats();
            AppUI.showToast('Đã khôi phục dữ liệu mẫu thành công!', 'success');
          }
        };
      }
    }

    static initSyncCodeModal() {
      const output = document.getElementById('sync-code-output');
      const input = document.getElementById('sync-code-input');
      if (input) input.value = '';
      if (output) {
        try {
          const data = StorageManager.getData();
          const jsonStr = JSON.stringify(data);
          // Mã hóa an toàn UTF-8 sang Base64
          const encoded = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
          }));
          output.value = encoded;
        } catch (err) {
          console.error('Lỗi mã hóa sync code', err);
          output.value = '';
          AppUI.showToast('Không thể tạo mã đồng bộ!', 'danger');
        }
      }
    }

    static applySyncCode() {
      const input = document.getElementById('sync-code-input');
      if (!input || !input.value.trim()) {
        AppUI.showToast('Vui lòng dán mã đồng bộ vào ô trước!', 'warning');
        return;
      }

      try {
        const rawCode = input.value.trim();
        // Giải mã an toàn Base64 sang UTF-8
        const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(rawCode), (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const parsed = JSON.parse(jsonStr);
        if (parsed && Array.isArray(parsed.notebooks)) {
          let totalWords = 0;
          parsed.notebooks.forEach(nb => {
            if (Array.isArray(nb.words)) totalWords += nb.words.length;
          });
          if (confirm(`Tìm thấy ${parsed.notebooks.length} sổ tay (${totalWords} từ vựng). Bạn có muốn nạp dữ liệu này vào máy không? (Dữ liệu cũ sẽ được cập nhật)`)) {
            StorageManager.saveData(parsed);
            NotebookController.renderNotebooks();
            this.renderStats();
            AppUI.closeModal('modal-sync-code');
            AppUI.showToast(`Đã nạp thành công ${parsed.notebooks.length} sổ tay và ${totalWords} từ vựng!`, 'success');
          }
        } else {
          AppUI.showToast('Mã đồng bộ không hợp lệ!', 'danger');
        }
      } catch (err) {
        console.error('Lỗi giải mã sync code', err);
        AppUI.showToast('Mã đồng bộ bị lỗi hoặc không đúng định dạng!', 'danger');
      }
    }

    static exportData() {
      const data = StorageManager.getData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VocaMini_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      AppUI.showToast('Đã xuất file sao lưu thành công!', 'success');
    }

    static importData(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && Array.isArray(parsed.notebooks)) {
            StorageManager.saveData(parsed);
            NotebookController.renderNotebooks();
            this.renderStats();
            AppUI.showToast('Đã nhập dữ liệu thành công!', 'success');
          } else {
            AppUI.showToast('File JSON không đúng định dạng VocaMini!', 'danger');
          }
        } catch (err) {
          AppUI.showToast('Lỗi khi đọc file JSON!', 'danger');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  }


  // =========================================================================
  // READING CONTROLLER – Đọc bài & Lưu từ vào sổ tay
  // =========================================================================
  class ReadingController {
    static currentWordData = null;  // Data of the word currently in popup
    static currentWordEl  = null;   // DOM span of the word currently in popup
    static sessionSavedWords = [];  // Words saved this session
    static fontSize = 1.1;          // rem, default
    static popup = null;
    static popupVisible = false;

    // -----------------------------------------------------------------------
    // SAMPLE ARTICLES – built-in reading materials
    // -----------------------------------------------------------------------
    static SAMPLES = [
      {
        level: 'beginner',
        title: 'The Importance of Sleep',
        words: 120,
        preview: 'Sleep is essential for our health. When we sleep, our body repairs itself and our brain consolidates memories...',
        text: `Sleep is essential for our health. When we sleep, our body repairs itself and our brain consolidates memories from the day. Most adults need between seven and nine hours of sleep every night. Without enough sleep, people feel tired, irritable, and find it hard to concentrate. Chronic sleep deprivation can lead to serious health problems such as obesity, diabetes, and heart disease.

There are several ways to improve your sleep quality. First, try to go to bed at the same time every night. Second, avoid screens such as phones and computers before bedtime, because the blue light they emit signals your brain to stay awake. Third, keep your bedroom cool, dark, and quiet. Finally, limit caffeine intake, especially in the afternoon and evening.

Good sleep habits are an investment in your long-term health and well-being. If you consistently struggle to sleep, speak to a doctor, as there may be an underlying medical condition affecting your rest.`
      },
      {
        level: 'intermediate',
        title: 'The Rise of Remote Work',
        words: 180,
        preview: 'The COVID-19 pandemic fundamentally transformed how millions of people around the world approach their professional lives...',
        text: `The COVID-19 pandemic fundamentally transformed how millions of people around the world approach their professional lives. Remote work, once considered a perk for a select few, rapidly became the default mode of operation for companies across virtually every industry. As a result, employees gained greater flexibility while organisations were forced to rethink traditional workplace structures.

Despite its many advantages, remote work also presents significant challenges. Collaboration suffers when teams are physically separated, and the boundaries between professional and personal life can blur when your home doubles as your office. Feelings of isolation and disengagement are reported frequently among remote workers, especially those who live alone.

Nevertheless, many businesses have discovered that productivity does not necessarily decline when employees work from home. In fact, several studies indicate that remote workers often accomplish more in fewer hours. This realisation has prompted a growing number of companies to adopt hybrid models, allowing staff to split their time between the office and home. As technology continues to evolve, remote work appears likely to remain a permanent feature of the modern professional landscape.`
      },
      {
        level: 'advanced',
        title: 'Artificial Intelligence and Ethical Dilemmas',
        words: 220,
        preview: 'As artificial intelligence systems grow increasingly sophisticated, society faces profound ethical dilemmas that challenge our fundamental assumptions...',
        text: `As artificial intelligence systems grow increasingly sophisticated, society faces profound ethical dilemmas that challenge our fundamental assumptions about autonomy, responsibility, and fairness. Machine learning algorithms now inform decisions ranging from loan approvals and hiring processes to criminal sentencing recommendations and medical diagnoses. The opacity of many of these systems, often described as "black boxes," raises serious questions about accountability when errors occur.

One of the most contentious debates centres on algorithmic bias. Researchers have demonstrated that AI models trained on historical data frequently perpetuate and even amplify existing societal biases. A facial recognition system that performs poorly on darker skin tones, or a recidivism prediction tool that systematically disadvantages minority groups, can cause tangible harm. Addressing this requires not merely technical solutions but a fundamental reconsideration of how training data is curated and labelled.

The proliferation of generative AI also introduces unprecedented challenges around intellectual property, disinformation, and the nature of creative authorship. Deepfake technology enables the fabrication of realistic audio and video content, threatening democratic discourse and personal privacy alike. Regulatory frameworks are struggling to keep pace with these developments, and international coordination remains elusive.

Ultimately, navigating these dilemmas demands interdisciplinary collaboration among technologists, ethicists, policymakers, and the broader public. Ensuring that AI serves humanity's best interests requires proactive governance, transparent development practices, and an unwavering commitment to equitable outcomes.`
      },
      {
        level: 'beginner',
        title: 'Healthy Eating Habits',
        words: 130,
        preview: 'Eating well is one of the most important things you can do for your health. A balanced diet provides the nutrients your body needs...',
        text: `Eating well is one of the most important things you can do for your health. A balanced diet provides the nutrients your body needs to function properly, maintain a healthy weight, and reduce the risk of chronic disease.

A nutritious meal plan includes plenty of fruits and vegetables, whole grains, lean proteins such as fish, chicken, and legumes, and healthy fats from sources like avocado, nuts, and olive oil. It also means limiting processed foods, sugary drinks, and excessive salt and saturated fat.

Cooking at home gives you control over ingredients and portion sizes. When shopping, try to choose fresh, seasonal produce and read nutrition labels carefully. Eating slowly and mindfully helps your body recognise fullness, preventing overeating.

Small, consistent changes—such as replacing white bread with whole grain or swapping sugary snacks for fruit—can make a significant difference over time. Remember, a healthy diet is not about strict deprivation but about nourishing your body with the right fuel.`
      },
      {
        level: 'intermediate',
        title: 'Climate Change and Renewable Energy',
        words: 175,
        preview: 'Climate change represents one of the most pressing challenges of the twenty-first century. Rising global temperatures, driven primarily by greenhouse gas emissions...',
        text: `Climate change represents one of the most pressing challenges of the twenty-first century. Rising global temperatures, driven primarily by greenhouse gas emissions from burning fossil fuels, are causing ice caps to melt, sea levels to rise, and extreme weather events to become more frequent and severe.

Transitioning to renewable energy sources is widely regarded as an essential component of any meaningful response to climate change. Solar and wind power have experienced dramatic cost reductions over the past decade, making them increasingly competitive with coal and natural gas. Countries including Germany, Denmark, and Costa Rica have demonstrated that substantial portions of national electricity grids can be powered by renewables without compromising reliability.

However, the transition is not without obstacles. Energy storage technology must advance significantly to address the intermittent nature of solar and wind generation. Existing infrastructure requires considerable investment to accommodate new energy sources. Furthermore, communities dependent on fossil fuel industries face economic disruption and require dedicated support programmes.

International cooperation is critical. Agreements such as the Paris Accord establish shared targets, but implementation remains uneven across nations. Bold policy action, combined with technological innovation and changes in consumer behaviour, will be necessary to limit global warming to manageable levels and safeguard the planet for future generations.`
      }
    ];

    // -----------------------------------------------------------------------
    // INIT
    // -----------------------------------------------------------------------
    static init() {
      this.popup = document.getElementById('reading-word-popup');
      this.bindInputScreenEvents();
      this.bindPopupEvents();
      this.renderSamples();
      this.bindScrollProgress();
    }

    // -----------------------------------------------------------------------
    // INPUT SCREEN
    // -----------------------------------------------------------------------
    static bindInputScreenEvents() {
      // Tab switching
      document.querySelectorAll('.reading-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          document.querySelectorAll('.reading-tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.reading-tab-content').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          const tabEl = document.getElementById(tabId);
          if (tabEl) tabEl.classList.add('active');
        });
      });

      // Character count
      const textarea = document.getElementById('reading-paste-input');
      const charCount = document.getElementById('reading-char-count');
      if (textarea && charCount) {
        textarea.addEventListener('input', () => {
          charCount.textContent = textarea.value.length.toLocaleString('vi') + ' ký tự';
        });
      }

      // Clear text
      const clearBtn = document.getElementById('btn-reading-clear-text');
      if (clearBtn && textarea) {
        clearBtn.addEventListener('click', () => {
          textarea.value = '';
          if (charCount) charCount.textContent = '0 ký tự';
          textarea.focus();
        });
      }

      // Start reading
      const startBtn = document.getElementById('btn-reading-start');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          const text = textarea ? textarea.value.trim() : '';
          if (!text || text.length < 20) {
            AppUI.showToast('Vui lòng nhập ít nhất 20 ký tự văn bản!', 'danger');
            return;
          }
          this.startReading(text, null);
        });
      }

      // Fetch URL
      const fetchBtn = document.getElementById('btn-reading-fetch-url');
      if (fetchBtn) {
        fetchBtn.addEventListener('click', () => this.fetchUrl());
      }

      // URL input: press Enter
      const urlInput = document.getElementById('reading-url-input');
      if (urlInput) {
        urlInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); this.fetchUrl(); }
        });
      }

      // Back button
      const backBtn = document.getElementById('btn-reading-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.goBackToInput());
      }

      // New session
      const newSessionBtn = document.getElementById('btn-reading-new-session');
      if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => this.goBackToInput());
      }

      // Font size controls
      const fontInc = document.getElementById('btn-reading-font-increase');
      const fontDec = document.getElementById('btn-reading-font-decrease');
      if (fontInc) fontInc.addEventListener('click', () => this.changeFontSize(0.1));
      if (fontDec) fontDec.addEventListener('click', () => this.changeFontSize(-0.1));
    }

    static async fetchUrl() {
      const urlInput = document.getElementById('reading-url-input');
      const statusEl = document.getElementById('reading-fetch-status');
      const url = urlInput ? urlInput.value.trim() : '';

      if (!url || !url.startsWith('http')) {
        AppUI.showToast('Vui lòng nhập URL hợp lệ (bắt đầu bằng http/https)!', 'danger');
        return;
      }

      if (statusEl) statusEl.textContent = '⏳ Đang tải bài viết...';

      // Use AllOrigins proxy to bypass CORS
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      try {
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        const html = data.contents;

        // Parse HTML to extract text content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract title
        const title = doc.querySelector('title')?.textContent || '';

        // Remove scripts, styles, nav, footer, aside
        ['script', 'style', 'nav', 'footer', 'aside', 'header', 'figure', 'figcaption'].forEach(tag => {
          doc.querySelectorAll(tag).forEach(el => el.remove());
        });

        // Try to get main article content
        const contentSelectors = ['article', 'main', '[role="main"]', '.article-body', '.story-body', '.entry-content', '.post-content', '.content'];
        let contentEl = null;
        for (const sel of contentSelectors) {
          contentEl = doc.querySelector(sel);
          if (contentEl) break;
        }
        if (!contentEl) contentEl = doc.body;

        // Extract paragraphs
        const paragraphs = contentEl ? Array.from(contentEl.querySelectorAll('p, h1, h2, h3')).map(el => el.textContent.trim()).filter(t => t.length > 30) : [];
        const text = paragraphs.join('\n\n');

        if (!text || text.length < 50) {
          if (statusEl) statusEl.textContent = '❌ Không thể trích xuất nội dung. Hãy copy-paste thủ công.';
          return;
        }

        if (statusEl) statusEl.textContent = '✅ Đã tải thành công!';
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);

        this.startReading(text, title.trim());
      } catch (err) {
        if (statusEl) statusEl.textContent = '❌ Không tải được (có thể do CORS). Hãy copy-paste văn bản thủ công.';
        console.warn('URL fetch error:', err);
      }
    }

    static renderSamples() {
      const container = document.getElementById('reading-samples-list');
      if (!container) return;

      container.innerHTML = this.SAMPLES.map((s, i) => {
        const levelClass = { beginner: 'level-beginner', intermediate: 'level-intermediate', advanced: 'level-advanced' }[s.level] || 'level-beginner';
        const levelText = { beginner: 'Cơ bản', intermediate: 'Trung cấp', advanced: 'Nâng cao' }[s.level] || s.level;
        return `
          <div class="reading-sample-card" data-sample-idx="${i}">
            <span class="reading-sample-level ${levelClass}">${levelText}</span>
            <div class="reading-sample-title">${s.title}</div>
            <div class="reading-sample-preview">${s.preview}</div>
            <div class="reading-sample-meta">
              <span>📄 ~${s.words} từ</span>
            </div>
          </div>`;
      }).join('');

      container.querySelectorAll('.reading-sample-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.getAttribute('data-sample-idx'));
          const sample = this.SAMPLES[idx];
          if (sample) this.startReading(sample.text, sample.title);
        });
      });
    }

    // -----------------------------------------------------------------------
    // START READING SESSION
    // -----------------------------------------------------------------------
    static startReading(text, title) {
      // Reset session state
      this.sessionSavedWords = [];
      this.closePopup();

      // Switch screens
      document.getElementById('reading-input-screen').style.display = 'none';
      document.getElementById('reading-active-screen').style.display = 'block';
      document.getElementById('reading-session-summary').style.display = 'none';
      document.getElementById('reading-scroll-progress').style.width = '0%';

      // Article title
      const titleEl = document.getElementById('reading-article-title');
      if (titleEl) {
        if (title) {
          titleEl.textContent = title;
          titleEl.style.display = 'block';
        } else {
          titleEl.style.display = 'none';
        }
      }

      // Tokenize and render
      const contentArea = document.getElementById('reading-content-area');
      if (contentArea) {
        contentArea.innerHTML = this.tokenizeText(text);
        contentArea.querySelectorAll('.r-word').forEach(wordEl => {
          wordEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onWordClick(wordEl, e);
          });
        });
      }

      // Update saved badge
      this.updateSavedBadge();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // -----------------------------------------------------------------------
    // TEXT TOKENIZER
    // -----------------------------------------------------------------------
    static tokenizeText(text) {
      // Get all words already saved in notebooks for pre-highlighting
      const savedWords = new Set(
        StorageManager.getAllWords().map(w => w.word.toLowerCase())
      );

      // Split text into paragraphs
      const paragraphs = text.split(/\n+/);
      let html = '';

      paragraphs.forEach(para => {
        para = para.trim();
        if (!para) return;

        // Tokenize into words and non-words
        const tokens = para.split(/(\b[a-zA-Z']+\b)/);

        let paraHtml = '';
        tokens.forEach(token => {
          if (/^[a-zA-Z']+$/.test(token)) {
            const clean = token.replace(/^'+|'+$/g, '').toLowerCase();
            const isSaved = savedWords.has(clean);
            const stateClass = isSaved ? ' saved' : '';
            const escapedToken = this.escapeHtml(token);
            paraHtml += `<span class="r-word${stateClass}" data-word="${clean}">${escapedToken}</span>`;
          } else {
            paraHtml += `<span class="r-punct">${this.escapeHtml(token)}</span>`;
          }
        });

        html += `<p style="margin-bottom: 1em;">${paraHtml}</p>`;
      });

      return html;
    }

    static escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // -----------------------------------------------------------------------
    // WORD CLICK → POPUP
    // -----------------------------------------------------------------------
    static onWordClick(wordEl, event) {
      const word = wordEl.getAttribute('data-word');
      if (!word || word.length < 2) return;

      // Mark as "looked" if not already saved
      if (!wordEl.classList.contains('saved')) {
        wordEl.classList.add('looked');
        // Also mark all same words in the text
        document.querySelectorAll(`.r-word[data-word="${word}"]`).forEach(el => {
          if (!el.classList.contains('saved')) el.classList.add('looked');
        });
      }

      this.currentWordEl = wordEl;
      this.showPopup(word, event);
    }

    static showPopup(word, event) {
      if (!this.popup) return;

      // Reset popup state
      document.getElementById('rwp-word').textContent = word;
      document.getElementById('rwp-phonetic').textContent = '';
      document.getElementById('rwp-loading').style.display = 'flex';
      document.getElementById('rwp-content').style.display = 'none';
      document.getElementById('rwp-saved-badge').style.display = 'none';
      document.getElementById('rwp-meaning-vi').textContent = '';
      document.getElementById('rwp-meaning-en').textContent = '';
      document.getElementById('rwp-pos').textContent = '';
      document.getElementById('rwp-example').style.display = 'none';

      // Populate notebook select
      this.populateRwpNotebookSelect();

      // Check if already saved
      const allSaved = StorageManager.getAllWords();
      const existingSaved = allSaved.find(w => w.word.toLowerCase() === word.toLowerCase());
      if (existingSaved) {
        document.getElementById('btn-rwp-save').textContent = '✓ Đã lưu';
        document.getElementById('btn-rwp-save').disabled = true;
        document.getElementById('btn-rwp-save').style.opacity = '0.6';
      } else {
        document.getElementById('btn-rwp-save').textContent = '+ Lưu';
        document.getElementById('btn-rwp-save').disabled = false;
        document.getElementById('btn-rwp-save').style.opacity = '1';
      }

      // Position popup near click
      this.positionPopup(event);

      this.popup.classList.add('visible');
      this.popupVisible = true;
      this.currentWordData = { word, phonetic: '', audioUrl: '', partOfSpeech: '', meaningEn: '', meaningVi: '', examples: [] };

      // Fetch word data
      DictionaryService.performFastLookup(word, (result) => {
        this.currentWordData = result;
        document.getElementById('rwp-loading').style.display = 'none';
        document.getElementById('rwp-content').style.display = 'block';

        if (result.phonetic) document.getElementById('rwp-phonetic').textContent = result.phonetic;
        if (result.partOfSpeech) document.getElementById('rwp-pos').textContent = result.partOfSpeech;
        if (result.meaningVi) document.getElementById('rwp-meaning-vi').textContent = result.meaningVi;
        if (result.meaningEn) document.getElementById('rwp-meaning-en').textContent = result.meaningEn;

        if (result.examples && result.examples.length > 0) {
          const exEl = document.getElementById('rwp-example');
          exEl.textContent = '"' + result.examples[0].en + '"';
          exEl.style.display = 'block';
        }
      });

      // Auto-pronounce
      SoundService.speak(word);
    }

    static positionPopup(event) {
      if (!this.popup) return;
      const popup = this.popup;
      popup.style.left = '';
      popup.style.top = '';
      popup.style.right = '';
      popup.style.bottom = '';

      const margin = 12;
      const vpW = window.innerWidth;
      const vpH = window.innerHeight;
      const popW = 320;
      const popH = 300; // estimated

      let x = event.clientX + margin;
      let y = event.clientY + margin;

      if (x + popW > vpW - margin) x = event.clientX - popW - margin;
      if (y + popH > vpH - margin) y = event.clientY - popH - margin;
      if (x < margin) x = margin;
      if (y < margin) y = margin;

      popup.style.left = x + 'px';
      popup.style.top = y + 'px';
    }

    static closePopup() {
      if (this.popup) this.popup.classList.remove('visible');
      this.popupVisible = false;
      this.currentWordEl = null;
      this.currentWordData = null;
    }

    static bindPopupEvents() {
      const closeBtn = document.getElementById('btn-rwp-close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closePopup());

      const speakBtn = document.getElementById('btn-rwp-speak');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          const word = document.getElementById('rwp-word')?.textContent;
          if (word) SoundService.speak(word, 0.9, this.currentWordData?.audioUrl);
        });
      }

      const saveBtn = document.getElementById('btn-rwp-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveCurrentWord());
      }

      // Close popup when clicking outside
      document.addEventListener('click', (e) => {
        if (this.popupVisible && this.popup && !this.popup.contains(e.target) && !e.target.classList.contains('r-word')) {
          this.closePopup();
        }
      });
    }

    static populateRwpNotebookSelect() {
      const select = document.getElementById('rwp-notebook-select');
      if (!select) return;
      const notebooks = StorageManager.getNotebooks();
      select.innerHTML = notebooks.length > 0
        ? notebooks.map(nb => `<option value="${nb.id}">${nb.name}</option>`).join('')
        : '<option value="">Chưa có sổ tay nào</option>';
    }

    static saveCurrentWord() {
      if (!this.currentWordData) return;
      const select = document.getElementById('rwp-notebook-select');
      const notebookId = select ? select.value : '';
      if (!notebookId) {
        AppUI.showToast('Vui lòng tạo ít nhất 1 sổ tay trước!', 'danger');
        return;
      }

      const { word, phonetic, partOfSpeech, meaningEn, meaningVi, examples, audioUrl } = this.currentWordData;
      const result = StorageManager.addWordToNotebook(notebookId, {
        word, phonetic, partOfSpeech, meaningEn, meaningVi, examples, imageUrl: ''
      });

      if (result && result.alreadyExists) {
        AppUI.showToast(`"${word}" đã có trong sổ tay này rồi!`, 'info');
        return;
      }

      // Mark word in text as saved
      document.querySelectorAll(`.r-word[data-word="${word.toLowerCase()}"]`).forEach(el => {
        el.classList.remove('looked');
        el.classList.add('saved');
      });

      // Track session
      if (!this.sessionSavedWords.find(w => w.word === word)) {
        this.sessionSavedWords.push({ word, meaningVi });
      }
      this.updateSavedBadge();

      // Show saved badge
      const saveBtn = document.getElementById('btn-rwp-save');
      const savedBadge = document.getElementById('rwp-saved-badge');
      if (saveBtn) { saveBtn.textContent = '✓ Đã lưu'; saveBtn.disabled = true; saveBtn.style.opacity = '0.6'; }
      if (savedBadge) savedBadge.style.display = 'block';

      SoundService.playCorrectTone();
      const nb = StorageManager.getNotebook(notebookId);
      AppUI.showToast(`✅ Đã lưu "${word}" vào "${nb?.name || 'sổ tay'}"!`, 'success');

      setTimeout(() => this.closePopup(), 1200);
    }

    static updateSavedBadge() {
      const badge = document.getElementById('reading-saved-count-badge');
      if (badge) {
        badge.textContent = `${this.sessionSavedWords.length} từ đã lưu`;
      }
    }

    // -----------------------------------------------------------------------
    // GO BACK & SESSION SUMMARY
    // -----------------------------------------------------------------------
    static goBackToInput() {
      this.closePopup();

      // Show session summary if words were saved
      if (this.sessionSavedWords.length > 0) {
        const summaryEl = document.getElementById('reading-session-summary');
        const summaryWords = document.getElementById('reading-summary-words');
        if (summaryEl && summaryWords) {
          summaryWords.innerHTML = `
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 12px;">
              Bạn đã lưu <strong>${this.sessionSavedWords.length} từ</strong> vào sổ tay trong phiên đọc này:
            </p>
            <div>${this.sessionSavedWords.map(w => `
              <span class="reading-saved-word-chip">
                📗 ${w.word}${w.meaningVi ? ' – ' + w.meaningVi.split(';')[0].split(',')[0] : ''}
              </span>`).join('')}
            </div>`;
          summaryEl.style.display = 'block';
          summaryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      // Otherwise go straight back to input
      document.getElementById('reading-active-screen').style.display = 'none';
      document.getElementById('reading-input-screen').style.display = 'block';
      this.sessionSavedWords = [];
    }

    // -----------------------------------------------------------------------
    // FONT SIZE CONTROLS
    // -----------------------------------------------------------------------
    static changeFontSize(delta) {
      this.fontSize = Math.min(1.6, Math.max(0.85, this.fontSize + delta));
      const contentArea = document.getElementById('reading-content-area');
      if (contentArea) contentArea.style.fontSize = this.fontSize + 'rem';
    }

    // -----------------------------------------------------------------------
    // SCROLL PROGRESS BAR
    // -----------------------------------------------------------------------
    static bindScrollProgress() {
      window.addEventListener('scroll', () => {
        if (document.getElementById('reading-active-screen')?.style.display !== 'none') {
          const el = document.getElementById('reading-active-screen');
          const scrollTop = window.scrollY;
          const docH = el ? el.offsetHeight : document.body.scrollHeight;
          const winH = window.innerHeight;
          const progress = Math.min(100, (scrollTop / (docH - winH)) * 100);
          const bar = document.getElementById('reading-scroll-progress');
          if (bar) bar.style.width = progress + '%';
        }
      });
    }
  }

  // =========================================================================
  // BOOTSTRAP APPLICATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    AppController.init();
    ReadingController.init();

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    }
  });

})();
