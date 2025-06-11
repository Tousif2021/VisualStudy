import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap, Sun, Moon, ArrowRight, Brain, Target, Sparkles, BarChart3,
  Mic, Link2, Menu, X, Users, CheckCircle, Star, FileText, TrendingUp,
  Quote, ChevronRight
} from "lucide-react";
import { ThemeToggle } from "../components/ui/ThemeToggle";

// ===== Button component (minimal, pro) =====
const Button = ({
  children, className = "", size = "md", variant = "solid", leftIcon, rightIcon, fullWidth, ...rest
}) => {
  const sizeMap = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-4 text-lg",
  };
  const variantMap = {
    solid: "bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold hover:from-blue-800 hover:to-blue-600 shadow-lg",
    outline: "border-2 border-blue-300 dark:border-blue-600 bg-transparent text-white font-semibold hover:bg-blue-900/10 dark:hover:bg-blue-800/20",
    ghost: "bg-transparent text-blue-100 dark:text-blue-200 hover:bg-blue-900/10 dark:hover:bg-blue-800/20",
  };
  return (
    <button
      className={[
        "rounded-xl flex items-center justify-center gap-2 transition-all duration-200",
        sizeMap[size], variantMap[variant], fullWidth ? "w-full" : "", className,
      ].join(" ")}
      {...rest}
    >
      {leftIcon && <span className="mr-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1">{rightIcon}</span>}
    </button>
  );
};

// ===== Inject professional SVG Mosaic Background =====
const injectGlobalStyles = () => {
  if (document.getElementById("landing-global-styles")) return;
  const style = document.createElement("style");
  style.id = "landing-global-styles";
  style.textContent = `
    .pro-mosaic-bg {
      position: fixed;
      inset: 0;
      z-index: -10;
      pointer-events: none;
      width: 100vw; height: 100vh;
      background: url('data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect fill="%230f172a" width="100%" height="100%"/><g opacity="0.08"><rect fill="%233b82f6" x="0" y="0" width="80" height="80"/><rect fill="%238b5cf6" x="80" y="80" width="80" height="80"/><rect fill="%236366f1" x="160" y="0" width="80" height="80"/><rect fill="%234bc9f6" x="240" y="80" width="80" height="80"/><rect fill="%238b5cf6" x="320" y="0" width="80" height="80"/></g></svg>');
      background-size: 220px 220px;
      background-repeat: repeat;
      background-position: center;
    }
    .dark .pro-mosaic-bg {
      background: url('data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect fill="%23111827" width="100%" height="100%"/><g opacity="0.05"><rect fill="%233b82f6" x="0" y="0" width="80" height="80"/><rect fill="%238b5cf6" x="80" y="80" width="80" height="80"/><rect fill="%236366f1" x="160" y="0" width="80" height="80"/><rect fill="%234bc9f6" x="240" y="80" width="80" height="80"/><rect fill="%238b5cf6" x="320" y="0" width="80" height="80"/></g></svg>');
    }
    .neon-btn {
      box-shadow: 0 0 10px #3b82f677, 0 0 30px #3b82f644;
    }
    .animate-float { animation: float 7s ease-in-out infinite; }
    @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
  `;
  document.head.appendChild(style);
};

// ===== Data =====
const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Summaries",
    description: "Convert complex materials into concise, well-structured study notes using advanced natural language processing.",
    color: "from-blue-500 to-cyan-500",
    badge: "SUMMARY",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Adaptive Assessments",
    description: "Automatically generate custom quizzes that focus on your knowledge gaps, optimizing your learning outcomes.",
    color: "from-purple-500 to-pink-500",
    badge: "ASSESS",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Intelligent Flashcards",
    description: "Create and review AI-curated flashcards with intelligent scheduling for long-term retention.",
    color: "from-green-500 to-emerald-500",
    badge: "REVIEW",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Comprehensive Analytics",
    description: "Track progress, identify strengths, and pinpoint areas for improvement with real-time analytics.",
    color: "from-sky-500 to-blue-500",
    badge: "ANALYTICS",
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Presentation Practice",
    description: "Enhance your speaking and presentation skills with AI-powered voice feedback and practice tools.",
    color: "from-indigo-500 to-blue-500",
    badge: "PRESENT",
  },
  {
    icon: <Link2 className="w-8 h-8" />,
    title: "Resource Management",
    description: "Organize and access all course files, notes, and references from a unified, intuitive platform.",
    color: "from-teal-500 to-blue-500",
    badge: "ORGANIZE",
  },
];

