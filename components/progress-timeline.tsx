import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshButton } from "./refresh-button";
import Image from "next/image";

function ProgressTimeline({
  refetchLogs,
  isLoadingLogs,
  formattedLogs,
  habit,
  logsLength,
}: {
  refetchLogs: () => void;
  formattedLogs: any;
  isLoadingLogs: boolean;
  habit: any;
  logsLength: number;
}) {
  if (isLoadingLogs) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!logsLength) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 text-center py-12">
        <CardContent>
          <div className="text-6xl mb-4">🔥</div>
          <h3 className="text-xl font-semibold mb-2">No logs yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first log to start your streak
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Progress Timeline</CardTitle>
          <RefreshButton onRefresh={refetchLogs} />
        </div>
      </CardHeader>
      {/* TODO: Handle log display */}
      <CardContent>
        <div className="space-y-6">
          {formattedLogs?.map((log: any, index: number) => {
            let logImage =
              `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}${habit.image.slice(
                7,
                -1
              )}?pinataGatewayToken=${
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
                  {index < logsLength - 1 && (
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
  );
}

export default ProgressTimeline;
