// Landing.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap, Sun, Moon, ArrowRight, Brain, Target, Sparkles, BarChart3,
  Mic, Menu, X, Star, Quote, Play, Eye, CheckCircle, Shield, Globe, Rocket
} from "lucide-react";

// Button component
const Button = ({ children, className = "", size = "md", variant = "solid", leftIcon, rightIcon, fullWidth, ...rest }) => {
  const sizeMap = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg", xl: "px-10 py-5 text-xl" };
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
        "rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-cyan-300",
        sizeMap[size], variantMap[variant], fullWidth ? "w-full" : "", className
      ].join(" ")}
      {...rest}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {leftIcon && <span className="relative z-10" aria-hidden>{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {rightIcon && <span className="relative z-10" aria-hidden>{rightIcon}</span>}
    </motion.button>
  );
};

// Floating particles
const FloatingParticles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({ id: i, x: Math.random()*100, y: Math.random()*100, size: Math.random()*3+1, duration: Math.random()*20+10 })), []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px` }}
          animate={{ y:[0,-100,0], x:[0,Math.random()*50-25,0], opacity:[0,0.8,0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// Data
const features = [
  { icon:<Brain className="w-8 h-8"/>, title:"Neural Document Processing", description:"Advanced AI transforms complex documents into structured knowledge graphs with 99.7% accuracy.", color:"from-blue-500 via-cyan-500 to-teal-500", badge:"AI-POWERED", stats:"10M+ docs processed" },
  { icon:<Target className="w-8 h-8"/>, title:"Adaptive Learning Engine", description:"Personalized learning paths that evolve with your progress, optimizing retention by 340%.", color:"from-purple-500 via-pink-500 to-rose-500", badge:"ADAPTIVE", stats:"340% better retention" },
  { icon:<Sparkles className="w-8 h-8"/>, title:"Quantum Flashcards", description:"Spaced repetition algorithms powered by quantum computing principles for maximum efficiency.", color:"from-emerald-500 via-green-500 to-lime-500", badge:"QUANTUM", stats:"5x faster learning" },
  { icon:<BarChart3 className="w-8 h-8"/>, title:"Predictive Analytics", description:"AI predicts your performance and suggests optimal study strategies before you even start.", color:"from-orange-500 via-red-500 to-pink-500", badge:"PREDICTIVE", stats:"95% accuracy" },
  { icon:<Mic className="w-8 h-8"/>, title:"Voice Intelligence", description:"Natural language processing that understands context, emotion, and learning intent.", color:"from-indigo-500 via-blue-500 to-cyan-500", badge:"VOICE-AI", stats:"Real-time processing" },
  { icon:<Rocket className="w-8 h-8"/>, title:"Performance Acceleration", description:"Boost your learning velocity with AI-optimized study sessions and instant feedback loops.", color:"from-violet-500 via-purple-500 to-indigo-500", badge:"ACCELERATED", stats:"10x faster results" }
];
const testimonials = [
  { name:"Dr. Sarah Chen", role:"PhD Candidate, MIT", university:"MIT", image:"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", quote:"This AI completely revolutionized my research workflow. What used to take weeks now takes hours.", rating:5, metric:"500% productivity increase" },
  { name:"Marcus Rodriguez", role:"Medical Student", university:"Harvard Medical School", image:"https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", quote:"The predictive analytics helped me identify weak areas before my MCAT. Scored in the 99th percentile.", rating:5, metric:"99th percentile MCAT" },
  { name:"Emily Zhang", role:"Computer Science Major", university:"Stanford University", image:"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", quote:"The quantum flashcards are insane. I memorized 2000+ algorithms in just 3 weeks.", rating:5, metric:"2000+ algorithms mastered" }
];

// Variants
const fadeInUp = { hidden:{opacity:0,y:60}, visible:{opacity:1,y:0,transition:{duration:0.8,ease:[0.25,0.46,0.45,0.94]}} };
const staggerContainer = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.15,delayChildren:0.1}} };
const scaleIn = { hidden:{opacity:0,scale:0.8}, visible:{opacity:1,scale:1,transition:{duration:0.6,ease:"easeOut"}} };

const Landing = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme")||"dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0,1], ["0%","100%"]);
  const textY = useTransform(scrollYProgress, [0,1], ["0%","200%"]);

  useEffect(() => { 
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const iv = setInterval(() => setCurrentTestimonial(i => (i+1)%testimonials.length), 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative min-h-screen bg-black dark:bg-white overflow-x-hidden text-white dark:text-black" lang="en">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-cyan-500 text-white p-2">Skip to content</a>
      <motion.div className="fixed inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <FloatingParticles />
      </motion.div>

      <header className="fixed top-0 w-full z-40 bg-black/80 dark:bg-white/80 backdrop-blur-xl border-b border-white/10 dark:border-gray-300/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Link to="/" aria-label="Visual Study Home">
              <motion.div animate={{ rotate:[0,360] }} transition={{ duration:20, repeat:Infinity, ease:"linear" }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <Zap className="text-white w-7 h-7" />
              </motion.div>
            </Link>
            <span className="text-2xl font-black tracking-tight">VISUAL STUDY</span>
          </div>
          <nav className="hidden md:flex gap-8 text-base font-medium">
            {["Features","Platform","Testimonials","Pricing"].map(item => (
              <motion.a key={item} href={`#${item.toLowerCase()}`} className="text-white/70 dark:text-black/70 hover:text-white dark:hover:text-black transition-colors relative group" whileHover={{ y:-2 }}>
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(t => t==='dark'?'light':'dark')} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-white/10">
              {theme==='dark' ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-black" />}
            </button>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/auth/register"><Button variant="glow" size="sm">Get Started Free</Button></Link>
            </div>
            <button onClick={() => setMobileMenuOpen(m => !m)} aria-label="Toggle menu" className="md:hidden p-2 rounded-lg hover:bg-white/10">
              {mobileMenuOpen ? <X className="w-6 h-6 text-white"/> : <Menu className="w-6 h-6 text-white"/>}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-6">
              <ul className="space-y-4">
                {["Features","Platform","Testimonials","Pricing"].map(item => (
                  <li key={item}><a href={`#${item.toLowerCase()}`} className="block text-white/70 hover:text-white py-2">{item}</a></li>
                ))}
              </ul>
              <div className="pt-4 space-y-3">
                <Link to="/auth/login"><Button variant="ghost" fullWidth>Sign In</Button></Link>
                <Link to="/auth/register"><Button variant="glow" fullWidth>Get Started Free</Button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="main" className="relative pt-20">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center text-center px-4">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 max-w-2xl mx-auto">
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-xl">
                <Sparkles className="w-5 h-5 mr-3 text-cyan-400" />
                <span className="text-cyan-300 font-semibold text-sm">Next-Generation AI Learning Platform</span>
                <div className="ml-3 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} style={{ y: textY }}>
              <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-300 leading-tight">
                The Future of<br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Learning is Here</span>
              </h1>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <p className="text-xl md:text-2xl text-white/80 font-light">
                Harness the power of quantum-enhanced AI to transform how you learn, study, and excel.<br />
                <span className="text-cyan-300 font-medium">Experience 10x faster learning with 99.7% accuracy.</span>
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link to="/auth/register"><Button size="xl" variant="glow" leftIcon={<Rocket size={24}/>} fullWidth={false}>Start Learning Now</Button></Link>
              <Button size="xl" variant="outline" leftIcon={<Play size={24}/>} fullWidth={false}>Watch Demo</Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 pt-16">
              {[{value:50000,label:"Active Learners",suffix:"+"},{value:99.7,label:"AI Accuracy",suffix:"%"},{value:10,label:"Faster Learning",suffix:"x"}].map((stat,i)=>(
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    <CountUp end={stat.value} duration={2} separator="," />{stat.suffix}
                  </div>
                  <div className="text-white/60 text-sm font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>
        {/* Features */}
        <section id="features" className="py-32 px-4">
          <div className="max-w-7xl mx-auto text-center mb-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:'-100px'}} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl mb-6">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                <span className="text-purple-300 font-semibold text-sm">AI-Powered Features</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6">Beyond Human<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">Capabilities</span></motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-white/70 max-w-3xl mx-auto">Experience learning technology that adapts, predicts, and evolves with your unique cognitive patterns.</motion.p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:'-100px'}} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {features.map((f,i)=>(
                <motion.div key={i} variants={scaleIn} whileHover={{y:-8,scale:1.02}} transition={{type:'spring',stiffness:300,damping:30}}>
                  <div className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"/>
                    <div className="relative z-10 flex items-start justify-between mb-6">
                      <motion.div className={`p-4 rounded-2xl bg-gradient-to-r ${f.color} shadow-2xl`} whileHover={{scale:1.1,rotate:5}} transition={{type:'spring',stiffness:300}}>{f.icon}</motion.div>
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">{f.badge}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                    <p className="text-white/70 mb-6 leading-relaxed">{f.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-cyan-400">{f.stats}</span>
                      <motion.div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center cursor-pointer" whileHover={{scale:1.2}} whileTap={{scale:0.9}}>
                        <ArrowRight size={16} className="text-white"/>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Testimonials */}
        <section id="testimonials" className="py-32 px-4 bg-black/80 dark:bg-white/80">
          <div className="max-w-6xl mx-auto text-center mb-20">
            <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6">Trusted by<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">Top Minds</span></motion.h2>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentTestimonial} initial={{opacity:0,x:100}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-100}} transition={{duration:0.8,ease:'easeInOut'}} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
                <div className="flex mb-8 justify-center space-x-2">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_,i)=><Star key={i} className="w-8 h-8 text-yellow-400"/>)}

export default Landing;