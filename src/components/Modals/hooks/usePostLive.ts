import { MainContentFocus, SessionClient } from "@lens-protocol/client";
import { SetStateAction, useEffect, useState } from "react";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { v4 as uuidV4 } from "uuid";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { CurrentSession } from "@/components/Common/types/common.types";
import { EditorType } from "@/components/Feed/types/feed.types";
import { Livepeer } from "livepeer";
import { getSrc } from "@livepeer/react/external";
import { Src } from "@livepeer/react";

const usePostLive = (
  sessionClient: SessionClient,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  currentSession: CurrentSession,
  setNotification: (e: SetStateAction<string | undefined>) => void
) => {
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [postComment, setPostComment] = useState<string>("");
  const [postType, setPostType] = useState<boolean>(false);
  const [liveStreamSource, setLiveStreamSource] = useState<Src[] | null>(null);
  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY,
  });

  const handlePost = async () => {
    if (
      currentSession?.text?.trim() == "" &&
      !currentSession?.image &&
      !currentSession?.video
    )
      return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image_content = {};
      let video_content = {};
      if (
        currentSession?.image &&
        currentSession?.editors?.[currentSession?.currentIndex] ==
          EditorType.Image
      ) {
        focus = MainContentFocus.Image;
        schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";

        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: currentSession?.image,
        });

        let responseJSON = await response.json();

        image_content = {
          type: "image/png",
          item: "ipfs://" + responseJSON?.cid,
        };
      } else if (
        currentSession?.video &&
        currentSession?.editors?.[currentSession?.currentIndex] ==
          EditorType.Video
      ) {
        focus = MainContentFocus.Video;
        schema = "https://json-schemas.lens.dev/posts/video/3.0.0.json";

        const playbackInfo = await livepeer.playback.get(
          currentSession?.video?.playbackId!
        );
        const src = getSrc(playbackInfo?.playbackInfo);

        if (src?.[0]?.src!) {
          const res = await fetch(src?.[0]?.src);
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: await res.blob(),
          });

          let responseJSON = await response.json();

          video_content = {
            type: "video/mp4",
            item: "ipfs://" + responseJSON?.cid,
          };
        }
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: (currentSession?.text &&
          currentSession?.editors?.[currentSession?.currentIndex] ==
            EditorType.Text
            ? currentSession?.text
            : postComment
          )?.slice(0, 10),
          content:
            currentSession?.text &&
            currentSession?.editors?.[currentSession?.currentIndex] ==
              EditorType.Text
              ? currentSession?.text
              : postComment,
          id: uuidV4(),
          ...image_content,
          ...video_content,
          locale: "en",
          tags: ["dialtone"],
        },
      });

      let res;
      if (postType) {
        res = await createPost(
          {
            contentUri: uri,
            quoteOf: currentSession?.post?.id,
          },
          sessionClient!
        );
      } else {
        res = await createPost(
          {
            contentUri: uri,
          },
          sessionClient!
        );
      }

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setPostComment("");
        setIndexer?.("Post Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  useEffect(() => {
    if (currentSession) {
      const setSrc = async () => {
        const playbackInfo = await livepeer.playback.get(
          currentSession?.video?.playbackId!
        );
        const src = getSrc(playbackInfo?.playbackInfo);
        setLiveStreamSource(src);
      };
      setSrc();
    }
  }, []);

  return {
    handlePost,
    postLoading,
    postComment,
    setPostComment,
    postType,
    setPostType,
    liveStreamSource
  };
};

export default usePostLive;
