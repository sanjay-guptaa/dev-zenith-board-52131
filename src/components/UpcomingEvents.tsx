import { Calendar, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: number;
  status: "live" | "upcoming" | "ended";
  progress: number;
}

const events: Event[] = [
  {
    id: 1,
    title: "Algorithm Battle: Dynamic Programming",
    date: "2025-11-02",
    time: "18:00",
    participants: 45,
    status: "live",
    progress: 65,
  },
  {
    id: 2,
    title: "Web Dev Workshop: React Hooks Deep Dive",
    date: "2025-11-05",
    time: "16:00",
    participants: 32,
    status: "upcoming",
    progress: 0,
  },
  {
    id: 3,
    title: "Hackathon: Build Your Dream App",
    date: "2025-11-08",
    time: "10:00",
    participants: 28,
    status: "upcoming",
    progress: 0,
  },
];

const EventCard = ({ event }: { event: Event }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) return "Started";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);

    return () => clearInterval(interval);
  }, [event.date, event.time]);

  const statusColors = {
    live: "bg-accent text-accent-foreground",
    upcoming: "bg-primary/10 text-primary",
    ended: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="p-5 shadow-card hover:shadow-glow transition-all duration-300 border-border/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-base flex-1 pr-2">{event.title}</h3>
        <Badge className={statusColors[event.status]} variant="secondary">
          {event.status === "live" ? "🔴 Live" : timeLeft}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{event.participants}</span>
          </div>
        </div>

        {event.status === "live" && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{event.progress}%</span>
            </div>
            <Progress value={event.progress} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  );
};

export const UpcomingEvents = () => {
  return (
    <Card className="p-6 shadow-card border-border/50 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Upcoming Events
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Card>
  );
};
