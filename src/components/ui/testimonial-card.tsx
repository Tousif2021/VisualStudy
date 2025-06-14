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
        "bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-sm",
        "p-4 text-start sm:p-6",
        "hover:from-white/90 hover:to-white/70 hover:shadow-lg",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-all duration-300 border border-white/20 shadow-md",
        "hover:scale-105 hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-white/50">
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