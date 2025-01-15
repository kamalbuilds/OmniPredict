import { EditorType } from "@/components/Feed/types/feed.types";
import {
  Account,
  Post,
  PublicClient,
  SessionClient,
} from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { AccessControlParams } from "@livepeer/react";
import { Stream } from "livepeer/models/components";
import { GetSessionResponse } from "livepeer/models/operations";
import { SetStateAction } from "react";

export interface Screen {
  title: string;
  description: string;
}

export type ScreenSwitchProps = {
  handleDecryptAiDetails: () => Promise<void>;
  decryptAiDetailsLoading: boolean;
  screen: Screen;
  gifOpen: {
    id: string;
    gif: string;
    open: boolean;
  };
  lensAccount: LensAccount | undefined;
  setExpand: (e: SetStateAction<boolean>) => void;
  expand: boolean;
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
  storageClient: StorageClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  setGifOpen: (
    e: SetStateAction<{
      id: string;
      gif: string;
      open: boolean;
    }>
  ) => void;
  setImageView: (e: SetStateAction<string | undefined>) => void;
  lensClient: PublicClient | undefined;
  setScreen: (e: SetStateAction<Screen>) => void;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  currentSession: CurrentSession;
  setPostLive: (e: SetStateAction<boolean>) => void;
};

export interface LensAccount {
  account?: Account;
  sessionClient?: SessionClient;
}

export interface CurrentSession {
  post?: Post;
  editors: EditorType[];
  currentIndex: number;
  image?: Blob | undefined;
  video?: Stream;
  text?: string;
  videoEdit?: GetSessionResponse;
}
