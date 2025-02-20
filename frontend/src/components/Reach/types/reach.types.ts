import {
  CurrentSession,
  LensAccount,
  Screen,
} from "@/components/Common/types/common.types";
import { EditorType } from "@/components/Feed/types/feed.types";
import {
  AccountStats,
  Post,
  PublicClient,
  SessionClient,
} from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";

export type ReachProps = {
  storageClient: StorageClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  setGifOpen: (
    e: SetStateAction<{ id: string; gif: string; open: boolean }>
  ) => void;
  gifOpen: { id: string; gif: string; open: boolean };
  setImageView: (e: SetStateAction<string | undefined>) => void;
  lensClient: PublicClient | undefined;
  sessionClient: SessionClient | undefined;
  lensAccount: LensAccount | undefined;
  setScreen: (e: SetStateAction<Screen>) => void;
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  currentSession: CurrentSession;
};

export type AccountDataProps = {
  data: AccountStats | undefined;
};

export type AccountPostProps = {
  handlePost: () => Promise<void>;
  postLoading: boolean;
  setGifOpen: (
    e: SetStateAction<{ id: string; gif: string; open: boolean }>
  ) => void;
  postContent: string;
  setPostContent: (e: SetStateAction<string>) => void;
};
