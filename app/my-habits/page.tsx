"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Flame, Calendar, Clock, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import { RefreshButton } from "@/components/refresh-button";
import { canLogTodayFromEpoch, getTimeUntilNextLog } from "@/lib/utils";
import { useUserHabits } from "@/hooks/useUserHabits";

interface Habit {
  id: number;
  title: string;
  description: string;
  streak: number;
  totalLogs: number;
  lastLogTime: string | null;
  canLogToday: boolean;
  pictureUri?: string;
}

export default function MyHabitsPage() {
  const { address } = useAccount();
  const { habits, isLoading, refetchContractHabits } = useUserHabits(address);

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Habits</h1>
            <p className="text-gray-600">
              Track your progress and build consistency
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <RefreshButton onRefresh={() => refetchContractHabits()} showText />
            <Link href="/create">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Habit
              </Button>
            </Link>
          </div>
        </div>

        {habits.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first habit to start building consistency
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Habit
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit: any) => {
              const timeUntilNext = getTimeUntilNextLog(habit.lastLogTime);

              return (
                <Card
                  key={habit.id}
                  className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {habit.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {habit.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        <Flame className="w-3 h-3 mr-1" />
                        {Number(habit.streak_count)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>
                            Total logs: {Number(habit.total_log_count)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {habit.lastLogTime
                              ? new Date(habit.lastLogTime).toLocaleDateString()
                              : "Never"}
                          </span>
                        </div>
                      </div>

                      {timeUntilNext && (
                        <div className="flex items-center space-x-1 text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          <Clock className="w-4 h-4" />
                          <span>Next log in {timeUntilNext}</span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Link href={`/habit/${habit.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full bg-white text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            View Details
                          </Button>
                        </Link>
                        {canLogTodayFromEpoch(habit.last_log_at) && (
                          <Link href={`/habit/${habit.id}?log=true`}>
                            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                              Log Today
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
