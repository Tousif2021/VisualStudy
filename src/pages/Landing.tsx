import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap, Sun, Moon, Play, ArrowRight, Brain, Target, Sparkles,
  BarChart3, Mic, Link2, Menu, X, Users, CheckCircle, Star,
  FileText, TrendingUp, Upload, Quote, ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";

// Inject global styles
const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --primary-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      --secondary-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      --accent-gradient: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      --surface-gradient: linear-gradient(rgba(17, 17, 27, 0.9), rgba(17, 17, 27, 0.8));
      --glass-effect: backdrop-filter: blur(20px);
      --card-border: 1px solid rgba(255, 255, 255, 0.1);
      --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
};

// Data
const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Study Summaries",
    description: "Transform dense documents into clear, actionable study notes instantly with advanced AI processing.",
    color: "from-blue-500 to-cyan-500",
    badge: "SMART",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Adaptive Quizzes",
    description: "Personalized quizzes that identify knowledge gaps and strengthen your understanding.",
    color: "from-purple-500 to-pink-500",
    badge: "ADAPTIVE",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Smart Flashcards",
    description: "AI-generated flashcards with spaced repetition for maximum retention and efficiency.",
    color: "from-green-500 to-emerald-500",
    badge: "EFFICIENT",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Progress Analytics",
    description: "Detailed insights into your learning patterns and improvement trends over time.",
    color: "from-orange-500 to-red-500",
    badge: "INSIGHTS",
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Voice Coach",
    description: "Practice presentations and get AI feedback on your speaking and delivery.",
    color: "from-indigo-500 to-purple-500",
    badge: "VOICE",
  },
  {
    icon: <Link2 className="w-8 h-8" />,
    title: "Resource Hub",
    description: "Organize and access all your study materials, links, and resources in one place.",
    color: "from-teal-500 to-blue-500",
    badge: "ORGANIZED",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload Your Material",
    description: "Drop in PDFs, notes, slides, or any study content you have.",
    icon: <Upload className="w-12 h-12" />,
    mockup: "document-upload",
  },
  {
    step: "02", 
    title: "AI Processes Everything",
    description: "Our AI analyzes content and generates summaries, quizzes, and flashcards.",
    icon: <Brain className="w-12 h-12" />,
    mockup: "ai-processing",
  },
  {
    step: "03",
    title: "Study Smarter",
    description: "Access personalized study tools and track your progress in real-time.",
    icon: <TrendingUp className="w-12 h-12" />,
    mockup: "dashboard",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    university: "Stanford University",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "VISUAL STUDY helped me improve my GPA from 3.2 to 3.8 in one semester. The AI summaries are incredible!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Pre-Med Student", 
    university: "Harvard University",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "The adaptive quizzes showed me exactly what to focus on. Saved me countless hours of studying.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Business Major",
    university: "MIT Sloan",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", 
    quote: "Finally, a study tool that understands how I learn. The personalized recommendations are spot-on.",
    rating: 5,
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Landing: React.FC = () => {
  // Initialize global styles
  useEffect(() => {
    injectGlobalStyles();
  }, []);

  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // For testimonial carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialCount = testimonials.length;
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialCount);
    }, 8000);

    return () => clearInterval(intervalRef.current);
  }, [testimonialCount]);

  // Scroll to top button logic
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Floating animation
  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className={`${isDark ? "dark" : ""} relative overflow-hidden scroll-smooth`}>
      {/* Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer select-none"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Zap size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">VISUAL STUDY</span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle Dark Mode"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-300" />
                )}
              </button>
              <Link to="/auth/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors">
                  How It Works
                </a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </a>
                <div className="pt-4 space-y-3">
                  <Link to="/auth/login" className="block">
                    <Button variant="ghost" fullWidth className="text-gray-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/register" className="block">
                    <Button
                      fullWidth
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center"
        aria-label="Hero Section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-green-500/60 via-emerald-400/60 to-green-400/80 border border-green-400 text-white shadow-lg shadow-green-400/40 ring-2 ring-green-400/40 animate-pulse"
            >
              <Sparkles className="w-5 h-5 mr-2 text-green-200 drop-shadow-lg" />
              Your AI Study Assistant
            </motion.div>

            {/* Main Heading with gradient animation */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 leading-tight select-none"
            >
              Simplify Your <br /> Studying with AI-Powered Precision
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed select-none"
            >
              Effortlessly transform your study materials into summaries, quizzes, and flashcards
              <br className="hidden md:block" />
              with our intelligent learning assistant
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
              aria-label="Call to action buttons"
            >
              <Link to="/auth/register" aria-label="Get started free">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 animate-pulse"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg backdrop-blur-sm"
                leftIcon={<Play className="w-5 h-5" />}
                aria-label="Watch demo"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Scroll Down Hint */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-12 flex justify-center"
              aria-hidden="true"
            >
              <ChevronRight className="w-10 h-10 text-white rotate-90 animate-bounce" />
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-8 text-gray-400 select-none"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                <span>
                  <CountUp end={50000} duration={2} separator="," />+ students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-black/40 rounded-2xl border border-white/20 p-6 shadow-2xl relative overflow-visible">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-lg p-12 min-h-[400px] flex flex-col items-center justify-center">
                <Brain className="w-20 h-20 text-purple-400 mb-5" />
                <h3 className="text-3xl font-bold text-white">AI Study Dashboard</h3>
                <p className="text-gray-300 mt-3 max-w-xl text-center">
                  Your personalized learning command center
                </p>
              </div>

              {/* Floating icons */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -left-5 bg-purple-500/25 backdrop-blur-md rounded-lg p-5 border border-purple-500/30 shadow-lg"
              >
                <FileText className="w-7 h-7 text-purple-400" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-5 -right-5 bg-blue-500/25 backdrop-blur-md rounded-lg p-5 border border-blue-500/30 shadow-lg"
              >
                <Target className="w-7 h-7 text-blue-400" />
              </motion.div>
              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-5 left-1/4 bg-green-500/25 backdrop-blur-md rounded-lg p-5 border border-green-500/30 shadow-lg"
              >
                <BarChart3 className="w-7 h-7 text-green-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        aria-label="Features"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 mb-6 select-none"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Features
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-white mb-6 select-none"
          >
            Powerful Features to
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Simplify Your Studying
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 max-w-3xl mx-auto select-none"
          >
            Discover how our AI-driven tools can transform your
            <br />
            productivity and streamline your learning
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="group relative cursor-pointer"
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/70 transition-all duration-300 shadow-lg hover:shadow-purple-500/40 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 text-xs font-semibold select-none">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed flex-grow">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        aria-label="How it works"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 mb-6 select-none"
          >
            <Users className="w-5 h-5 mr-2" />
            How it Works
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-white mb-6 select-none"
          >
            Getting Started with
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our AI Study Assistant
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 max-w-3xl mx-auto select-none"
          >
            See how easy it is to streamline your studying and boost your
            <br />
            productivity with just a few simple steps
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-12 relative"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="text-center relative cursor-default"
            >
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold mb-6 shadow-lg select-none">
                {step.step}
              </div>

              {/* Mockup Icon */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6 min-h-[200px] flex items-center justify-center mx-auto max-w-xs">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto">
                    {step.icon}
                  </div>
                  <div className="text-gray-400 text-sm select-none">Step {step.step}</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 select-none">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed select-none">{step.description}</p>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 transform -translate-y-1/2 z-10"></div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        aria-label="Testimonials"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-white mb-6 select-none"
          >
            What Students Say
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 max-w-3xl mx-auto select-none"
          >
            Thousands are already getting better results. Here's what they have to say:
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-10 border border-white/10 max-w-3xl mx-auto shadow-lg"
            >
              <Quote className="w-10 h-10 text-purple-400 mb-6" />
              <div className="flex mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed italic select-none">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="flex items-center gap-5">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="font-semibold text-white text-lg select-none">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-gray-400 select-none">{testimonials[currentTestimonial].role}</div>
                  <div className="text-sm text-purple-400 select-none">{testimonials[currentTestimonial].university}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex justify-center gap-4 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-4 h-4 rounded-full ${
                  index === currentTestimonial ? "bg-purple-500" : "bg-purple-300/40 hover:bg-purple-500/70"
                } transition-colors duration-300`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center" aria-label="Final call to action">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-14 border border-white/20 shadow-lg"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-white mb-6 select-none"
          >
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your Studying?
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 mb-10 select-none"
          >
            Join <span className="font-bold text-purple-400">50,000+</span> students who are already studying smarter with AI
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth/register" aria-label="Get started free">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 animate-pulse"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started Free
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg backdrop-blur-sm"
            >
              Schedule Demo
            </Button>
          </motion.div>
          <motion.p
            variants={fadeInUp}
            className="text-sm text-gray-400 mt-8 select-none"
          >
            No credit card required • Free forever plan available
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Zap size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white select-none">VISUAL STUDY</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md select-none">
                Transform your study experience with AI-powered learning tools designed for the modern student.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4 select-none">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4 select-none">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm select-none">© 2025 VISUAL STUDY. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm select-none">🍪 We use cookies to enhance your experience</span>
              <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">Accept</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      {showTopBtn && (
        <button
          aria-label="Back to top"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </button>
      )}
    </div>
  );
};

export default Landing;