const platformCapabilities = [
  {
    icon: <TrendingUp className="w-10 h-10 text-blue-600 dark:text-blue-400"/>,
    title: "Personalized Learning Paths",
    description: "Tailor study journeys to individual needs and track improvement across multiple subjects.",
  },
  {
    icon: <FileText className="w-10 h-10 text-purple-600 dark:text-purple-400"/>,
    title: "Automated Content Processing",
    description: "Instantly process and transform PDFs, slides, and notes into actionable learning resources.",
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-green-600 dark:text-green-400"/>,
    title: "Insightful Performance Analytics",
    description: "Receive detailed reports and insights on study habits, strengths, and recommended actions.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-pink-500 dark:text-pink-400"/>,
    title: "Smart Flashcard Engine",
    description: "Leverage AI-powered spaced repetition and review features for optimal memory retention.",
  },
  {
    icon: <Users className="w-10 h-10 text-cyan-600 dark:text-cyan-400"/>,
    title: "Collaborative Tools",
    description: "Share resources and collaborate with peers to enhance group study sessions and knowledge sharing.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-yellow-500 dark:text-yellow-400"/>,
    title: "Secure & Accessible",
    description: "Your data is protected with modern security protocols and is accessible anywhere, anytime.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "MSc Computer Science",
    university: "Stanford University",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "Visual Study streamlined my revision process and helped me achieve consistent results. The AI-generated notes are incredibly precise.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Medical Student",
    university: "Harvard University",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "The analytics dashboard enabled me to focus on key weaknesses. My efficiency improved significantly.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Business Major",
    university: "MIT Sloan",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "Visual Study made complex materials manageable. The flashcard engine is a true productivity booster.",
    rating: 5,
  },
];

