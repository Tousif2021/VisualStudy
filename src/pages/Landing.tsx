/* src/pages/Landing.tsx */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import {
  Zap,
  ArrowRight,
  Brain,
  Star,
  Quote,
  Play,
  Eye,
  CheckCircle,
  Shield,
  Globe,
  Menu,
  X,
} from "lucide-react";
import "./Landing.css";

// Button component
const Button: React.FC<{
  children: React.ReactNode;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
  onClick?: () => void;
}> = ({ children, variant = "solid", size = "md", onClick }) => {
  const base = "rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  const variants = {
    solid: "bg-teal-600 text-white hover:bg-teal-500 focus:ring-teal-500",
    outline: "border-2 border-teal-600 text-teal-600 hover:bg-teal-50 focus:ring-teal-500",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Data
const FEATURES = [
  { icon: <Brain className="w-10 h-10 text-teal-600" />, title: "Neural Document Processing", description: "Transforms documents into knowledge graphs in seconds.", stats: "10M+ docs processed" },
  { icon: <Brain className="w-10 h-10 text-purple-600" />, title: "Adaptive Learning", description: "Tailors content based on your progress and goals.", stats: "340% retention boost" },
  { icon: <Brain className="w-10 h-10 text-emerald-600" />, title: "Quantum Flashcards", description: "Next-gen spaced repetition powered by quantum algorithms.", stats: "5× faster recall" },
];

const TESTIMONIALS = [
  { name: "Dr. Sarah Chen", quote: "I shaved weeks off my research workflow with this AI.", rating: 5 },
  { name: "Marcus Rodriguez", quote: "Predictive insights had me rocking the MCAT.", rating: 5 },
];

// Variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Landing: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const { scrollYProgress } = useScroll();
  const headerBg = useTransform(scrollYProgress, [0, 0.1], ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]);

  useEffect(() => {
    const id = setInterval(() => setCurrent((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-gray-800 bg-white">
      <motion.header style={{ backgroundColor: headerBg }} className="fixed w-full z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-extrabold">VISUAL STUDY</span>
          </div>
          <nav className="hidden lg:flex space-x-6">
            {['Features','Testimonials','Pricing','Contact'].map((sec) => (
              <a key={sec} href={`#${sec.toLowerCase()}`} className="hover:text-teal-600">{sec}</a>
            ))}
          </nav>
          <div className="hidden lg:flex space-x-4">
            <Link to="/auth/login" className="hover:text-teal-600">Sign In</Link>
            <Button size="md">Get Started</Button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="flex flex-col p-4 space-y-3">
              {['Features','Testimonials','Pricing','Contact'].map((sec) => (
                <a key={sec} href={`#${sec.toLowerCase()}`} className="hover:text-teal-600">{sec}</a>
              ))}
              <Button size="md">Get Started</Button>
            </div>
          </div>
        )}
      </motion.header>

      {/* Hero */}
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Revolutionize Your Learning Journey
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Harness quantum-enhanced AI to accelerate your study sessions and retain knowledge longer.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Button>Get Started Free</Button>
            <Button variant="outline">Watch Demo</Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold">Our Features</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                {f.icon}
                <h3 className="mt-4 text-2xl font-bold">{f.title}</h3>
                <p className="mt-2 text-gray-600">{f.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-teal-600 font-medium">{f.stats}</span>
                  <ArrowRight className="w-6 h-6 text-teal-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold">What Our Users Say</h2>
          <div className="mt-8 relative">
            <AnimatePresence>
              <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.6 }} className="bg-white p-8 rounded-lg shadow-lg mx-auto max-w-md">
                <div className="flex justify-center mb-4">
                  {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (<Star key={i} className="w-6 h-6 text-yellow-400" />))}
                </div>
                <Quote className="w-8 h-8 text-teal-600 mx-auto mb-4" />
                <p className="text-lg italic text-gray-700">"{TESTIMONIALS[current].quote}"</p>
                <div className="mt-6 font-semibold text-gray-900">— {TESTIMONIALS[current].name}</div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center space-x-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full ${i === current ? 'bg-teal-600' : 'bg-gray-300'}`}></button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20">
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} className="text-center px-6">
          <h2 className="text-4xl font-extrabold">Ready to Transcend Learning?</h2>
          <p className="mt-2 text-gray-600">Join 50,000+ learners accelerating their success.</p>
          <Button variant="solid" size="lg" className="mt-6" onClick={() => { /* navigate */ }}>
            Start Your Journey
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-white border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <span className="text-gray-600">© 2025 VISUAL STUDY. All rights reserved.</span>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-500" /><span>No card required</span>
            <Shield className="w-5 h-5 text-blue-500" /><span>Enterprise security</span>
            <Globe className="w-5 h-5 text-purple-500" /><span>Worldwide</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
