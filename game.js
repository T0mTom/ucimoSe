/* ============================================================
   UČIMO SE SLOVENSKO — glavna logika
   ============================================================ */

'use strict';

// ─── PODATKI: abeceda ────────────────────────────────────────
const ABC_WORDS = [
  { emoji: '🍎', word: 'JABOLKO',  speak: 'jabolko'  },
  { emoji: '🐱', word: 'MAČKA',    speak: 'mačka'    },
  { emoji: '🐶', word: 'PES',      speak: 'pes'       },
  { emoji: '🌸', word: 'CVET',     speak: 'cvet'      },
  { emoji: '🌞', word: 'SONCE',    speak: 'sonce'     },
  { emoji: '🌙', word: 'LUNA',     speak: 'luna'      },
  { emoji: '🏠', word: 'HIŠA',     speak: 'hiša'      },
  { emoji: '🚗', word: 'AVTO',     speak: 'avto'      },
  { emoji: '🐟', word: 'RIBA',     speak: 'riba'      },
  { emoji: '🌳', word: 'DREVO',    speak: 'drevo'     },
  { emoji: '📚', word: 'KNJIGA',   speak: 'knjiga'    },
  { emoji: '✏️', word: 'SVINČNIK', speak: 'svinčnik'  },
  { emoji: '🍕', word: 'PICA',     speak: 'pica'      },
  { emoji: '🎂', word: 'TORTA',    speak: 'torta'     },
  { emoji: '🐠', word: 'RIBA',     speak: 'riba'      },
  { emoji: '🦋', word: 'METULJ',   speak: 'metulj'    },
  { emoji: '🌈', word: 'MAVRICA',  speak: 'mavrica'   },
  { emoji: '⭐', word: 'ZVEZDA',   speak: 'zvezda'    },
  { emoji: '🎈', word: 'BALON',    speak: 'balon'     },
  { emoji: '🐘', word: 'SLON',     speak: 'slon'      },
  { emoji: '🐸', word: 'ŽABA',     speak: 'žaba'      },
  { emoji: '🍓', word: 'JAGODA',   speak: 'jagoda'    },
  { emoji: '🏔️', word: 'GORA',     speak: 'gora'      },
  { emoji: '🌊', word: 'MORJE',    speak: 'morje'     },
  { emoji: '🦁', word: 'LEV',      speak: 'lev'       },
  { emoji: '🐻', word: 'MEDVED',   speak: 'medved'    },
  { emoji: '🍌', word: 'BANANA',   speak: 'banana'    },
  { emoji: '🎵', word: 'GLASBA',   speak: 'glasba'    },
  { emoji: '🌺', word: 'ROŽA',     speak: 'roža'      },
  { emoji: '🦊', word: 'LISICA',   speak: 'lisica'    },
  { emoji: '🐧', word: 'PINGVIN',  speak: 'pingvin'   },
  { emoji: '🍦', word: 'SLADOLED', speak: 'sladoled'  },
  { emoji: '🚀', word: 'RAKETA',   speak: 'raketa'    },
  { emoji: '🎯', word: 'TARČA',    speak: 'tarča'     },
  { emoji: '🌻', word: 'SONČNICA', speak: 'sončnica'  },
];

// ─── PODATKI: številke ──────────────────────────────────────
const NUMBERS = [
  { n: 1,  sl: 'ENA',        emoji: '🍎' },
  { n: 2,  sl: 'DVA',        emoji: '🐱' },
  { n: 3,  sl: 'TRI',        emoji: '⭐' },
  { n: 4,  sl: 'ŠTIRI',      emoji: '🌸' },
  { n: 5,  sl: 'PET',        emoji: '🐟' },
  { n: 6,  sl: 'ŠEST',       emoji: '🌈' },
  { n: 7,  sl: 'SEDEM',      emoji: '🎈' },
  { n: 8,  sl: 'OSEM',       emoji: '🍕' },
  { n: 9,  sl: 'DEVET',      emoji: '🌳' },
  { n: 10, sl: 'DESET',      emoji: '🦋' },
  { n: 11, sl: 'ENAJST',     emoji: '🏠' },
  { n: 12, sl: 'DVANAJST',   emoji: '🚗' },
  { n: 13, sl: 'TRINAJST',   emoji: '🌙' },
  { n: 14, sl: 'ŠTIRINAJST', emoji: '🐸' },
  { n: 15, sl: 'PETNAJST',   emoji: '🍓' },
  { n: 16, sl: 'ŠESTNAJST',  emoji: '🦁' },
  { n: 17, sl: 'SEDEMNAJST', emoji: '🐻' },
  { n: 18, sl: 'OSEMNAJST',  emoji: '🍌' },
  { n: 19, sl: 'DEVETNAJST', emoji: '🌺' },
  { n: 20, sl: 'DVAJSET',    emoji: '🎂' },
];

