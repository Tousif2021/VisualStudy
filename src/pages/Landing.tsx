import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
  BookOpen,
  FileText,
  MessageCircle,
  Calendar,
  CheckCircle,
  Lightbulb,
  Mic,
  Link2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../components/ui/Button";

// Mock data for features
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

// How it works steps
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

// Testimonials
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
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const mosaicY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Floating elements animation
  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className={`${isDark ? "dark" : ""} relative overflow-hidden`}>
      {/* Enhanced Background with Mosaic/Chess Pattern and Enhanced Glowing Effects */}
      <div className="fixed inset-0 bg-[#0A0A0F] dark:bg-gray-950">
        {/* Primary Mosaic/Chess Board Pattern - Crisp and Clear */}
        <motion.div 
          style={{ y: mosaicY }}
          className="absolute inset-0 opacity-[0.12]"
        >
          <div 
            className="w-full h-[120%] bg-repeat"
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(139,92,246,0.2) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(139,92,246,0.2) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(59,130,246,0.2) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(59,130,246,0.2) 75%)
              `,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
            }}
          />
        </motion.div>

        {/* Secondary Fine Grid Pattern - Sharper */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* ENHANCED GLOWING EDGE EFFECTS */}
        
        {/* Top Edge - Multiple Layers for Intense Glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[8px] bg-gradient-to-r from-transparent via-purple-300/20 to-transparent"></div>
        
        {/* Bottom Edge - Enhanced Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"></div>
        
        {/* Left Edge - Enhanced Glow */}
        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-purple-500/80 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-b from-transparent via-purple-400/40 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-[8px] bg-gradient-to-b from-transparent via-purple-300/20 to-transparent"></div>
        
        {/* Right Edge - Enhanced Glow */}
        <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-blue-500/80 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-[4px] bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-[8px] bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"></div>

        {/* Enhanced Corner Glow Effects - Much More Prominent */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-400/30 to-transparent rounded-full"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/30 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-purple-400/30 to-transparent rounded-full"></div>

        {/* Additional Corner Accent Lines */}
        <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
        <div className="absolute top-0 left-0 h-24 w-[2px] bg-gradient-to-b from-purple-500 to-transparent"></div>
        <div className="absolute top-0 right-0 w-24 h-[2px] bg-gradient-to-l from-blue-500 to-transparent"></div>
        <div className="absolute top-0 right-0 h-24 w-[2px] bg-gradient-to-b from-blue-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-24 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-24 w-[2px] bg-gradient-to-t from-indigo-500 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-24 h-[2px] bg-gradient-to-l from-purple-500 to-transparent"></div>
        <div className="absolute bottom-0 right-0 h-24 w-[2px] bg-gradient-to-t from-purple-500 to-transparent"></div>

        {/* Animated Mosaic Tiles with Enhanced Glow - NO BLUR */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 opacity-[0.08]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(45deg, 
                  ${i % 4 === 0 ? 'rgba(139,92,246,0.3)' : 
                    i % 4 === 1 ? 'rgba(59,130,246,0.3)' : 
                    i % 4 === 2 ? 'rgba(147,51,234,0.3)' : 'rgba(99,102,241,0.3)'} 50%, 
                  transparent 50%
                )`,
                backgroundSize: '12px 12px',
                boxShadow: `
                  0 0 30px ${i % 4 === 0 ? 'rgba(139,92,246,0.2)' : 
                    i % 4 === 1 ? 'rgba(59,130,246,0.2)' : 
                    i % 4 === 2 ? 'rgba(147,51,234,0.2)' : 'rgba(99,102,241,0.2)'},
                  0 0 60px ${i % 4 === 0 ? 'rgba(139,92,246,0.1)' : 
                    i % 4 === 1 ? 'rgba(59,130,246,0.1)' : 
                    i % 4 === 2 ? 'rgba(147,51,234,0.1)' : 'rgba(99,102,241,0.1)'}
                `
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
                opacity: [0.08, 0.16, 0.08]
              }}
              transition={{
                duration: 25 + i * 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.8
              }}
            />
          ))}
        </div>

        {/* Floating Geometric Shapes with Enhanced Glow - NO BLUR */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`geo-${i}`}
              className="absolute"
              style={{
                left: `${8 + (i * 8)}%`,
                top: `${15 + (i * 6)}%`,
              }}
              animate={{
                y: [-25, 25, -25],
                rotate: [0, 180, 360],
                opacity: [0.04, 0.12, 0.04]
              }}
              transition={{
                duration: 18 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2
              }}
            >
              <div 
                className={`w-20 h-20 ${i % 3 === 0 ? 'rotate-45' : i % 3 === 1 ? 'rotate-12' : '-rotate-12'}`}
                style={{
                  background: i % 4 === 0 
                    ? 'linear-gradient(45deg, rgba(139,92,246,0.12) 50%, transparent 50%)'
                    : i % 4 === 1 
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.12) 50%, transparent 50%)'
                    : i % 4 === 2
                    ? 'linear-gradient(90deg, rgba(147,51,234,0.12) 50%, transparent 50%)'
                    : 'linear-gradient(180deg, rgba(99,102,241,0.12) 50%, transparent 50%)',
                  backgroundSize: '10px 10px',
                  boxShadow: `
                    0 0 25px ${i % 4 === 0 ? 'rgba(139,92,246,0.08)' : 
                      i % 4 === 1 ? 'rgba(59,130,246,0.08)' : 
                      i % 4 === 2 ? 'rgba(147,51,234,0.08)' : 'rgba(99,102,241,0.08)'},
                    0 0 50px ${i % 4 === 0 ? 'rgba(139,92,246,0.04)' : 
                      i % 4 === 1 ? 'rgba(59,130,246,0.04)' : 
                      i % 4 === 2 ? 'rgba(147,51,234,0.04)' : 'rgba(99,102,241,0.04)'}
                  `
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Subtle Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      </div>

      {/* Floating Background Elements */}
      <motion.div
        style={{ y }}
        className="fixed inset-0 pointer-events-none"
      >
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full"
          style={{
            filter: 'blur(40px)'
          }}
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full"
          style={{
            filter: 'blur(40px)'
          }}
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 4 } }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full"
          style={{
            filter: 'blur(40px)'
          }}
        />
      </motion.div>

      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Zap size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">VISUAL STUDY</span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-300" />}
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
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <div className="pt-4 space-y-3">
                <Link to="/auth/login" className="block">
                  <Button variant="ghost" fullWidth className="text-gray-300">Sign In</Button>
                </Link>
                <Link to="/auth/register" className="block">
                  <Button fullWidth className="bg-gradient-to-r from-purple-600 to-blue-600">Get Started Free</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-purple-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Your AI Study Assistant
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Simplify Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Studying
              </span>
              <br />
              with AI-Powered Precision
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Effortlessly transform your study materials into summaries, quizzes, and flashcards
              <br className="hidden md:block" />
              with our intelligent learning assistant
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
                leftIcon={<Play className="w-5 h-5" />}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-5 h-5 text-blue-400" />
                <span><CountUp end={50000} duration={2} separator="," />+ students</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Main Dashboard Mockup */}
              <div className="bg-black/40 rounded-2xl border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Brain className="w-16 h-16 text-purple-400 mx-auto" />
                    <h3 className="text-2xl font-bold text-white">AI Study Dashboard</h3>
                    <p className="text-gray-300">Your personalized learning command center</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 bg-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
              >
                <FileText className="w-6 h-6 text-purple-400" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30"
              >
                <Target className="w-6 h-6 text-blue-400" />
              </motion.div>
              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-4 left-1/4 bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-500/30"
              >
                <BarChart3 className="w-6 h-6 text-green-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Features
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6">
              Powerful Features to
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Simplify Your Studying
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group relative"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 mb-6">
              <Users className="w-4 h-4 mr-2" />
              How it Works
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6">
              Getting Started with
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our AI Study Assistant
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
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
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center relative"
              >
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold mb-6 shadow-lg">
                  {step.step}
                </div>

                {/* Mockup */}
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6 min-h-[200px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto">
                      {step.icon}
                    </div>
                    <div className="text-gray-400 text-sm">Step {step.step}</div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 transform -translate-y-1/2 z-10"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6">
              What Students Say
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Thousands are already getting better results. Here's what they have to say:
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
                variants={scaleIn}
                className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative"
              >
                <Quote className="w-8 h-8 text-purple-400 mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-purple-400">{testimonial.university}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Your Studying?
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8">
              Join <span className="font-bold text-purple-400">50,000+</span> students who are already studying smarter with AI
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                Schedule Demo
              </Button>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-sm text-gray-400 mt-6">
              No credit card required • Free forever plan available
            </motion.p>
          </motion.div>
        </div>
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
                <span className="text-2xl font-bold text-white">VISUAL STUDY</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your study experience with AI-powered learning tools designed for the modern student.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 VISUAL STUDY. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">🍪 We use cookies to enhance your experience</span>
              <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
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