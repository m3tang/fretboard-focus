import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

type NewExerciseInput = {
  name: string;
  description: string;
  modules: string[];
};

export async function saveNewExerciseToDb(input: NewExerciseInput) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const newExercise = {
    id: uuidv4(),
    name: input.name,
    description: input.description,
    modules: input.modules,
    user_id: user.id,
    is_custom: true,
  };

  const { error } = await supabase.from("exercises").insert(newExercise);

  if (error) {
    throw new Error(error.message);
  }

  return newExercise.id;
}