// ─── GOVOR (TTS) — Google Translate slovenščina ──────────────
let currentAudio = null;

function speak(text, rate = 0.88) {
  // Ustavi prejšnji zvok
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }

  // Google Translate TTS — pravi slovenski glas
  const url = 'https://translate.google.com/translate_tts'
    + '?ie=UTF-8'
    + '&q=' + encodeURIComponent(text.toLowerCase())
    + '&tl=sl'
    + '&client=tw-ob';

  const audio = new Audio(url);
  audio.playbackRate = rate;
  currentAudio = audio;

  audio.play().catch(() => {
    // Rezerva: Web Speech API
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u    = new SpeechSynthesisUtterance(text);
    u.lang     = 'sl-SI';
    u.rate     = rate;
    u.pitch    = 1.1;
    const vcs  = window.speechSynthesis.getVoices();
    const slV  = vcs.find(v => v.lang.startsWith('sl')) || null;
    if (slV) u.voice = slV;
    window.speechSynthesis.speak(u);
  });
}

// ─── PRIPOMOČKI ─────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── MENJAVA IGRE ───────────────────────────────────────────
function switchGame(game) {
  document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('game-' + game).classList.add('active');
  document.getElementById('tab-' + game).classList.add('active');

  if (game === 'abeceda') initAbeceda();
  else                    initStevilke();
}

// ══════════════════════════════════════════════════════════════
//  IGRA ABECEDA
// ══════════════════════════════════════════════════════════════
const abc = {
  queue:       [],
  current:     null,
  filled:      [],   // array of { letter, tileEl }
  score:       0,
  round:       0,
  lives:       3,
  totalRounds: 10,
  hintUsed:    false,
};

function initAbeceda() {
  abc.queue  = shuffle(ABC_WORDS).slice(0, abc.totalRounds);
  abc.score  = 0;
  abc.round  = 0;
  abc.lives  = 3;
  updateAbcUI();
  nextAbcRound();
}

function nextAbcRound() {
  if (abc.round >= abc.totalRounds || abc.lives <= 0) {
    showVictory('abeceda');
    return;
  }
  abc.current  = abc.queue[abc.round];
  abc.filled   = [];
  abc.hintUsed = false;
  abc.round++;

  document.getElementById('abc-emoji').textContent      = abc.current.emoji;
  document.getElementById('abc-hint-word').textContent  = abc.current.word;
  document.getElementById('abc-round').textContent      = abc.round;
  document.getElementById('abc-hint-btn').disabled      = false;

  renderWordBuilder();
  renderLetterBank();
  speakCurrent();
}

// Postavi prazne slote za besedo
function renderWordBuilder() {
  const wb = document.getElementById('abc-word-builder');
  wb.innerHTML = '';
  abc.current.word.split('').forEach((_, i) => {
    const slot  = document.createElement('div');
    slot.className = 'slot';
    slot.id  = 'slot-' + i;
    slot.dataset.index = i;
    slot.onclick = () => removeFromSlot(i);
    wb.appendChild(slot);
  });
}

