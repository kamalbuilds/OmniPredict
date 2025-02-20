import {
  CurrentSession,
  LensAccount,
  Screen,
} from "@/components/Common/types/common.types";
import { Post } from "@lens-protocol/client";
import { AccessControlParams } from "@livepeer/react";
import OpenAI from "openai";
import { SetStateAction } from "react";

export type SessionSwitchProps = {
  currentSession: CurrentSession;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  saveSessionLoading: boolean;
  expand: boolean;
  lensAccount: LensAccount | undefined;
};

export type ActivePostProps = {
  post: Post | undefined;
  setScreen?: (e: SetStateAction<Screen>) => void;
};

export type ChatProps = {
  sendToAgent: () => Promise<void>;
  content: string;
  aiChoice: AiChoice;
  setAiChoice: (e: SetStateAction<AiChoice>) => void;
  setContent: (e: SetStateAction<string>) => void;
  agentLoading: boolean;
  aiDetails: {
    data?: {
      openAikey?: string;
      instructionsOpenAi?: string;
      modelOpenAi: string;
      claudekey?: string;
      instructionsClaude?: string;
      modelClaude: string;
    };
    json?: {
      dataToEncryptHash: string;
      accessControlConditions: AccessControlParams[];
      ciphertext: string;
    };
    decrypted: boolean;
  };
  setScreen: (e: SetStateAction<Screen>) => void;
  handleDecryptAiDetails: () => Promise<void>;
  decryptAiDetailsLoading: boolean;
};

export type AIResponseProps = {
  agentChat: ({ content: string } | string)[];
};

export enum AiChoice {
  OpenAi,
  Claude,
}

export type SaveTypes = {
  postLoading: boolean;
  setExpand: (e: SetStateAction<boolean>) => void;
  expand: boolean;
  saveSessionLoading: boolean;
  handlePost: () => Promise<void>;
};
