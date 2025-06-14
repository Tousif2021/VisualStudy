import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap, Sparkles, Brain, Star, Quote, ChevronRight, Shield, Globe, Rocket, CheckCircle, Menu, X
} from "lucide-react";
import { FeaturesSectionWithHoverEffects } from "../components/ui/feature-section-with-hover-effects";
import { Footerdemo } from "../components/ui/footer-section";
import { TiltedScroll } from "../components/ui/tilted-scroll";
import { TestimonialsSection } from "../components/ui/testimonials-with-marquee";

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

// Updated testimonials data with real Unsplash images
const testimonials = [
  {
    author: {
      name: "Dr. Sarah Chen",
      handle: "@sarahchen_phd",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "This AI platform has completely revolutionized my research workflow. What used to take weeks of analysis now takes just hours. The accuracy and insights are unprecedented.",
    href: "https://twitter.com/sarahchen_phd"
  },
  {
    author: {
      name: "Marcus Rodriguez",
      handle: "@marcustech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The API integration is absolutely flawless. We've reduced our development time by 60% since implementing this solution. Game-changing technology.",
    href: "https://twitter.com/marcustech"
  },
  {
    author: {
      name: "Emily Zhang",
      handle: "@emilyml",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive. This is the future of learning.",
  },
  {
    author: {
      name: "David Park",
      handle: "@davidpark_ai",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "The predictive analytics helped me identify weak areas before my exams. Scored in the 99th percentile thanks to this platform's personalized recommendations.",
  },
  {
    author: {
      name: "Lisa Thompson",
      handle: "@lisalearns",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "The quantum flashcards feature is incredible. I memorized 2000+ algorithms in just 3 weeks. This platform adapts to how I learn best.",
  },
  {
    author: {
      name: "Alex Kumar",
      handle: "@alexkumar_dev",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a medical student, this AI has been invaluable. The way it breaks down complex concepts and creates personalized study plans is remarkable.",
  }
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

      {/* Header / NAVBAR */}
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
            {["Features", "Platform", "Testimonials"].map((item) => (
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
              <Button variant="ghost" size="sm"className="border border-white/60">Sign In</Button>
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
        <div className="max-w-6xl mx-auto">
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

      {/* AI By Your Side Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="mb-16">
              <div className="
                inline-flex items-center px-6 py-3 rounded-full
                bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20
                border border-emerald-500/40
                backdrop-blur-xl mb-8
                shadow-[0_0_24px_8px_rgba(16,185,129,0.6)]
                animate-pulse
              ">
                <Sparkles className="w-5 h-5 mr-3 text-emerald-400" />
                <span className="text-emerald-300 font-semibold text-sm">
                  AI Will Be By Your Side Every Second
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
                Your Personal
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                  AI Companion
                </span>
              </h2>
              
              <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
                Advanced AI technologies working seamlessly together to revolutionize your learning experience.
              </p>
            </motion.div>

            {/* TiltedScroll Component */}
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center mb-32"
            >
              <TiltedScroll className="scale-110" />
            </motion.div>

            {/* Bottom Description */}
            <motion.div variants={fadeInUp} className="mt-16">
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                From intelligent note-taking to adaptive scheduling, our AI ecosystem learns your patterns and optimizes your study journey in real-time.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Testimonials Section with Marquee */}
      <section id="testimonials" className="relative py-32 px-4">
        <TestimonialsSection
          title="Trusted by Top Minds"
          description="Join thousands of students, researchers, and professionals who've transformed their learning with our AI platform."
          testimonials={testimonials}
        />
      </section>

      {/* Final CTA Section - NO CARD BACKGROUND */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
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