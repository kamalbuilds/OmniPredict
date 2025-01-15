import { EditorType } from "@/components/Feed/types/feed.types";
import { FunctionComponent, JSX } from "react";
import { SessionSwitchProps } from "../types/session.types";
import Wheel from "@uiw/react-color-wheel";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menu from "./Menu";
import useImage from "../hooks/useImage";
import Image from "next/legacy/image";
import { COMFY_WORKFLOWS, INFURA_GATEWAY } from "@/lib/constants";
import useVideo from "../hooks/useVideo";
import * as Player from "@livepeer/react/player";
import {
  LoadingIcon,
  PlayIcon,
  PauseIcon,
  MuteIcon,
  UnmuteIcon,
  EnableVideoIcon,
  StopIcon,
} from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

const SessionSwitch: FunctionComponent<SessionSwitchProps> = ({
  currentSession,
  setCurrentSession,
  saveSessionLoading,
  expand,
  lensAccount,
}): JSX.Element => {
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleUpload,
    canvasRef,
    image,
    clearImage,
    setBrushColor,
    brushColor,
    setBrushSize,
    brushSize,
    parentRef,
  } = useImage(saveSessionLoading, setCurrentSession);
  const {
    filter,
    setFilter,
    videoRef,
    startStream,
    stopStream,
    startStreamLoading,
    stopStreamLoading,
    currentStream,
    allStreams,
    editing,
    currentEdit,
    setEditing,
    setCurrentEdit,
    getCurrentEdit,
    setCurrentStream,
  } = useVideo(lensAccount, setCurrentSession);

  switch (currentSession?.editors?.[currentSession?.currentIndex]) {
    case EditorType.Audio:
      return (
        <div className="relative w-full h-full flex items-center justify-center text-xs font-digi text-black">
          Audio coming soon.
        </div>
      );
    case EditorType.Image:
      return (
        <div
          className="relative w-full h-full items-center justify-center flex gap-4 flex-col border border-sea rounded-md text-xs font-digi text-black"
          ref={parentRef}
          key={`parent-${expand.toString()}`}
        >
          <canvas
            ref={canvasRef}
            width={"100%"}
            height={"100%"}
            key={`canvas-${expand.toString()}`}
            style={{
              width: parentRef.current?.clientWidth,
              height: parentRef.current?.clientHeight,
            }}
            onMouseDown={() => handleMouseDown()}
            onMouseUp={() => handleMouseUp()}
            onMouseMove={(e) => handleMouseMove(e as any)}
          />
          {!image && (
            <label
              className={`absolute cursor-pointer top-0 left-0 flex w-full h-full items-center justify-center`}
              title="Upload Image"
            >
              <div className="relative w-fit h-fit">Upload Image.</div>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleUpload(e)}
                hidden
                required
                multiple={false}
                className="relative w-full h-full cursor-pointer"
              />
            </label>
          )}
          {image && (
            <div className="absolute top-3 right-3 flex flex-row gap-2 text-xs text-black font-digi w-fit h-fit">
              <label
                className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
              >
                <div className="absolute top-0 left-0 flex w-28 h-8">
                  <Image
                    src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                    layout="fill"
                    objectFit="fill"
                    draggable={false}
                  />
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => !saveSessionLoading && handleUpload(e)}
                  hidden
                  required
                  disabled={saveSessionLoading}
                  multiple={false}
                  className="relative w-full h-full cursor-pointer"
                />
                <div className="relative flex w-fit h-fit font-digi">
                  New Image
                </div>
              </label>
              <div
                className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 cursor-pointer active:scale-95`}
                onClick={() => !saveSessionLoading && clearImage()}
              >
                <div className="absolute top-0 left-0 flex w-28 h-8">
                  <Image
                    src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                    layout="fill"
                    objectFit="fill"
                    draggable={false}
                  />
                </div>

                <div className="relative flex w-fit h-fit font-digi">
                  Delete Image
                </div>
              </div>
            </div>
          )}
          {image && (
            <div className="absolute bottom-3 left-3 flex flex-row gap-2 text-xs text-black font-digi w-fit h-fit items-center justify-center">
              <Wheel
                color={brushColor}
                onChange={(color) =>
                  setBrushColor({ ...brushColor, ...color.hsva })
                }
                width={40}
                height={40}
              />
              <label className="relative w-20 h-fit flex">
                <input
                  type="range"
                  className="custom-range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                />
              </label>
            </div>
          )}
        </div>
      );

    case EditorType.Text:
      return (
        <div className="relative w-full h-full items-start justify-start flex gap-4 flex-col">
          <EditorProvider
            slotBefore={<Menu />}
            content={currentSession?.text}
            editorProps={{
              attributes: {
                class:
                  "border w-full h-full overflow-y-scroll border-sea p-2 focus:outline-none",
              },
            }}
            key={expand.toString()}
            editable={!saveSessionLoading}
            extensions={[
              Color.configure({ types: [TextStyle.name, ListItem.name] }),
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
            onUpdate={({ editor }) =>
              setCurrentSession({
                ...currentSession,
                text: editor.getHTML(),
              })
            }
          ></EditorProvider>
        </div>
      );

    default:
      return (
        <div className="relative w-full h-full items-center justify-between flex gap-4 flex-col sm:flex-row border border-sea rounded-md text-xs">
          <div className="relative w-full sm:w-32 h-full flex items-start justify-between gap-3 flex flex-col p-2">
            <div className="relative w-full h-fit flex flex-row gap-2 justify-between items-center gap-2 text-xxs text-black">
              <div className="relative flex w-fit h-fit flex flex-col gap-2 items-center justify-center">
                {startStreamLoading || stopStreamLoading ? (
                  <div className="relative w-6 h-6 animate-spin flex">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (editing) {
                        setEditing(false);
                        return;
                      }
                      if (
                        !startStreamLoading &&
                        !stopStreamLoading &&
                        !currentStream
                      ) {
                        startStream();
                        setCurrentEdit(undefined);
                      }
                    }}
                    className={`relative flex w-6 h-6 flex rounded-full bg-[#A13CFF] ${
                      !startStreamLoading &&
                      !stopStreamLoading &&
                      !currentStream &&
                      "cursor-pointer"
                    }`}
                  ></div>
                )}
                <div className="relative w-fit h-fit flex text-center">
                  {!currentStream || editing
                    ? "New Stream"
                    : currentStream && currentStream?.stream?.isActive !== true
                    ? "Record Live"
                    : "Stop Record"}
                </div>
              </div>
              <div className="relative flex w-fit h-fit flex flex-col gap-2 items-center justify-center">
                <div
                  className="relative flex w-7 h-7 flex cursor-pointer"
                  onClick={() => setEditing(!editing)}
                >
                  <Image
                    draggable={false}
                    layout="fill"
                    objectFit="cover"
                    src={`${INFURA_GATEWAY}QmQN4awzCdSdQvoTRKbSKPd1njyzey7JzREZ1edKPCUQeq`}
                  />
                </div>
                <div className="relative w-fit h-fit flex text-center">
                  Edit Video
                </div>
              </div>
            </div>
            <div className="relative w-full h-full flex items-start justify-start overflow-y-scroll">
              <div className="relative w-full sm:w-28 h-fit flex items-start justify-start gap-2 flex-wrap sm:flex-col font-digi text-sun text-xxs text-center">
                {editing
                  ? allStreams.map((st, index) => {
                      return (
                        <div
                          onClick={() => getCurrentEdit(st)}
                          key={index}
                          className={`cursor-pointer hover:opacity-70 relative w-full h-fit px-1 py-1 items-center justify-center flex bg-darker rounded-full ${
                            st?.id == currentEdit?.id && "border-2 border-sun"
                          }`}
                        >
                          {
                            new Date(st?.createdAt!)
                              .toString()
                              ?.split(" GMT")?.[0]
                          }
                        </div>
                      );
                    })
                  : COMFY_WORKFLOWS.map((fil, index) => {
                      return (
                        <div
                          onClick={() => setFilter(fil)}
                          key={index}
                          className={`cursor-pointer hover:opacity-70 relative w-full h-fit px-2 py-1 items-center justify-center flex bg-darker rounded-full ${
                            fil == filter && "border-2 border-sun"
                          }`}
                        >
                          {fil}
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
          <div className="relative w-full h-full flex items-start justify-between gap-3 flex-col p-2">
            {!editing ? (
              <>
                <div className="relative w-full h-72 sm:h-full bg-darker rounded-md flex">
                  <Broadcast.Root
                    video={true}
                    audio={false}
                    ingestUrl={getIngest(currentStream?.stream?.streamKey)}
                  >
                    <Broadcast.Container>
                      <Broadcast.Video
                        title="Livestream"
                        className="relative flex w-full h-full object-cover rounded-md"
                      />

                      {currentStream && (
                        <Broadcast.Controls className="flex items-center justify-center relative">
                          <Broadcast.EnabledTrigger className="w-6 h-6 flex relative">
                            <Broadcast.EnabledIndicator
                              asChild
                              matcher={false}
                              onClick={() =>
                                setCurrentStream({
                                  ...currentStream!,
                                  stream: {
                                    ...currentStream?.stream!,
                                    isActive: true,
                                  },
                                })
                              }
                            >
                              <EnableVideoIcon className="w-full h-full bg-[#A13CFF]" />
                            </Broadcast.EnabledIndicator>
                            <Broadcast.EnabledIndicator asChild>
                              <StopIcon
                                onClick={() => stopStream()}
                                className="w-full h-full bg-red-500 animate-pulse"
                              />
                            </Broadcast.EnabledIndicator>
                          </Broadcast.EnabledTrigger>
                        </Broadcast.Controls>
                      )}
                      <Broadcast.LoadingIndicator asChild matcher={false}>
                        <div className="absolute overflow-hidden py-1 px-2 rounded-full top-1 left-1 bg-black/50 flex items-center backdrop-blur">
                          <Broadcast.StatusIndicator
                            matcher="live"
                            className="flex gap-2 items-center"
                          >
                            <div className="bg-red-500 animate-pulse h-1.5 w-1.5 rounded-full" />
                            <span className="text-xs select-none">LIVE</span>
                          </Broadcast.StatusIndicator>

                          <Broadcast.StatusIndicator
                            className="flex gap-2 items-center"
                            matcher="pending"
                          >
                            <div className="bg-white/80 h-1.5 w-1.5 rounded-full animate-pulse" />
                            <span className="text-xs select-none">LOADING</span>
                          </Broadcast.StatusIndicator>

                          <Broadcast.StatusIndicator
                            className="flex gap-2 items-center"
                            matcher="idle"
                          >
                            <div className="bg-white/80 h-1.5 w-1.5 rounded-full" />
                            <span className="text-xs select-none">IDLE</span>
                          </Broadcast.StatusIndicator>
                        </div>
                      </Broadcast.LoadingIndicator>
                    </Broadcast.Container>
                  </Broadcast.Root>
                </div>
                <div className="relative w-full h-60 sm:h-full bg-darker rounded-md flex">
                  <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                    playsInline
                    muted
                    autoPlay
                  ></video>
                </div>
              </>
            ) : (
              <div className="relative w-full h-60 bg-darker rounded-md flex">
                <Player.Root
                  autoPlay
                  src={currentEdit?.src!}
                >
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
              </div>
            )}
          </div>
        </div>
      );
  }
};

export default SessionSwitch;
