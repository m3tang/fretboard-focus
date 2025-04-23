import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0"></div>
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight">
                Master Your Guitar{" "}
                <span className="text-primary">Practice</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Generate dynamic practice routines, track your progress, and
                improve faster with our interactive tools and built-in
                metronome.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">
                    <PlayCircle className="mr-2 h-4 w-4" /> Watch Demo
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/3960095/pexels-photo-3960095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Guitarist practicing"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              How Fretboard Focus Helps You Improve
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our unique features are designed to accelerate your progress and
              make practice more effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Dynamic Practice Sessions"
              description="Generate personalized practice routines based on your skill level, available time, and goals."
            /> */}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Guitarists of all levels are improving faster with Fretboard
              Focus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <TestimonialCard
              quote="Since using this app, my practice sessions have become much more focused and productive. I've made more progress in 3 months than I did in the previous year."
              author="Michael Rodriguez"
              role="Intermediate Guitarist"
              avatarUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            /> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading">
            Ready to Transform Your Guitar Practice?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of guitarists who are making faster progress with
            structured, focused practice.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
