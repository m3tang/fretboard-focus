"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { fetchModules } from "@/utils/data/fetchModules";
import { useEffect, useState } from "react";
import { Module } from "@/types/modules";
import { Checkbox } from "@/components/ui/checkbox";
import { saveNewExerciseToDb } from "@/utils/data/saveNewExerciseToDb";

type Props = {
  onCreate?: () => void;
};

export function NewExerciseForm({ onCreate }: Props) {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    async function loadModules() {
      const data = await fetchModules();
      setModules(data);
    }
    loadModules();
  }, []);

  const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
    instructions: z.string().min(2).max(50),
    modules: z.array(z.string()).min(1, "Select at least one module"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      modules: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await saveNewExerciseToDb({
        name: values.name,
        description: values.description,
        modules: values.modules,
      });

      form.reset();
      onCreate?.(); // call parent handler
    } catch (err) {
      console.error("Failed to save exercise:", err);
    }
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
                <Input placeholder="Enter the exercise name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a description for this exercise"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Input
                  placeholder="How do you complete this exercise?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MULTI-SELECT CHECKBOX FIELD */}
        <FormField
          control={form.control}
          name="modules"
          render={() => (
            <FormItem>
              <FormLabel>Practice areas</FormLabel>
              <FormDescription>Select one or more.</FormDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 pt-4">
                {modules.map((mod) => (
                  <FormField
                    key={mod.id}
                    control={form.control}
                    name="modules"
                    render={({ field }) => {
                      const isChecked =
                        Array.isArray(field.value) &&
                        field.value.includes(mod.id);
                      return (
                        <FormItem
                          key={mod.id}
                          className="flex flex-row items-start space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (!Array.isArray(field.value)) return;
                                if (checked) {
                                  field.onChange([...field.value, mod.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter((v) => v !== mod.id)
                                  );
                                }
                              }}
                              id={`module-${mod.id}`}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`module-${mod.id}`}
                            className="font-normal"
                          >
                            {mod.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
