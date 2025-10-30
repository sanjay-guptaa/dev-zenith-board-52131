import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { Announcements } from "@/components/Announcements";
import { Leaderboard } from "@/components/Leaderboard";
import { RecentProjects } from "@/components/RecentProjects";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <section className="animate-fade-in">
          <StatsCards />
        </section>

        {/* Events and Announcements */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="lg:col-span-2">
            <UpcomingEvents />
          </div>
          <div>
            <Announcements />
          </div>
        </section>

        {/* Leaderboard */}
        <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <Leaderboard />
        </section>

        {/* Recent Projects */}
        <section className="animate-fade-in" style={{ animationDelay: "600ms" }}>
          <RecentProjects />
        </section>
      </main>
    </div>
  );
};

export default Index;
