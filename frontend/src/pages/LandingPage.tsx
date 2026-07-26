import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import {
  Sparkles, Brain, Music2, Film, BookOpen, Users, TrendingUp,
  ChevronRight, Star, Heart, Zap, Shield, Smile
} from 'lucide-react';

const FEATURES = [
  { icon: Brain,     title: 'AI Mood Analysis',         desc: 'Gemini-powered emotional insights that understand you deeply.',           color: 'from-violet-500 to-purple-600' },
  { icon: Music2,    title: 'Mood-Matched Music',       desc: 'Curated Indian & global tracks that resonate with how you feel.',          color: 'from-pink-500 to-rose-600' },
  { icon: Film,      title: 'Movie Picks for Your Vibe',desc: 'Films handpicked by emotion — from blockbusters to hidden gems.',          color: 'from-amber-500 to-orange-600' },
  { icon: BookOpen,  title: 'Mood Journal',             desc: 'Your private emotional diary to reflect and grow.',                        color: 'from-emerald-500 to-teal-600' },
  { icon: Users,     title: 'Friends & Social',         desc: 'Share your emotional journey with people who care.',                       color: 'from-blue-500 to-cyan-600' },
  { icon: TrendingUp,title: 'Analytics Dashboard',      desc: 'Beautiful charts tracking your emotional patterns over time.',             color: 'from-indigo-500 to-blue-600' },
];

const TESTIMONIALS = [
  { name: 'Priya R.',   mood: '😊 Happy',    text: 'MoodVerse changed how I understand myself. The music suggestions are spot on!' },
  { name: 'Arjun K.',   mood: '💪 Motivated', text: 'The daily streaks keep me consistent. Best wellness app ever built!' },
  { name: 'Kavitha S.', mood: '😌 Calm',     text: 'The journal feature is like having a therapist in my pocket. Absolutely love it.' },
];

const EMOJIS = ['😊', '💪', '😌', '🤩', '❤️', '😢', '😤', '🎶'];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-[#09090f] text-white overflow-x-hidden font-sans">
      {/* ─── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            MoodVerse
          </span>
          <span className="text-[10px] font-bold text-white/30 ml-1 mt-1">2.0</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 transition-all shadow-lg shadow-violet-500/20"
          >
            Get Started Free
          </button>
        </motion.div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />
        </div>

        {/* Floating emoji orbs */}
        {EMOJIS.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl select-none pointer-events-none"
            style={{
              left: `${10 + (i * 11) % 80}%`,
              top:  `${15 + (i * 13) % 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8"
          >
            <Sparkles size={14} />
            AI-Powered Emotional Wellness
            <Sparkles size={14} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Discover Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Mood Universe
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Track your emotions, get AI-curated music & movies, journal your thoughts,
            and connect with friends — all in one beautiful app.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/signup')}
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 transition-all hover:scale-105"
            >
              Start Your Journey
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg transition-all backdrop-blur-sm"
            >
              Sign In
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 mt-12 text-white/30 text-sm"
          >
            <div className="flex items-center gap-1.5">
              <Heart size={14} className="text-pink-400" />
              <span>Free Forever</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-violet-400" />
              <span>Privacy First</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              <span>AI-Powered</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="py-32 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-medium mb-4">
            <Smile size={14} /> Everything You Need
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Your Complete Emotional
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"> Companion</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/8 hover:border-white/15 backdrop-blur-sm transition-all group cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── MOOD DEMO STRIP ──────────────────────────────────── */}
      <section className="py-16 overflow-hidden">
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, rep) =>
            ['😊 Happy', '💪 Motivated', '😌 Calm', '🤩 Excited', '❤️ Love', '😢 Sad', '😤 Angry', '🎶 Nostalgic'].map((m, i) => (
              <span
                key={`${rep}-${i}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/8 text-white/60 text-sm font-medium flex-shrink-0"
              >
                {m}
              </span>
            ))
          )}
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-3">Loved by Users</h2>
          <p className="text-white/40">Real stories from real people on their emotional journey</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white/[0.04] border border-white/8 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/65 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.mood}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────── */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-16 rounded-3xl bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-violet-500/20 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Ready to Explore Your
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Emotional Universe?
              </span>
            </h2>
            <p className="text-white/50 mb-8 text-lg">Join MoodVerse and start your journey today. It's free.</p>
            <button
              onClick={() => navigate('/signup')}
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 transition-all hover:scale-105"
            >
              Get Started Free
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-10 px-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-white/40 text-sm">MoodVerse 2.0 — Built with ❤️ for emotional wellness</span>
        </div>
        <div className="flex items-center gap-6 text-white/30 text-sm">
          <button onClick={() => navigate('/login')} className="hover:text-white/60 transition-colors">Sign In</button>
          <button onClick={() => navigate('/signup')} className="hover:text-white/60 transition-colors">Sign Up</button>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  );
}
