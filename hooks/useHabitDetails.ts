// useHabitDetails.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchContentFromIPFS, useContractFetch } from "@/hooks/useBlockchain";
import { PROOFOFHABIT_ABI } from "@/app/abis/proof_of_habit_abi";

export function useHabitDetails(
  address: string | undefined,
  habitId: string | string[]
) {
  const [habit, setHabit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    readData: contractHabits,
    dataRefetch: refetchHabitDetails,
    readIsLoading: isLoadingHabits,
    readRefetching: isRefetchingHabits,
  } = useContractFetch(PROOFOFHABIT_ABI, "get_user_habits", [address]);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    async function fetchHabitInfo() {
      try {
        setLoading(true);
        if (!contractHabits || contractHabits.length === 0) return;

        const filtered = contractHabits.find(
          (habit: any) => Number(habit.id) === Number(habitId)
        );
        if (!filtered) return;

        const habitInfo = await fetchContentFromIPFS(filtered.info);

        const merged = {
          ...habitInfo,
          streak_count: filtered.streak_count,
          total_log_count: filtered.total_log_count,
          id: Number(filtered.id),
          last_log_at: filtered.last_log_at,
        };

        setHabit(merged);
      } catch (err) {
        console.error("Failed to fetch habit info:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHabitInfo();
  }, [address, contractHabits, habitId]);

  return {
    habit,
    loading: isLoadingHabits || loading || isRefetchingHabits,
    refetchHabitDetails,
  };
}
