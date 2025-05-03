"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { fetchModules } from "@/utils/data/fetchModules";
import { Module } from "@/types/modules";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  modules: z.string().array().min(1, { message: "Select at least one module" }),
  duration: z.string().refine(
    (val) => {
      const n = Number(val);
      return !isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 180;
    },
    { message: "Duration must be an integer between 1 and 180" }
  ),
});

export function InputForm() {
  const [modules, setModules] = useState<Module[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchModules().then(setModules);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "Practice #1",
      modules: [],
      duration: "60",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const sessionId = crypto.randomUUID();
    const selectedModules = data.modules;
    const durationMinutes = Number(data.duration);
    const durationSeconds = durationMinutes * 60;

    const builtModules = selectedModules.map((mod, index) => ({
      id: crypto.randomUUID(),
      module: mod,
      weight: 1,
      orderIndex: index,
      exercises: [],
      computedDuration: 0,
    }));

    usePracticeStore.getState().setSession({
      id: sessionId,
      userId: "",
      name: data.name,
      duration: durationSeconds,
      modules: builtModules,
      startTime: Date.now(),
      currentModuleIndex: 0,
      currentExerciseIndex: 0,
    });

    usePracticeStore.getState().setStatus("preview");
    router.push(`/dashboard/practice/preview/${sessionId}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Name</FormLabel>
              <FormControl>
                <Input placeholder="Practice #1" {...field} />
              </FormControl>
              <FormDescription>
                Name your session to track your history.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modules */}
        <FormField
          control={form.control}
          name="modules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Practice Modules</FormLabel>
              <FormDescription>
                Select 1 or more areas to focus on.
              </FormDescription>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  value={field.value || []}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-2"
                >
                  {modules.map((mod) => {
                    const isSelected = field.value?.includes(mod.name);
                    return (
                      <ToggleGroupItem
                        key={mod.id}
                        value={mod.name}
                        className={
                          !isSelected
                            ? "border border-muted text-muted-foreground"
                            : ""
                        }
                      >
                        {mod.name}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Duration</FormLabel>
              <div className="flex flex-row items-center gap-2">
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="60"
                    max={180}
                    className="w-auto"
                  />
                </FormControl>
                <FormDescription>minutes</FormDescription>
              </div>
              <FormControl>
                <Slider
                  max={180}
                  step={5}
                  value={[Number(field.value) || 1]}
                  onValueChange={(val) => field.onChange(String(val[0]))}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
