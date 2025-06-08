import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Sun, Moon, Play, ArrowRight } from "lucide-react";
import CountUp from "react-countup";
import { Button } from "../components/ui/Button";

const AVATARS = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
  "https://randomuser.me/api/portraits/men/5.jpg",
];

const LandingHero: React.FC = () => {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark bg-gray-950" : "bg-white"}>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 12 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <Zap size={24} className="text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:text-white">
              VISUAL STUDY
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 font-medium transition-colors">How It Works</a>
            <a href="#reviews" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 font-medium transition-colors">Reviews</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 font-medium transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              className="rounded-full p-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Dark Mode"
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
            <Link to="/auth/login">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-200">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[86vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-950 pb-6">
        {/* Glassy/gradient background blobs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-36 -left-48 w-[430px] h-[430px] bg-gradient-to-tr from-purple-400/30 to-blue-400/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-32 -right-36 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
        />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl mx-auto bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-800 rounded-3xl shadow-2xl p-10 pt-14"
        >
          {/* Live avatars */}
          <motion.div
            className="flex items-center absolute -top-8 left-8 bg-white/70 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex -space-x-2">
              {AVATARS.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="avatar"
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 shadow"
                  style={{ zIndex: 5 - idx }}
                />
              ))}
            </div>
            <span className="ml-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
              <CountUp end={12341} duration={2} separator="," /> studying now
            </span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center px-5 py-2 mb-7 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 text-base font-semibold"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Study Revolution
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-7 leading-tight tracking-tight drop-shadow">
            Transform How You Study <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">With AI</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10 mx-auto leading-relaxed"
          >
            Instantly summarize notes, generate smart quizzes, and track your progress. <br className="hidden md:block" />
            <span className="font-semibold text-blue-700 dark:text-blue-400">50,000+</span> students are already leveling up!
          </motion.p>

          {/* Stats + CTAs */}
          <div className="flex flex-col md:flex-row md:items-center justify-center gap-8 mb-10">
            {/* Stats */}
            <div className="flex flex-row gap-7">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  <CountUp end={4.9} decimals={1} duration={1.5} />/5
                </span>
                <span className="text-gray-500 text-sm">Rating</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                  <CountUp end={89} duration={1.5} />%
                </span>
                <span className="text-gray-500 text-sm">See Grade Boost</span>
              </div>
            </div>
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 px-8 text-base"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Free – No Card Needed
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<Play className="w-5 h-5" />}
                className="border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => window.open("https://www.youtube.com/results?search_query=visual+study+demo", "_blank")}
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* FOMO / Social Proof */}
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            <span className="font-semibold">No risk.</span> Free forever plan available. Join before we close beta!
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingHero;
