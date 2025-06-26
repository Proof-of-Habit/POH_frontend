// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Clock } from "lucide-react";

// function RecentLogs() {
//   {
//     /* Your Recent Logs */
//   }
//   return (
//     <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <Clock className="w-5 h-5 text-purple-600" />
//           <span>Your Recent Logs</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {recentLogs.length === 0 ? (
//           <div className="text-center py-8">
//             <div className="text-4xl mb-4">📝</div>
//             <p className="text-gray-600 mb-4">No logs yet!</p>
//             <Button onClick={handleStartHabit} variant="outline">
//               Create Your First Habit
//             </Button>
//           </div>
//         ) : (
//           recentLogs.slice(0, 3).map((log) => (
//             <div
//               key={log.id}
//               className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50/50"
//             >
//               <div className="text-2xl">{getHabitEmoji(log.habitTitle)}</div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-800">
//                   {log.habitTitle}
//                 </p>
//                 <p className="text-sm text-gray-600">{log.message}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {new Date(log.date).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </CardConte>
//     </Card>
//   );
// }

// export default RecentLogs;
