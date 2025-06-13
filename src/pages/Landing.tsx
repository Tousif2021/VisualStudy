/* src/pages/Landing.tsx */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import { Canvas, useFrame } from "@react-three/fiber";
import Tilt from "react-parallax-tilt";
import Lottie from "react-lottie-player";
import brainJson from "../lotties/brain.json";
import {
  Zap,
  ArrowRight,
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
      lottie: brainJson,
      title: "Neural Document Processing",
      description: "Advanced AI transforms complex documents into structured knowledge graphs.",
      stats: "10M+ docs processed",
    },
    // ... add more features
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      quote: "This AI revolutionized my research workflow.",
      rating: 5,
    },
    // ... add more testimonials
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

      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        {/* ... header content ... */}
      </header>

      {/* Hero Section */}
      <SectionPin id="hero">
        <div className="text-center p-8 z-10">
          <motion.h1
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
          >
            The Future of Learning
          </motion.h1>
          <p className="mt-4 text-xl text-white/80">
            10x Faster Learning with Quantum-Enhanced AI.
          </p>
          <button className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-bold animate-pulse">
            Get Started
          </button>
        </div>
      </SectionPin>

      {/* Features Section */}
      <SectionPin id="features">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
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
                <Lottie loop play animationData={f.lottie} style={{ width: 80, height: 80 }} />
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
        <div className="p-8 max-w-2xl mx-auto">
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
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-cyan-400 mb-4" />
              <p className="text-xl italic">"{testimonials[currentTestimonial].quote}"</p>
              <div className="mt-6 font-bold">— {testimonials[currentTestimonial].name}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </SectionPin>

      <footer className="p-8 text-center text-white/60 bg-black/50 backdrop-blur-xl">
        © 2025 VISUAL STUDY. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;


