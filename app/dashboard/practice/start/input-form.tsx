"use client";

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
import { nanoid } from "nanoid";
import { ModuleName, MODULES } from "@/types/modules"; // Make sure you import this

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
    {
      message: "Duration must be an integer between 1 and 180",
    }
  ),
});

// Correct module names here
const modules = MODULES;

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "Practice #1",
      modules: ["Warmup", "Technique", "Scales"],
      duration: "60",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const sessionId = nanoid();
    const selectedModules = data.modules as ModuleName[];
    const totalDuration = Number(data.duration);

    const durationPerModule = Math.floor(
      totalDuration / selectedModules.length
    );

    const builtModules = selectedModules.map((module) => ({
      module,
      duration: durationPerModule,
    }));

    usePracticeStore.getState().setSession({
      id: sessionId,
      name: data.name,
      duration: totalDuration,
      modules: builtModules,
      startTime: Date.now(),
      currentModuleIndex: 0,
    });

    usePracticeStore.getState().setStatus("preview");
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
                    onChange={field.onChange}
                    placeholder="60"
                    max={180}
                    className="w-auto"
                  />
                </FormControl>
                <FormDescription>minutes</FormDescription>
              </div>

              {/* Slider */}
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
                  {modules.map((module, idx) => {
                    const isSelected = field.value?.includes(module);
                    return (
                      <ToggleGroupItem
                        key={idx}
                        value={module}
                        className={
                          !isSelected
                            ? "border border-muted text-muted-foreground"
                            : ""
                        }
                      >
                        {module}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
