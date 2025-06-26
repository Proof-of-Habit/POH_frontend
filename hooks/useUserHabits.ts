import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchContentFromIPFS, useContractFetch } from "@/hooks/useBlockchain";
import { PROOFOFHABIT_ABI } from "@/app/abis/proof_of_habit_abi";

export function useUserHabits(address: string | undefined) {
  const [habits, setHabits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    readData: contractHabits,
    readIsLoading: isLoadingContractHabits,
    dataRefetch: refetchContractHabits,
    readRefetching: isRefetchContractHabits,
  } = useContractFetch(PROOFOFHABIT_ABI, "get_user_habits", [address]);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    async function fetchHabitsInfo() {
      try {
        setIsLoading(true);
        if (!contractHabits || contractHabits.length === 0) return;

        const habitPromises = contractHabits.map((habit: any) =>
          fetchContentFromIPFS(habit.info)
        );
        const habitInfo: any = await Promise.all(habitPromises);

        const merged = contractHabits.map((habit: any, i: number) => ({
          ...habitInfo[i],
          streak_count: habit.streak_count,
          total_log_count: habit.total_log_count,
          id: Number(habit.id),
          last_log_at: habit.last_log_at,
        }));

        setHabits(merged);
      } catch (err) {
        console.error("Failed to fetch habits:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHabitsInfo();
  }, [address, contractHabits]);

  return {
    habits,
    isLoading: isLoading || isLoadingContractHabits || isRefetchContractHabits,
    refetchContractHabits,
  };
}