// Ustvari naključne črke + pravilne pomešane
function renderLetterBank() {
  const bank = document.getElementById('abc-letter-bank');
  bank.innerHTML = '';

  const letters = abc.current.word.split('');
  // dodaj nekaj napačnih črk
  const extra = 'ABCDEFGHIJKLMNOPRSTUVZŠŽČ'.split('')
    .filter(c => !letters.includes(c));
  const extras = shuffle(extra).slice(0, Math.min(5, 14 - letters.length));
  const all    = shuffle([...letters, ...extras]);

  all.forEach((ch, i) => {
    const tile = document.createElement('div');
    tile.className     = 'letter-tile';
    tile.textContent   = ch;
    tile.dataset.letter = ch;
    tile.dataset.idx    = i;
    tile.id = 'tile-' + i;
    tile.onclick = () => clickTile(tile);
    bank.appendChild(tile);
  });
}

function clickTile(tile) {
  if (tile.classList.contains('used')) return;
  const letter = tile.dataset.letter;
  // poišči prvi prazen slot
  const slots  = Array.from(document.querySelectorAll('.slot'));
  const empty  = slots.find(s => !s.dataset.filled);
  if (!empty) return;

  empty.textContent    = letter;
  empty.dataset.filled = tile.id;
  empty.classList.add('filled');
  tile.classList.add('used');

  abc.filled.push({ slotIndex: parseInt(empty.dataset.index), letter, tileId: tile.id });
  checkAbcWord();
}

function removeFromSlot(index) {
  const slot = document.getElementById('slot-' + index);
  if (!slot.dataset.filled) return;

  const tileId = slot.dataset.filled;
  const tile   = document.getElementById(tileId);
  if (tile) tile.classList.remove('used');

  slot.textContent    = '';
  slot.dataset.filled = '';
  slot.classList.remove('filled', 'correct', 'wrong');

  abc.filled = abc.filled.filter(f => f.slotIndex !== index);
}

function resetWord() {
  abc.filled = [];
  document.querySelectorAll('.slot').forEach(s => {
    s.textContent    = '';
    s.dataset.filled = '';
    s.classList.remove('filled', 'correct', 'wrong');
  });
  document.querySelectorAll('.letter-tile').forEach(t => t.classList.remove('used'));
}

function useHint() {
  // zapolni pierwszy pravilni slot
  const word  = abc.current.word.split('');
  const slots = Array.from(document.querySelectorAll('.slot'));
  const firstEmpty = slots.find(s => !s.dataset.filled);
  if (!firstEmpty) return;

  const idx    = parseInt(firstEmpty.dataset.index);
  const need   = word[idx];

  // najdi neporabljeno ploščico s pravilno črko
  const tile = Array.from(document.querySelectorAll('.letter-tile'))
    .find(t => t.dataset.letter === need && !t.classList.contains('used'));
  if (!tile) return;

  abc.score = Math.max(0, abc.score - 5);
  updateAbcUI();
  clickTile(tile);
  abc.hintUsed = true;
}

function checkAbcWord() {
  const word  = abc.current.word.split('');
  const slots = Array.from(document.querySelectorAll('.slot'));
  const allFilled = slots.every(s => s.dataset.filled);
  if (!allFilled) return;

  let allCorrect = true;
  slots.forEach((s, i) => {
    if (s.textContent === word[i]) {
      s.classList.add('correct');
    } else {
      s.classList.add('wrong');
      allCorrect = false;
    }
  });

  if (allCorrect) {
    const pts = abc.hintUsed ? 5 : 10;
    abc.score += pts;
    updateAbcUI();
    speak(abc.current.speak);
    showFeedback(true, abc.current.speak);
    setTimeout(() => {
      hideFeedback();
      nextAbcRound();
    }, 1800);
  } else {
    abc.lives--;
    speak('Napaka! Poskusi znova.', 1, 1);
    updateAbcUI();
    setTimeout(() => {
      resetWord();
      if (abc.lives <= 0) showVictory('abeceda');
    }, 900);
  }
}

function speakCurrent() {
  if (abc.current) speak(abc.current.speak);
}

function updateAbcUI() {
  document.getElementById('abc-score').textContent = abc.score;
  document.getElementById('abc-round').textContent = abc.round;
  document.getElementById('abc-lives').textContent = '❤️'.repeat(abc.lives) || '💀';
}

