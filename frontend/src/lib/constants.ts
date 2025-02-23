import { Screen } from "@/components/Common/types/common.types";

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io/ipfs/";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const STORAGE_NODE = "https://api-v2-mumbai-live.lens.dev";


export const COMFY_WORKFLOWS: string[] = [
  "Depth",
  "BOS Music Video 1",
  "BOS Music Video 2",
  "EKKO",
  "Powder",
  "Generic Anime",
];

export const SCREENS: Screen[] = [
  {
    title: "Cross Feed",
    description:
      "Your feeds from Lens, Farcaster, and Bluesky in one place. Save anything on the user owned web that catches your eye.",
  },

  {
    description:
      "Agents stimulate your thoughts with questions and hints while you edit, turning saves into content you can publish across web3 social.",
    title: "Sessions",
  },
  {
    description:
      "Don't let algorithms ghost you. Reputation grows from posts that land. Daily voting lets proven voices direct attention where it counts.",
    title: "Reach",
  },
  {
    description:
      "Quick-reaction tokens and sticker packs become tradeable assets. Communities co-monetize with creators from what spreads.",
    title: "Memes",
  },
  {
    description:
      "The past returns when you need a refresher. And with it new content to share with friends and agent sessions.",
    title: "Memories",
  },
  {
    description:
      "Predict the future of the market with Sonic Prediction Market.",
    title: "Prediction",
  },
  {
    title: "Account",
    description: "",
  },
];

export const FEED_TYPES: string[] = ["for you", "video", "image", "text"];

export const SESSION_DATA_CONTRACT: `0x${string}` = "0xDb61Db77c257c986412a784B0BF0a8A84D712e77";
export const MEME_DATA_CONTRACT: `0x${string}` = "0xa9af59DcDDFac01D3B51CC80982fe13EcDb0E0d6";
