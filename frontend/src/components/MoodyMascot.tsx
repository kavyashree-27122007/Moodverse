import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMascot } from '../context/MascotContext';
import { useLocation } from 'react-router-dom';

// Safe hook: returns null if called outside a Router (e.g. loading screen)
function useSafeLocation() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLocation();
  } catch {
    return null;
  }
}

interface MoodyProps {
  size?: 'small' | 'medium' | 'large';
  message?: string | null;
  inline?: boolean;
}

// ─────────────────────────────────────────
//  MOODY — The Seed of Hope (Original Fantasy Spirit)
//  Brand mascot of MoodVerse. 100% original design.
//  Warm violet eyes never change. Expressions animate
//  via brows, mouth, posture. Constellation patterns
//  pulse across its body. Companion wisps orbit it.
//  The lantern of hope is summoned only when needed.
// ─────────────────────────────────────────

type MascotState = 'idle' | 'sleeping' | 'reading' | 'dancing' | 'waving' | 'celebrating' | 'comforting' | 'thinking';

interface Expression {
  mouth: string;
  lBrow: { rotate: number; y: number };
  rBrow: { rotate: number; y: number };
}

const EXPRESSIONS: Record<MascotState, Expression> = {
  idle:        { mouth: "M 88 112 Q 100 119 112 112",   lBrow: { rotate: 3,  y: 0  }, rBrow: { rotate: -3,  y: 0  } },
  celebrating: { mouth: "M 86 109 Q 100 124 114 109 Z", lBrow: { rotate: 20, y: -5 }, rBrow: { rotate: -20, y: -5 } },
  comforting:  { mouth: "M 90 113 Q 100 109 110 113",   lBrow: { rotate: -18,y: -3 }, rBrow: { rotate: 18,  y: -3 } },
  thinking:    { mouth: "M 92 112 Q 100 112 108 112",   lBrow: { rotate: -12,y: -4 }, rBrow: { rotate: 6,   y: 2  } },
  sleeping:    { mouth: "M 93 112 Q 100 112 107 112",   lBrow: { rotate: 0,  y: 2  }, rBrow: { rotate: 0,   y: 2  } },
  reading:     { mouth: "M 89 112 Q 100 116 111 112",   lBrow: { rotate: 5,  y: 1  }, rBrow: { rotate: -5,  y: 1  } },
  dancing:     { mouth: "M 85 108 Q 100 124 115 108 Z", lBrow: { rotate: 20, y: -5 }, rBrow: { rotate: -20, y: -5 } },
  waving:      { mouth: "M 87 111 Q 100 119 113 111",   lBrow: { rotate: 12, y: -2 }, rBrow: { rotate: -12, y: -2 } },
};

const STATE_VARIANTS: any = {
  idle:        { y: ["-2%", "2%"],                              rotate: 0,             scale: 1 },
  celebrating: { y: ["-10%", "2%", "-10%"],                    rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] },
  comforting:  { y: ["1%", "3%"],                               rotate: [0, 2, 0],     scale: 1 },
  thinking:    { y: ["-1%", "1%"],                              rotate: [0, -2, 0],    scale: 1 },
  sleeping:    { y: ["8%", "11%"],                              rotate: 0,             scale: 0.94 },
  reading:     { y: ["0%", "2%"],                               rotate: 0,             scale: 1 },
  dancing:     { y: ["-6%", "4%", "-6%"],  x: ["-3%", "3%", "-3%"], rotate: [-8, 8, -8] },
  waving:      { y: ["-2%", "2%"],                              rotate: 0,             scale: 1 },
};

function getTransition(state: MascotState): any {
  if (state === 'dancing' || state === 'celebrating') return { repeat: Infinity, duration: 0.55, ease: "easeInOut" };
  if (state === 'sleeping') return { repeat: Infinity, duration: 4.5, repeatType: "reverse" as const, ease: "easeInOut" };
  return { repeat: Infinity, duration: 3.2, repeatType: "reverse" as const, ease: "easeInOut" };
}

