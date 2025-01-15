import { CurrentSession, Screen } from "@/components/Common/types/common.types";
import {
  ImageMetadata,
  Post,
  PublicClient,
  SessionClient,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/client";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";

export type FeedProps = {
  setImageView: (e: SetStateAction<string | undefined>) => void;
  client: PublicClient | SessionClient | undefined;
  setGifOpen: (
    e: SetStateAction<{ id: string; gif: string; open: boolean }>
  ) => void;
  setScreen: (e: SetStateAction<Screen>) => void;
  storageClient: StorageClient;
  sessionClient: SessionClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  gifOpen: { id: string; gif: string; open: boolean };
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  currentSession: CurrentSession;
};

export type MetadataSwitchProps = {
  metadata: string;
  data: TextOnlyMetadata | ImageMetadata | VideoMetadata;
  setImageView?: (e: SetStateAction<string | undefined>) => void;
};

export type ReactionsBarProps = {
  setScreen: (e: SetStateAction<Screen>) => void;
  setGifOpen: (
    e: SetStateAction<{ id: string; gif: string; open: boolean }>
  ) => void;
  gifOpen: { id: string; gif: string; open: boolean };
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void;
  post: Post;
  currentSession: CurrentSession;
  index: number;
  storageClient: StorageClient;
  sessionClient: SessionClient;
  setSignless: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  setFeed: (e: SetStateAction<Post[]>) => void;
};

export enum EditorType {
  Image = "image",
  Video = "video",
  Text = "text",
  Audio = "audio",
}

export enum Social {
  Lens = "Lens",
  Bluesky = "Bluesky",
  Farcaster = "Farcaster",
}

export type FeedOptionsProps = {
  socials: Social[];
  setSocials: (e: SetStateAction<Social[]>) => void;
  feedType: string;
  setFeedType: (e: SetStateAction<string>) => void;
  feedTypeOpen: boolean;
  setFeedTypeOpen: (e: SetStateAction<boolean>) => void;
};
