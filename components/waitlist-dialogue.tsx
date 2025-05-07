"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export function WaitlistDialog() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      alert(`Something went wrong: ${error.message}`);
    } else {
      setSubmitted(true);
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          Join the waitlist <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
          <DialogDescription>
            Be the first to know when we launch. Just drop your email and we’ll
            keep you updated.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <p className="text-sm text-green-600">Thanks! You're on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Joining..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
