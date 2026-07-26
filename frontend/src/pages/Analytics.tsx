import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MoodChart from '../components/MoodChart';
import { useTheme } from '../context/ThemeContext';
import type { EmotionName } from '../utils/emotions';
import { Sparkles, TrendingUp, CalendarDays, BrainCircuit, Target, Activity, Heart, Lightbulb } from 'lucide-react';

interface AIInsights {
  currentState?: string;
  weeklyAnalysis?: string;
  monthlyProgress?: string;
  moodPattern?: string;
  triggers?: string;
  positiveActivities?: string;
  recommendation?: string;
  encouragement?: string;
}

const ALL_EMOTIONS = [
  'Love', 'Happy', 'Sad', 'Angry', 'Calm', 
  'Motivated', 'Nostalgic', 'Anxious', 'Excited', 
  'Neutral', 'Lonely', 'Pessimistic'
];

// Rich mood-specific messages for every emotion
const MOOD_MESSAGES: Record<string, AIInsights> = {
  Lonely: {
    currentState: "You've been feeling mostly Lonely. Solitude can feel heavy, but remember that you are worthy of deep connection.",
    weeklyAnalysis: "Loneliness has been your primary emotional theme this week. Reaching out to a friend can help bridge the gap.",
    monthlyProgress: "You've spent significant time in reflection this month. Solitude builds self-awareness, but balance it with social warmth.",
    moodPattern: "Loneliness tends to peak for you in quiet evenings or weekend downtime. Planning light activities helps fill those spaces.",
    triggers: "Isolation, quiet evenings, or lack of social plans tend to trigger feelings of loneliness.",
    positiveActivities: "Call a close friend, join a community event, go for a walk in a lively park, or visit a cozy coffee shop.",
    recommendation: "Reach out to one person today — even a quick text message can restore a warm sense of connection.",
    encouragement: "You are never truly alone. Your presence matters deeply to people around you! ❤️"
  },
  Pessimistic: {
    currentState: "You've been feeling somewhat Pessimistic recently. It's valid when things feel tough, but dark clouds always pass.",
    weeklyAnalysis: "Doubt and cynicism were present in your mood log this week. Challenge negative self-talk with gentle self-compassion.",
    monthlyProgress: "This month brought moments of skepticism. Remember that your thoughts are feelings, not permanent realities.",
    moodPattern: "Pessimistic thoughts usually arise under high stress or fatigue. Prioritizing rest helps reset your outlook.",
    triggers: "Setbacks, tiredness, and unexpected hurdles tend to spark pessimistic thinking.",
    positiveActivities: "Write down 3 things you are grateful for, listen to an inspiring podcast, or take a refreshing outdoor walk.",
    recommendation: "Focus on what is within your control right now. Small positive steps rebuild optimism.",
    encouragement: "Every day offers a clean slate. Shift your focus to one small victory today! 🌅"
  },
  Love: {
    currentState: "You're radiating warmth and affection. Your heart is wide open — cherish these loving feelings!",
    weeklyAnalysis: "Your Love mood has been glowing this week. You're more empathetic and connected to people around you.",
    monthlyProgress: "A month filled with loving energy! You've been nurturing meaningful bonds and emotional connections.",
    moodPattern: "Love appears most in your evenings — perhaps during time with family or special moments with someone close.",
    triggers: "Spending time with loved ones, listening to romantic songs, and watching feel-good movies tend to spark your Love mood.",
    positiveActivities: "Write a love letter, go on a sunset walk, cook your favorite meal with someone you care about.",
    recommendation: "Express your feelings openly today — a kind word can brighten someone's entire day!",
    encouragement: "Love is the most powerful force in the world. Keep shining it on the people around you! 💕"
  },
  Happy: {
    currentState: "You're in a fantastic mood! Your positivity is contagious and your energy is high. Keep riding this wave!",
    weeklyAnalysis: "What a joyful week! You've been smiling more, engaging with people, and spreading good vibes everywhere.",
    monthlyProgress: "This has been one of your happiest months. Your mood chart shows consistent upward trends — wonderful!",
    moodPattern: "You tend to feel happiest in the mornings and after social activities. You're a true sunshine person!",
    triggers: "Music, fun conversations, dancing, and spontaneous outings seem to ignite your Happy mood instantly.",
    positiveActivities: "Dance to your favorite song, call a friend for a laugh, or try something completely new today!",
    recommendation: "Channel this happiness into creativity — start that project you've been dreaming about!",
    encouragement: "Your smile is your superpower. The world is brighter because of your happy energy! ✨"
  },
  Sad: {
    currentState: "You're going through a tough time emotionally. It's okay — sadness is part of being human. Be gentle with yourself.",
    weeklyAnalysis: "This week has been emotionally heavy. Remember: every storm runs out of rain. Better days are always coming.",
    monthlyProgress: "You've been carrying a lot emotionally. It takes courage to keep going — and you ARE doing that. Be proud.",
    moodPattern: "Sadness tends to peak for you in quiet evenings. Try filling those moments with something you love.",
    triggers: "Loneliness, missing someone, or stressful situations seem to weigh on your heart the most.",
    positiveActivities: "Listen to your favorite song, write in your journal, take a warm shower, or reach out to a friend.",
    recommendation: "Talk to someone you trust today. Sharing how you feel is a sign of strength, not weakness.",
    encouragement: "Even the darkest night will end, and the sun will rise again. You are stronger than you know. 🌅"
  },
  Angry: {
    currentState: "You're feeling intense emotions right now. It's valid to feel angry — the key is to channel it wisely.",
    weeklyAnalysis: "There's been some tension this week. Identify what's triggering your frustration and address it calmly.",
    monthlyProgress: "Your emotional intensity has been high lately. Try to find productive outlets that release this energy.",
    moodPattern: "Your anger tends to build up during stressful situations or when you feel unheard. Your feelings are valid.",
    triggers: "Injustice, feeling misunderstood, or overwhelming pressure tend to spark your Angry mood the most.",
    positiveActivities: "Go for a run, blast your favorite hype music, punch a pillow, or write out your feelings uncensored.",
    recommendation: "Take 10 deep breaths before reacting. Physical exercise is your best friend right now.",
    encouragement: "Your passion and intensity are powerful. Direct them toward something meaningful — you'll move mountains! 🔥"
  },
  Calm: {
    currentState: "You're in a beautifully peaceful state. Your mind is clear and your heart is steady. Embrace this serenity.",
    weeklyAnalysis: "A tranquil and balanced week. You've been thinking clearly and handling situations with great composure.",
    monthlyProgress: "What an emotionally mature month! Your ability to stay calm under pressure has grown significantly.",
    moodPattern: "Calmness comes naturally to you in quiet mornings and reflective evenings. You treasure stillness.",
    triggers: "Nature, soft music, meditation, reading, and low-stimulus environments help you stay in your calm zone.",
    positiveActivities: "Meditate for 10 minutes, take a peaceful walk, journal your thoughts, or do some light stretching.",
    recommendation: "Use this mental clarity to plan something important you've been putting off — now is the perfect time.",
    encouragement: "Your calm presence is a gift to everyone around you. The world needs more of your peaceful energy. 🍃"
  },
  Motivated: {
    currentState: "You're in full hustle mode! Your ambition is running high and you're ready to conquer everything in your path.",
    weeklyAnalysis: "An incredibly productive week! You've been setting goals, making progress, and feeling unstoppable.",
    monthlyProgress: "You've accomplished so much this month. Your discipline and drive are really paying off — keep pushing!",
    moodPattern: "Motivation peaks for you early in the day and after small wins. Stack those victories for momentum!",
    triggers: "Inspirational content, competitive environments, personal goals, and upbeat music fuel your motivation fire.",
    positiveActivities: "Make a to-do list and crush it, listen to a motivational podcast, or start that big goal today!",
    recommendation: "While riding this wave, also remember to rest. Sustainable effort beats burnout every time!",
    encouragement: "You have the drive and the vision. Nothing can stop someone who refuses to quit! 💪"
  },
  Nostalgic: {
    currentState: "You're feeling a beautiful pull toward memories and the past. Nostalgia is the heart's way of loving what mattered.",
    weeklyAnalysis: "Old memories have been visiting you this week. Cherish them — they are the chapters that made you who you are.",
    monthlyProgress: "A reflective month filled with meaningful memories. Use this nostalgia as fuel to create new beautiful moments.",
    moodPattern: "You feel most nostalgic late at night or when you hear old songs. These feelings are precious — sit with them.",
    triggers: "Old photos, childhood songs, familiar smells, and reconnecting with old friends often bring nostalgia flooding in.",
    positiveActivities: "Look through old photos, call a childhood friend, re-watch a beloved movie, or revisit your old neighborhood.",
    recommendation: "Use this nostalgia to reconnect with someone you've been missing. Reach out — it's never too late.",
    encouragement: "The best moments of your life haven't happened yet. Your past made you beautiful — your future will be extraordinary! 🌟"
  },
  Anxious: {
    currentState: "You're feeling a bit overwhelmed right now. Anxiety is your mind being extra protective — breathe through it.",
    weeklyAnalysis: "It's been a nerve-wracking week. Identify one thing you CAN control today and focus only on that.",
    monthlyProgress: "You've been managing a lot of worry this month. You're still here, still going — that takes real courage.",
    moodPattern: "Anxiety tends to spike for you before important events or when there's too much uncertainty. That's very normal.",
    triggers: "Uncertainty, too many tasks, social pressure, and not getting enough sleep seem to feed your anxiety most.",
    positiveActivities: "Box breathe (4-4-4-4), take a walk outside, call someone comforting, or write out your fears.",
    recommendation: "Focus on right now — not what might happen. What's one small thing you can do in the next 5 minutes?",
    encouragement: "Anxiety means you care deeply. You're not weak — you're brave for facing your fears every single day. 🦋"
  },
  Excited: {
    currentState: "You're buzzing with excitement! Something wonderful is on the horizon and you can feel the electric energy!",
    weeklyAnalysis: "What an electrifying week! Your enthusiasm has been infectious and you've been lighting up every room.",
    monthlyProgress: "A month full of anticipation and exciting possibilities. You've been embracing life with open arms!",
    moodPattern: "You get most excited about new experiences, upcoming events, and creative projects. Your spirit is alive!",
    triggers: "Upcoming plans, new opportunities, good news, adventure, and being around enthusiastic people spark your excitement.",
    positiveActivities: "Make a vision board, plan something fun to look forward to, share your excitement with friends!",
    recommendation: "Turn this excitement into action — take the first step toward that dream or goal today!",
    encouragement: "Your excitement is pure magic. The universe loves enthusiasm — it opens doors you didn't even know existed! 🎉"
  },
  Neutral: {
    currentState: "You're feeling balanced and even-keeled today. Neutrality is a great place to reflect and reset.",
    weeklyAnalysis: "A steady and consistent week. Sometimes staying level is exactly what the mind needs to recharge.",
    monthlyProgress: "A calm and measured month. You've been maintaining stability and that's something to appreciate.",
    moodPattern: "Your neutral moods often come after intense emotional periods — it's your mind finding its natural balance.",
    triggers: "Routine days, low stimulation, and predictable environments tend to keep you in this balanced neutral zone.",
    positiveActivities: "Try something new today — step slightly out of your comfort zone to spark some positive energy!",
    recommendation: "Use this balanced state to plan ahead, set intentions, or start a healthy new habit.",
    encouragement: "Stillness has its own wisdom. In the pause between feelings, you find your truest self. 🌿"
  }
};

