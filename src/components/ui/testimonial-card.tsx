import { cn } from "../../lib/utils"
import { Avatar, AvatarImage } from "./avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm",
        "p-4 text-start sm:p-6",
        "hover:from-white/95 hover:to-white/80 hover:shadow-md",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-all duration-300 border border-white/30 shadow-sm",
        "hover:scale-105 hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-white/60">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-gray-800">
            {author.name}
          </h3>
          <p className="text-sm text-gray-600">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-gray-700 leading-relaxed">
        {text}
      </p>
    </Card>
  )
}