// ── Tiny Companion Wisp ──────────────────
const Wisp: React.FC<{ cx: number; cy: number; r: number; color: string; duration: number; reverse?: boolean }> = ({ cx, cy, r, color, duration, reverse }) => (
  <motion.g
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ repeat: Infinity, duration, ease: "linear" }}
    style={{ originX: "100px", originY: "100px" }}
  >
    <circle cx={cx} cy={cy} r={r + 1} fill={color} opacity={0.25} />
    <circle cx={cx} cy={cy} r={r} fill={color} />
    <circle cx={cx - r * 0.4} cy={cy - r * 0.4} r={r * 0.4} fill="#ffffff" opacity={0.7} />
  </motion.g>
);

// ── Main Component ───────────────────────
// Page-aware greeting messages
const PAGE_GREETINGS: Record<string, string[]> = {
  '/dashboard':    ['Welcome back! Ready to check in? 💜', 'How are you feeling today?', 'I\'ve been waiting for you! ✨'],
  '/analytics':    ['Let\'s explore your emotional journey! 📊', 'Look at all this wonderful data about you!', 'Patterns reveal so much — let\'s discover yours.'],
  '/journal':      ['Writing is healing. I\'m listening. 📝', 'Your thoughts are safe here.', 'Tell me what\'s on your heart today.'],
  '/music':        ['Music speaks when words fail. 🎵', 'Let\'s find the perfect song for your mood!', 'I love when we listen together!'],
  '/movies':       ['Cozy movie time! 🎬', 'I have some wonderful picks for your mood!', 'Let\'s watch something special tonight.'],
  '/friends':      ['Your people are here! 💛', 'Community makes everything brighter!', 'Look who\'s around — say hello!'],
  '/achievements': ['Look at how far you\'ve come! 🌟', 'Every step counts. I\'m so proud of you!', 'Your growth is beautiful to witness.'],
  '/settings':     ['Let\'s make this feel like home. ⚙️', 'Customise away — it\'s all yours!'],
  '/notifications': ['You have messages waiting! 💌', 'Someone reached out — how sweet!'],
};

