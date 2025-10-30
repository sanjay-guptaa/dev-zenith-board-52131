import { Calendar, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: number;
  maxSeats: number;
  status: "live" | "upcoming" | "ended";
  progress: number;
  eligibilityCriteria: string[];
  rules: string[];
}

const participationFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  reason: z.string().min(20, "Please provide at least 20 characters explaining why you want to join"),
  acceptedRules: z.boolean().refine((val) => val === true, "You must accept the rules and regulations"),
});

const events: Event[] = [
  {
    id: 1,
    title: "Algorithm Battle: Dynamic Programming",
    date: "2025-11-02",
    time: "18:00",
    participants: 45,
    maxSeats: 50,
    status: "live",
    progress: 65,
    eligibilityCriteria: [
      "Basic knowledge of programming",
      "Understanding of algorithms and data structures",
      "Laptop with coding environment setup"
    ],
    rules: [
      "Attend the entire event",
      "Respect other participants",
      "No plagiarism or cheating",
      "Follow the code of conduct"
    ]
  },
  {
    id: 2,
    title: "Web Dev Workshop: React Hooks Deep Dive",
    date: "2025-11-05",
    time: "16:00",
    participants: 32,
    maxSeats: 40,
    status: "upcoming",
    progress: 0,
    eligibilityCriteria: [
      "Basic knowledge of React",
      "JavaScript fundamentals",
      "Laptop with Node.js installed"
    ],
    rules: [
      "Complete pre-workshop setup",
      "Active participation required",
      "Share learnings with community",
      "Provide feedback after session"
    ]
  },
  {
    id: 3,
    title: "Hackathon: Build Your Dream App",
    date: "2025-11-08",
    time: "10:00",
    participants: 28,
    maxSeats: 30,
    status: "upcoming",
    progress: 0,
    eligibilityCriteria: [
      "Team of 2-4 members",
      "At least one developer per team",
      "Original idea (not previously built)",
      "Available for full 24 hours"
    ],
    rules: [
      "Code must be written during hackathon",
      "Open source libraries allowed",
      "Submit before deadline",
      "Present your project to judges"
    ]
  },
];

const EventCard = ({ event }: { event: Event }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(event.participants);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof participationFormSchema>>({
    resolver: zodResolver(participationFormSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      phone: "",
      reason: "",
      acceptedRules: false,
    },
  });

  useEffect(() => {
    const checkRegistration = async () => {
      if (user) {
        const { data } = await supabase
          .from("event_registrations")
          .select("id")
          .eq("event_id", event.id)
          .eq("user_id", user.id)
          .single();
        
        setIsRegistered(!!data);
      }
    };
    
    checkRegistration();
  }, [event.id, user]);

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

  const onSubmit = async (values: z.infer<typeof participationFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: event.id,
          user_id: user.id,
          full_name: values.fullName,
          email: values.email,
          phone: values.phone || null,
          reason: values.reason,
          accepted_rules: values.acceptedRules,
        });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "You have successfully registered for the event",
      });

      setIsDialogOpen(false);
      setIsRegistered(true);
      setRegistrationCount(prev => prev + 1);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const seatsLeft = event.maxSeats - registrationCount;
  const isEventFull = seatsLeft <= 0;

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
            <span>{registrationCount}/{event.maxSeats}</span>
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

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            {isEventFull ? (
              <Badge variant="destructive">Event Full</Badge>
            ) : (
              <span className="text-muted-foreground">
                {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
              </span>
            )}
          </div>

          {event.status !== "ended" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  disabled={isEventFull || isRegistered}
                  className="font-medium"
                >
                  {isRegistered ? "Registered" : "Join Event"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register for {event.title}</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to register for this event
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Eligibility Criteria */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Eligibility Criteria</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {event.eligibilityCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Rules and Regulations */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Rules and Regulations</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {event.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Registration Form */}
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Why do you want to join this event?</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us why you're interested in this event and what you hope to gain from it..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum 20 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="acceptedRules"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I accept the rules and regulations
                              </FormLabel>
                              <FormDescription>
                                You must accept the rules and eligibility criteria to register
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Submit Registration
                      </Button>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
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
