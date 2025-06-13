import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap, Sun, Moon, ArrowRight, Brain, Target, Sparkles, BarChart3,
  Mic, Link2, Menu, X, Users, CheckCircle, Star, FileText, TrendingUp,
  Quote, ChevronRight, Shield, Globe, Rocket, Code, Database
} from "lucide-react";
import { FeaturesSectionWithHoverEffects } from "../components/ui/feature-section-with-hover-effects";

// Enhanced Button component with rounded styling
const Button = ({
  children, className = "", size = "md", variant = "solid", leftIcon, rightIcon, fullWidth, ...rest
}) => {
  const sizeMap = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  const variantMap = {
    solid: "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white font-bold hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 shadow-2xl hover:shadow-blue-500/25",
    outline: "border-2 border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold hover:bg-white/20 hover:border-white/50",
    ghost: "bg-transparent text-white/80 hover:text-white hover:bg-white/10",
    glow: "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold shadow-2xl hover:shadow-cyan-500/50 animate-pulse",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={[
        "rounded-full flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group",
        sizeMap[size], variantMap[variant], fullWidth ? "w-full" : "", className,
      ].join(" ")}
      {...rest}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      {leftIcon && <span className="relative z-10">{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {rightIcon && <span className="relative z-10">{rightIcon}</span>}
    </motion.button>
  );
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Enhanced testimonials
const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "PhD Candidate, MIT",
    university: "Massachusetts Institute of Technology",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "This AI completely revolutionized my research workflow. What used to take weeks now takes hours.",
    rating: 5,
    metric: "500% productivity increase",
  },
  {
    name: "Marcus Rodriguez",
    role: "Medical Student",
    university: "Harvard Medical School",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "The predictive analytics helped me identify weak areas before my MCAT. Scored in the 99th percentile.",
    rating: 5,
    metric: "99th percentile MCAT",
  },
  {
    name: "Emily Zhang",
    role: "Computer Science Major",
    university: "Stanford University",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "The quantum flashcards are insane. I memorized 2000+ algorithms in just 3 weeks.",
    rating: 5,
    metric: "2000+ algorithms mastered",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const Landing = () => {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Dynamic background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
        <FloatingParticles />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex h-20 items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="text-white w-7 h-7" />
              </motion.div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">VISUAL STUDY</span>
          </motion.div>

          <nav className="hidden md:flex gap-8 text-base font-medium">
            {["Features", "Platform", "Testimonials", "Pricing"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/70 hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="glow" size="sm">Get Started Free</Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-6"
            >
              <div className="space-y-4">
                {["Features", "Platform", "Testimonials", "Pricing"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="block text-white/70 hover:text-white py-2">
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <Link to="/auth/login">
                    <Button variant="ghost" fullWidth>Sign In</Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="glow" fullWidth>Get Started Free</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-xl">
                <Sparkles className="w-5 h-5 mr-3 text-cyan-400" />
                <span className="text-cyan-300 font-semibold text-sm">Next-Generation AI Learning Platform</span>
                <div className="ml-3 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300 leading-tight mb-6">
                The Future of
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Learning is Here
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={fadeInUp}>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Harness the power of quantum-enhanced AI to transform how you learn, study, and excel. 
                <br className="hidden md:inline" />
                <span className="text-cyan-300 font-medium">Experience 10x faster learning with 99.7% accuracy.</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link to="/auth/register">
                <Button size="xl" variant="glow" leftIcon={<Rocket size={24} />}>
                  Start Learning Now
                </Button>
              </Link>
              <Button size="xl" variant="outline" leftIcon={<ChevronRight size={24} />}>
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
              {[
                { value: 50000, label: "Active Learners", suffix: "+" },
                { value: 99.7, label: "AI Accuracy", suffix: "%" },
                { value: 10, label: "Faster Learning", suffix: "x" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    <CountUp end={stat.value} duration={2} separator="," />
                    {stat.suffix}
                  </div>
                  <div className="text-white/60 text-sm font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-500/20 blur-xl"
              animate={{
                y: [0, 15, 0],
                x: [0, -15, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl mb-6">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                <span className="text-purple-300 font-semibold text-sm">AI-Powered Features</span>
              </div>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6">
              Beyond Human
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                Capabilities
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience learning technology that adapts, predicts, and evolves with your unique cognitive patterns.
            </motion.p>
          </motion.div>

          {/* New Feature Section with Hover Effects */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <FeaturesSectionWithHoverEffects />
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6">
              Trusted by
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">
                Top Minds
              </span>
            </motion.h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
                  <div className="flex mb-8">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                      >
                        <Star className="w-8 h-8 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  
                  <Quote className="w-12 h-12 text-cyan-400 mb-6" />
                  <p className="text-2xl text-white mb-8 leading-relaxed font-light italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <motion.img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-cyan-400/50"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <div className="font-bold text-white text-xl">{testimonials[currentTestimonial].name}</div>
                      <div className="text-cyan-400 font-medium">{testimonials[currentTestimonial].role}</div>
                      <div className="text-white/60 text-sm">{testimonials[currentTestimonial].university}</div>
                      <div className="text-green-400 text-sm font-bold mt-1">{testimonials[currentTestimonial].metric}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-4 mt-12">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 scale-125" 
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-2xl overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1), rgba(147,51,234,0.1))",
                      "linear-gradient(45deg, rgba(147,51,234,0.1), rgba(6,182,212,0.1), rgba(59,130,246,0.1))",
                      "linear-gradient(45deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1), rgba(6,182,212,0.1))",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="relative z-10">
                <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-black text-white mb-6">
                  Ready to
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                    Transcend Learning?
                  </span>
                </motion.h2>
                
                <motion.p variants={fadeInUp} className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                  Join <span className="font-bold text-cyan-400">50,000+</span> learners who've already unlocked their potential with AI-powered education.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/auth/register">
                    <Button size="xl" variant="glow" leftIcon={<Rocket size={24} />}>
                      Start Your Journey
                    </Button>
                  </Link>
                  <Button size="xl" variant="outline" leftIcon={<ChevronRight size={24} />}>
                    Watch Demo
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <span>Available worldwide</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Modern Footer */}
      <footer className="relative border-t border-white/10 bg-gradient-to-br from-black via-slate-900 to-black backdrop-blur-xl overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
            animate={{
              background: [
                "linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6)",
                "linear-gradient(90deg, #8b5cf6, #22d3ee, #3b82f6)",
                "linear-gradient(90deg, #3b82f6, #8b5cf6, #22d3ee)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-pink-500/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Zap size={24} className="text-white" />
                </motion.div>
                <span className="text-2xl font-black text-white">VISUAL STUDY</span>
              </div>
              <p className="text-white/70 mb-8 max-w-md leading-relaxed">
                Pioneering the future of education with quantum-enhanced AI technology that adapts to your unique learning style and accelerates your academic success.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Code size={20} />, label: "API", color: "from-green-400 to-emerald-500" },
                  { icon: <Database size={20} />, label: "Integrations", color: "from-blue-400 to-cyan-500" },
                  { icon: <Shield size={20} />, label: "Security", color: "from-purple-400 to-pink-500" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white cursor-pointer shadow-lg`}
                    whileHover={{ scale: 1.1, y: -2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API", "Integrations", "Security"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press", "Partners"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Status", "Privacy", "Terms"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-white mb-6 text-lg relative">
                  {section.title}
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href="#"
                        className="text-white/60 hover:text-white transition-all duration-300 relative group"
                        whileHover={{ x: 4 }}
                      >
                        {link}
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">© 2025 VISUAL STUDY. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">All systems operational</span>
              </motion.div>
              <span className="text-white/60 text-sm">🚀 Powered by Quantum AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;