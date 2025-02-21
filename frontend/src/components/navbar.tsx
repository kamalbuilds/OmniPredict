import React from "react";
import { FiMenu } from "react-icons/fi";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { client } from "@/client";
import { baseSepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Navbar = ({
  accountOpen,
  setAccountOpen,
  setScreen,
  expand,
  setExpand,
}: {
  accountOpen: boolean;
  setAccountOpen: (e: boolean) => void;
  setScreen: (e: string) => void;
  expand: boolean;
  setExpand: (e: boolean) => void;
}) => {
  const account = useActiveAccount();
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const { toast } = useToast();

  const handleClaimTokens = async () => {
    setIsClaimLoading(true);
    try {
      const resp = await fetch("/api/claimToken", {
        method: "POST",
        body: JSON.stringify({ address: account?.address }),
      });
      
      if (!resp.ok) {
        throw new Error('Failed to claim tokens');
      }

      toast({
        title: "Tokens Claimed!",
        description: "Your tokens have been successfully claimed.",
        duration: 5000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Claim Failed",
        description: "There was an error claiming your tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClaimLoading(false);
    }
  };
  
  return (
    <div className="relative w-full h-fit flex flex-row items-center justify-between gap-3 p-3">
      <div
        className="relative w-fit h-fit flex flex-row gap-3 items-center cursor-pointer"
        onClick={() => setScreen("feed")}
      >
        <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/40 p-2 border border-white/10">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcDKJhwCdtKtaLuN3DnewV93q5A2yL4ECM3a7H2ZCCqhj`}
            layout="fill"
            alt="omnipredict"
            className="flex items-center justify-center"
          />
        </div>
        <div className="relative font-digi text-white text-2xl neon-text">OmniPredict</div>
      </div>
      <div className="relative w-fit h-fit flex flex-row gap-3 items-center">
        <div
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer retro-button rounded-lg"
          onClick={() => setExpand(!expand)}
        >
          <FiMenu
            size={20}
            color="#fff"
            className="hover:text-[#ff71ce] transition-all duration-200"
          />
        </div>
        <div
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer retro-button rounded-lg"
          onClick={() => setAccountOpen(!accountOpen)}
        >
          <div className="relative w-6 h-6 flex items-center justify-center rounded-full bg-black/40 p-1 border border-white/10">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcDKJhwCdtKtaLuN3DnewV93q5A2yL4ECM3a7H2ZCCqhj`}
              layout="fill"
              alt="profile"
              className="flex items-center justify-center rounded-full"
            />
          </div>
        </div>
        {account && (
          <Button 
            onClick={handleClaimTokens}
            disabled={isClaimLoading}
            variant="outline"
            className="retro-button rounded-lg"
          >
            {isClaimLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              'Claim Tokens'
            )}
          </Button>
        )}
        <ConnectButton 
          client={client} 
          theme={lightTheme()}
          chain={baseSepolia}
          connectButton={{
            style: {
              fontSize: '0.75rem !important',
              height: '2.5rem !important',
            },
            label: 'Sign In',
          }}
          detailsButton={{
            displayBalanceToken: {
              [baseSepolia.id]: "0x4D9604603527322F44c318FB984ED9b5A9Ce9f71"
            }
          }}
          wallets={[
            inAppWallet(),
          ]}
          accountAbstraction={{
            chain: baseSepolia,
            sponsorGas: true,
          }}
          className="retro-button rounded-lg"
        />
      </div>
    </div>
  );
};

export default Navbar;
