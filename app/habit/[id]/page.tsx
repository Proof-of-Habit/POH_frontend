"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import {
  Flame,
  Calendar,
  Target,
  Loader2,
  Camera,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useAccount } from "@starknet-react/core";

interface HabitLog {
  id: number;
  message: string;
  date: string;
  imageUri?: string;
}

interface Habit {
  id: number;
  title: string;
  description: string;
  streak: number;
  totalLogs: number;
  pictureUri?: string;
  canLogToday: boolean;
  logs: HabitLog[];
}

export default function HabitDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);
  const [showLogForm, setShowLogForm] = useState(
    searchParams.get("log") === "true"
  );
  const [logMessage, setLogMessage] = useState("");
  const [logImage, setLogImage] = useState<File | null>(null);

  useEffect(() => {
    // Mock habit data
    const mockHabit: Habit = {
      id: Number.parseInt(params.id as string),
      title: "Morning Workout",
      description: "30 minutes of exercise to start the day strong",
      streak: 15,
      totalLogs: 23,
      pictureUri: "/placeholder.svg?height=200&width=400",
      canLogToday: true,
      logs: [
        {
          id: 1,
          message: "Great HIIT session today! Feeling energized 💪",
          date: "2024-01-15",
          imageUri: "/placeholder.svg?height=300&width=300",
        },
        {
          id: 2,
          message: "Quick 20-minute yoga flow. Perfect way to start Monday!",
          date: "2024-01-14",
        },
        {
          id: 3,
          message:
            "Strength training focused on upper body. New PR on bench press! 🏋️‍♂️",
          date: "2024-01-13",
          imageUri: "/placeholder.svg?height=300&width=300",
        },
      ],
    };

    setTimeout(() => {
      setHabit(mockHabit);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogImage(file);
    }
  };

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logMessage.trim()) {
      toast.error("Please enter a message for your log");
      return;
    }

    setLogLoading(true);

    try {
      // Simulate image upload
      let imageUri = "";
      if (logImage) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        imageUri = `https://example.com/images/${Date.now()}.jpg`;
      }

      // Simulate onchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add new log to habit
      const newLog: HabitLog = {
        id: Date.now(),
        message: logMessage,
        date: new Date().toISOString().split("T")[0],
        imageUri: imageUri || undefined,
      };

      setHabit((prev) =>
        prev
          ? {
              ...prev,
              logs: [newLog, ...prev.logs],
              streak: prev.streak + 1,
              totalLogs: prev.totalLogs + 1,
              canLogToday: false,
            }
          : null
      );

      setLogMessage("");
      setLogImage(null);
      setShowLogForm(false);

      toast(
        `Success! 🎉 Streak updated to ${habit ? habit.streak + 1 : 0} days!`
      );
    } catch (error) {
      toast("Failed to submit log. Please try again.");
    } finally {
      setLogLoading(false);
    }
  };

  if (address) {
    return null;
  }

  if (loading) {
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Habit Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              {habit.pictureUri && (
                <div className="mb-4 md:mb-0">
                  <Image
                    src={habit.pictureUri || "/placeholder.svg"}
                    alt={habit.title}
                    width={200}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <CardTitle className="text-2xl">{habit.title}</CardTitle>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    <Flame className="w-4 h-4 mr-1" />
                    {habit.streak}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{habit.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{habit.totalLogs} total logs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Started tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Log Form */}
        {habit.canLogToday && (
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Log Today's Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showLogForm ? (
                <form onSubmit={handleSubmitLog} className="space-y-4">
                  <Textarea
                    placeholder="How did your habit go today? Share your thoughts, challenges, or wins..."
                    value={logMessage}
                    onChange={(e) => setLogMessage(e.target.value)}
                    className="bg-white border-purple-200 focus:border-purple-400 min-h-[100px]"
                  />

                  <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 text-center hover:border-purple-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="log-image"
                    />
                    <label htmlFor="log-image" className="cursor-pointer">
                      <Camera className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {logImage ? logImage.name : "Add a photo (optional)"}
                      </p>
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowLogForm(false)}
                      className="bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={logLoading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      {logLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Log"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Ready to log today's progress?
                  </p>
                  <Button
                    onClick={() => setShowLogForm(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Log Today
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
          <CardHeader>
            <CardTitle>Progress Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {habit.logs.map((log, index) => (
                <div key={log.id} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0 ? "bg-green-500" : "bg-purple-400"
                      }`}
                    />
                    {index < habit.logs.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        {new Date(log.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{log.message}</p>
                    {log.imageUri && (
                      <Image
                        src={log.imageUri || "/placeholder.svg"}
                        alt="Log image"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
