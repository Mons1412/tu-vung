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

    static speak(text, rate = 0.9) {
      if (!('speechSynthesis' in window)) {
        AppUI.showToast('Trình duyệt không hỗ trợ phát âm (Web Speech)', 'danger');
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;

        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('SpeechSynthesis error:', e);
      }
    }
  }

  // Pre-load voices
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
      // Check for QR sync import
      const urlParams = new URLSearchParams(window.location.search);
      const importUrl = urlParams.get('import_url');
      if (importUrl) {
         try {
            AppUI.showToast('Đang tải dữ liệu đồng bộ...', 'info');
            const res = await fetch(importUrl);
            const data = await res.json();
            if (data && Array.isArray(data.notebooks)) {
              if (confirm('Phát hiện dữ liệu đồng bộ từ máy khác. Bạn có muốn nhập vào không? (Dữ liệu hiện tại sẽ bị thay thế)')) {
                 StorageManager.saveData(data);
                 AppUI.showToast('Đã đồng bộ dữ liệu thành công!', 'success');
              }
            } else {
               AppUI.showToast('Dữ liệu đồng bộ không hợp lệ!', 'danger');
            }
         } catch (err) {
            AppUI.showToast('Link đồng bộ đã hết hạn hoặc bị lỗi mạng.', 'danger');
         }
         // Xóa params trên URL
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
            SoundService.speak(this.currentSearchResult.word);
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

        // Pronounce
        item.querySelector('.btn-speak-word').addEventListener('click', (e) => {
          e.stopPropagation();
          SoundService.speak(w.word);
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

      // Shuffle words for study session
      const shuffled = [...words].sort(() => Math.random() - 0.5);

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
      this.words = wordsList;
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
      speakBtn.onclick = () => SoundService.speak(this.currentWordObj.word);

      // Pronounce clue right away if autoPronounce is enabled
      if (AppController.autoPronounce) {
        SoundService.speak(this.currentWordObj.word);
      }

      // Scramble letters
      const lettersArr = this.targetWord.split('').map((char, originalIndex) => ({
        id: 'char_' + originalIndex,
        char: char,
        placed: false
      }));

      // Ensure shuffle is different from target
      let shuffled = [...lettersArr].sort(() => Math.random() - 0.5);
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
      this.words = wordsList;
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
        speakBtn.onclick = () => SoundService.speak(this.currentWordObj.word);
        if (AppController.autoPronounce) {
          SoundService.speak(this.currentWordObj.word);
        }
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
      const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

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
      return options.sort(() => Math.random() - 0.5);
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
      this.words = wordsList;
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
        SoundService.speak(this.currentWordObj.word);
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

      SoundService.speak(this.currentWordObj.word);
    }

    static flip() {
      const cardInner = document.getElementById('flashcard-inner');
      this.isFlipped = !this.isFlipped;
      cardInner.classList.toggle('is-flipped', this.isFlipped);
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

          item.querySelector('.btn-speak-sm').onclick = () => SoundService.speak(w.word);
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

      const btnSyncQr = document.getElementById('btn-sync-qr');
      if (btnSyncQr) {
        btnSyncQr.onclick = () => {
          AppUI.openModal('modal-sync-qr');
          this.renderSyncQr();
        };
      }

      const btnCopyQrUrl = document.getElementById('btn-copy-qr-url');
      if (btnCopyQrUrl) {
        btnCopyQrUrl.onclick = () => {
          let currentUrl = window.location.origin + window.location.pathname;
          if (currentUrl.startsWith('null') || currentUrl.startsWith('file://')) {
            currentUrl = window.location.href;
          }
          navigator.clipboard.writeText(currentUrl).then(() => {
            AppUI.showToast('Đã sao chép link website!', 'success');
          }).catch(() => {
            AppUI.showToast('Không thể sao chép tự động.', 'warning');
          });
        };
      }

      const btnModalExportJson = document.getElementById('btn-modal-export-json');
      if (btnModalExportJson) {
        btnModalExportJson.onclick = () => this.exportData();
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

    static renderSyncQr() {
      const qrContainer = document.getElementById('qr-code-container');
      const qrUrlText = document.getElementById('qr-share-url-text');
      if (!qrContainer) return;

      qrContainer.innerHTML = '';

      let currentUrl = window.location.origin + window.location.pathname;
      if (currentUrl.startsWith('null') || currentUrl.startsWith('file://')) {
        currentUrl = window.location.href;
      }

      if (qrUrlText) {
        qrUrlText.textContent = currentUrl;
      }

      if (typeof QRCode !== 'undefined') {
        try {
          new QRCode(qrContainer, {
            text: currentUrl,
            width: 200,
            height: 200,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        } catch (err) {
          qrContainer.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">Lỗi tạo mã QR: ${err.message}</p>`;
        }
      } else {
        qrContainer.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">Thư viện mã QR đang được tải. Bạn có thể mở link:<br><a href="${currentUrl}" target="_blank" style="color:var(--primary);word-break:break-all;">${currentUrl}</a></p>`;
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
  // BOOTSTRAP APPLICATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    AppController.init();
    
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
