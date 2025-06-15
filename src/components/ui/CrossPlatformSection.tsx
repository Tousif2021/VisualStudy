import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, FolderSync as Sync, Download, ArrowRight, Zap, Globe, Shield } from 'lucide-react';

export const CrossPlatformSection: React.FC = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm mb-6">
            <Sync size={20} className="text-blue-400 mr-3" />
            <span className="text-blue-300 font-semibold text-sm">Cross-Platform Sync</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300 mb-6">
            Experience VisualStudy
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Everywhere
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're at your desk or on the go, VisualStudy delivers a seamless experience across all your devices. 
            Access your account, manage tasks, and stay productive from any platform.
          </p>
        </motion.div>

        {/* Screenshots Display */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Desktop Experience */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            {/* Desktop Screenshot */}
            <div className="relative">
              {/* Glow Effect */}
              <motion.div 
                className="absolute -inset-8 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Screenshot with 3D Effect */}
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  rotateY: -5,
                  rotateX: 2,
                }}
                transition={{ duration: 0.3 }}
                className="relative transform-gpu perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img 
                  src="/src/assets/889shots_so.jpeg" 
                  alt="VisualStudy Desktop Interface"
                  className="w-full h-auto rounded-2xl shadow-2xl border border-white/10"
                />
                
                {/* Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-white/10 rounded-2xl pointer-events-none" />
                
                {/* Border Glow */}
                <div className="absolute inset-0 rounded-2xl border border-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </div>

            {/* Desktop Caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                >
                  <Monitor size={24} className="text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Powerful Desktop Experience</h3>
              </div>
              <p className="text-gray-300 max-w-md mx-auto">
                Full-featured access to all tools and capabilities on your computer. 
                Manage courses, create detailed notes, and leverage advanced AI features.
              </p>
            </motion.div>
          </motion.div>

          {/* Mobile Experience */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group"
          >
            {/* Mobile Screenshot */}
            <div className="relative mx-auto" style={{ maxWidth: '350px' }}>
              {/* Glow Effect */}
              <motion.div 
                className="absolute -inset-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              />
              
              {/* Screenshot with 3D Effect */}
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: -2,
                }}
                transition={{ duration: 0.3 }}
                className="relative transform-gpu perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img 
                  src="/src/assets/151shots_so.png" 
                  alt="VisualStudy Mobile Interface"
                  className="w-full h-auto rounded-3xl shadow-2xl border border-white/10"
                />
                
                {/* Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-white/10 rounded-3xl pointer-events-none" />
                
                {/* Border Glow */}
                <div className="absolute inset-0 rounded-3xl border border-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </div>

            {/* Mobile Caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                >
                  <Smartphone size={24} className="text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Mobile Convenience</h3>
              </div>
              <p className="text-gray-300 max-w-md mx-auto">
                Take VisualStudy with you, featuring the same intuitive interface optimized for touch. 
                Study on the go and never miss a deadline.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Sync Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center mb-16"
        >
          <div className="relative">
            {/* Connecting Lines with Animation */}
            <motion.div
              animate={{ 
                scaleX: [0.8, 1.2, 0.8],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-40 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            </motion.div>
            
            {/* Data Flow Particles */}
            <motion.div
              animate={{ x: [-80, 80] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg"></div>
            </motion.div>
            <motion.div
              animate={{ x: [80, -80] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
            >
              <div className="w-2 h-2 bg-pink-400 rounded-full shadow-lg"></div>
            </motion.div>
            
            {/* Central Sync Icon */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl relative z-10 border-4 border-white/20"
            >
              <Sync size={28} className="text-white" />
            </motion.div>
            
            {/* Multiple Pulse Effects */}
            <motion.div
              animate={{ 
                scale: [1, 2.5, 1],
                opacity: [0.4, 0, 0.4]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <motion.div
              animate={{ 
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Zap size={24} className="text-white" />
            </motion.div>
            <h4 className="text-lg font-bold text-white mb-3">Real-time Sync</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Changes sync instantly across all your devices. Start on desktop, continue on mobile.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Globe size={24} className="text-white" />
            </motion.div>
            <h4 className="text-lg font-bold text-white mb-3">Universal Access</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Access your study materials from any device, anywhere in the world.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Shield size={24} className="text-white" />
            </motion.div>
            <h4 className="text-lg font-bold text-white mb-3">Secure & Private</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your data is encrypted and secure across all platforms and devices.
            </p>
          </motion.div>
        </motion.div>

        {/* App Store Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            Download VisualStudy for All Your Devices
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* App Store Badge */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl px-8 py-4 flex items-center gap-4 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border border-white/10">
                {/* Apple Logo */}
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-400">Download on the</div>
                  <div className="text-xl font-bold text-white">App Store</div>
                </div>
              </div>
            </motion.a>

            {/* Google Play Badge */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl px-8 py-4 flex items-center gap-4 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 border border-white/10">
                {/* Google Play Logo */}
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8">
                    <path fill="#EA4335" d="M3.609 1.814L13.792 12L3.609 22.186C3.219 22.576 2.609 22.576 2.219 22.186C1.829 21.796 1.829 21.186 2.219 20.796L11.378 12L2.219 3.204C1.829 2.814 1.829 2.204 2.219 1.814C2.609 1.424 3.219 1.424 3.609 1.814Z"/>
                    <path fill="#FBBC04" d="M13.792 12L3.609 1.814C3.999 1.424 4.609 1.424 4.999 1.814L20.999 9.814C21.389 10.204 21.389 10.814 20.999 11.204L4.999 22.186C4.609 22.576 3.999 22.576 3.609 22.186L13.792 12Z"/>
                    <path fill="#4285F4" d="M13.792 12L20.999 11.204C21.389 10.814 21.389 10.204 20.999 9.814L4.999 1.814C4.609 1.424 3.999 1.424 3.609 1.814L13.792 12Z"/>
                    <path fill="#34A853" d="M13.792 12L3.609 22.186C3.999 22.576 4.609 22.576 4.999 22.186L20.999 11.204C21.389 10.814 21.389 10.204 20.999 9.814L13.792 12Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-400">Get it on</div>
                  <div className="text-xl font-bold text-white">Google Play</div>
                </div>
              </div>
            </motion.a>

            {/* Web App Badge */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl px-8 py-4 flex items-center gap-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                <Globe size={28} className="text-white" />
                <div className="text-left">
                  <div className="text-sm text-blue-100">Access via</div>
                  <div className="text-xl font-bold text-white">Web Browser</div>
                </div>
                <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            className="text-gray-400 text-lg mt-8 max-w-2xl mx-auto leading-relaxed"
          >
            Start your learning journey today. Available on iOS, Android, and web browsers. 
            Your progress syncs seamlessly across all platforms.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};