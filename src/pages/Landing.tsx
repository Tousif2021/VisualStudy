import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap,
  Sun,
  Moon,
  Play,
  ArrowRight,
  Brain,
  Target,
  Sparkles,
  BarChart3,
  Award,
  Users,
  ChevronRight,
  Quote,
  Star,
  Upload,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/Button";

// Avatars for "live" effect
const AVATARS = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
  "https://randomuser.me/api/portraits/men/5.jpg",
];

// Features data
const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Study Summaries",
    description: "Turn dense docs into actionable study notes instantly.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Adaptive Quizzes",
    description: "Personalized quizzes to spot your gaps and boost your strengths.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Smart Flashcards",
    description: "AI-generated flashcards, spaced repetition, max retention.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Progress Analytics",
    description: "See your learning patterns and improvement trends.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Personal Recommendations",
    description: "Get study tips tailored for you by AI.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaborative Learning",
    description: "Share notes and study with your crew, frictionless.",
    color: "from-teal-500 to-blue-500",
  },
];

// How It Works steps
const howItWorks = [
  {
    step: "01",
    title: "Upload Material",
    description: "Drop in your PDFs, notes, or slides.",
    icon: <Upload className="w-12 h-12" />,
  },
  {
    step: "02",
    title: "AI Does Its Magic",
    description: "Content analyzed, tools generated, quizzes crafted.",
    icon: <Brain className="w-12 h-12" />,
  },
  {
    step: "03",
    title: "Study, Win, Repeat",
    description: "Summaries, quizzes, flashcards, analytics—all in one place.",
    icon: <TrendingUp className="w-12 h-12" />,
  },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    university: "Stanford University",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote:
      "VISUAL STUDY helped me improve my GPA from 3.2 to 3.8 in one semester. The AI summaries are wild!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Pre-Med Student",
    university: "Harvard University",
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote:
      "The adaptive quizzes showed me exactly what to focus on. Saved me so much time.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Business Major",
    university: "MIT Sloan",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote:
      "A study tool that finally gets how I learn. The recommendations are on point.",
    rating: 5,
  },
];

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const Landing: React.FC = () => {
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
            <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 font-medium transition-colors">Reviews</a>
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
        {/* Blobs */}
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
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
            variants={fadeInUp}
            className="inline-flex items-center px-5 py-2 mb-7 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 text-base font-semibold"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Study Revolution
          </motion.div>
          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-7 leading-tight tracking-tight drop-shadow"
          >
            Transform How You Study <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">With AI</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10 mx-auto leading-relaxed"
          >
            Instantly summarize notes, generate smart quizzes, and track your progress.<br className="hidden md:block" />
            <span className="font-semibold text-blue-700 dark:text-blue-400">50,000+</span> students already leveling up!
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-center justify-center gap-8 mb-10">
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
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            <span className="font-semibold">No risk.</span> Free forever plan available. Join before we close beta!
          </p>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  <CountUp end={50000} duration={1.5} separator="," />+
                </div>
                <div className="text-gray-600 dark:text-gray-300">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.9/5</div>
                <div className="text-gray-600 dark:text-gray-300">Avg. Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  <CountUp end={2000000} duration={1.5} separator="," />+
                </div>
                <div className="text-gray-600 dark:text-gray-300">Study Sessions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">89%</div>
                <div className="text-gray-600 dark:text-gray-300">Grade Improvement</div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-gray-500 font-semibold">As seen in:</div>
              <div className="text-gray-400 font-medium">TechCrunch</div>
              <div className="text-gray-400 font-medium">EdTech Magazine</div>
              <div className="text-gray-400 font-medium">Inside Higher Ed</div>
              <div className="text-gray-400 font-medium">Product Hunt</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How VISUAL STUDY Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Turn your material into next-level study tools, in just 3 steps.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-full mb-6">
                  {step.step}
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-300">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Features for Smarter Learning
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to ace your studies, all in one place.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-800"
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Students Say
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Thousands are already getting better results. Here’s the real talk:
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 relative"
              >
                <Quote className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">{testimonial.university}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Level Up Your Studying?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90">
              Join <span className="font-bold">50,000+</span> students boosting their grades with AI.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.open("https://www.youtube.com/results?search_query=visual+study+demo", "_blank")}
              >
                Schedule Demo
              </Button>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-sm mt-6 opacity-75">
              No credit card required • Free forever plan available
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Zap size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold">VISUAL STUDY</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your study experience with AI-powered learning tools built for Gen Z.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors"
                >
                  <span className="text-sm font-bold">f</span>
                </a>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 cursor-pointer transition-colors"
                >
                  <span className="text-sm font-bold">t</span>
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <span className="text-sm font-bold">in</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 VISUAL STUDY. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">🍪 We use cookies to enhance your experience</span>
              <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                Accept
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
