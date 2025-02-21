import { FunctionComponent, JSX, useContext } from "react";
import useMemeFeed from "../hooks/useMemeFeed";
import { MemeFeedProps } from "../types/memes.types";
import { AppContext } from "@/app/providers";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { Post } from "@lens-protocol/client";
import MetadataSwitch from "@/components/Feed/modules/MetadataSwitch";
import ReactionsBar from "@/components/Feed/modules/ReactionsBar";
import moment from "moment";

const MemeFeed: FunctionComponent<MemeFeedProps> = ({
  memeData,
  setScreen,
}): JSX.Element => {
  const context = useContext(AppContext);
  const {
    setMemeFeed,
    memeFeed,
    feed,
    feedLoading,
    handleMoreFeed,
    paginated,
    moreFeedLoading,
    handlePost,
    postLoading,
    postContent,
    userData,
    setPostContent,
    setFeed,
    handleMorePostFeed,
    feedPaginated,
    profilePaginated,
    feedPostLoading,
    feedProfileLoading,
    moreFeedPostLoading,
    moreProfileFeedLoading,
    feedProfile,
    mainPost,
    setMainPost,
    setFeedSwitch,
    feedSwitch,
    setFeedProfile,
    setPostFeed,
    postFeed,
    handleMoreProfileFeed,
    followLoading,
    handleFollow,
    memeFeedOpen,
    setMemeFeedOpen,
  } = useMemeFeed(
    context?.lensAccount,
    context?.lensClient!,
    context?.setCurrentSession!,
    context?.storageClient!,
    context?.setSignless!,
    context?.setNotification!,
    context?.setIndexer!,
    context?.gifOpen!,
    memeData
  );

  return (
    <div className="relative w-full h-full flex items-start justify-start border-2 border-[var(--neon-blue)] rounded-xl bg-white/5 backdrop-blur-sm p-6 flex-col gap-6">
      <div className="relative w-full h-fit flex flex-col gap-3">
        <div className="text-[var(--neon-pink)] text-left w-fit h-fit flex text-xl font-pixel neon-text">
          Today's Top Memes in OMNIPredict
        </div>
        <div className="relative w-full h-fit flex flex-row items-center justify-start gap-4">
          <div className="relative rounded-xl border-2 border-[var(--neon-blue)] bg-black/20 flex whitespace-nowrap items-center justify-center text-center py-2 px-4 text-[var(--neon-green)] text-base font-pixel h-fit min-w-28 retro-card">
            {memeFeed?.symbol}
          </div>
          <div
            className="relative text-[var(--neon-blue)] hover:text-[var(--neon-pink)] transition-all duration-200 cursor-pointer w-8 h-8"
            onClick={() => setMemeFeedOpen(!memeFeedOpen)}
          >
            <Image
              alt="option"
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}Qmd63TQtZM3vGXy9F2XJJzeMLxuvp1Png7R3yZwkCcW2Mf`}
              className="hover:scale-110 transition-transform duration-200"
            />
          </div>
          {memeFeedOpen && (
            <div className="absolute w-32 h-fit rounded-xl flex bg-black/40 backdrop-blur-sm right-0 top-12 flex-col gap-3 border-2 border-[var(--neon-blue)] p-3 z-40">
              {memeData.map((meme, key) => {
                return (
                  <div
                    key={key}
                    className="relative flex w-full h-10 rounded-lg retro-button active:scale-95 cursor-pointer items-center justify-center text-center text-sm font-pixel text-white hover:opacity-80"
                    onClick={() => {
                      setMemeFeedOpen(false);
                      setMemeFeed(meme);
                    }}
                  >
                    {meme?.symbol}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full h-[calc(100vh-12rem)] overflow-y-scroll grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
        {/* Meme Grid */}
        {feed?.map((item: Post, index: number) => {
          const metadata = item?.metadata;
          const profile = item?.by;
          const timestamp = moment(item?.createdAt).format("MM.DD.YY");

          return (
            <div
              key={index}
              className="relative w-full aspect-square rounded-xl overflow-hidden retro-card group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => {
                setMainPost(item);
                setFeedSwitch(true);
              }}
            >
              <MetadataSwitch metadata={metadata} />
              <div className="absolute bottom-0 left-0 w-full p-3 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col gap-2 text-white">
                  <div className="text-sm font-pixel truncate">{profile?.handle?.fullHandle}</div>
                  <div className="text-xs font-mono">{timestamp}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Add Note Section */}
      <div className="relative w-full h-fit">
        <textarea
          className="w-full h-32 bg-black/20 border-2 border-[var(--neon-blue)] rounded-xl p-4 text-white font-pixel text-sm resize-none focus:outline-none focus:border-[var(--neon-pink)] transition-colors duration-200 placeholder-white/50"
          placeholder="Add a note?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button 
          className="absolute bottom-4 right-4 retro-button px-6 py-2 rounded-lg text-sm font-pixel"
          onClick={() => handlePost()}
        >
          SHARE MEME
        </button>
      </div>
    </div>
  );
};

export default MemeFeed;
