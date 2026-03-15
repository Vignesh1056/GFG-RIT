import { createClient } from "./client"

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  branch: string | null
  year: string | null
  roll_number: string | null
  avatar_url: string | null
  created_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) return null
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createClient()
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)

  return { error }
}
