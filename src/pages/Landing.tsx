import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap, Sun, Moon, Play, ArrowRight, Brain, Target, Sparkles,
  BarChart3, Mic, Link2, Menu, X, Users, CheckCircle, Star,
  FileText, TrendingUp, Upload, Quote, ChevronRight,
} from "lucide-react";

// ========== BUTTON COMPONENT (Minimal, edit as needed) ========== //
const Button = ({
  children,
  className = "",
  size = "md",
  variant = "solid",
  leftIcon,
  rightIcon,
  fullWidth,
  ...rest
}) => {
  const sizeMap = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-4 text-lg",
  };
  const variantMap = {
    solid:
      "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-700 hover:to-blue-700 shadow-lg",
    outline:
      "border-2 border-white/30 bg-transparent text-white font-semibold hover:bg-white/10",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };
  return (
    <button
      className={[
        "rounded-xl flex items-center justify-center gap-2 transition-all duration-200",
        sizeMap[size],
        variantMap[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {leftIcon && <span className="mr-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1">{rightIcon}</span>}
    </button>
  );
};

// ========== GLOBAL STYLES (Glass, neon, grid, etc.) ========== //
const injectGlobalStyles = () => {
  if (document.getElementById("landing-global-styles")) return;
  const style = document.createElement("style");
  style.id = "landing-global-styles";
  style.textContent = `
    :root {
      --primary-gradient: linear-gradient(90deg,#8b5cf6 0%,#6366f1 60%,#38bdf8 100%);
      --secondary-gradient: linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%);
      --accent-gradient: linear-gradient(135deg,#fbbf24 0%,#a7f3d0 100%);
      --card-shadow: 0 8px 40px 0 rgba(139,92,246,0.20);
      --glass-blur: blur(18px);
      --neon-glow: 0 0 24px 2px #a21caf99;
    }
    .neon-btn {
      box-shadow: 0 0 10px #a21caf77, 0 0 30px #a21caf44;
      animation: neon-flicker 2.5s infinite alternate;
    }
    @keyframes neon-flicker {
      0%,100% { filter: brightness(1.05);}
      48% { filter: brightness(1.15);}
      50% { filter: brightness(1.45);}
      52% { filter: brightness(1.1);}
    }
    .section-grid-overlay {
      background-image: linear-gradient(90deg,rgba(139,92,246,0.07) 1px,transparent 1px),
                        linear-gradient(180deg,rgba(139,92,246,0.07) 1px,transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: 2rem;
      opacity: 0.7;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%,100% { transform: translateY(0);}
      50% { transform: translateY(-14px);}
    }
  `;
  document.head.appendChild(style);
};

// ========== DATA (Features, Steps, Testimonials) ========== //
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
  },
  {
    step: "02",
    title: "AI Processes Everything",
    description: "Our AI analyzes content and generates summaries, quizzes, and flashcards.",
    icon: <Brain className="w-12 h-12" />,
  },
  {
    step: "03",
    title: "Study Smarter",
    description: "Access personalized study tools and track your progress in real-time.",
    icon: <TrendingUp className="w-12 h-12" />,
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

// ========== ANIMATION VARIANTS ========== //
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
    transition: { staggerChildren: 0.2 },
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

// ========== LANDING COMPONENT ========== //
const Landing = () => {
  useEffect(() => {
    injectGlobalStyles();
  }, []);

  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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

  // Scroll to top button logic
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={`${isDark ? "dark" : ""} relative min-h-screen bg-black/95 overflow-x-hidden`}>
      {/* --- Animated Grid Overlay --- */}
      <div className="fixed inset-0 -z-20 pointer-events-none select-none">
        <div className="section-grid-overlay" />
        <motion.div
          animate={{ opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[56vw] h-[56vw] rounded-full bg-gradient-to-br from-purple-700/30 via-indigo-500/20 to-pink-400/20 blur-3xl pointer-events-none"
        />
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3 select-none cursor-pointer group" onClick={scrollToTop}>
            <span className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg group-hover:scale-110 duration-150">
              <Zap className="text-white w-6 h-6 drop-shadow-xl" />
            </span>
            <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-purple-400 duration-150">VISUAL STUDY</span>
          </div>
          <nav className="hidden md:flex gap-8 text-base font-semibold">
            <a href="#features" className="text-gray-400 hover:text-white duration-150">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white duration-150">How It Works</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white duration-150">Testimonials</a>
            <a href="#pricing" className="text-gray-400 hover:text-white duration-150">Pricing</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={()=>setIsDark(!isDark)} aria-label="Dark mode" className="p-2 rounded-lg hover:bg-white/10">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-300" />}
            </button>
            <Link to="/auth/login">
              <Button variant="ghost" className="text-gray-200">Sign In</Button>
            </Link>
            <Link to="/auth/register">
              <Button className="neon-btn bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
                Get Started Free
              </Button>
            </Link>
          </div>
          {/* Hamburger for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
              className="md:hidden bg-black/60 backdrop-blur-xl border-t border-white/10 px-4 py-4">
              <a href="#features" className="block text-gray-300 hover:text-white py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white py-2">How It Works</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white py-2">Testimonials</a>
              <Link to="/auth/login"><Button variant="ghost" className="w-full mt-3 text-gray-200">Sign In</Button></Link>
              <Link to="/auth/register"><Button className="neon-btn w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">Get Started Free</Button></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center py-24">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400/90 border border-green-400/60 text-white text-xs font-bold shadow-xl animate-pulse"> <Sparkles className="w-5 h-5 mr-2" /> The only AI study assistant you’ll ever need</motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 leading-tight drop-shadow-xl">Study <span className="animate-pulse">Smarter</span>, Not Harder <br/>with AI</motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">AI turns your course files into <span className="text-white font-bold">flashcards, quizzes, and killer summaries</span>. It’s all automatic. <br className="hidden md:inline" />Welcome to next-gen learning.</motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/auth/register" aria-label="Get started free">
                <Button size="lg" className="neon-btn px-10 py-4 text-lg shadow-2xl">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white px-10 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" /> Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
        {/* Floating Dashboard Mockup */}
        <motion.div
          initial={{opacity:0,scale:0.9,y:100}}
          animate={{opacity:1,scale:1,y:0}}
          transition={{delay:0.5, duration:1}}
          className="relative max-w-3xl mx-auto mt-14"
        >
          <div className="bg-black/60 border border-white/10 rounded-3xl shadow-2xl p-8 flex flex-col items-center relative">
            <Brain className="w-20 h-20 text-purple-400 mb-4 animate-float" />
            <h3 className="text-3xl font-bold text-white">AI Study Dashboard</h3>
            <p className="text-gray-400 mt-3 mb-2">Everything in one spot: Summaries. Quizzes. Flashcards. Your data, your flow.</p>
            <div className="absolute -top-6 -left-6"><FileText className="w-8 h-8 text-blue-400 animate-float" /></div>
            <div className="absolute -top-6 -right-6"><Target className="w-8 h-8 text-green-400 animate-float" /></div>
            <div className="absolute -bottom-8 left-1/4"><BarChart3 className="w-8 h-8 text-yellow-300 animate-float" /></div>
          </div>
        </motion.div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none z-0 section-grid-overlay" />
        <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={staggerContainer} className="text-center mb-20 z-10 relative">
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 mb-6 select-none">
            <Sparkles className="w-5 h-5 mr-2" /> Features
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6 select-none">
            Built for Gen Z Brains.<br/>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Ridiculously Powerful. Stupidly Simple.</span>
          </motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 z-10 relative">
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={scaleIn}
              className="group bg-black/40 rounded-2xl p-8 border border-white/10 hover:border-purple-400/70 shadow-lg hover:shadow-purple-400/40 h-full flex flex-col transition-all duration-300 cursor-pointer"
              whileHover={{ scale:1.06 }}>
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>{feature.icon}</div>
                <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 text-xs font-semibold">{feature.badge}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 mb-6 select-none">
            <Users className="w-5 h-5 mr-2" />
            How it Works
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6 select-none">
            Getting Started with
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our AI Study Assistant
            </span>
          </motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <motion.div key={index} variants={scaleIn} className="text-center relative cursor-default">
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold mb-6 shadow-lg select-none">
                {step.step}
              </div>
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

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6 select-none">
            What Students Say
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

      {/* --- FINAL CTA --- */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={staggerContainer}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-14 border border-white/20 shadow-lg">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6 select-none">
            Ready to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">level up?</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-10">Join <span className="font-bold text-purple-400">50,000+</span> students already crushing their exams with Visual Study.</motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth/register"><Button size="lg" className="neon-btn px-10 py-4 text-lg shadow-2xl">Get Started Free <ArrowRight className="w-5 h-5 ml-2" /></Button></Link>
            <Button size="lg" variant="outline" className="border-2 border-white/30 text-white px-10 py-4 text-lg">Schedule Demo</Button>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-sm text-gray-400 mt-8">No credit card. Free forever.</motion.p>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
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
                  <a href="#features" className="hover:text-white transition-colors">Features</a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">API</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Integrations</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4 select-none">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Help Center</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
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

      {/* --- BACK TO TOP BUTTON --- */}
      {showTopBtn && (
        <button
          aria-label="Back to top"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-full shadow-lg neon-btn"
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </button>
      )}
    </div>
  );
};

export default Landing;
