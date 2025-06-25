"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useConnect } from "@starknet-react/core";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal({
  isOpen,
  onClose,
}: WalletConnectModalProps) {
  const { connectAsync } = useConnect();

  const handleConnect = async (walletType: string) => {
    try {
      await connectAsync();
      onClose();
    } catch (error) {
      console.error(`Failed to connect to ${walletType}:`, error);
    }
  };

  const wallets = [
    {
      name: "Braavos",
      icon: "🛡️",
      description: "Connect using Braavos wallet",
    },
    {
      name: "Argent X",
      icon: "🔷",
      description: "Connect using Argent X wallet",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose a wallet to connect to Proof of Habit and start tracking your
            habits onchain.
          </p>
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-purple-50 hover:border-purple-200"
                onClick={() => handleConnect(wallet.name)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-gray-500">
                      {wallet.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
