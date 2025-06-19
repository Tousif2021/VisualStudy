import { cn } from "../../lib/utils"
import { TestimonialCard, TestimonialAuthor } from "./testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "relative py-12 sm:py-24 md:py-32 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-5xl md:text-7xl font-black text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* True edge-to-edge marquee container */}
        <div className="relative w-screen overflow-hidden">
          <div className="flex [--gap:1rem] [gap:var(--gap)] [--duration:60s]">
            {/* First set of testimonials */}
            <div className="flex shrink-0 [gap:var(--gap)] animate-marquee flex-row min-w-max">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`set1-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
            
            {/* Second set for seamless loop */}
            <div className="flex shrink-0 [gap:var(--gap)] animate-marquee flex-row min-w-max">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`set2-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
            
            {/* Third set for extra smoothness */}
            <div className="flex shrink-0 [gap:var(--gap)] animate-marquee flex-row min-w-max">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`set3-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
          </div>

          {/* Minimal edge gradients for smooth appearance */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent" />
        </div>
      </div>
    </section>
  )
}