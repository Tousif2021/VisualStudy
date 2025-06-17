"use client"

import * as React from "react"
import { ShadcnButton } from "./Button"
import { ShadcnInput } from "./input"
import { ShadcnLabel } from "./label"
import { ShadcnSwitch } from "./switch"
import { ShadcnTextarea } from "./textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"

function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-br from-black via-slate-900 to-black backdrop-blur-xl text-white transition-colors duration-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-pink-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">Stay Connected</h2>
            <p className="mb-6 text-white/70">
              Join our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="relative">
              <ShadcnInput
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <ShadcnButton
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </ShadcnButton>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="#features" className="block transition-colors hover:text-cyan-400 text-white/70">
                Features
              </a>
              <a href="#platform" className="block transition-colors hover:text-cyan-400 text-white/70">
                Platform
              </a>
              <a href="#testimonials" className="block transition-colors hover:text-cyan-400 text-white/70">
                Testimonials
              </a>
              <a href="#pricing" className="block transition-colors hover:text-cyan-400 text-white/70">
                Pricing
              </a>
              <a href="#" className="block transition-colors hover:text-cyan-400 text-white/70">
                Contact
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic text-white/70">
              <p>123 Innovation Street</p>
              <p>Tech City, TC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: hello@visualstudy.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShadcnButton variant="outline" size="icon" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </ShadcnButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShadcnButton variant="outline" size="icon" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </ShadcnButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShadcnButton variant="outline" size="icon" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </ShadcnButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShadcnButton variant="outline" size="icon" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </ShadcnButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-white/70" />
              <ShadcnSwitch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4 text-white/70" />
              <ShadcnLabel htmlFor="dark-mode" className="sr-only text-white">
                Toggle dark mode
              </ShadcnLabel>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row">
          <p className="text-sm text-white/60">
            © 2025 VISUAL STUDY. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-cyan-400 text-white/70">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-cyan-400 text-white/70">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-cyan-400 text-white/70">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }