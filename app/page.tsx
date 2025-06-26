"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { WalletConnectModal } from "@/components/wallet-connect-modal";
import { useAccount } from "@starknet-react/core";
import { mockHabits, mockLogs } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useContractFetch } from "@/hooks/useBlockchain";
import { PROOFOFHABIT_ABI } from "./abis/proof_of_habit_abi";
import { da } from "date-fns/locale";
import { shortString } from "starknet";
import { useUserHabits } from "@/hooks/useUserHabits";
import { RefreshButton } from "@/components/refresh-button";

// Helper: return an emoji that matches a habit title
function getHabitEmoji(title: string) {
  const lower = title.toLowerCase();
  if (
    lower.includes("workout") ||
    lower.includes("exercise") ||
    lower.includes("gym")
  )
    return "💪";
  if (lower.includes("read") || lower.includes("book")) return "📚";
  if (lower.includes("meditat") || lower.includes("mindful")) return "🧘‍♀️";
  if (lower.includes("water") || lower.includes("drink")) return "💧";
  if (lower.includes("sleep") || lower.includes("wake")) return "😴";
  if (lower.includes("journal") || lower.includes("write")) return "✍️";
  return "🎯";
}

export default function HomePage() {
  const { address } = useAccount();
  const router = useRouter();
  const recentLogs = mockLogs;
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { readData, dataRefetch, readIsLoading } = useContractFetch(
    PROOFOFHABIT_ABI,
    "get_user_name",
    ["0x07af08dad44af4f7461979294f7eff8d3617c27c7c3e3f8222fd2a871517e719"]
  );
  const {
    habits,
    isLoading: isLoadingHabits,
    refetchContractHabits,
  } = useUserHabits(address);

  useEffect(() => {
    if (!readData) return;
    console.log(shortString.decodeShortString(readData), "read data");
    console.log(readIsLoading, "loading read data");
    dataRefetch();
  }, [readData, readIsLoading]);

  // Get user's longest streaks from their habits
  const longestStreaks = habits
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 4)
    .map((habit) => ({
      habit: habit.title,
      streak: Number(habit.streak_count),
      avatar: "🎯",
    }));

  const handleStartHabit = () => {
    if (address) {
      router.push("/create");
    } else {
      setShowWalletModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10" />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="animate-bounce-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Build better habits.
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                One onchain log at a time. 🚀
              </p>
            </div>

            <div className="animate-slide-up">
              <Button
                onClick={handleStartHabit}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full animate-pulse-glow"
              >
                Start a Habit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-800">Track Onchain</h3>
                <p className="text-sm text-gray-600">
                  Your habits are stored permanently on Starknet
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="font-semibold text-gray-800">Build Streaks</h3>
                <p className="text-sm text-gray-600">
                  Maintain consistency and watch your streaks grow
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold text-gray-800">Compete</h3>
                <p className="text-sm text-gray-600">
                  See how you rank against other habit builders
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Feeds */}
        {/* Personal Dashboard or Welcome */}
        <section className="py-16 px-4 bg-white/30">
          <div className="max-w-6xl mx-auto">
            {address ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Your Habit Journey 🌟
                  </h2>
                  <p className="text-gray-600">
                    Keep building those amazing habits!
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {/* Your Best Streaks */}
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-100 w-full lg:w-[60%] mx-auto">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Trophy className="w-5 h-5 text-yellow-600" />
                          <span>Your Best Streaks</span>
                        </CardTitle>
                        <RefreshButton onRefresh={refetchContractHabits} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingHabits ? (
                        <div className="flex justify-center h-full items-center">
                          <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                        </div>
                      ) : habits.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-4">🏆</div>
                          <p className="text-gray-600 mb-4">
                            Start building streaks!
                          </p>
                          <Button onClick={handleStartHabit} variant="outline">
                            Create Your First Habit
                          </Button>
                        </div>
                      ) : (
                        longestStreaks.map((streak, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50/50"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="text-2xl">{streak.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">
                                {streak.habit}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span className="font-bold text-lg">
                                  {streak.streak}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">days</p>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Why Proof of Habit? 🤔
                  </h2>
                  <p className="text-gray-600">
                    Build lasting habits with blockchain accountability
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center p-6">
                    <div className="text-4xl mb-4">🔗</div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Permanent Records
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your progress is stored forever on Starknet blockchain
                    </p>
                  </Card>
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center p-6">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      True Accountability
                    </h3>
                    <p className="text-sm text-gray-600">
                      No cheating - every log is cryptographically verified
                    </p>
                  </Card>
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center p-6">
                    <div className="text-4xl mb-4">🏆</div>
                    <h3 className="font-semibent text-gray-800 mb-2">
                      Own Your Data
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your habits belong to you, not a centralized platform
                    </p>
                  </Card>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {address ? (
              <>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  Ready for your next habit? 🚀
                </h2>
                <p className="text-gray-600 mb-8">
                  You're doing great! Keep the momentum going by adding another
                  habit to track.
                </p>
                <Button
                  onClick={handleStartHabit}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full"
                >
                  Create Another Habit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  Ready to build your first habit? 🌟
                </h2>
                <p className="text-gray-600 mb-8">
                  Start your journey to better habits with the power of
                  blockchain accountability.
                </p>
                <Button
                  onClick={handleStartHabit}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full"
                >
                  Connect Wallet to Start
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </section>
      </div>

      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
}
