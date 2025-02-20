import { SetStateAction, useState } from "react";
import { enableSignless } from "@lens-protocol/client/actions";
import { ethers } from "ethers";
import { LensAccount } from "@/components/Common/types/common.types";

const useSignless = (
  lensAccount: LensAccount | undefined,
  setSigner: (e: SetStateAction<boolean>) => void
) => {
  const [signlessLoading, setSignlessLoading] = useState<boolean>(false);

  const handleSignless = async () => {
    if (!lensAccount?.sessionClient) return;
    setSignlessLoading(true);
    try {
      const res = await enableSignless(lensAccount?.sessionClient);

      if (res.isErr()) {
        console.error(res.error);
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();

        const tx = {
          chainId: (res.value as any)?.raw?.chainId,
          from: (res.value as any)?.raw?.from,
          to: (res.value as any)?.raw?.to,
          nonce: (res.value as any)?.raw?.nonce,
          gasLimit: (res.value as any)?.raw?.gasLimit,
          maxFeePerGas: (res.value as any)?.raw?.maxFeePerGas,
          maxPriorityFeePerGas: (res.value as any)?.raw?.maxPriorityFeePerGas,
          value: (res.value as any)?.raw?.value,
          data: (res.value as any)?.raw?.data,
        };
        const txResponse = await signer.sendTransaction(tx);
        await txResponse.wait();

        setSigner?.(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignlessLoading(false);
  };

  return {
    signlessLoading,
    handleSignless,
  };
};

export default useSignless;
