"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Upload, Loader2, Target } from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { BEARER_TOKEN, myProvider } from "@/lib/utils";
import { POH_CONTRACT_ADDRESS } from "@/hooks/useBlockchain";
import { CallData } from "starknet";

export default function CreateHabitPage() {
  const { address, account } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picture: null as File | null,
  });

  if (!address) {
    router.push("/");
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, picture: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) return;

    if (!formData.title.trim()) {
      toast.error("Please enter a habit title.");
      return;
    }

    try {
      setLoading(true);

      if (!formData.picture) {
        alert("No Image selected");
        return;
      }
      const ImageData = new FormData();
      ImageData.append("file", formData.picture);

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
      let habit_metadata = JSON.stringify({
        id: Date.now() + Math.floor(Math.random() * 1000),
        image: `ipfs://${image_upload_resData.IpfsHash}/`,
        title: formData.title,
        description: formData.description,
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
          body: habit_metadata,
        }
      );

      const metadata_upload_resData = await metadata_upload_res.json();

      console.log(metadata_upload_resData, "finished uploading metadata");

      const result = await account.execute({
        contractAddress: POH_CONTRACT_ADDRESS,
        entrypoint: "create_habit",
        calldata: CallData.compile({
          infoUid: metadata_upload_resData.IpfsHash,
        }),
      });

      const status = await myProvider.waitForTransaction(
        result.transaction_hash
      );

      if (status.isSuccess()) {
        toast.success("Success! 🎉 Your habit has been created.");
        router.push("/my-habits");
      }
    } catch (error) {
      toast.error("Failed to create habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const buttonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating Habit...
        </>
      );
    }

    return "Create Habit";
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create New Habit
          </h1>
          <p className="text-gray-600">
            Start building consistency with a new habit
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Habit Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Habit Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Morning Workout, Daily Reading, Meditation"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-white border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your habit and what you want to achieve..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white border-purple-200 focus:border-purple-400 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="picture">Habit Picture (Optional)</Label>
                <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:border-purple-300 transition-colors">
                  <input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="picture" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {formData.picture
                        ? formData.picture.name
                        : "Click to upload an image"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
              >
                {buttonContent()}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Your habit will be stored permanently on the Starknet blockchain
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