// Feedback overlay
function showFeedback(correct, word) {
  const el   = document.getElementById('feedback-overlay');
  const emEl = document.getElementById('feedback-emoji');
  const txEl = document.getElementById('feedback-text');

  const goodTexts  = ['Odlično! 🎉', 'Bravo! 🌟', 'Super! 🚀', 'Čudovito! 💫', 'Fantastično! 🏆'];
  const wrongTexts = ['Poskusi znova!', 'Skoraj! Bližje...', 'Ne obupaj!'];

  if (correct) {
    emEl.textContent = ['🎉','⭐','🌟','🏆','💫','🎊'][Math.floor(Math.random()*6)];
    txEl.textContent = goodTexts[Math.floor(Math.random() * goodTexts.length)];
    txEl.style.color = 'var(--accent2)';
  } else {
    emEl.textContent = ['😅','🙈','💪'][Math.floor(Math.random()*3)];
    txEl.textContent = wrongTexts[Math.floor(Math.random() * wrongTexts.length)];
    txEl.style.color = 'var(--danger)';
  }
  el.classList.remove('hidden');
}

function hideFeedback() {
  document.getElementById('feedback-overlay').classList.add('hidden');
}


// ══════════════════════════════════════════════════════════════
//  IGRA ŠTEVILKE
// ══════════════════════════════════════════════════════════════
const num = {
  mode:        'count',  // count | read | match
  queue:       [],
  current:     null,
  score:       0,
  round:       0,
  streak:      0,
  totalRounds: 10,
  matchState:  { selLeft: null, selRight: null, pairs: [], matched: 0 },
};

function setNumMode(mode) {
  num.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('mode-btn-' + mode).classList.add('active');
  initStevilke();
}

function initStevilke() {
  num.queue  = shuffle(NUMBERS).slice(0, num.totalRounds);
  num.score  = 0;
  num.round  = 0;
  num.streak = 0;
  updateNumUI();
  nextNumRound();
}

function nextNumRound() {
  if (num.round >= num.totalRounds) {
    showVictory('stevilke');
    return;
  }
  num.current = num.queue[num.round];
  num.round++;
  updateNumUI();
  hideFeedbackNum();

  if      (num.mode === 'count') renderCountQuestion();
  else if (num.mode === 'read')  renderReadQuestion();
  else                            renderMatchQuestion();
}

// ── NAČIN: Štej predmete ──────────────────────────────────
function renderCountQuestion() {
  const qArea = document.getElementById('num-question-area');
  const aArea = document.getElementById('num-answer-area');
  const { n, emoji } = num.current;

  qArea.innerHTML = `
    <div class="num-question-label">Koliko predmetov vidiš?</div>
    <div class="num-objects">${emoji.repeat(n)}</div>
  `;

  speak(`Koliko predmetov vidiš?`, 0.9);

  // odgovori: pravilni + 3 napačni
  const wrong = shuffle(NUMBERS.filter(x => x.n !== n)).slice(0, 3).map(x => x.n);
  const choices = shuffle([n, ...wrong]);

  aArea.innerHTML = '';
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className   = 'answer-btn';
    btn.textContent = c;
    btn.id = 'abtn-' + c;
    btn.onclick = () => answerCount(c, n, btn);
    aArea.appendChild(btn);
  });
}

function answerCount(chosen, correct, btn) {
  lockAnswers();
  if (chosen === correct) {
    btn.classList.add('btn-correct');
    handleCorrect(correct + '');
  } else {
    btn.classList.add('btn-wrong');
    document.getElementById('abtn-' + correct)?.classList.add('btn-correct');
    handleWrong(correct + '');
  }
  setTimeout(nextNumRound, 1700);
}

