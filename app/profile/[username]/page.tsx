"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Flame, Target, Calendar, ExternalLink } from "lucide-react";

interface UserHabit {
  id: number;
  title: string;
  streak: number;
  totalLogs: number;
  isPublic: boolean;
}

interface UserProfile {
  username: string;
  walletAddress: string;
  joinDate: string;
  totalHabits: number;
  totalLogs: number;
  longestStreak: number;
  habits: UserHabit[];
}

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock profile data
    const mockProfile: UserProfile = {
      username: params.username as string,
      walletAddress: "0x1234...5678",
      joinDate: "2024-01-01",
      totalHabits: 5,
      totalLogs: 127,
      longestStreak: 42,
      habits: [
        {
          id: 1,
          title: "Morning Workout",
          streak: 15,
          totalLogs: 23,
          isPublic: true,
        },
        {
          id: 2,
          title: "Daily Reading",
          streak: 8,
          totalLogs: 12,
          isPublic: true,
        },
        {
          id: 3,
          title: "Meditation",
          streak: 3,
          totalLogs: 5,
          isPublic: false,
        },
        {
          id: 4,
          title: "Journaling",
          streak: 42,
          totalLogs: 67,
          isPublic: true,
        },
        {
          id: 5,
          title: "Language Learning",
          streak: 12,
          totalLogs: 20,
          isPublic: true,
        },
      ],
    };

    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Profile not found
          </h1>
          <p className="text-gray-600">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const publicHabits = profile.habits.filter((habit) => habit.isPublic);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  @{profile.username}
                </h1>
                <p className="text-gray-600 text-sm mb-2">
                  {profile.walletAddress}
                </p>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(profile.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {profile.totalHabits}
              </div>
              <p className="text-gray-600">Total Habits</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {profile.totalLogs}
              </div>
              <p className="text-gray-600">Total Logs</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-3xl font-bold text-orange-600">
                  {profile.longestStreak}
                </span>
              </div>
              <p className="text-gray-600">Longest Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Public Habits */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Public Habits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {publicHabits.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔒</div>
                <p className="text-gray-600">
                  This user hasn't made any habits public yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="p-4 rounded-lg bg-purple-50/50 border border-purple-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {habit.title}
                      </h3>
                      <Badge variant="secondary">
                        <Flame className="w-3 h-3 mr-1" />
                        {habit.streak}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>{habit.totalLogs} logs</span>
                      </div>
                      <Link href={`/habit/${habit.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
