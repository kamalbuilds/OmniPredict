import {
  CurrentSession,
  LensAccount,
} from "@/components/Common/types/common.types";
import { SessionClient } from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";

export type PostLiveProps = {
  setNotification: (e: SetStateAction<string | undefined>) => void;
  sessionClient: SessionClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setPostLive: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  storageClient: StorageClient;
  currentSession: CurrentSession;
};

export type CreateAccountProps = {
  address: `0x${string}` | undefined;
  lensAccount: LensAccount | undefined;
  setLensAccount:
    | ((e: SetStateAction<LensAccount | undefined>) => void)
    | undefined;
  setCreateAccount: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  storageClient: StorageClient;
};

export type ImageViewerProps = {
  imageView: string;
  setImageView: (e: SetStateAction<string | undefined>) => void;
};
export type IndexerProps = {
  indexer: string | undefined;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
};

export type NotificationProps = {
  notification: string | undefined;
  setNotification: (e: SetStateAction<string | undefined>) => void;
};

export type GifProps = {
  setGifOpen: (
    e: SetStateAction<{ id: string; gif: string; open: boolean }>
  ) => void;
};

export type SignlessProps = {
  lensAccount: LensAccount | undefined;
  setSignless: (e: SetStateAction<boolean>) => void;
};