// ── NAČIN: Preberi število ─────────────────────────────────
function renderReadQuestion() {
  const qArea = document.getElementById('num-question-area');
  const aArea = document.getElementById('num-answer-area');
  const { n, sl } = num.current;

  // Naključno: prikaži cifro ali besedo
  const showDigit = Math.random() > 0.5;

  if (showDigit) {
    qArea.innerHTML = `
      <div class="num-question-label">Kako se reče temu številu?</div>
      <div class="num-big">${n}</div>
    `;
    speak(`Kako se reče temu številu? ${n}`, 0.9);
    // odgovori = besede
    const wrong = shuffle(NUMBERS.filter(x => x.n !== n)).slice(0, 3).map(x => x.sl);
    const choices = shuffle([sl, ...wrong]);
    aArea.innerHTML = '';
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className   = 'answer-btn';
      btn.textContent = c;
      btn.onclick = () => answerRead(c, sl, n, btn);
      btn.id = 'rbtn-' + c;
      aArea.appendChild(btn);
    });
  } else {
    qArea.innerHTML = `
      <div class="num-question-label">Katera cifra ustreza besedi?</div>
      <div class="num-big-word">${sl}</div>
    `;
    speak(sl.toLowerCase(), 0.85);
    // odgovori = cifre
    const wrong = shuffle(NUMBERS.filter(x => x.n !== n)).slice(0, 3).map(x => x.n);
    const choices = shuffle([n, ...wrong]);
    aArea.innerHTML = '';
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className   = 'answer-btn';
      btn.textContent = c;
      btn.onclick = () => answerRead(c, n, n, btn);
      btn.id = 'rbtn-' + c;
      aArea.appendChild(btn);
    });
  }
}

function answerRead(chosen, correct, num_val, btn) {
  lockAnswers();
  if (chosen == correct) {
    btn.classList.add('btn-correct');
    handleCorrect(num_val + '');
  } else {
    btn.classList.add('btn-wrong');
    // poišči pravilni gumb
    document.querySelectorAll('.answer-btn').forEach(b => {
      if (b.textContent == correct) b.classList.add('btn-correct');
    });
    handleWrong(num_val + '');
  }
  setTimeout(nextNumRound, 1700);
}

// ── NAČIN: Poveži ──────────────────────────────────────────
function renderMatchQuestion() {
  const qArea = document.getElementById('num-question-area');
  const aArea = document.getElementById('num-answer-area');

  // izberemo 5 parov za to rundo
  const pairs = shuffle(NUMBERS).slice(0, 5);
  num.matchState = { pairs, matched: 0, selLeft: null, selRight: null };

  qArea.innerHTML = `<div class="num-question-label">Poveži število z besedo!</div>`;

  const shuffledRight = shuffle([...pairs]);

  aArea.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'match-grid';

  const leftCol  = document.createElement('div'); leftCol.className  = 'match-col';
  const rightCol = document.createElement('div'); rightCol.className = 'match-col';

  pairs.forEach(p => {
    const li = document.createElement('div');
    li.className   = 'match-item';
    li.textContent = p.n;
    li.dataset.val = p.n;
    li.dataset.side = 'left';
    li.onclick = () => matchClick(li, 'left');
    leftCol.appendChild(li);
  });

  shuffledRight.forEach(p => {
    const ri = document.createElement('div');
    ri.className   = 'match-item';
    ri.textContent = p.sl;
    ri.dataset.val = p.n;
    ri.dataset.side = 'right';
    ri.onclick = () => matchClick(ri, 'right');
    rightCol.appendChild(ri);
  });

  grid.appendChild(leftCol);
  grid.appendChild(rightCol);
  aArea.appendChild(grid);

  speak('Poveži število z besedo!', 0.9);
}

