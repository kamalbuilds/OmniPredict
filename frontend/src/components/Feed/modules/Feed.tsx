import { FunctionComponent, JSX } from "react";
import FeedOptions from "./FeedOptions";
import MetadataSwitch from "@/components/Feed/modules/MetadataSwitch";
import ReactionsBar from "@/components/Feed/modules/ReactionsBar";
import useFeed from "../hooks/useFeed";
import { FeedProps } from "@/components/Feed/types/feed.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "@lens-protocol/client";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import moment from "moment";

const Feed: FunctionComponent<FeedProps> = ({
  setImageView,
  client,
  setGifOpen,
  setScreen,
  setCurrentSession,
  currentSession,
  storageClient,
  sessionClient,
  setSignless,
  setIndexer,
  setNotification,
  gifOpen,
}): JSX.Element => {
  const {
    feedType,
    setFeedType,
    socials,
    setSocials,
    feed,
    feedLoading,
    handleMoreFeed,
    paginated,
    setFeedTypeOpen,
    feedTypeOpen,
    moreFeedLoading,
    setFeed,
    setFeedSwitch,
    feedSwitch,
    feedProfile,
    postFeed,
    feedPostLoading,
    feedProfileLoading,
    handleMorePostFeed,
    handleMoreProfileFeed,
    feedPaginated,
    profilePaginated,
    moreFeedPostLoading,
    moreProfileFeedLoading,
    setPostFeed,
    setFeedProfile,
    setMainPost,
    mainPost,
    followLoading,
    handleFollow,
  } = useFeed(
    client,
    setCurrentSession,
    setSignless,
    setIndexer,
    setNotification
  );
  return (
    <div className="relative w-full h-full flex items-center justify-start flex-col gap-4 pb-10">
      <FeedOptions
        feedType={feedType}
        setFeedType={setFeedType}
        setSocials={setSocials}
        socials={socials}
        setFeedTypeOpen={setFeedTypeOpen}
        feedTypeOpen={feedTypeOpen}
      />
      <div
        className="relative w-full h-fit sm:h-full flex items-start justify-start overflow-y-scroll pb-10 rounded-md"
        id="scrollTarget"
      >
        <InfiniteScroll
          scrollableTarget="scrollTarget"
          dataLength={
            feedSwitch?.type == "post"
              ? feedPostLoading
                ? 20
                : moreFeedPostLoading
                ? postFeed?.length + 20
                : postFeed?.length
              : feedSwitch?.type == "profile"
              ? feedProfileLoading
                ? 20
                : moreProfileFeedLoading
                ? feedProfile?.length + 20
                : feedProfile?.length
              : feedLoading
              ? 20
              : moreFeedLoading
              ? feed?.length + 20
              : feed?.length
          }
          next={
            feedSwitch?.type == "post"
              ? handleMorePostFeed
              : feedSwitch?.type == "profile"
              ? handleMoreProfileFeed
              : handleMoreFeed
          }
          hasMore={
            feedSwitch?.type == "post"
              ? !feedPaginated || feedPostLoading
                ? false
                : true
              : feedSwitch?.type == "profile"
              ? !profilePaginated || feedProfileLoading
                ? false
                : true
              : !paginated || feedLoading
              ? false
              : true
          }
          loader={<></>}
          className="relative w-full gap-4 flex flex-col items-start justify-start"
        >
          {(
            feedSwitch?.type == "post"
              ? feedPostLoading
              : feedSwitch?.type == "profile"
              ? feedProfileLoading
              : feedLoading || feed?.length < 1
          ) ? (
            Array.from({ length: 20 }).map((_, key) => {
              return (
                <div
                  key={key}
                  className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                ></div>
              );
            })
          ) : feedSwitch?.type == "profile" ? (
            <>
              <div className="relative w-full h-fit flex items-start justify-start p-1 bg-white rounded-md">
                <div
                  className="relative w-fit h-fit flex"
                  onClick={() =>
                    setFeedSwitch({
                      type: "all",
                    })
                  }
                >
                  <div className="relative w-8 h-8 rotate-180 flex items-center justify-center cursor-pointer">
                    <Image
                      draggable={false}
                      layout="fill"
                      className=""
                      objectFit="contain"
                      src={`${INFURA_GATEWAY}QmShDz8mrGpL6bythi9dwfKGAhFRUGwdn7mzKB8WjLorb5`}
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-full h-full flex flex-col gap-3 rounded-md p-1 bg-white">
                <div className="relative w-full h-40 flex bg-white">
                  <div className="relative w-full h-full flex items-center justify-center border border-ocean bg-ocean rounded-md">
                    <Image
                      src={`${INFURA_GATEWAY}${
                        feedSwitch?.profile?.metadata?.coverPicture?.split(
                          "ipfs://"
                        )?.[1]
                      }`}
                      objectFit="cover"
                      layout="fill"
                      draggable={false}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex w-fit h-fit">
                    <div
                      className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                      onClick={() => !followLoading && handleFollow()}
                    >
                      <div className="absolute top-0 left-0 flex w-28 h-8">
                        <Image
                          src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                          layout="fill"
                          objectFit="fill"
                          draggable={false}
                        />
                      </div>
                      {followLoading ? (
                        <div className="relative w-4 h-4 animate-spin flex">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            draggable={false}
                            src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                          />
                        </div>
                      ) : (
                        <div className="relative flex w-fit h-fit font-digi">
                          {feedSwitch?.profile?.operations?.isFollowedByMe
                            ? "Unfollow"
                            : "Follow"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 items-center justify-center flex w-fit h-fit">
                    <div
                      className="relative w-20 rounded-full h-20 flex items-center justify-center border border-ocean bg-ocean bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Image
                        src={`${INFURA_GATEWAY}${
                          feedSwitch?.profile?.metadata?.picture?.split(
                            "ipfs://"
                          )?.[1]
                        }`}
                        objectFit="cover"
                        layout="fill"
                        draggable={false}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-fit flex items-start justify-start flex-col sm:flex-row gap-3 text-black px-2">
                  <div className="relative w-fit h-fit flex">
                    {feedSwitch?.profile?.metadata?.name}
                  </div>
                  <div className="relative w-fit h-fit flex">
                    {feedSwitch?.profile?.username?.localName}
                  </div>
                </div>
                <div className="relative w-full overflow-y-scroll flex flex-col gap-1.5 items-start justify-start h-fit px-2 text-sm">
                  {feedSwitch?.profile?.metadata?.bio}
                </div>
              </div>
              {feedProfile?.map((post, key) => {
                return (post as Post)?.id ? (
                  <div
                    key={key}
                    className="relative w-full h-fit rounded-md bg-white flex flex-col gap-5"
                  >
                    <div className="relative w-full h-fit flex items-end justify-end p-1">
                      <div className="relative w-fit h-fit flex">
                        <div
                          className={`flex relative w-5 h-5 cursor-pointer hover:opacity-70`}
                          onClick={() =>
                            setFeedSwitch({
                              type: "post",
                              post: post as Post,
                            })
                          }
                        >
                          <Image
                            src={`${INFURA_GATEWAY}QmUe9sEBFHyL32Q3aNqL9fc1pE7QJYVZn6QnKpkBCSygsB`}
                            draggable={false}
                            layout="fill"
                            alt="icon"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full h-fit px-1.5 py-1 flex items-center justify-between flex-row gap-2">
                      <div
                        className="relative w-fit h-fit flex cursor-pointer flex-row gap-1  items-center justify-center"
                        onClick={() =>
                          setFeedSwitch({
                            profile: (post as Post)?.author,
                            type: "profile",
                          })
                        }
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          <div className="w-6 h-6 flex relative flex items-center justify-center rounded-full bg-dark shadow-sm">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              draggable={false}
                              className="rounded-full"
                              src={`${INFURA_GATEWAY}${
                                (
                                  post as Post
                                )?.author?.metadata?.picture?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                            />
                          </div>
                        </div>
                        <div className="relative w-fit h-fit flex items-center justify-center text-black text-xs">
                          @
                          {Number(
                            (post as Post)?.author?.username?.localName?.length
                          ) < 15
                            ? (post as Post)?.author?.username?.localName
                            : (
                                post as Post
                              )?.author?.username?.localName?.slice(0, 12) +
                              "..."}
                        </div>
                      </div>
                      <div className="relative w-fit h-fit flex text-xs text-black">
                        {moment(`${(post as Post)?.timestamp}`).fromNow()}
                      </div>
                    </div>
                    <MetadataSwitch
                      metadata={(post as Post)?.metadata?.__typename!}
                      data={(post as Post)?.metadata as any}
                      setImageView={setImageView}
                    />
                    <ReactionsBar
                      setGifOpen={setGifOpen}
                      setFeed={setFeedProfile}
                      post={post as Post}
                      gifOpen={gifOpen}
                      setCurrentSession={setCurrentSession}
                      setScreen={setScreen}
                      currentSession={currentSession}
                      index={key}
                      sessionClient={sessionClient}
                      setIndexer={setIndexer}
                      setNotification={setNotification}
                      setSignless={setSignless}
                      storageClient={storageClient}
                    />
                  </div>
                ) : (
                  <div
                    key={key}
                    className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                  ></div>
                );
              })}
            </>
          ) : feedSwitch?.type == "post" ? (
            <>
              <div className="relative w-full h-fit flex items-start justify-start p-1 bg-white rounded-md">
                <div
                  className="relative w-fit h-fit flex"
                  onClick={() =>
                    setFeedSwitch({
                      type: "all",
                    })
                  }
                >
                  <div className="relative w-8 h-8 rotate-180 flex items-center justify-center cursor-pointer">
                    <Image
                      draggable={false}
                      layout="fill"
                      className=""
                      objectFit="contain"
                      src={`${INFURA_GATEWAY}QmShDz8mrGpL6bythi9dwfKGAhFRUGwdn7mzKB8WjLorb5`}
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit rounded-md bg-white flex flex-col gap-5">
                <div className="relative w-full h-fit px-1.5 py-1 flex items-center justify-between flex-row gap-2">
                  <div
                    className="relative w-fit h-fit flex cursor-pointer flex-row gap-1  items-center justify-center"
                    onClick={() =>
                      setFeedSwitch({
                        profile: feedSwitch?.post?.author,
                        type: "profile",
                      })
                    }
                  >
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      <div className="w-6 h-6 flex relative flex items-center justify-center rounded-full bg-dark shadow-sm">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          className="rounded-full"
                          src={`${INFURA_GATEWAY}${
                            feedSwitch?.post?.author?.metadata?.picture?.split(
                              "ipfs://"
                            )?.[1]
                          }`}
                        />
                      </div>
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center text-black text-xs">
                      @
                      {Number(
                        feedSwitch?.post?.author?.username?.localName?.length
                      ) < 15
                        ? feedSwitch?.post?.author?.username?.localName
                        : feedSwitch?.post?.author?.username?.localName?.slice(
                            0,
                            12
                          ) + "..."}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit flex text-xs text-black">
                    {moment(`${feedSwitch?.post?.timestamp}`).fromNow()}
                  </div>
                </div>
                <MetadataSwitch
                  metadata={feedSwitch?.post?.metadata?.__typename!}
                  data={feedSwitch?.post?.metadata as any}
                  setImageView={setImageView}
                />
                <ReactionsBar
                  setGifOpen={setGifOpen}
                  setFeed={setMainPost}
                  post={mainPost?.[0]}
                  gifOpen={gifOpen}
                  setCurrentSession={setCurrentSession}
                  setScreen={setScreen}
                  currentSession={currentSession}
                  index={0}
                  sessionClient={sessionClient}
                  setIndexer={setIndexer}
                  setNotification={setNotification}
                  setSignless={setSignless}
                  storageClient={storageClient}
                />
              </div>

              {postFeed?.map((post, key) => {
                return (post as Post)?.id ? (
                  <div
                    key={key}
                    className="relative w-full h-fit rounded-md bg-white flex flex-col gap-5"
                  >
                    <div className="relative w-full h-fit flex items-end justify-end p-1">
                      <div className="relative w-fit h-fit flex">
                        <div
                          className={`flex relative w-5 h-5 cursor-pointer hover:opacity-70`}
                          onClick={() =>
                            setFeedSwitch({
                              type: "post",
                              post: post as Post,
                            })
                          }
                        >
                          <Image
                            src={`${INFURA_GATEWAY}QmUe9sEBFHyL32Q3aNqL9fc1pE7QJYVZn6QnKpkBCSygsB`}
                            draggable={false}
                            layout="fill"
                            alt="icon"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full h-fit px-1.5 py-1 flex items-center justify-between flex-row gap-2">
                      <div
                        className="relative w-fit h-fit flex cursor-pointer flex-row gap-1  items-center justify-center"
                        onClick={() =>
                          setFeedSwitch({
                            profile: (post as Post)?.author,
                            type: "profile",
                          })
                        }
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          <div className="w-6 h-6 flex relative flex items-center justify-center rounded-full bg-dark shadow-sm">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              draggable={false}
                              className="rounded-full"
                              src={`${INFURA_GATEWAY}${
                                (
                                  post as Post
                                )?.author?.metadata?.picture?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                            />
                          </div>
                        </div>
                        <div className="relative w-fit h-fit flex items-center justify-center text-black text-xs">
                          @
                          {Number(
                            (post as Post)?.author?.username?.localName?.length
                          ) < 15
                            ? (post as Post)?.author?.username?.localName
                            : (
                                post as Post
                              )?.author?.username?.localName?.slice(0, 12) +
                              "..."}
                        </div>
                      </div>
                      <div className="relative w-fit h-fit flex text-xs text-black">
                        {moment(`${(post as Post)?.timestamp}`).fromNow()}
                      </div>
                    </div>
                    <MetadataSwitch
                      metadata={(post as Post)?.metadata?.__typename!}
                      data={(post as Post)?.metadata as any}
                      setImageView={setImageView}
                    />
                    <ReactionsBar
                      setGifOpen={setGifOpen}
                      setFeed={setPostFeed}
                      post={post as Post}
                      gifOpen={gifOpen}
                      setCurrentSession={setCurrentSession}
                      setScreen={setScreen}
                      currentSession={currentSession}
                      index={key}
                      sessionClient={sessionClient}
                      setIndexer={setIndexer}
                      setNotification={setNotification}
                      setSignless={setSignless}
                      storageClient={storageClient}
                    />
                  </div>
                ) : (
                  <div
                    key={key}
                    className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                  ></div>
                );
              })}
            </>
          ) : (
            (moreFeedLoading
              ? [...feed, Array.from({ length: 20 })]
              : feed
            ).map((post, key) => {
              return (post as Post)?.id ? (
                <div
                  key={key}
                  className="relative w-full h-fit rounded-md bg-white flex flex-col gap-5"
                >
                  <div className="relative w-full h-fit flex items-end justify-end p-1">
                    <div className="relative w-fit h-fit flex">
                      <div
                        className={`flex relative w-5 h-5 cursor-pointer hover:opacity-70`}
                        onClick={() =>
                          setFeedSwitch({
                            type: "post",
                            post: post as Post,
                          })
                        }
                      >
                        <Image
                          src={`${INFURA_GATEWAY}QmUe9sEBFHyL32Q3aNqL9fc1pE7QJYVZn6QnKpkBCSygsB`}
                          draggable={false}
                          layout="fill"
                          alt="icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-fit px-1.5 py-1 flex items-center justify-between flex-row gap-2">
                    <div
                      className="relative w-fit h-fit flex cursor-pointer flex-row gap-1  items-center justify-center"
                      onClick={() =>
                        setFeedSwitch({
                          profile: (post as Post)?.author,
                          type: "profile",
                        })
                      }
                    >
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        <div className="w-6 h-6 flex relative flex items-center justify-center rounded-full bg-dark shadow-sm">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            draggable={false}
                            className="rounded-full"
                            src={`${INFURA_GATEWAY}${
                              (post as Post)?.author?.metadata?.picture?.split(
                                "ipfs://"
                              )?.[1]
                            }`}
                          />
                        </div>
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center text-black text-xs">
                        @
                        {Number(
                          (post as Post)?.author?.username?.localName?.length
                        ) < 15
                          ? (post as Post)?.author?.username?.localName
                          : (post as Post)?.author?.username?.localName?.slice(
                              0,
                              12
                            ) + "..."}
                      </div>
                    </div>
                    <div className="relative w-fit h-fit flex text-xs text-black">
                      {moment(`${(post as Post)?.timestamp}`).fromNow()}
                    </div>
                  </div>
                  <MetadataSwitch
                    metadata={(post as Post)?.metadata?.__typename!}
                    data={(post as Post)?.metadata as any}
                    setImageView={setImageView}
                  />
                  <ReactionsBar
                    setGifOpen={setGifOpen}
                    setFeed={setFeed}
                    post={post as Post}
                    gifOpen={gifOpen}
                    setCurrentSession={setCurrentSession}
                    setScreen={setScreen}
                    currentSession={currentSession}
                    index={key}
                    sessionClient={sessionClient}
                    setIndexer={setIndexer}
                    setNotification={setNotification}
                    setSignless={setSignless}
                    storageClient={storageClient}
                  />
                </div>
              ) : (
                <div
                  key={key}
                  className="relative w-full h-[32rem] rounded-md bg-white flex flex-col animate-pulse"
                ></div>
              );
            })
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Feed;
