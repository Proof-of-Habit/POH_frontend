import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Target } from "lucide-react";
import { RefreshButton } from "./refresh-button";
import Image from "next/image";

function HabitHeader({
  habit,
  refetchHabitDetails,
  loading,
}: {
  habit: any;
  loading: boolean;
  refetchHabitDetails: () => void;
}) {
  const image =
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}${habit.image.slice(
      7,
      -1
    )}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}` ||
    "/default-image.webp";

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-100 mb-8">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
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
          <RefreshButton onRefresh={refetchHabitDetails} />
        </div>
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
      </CardHeader>
    </Card>
  );
}

export default HabitHeader;
