import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Zap, ArrowRight, Star, User, BookOpen, Sparkles, CheckCircle, Brain } from "lucide-react";
// Swap with your Button component!
import { Button } from "../components/ui/Button";

// Floating glass "cards" content
const FLOATING_CARDS = [
  {
    title: "AI Study Summary",
    icon: <Brain className="w-7 h-7 text-blue-500" />,
    content: "Turn notes into concise, easy-to-learn summaries in seconds.",
    color: "from-blue-400/90 to-purple-400/80",
    y: -40,
    x: -80,
    delay: 0,
  },
  {
    title: "24 Flashcards Ready",
    icon: <Sparkles className="w-7 h-7 text-purple-500" />,
    content: "Interactive, smart cards for max retention.",
    color: "from-purple-400/90 to-pink-400/80",
    y: -20,
    x: 90,
    delay: 0.1,
  },
  {
    title: "92% Quiz Accuracy",
    icon: <CheckCircle className="w-7 h-7 text-green-500" />,
    content: "Personalized quizzes, instant feedback.",
    color: "from-green-400/90 to-emerald-400/80",
    y: 65,
    x: -45,
    delay: 0.2,
  },
  {
    title: "Top Student Community",
    icon: <User className="w-7 h-7 text-yellow-500" />,
    content: "50,000+ students learning smarter.",
    color: "from-yellow-400/90 to-orange-400/80",
    y: 55,
    x: 100,
    delay: 0.3,
  },
];

const heroVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.7, type: "spring", stiffness: 80 },
  }),
};

const Landing = () => {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark bg-[#101114]" : "bg-white"}>
      {/* HEADER */}
      <header className="z-50 sticky top-0 w-full bg-white/70 dark:bg-[#101114]/80 backdrop-blur-md border-b border-transparent dark:border-[#18192a] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-xl w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 shadow-md">
              <Zap className="text-white" size={24} />
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:text-white">VISUAL STUDY</span>
          </div>
          <nav className="hidden md:flex gap-10">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">Features</a>
            <a href="#how" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">How It Works</a>
            <a href="#reviews" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-[#232337]" onClick={() => setDark(d => !d)}>
              {dark ? "🌞" : "🌙"}
            </button>
            <Link to="/auth/login">
              <Button variant="ghost" className="text-gray-700 dark:text-gray-200">Sign In</Button>
            </Link>
            <Link to="/auth/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-x-clip">
        {/* Wavy Gradient Blobs */}
        <div className="absolute -top-32 -left-36 w-[520px] h-[350px] rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-300/10 blur-3xl pointer-events-none z-0"></div>
        <div className="absolute -bottom-40 -right-44 w-[480px] h-[340px] rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/10 blur-3xl pointer-events-none z-0"></div>

        {/* Main hero */}
        <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-32 px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Hero Text/CTA */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              variants={heroVariant}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-6xl font-black leading-tight text-gray-900 dark:text-white mb-8"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">The Future of Studying</span>
              <br />
              <span className="block font-medium mt-2 text-gray-700 dark:text-gray-300">AI-powered, effortless, and a little bit magic.</span>
            </motion.h1>
            <motion.p
              variants={heroVariant}
              initial="hidden"
              animate="visible"
              custom={2}
              className="max-w-xl mx-auto md:mx-0 text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Summarize, quiz, track progress. Level up your grades with <span className="font-bold text-blue-600 dark:text-purple-400">Visual Study</span>.
            </motion.p>
            {/* Stats */}
            <motion.div
              variants={heroVariant}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-row justify-center md:justify-start gap-8 mb-10"
            >
              <div>
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  <CountUp end={50000} duration={1.5} separator="," />+
                </span>
                <div className="text-gray-500 text-xs">Students</div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                  <CountUp end={4.9} decimals={1} duration={1.5} />/5
                </span>
                <div className="text-gray-500 text-xs">Avg. Rating</div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-green-600 dark:text-emerald-400">
                  <CountUp end={89} duration={1.5} />%
                </span>
                <div className="text-gray-500 text-xs">Grade Boost</div>
              </div>
            </motion.div>
            {/* CTA */}
            <motion.div
              variants={heroVariant}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex gap-4 justify-center md:justify-start"
            >
              <Link to="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl transform hover:scale-105 transition-all duration-200 px-7 text-base" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start for Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50" onClick={() => window.open("https://www.youtube.com/results?search_query=visual+study+demo", "_blank")}>
                Watch Demo
              </Button>
            </motion.div>
          </div>
          {/* Floating Glass Cards */}
          <div className="flex-1 relative h-[420px] w-full flex items-center justify-center">
            {FLOATING_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: card.y + 40, x: card.x }}
                animate={{ opacity: 1, y: card.y, x: card.x }}
                transition={{ delay: 0.3 + card.delay, duration: 0.85, type: "spring", stiffness: 60 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 32px rgba(80,80,180,0.13)" }}
                className={`absolute min-w-[260px] max-w-[300px] px-6 py-5 rounded-2xl shadow-xl border border-white/40 dark:border-gray-900 bg-gradient-to-br ${card.color} backdrop-blur-xl transition-all cursor-pointer hover:ring-2 hover:ring-blue-400/20`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%)`,
                  zIndex: 10 - i,
                  pointerEvents: "auto",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {card.icon}
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">{card.title}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-base">{card.content}</div>
              </motion.div>
            ))}
            {/* Floating main hero UI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65, duration: 0.8, type: "spring", stiffness: 120 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            >
              <div className="w-[250px] h-[310px] rounded-2xl bg-white/80 dark:bg-[#191a29]/80 shadow-2xl border border-blue-100 dark:border-gray-800 p-5 flex flex-col gap-4 items-center justify-center relative overflow-hidden">
                <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
                <div className="font-bold text-xl text-gray-800 dark:text-white mb-1">Chapter 5: Quantum Physics</div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "88%" }}
                    transition={{ delay: 1.05, duration: 1.3, type: "tween" }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 mb-2">AI Summary: <span className="font-semibold text-blue-500">88% complete</span></span>
                <div className="flex gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <Star className="w-6 h-6 text-yellow-400" />
                  <Star className="w-6 h-6 text-yellow-400" />
                  <Star className="w-6 h-6 text-yellow-400" />
                  <Star className="w-6 h-6 text-gray-200 dark:text-gray-800" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Add your Features, Testimonials, etc. sections below if needed */}
    </div>
  );
};

export default Landing;
