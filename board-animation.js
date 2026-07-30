import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TUTORIAL_STEPS = [
  // Step 0: Initial Board
  {
    board: [1, 3, 5, 2],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: null,
    pendingRow: null,
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
    pendingRow: 1,
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
    pendingRow: null,
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
    pendingRow: 2,
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
    pendingRow: null,
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
    pendingRow: null,
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
    pendingRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 800,
  },
  // Step 4: Strategic Endgame Setup - Player clears Row 1 & 2 down to 1 stick total
  {
    board: [1, 0, 0, 0],
    badge: 'YOUR MOVE',
    badgeType: 'player',
    selRow: null,
    pendingRow: null,
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
    pendingRow: null,
    pendingCount: 0,
    aiRow: 0,
    aiCount: 1,
    duration: 1000,
  },
  // Step 6: Victory Resolution
  {
    board: [0, 0, 0, 0],
    badge: 'LAST TAKER LOSES — YOU WIN!',
    badgeType: 'player',
    selRow: null,
    pendingRow: null,
    pendingCount: 0,
    aiRow: null,
    aiCount: 0,
    duration: 1500,
  },
];

export const TutorialBoardRedesign = ({ onStartGame }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const currentStep = TUTORIAL_STEPS[stepIndex];
    const timer = setTimeout(() => {
      setStepIndex((prev) => (prev + 1) % TUTORIAL_STEPS.length);
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [stepIndex]);

  const step = TUTORIAL_STEPS[stepIndex];

  return (
    <div className="htp-board-preview">
      {/* Micro Turn Badge */}
      <motion.div
        key={step.badge}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`tutorial-turn-badge ${step.badgeType}`}
      >
        {step.badge}
      </motion.div>

      {/* Dynamic Board Rows */}
      <div className="tutorial-board-rows">
        {step.board.map((count, rIdx) => {
          const isSelected = step.selRow === rIdx;
          const isAiRemoving = step.aiRow === rIdx;
          const maxSticks = [1, 3, 5, 2][rIdx];

          return (
            <motion.div
              key={rIdx}
              className={`row ${isSelected ? 'selected' : ''} ${isAiRemoving ? 'ai-removing-row' : ''}`}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                minHeight: '44px',
              }}
            >
              <div className="sticks" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                {Array.from({ length: maxSticks }).map((_, sIdx) => {
                  const isAlive = sIdx < count;
                  const isPending = isSelected && sIdx >= count - step.pendingCount && sIdx < count;
                  const isAiRem = isAiRemoving && sIdx >= count - step.aiCount && sIdx < count;

                  let stickClass = 'dead';
                  if (isPending) stickClass = 'pending';
                  else if (isAiRem) stickClass = 'ai-removing';
                  else if (isAlive) stickClass = 'alive';

                  return (
                    <motion.div
                      key={sIdx}
                      layout
                      className={`tutorial-stick ${stickClass}`}
                      style={{ height: '44px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
