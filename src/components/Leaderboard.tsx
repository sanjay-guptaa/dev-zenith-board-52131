import { Trophy, Medal, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Player {
  rank: number;
  name: string;
  points: number;
  change: number;
  avatar: string;
}

const leaderboard: Player[] = [
  { rank: 1, name: "Alex Chen", points: 2450, change: 2, avatar: "AC" },
  { rank: 2, name: "Sarah Kumar", points: 2340, change: 1, avatar: "SK" },
  { rank: 3, name: "Mike Johnson", points: 2210, change: -1, avatar: "MJ" },
  { rank: 4, name: "Emily Zhang", points: 2105, change: 3, avatar: "EZ" },
  { rank: 5, name: "David Lee", points: 1980, change: 0, avatar: "DL" },
];

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
  return <span className="text-sm font-semibold text-muted-foreground w-5 text-center">{rank}</span>;
};

const PlayerRow = ({ player }: { player: Player }) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors">
      <div className="flex items-center justify-center w-8">
        <RankBadge rank={player.rank} />
      </div>
      
      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
        <AvatarFallback className={player.rank <= 3 ? "gradient-primary text-primary-foreground font-semibold" : "bg-muted"}>
          {player.avatar}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{player.name}</p>
        <p className="text-sm text-muted-foreground">{player.points.toLocaleString()} points</p>
      </div>

      <div className="flex items-center gap-1">
        {player.change > 0 && (
          <Badge className="bg-accent/10 text-accent border-accent/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            +{player.change}
          </Badge>
        )}
        {player.change < 0 && (
          <Badge variant="secondary" className="text-destructive">
            -{Math.abs(player.change)}
          </Badge>
        )}
        {player.change === 0 && (
          <Badge variant="outline">—</Badge>
        )}
      </div>
    </div>
  );
};

export const Leaderboard = () => {
  return (
    <Card className="p-6 shadow-card border-border/50 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Top Performers
      </h2>
      <div className="space-y-2">
        {leaderboard.map((player) => (
          <PlayerRow key={player.rank} player={player} />
        ))}
      </div>
    </Card>
  );
};
