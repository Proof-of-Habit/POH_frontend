"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { PROOFOFHABIT_ABI } from "@/app/abis/proof_of_habit_abi";
import {
  fetchContentFromIPFS,
  useContractFetch,
  useContractWriteUtility,
} from "@/hooks/useBlockchain";
import { BEARER_TOKEN } from "@/lib/utils";

export default function HabitDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [logInfoUri, setLogInfoUri] = useState("");
  const [showLogForm, setShowLogForm] = useState(
    searchParams.get("log") === "true"
  );
  const [logMessage, setLogMessage] = useState("");
  const [logImage, setLogImage] = useState<File | null>(null);
  const router = useRouter();
  const [habit, setHabit] = useState<any | undefined>(undefined);
  const [formattedHabitLogs, setFormattedHabitLogs] = useState<any | undefined>(
    undefined
  );
  const [isLogging, setIsLogging] = useState(false);
  const {
    writeAsync: handleCreateLog,
    writeIsPending,
    waitIsLoading,
    waitStatus,
  } = useContractWriteUtility(
    "log_entry",
    [params.id, logInfoUri],
    PROOFOFHABIT_ABI
  );
  const { readData: contractHabits, readIsLoading: isLoadingContractHabits } =
    useContractFetch(PROOFOFHABIT_ABI, "get_user_habits", [address]);
  const { readData: totalLogs, readIsLoading: isLoadingTotalLogs } =
    useContractFetch(PROOFOFHABIT_ABI, "get_habit_log_count", [params.id]);

  const { readData: habitLogs, readIsLoading: isLoadingHabitLogs } =
    useContractFetch(PROOFOFHABIT_ABI, "get_habit_logs", [
      params.id,
      1,
      totalLogs,
    ]);
  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    async function fetchHabitsInfo() {
      try {
        setLoading(true);
        if (!contractHabits || !contractHabits.length) return;

        console.log(contractHabits, "contract habits");

        const [filteredHabit] = contractHabits.filter(
          (habit: any) => Number(habit?.id) === Number(params.id)
        );
        const habitInfo = await fetchContentFromIPFS(filteredHabit.info);

        const merged = {
          ...habitInfo,
          streak_count: filteredHabit.streak_count,
          total_log_count: filteredHabit.total_log_count,
          id: Number(filteredHabit.id),
          last_log_at: filteredHabit.last_log_at,
        };

        console.log(merged);
        setHabit(merged);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHabitsInfo();
  }, [address, router, contractHabits]);

  useEffect(() => {
    async function fetchLogInfo() {
      if (!habit || !habitLogs) return;

      console.log(habitLogs);

      const logInfoPromises = habitLogs.map((habit: any) =>
        fetchContentFromIPFS(habit.log_info)
      );
      const logInfo: any = await Promise.all(logInfoPromises);

      const merged = habitLogs
        .map((logEntry: any, i: number) => ({
          ...logInfo[i],
          timestamp: logEntry.timestamp,
          id: Number(logEntry.id),
        }))
        .filter((entry: any) => entry.id !== 0);

      console.log(merged);
      setFormattedHabitLogs(merged);
    }

    fetchLogInfo();
  }, [habitLogs]);

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

    setIsLogging(true);

    try {
      if (!logImage) {
        alert("No Image selected");
        return;
      }
      const ImageData = new FormData();
      ImageData.append("file", logImage);

      const image_upload_res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          body: ImageData,
        }
      );

      const image_upload_resData = await image_upload_res.json();

      console.log(image_upload_res, "finished uploading image");

      console.log("started uploading URI");
      let log_metadata = JSON.stringify({
        id: Date.now() + Math.floor(Math.random() * 1000),
        image: `ipfs://${image_upload_resData.IpfsHash}/`,
        message: logMessage,
        created_at: new Date(),
      });

      const metadata_upload_res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          body: log_metadata,
        }
      );

      const metadata_upload_resData = await metadata_upload_res.json();
      setLogInfoUri(metadata_upload_resData.IpfsHash);

      console.log(metadata_upload_resData, "finished uploading metadata");

      handleCreateLog();

      if (waitStatus === "success") {
        setLogMessage("");
        setLogImage(null);
        setShowLogForm(false);

        toast(
          `Success! 🎉 Streak updated to ${
            habit ? habit.streak_count + 1 : 0
          } days!`
        );
      }
    } catch (error) {
      toast("Failed to submit log. Please try again.");
    } finally {
      setIsLogging(false);
    }
  };

  if (!address) {
    return null;
  }

  if (loading || isLoadingContractHabits) {
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
  const image =
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}${habit.image.slice(
      7,
      -1
    )}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}` ||
    "/default-image.webp";

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

  const buttonContent = () => {
    if (writeIsPending) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Send...
        </>
      );
    }

    if (waitIsLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Waiting for confirmation...
        </>
      );
    }

    if (waitStatus === "error") {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Transaction Rejected...
        </>
      );
    }

    if (waitStatus === "success") {
      return "Transaction confirmed";
    }

    return "Submit Log";
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Habit Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              {habit.image && (
                <div className="mb-4 md:mb-0">
                  <Image
                    loader={() => image}
                    src={image}
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
                    {Number(habit.streak_count)}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{habit.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{Number(habit.total_log_count)} total logs</span>
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
        {canLogToday && (
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Log Today's Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showLogForm ? (
                // TODO: Handle log submit
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
                      disabled={isLoadingHabitLogs || isLogging}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      {isLoadingHabitLogs ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading Habits...
                        </>
                      ) : (
                        buttonContent()
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
          {/* TODO: Handle log display */}
          <CardContent>
            <div className="space-y-6">
              {formattedHabitLogs?.map((log: any, index: number) => {
                let logImage =
                  `${
                    process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
                  }${habit.image.slice(7, -1)}?pinataGatewayToken=${
                    process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN
                  }` || "/default-image.webp";
                return (
                  <div key={log.id} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? "bg-green-500" : "bg-purple-400"
                        }`}
                      />
                      {index < habitLogs.length - 1 && (
                        <div className="w-px h-16 bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          {new Date(
                            Number(habit.last_log_at) * 1000
                          ).toLocaleDateString("en-US", {
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
                      {log.image && (
                        <Image
                          src={logImage}
                          loader={() => logImage}
                          alt="Log image"
                          width={300}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