function matchClick(el, side) {
  if (el.classList.contains('matched')) return;

  const ms = num.matchState;

  if (side === 'left') {
    document.querySelectorAll('.match-item[data-side="left"]').forEach(e => e.classList.remove('sel'));
    el.classList.add('sel');
    ms.selLeft = el;
  } else {
    document.querySelectorAll('.match-item[data-side="right"]').forEach(e => e.classList.remove('sel'));
    el.classList.add('sel');
    ms.selRight = el;
  }

  if (ms.selLeft && ms.selRight) {
    const lv = ms.selLeft.dataset.val;
    const rv = ms.selRight.dataset.val;

    if (lv === rv) {
      ms.selLeft.classList.add('matched');
      ms.selRight.classList.add('matched');
      ms.selLeft.classList.remove('sel');
      ms.selRight.classList.remove('sel');
      ms.matched++;
      speak(ms.pairs.find(p => p.n == lv)?.sl?.toLowerCase() || lv, 0.88);

      if (ms.matched === ms.pairs.length) {
        num.score  += 20;
        num.streak++;
        updateNumUI();
        showFeedbackNum(true, '');
        setTimeout(nextNumRound, 1600);
      }
    } else {
      ms.selLeft.classList.add('wrong-m');
      ms.selRight.classList.add('wrong-m');
      setTimeout(() => {
        ms.selLeft?.classList.remove('sel','wrong-m');
        ms.selRight?.classList.remove('sel','wrong-m');
        ms.selLeft  = null;
        ms.selRight = null;
      }, 500);
      return;
    }
    ms.selLeft  = null;
    ms.selRight = null;
  }
}

// ── Skupni pomočniki za številke ──────────────────────────
function lockAnswers() {
  document.querySelectorAll('.answer-btn').forEach(b => b.classList.add('btn-disabled'));
}

function handleCorrect(numStr) {
  num.score  += 10 + num.streak * 2;
  num.streak++;
  updateNumUI();
  speak(NUMBERS.find(x => x.n == numStr)?.sl?.toLowerCase() || numStr, 0.88);
  showFeedbackNum(true, numStr);
}

function handleWrong(numStr) {
  num.streak = 0;
  updateNumUI();
  speak('Napaka! Pravilni odgovor je ' + (NUMBERS.find(x=>x.n==numStr)?.sl?.toLowerCase() || numStr), 0.9);
  showFeedbackNum(false, numStr);
}

function showFeedbackNum(correct, numStr) {
  const fb = document.getElementById('num-feedback');
  const entry = NUMBERS.find(x => x.n == numStr);
  if (correct) {
    const msgs = ['Odlično! 🎉', 'Bravo! ⭐', 'Super! 🚀', 'Prav imaš! 💫'];
    fb.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    fb.className = 'num-feedback correct-fb';
  } else {
    fb.textContent = `❌ Pravilno: ${entry ? entry.n + ' = ' + entry.sl : numStr}`;
    fb.className = 'num-feedback wrong-fb';
  }
  fb.classList.remove('hidden');
}

function hideFeedbackNum() {
  const fb = document.getElementById('num-feedback');
  fb.className = 'num-feedback hidden';
}

function updateNumUI() {
  document.getElementById('num-score').textContent  = num.score;
  document.getElementById('num-round').textContent  = num.round;
  document.getElementById('num-streak').textContent = num.streak;
}

// ══════════════════════════════════════════════════════════════
//  ZMAGA
// ══════════════════════════════════════════════════════════════
let currentGame    = 'abeceda';
let balloonInterval = null;

function showVictory(game) {
  currentGame = game;
  const score = game === 'abeceda' ? abc.score : num.score;
  const msgs  = [
    'Kar tako naprej! Si pravi/a zvezdnik/ca! ⭐',
    'Odlično si se odrezal/a! Nisi dal/a opustiti! 🏅',
    'Bravo! Velik korak v učenju! 🎓',
  ];

  document.getElementById('victory-text').textContent = msgs[Math.floor(Math.random() * msgs.length)];
  document.getElementById('vic-score').textContent    = score + ' točk';
  document.getElementById('victory-screen').classList.remove('hidden');

  speak('Bravo! Čestitke! Si odličen!', 0.85);
  startBalloons();
}

function restartGame() {
  stopBalloons();
  document.getElementById('victory-screen').classList.add('hidden');
  document.getElementById('balloon-layer').innerHTML = '';
  if (currentGame === 'abeceda') initAbeceda();
  else                           initStevilke();
}