const getMoodMessages = (emotion: string): AIInsights => {
  return MOOD_MESSAGES[emotion] || MOOD_MESSAGES['Lonely'] || MOOD_MESSAGES['Neutral'];
};

const InsightCard = ({ title, content, icon: Icon, delay = 0, colorClass = "text-accent" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-surface/60 backdrop-blur-xl border border-white/5 hover:border-white/20 transition-colors rounded-3xl p-6 shadow-xl flex flex-col h-full"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-xl bg-white/5 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">{title}</h3>
    </div>
    <p className="text-white/90 leading-relaxed text-base flex-grow">
      {content}
    </p>
  </motion.div>
);

const Analytics: React.FC = () => {
  const { currentEmotion, setEmotion } = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState<string>(currentEmotion || 'Lonely');

  useEffect(() => {
    if (currentEmotion && ALL_EMOTIONS.includes(currentEmotion)) {
      setSelectedEmotion(currentEmotion);
    }
  }, [currentEmotion]);

  const handleSelectEmotion = (emo: string) => {
    setSelectedEmotion(emo);
    setEmotion(emo as EmotionName);
  };

  const insights = getMoodMessages(selectedEmotion);

  return (
    <div className="p-8 space-y-8 pb-20 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-accent to-purple-600 text-white shadow-lg shadow-accent/20">
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI Psychological Insight</h1>
            <p className="text-white/50 mt-1">
              Analyzing psychological patterns for your <span className="text-accent font-semibold">{selectedEmotion}</span> mood.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mood Filter Pill Selector — Changes analysis INSTANTLY for every mood */}
      <div className="flex flex-wrap gap-2 pt-1 pb-2 border-b border-white/10">
        {ALL_EMOTIONS.map((emo) => (
          <button
            key={emo}
            onClick={() => handleSelectEmotion(emo)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              selectedEmotion === emo
                ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                : 'bg-surface/80 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {emo}
          </button>
        ))}
      </div>

      {/* Mood Chart Section */}
      <div className="mb-8">
        <MoodChart />
      </div>

      <div className="space-y-6">
        {/* Top Row: Current State & Encouragement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            key={`state-${selectedEmotion}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-surface to-surface/40 backdrop-blur-xl border border-accent/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <BrainCircuit size={24} className="text-accent" />
              <h2 className="text-xl font-bold text-white">Current Emotional State</h2>
            </div>
            <p className="text-xl font-medium text-white/90 leading-relaxed relative z-10">
              {insights.currentState}
            </p>
          </motion.div>

          <motion.div
            key={`encouragement-${selectedEmotion}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-pink-500/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-3">
              <Heart size={20} className="text-pink-400" />
              <h3 className="text-sm font-bold text-pink-400/80 uppercase tracking-wider">A Word from Moody</h3>
            </div>
            <p className="text-xl font-medium text-white/90 italic leading-relaxed">
              "{insights.encouragement}"
            </p>
          </motion.div>
        </div>

        {/* Grid of 6 smaller insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InsightCard
            key={`weekly-${selectedEmotion}`}
            title="Weekly Analysis"
            content={insights.weeklyAnalysis}
            icon={TrendingUp}
            colorClass="text-emerald-400"
            delay={0.1}
          />
          <InsightCard
            key={`monthly-${selectedEmotion}`}
            title="Monthly Progress"
            content={insights.monthlyProgress}
            icon={CalendarDays}
            colorClass="text-blue-400"
            delay={0.15}
          />
          <InsightCard
            key={`pattern-${selectedEmotion}`}
            title="Mood Pattern"
            content={insights.moodPattern}
            icon={Activity}
            colorClass="text-orange-400"
            delay={0.2}
          />
          <InsightCard
            key={`trigger-${selectedEmotion}`}
            title="Trigger Detection"
            content={insights.triggers}
            icon={Target}
            colorClass="text-red-400"
            delay={0.25}
          />
          <InsightCard
            key={`activity-${selectedEmotion}`}
            title="Positive Activities"
            content={insights.positiveActivities}
            icon={Sparkles}
            colorClass="text-yellow-400"
            delay={0.3}
          />
          <InsightCard
            key={`recommendation-${selectedEmotion}`}
            title="Recommendation"
            content={insights.recommendation}
            icon={Lightbulb}
            colorClass="text-teal-400"
            delay={0.35}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
