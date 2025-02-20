import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import { Post, SessionClient } from "@lens-protocol/client";
import { AccessControlParams, Src } from "@livepeer/react";
import { SetStateAction } from "react";

export type MemoriesProps = {
  setScreen: (e: SetStateAction<Screen>) => void;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  currentSession: CurrentSession;
  sessionClient: SessionClient | undefined;
};

export type Memory = {
  id: string;
  post?: Post;
  decodedData?: {
    postId: string;
    image: string;
    video: string;
    text: string;
    src?: Src[] | null;
  };
  data: {
    dataToEncryptHash: string;
    accessControlConditions: AccessControlParams[];
    ciphertext: string;
  };
  decrypted?: boolean;
};
