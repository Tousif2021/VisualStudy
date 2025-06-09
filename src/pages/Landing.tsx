import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
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
  Globe,
  Shield,
  Zap as Lightning,
  Cpu,
  Database,
  Rocket,
  Eye,
  Heart,
  Code,
  MousePointer,
  Layers,
  Clock,
} from "lucide-react";

// Enhanced Button Component
const Button = ({ children, variant = "primary", size = "md", className = "", leftIcon, rightIcon, onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/40",
    outline: "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/50",
    ghost: "text-white hover:bg-white/10"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

// Interactive Particle System
const ParticleSystem = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
          }}
          animate={{
            y: [particle.y, particle.y - 100, particle.y],
            x: [particle.x - 20, particle.x + 20, particle.x - 20],
          }}
          transition={{
            duration: particle.speed * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Interactive 3D Card Component
const InteractiveCard = ({ children, className = "" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`transform-gpu ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Features Data
const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Neural AI Summaries",
    description: "Advanced GPT-4 powered summarization that understands context, extracts key concepts, and creates comprehensive study notes instantly.",
    color: "from-blue-500 to-cyan-500",
    badge: "AI-POWERED",
    stats: "99.7% accuracy",
    demoIcon: <FileText className="w-6 h-6 text-blue-400" />
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Adaptive Learning Engine",
    description: "Machine learning algorithms that analyze your performance patterns and create personalized quizzes targeting your weak areas.",
    color: "from-purple-500 to-pink-500",
    badge: "ADAPTIVE",
    stats: "3x faster learning",
    demoIcon: <Target className="w-6 h-6 text-purple-400" />
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Smart Memory Cards",
    description: "Intelligent flashcards with spaced repetition algorithms, visual memory enhancement, and multi-modal learning support.",
    color: "from-green-500 to-emerald-500",
    badge: "MEMORY+",
    stats: "95% retention rate",
    demoIcon: <Layers className="w-6 h-6 text-green-400" />
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Advanced Analytics",
    description: "Real-time learning analytics with predictive modeling, performance forecasting, and detailed progress visualization.",
    color: "from-orange-500 to-red-500",
    badge: "INSIGHTS",
    stats: "Real-time tracking",
    demoIcon: <TrendingUp className="w-6 h-6 text-orange-400" />
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: "AI Speech Coach",
    description: "Advanced speech recognition with tone analysis, presentation coaching, and real-time feedback on delivery and confidence.",
    color: "from-indigo-500 to-purple-500",
    badge: "VOICE AI",
    stats: "Voice recognition",
    demoIcon: <Mic className="w-6 h-6 text-indigo-400" />
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Universal Sync",
    description: "Cross-platform synchronization with cloud storage, offline access, collaborative features, and multi-device support.",
    color: "from-teal-500 to-blue-500",
    badge: "CLOUD SYNC",
    stats: "99.9% uptime",
    demoIcon: <Database className="w-6 h-6 text-teal-400" />
  },
];

// Enhanced Steps
const steps = [
  {
    step: "01",
    title: "Smart Upload & Analysis",
    description: "Upload any format - PDFs, images, audio, video. Our AI instantly processes and extracts key information using advanced OCR and NLP.",
    icon: <Upload className="w-12 h-12" />,
    gradient: "from-purple-500 to-blue-500",
    features: ["Multi-format support", "OCR technology", "Smart extraction"]
  },
  {
    step: "02", 
    title: "AI-Powered Processing",
    description: "Our neural networks analyze content structure, identify key concepts, generate summaries, and create personalized learning materials.",
    icon: <Cpu className="w-12 h-12" />,
    gradient: "from-blue-500 to-cyan-500",
    features: ["Neural processing", "Concept mapping", "Auto-generation"]
  },
  {
    step: "03",
    title: "Personalized Learning",
    description: "Access your customized study dashboard with adaptive quizzes, progress tracking, and AI-recommended study paths.",
    icon: <Rocket className="w-12 h-12" />,
    gradient: "from-cyan-500 to-green-500",
    features: ["Adaptive learning", "Progress tracking", "Smart recommendations"]
  },
];

// Enhanced Testimonials
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    university: "Stanford University", 
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "VISUAL STUDY transformed my entire approach to learning. The AI summaries are incredibly accurate, and I improved my GPA from 3.2 to 3.8 in just one semester. It's like having a personal tutor available 24/7.",
    rating: 5,
    improvement: "+0.6 GPA",
    timeUsed: "6 months"
  },
  {
    name: "Marcus Johnson",
    role: "Pre-Med Student", 
    university: "Harvard University",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    quote: "The adaptive quizzes are game-changing. They identified exactly what I was struggling with and helped me focus my study time. Saved me over 20 hours per week while improving my test scores significantly.",
    rating: 5,
    improvement: "20+ hrs saved/week",
    timeUsed: "1 year"
  },
  {
    name: "Emily Rodriguez",
    role: "Business Analytics Major",
    university: "MIT Sloan",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", 
    quote: "The AI understands exactly how I learn best. The personalized recommendations and visual memory cards helped me ace my statistics course. This is the future of education technology.",
    rating: 5,
    improvement: "A+ in Statistics",
    timeUsed: "8 months"
  },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const AIStudyLanding = () => {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Auto-rotate feature showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced floating animations
  const floatingAnimation = {
    y: [-20, 20, -20],
    rotate: [-5, 5, -5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className={`${isDark ? "dark" : ""} relative overflow-hidden`}>
      {/* Advanced Background System */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        
        {/* Dynamic grid with glow effect */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(139,92,246,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(59,130,246,0.3) 0%, transparent 50%),
              linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '400px 400px, 400px 400px, 50px 50px, 50px 50px'
          }}
        />
        
        {/* Animated orbs with improved glow */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [-50, 50, -50],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Particle System */}
      <ParticleSystem />

      {/* Enhanced Header */}
      <header className="relative z-50 bg-black/10 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Enhanced Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <motion.div 
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                <Zap size={26} className="text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                VISUAL STUDY
              </span>
            </motion.div>

            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {["Features", "How It Works", "Testimonials", "Pricing"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
            </nav>

            {/* Enhanced Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                    >
                      <Sun className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                    >
                      <Moon className="w-5 h-5 text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <Button variant="ghost">Sign In</Button>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started Free
              </Button>
            </div>

            {/* Mobile Menu */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/40 backdrop-blur-2xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {["Features", "How It Works", "Testimonials", "Pricing"].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="block text-gray-300 hover:text-white transition-colors py-2"
                    whileHover={{ x: 10 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="pt-4 space-y-3">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                  <Button className="w-full">Get Started Free</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div style={{ y, opacity, scale }} className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-12"
          >
            {/* Enhanced Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-6 py-3 rounded-full 
                bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 
                border border-purple-400/50 
                text-white 
                shadow-2xl shadow-purple-500/25
                backdrop-blur-xl
                relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Sparkles className="w-5 h-5 mr-3 text-purple-300 relative z-10" />
              <span className="font-semibold relative z-10">✨ Powered by Advanced AI • 50,000+ Students</span>
            </motion.div>

            {/* Revolutionary Heading */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h1 className="text-5xl md:text-8xl font-black text-white leading-tight">
                Study{" "}
                <motion.span
                  className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-300% animate-gradient"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Smarter
                </motion.span>
                <br />
                with{" "}
                <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    AI Precision
                  </span>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-xl"
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
              </h1>
              
              <motion.p 
                variants={fadeInUp} 
                className="text-xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-light"
              >
                Transform any study material into{" "}
                <span className="text-purple-300 font-semibold">intelligent summaries</span>,{" "}
                <span className="text-blue-300 font-semibold">adaptive quizzes</span>, and{" "}
                <span className="text-cyan-300 font-semibold">smart flashcards</span>
                <br className="hidden md:block" />
                in seconds with our revolutionary AI learning assistant
              </motion.p>
            </motion.div>

            {/* Enhanced CTA Section */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white px-10 py-5 text-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 bg-200% animate-gradient border-2 border-white/20"
                  rightIcon={<ArrowRight className="w-6 h-6" />}
                >
                  Start Learning Free
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/10 px-10 py-5 text-xl backdrop-blur-xl shadow-xl"
                  leftIcon={<Play className="w-6 h-6" />}
                  onClick={() => setIsVideoPlaying(true)}
                >
                  Watch AI Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 max-w-4xl mx-auto">
              {[
                { icon: CheckCircle, text: "No Credit Card Required", color: "text-green-400" },
                { icon: Users, text: "50,000+ Active Students", color: "text-blue-400" },
                { icon: Star, text: "4.9/5 Average Rating", color: "text-yellow-400" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center gap-3 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ scale: 1.1 }}
                >
                  <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Revolutionary Hero Demo */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-6xl">
              {/* Main Dashboard with Glass Effect */}
              <InteractiveCard className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">AI Study Dashboard</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* AI Summary Panel */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-6 h-6 text-blue-400" />
                      <span className="text-white font-semibold">AI Summary</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-blue-400/30 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-400"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ delay: 1.5, duration: 2 }}
                        />
                      </div>
                      <p className="text-gray-300 text-sm">Processing quantum physics concepts...</p>
                    </div>
                  </div>

                  {/* Quiz Generation */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-6 h-6 text-purple-400" />
                      <span className="text-white font-semibold">Smart Quiz</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-purple-400/30 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-purple-400"
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ delay: 2, duration: 2 }}
                        />
                      </div>
                      <p className="text-gray-300 text-sm">Generated 15 adaptive questions</p>
                    </div>
                  </div>

                  {/* Flashcards */}
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="w-6 h-6 text-green-400" />
                      <span className="text-white font-semibold">Memory Cards</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-green-400/30 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-green-400"
                          initial={{ width: 0 }}
                          animate={{ width: "78%" }}
                          transition={{ delay: 2.5, duration: 2 }}
                        />
                      </div>
                      <p className="text-gray-300 text-sm">Created 24 smart flashcards</p>
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default AIStudyLanding;