"use client";

import type React from "react";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import { useHabitDetails } from "@/hooks/useHabitDetails";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import ProgressTimeline from "@/components/progress-timeline";
import LogForm from "@/components/log-form";
import HabitHeader from "@/components/habit-header";

export default function HabitDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const [showLogForm, setShowLogForm] = useState<boolean>(
    searchParams.get("log") === "true"
  );
  const {
    habit,
    loading: habitLoading,
    refetchHabitDetails,
  } = useHabitDetails(address, params.id);
  const { formattedLogs, isLoadingLogs, rawLogs, refetchLogs } = useHabitLogs(
    params.id
  );

  if (!address) {
    return null;
  }

  if (habitLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Habit not found
          </h1>
          <p className="text-gray-600">
            The habit you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }
  const canLogToday = (() => {
    if (!habit.last_log_at) return true;

    const lastLogDate = new Date(Number(habit.last_log_at) * 1000);
    const now = new Date();

    // Compare calendar days
    const isDifferentDay =
      now.getFullYear() !== lastLogDate.getFullYear() ||
      now.getMonth() !== lastLogDate.getMonth() ||
      now.getDate() !== lastLogDate.getDate();

    return isDifferentDay;
  })();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Habit Header */}
        <HabitHeader
          habit={habit}
          refetchHabitDetails={refetchHabitDetails}
          loading={habitLoading}
        />

        {/* Log Form */}
        <LogForm
          canLogToday={canLogToday}
          showLogForm={showLogForm}
          setShowLogForm={setShowLogForm}
          id={params.id}
          isLoadingLogs={isLoadingLogs}
        />

        {/* Progress timeline */}
        <ProgressTimeline
          refetchLogs={refetchLogs}
          isLoadingLogs={isLoadingLogs}
          formattedLogs={formattedLogs}
          habit={habit}
          logsLength={rawLogs?.length}
        />
      </div>
    </div>
  );
}
