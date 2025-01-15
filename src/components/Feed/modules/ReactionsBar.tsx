import { INFURA_GATEWAY, SCREENS } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { EditorType, ReactionsBarProps } from "../types/feed.types";
import { GoHeartFill, GoHeart } from "react-icons/go";
import useReactions from "../hooks/useReactions";

const ReactionsBar: FunctionComponent<ReactionsBarProps> = ({
  setScreen,
  post,
  setCurrentSession,
  currentSession,
  index,
  setGifOpen,
  gifOpen,
  storageClient,
  sessionClient,
  setSignless,
  setIndexer,
  setNotification,
  setFeed
}): JSX.Element => {
  const {
    postLoading,
    handleComment,
    interactionsLoading,
    handleLike,
    handleMirror,
    handleQuote,
    commentQuote,
    setCommentQuote,
    content,
    setContent,
  } = useReactions(
    storageClient,
    sessionClient,
    setSignless,
    setIndexer,
    setNotification,
    post,
    setFeed,
    gifOpen,
    
  );

  return (
    <div className="relative w-full h-fit flex flex-col gap-3 p-2">
      <div className="relative w-full h-fit flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 sm:gap-3">
        <div className="relative w-full h-fit flex flex-col items-start justify-center gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center gap-2">
            <div className="relative flex w-fit h-fit">
              <div className="relative w-8 h-8 flex">
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                />
              </div>
            </div>
            <div
              className={`relative px-3 py-1 flex items-center justify-between flex-row gap-2 text-black w-40 h-8`}
            >
              <div className="absolute top-0 left-0 flex w-40 h-8">
                <Image
                  src={`${INFURA_GATEWAY}QmWg46fikev1HPfq676w17YmtPmySeaw2gTXZV1biEqWbV`}
                  layout="fill"
                  objectFit="fill"
                  draggable={false}
                />
              </div>
              {[
                {
                  image: "QmYvafNLFpXjYLL5osdvoDTAAfuYBGKAMQyH8eXGynwJNd",
                  title: EditorType.Video,
                },
                {
                  image: "QmRHVXnb2C4DwZebG7v6wXMWCAcrQrRX7T1ch7u3kU3Vyb",
                  title: EditorType.Image,
                },
                {
                  image: "QmUpZ4Tc3hXSPcrGtovVaG5ggZY13UWrnfFtrRpiQs73xK",
                  title: EditorType.Audio,
                },
                {
                  image: "QmRjCfexkJNTmxFxcTNzeoM2UZyYSA3j88E9rN98nZ7jTP",
                  title: EditorType.Text,
                },
              ].map((item, key) => {
                return (
                  <div
                    key={key}
                    className={`relative w-fit p-1 rounded-full h-fit flex cursor-pointer hover:opacity-70 ${
                      currentSession?.editors?.find((_, ind) => ind == index) ==
                        item.title && "bg-sea"
                    }`}
                    title={item.title}
                    onClick={() =>
                      setCurrentSession((prev) => {
                        let current = { ...prev };

                        let editors = [...current.editors];

                        editors[index] = item.title;

                        current.editors = editors;

                        return current;
                      })
                    }
                  >
                    <div className="relative w-5 h-5 flex">
                      <Image
                        src={`${INFURA_GATEWAY}${item.image}`}
                        draggable={false}
                        objectFit="contain"
                        layout="fill"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative flex w-fit h-fit">
            <div
              className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
              onClick={() => {
                setScreen(SCREENS[1]);

                setCurrentSession((prev) => ({
                  ...prev,
                  post,
                  currentIndex: index,
                }));
              }}
            >
              <div className="absolute top-0 left-0 flex w-28 h-8">
                <Image
                  src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                  layout="fill"
                  objectFit="fill"
                  draggable={false}
                />
              </div>
              <div className="relative flex w-fit h-fit text-xs font-digi">
                SEND 2 SESSION
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-end justify-center gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center gap-1">
            {gifOpen?.id == post?.id &&
              gifOpen?.gif &&
              gifOpen?.gif?.trim() !== "" && (
                <div className="relative flex w-fit h-fit">
                  <div
                    className="relative w-6 h-6 flex cursor-pointer rounded-sm border border-sea bg-viol"
                    onClick={() =>
                      setGifOpen((prev) => ({
                        ...prev,
                        open: true,
                      }))
                    }
                  >
                    <Image
                      layout="fill"
                      objectFit="fill"
                      className="rounded-sm"
                      draggable={false}
                      src={gifOpen?.gif}
                    />
                  </div>
                </div>
              )}
            <div className="relative flex w-fit h-fit">
              <div
                className="relative w-6 h-6 flex cursor-pointer"
                onClick={() =>
                  setGifOpen((prev) => ({
                    ...prev,
                    id: post?.id,
                    open: true,
                  }))
                }
              >
                <Image
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmXYPrKHmVeou3eAReLqKmdb1VVEMy8LRojyQcNXytqqKS`}
                />
              </div>
            </div>
            <div className="relative flex w-fit h-fit">
              <div className="relative w-28 h-8 flex">
                <Image
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmQvkQrD3dkkLXTMoVz8NW9bpzvv9gtLLm4yYzfBfhqK82`}
                />
              </div>
            </div>
          </div>
          <div
            className={`relative flex items-center justify-between flex-row gap-2 text-black w-44 h-8 px-2`}
          >
            <div className="absolute top-0 left-0 flex w-44 h-8">
              <Image
                src={`${INFURA_GATEWAY}QmZHdpwvh3nCwMd3rqMoJWCCb4QBYom7JYXzHDDk65eQn6`}
                layout="fill"
                objectFit="fill"
                draggable={false}
              />
            </div>
            {[
              {
                image: "QmVt1gqUk9fKJ4tziHiSud1WTYgvCN6VaA9X2VonchuaBL",
                title: "Retweet",
                function: () => handleMirror(),
                stats: post?.stats?.reposts,
                loader: interactionsLoading?.mirror,
              },
              {
                image: "QmdEh4nJuDEhTvhrqFnSRrbdHpof7PVu817pCCTDq69LiE",
                title: "Comment",
                function: () =>
                  setCommentQuote(
                    commentQuote == "Comment" ? undefined : "Comment"
                  ),
                stats: post?.stats?.comments,
                loader: false,
              },
              {
                image: "QmWQd2UnzNbUYB5dDB3JUFEQqgWYehohCMvGT4ZwySGCgS",
                title: "Quote",
                function: () =>
                  setCommentQuote(
                    commentQuote == "Quote" ? undefined : "Quote"
                  ),
                stats: post?.stats?.quotes,
                loader: false,
              },
              {
                svg: <GoHeart size={15} color="black" />,
                svgFill: <GoHeartFill size={15} color="black" />,
                title: "Like",
                function: () => handleLike(),
                stats: post?.stats?.reactions,
                loader: interactionsLoading?.like,
              },
            ].map((item, key) => {
              return (
                <div
                  key={key}
                  className={`relative w-fit flex flex-row gap-1 rounded-full h-fit flex cursor-pointer hover:opacity-70 font-digi text-xs items-center justify-center`}
                  onClick={() => item.function()}
                  title={item.title}
                >
                  <div className="relative w-fit h-fit flex">
                    {item?.loader ? (
                      <div className="relative w-5 h-5 animate-spin flex">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                        />
                      </div>
                    ) : item.image ? (
                      <div className="relative w-5 h-5 flex">
                        <Image
                          src={`${INFURA_GATEWAY}${item.image}`}
                          draggable={false}
                          objectFit="contain"
                          layout="fill"
                        />
                      </div>
                    ) : (
                      item.svg
                    )}
                  </div>
                  <div className="relative w-fit h-fit flex">
                    {item.stats || 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {commentQuote && (
        <div className="relative w-full h-fit flex items-start justify-start bg-[#212121] p-4 flex-col gap-2">
          <div className="relative w-full h-fit flex p-3 rounded-md bg-[#2F2F2F]">
            <textarea
              style={{
                resize: "none",
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="relative w-full h-fit flex p-3 rounded-lg border border-viol bg-dBlue p-6 h-32 overflow-y-scroll text-sun text-sm"
            />
          </div>
          <div className="relative flex w-full justify-end h-fit">
            <div
              className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
              onClick={() =>
                !postLoading &&
                (commentQuote == "Quote" ? handleQuote() : handleComment())
              }
            >
              <div className="absolute top-0 left-0 flex w-28 h-8">
                <Image
                  src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                  layout="fill"
                  objectFit="fill"
                  draggable={false}
                />
              </div>
              {postLoading ? (
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
                  {commentQuote}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionsBar;
