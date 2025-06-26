"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WalletConnectModal } from "@/components/wallet-connect-modal";
import { useState } from "react";
import { Home, User, Target, Plus, ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { useContractFetch } from "@/hooks/useBlockchain";
import { PROOFOFHABIT_ABI } from "@/app/abis/proof_of_habit_abi";
import { shortString } from "starknet";

export function Navigation() {
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { readData: usernameData } = useContractFetch(
    PROOFOFHABIT_ABI,
    "get_user_name",
    [address]
  );
  const [showWalletModal, setShowWalletModal] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    {
      href: "/my-habits",
      label: "My Habits",
      icon: Target,
      requiresWallet: true,
    },
    { href: "/create", label: "Create", icon: Plus, requiresWallet: true },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PoH</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Proof of Habit
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const canAccess = !item.requiresWallet || isConnected;

                return (
                  <Link
                    key={item.href}
                    href={canAccess ? item.href : "#"}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : canAccess
                        ? "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!canAccess) {
                        e.preventDefault();
                        setShowWalletModal(true);
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              {isConnected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {(usernameData &&
                        shortString.decodeShortString(usernameData)) ||
                        `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          usernameData
                            ? `/profile/${shortString.decodeShortString(
                                usernameData
                              )}`
                            : "/set-username"
                        }
                        className="w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {usernameData ? "View Profile" : "Set Username"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => disconnect()}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect Wallet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setShowWalletModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 px-4 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const canAccess = !item.requiresWallet || isConnected;

              return (
                <Link
                  key={item.href}
                  href={canAccess ? item.href : "#"}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-purple-700"
                      : canAccess
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => {
                    if (!canAccess) {
                      e.preventDefault();
                      setShowWalletModal(true);
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
}
