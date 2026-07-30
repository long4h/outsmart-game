var TUTORIAL_STEPS = [
  // Step 0: Initial Board
  {
    board: [1, 3, 5, 2],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 1000,
  },
  // Step 1: Player selects & removes 1 stick from Row 1 (Index 1)
  {
    board: [1, 3, 5, 2],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: 1,
    pendingCount: 1,
    aiRow: null,
    aiCount: 0,
    duration: 800,
  },
  {
    board: [1, 2, 5, 2],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 600,
  },
  // Step 2: Player selects & sweeps 3 sticks from Row 2 (Index 2)
  {
    board: [1, 2, 5, 2],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: 2,
    pendingCount: 3,
    aiRow: null,
    aiCount: 0,
    duration: 800,
  },
  {
    board: [1, 2, 2, 2],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 600,
  },
  // Step 3: AI Turn - Thinking & Removes 2 sticks from Row 3 (Index 3)
  {
    board: [1, 2, 2, 2],
    badge: 'AI THINKING...',
    badgeType: 'ai',
    selRow: null,
    pendingCount: 0,
    aiRow: 3,
    aiCount: 2,
    duration: 1200,
  },
  {
    board: [1, 2, 2, 0],
    badge: 'AI MOVED',
    badgeType: 'ai',
    selRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 800,
  },
  // Step 4: Strategic Endgame Setup
  {
    board: [1, 0, 0, 0],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 1000,
  },
  // Step 5: AI Forced to take last stick
  {
    board: [1, 0, 0, 0],
    badge: 'AI FORCED TO TAKE LAST STICK',
    badgeType: 'ai',
    selRow: null,
    pendingCount: 0,
    aiRow: 0,
    aiCount: 1,
    duration: 1000,
  },
  // Step 6: Victory Resolution
  {
    board: [0, 0, 0, 0],
    badge: 'LAST TAKER LOSES \u2014 YOU WIN!',
    badgeType: 'player',
    selRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 1500,
  },
];

var MAX_STICKS = [1, 3, 5, 2];

window.BoardAnimation = (function () {
  var containerEl = null;
  var badgeEl = null;
  var rowsEl = null;
  var timer = null;
  var stepIndex = 0;

  function buildSkeleton() {
    containerEl.innerHTML = '';

    badgeEl = document.createElement('div');
    badgeEl.className = 'tutorial-turn-badge player';
    containerEl.appendChild(badgeEl);

    rowsEl = document.createElement('div');
    rowsEl.className = 'tutorial-board-rows';
    containerEl.appendChild(rowsEl);

    MAX_STICKS.forEach(function (maxCount, rIdx) {
      var rowEl = document.createElement('div');
      rowEl.className = 'row';
      rowEl.dataset.row = rIdx;

      var sticksEl = document.createElement('div');
      sticksEl.className = 'sticks';

      for (var s = 0; s < maxCount; s++) {
        var stickEl = document.createElement('div');
        stickEl.className = 'tutorial-stick alive';
        sticksEl.appendChild(stickEl);
      }

      rowEl.appendChild(sticksEl);
      rowsEl.appendChild(rowEl);
    });
  }

  function renderStep(step) {
    badgeEl.textContent = step.badge;
    badgeEl.className = 'tutorial-turn-badge ' + step.badgeType;

    var rowEls = rowsEl.children;
    for (var rIdx = 0; rIdx < rowEls.length; rIdx++) {
      var rowEl = rowEls[rIdx];
      var count = step.board[rIdx];
      var isSelected = step.selRow === rIdx;
      var isAiRemoving = step.aiRow === rIdx;

      rowEl.className = 'row' +
        (isSelected ? ' selected' : '') +
        (isAiRemoving ? ' ai-removing-row' : '');

      var stickEls = rowEl.querySelectorAll('.tutorial-stick');
      for (var sIdx = 0; sIdx < stickEls.length; sIdx++) {
        var isAlive = sIdx < count;
        var isPending = isSelected && sIdx >= (count - step.pendingCount) && sIdx < count;
        var isAiRem = isAiRemoving && sIdx >= (count - step.aiCount) && sIdx < count;

        var stickClass = 'dead';
        if (isPending) stickClass = 'pending';
        else if (isAiRem) stickClass = 'ai-removing';
        else if (isAlive) stickClass = 'alive';

        stickEls[sIdx].className = 'tutorial-stick ' + stickClass;
      }
    }
  }

  function scheduleNext() {
    var step = TUTORIAL_STEPS[stepIndex];
    renderStep(step);
    timer = setTimeout(function () {
      stepIndex = (stepIndex + 1) % TUTORIAL_STEPS.length;
      scheduleNext();
    }, step.duration);
  }

  return {
    init: function (el) {
      if (!el) return;
      containerEl = el;
      stepIndex = 0;
      buildSkeleton();
      scheduleNext();
    },
    stop: function () {
      if (timer) { clearTimeout(timer); timer = null; }
      containerEl = null;
      badgeEl = null;
      rowsEl = null;
    }
  };
})();
