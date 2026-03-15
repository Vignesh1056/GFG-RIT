import { createClient } from "./client"

export async function getSolvedProblemIds(userId: string): Promise<Set<number>> {
  const supabase = createClient()
  const { data } = await supabase
    .from("solved_problems")
    .select("problem_id")
    .eq("user_id", userId)

  return new Set((data ?? []).map((r) => r.problem_id))
}

export async function markSolved(userId: string, problemId: number) {
  const supabase = createClient()
  await supabase
    .from("solved_problems")
    .upsert({ user_id: userId, problem_id: problemId }, { onConflict: "user_id,problem_id" })
}

export async function unmarkSolved(userId: string, problemId: number) {
  const supabase = createClient()
  await supabase
    .from("solved_problems")
    .delete()
    .eq("user_id", userId)
    .eq("problem_id", problemId)
}
