// lib/auth.ts
import { createClient } from "@/utils/supabase/server"; // should wrap createServerComponentClient
import { type User } from "@supabase/supabase-js";

export async function getCurrentUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User not authenticated");
  }

  return user;
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user.id;
}
