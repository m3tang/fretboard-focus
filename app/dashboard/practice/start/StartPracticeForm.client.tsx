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
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  modules: z.string().array(),
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

const modules = [
  "Warmup",
  "Technique",
  "Scales",
  "Theory",
  "Rhythym",
  "Repertoire",
  "Sight Reading",
  "Improv",
];

export function InputForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "Practice #1",
      modules: modules.filter((m) => m !== "Sight Reading" && m !== "Improv"),
      duration: "30",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">
    //         {JSON.stringify(parsedData, null, 2)}
    //       </code>
    //     </pre>
    //   ),
    // });

    const sessionId = nanoid();

    usePracticeStore.getState().setSession({
      id: sessionId,
      name: data.name,
      duration: Number(data.duration),
      modules: data.modules,
      timePerModule: Math.floor(Number(data.duration) / data.modules.length),
      currentModuleIndex: 0,
      startTime: Date.now(),
    });

    router.push(`/dashboard/practice/active/${sessionId}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Practice #1" {...field} />
              </FormControl>
              <FormDescription>
                Used to identify prior sessions. Must be unique.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>

              {/* Number Input */}
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="30"
                  min={1}
                  max={180}
                />
              </FormControl>

              {/* Slider */}
              <FormControl>
                <Slider
                  max={180}
                  min={1}
                  step={1}
                  // Convert string -> number safely
                  value={[Number(field.value) || 1]}
                  onValueChange={(val) => field.onChange(String(val[0]))} // Convert number -> string
                  className="w-full"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modules</FormLabel>
              <FormDescription>
                Select one or more practice areas.
              </FormDescription>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  value={field.value || []}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-2"
                >
                  {modules.map((module) => {
                    const isSelected = field.value?.includes(module);
                    return (
                      <ToggleGroupItem
                        key={module}
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