const MoodyMascot: React.FC<MoodyProps> = ({ size = 'medium', message = null, inline = false }) => {
  const mascotCtx = useMascot();
  const mascotState: MascotState = (inline ? 'idle' : (mascotCtx?.mascotState || 'idle')) as MascotState;
  const showMessage = mascotCtx?.showMessage;
  const location = useSafeLocation();

  const [localMessage, setLocalMessage] = useState<string | null>(message);
  const [isHovered, setIsHovered] = useState(false);
  const [blink, setBlink] = useState(false);
  // Eye follow: offset of pupils from center (max ±3px)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor-following eyes
  useEffect(() => {
    if (inline || mascotState === 'sleeping') return;
    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxPx = 3;
      setEyeOffset({ x: (dx / dist) * Math.min(maxPx, dist / 20), y: (dy / dist) * Math.min(maxPx, dist / 20) });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [inline, mascotState]);

  // Page-aware greeting on route change
  useEffect(() => {
    if (inline || !showMessage || !location) return;
    const greetings = PAGE_GREETINGS[location.pathname];
    if (!greetings) return;
    const t = setTimeout(() => {
      const msg = greetings[Math.floor(Math.random() * greetings.length)];
      showMessage(msg, 5000);
    }, 1200);
    return () => clearTimeout(t);
  }, [location?.pathname]);

  // Sync messages
  useEffect(() => {
    if (message) {
      setLocalMessage(message);
      const t = setTimeout(() => setLocalMessage(null), 5000);
      return () => clearTimeout(t);
    }
    setLocalMessage(mascotCtx?.message ?? null);
  }, [message, mascotCtx?.message]);

  // Natural blinking (independent per eye — no group transform)
  useEffect(() => {
    if (mascotState === 'sleeping') { setBlink(true); return; }
    setBlink(false);
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
      if (Math.random() > 0.6) {
        setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 260);
      }
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(id);
  }, [mascotState]);

  const sizeClass = { small: 'w-20 h-20', medium: 'w-44 h-44', large: 'w-60 h-60' }[size];
  const expr = EXPRESSIONS[mascotState];
  // Eye height: 1=open, 0.07=closed (blink). Controlled per-eye using rx/ry on ellipse
  const eyeRY = (blink || mascotState === 'sleeping') ? 0.5 : 7.5;
  const showLantern = ['celebrating', 'comforting', 'thinking', 'waving', 'idle'].includes(mascotState);
  const showBook    = mascotState === 'reading';
  const isSleeping  = mascotState === 'sleeping';
  const isDancing   = mascotState === 'dancing' || mascotState === 'celebrating';

  return (
    <div className={
      inline
        ? "flex flex-col items-center justify-center pointer-events-none select-none"
        : "fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none"
    }>
      {/* Speech Bubble */}
      <AnimatePresence>
        {localMessage && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 18, scale: 0.82 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="mb-4 max-w-[250px] bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl rounded-br-sm px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] pointer-events-auto"
          >
            <p className="text-sm font-medium leading-relaxed text-white/90">{localMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleeping ZZZs */}
      <AnimatePresence>
        {isSleeping && (
          <motion.div key="zzz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute top-2 right-16 pointer-events-none"
          >
            {[0, 1, 2].map(i => (
              <motion.span key={i}
                className="absolute text-violet-300/60 font-bold select-none"
                style={{ fontSize: `${10 + i * 3}px`, left: `${i * 8}px` }}
                animate={{ y: [-4, -28 - i * 8], x: [0, 6, -4, 6], opacity: [0, 0.9, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, delay: i * 0.9, ease: "easeOut" }}
              >Z</motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot */}
      <motion.div
        ref={containerRef}
        className={`relative cursor-pointer pointer-events-auto ${sizeClass}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => {
          const msgs = [
            "I'm right here with you! ✨",
            "You're doing amazing, truly. 💜",
            "Every day you show up is a win!",
            "I believe in you — always! 🌟",
            "Want to tell me how you're feeling?",
          ];
          const msg = msgs[Math.floor(Math.random() * msgs.length)];
          if (showMessage) showMessage(msg, 4500);
          else setLocalMessage(lm => lm ? null : msg);
        }}
        variants={STATE_VARIANTS}
        animate={mascotState}
        transition={getTransition(mascotState)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" overflow="visible">
          <defs>
            {/* Magical aura radial gradient */}
            <radialGradient id="mv_aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#c4b5fd" stopOpacity="0.45" />
              <stop offset="55%"  stopColor="#a78bfa" stopOpacity="0.1"  />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"    />
            </radialGradient>

            {/* Body gradient — cream → warm lavender */}
            <linearGradient id="mv_body" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%"   stopColor="#fefce8" />
              <stop offset="35%"  stopColor="#f5f3ff" />
              <stop offset="100%" stopColor="#ddd6fe" />
            </linearGradient>

            {/* Hair gradient — brown-lavender */}
            <linearGradient id="mv_hair" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>

            {/* Lantern warm glow */}
            <radialGradient id="mv_lantern" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>

            {/* Soft glow filter */}
            <filter id="mv_glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Body shadow */}
            <filter id="mv_shadow">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#3b0764" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* ── PULSING MAGICAL AURA ── */}
          <motion.ellipse cx="100" cy="115" rx="65" ry="55"
            fill="url(#mv_aura)"
            animate={{ rx: isHovered ? 72 : [62, 68, 62], ry: isHovered ? 62 : [52, 57, 52], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />

          {/* ── COMPANION WISPS ── */}
          <Wisp cx={162} cy={100} r={4.5} color="#fde68a" duration={11} />
          <Wisp cx={42}  cy={118} r={3.5} color="#fca5a5" duration={17} reverse />
          <Wisp cx={82}  cy={36}  r={2.8} color="#a78bfa" duration={8}  />
          <Wisp cx={148} cy={148} r={3}   color="#6ee7b7" duration={14} reverse />

          {/* ── MAIN CHARACTER ── */}
          <motion.g filter="url(#mv_shadow)">

            {/* Tiny rounded feet */}
            <ellipse cx="88"  cy="158" rx="7"  ry="5" fill="#d8b4fe" />
            <ellipse cx="112" cy="155" rx="7"  ry="5" fill="#d8b4fe" />

            {/* Left Arm */}
            <motion.g style={{ originX: "67px", originY: "118px" }}
              animate={mascotState === 'waving' ? { rotate: [0, -35, 10, -35, 0] } : { rotate: -10 }}
              transition={{ repeat: mascotState === 'waving' ? Infinity : 0, duration: 1.4, ease: "easeInOut" }}
            >
              <path d="M 68 118 Q 55 126 58 135" fill="none" stroke="#e9d5ff" strokeWidth="11" strokeLinecap="round" />
              <circle cx="57" cy="135" r="6" fill="#f5f3ff" />
            </motion.g>

            {/* Right Arm */}
            <motion.g style={{ originX: "133px", originY: "118px" }}
              animate={isDancing ? { rotate: [0, 20, -20, 20, 0] } : { rotate: 10 }}
              transition={{ repeat: isDancing ? Infinity : 0, duration: 0.7 }}
            >
              <path d="M 132 118 Q 145 126 142 135" fill="none" stroke="#e9d5ff" strokeWidth="11" strokeLinecap="round" />
              <circle cx="143" cy="135" r="6" fill="#f5f3ff" />
            </motion.g>

            {/* ── ASYMMETRIC SEED BODY ── */}
            <path
              d="M 100 58
                 C 128 58 148 76 150 103
                 C 152 128 138 152 110 158
                 C 96  162 78  158 66  148
                 C 52  136 50  116 56  98
                 C 62  76  78  58  100 58 Z"
              fill="url(#mv_body)"
            />

            {/* ── CONSTELLATION PATTERNS ── */}
            <motion.g opacity="0.55" filter="url(#mv_glow)"
              animate={{ opacity: isDancing ? [0.5, 1, 0.5] : [0.35, 0.65, 0.35] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <polyline points="72,140 88,128 103,142 128,130" fill="none" stroke="#c4b5fd" strokeWidth="1.5" />
              <line x1="88" y1="128" x2="82" y2="110" stroke="#c4b5fd" strokeWidth="1.5" />
              <line x1="103" y1="142" x2="118" y2="115" stroke="#c4b5fd" strokeWidth="1.5" />
              {[[72,140],[88,128],[103,142],[128,130],[82,110],[118,115]].map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={i === 1 || i === 2 ? 3.2 : 2} fill="#ffffff" />
              ))}
            </motion.g>

            {/* ── FLUFFY HAIR TUFT ── */}
            <motion.g
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ originX: "100px", originY: "68px" }}
            >
              <path d="M 88 65 C 82 42 96 30 100 24 C 104 30 118 42 112 65 C 108 56 100 55 92 56 Z"
                fill="url(#mv_hair)" />
              <path d="M 96 60 Q 100 40 106 57" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
              {/* Small side curls */}
              <path d="M 88 65 C 78 60 72 52 78 46" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 112 65 C 122 60 128 52 122 46" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>

            {/* ── FACE ── */}

            {/* Rosy cheeks */}
            <ellipse cx="76"  cy="113" rx="8" ry="4.5" fill="#fecdd3" opacity="0.55" />
            <ellipse cx="124" cy="113" rx="8" ry="4.5" fill="#fecdd3" opacity="0.55" />

            {/* Eyes — warm violet, NEVER change color. Blink via ry on ellipse, not group transform */}
            {/* Left Eye socket */}
            <circle cx="84" cy="98" r="10" fill="#1e1b4b" />
            {/* Left iris — uses ellipse so blink = ry shrinks, not group drift */}
            <motion.ellipse
              cx={84 + eyeOffset.x} cy={98 + eyeOffset.y}
              rx={7.5}
              animate={{ ry: eyeRY }}
              transition={{ duration: 0.1 }}
              fill="#8b5cf6"
            />
            {/* Left shine (follows iris) */}
            {!blink && mascotState !== 'sleeping' && (
              <>
                <circle cx={81 + eyeOffset.x * 0.5} cy={94 + eyeOffset.y * 0.5} r="2.5" fill="#ffffff" />
                <circle cx={87 + eyeOffset.x * 0.5} cy={101 + eyeOffset.y * 0.5} r="1" fill="#ffffff" opacity="0.5" />
              </>
            )}

            {/* Right Eye socket */}
            <circle cx="116" cy="98" r="10" fill="#1e1b4b" />
            {/* Right iris */}
            <motion.ellipse
              cx={116 + eyeOffset.x} cy={98 + eyeOffset.y}
              rx={7.5}
              animate={{ ry: eyeRY }}
              transition={{ duration: 0.1 }}
              fill="#8b5cf6"
            />
            {/* Right shine */}
            {!blink && mascotState !== 'sleeping' && (
              <>
                <circle cx={113 + eyeOffset.x * 0.5} cy={94 + eyeOffset.y * 0.5} r="2.5" fill="#ffffff" />
                <circle cx={119 + eyeOffset.x * 0.5} cy={101 + eyeOffset.y * 0.5} r="1" fill="#ffffff" opacity="0.5" />
              </>
            )}

            {/* Eyebrows */}
            <motion.path d="M 77 85 Q 84 82 91 85"
              fill="none" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round"
              style={{ originX: "84px", originY: "85px" }}
              animate={expr.lBrow}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />
            <motion.path d="M 109 85 Q 116 82 123 85"
              fill="none" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round"
              style={{ originX: "116px", originY: "85px" }}
              animate={expr.rBrow}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />

            {/* Mouth */}
            <motion.path
              d={expr.mouth}
              fill={isDancing ? "#5b21b6" : "none"}
              stroke="#5b21b6"
              strokeWidth="2.8"
              strokeLinecap="round"
              animate={{ d: expr.mouth }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            />

          </motion.g>

          {/* ── LANTERN OF HOPE ── */}
          <AnimatePresence>
            {showLantern && (
              <motion.g key="lantern"
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                exit={{ opacity: 0, scale: 0, y: 10 }}
                transition={{ duration: 0.5, type: "spring", repeat: Infinity }}
                style={{ originX: "150px", originY: "140px" }}
              >
                {/* Glow halo */}
                <circle cx="150" cy="148" r="18" fill="#fef08a" opacity="0.25" filter="url(#mv_glow)" />
                {/* String */}
                <path d="M 143 125 Q 148 130 150 138" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
                {/* Lantern frame */}
                <path d="M 142 138 L 158 138 L 156 156 L 144 156 Z" fill="none" stroke="#b45309" strokeWidth="2" />
                {/* Top cap */}
                <rect x="144" y="135" width="12" height="3" rx="1.5" fill="#d97706" />
                {/* Bottom cap */}
                <rect x="143" y="156" width="14" height="2.5" rx="1" fill="#d97706" />
                {/* Warm glowing core */}
                <ellipse cx="150" cy="147" rx="5" ry="7" fill="url(#mv_lantern)" filter="url(#mv_glow)" />
                <circle cx="150" cy="147" r="3" fill="#fefce8" opacity="0.8" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* ── MAGICAL BOOK ── */}
          <AnimatePresence>
            {showBook && (
              <motion.g key="book"
                initial={{ opacity: 0, scale: 0.4, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.4, y: 12 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={{ originX: "100px", originY: "148px" }}
              >
                {/* Glow */}
                <ellipse cx="100" cy="150" rx="22" ry="10" fill="#a78bfa" opacity="0.2" filter="url(#mv_glow)" />
                {/* Pages */}
                <path d="M 82 142 Q 100 152 118 142 L 118 155 Q 100 165 82 155 Z" fill="#faf5ff" stroke="#ddd6fe" strokeWidth="1.5" />
                <path d="M 100 152 L 100 165" stroke="#ddd6fe" strokeWidth="1.5" />
                <path d="M 87 146 Q 100 150 113 146" fill="none" stroke="#e9d5ff" strokeWidth="1" />
                {/* Rune particles drifting off the book */}
                {[{ cx: 90, delay: 0 }, { cx: 105, delay: 0.6 }, { cx: 96, delay: 1.2 }].map(({ cx, delay }, i) => (
                  <motion.circle key={i} cx={cx} cy={140} r={1.8}
                    fill={i % 2 === 0 ? "#a78bfa" : "#fde68a"}
                    animate={{ y: [0, -18], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay, ease: "easeOut" }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* ── CELEBRATION CONFETTI ── */}
          <AnimatePresence>
            {(mascotState === 'celebrating' || mascotState === 'dancing') && (
              <motion.g key="confetti" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[
                  { x: 60,  color: "#fde68a", delay: 0   },
                  { x: 140, color: "#fca5a5", delay: 0.2 },
                  { x: 80,  color: "#6ee7b7", delay: 0.4 },
                  { x: 130, color: "#c4b5fd", delay: 0.6 },
                ].map(({ x, color, delay }, i) => (
                  <motion.circle key={i} cx={x} cy={60} r={3.5} fill={color}
                    animate={{ y: [-5, -35, -20], x: [0, (i % 2 === 0 ? 10 : -12), 8], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay, ease: "easeOut" }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

        </svg>
      </motion.div>
    </div>
  );
};

export default MoodyMascot;
