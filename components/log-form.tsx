import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Camera, Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateLog } from "@/hooks/useCreateLog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import ButtonContent from "./button-content";

function LogForm({
  canLogToday,
  showLogForm,
  setShowLogForm,
  id,
  isLoadingLogs,
}: {
  canLogToday: boolean;
  showLogForm: boolean;
  setShowLogForm: React.Dispatch<React.SetStateAction<boolean>>;
  id: string | string[];
  isLoadingLogs: boolean;
}) {
  const {
    logImage,
    setLogImage,
    logMessage,
    setLogMessage,
    isLogging,
    handleSubmit,
  } = useCreateLog(id, setShowLogForm);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogImage(file);
    }
  };

  return (
    <div>
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
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await handleSubmit();
                    toast.success("Log submitted!");
                    setShowLogForm(false);
                  } catch (err: any) {
                    toast.error(err.message || "Something went wrong");
                  }
                }}
                className="space-y-4"
              >
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
                      {logImage ? logImage.name : "Add a photo"}
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
                    disabled={isLoadingLogs || isLogging}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    {isLoadingLogs ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading Habits...
                      </>
                    ) : (
                      <ButtonContent
                        loading={isLogging}
                        defaultString="Submit Log"
                        loadingString="Logging Entry"
                      />
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
    </div>
  );
}

export default LogForm;
