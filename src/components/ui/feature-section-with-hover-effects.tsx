import { cn } from "../../lib/utils";
import {
  SlidersHorizontal,
  Cloud,
  DollarSign,
  MoveHorizontal,
  Heart,
  HelpCircle,
  Route,
  Terminal,
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Learning",
      description:
        "Built for students, researchers, dreamers, thinkers and achievers.",
      icon: <Terminal />,
    },
    {
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, and as powerful as a supercomputer.",
      icon: <MoveHorizontal />,
    },
    {
      title: "Affordable pricing",
      description:
        "Our prices are best in the market. No cap, no lock, no credit card required.",
      icon: <DollarSign />,
    },
    {
      title: "99.9% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <Cloud />,
    },
    {
      title: "Smart Architecture",
      description: "You can simply share knowledge instead of starting from scratch",
      icon: <Route />,
    },
    {
      title: "24/7 AI Support",
      description:
        "We are available a 100% of the time. Our AI Agents never sleep.",
      icon: <HelpCircle />,
    },
    {
      title: "Performance guarantee",
      description:
        "If you don't improve your grades, we will help you until you do.",
      icon: <SlidersHorizontal />,
    },
    {
      title: "And everything else",
      description: "Comprehensive study tools that adapt to your learning style",
      icon: <Heart />,
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