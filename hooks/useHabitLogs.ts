// useHabitLogs.ts
import { useEffect, useState } from "react";
import { fetchContentFromIPFS, useContractFetch } from "@/hooks/useBlockchain";
import { PROOFOFHABIT_ABI } from "@/app/abis/proof_of_habit_abi";
import toast from "react-hot-toast";

export function useHabitLogs(habitId: string | string[]) {
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [formattedLogs, setFormattedLogs] = useState<any[] | undefined>(
    undefined
  );

  const { readData: totalLogs } = useContractFetch(
    PROOFOFHABIT_ABI,
    "get_habit_log_count",
    [habitId]
  );

  const {
    readData: rawLogs,
    readIsLoading: isLoadingRawLogs,
    dataRefetch: refetchLogs,
    readRefetching: isRefetchingRawLogs,
  } = useContractFetch(PROOFOFHABIT_ABI, "get_habit_logs", [
    habitId,
    1,
    totalLogs,
  ]);

  useEffect(() => {
    async function fetchAndFormatLogs() {
      try {
        if (!rawLogs || !rawLogs.length) return;
        setIsLoadingLogs(true);

        const logInfoPromises = rawLogs.map((log: any) =>
          fetchContentFromIPFS(log.log_info)
        );
        const logInfo = await Promise.all(logInfoPromises);

        const merged = rawLogs
          .map((log: any, i: number) => ({
            ...logInfo[i],
            timestamp: log.timestamp,
            id: Number(log.id),
          }))
          .filter((log: any) => log.id !== 0);

        setFormattedLogs(merged);
      } catch (err) {
        toast.error("Error getting logs, Please refresh the page");
      } finally {
        setIsLoadingLogs(false);
      }
    }

    fetchAndFormatLogs();
  }, [rawLogs]);

  return {
    isLoadingLogs: isLoadingLogs || isRefetchingRawLogs || isLoadingRawLogs,
    totalLogs,
    formattedLogs,
    rawLogs,
    refetchLogs,
  };
}
