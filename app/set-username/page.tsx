"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { User, Loader2, CheckIcon, XIcon } from "lucide-react";
import { useAccount } from "@starknet-react/core";

export default function SetUsernamePage() {
  const { address } = useAccount();
  //   TODO: Fetch username form contract
  const [username, setUsername] = useState("Oshioke");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  if (!address) {
    router.push("/");
    return null;
  }

  if (username) {
    router.push(`/profile/${username}`);
    return null;
  }

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);

    // Simulate API call to check username availability
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock availability check (some usernames are "taken")
    const takenUsernames = ["admin", "test", "user", "alice", "bob"];
    const available = !takenUsernames.includes(username.toLowerCase());

    setIsAvailable(available);
    setIsChecking(false);
  };

  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric characters and underscores
    const sanitized = value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    setInputUsername(sanitized);

    if (sanitized !== value) {
      toast.error(
        "Username can only contain letters, numbers, and underscores"
      );
    }

    checkUsernameAvailability(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputUsername.trim() || inputUsername.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    if (!isAvailable) {
      toast("Please choose an available username");
      return;
    }

    setLoading(true);

    try {
      // Simulate onchain transaction to set username
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUsername(inputUsername);

      toast.success("Success! 🎉 Your username has been set");

      router.push(`/profile/${inputUsername}`);
    } catch (error) {
      toast.error("Failed to set username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Set Your Username
          </h1>
          <p className="text-gray-600">
            Choose a unique username for your profile
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <span>Username Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={inputUsername}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="bg-white border-purple-200 focus:border-purple-400 pr-10"
                    maxLength={20}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isChecking ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : isAvailable === true ? (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : isAvailable === false ? (
                      <XIcon className="w-4 h-4 text-red-500" />
                    ) : null}
                  </div>
                </div>
                {inputUsername.length > 0 && (
                  <div className="text-sm">
                    {isAvailable === true && (
                      <p className="text-green-600">✓ Username is available</p>
                    )}
                    {isAvailable === false && (
                      <p className="text-red-600">
                        ✗ Username is already taken
                      </p>
                    )}
                    {inputUsername.length < 3 && (
                      <p className="text-gray-500">
                        Username must be at least 3 characters
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Username Rules:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 3-20 characters long</li>
                  <li>• Letters, numbers, and underscores only</li>
                  <li>• Cannot be changed once set</li>
                  <li>• Must be unique across the platform</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading || !isAvailable || inputUsername.length < 3}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting Username...
                  </>
                ) : (
                  "Set Username"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Your username will be stored permanently on the Starknet
                blockchain and cannot be changed
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
