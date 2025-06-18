import { cn } from "../../lib/utils";
import { SlidersHorizontal, Cloud, DollarSign, MoveHorizontal, Heart, HelpCircle, Router as Route, Terminal } from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Learning",
      description:
        "Level up your study game with AI that adapts to you—real results, less guessing.",
      icon: <Terminal />,
    },
    {
      title: "Smart Note Taking & Scan",
      description:
        "Snap a pic or type it up—your notes, auto-organized and searchable. Bye-bye paper mess.",
      icon: <Edit3 />,
    },
    {
      title: "Secured Journal",
      description:
        "Your thoughts, locked tight. Reflect and plan privately—total privacy, zero stress.",
      icon: <Lock />,
    },
    {
      title: "On All Devices",
      description:
        "Study anywhere, anytime—switch from laptop to phone and pick up right where you left off.",
      icon: <MonitorSmartphone />,
    },
    {
      title: "AI Chat Agent",
      description:
        "Got questions? Your personal AI buddy is always ready to chat, guide, and explain.",
      icon: <MessageCircle />,
    },
    {
      title: "AI Voice Coach",
      description:
        "Practice by talking—perfect for presentations, language learning, or quick voice notes.",
      icon: <Mic />,
    },
    {
      title: "Tasks & Smart Insights",
      description:
        "Plan and track tasks with built-in to-dos. Instantly spot subjects needing extra hustle.",
      icon: <CheckSquare2 />,
    },
    {
      title: "AI Summaries, Quizzes, Flashcards",
      description:
        "Boring notes? Instantly create quizzes, summaries, and flashcards—AI does the work, you study smarter.",
      icon: <Zap />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-white/10",
        (index === 0 || index === 4) && "lg:border-l border-white/10",
        index < 4 && "lg:border-b border-white/10"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-black to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-black to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-white/70">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/30 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-white/70 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};