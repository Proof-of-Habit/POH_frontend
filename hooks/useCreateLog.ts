// useCreateLog.ts
import { useState } from "react";
import { POH_CONTRACT_ADDRESS } from "@/hooks/useBlockchain";
import { BEARER_TOKEN, myProvider } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAccount } from "@starknet-react/core";
import { CallData } from "starknet";

export function useCreateLog(
  habitId: string | string[],
  setShowLogForm: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [logImage, setLogImage] = useState<File | null>(null);
  const [logMessage, setLogMessage] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const { account } = useAccount();

  const handleSubmit = async () => {
    if (!account) return;
    if (!logMessage.trim()) {
      throw new Error("Please enter a message");
    }

    if (!logImage) {
      throw new Error("Please select an image");
    }

    setIsLogging(true);
    try {
      const imageForm = new FormData();
      imageForm.append("file", logImage);

      const imageRes = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          body: imageForm,
        }
      );
      const imageData = await imageRes.json();

      const logMetadata = JSON.stringify({
        id: Date.now() + Math.floor(Math.random() * 1000),
        image: `ipfs://${imageData.IpfsHash}/`,
        message: logMessage,
        created_at: new Date(),
      });

      const metadataRes = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          body: logMetadata,
        }
      );

      const metadata = await metadataRes.json();

      const result = await account.execute({
        contractAddress: POH_CONTRACT_ADDRESS,
        entrypoint: "log_entry",
        calldata: CallData.compile({
          habit_id: habitId,
          log_info: metadata.IpfsHash,
        }),
      });

      const status = await myProvider.waitForTransaction(
        result.transaction_hash
      );

      if (status.isSuccess()) {
        toast.success("Success! 🎉 Your entry has been logged.");
        setShowLogForm(false);
      }
    } catch (error) {
      toast.error("Failed to submit log. Please try again.");
    } finally {
      setIsLogging(false);
    }
  };

  return {
    logImage,
    setLogImage,
    logMessage,
    setLogMessage,
    isLogging,
    handleSubmit,
  };
}
