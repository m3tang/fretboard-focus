import Image from "next/image";
import {
  Activity,
  LineChart,
  ListChecks,
  Star,
  Timer,
  Trophy,
} from "lucide-react";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WaitlistDialog } from "@/components/waitlist-dialogue";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container relative z-10 ">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24 animate-fadeIn">
            {/* Text */}
            <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight">
                Your Guitar Practice, All in One Place
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Level up faster with guided routines, real-time tracking, and a
                built-in metronome in one simple practice workspace.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <WaitlistDialog />
              </div>
            </div>

            {/* Wider Image */}
            <div className="flex-[1.25] w-full">
              <div className="relative aspect-[45/32] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/home@2x.png"
                  alt="Guitarist practicing"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container animate-fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              Practice Smarter, Improve Faster
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              FretBook gives you a structured, distraction-free practice flow—so
              you can build consistency, track progress, and stay in the zone
              every time you pick up your guitar.
            </p>
          </div>

          {/* Wider Image */}
          <div className="flex-[1.25] w-full">
            <div className="w-[80%] mx-auto">
              <div className="relative aspect-[45/32] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/practice@2x.png"
                  alt="Guitarist practicing"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container animate-fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              Built for Better Practice
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From custom routines to real-time tracking, FretBook gives you the
              tools you need to stay consistent, motivated, and improving.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<ListChecks className="w-6 h-6" />}
              title="Custom Routines"
              description="Build structured sessions based on your skill level, goals, and time."
            />
            <FeatureCard
              icon={<LineChart className="w-6 h-6" />}
              title="Progress Tracking"
              description="Visualize your growth and stay motivated with charts and streaks."
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6" />}
              title="Built-in Metronome"
              description="Practice in perfect time with our clean, adjustable metronome."
            />
            <FeatureCard
              icon={<Timer className="w-6 h-6" />}
              title="Time-Split Modules"
              description="Break sessions into focused blocks like warm-ups, scales, and songs."
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6" />}
              title="Practice Goals"
              description="Set daily or weekly goals to build consistency and confidence."
            />
            <FeatureCard
              icon={<Star className="w-6 h-6" />}
              title="Favorites & Tags"
              description="Save go-to exercises and filter routines by technique or focus area."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted text-foreground">
        <div className="container mx-auto max-w-3xl text-center px-6 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-heading">
            Ready to Transform Your Guitar Practice?
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            Sign up for early access to the practice system built for real
            improvement.
          </p>
          <div className="mt-10">
            <WaitlistDialog />
          </div>
        </div>
      </section>
    </div>
  );
}

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
};

function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn("flex flex-col items-start p-6 gap-4", className)}>
      <div className="text-primary">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </Card>
  );
}
