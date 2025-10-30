import { Code2, Trophy, Flame, FolderGit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  gradient: string;
  delay: number;
}

const StatCard = ({ icon, label, value, suffix = "", gradient, delay }: StatCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return prev + Math.ceil(value / 30);
        });
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <Card
      className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-fade-in border-border/50 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold animate-count-up">
            {count}
            {suffix}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${gradient}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Code2 className="w-6 h-6 text-primary-foreground" />}
        label="Events Joined"
        value={24}
        gradient="gradient-primary"
        delay={0}
      />
      <StatCard
        icon={<Trophy className="w-6 h-6 text-primary-foreground" />}
        label="Badges Earned"
        value={12}
        gradient="gradient-accent"
        delay={100}
      />
      <StatCard
        icon={<FolderGit2 className="w-6 h-6 text-primary-foreground" />}
        label="Projects Submitted"
        value={8}
        gradient="gradient-primary"
        delay={200}
      />
      <StatCard
        icon={<Flame className="w-6 h-6 text-primary-foreground" />}
        label="Coding Streak"
        value={15}
        suffix=" days"
        gradient="gradient-accent"
        delay={300}
      />
    </div>
  );
};
