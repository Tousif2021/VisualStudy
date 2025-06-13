/* src/pages/Landing.tsx */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import { Canvas, useFrame } from "@react-three/fiber";
import Tilt from "react-parallax-tilt";
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
  Rocket,
} from "lucide-react";
import "./Landing.css";

// 3D Floating Tetrahedron
function FloatingTetrahedron({ color = "#00ffd5" }) {
  const mesh = useRef<any>();
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.elapsedTime * 0.2;
    mesh.current.rotation.y = clock.elapsedTime * 0.4;
    mesh.current.position.y = Math.sin(clock.elapsedTime) * 0.5;
  });
  return (
    <mesh ref={mesh} scale={1.5}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
    </mesh>
  );
}

// Hero 3D Canvas
const HeroCanvas: React.FC = () => (
  <Canvas
    camera={{ position: [0, 0, 5], fov: 50 }}
    style={{ position: "absolute", inset: 0, zIndex: 0 }}
  >
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1} />
    <FloatingTetrahedron color="#ff4de8" />
    <FloatingTetrahedron color="#4de8ff" />
  </Canvas>
);

// Section pin & scroll animations
function SectionPin({ children, id }: { children: React.ReactNode; id: string }) {
  const { scrollYProgress } = useScroll({ target: `#${id}`, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);
  return (
    <motion.section id={id} style={{ opacity, y }} className="min-h-screen flex items-center justify-center">
      {children}
    </motion.section>
  );
}

const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-cyan-400" />,
      title: "Neural Document Processing",
      description: "Advanced AI transforms complex documents into structured knowledge graphs.",
      stats: "10M+ docs processed",
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-400" />,
      title: "Adaptive Learning Engine",
      description: "Personalized paths that evolve with your progress.",
      stats: "340% better retention",
    },
    {
      icon: <Brain className="w-12 h-12 text-green-400" />,
      title: "Quantum Flashcards",
      description: "Spaced repetition powered by quantum principles.",
      stats: "5x faster learning",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      quote: "This AI revolutionized my research workflow.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      quote: "Scored in the 99th percentile on my MCAT thanks to predictive insights.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden text-white">
      <HeroCanvas />

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex h-20 items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <Zap className="w-8 h-8 text-cyan-400 animate-spin-slow" />
            <span className="text-2xl font-black">VISUAL STUDY</span>
          </div>
          <nav className="hidden md:flex gap-8">
            {['Features', 'Testimonials', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-400">
                {item}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex gap-4">
            <Link to="/auth/login" className="hover:text-cyan-400">Sign In</Link>
            <Link to="/auth/register" className="px-4 py-2 bg-cyan-500 rounded-2xl">Get Started</Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <SectionPin id="hero">
        <div className="text-center p-8 z-10">
          <motion.h1
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
          >
            The Future of Learning
          </motion.h1>
          <p className="mt-4 text-xl text-white/80">10x Faster Learning with Quantum-Enhanced AI.</p>
          <div className="mt-8 space-x-4">
            <button className="px-8 py-4 bg-cyan-500 rounded-2xl font-bold">Get Started</button>
            <button className="px-6 py-3 border border-white rounded-2xl">Watch Demo</button>
          </div>
        </div>
      </SectionPin>

      {/* Features Section */}
      <SectionPin id="features">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 p-8">
          {features.map((f, i) => (
            <Tilt
              key={i}
              glareEnable
              glareMaxOpacity={0.2}
              scale={1.05}
              transitionSpeed={2500}
              className="relative overflow-hidden rounded-3xl card-shimmer"
            >
              <div className="relative p-8 backdrop-blur-xl border border-white/10 rounded-3xl">
                {f.icon}
                <h3 className="mt-4 text-2xl font-bold">{f.title}</h3>
                <p className="mt-2 text-white/70">{f.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-cyan-400">{f.stats}</span>
                  <motion.div whileHover={{ scale: 1.2 }} className="p-2 bg-cyan-500 rounded-full">
                    <ArrowRight size={16} />
                  </motion.div>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </SectionPin>

      {/* Testimonials Section */}
      <SectionPin id="testimonials">
        <div className="max-w-xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20"
            >
              <div className="flex mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, idx) => (
                  <Star key={idx} className="w-6 h-6 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-cyan-400 mb-4" />
              <p className="text-xl italic text-white/90">"{testimonials[currentTestimonial].quote}"</p>
              <div className="mt-6 font-bold text-white">— {testimonials[currentTestimonial].name}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </SectionPin>

      {/* Final CTA */}
      <SectionPin id="pricing">
        <div className="text-center p-8 space-y-4">
          <h2 className="text-4xl font-black">Ready to Transcend Learning?</h2>
          <button className="px-8 py-4 bg-cyan-500 rounded-2xl font-bold">Start Your Journey</button>
        </div>
      </SectionPin>

      {/* Footer */}
      <footer className="p-8 text-center text-white/60 bg-black/50 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          <span>© 2025 VISUAL STUDY. All rights reserved.</span>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <CheckCircle className="w-5 h-5 text-green-400" /><span>No card required</span>
            <Shield className="w-5 h-5 text-blue-400" /><span>Enterprise security</span>
            <Globe className="w-5 h-5 text-purple-400" /><span>Worldwide</span>
          </div>
        </div>
            </footer>
    </div>
  );
};

export default Landing;