// ===== Animation variants =====
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const Landing = () => {
  useEffect(() => { injectGlobalStyles(); }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Testimonial carousel logic
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialCount = testimonials.length;
  const intervalRef = useRef();
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialCount);
    }, 8000);
    return () => clearInterval(intervalRef.current);
  }, [testimonialCount]);

  // Scroll to top
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen bg-blue-950 dark:bg-gray-900 overflow-x-hidden transition-colors duration-300">
      <div className="pro-mosaic-bg" aria-hidden="true"></div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-blue-950/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-blue-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3 select-none cursor-pointer group" onClick={scrollToTop}>
            <span className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg group-hover:scale-110 duration-150">
              <Zap className="text-white w-6 h-6 drop-shadow-xl" />
            </span>
            <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-blue-400 duration-150">VISUAL STUDY</span>
          </div>
          <nav className="hidden md:flex gap-8 text-base font-medium">
            <a href="#features" className="text-blue-200 dark:text-gray-300 hover:text-white duration-150">Features</a>
            <a href="#capabilities" className="text-blue-200 dark:text-gray-300 hover:text-white duration-150">Platform</a>
            <a href="#testimonials" className="text-blue-200 dark:text-gray-300 hover:text-white duration-150">Testimonials</a>
            <a href="#pricing" className="text-blue-200 dark:text-gray-300 hover:text-white duration-150">Pricing</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth/login"><Button variant="ghost" className="text-blue-100 dark:text-gray-300">Sign In</Button></Link>
            <Link to="/auth/register">
              <Button className="neon-btn bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold">Get Started Free</Button>
            </Link>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-900/20 dark:hover:bg-gray-700/20"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-blue-950/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-blue-800 dark:border-gray-700 px-4 py-4">
              <a href="#features" className="block text-blue-100 dark:text-gray-300 hover:text-white py-2">Features</a>
              <a href="#capabilities" className="block text-blue-100 dark:text-gray-300 hover:text-white py-2">Platform</a>
              <a href="#testimonials" className="block text-blue-100 dark:text-gray-300 hover:text-white py-2">Testimonials</a>
              <div className="flex items-center justify-between mt-3 mb-2">
                <span className="text-blue-100 dark:text-gray-300 text-sm">Theme</span>
                <ThemeToggle />
              </div>
              <Link to="/auth/login"><Button variant="ghost" className="w-full mt-3 text-blue-100 dark:text-gray-300">Sign In</Button></Link>
              <Link to="/auth/register"><Button className="neon-btn w-full mt-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white">Get Started Free</Button></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center py-24">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-400/30 dark:border-blue-500/30 text-blue-300 dark:text-blue-400 text-xs font-semibold shadow-xl">
              <Sparkles className="w-5 h-5 mr-2" /> Intelligent Academic Productivity Platform
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 leading-tight drop-shadow-xl">
              Transform the Way <br />You Learn and Succeed
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-blue-100/90 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Visual Study uses advanced artificial intelligence to streamline your study process. <br className="hidden md:inline" />
              Effortlessly generate structured notes, assessments, and insights—so you can focus on achieving your goals.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/auth/register" aria-label="Get started free">
                <Button size="lg" className="neon-btn px-10 py-4 text-lg shadow-2xl">Get Started Free <ArrowRight className="w-5 h-5 ml-2" /></Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-blue-300 dark:border-blue-600 text-white px-10 py-4 text-lg">Contact Sales</Button>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-10 flex justify-center" aria-hidden="true">
              <ChevronRight className="w-10 h-10 text-blue-200 dark:text-gray-400 rotate-90 animate-bounce" />
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-8 text-blue-200/90 dark:text-gray-400 select-none">
              <div className="flex items-center gap-2"><CheckCircle className="w-6 h-6 text-blue-400 dark:text-blue-500" /><span>No credit card required</span></div>
              <div className="flex items-center gap-2"><Users className="w-6 h-6 text-cyan-400 dark:text-cyan-500" /><span><CountUp end={50000} duration={2} separator="," />+ users</span></div>
              <div className="flex items-center gap-2"><Star className="w-6 h-6 text-yellow-400 dark:text-yellow-500" /><span>4.9/5 rating</span></div>
            </motion.div>
          </motion.div>
          {/* Hero Mockup */}
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 relative max-w-4xl mx-auto">
            <div className="bg-blue-950/80 dark:bg-gray-800/80 rounded-2xl border border-blue-200/10 dark:border-gray-600/20 p-8 shadow-2xl relative overflow-visible">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/60 dark:from-gray-700/60 to-cyan-900/60 dark:to-gray-600/60 rounded-lg p-12 min-h-[340px] flex flex-col items-center justify-center">
                <Brain className="w-20 h-20 text-blue-400 dark:text-blue-500 mb-5" />
                <h3 className="text-3xl font-bold text-white">Unified Study Dashboard</h3>
                <p className="text-blue-100 dark:text-gray-300 mt-3 max-w-xl text-center">Organize, analyze, and act on your learning data—all in one intelligent interface.</p>
              </div>
              {/* Floating icons */}
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -left-5 bg-blue-500/20 dark:bg-blue-600/20 backdrop-blur-md rounded-lg p-4 border border-blue-400/20 dark:border-blue-500/20 shadow-lg">
                <FileText className="w-7 h-7 text-blue-400 dark:text-blue-500" />
              </motion.div>
              <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-5 -right-5 bg-cyan-500/20 dark:bg-cyan-600/20 backdrop-blur-md rounded-lg p-4 border border-cyan-400/20 dark:border-cyan-500/20 shadow-lg">
                <Target className="w-7 h-7 text-cyan-400 dark:text-cyan-500" />
              </motion.div>
              <motion.div animate={{ y: [-5, 15, -5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-5 left-1/4 bg-green-500/20 dark:bg-green-600/20 backdrop-blur-md rounded-lg p-4 border border-green-400/20 dark:border-green-500/20 shadow-lg">
                <BarChart3 className="w-7 h-7 text-green-400 dark:text-green-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 dark:bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 dark:border-blue-600/30 text-blue-300 dark:text-blue-400 mb-6 select-none">
            <Sparkles className="w-5 h-5 mr-2" /> Key Features
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white dark:text-gray-100 mb-6 select-none">
            Built to Empower Every Learner
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-blue-100 dark:text-gray-300 max-w-3xl mx-auto select-none">
            Discover a robust suite of tools designed to enhance productivity, optimize retention, and deliver measurable academic results.
          </motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={scaleIn}
              className="group bg-blue-950/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-blue-200/10 dark:border-gray-600/20 hover:border-blue-400/70 dark:hover:border-blue-500/50 shadow-lg hover:shadow-blue-400/40 dark:hover:shadow-blue-500/20 h-full flex flex-col transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.06 }}>
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-600/20 dark:bg-blue-500/20 text-blue-200 dark:text-blue-300 text-xs font-semibold">{feature.badge}</span>
              </div>
              <h3 className="text-xl font-bold text-white dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-blue-100 dark:text-gray-300 flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PLATFORM CAPABILITIES */}
      <section id="capabilities" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 dark:bg-cyan-600/10 backdrop-blur-sm border border-cyan-500/20 dark:border-cyan-600/20 text-cyan-300 dark:text-cyan-400 mb-6 select-none">
            <BarChart3 className="w-5 h-5 mr-2" /> Platform Capabilities
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white dark:text-gray-100 mb-6 select-none">
            Seamless Integration. Advanced Outcomes.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-blue-100 dark:text-gray-300 max-w-3xl mx-auto select-none">
            Visual Study combines intelligent automation and advanced analytics to deliver a comprehensive learning solution for students and professionals.
          </motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {platformCapabilities.map((cap, idx) => (
            <motion.div key={idx} variants={scaleIn}
              className="flex flex-col items-center bg-blue-950/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-blue-200/10 dark:border-gray-600/20 hover:border-cyan-400/50 dark:hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-400/30 dark:hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="mb-5">{cap.icon}</div>
              <h3 className="text-xl font-bold text-white dark:text-gray-100 mb-2">{cap.title}</h3>
              <p className="text-blue-100 dark:text-gray-300 text-center">{cap.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white dark:text-gray-100 mb-6 select-none">
            Trusted by Learners Worldwide
          </motion.h2>
        </motion.div>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
              className="bg-blue-950/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-10 border border-blue-200/10 dark:border-gray-600/20 max-w-3xl mx-auto shadow-lg"
            >
              <Quote className="w-10 h-10 text-blue-400 dark:text-blue-500 mb-6" />
              <div className="flex mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 dark:text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-blue-100 dark:text-gray-300 mb-8 leading-relaxed italic select-none">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="flex items-center gap-5">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border border-blue-200/20 dark:border-gray-600/20"
                />
                <div>
                  <div className="font-semibold text-white dark:text-gray-100 text-lg select-none">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-blue-200 dark:text-gray-400 select-none">{testimonials[currentTestimonial].role}</div>
                  <div className="text-sm text-blue-400 dark:text-blue-500 select-none">{testimonials[currentTestimonial].university}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-4 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-4 h-4 rounded-full ${
                  index === currentTestimonial ? "bg-blue-500 dark:bg-blue-400" : "bg-blue-300/40 dark:bg-gray-600 hover:bg-blue-500/70 dark:hover:bg-blue-500"
                } transition-colors duration-300`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="bg-gradient-to-r from-blue-700/20 dark:from-blue-800/20 to-blue-400/20 dark:to-blue-600/20 backdrop-blur-xl rounded-3xl p-14 border border-blue-200/20 dark:border-gray-600/20 shadow-lg">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white dark:text-gray-100 mb-6 select-none">
            Ready to Accelerate Your Learning?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-blue-100 dark:text-gray-300 mb-10">
            Join <span className="font-bold text-blue-400 dark:text-blue-500">50,000+</span> users and experience the next generation of study tools.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="neon-btn px-10 py-4 text-lg shadow-2xl">Get Started Free <ArrowRight className="w-5 h-5 ml-2" /></Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-blue-300 dark:border-blue-600 text-white px-10 py-4 text-lg">Contact Sales</Button>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-sm text-blue-200 dark:text-gray-400 mt-8">No credit card required • Free forever plan available</motion.p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-blue-800 dark:border-gray-700 bg-blue-950/90 dark:bg-gray-900/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                  <Zap size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white dark:text-gray-100 select-none">VISUAL STUDY</span>
              </div>
              <p className="text-blue-200 dark:text-gray-400 mb-6 max-w-md select-none">
                Empower your academic journey with innovative, AI-powered tools engineered for real results.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white dark:text-gray-100 mb-4 select-none">Product</h3>
              <ul className="space-y-2 text-blue-200 dark:text-gray-400">
                <li><a href="#features" className="hover:text-white dark:hover:text-gray-200 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white dark:hover:text-gray-200 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white dark:text-gray-100 mb-4 select-none">Support</h3>
              <ul className="space-y-2 text-blue-200 dark:text-gray-400">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 dark:text-gray-400 text-sm select-none">© 2025 VISUAL STUDY. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-blue-200 dark:text-gray-400 text-sm select-none">🍪 We use cookies to enhance your experience</span>
              <button className="text-blue-400 dark:text-blue-500 hover:text-blue-300 dark:hover:text-blue-400 text-sm transition-colors">Accept</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      {showTopBtn && (
        <button
          aria-label="Back to top"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white p-3 rounded-full shadow-lg neon-btn"
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </button>
      )}
    </div>
  );
};

export default Landing;