// ══════════════════════════════════════════════════════════════
//  BALONCI
// ══════════════════════════════════════════════════════════════
const BALLOON_COLORS = [
  '#f87171','#fb923c','#fbbf24','#a3e635',
  '#34d399','#38bdf8','#818cf8','#f472b6',
  '#e879f9','#ff6eb4','#7ee8a2','#80d0c7',
];

function startBalloons() {
  stopBalloons();
  const layer = document.getElementById('balloon-layer');
  layer.innerHTML = '';

  // prve balone takoj
  for (let i = 0; i < 4; i++) {
    setTimeout(() => spawnBalloon(layer), i * 180);
  }
  // nato eno na 600ms
  balloonInterval = setInterval(() => spawnBalloon(layer), 600);
  // po 20s ustavi spawning, balonci ki so že gor pa ostanejo
  setTimeout(stopBalloons, 20000);
}

function stopBalloons() {
  if (balloonInterval) { clearInterval(balloonInterval); balloonInterval = null; }
}

function spawnBalloon(layer) {
  if (!layer || !document.getElementById('victory-screen') ||
      document.getElementById('victory-screen').classList.contains('hidden')) return;

  const color   = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  const size    = 48 + Math.random() * 44;                // px
  const left    = 4  + Math.random() * 88;                // %
  const dur     = 4  + Math.random() * 4;                 // s
  const dxMid   = (Math.random() - .5) * 80;              // drift pri 50%
  const dx      = dxMid + (Math.random() - .5) * 60;      // drift na vrhu

  const wrap = document.createElement('div');
  wrap.className = 'balloon';
  wrap.style.cssText = [
    `--size:${size}px`,
    `--color:${color}`,
    `--dur:${dur}s`,
    `--dx-mid:${dxMid}px`,
    `--dx:${dx}px`,
    `left:${left}%`,
  ].join(';');

  wrap.innerHTML = `
    <div class="balloon-body">
      <div class="balloon-shine"></div>
    </div>
    <div class="balloon-string"></div>
  `;

  // pop ob kliku / dotiku
  const pop = (e) => { e.stopPropagation(); popBalloon(wrap, e); };
  wrap.addEventListener('pointerdown', pop, { once: true });

  layer.appendChild(wrap);
  // odstrani po animaciji
  setTimeout(() => wrap.remove(), (dur + .5) * 1000);
}

function popBalloon(balloon, e) {
  if (balloon.dataset.popped) return;
  balloon.dataset.popped = '1';

  // vibracija
  if (navigator.vibrate) navigator.vibrate([40]);

  // koordinate za delce
  const rect = balloon.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;

  // pop animacija
  balloon.classList.add('pop');
  setTimeout(() => balloon.remove(), 320);

  // izstreli barvne delce
  spawnParticles(cx, cy, balloon.style.getPropertyValue('--color') ||
    getComputedStyle(balloon).getPropertyValue('--color'));
}

function spawnParticles(cx, cy, color) {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const p   = document.createElement('div');
    p.className = 'pop-particle';
    const angle = (i / count) * Math.PI * 2;
    const dist  = 40 + Math.random() * 60;
    p.style.cssText = [
      `left:${cx}px`, `top:${cy}px`,
      `background:${color}`,
      `--px:${Math.cos(angle)*dist}px`,
      `--py:${Math.sin(angle)*dist}px`,
      `--pt:${.35 + Math.random()*.25}s`,
    ].join(';');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

// ══════════════════════════════════════════════════════════════
//  ZAGON
// ══════════════════════════════════════════════════════════════
function startApp() {
  const landing = document.getElementById('landing-screen');
  const header  = document.getElementById('main-header');
  const app     = document.getElementById('app');

  // Animiraj odhod landing zaslona
  landing.classList.add('slide-out');

  setTimeout(() => {
    landing.remove();           // popolnoma odstrani iz DOM
    header.classList.remove('hidden-init');
    app.classList.remove('hidden-init');
    initAbeceda();
  }, 440);
}

window.addEventListener('DOMContentLoaded', () => {
  // Ne inicializiraj igre — počakaj da uporabnik klikne "Igraj"
});
