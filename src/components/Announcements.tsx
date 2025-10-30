import { Megaphone, Pin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
  category: "general" | "event" | "achievement";
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: "New Challenge Series Announced! 🎉",
    content: "Get ready for our 30-day coding challenge starting next week. Build projects, learn new skills, and win amazing prizes!",
    date: "2 hours ago",
    isPinned: true,
    category: "event",
  },
  {
    id: 2,
    title: "Club Meeting Tomorrow",
    content: "Don't forget our weekly sync-up tomorrow at 5 PM. We'll be discussing upcoming hackathons and project showcases.",
    date: "5 hours ago",
    isPinned: false,
    category: "general",
  },
  {
    id: 3,
    title: "Congratulations to October Winners! 🏆",
    content: "Shoutout to our top performers this month. Check the leaderboard to see if you made it to the top 10!",
    date: "1 day ago",
    isPinned: false,
    category: "achievement",
  },
];

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  const categoryColors = {
    general: "bg-primary/10 text-primary",
    event: "bg-accent/10 text-accent",
    achievement: "bg-gradient-accent text-accent-foreground",
  };

  return (
    <div className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors bg-card/30 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          {announcement.isPinned && (
            <Pin className="w-4 h-4 text-primary fill-primary" />
          )}
          <h3 className="font-semibold text-sm">{announcement.title}</h3>
        </div>
        <Badge className={categoryColors[announcement.category]} variant="secondary">
          {announcement.category}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
      <span className="text-xs text-muted-foreground">{announcement.date}</span>
    </div>
  );
};

export const Announcements = () => {
  return (
    <Card className="p-6 shadow-card border-border/50 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-primary" />
        Announcements
      </h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </Card>
  );
};
