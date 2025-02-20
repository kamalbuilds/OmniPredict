import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { INFURA_GATEWAY } from "@/lib/constants";
import { PostLiveProps } from "../types/modals.types";
import usePostLive from "../hooks/usePostLive";
import { EditorType } from "@/components/Feed/types/feed.types";
import * as Player from "@livepeer/react/player";
import {
  LoadingIcon,
  PlayIcon,
  PauseIcon,
  MuteIcon,
  UnmuteIcon,
} from "@livepeer/react/assets";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";

const PostLive: FunctionComponent<PostLiveProps> = ({
  setNotification,
  sessionClient,
  setSignless,
  setIndexer,
  storageClient,
  currentSession,
  setPostLive,
}): JSX.Element => {
  const {
    handlePost,
    postLoading,
    postComment,
    setPostComment,
    postType,
    setPostType,
    liveStreamSource,
  } = usePostLive(
    sessionClient,
    storageClient,
    setSignless,
    setIndexer,
    currentSession,
    setNotification
  );
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer items-center justify-center"
      onClick={() => setPostLive(false)}
    >
      <div
        className="rounded-md border border-viol w-96 h-fit text-sm text-white flex items-center justify-start p-3 cursor-default flex-col gap-6 bg-sea"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-fit pb-3 h-fit flex items-center justify-center">
          Share Your Session
        </div>
        <div className="relative w-full h-fit flex flex-col items-center justify-center gap-1">
          <div className="relative w-fit h-fit flex">
            New Post or Quote of {currentSession?.post?.id?.slice(0, 5) + "..."}
            ?
          </div>
          <div className="relative flex w-full justify-center h-fit">
            <div
              className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 ${
                !postLoading && "cursor-pointer active:scale-95"
              }`}
              onClick={() => !postLoading && setPostType(!postType)}
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
                  {postType ? "New Post" : "Quote"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-center">
          {currentSession?.text &&
          currentSession?.editors?.[currentSession?.currentIndex] ==
            EditorType.Text ? (
            <EditorProvider
              content={currentSession?.text}
              editable={false}
              editorProps={{
                attributes: {
                  class:
                    "relative w-full h-fit max-h-52 flex rounded-md border border-sea overflow-y-scroll p-1.5 bg-gris/70",
                },
              }}
              extensions={[
                Color.configure({
                  types: [TextStyle.name, ListItem.name],
                }),
                TextStyle,
                StarterKit.configure({
                  bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                  },
                  orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                  },
                }),
              ]}
            ></EditorProvider>
          ) : currentSession?.image &&
            currentSession?.editors?.[currentSession?.currentIndex] ==
              EditorType.Image ? (
            <div className="relative w-full h-52 flex rounded-md border border-sea bg-gris/70">
              <Image
                src={URL.createObjectURL(currentSession?.image)}
                draggable={false}
                layout="fill"
                className="rounded-md"
                objectFit="cover"
              />
            </div>
          ) : (
            currentSession?.video &&
            currentSession?.editors?.[currentSession?.currentIndex] ==
              EditorType.Video && (
              <Player.Root autoPlay src={liveStreamSource}>
                <Player.Container className="relative flex w-full h-full">
                  <Player.Video
                    title="Edit stream"
                    className="relative flex w-full h-full rounded-md"
                  />
                  <Player.LoadingIndicator className="w-full relative h-full bg-black/50 backdrop-blur data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <LoadingIcon className="w-8 h-8 animate-spin" />
                    </div>
                  </Player.LoadingIndicator>

                  <Player.Controls className="flex items-center justify-center">
                    <Player.PlayPauseTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0">
                      <Player.PlayingIndicator asChild matcher={false}>
                        <PlayIcon className="w-full h-full" />
                      </Player.PlayingIndicator>
                      <Player.PlayingIndicator asChild>
                        <PauseIcon className="w-full h-full" />
                      </Player.PlayingIndicator>
                    </Player.PlayPauseTrigger>

                    <Player.MuteTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0">
                      <Player.VolumeIndicator asChild matcher={false}>
                        <MuteIcon className="w-full h-full" />
                      </Player.VolumeIndicator>
                      <Player.VolumeIndicator asChild matcher={true}>
                        <UnmuteIcon className="w-full h-full" />
                      </Player.VolumeIndicator>
                    </Player.MuteTrigger>
                    <Player.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-[120px] h-5">
                      <Player.Track className="bg-white/30 relative grow rounded-full transition h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
                        <Player.Range className="absolute bg-white rounded-full h-full" />
                      </Player.Track>
                      <Player.Thumb className="block transition group-hover:scale-110 w-3 h-3 bg-white rounded-full" />
                    </Player.Volume>
                  </Player.Controls>
                </Player.Container>
              </Player.Root>
            )
          )}
        </div>
        {currentSession?.editors?.[currentSession?.currentIndex] !=
          EditorType.Text && (
          <div className="relative w-full h-fit flex flex-col gap-2 items-center justify-center">
            <div className="relative w-fit h-fit flex">
              Additional Comments:
            </div>
            <textarea
              disabled={postLoading}
              onChange={(e) => setPostComment(e.target.value)}
              className="relative w-full bg-gris/70 h-14 overflow-y-scroll border border-viol focus:outline-none p-1"
              value={postComment}
              style={{
                resize: "none",
              }}
            ></textarea>
          </div>
        )}
        <div className="relative flex w-full justify-center h-fit">
          <div
            className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 ${
              !postLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !postLoading && handlePost()}
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
                {postType ? "Quote Live" : "Post Live"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLive;
