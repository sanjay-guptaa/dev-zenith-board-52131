import { ExternalLink, Github, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  title: string;
  author: string;
  description: string;
  tags: string[];
  stars: number;
  language: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "AI Chat Assistant",
    author: "Sarah Kumar",
    description: "A real-time chat application powered by GPT-4 with voice recognition.",
    tags: ["React", "Node.js", "OpenAI"],
    stars: 24,
    language: "TypeScript",
  },
  {
    id: 2,
    title: "Task Master Pro",
    author: "Alex Chen",
    description: "Modern task management app with Kanban boards and team collaboration.",
    tags: ["Next.js", "Supabase", "TailwindCSS"],
    stars: 18,
    language: "JavaScript",
  },
  {
    id: 3,
    title: "Code Snippet Manager",
    author: "Mike Johnson",
    description: "Save and organize your favorite code snippets with syntax highlighting.",
    tags: ["Vue", "Firebase", "Monaco"],
    stars: 15,
    language: "TypeScript",
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="p-5 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-border/50 backdrop-blur-sm group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground">by {project.author}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {project.language}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span>{project.stars}</span>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-8 gap-1 hover:bg-primary/10">
              <Github className="w-4 h-4" />
              Code
            </Button>
            <Button size="sm" variant="ghost" className="h-8 gap-1 hover:bg-accent/10">
              <ExternalLink className="w-4 h-4" />
              Demo
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const RecentProjects = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Github className="w-5 h-5 text-primary" />
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
