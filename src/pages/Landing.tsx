import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap, Sparkles, Brain, Star, Quote, ChevronRight, Shield, Globe, Rocket, CheckCircle
} from "lucide-react";
import { FeaturesSectionWithHoverEffects } from "../components/ui/feature-section-with-hover-effects";
import { Footerdemo } from "../components/ui/footer-section";

// Enhanced Button component with rounded styling
const Button = ({
  children, className = "", size = "md", variant = "solid", leftIcon, rightIcon, fullWidth, ...rest
}) => {
  const sizeMap = {
    sm: "px-3 py-2.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2 text-base",
    xl: "px-5 py-3 text-lg",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

      {/* Header (same as yours, not repeated here for brevity) */}
      {/* ...Header code remains unchanged... */}

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
              <div className="
                inline-flex items-center px-6 py-3 rounded-full
                bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20
                border border-cyan-500/30 backdrop-blur-xl
                shadow-[0_0_12px_4px_rgba(34,211,238,0.6)]
                animate-pulse
              ">
                <Sparkles className="w-5 h-5 mr-3 text-cyan-400" />
                <span className="text-cyan-300 font-semibold text-sm">
                  Next-Generation AI Learning Platform
                </span>
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
            {/* Glowing Badge */}
            <motion.div variants={fadeInUp} className="mt-12">
              <div
                className="
                  inline-flex items-center px-4 py-2 rounded-full
                  bg-gradient-to-r from-purple-500/20 to-pink-500/20
                  border border-purple-500/40
                  backdrop-blur-xl mb-6
                  shadow-[0_0_24px_8px_rgba(192,132,252,0.7)]
                  animate-pulse
                "
              >
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                <span className="text-purple-300 font-semibold text-sm">
                  AI-Powered Features
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6">
              Beyond Human
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                Capabilities
              </span>
            </motion.h2>

            {/* Subtitle Paragraph */}
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
      {/* ...Testimonials Section code remains unchanged... */}

      {/* Final CTA Section (CARD/BG REMOVED, ONLY CONTENT LEFT) */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* No card, glass, or background here, just content */}
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
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <Footerdemo />
    </div>
  );
};

export default Landing;
