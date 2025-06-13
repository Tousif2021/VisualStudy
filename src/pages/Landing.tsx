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
  Menu,
  X
} from "lucide-react";
import "./Landing.css";

// 3D Floating Tetrahedron
function FloatingTetrahedron({ color = "#0d9488" }) {
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
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

// Hero 3D Canvas
const HeroCanvas: React.FC = () => (
  <Canvas
    camera={{ position: [0, 0, 7], fov: 45 }}
    style={{ position: "absolute", inset: 0, zIndex: 0 }}
  >
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 5, 5]} intensity={0.8} />
    <FloatingTetrahedron color="#0d9488" />
  </Canvas>
);

// Section pin & scroll animations
function SectionPin({ children, id }: { children: React.ReactNode; id: string }) {
  const { scrollYProgress } = useScroll({ target: `#${id}`, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  return (
    <motion.section id={id} style={{ opacity, y }} className="min-h-screen flex flex-col items-center justify-center py-20">
      {children}
    </motion.section>
  );
}

const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-teal-600" />,
      title: "Neural Document Processing",
      description: "Transforms documents into knowledge graphs in seconds.",
      stats: "10M+ docs processed",
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-600" />,
      title: "Adaptive Learning",
      description: "Tailors content based on your progress and goals.",
      stats: "340% retention boost",
    },
    {
      icon: <Brain className="w-12 h-12 text-emerald-600" />,
      title: "Quantum Flashcards",
      description: "Next-gen spaced repetition powered by quantum algorithms.",
      stats: "5× faster recall",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      quote: "I shaved weeks off my research workflow with this AI.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      quote: "Predictive insights had me rocking the MCAT.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gray-50 text-gray-800 overflow-x-hidden">
      <HeroCanvas />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-extrabold">VISUAL STUDY</span>
          </div>
          <nav className="hidden lg:flex space-x-8">
            {['Features', 'Testimonials', 'Pricing', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-teal-600">
                {item}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex space-x-4">
            <Link to="/auth/login" className="py-2 px-4 hover:text-teal-600">Sign In</Link>
            <Link to="/auth/register" className="py-2 px-6 bg-teal-600 text-white rounded-lg">Get Started</Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-inner">
            <div className="flex flex-col space-y-4 p-6">
              {['Features', 'Testimonials', 'Pricing', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-teal-600">
                  {item}
                </a>
              ))}
              <Link to="/auth/register" className="mt-4 py-2 bg-teal-600 text-white rounded-lg text-center">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <SectionPin id="hero">
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold">
            Revolutionize Your Learning Journey
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Harness quantum-enhanced AI to accelerate your study sessions and retain knowledge longer.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/auth/register">
              <button className="px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500">
                Get Started Free
              </button>
            </Link>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:border-teal-600 hover:text-teal-600">
              Watch Demo
            </button>
          </div>
        </div>
      </SectionPin>

      {/* Features Section */}
      <SectionPin id="features">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center">Our Features</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Tilt key={i} glareEnable glareMaxOpacity={0.15} scale={1.03} transitionSpeed={2000} className="relative rounded-lg shadow-lg">
                <div className="bg-white p-6 rounded-lg h-full flex flex-col">
                  {f.icon}
                  <h3 className="mt-4 text-2xl font-bold">{f.title}</h3>
                  <p className="mt-2 text-gray-600 flex-1">{f.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-teal-600 font-medium">{f.stats}</span>
                    <motion.div whileHover={{ scale: 1.2 }} className="p-2 bg-teal-600 text-white rounded-full">
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </SectionPin>

      {/* Testimonials Section */}
      <SectionPin id="testimonials">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold">What Our Users Say</h2>
          <div className="mt-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-lg shadow-lg mx-auto max-w-md"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, idx) => (
                    <Star key={idx} className="w-6 h-6 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-teal-600 mx-auto mb-4" />
                <p className="text-lg italic text-gray-700">"{testimonials[currentTestimonial].quote}"</p>
                <div className="mt-6 font-semibold text-gray-900">— {testimonials[currentTestimonial].name}</div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3 h-3 rounded-full ${idx === currentTestimonial ? 'bg-teal-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionPin>

      {/* Final CTA */}
      <SectionPin id="pricing">
        <div className="text-center px-6">
          <h2 className="text-4xl font-extrabold">Ready to Transcend Learning?</h2>
          <p className="mt-2 text-gray-600">Join 50,000+ learners accelerating their success.</p>
          <motion.button whileHover={{ scale: 1.05 }} className="mt-6 px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold">
            Start Your Journey
          </motion.button>
        </div>
      </SectionPin>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
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
