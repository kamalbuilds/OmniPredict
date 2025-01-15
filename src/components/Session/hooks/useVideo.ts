import {
  CurrentSession,
  LensAccount,
} from "@/components/Common/types/common.types";
import { COMFY_WORKFLOWS } from "@/lib/constants";
import { Src } from "@livepeer/react";
import { getSrc } from "@livepeer/react/external";
import { Livepeer } from "livepeer";
import { Session } from "livepeer/models/components";
import { CreateStreamResponse } from "livepeer/models/operations";
import { SetStateAction, useEffect, useRef, useState } from "react";

const useVideo = (
  lensAccount: LensAccount | undefined,
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void
) => {
  const [filter, setFilter] = useState<string>(COMFY_WORKFLOWS[0]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [currentEdit, setCurrentEdit] = useState<
    | (Session & {
        src: Src[] | null;
      })
    | undefined
  >();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [startStreamLoading, setStartStreamLoading] = useState<boolean>(false);
  const [stopStreamLoading, setStopStreamLoading] = useState<boolean>(false);
  const [allStreams, setAllStreams] = useState<Session[]>([]);
  const [currentStream, setCurrentStream] = useState<
    CreateStreamResponse | undefined
  >();
  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY,
  });

  const getCurrentEdit = async (current?: Session) => {
    try {
      let session = current;
      if (!session) {
        session = allStreams?.[0];
      }

      if (!session) return;

      const playbackInfo = await livepeer.playback.get(session?.playbackId!);

      setCurrentEdit({
        ...session,
        src: getSrc(playbackInfo?.playbackInfo),
      });
      setCurrentSession((prev) => ({
        ...prev,
        videoEdit: playbackInfo,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setStartStreamLoading(false);
  };

  const getAllStreams = async () => {
    if (!lensAccount?.account) return;
    try {
      const streamsRes = await livepeer.stream.getAll();
      const streamIds = streamsRes.data
        ?.filter((stream) =>
          stream?.name?.includes(
            lensAccount?.account?.username?.localName! + "-"
          )
        )
        .map((st) => st?.id);

      const res = await livepeer.session.getAll();

      setAllStreams(
        res.data
          ?.filter((stream) => streamIds?.includes(stream?.parentId))
          ?.sort((a, b) => Number(b.createdAt) - Number(a.createdAt)) || []
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setStartStreamLoading(false);
  };

  const startStream = async () => {
    if (!lensAccount) return;
    setStartStreamLoading(true);
    try {
      const res = await livepeer.stream.create({
        name: lensAccount?.account?.username?.localName + "-" + new Date(),
        record: true,
      });

      setCurrentStream(res);
      setCurrentSession((prev) => ({
        ...prev,
        video: res.stream!,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setStartStreamLoading(false);
  };

  const stopStream = async () => {
    if (!currentStream) return;
    setStopStreamLoading(true);
    try {
      await livepeer.stream.terminate(currentStream.stream?.id!);

      await getAllStreams();
      setCurrentStream(undefined);
    } catch (err: any) {
      console.error(err.message);
    }
    setStopStreamLoading(false);
  };

  const sendFilterOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const json = await import(`${process.env.NEXT_PUBLIC_FILE_PATH}` + filter.replaceAll(" ", "") + ".json")
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "http://127.0.0.1:8889",
          prompt: json.default,
          offer,
        }),
      });

      if (!response.ok) {
        throw new Error(`offer HTTP error: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    getAllStreams();
    startStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef, editing]);

  useEffect(() => {
    if (editing) {
      getCurrentEdit();
    } else {
      stopStream();
    }
  }, [editing]);

  const setupWebRTCConnection = async () => {
    const configuration = {
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
      ],
    };
  
    const peerConnection = new RTCPeerConnection(configuration);
  
    peerConnection.ontrack = (event) => {
      if (event.track.kind === "video") {
        setRemoteStream(event.streams[0]); 
      }
    };
  
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  
    const answer = await sendFilterOffer(offer);
    if (answer && answer.sdp) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  };
  

  useEffect(() => {
    setupWebRTCConnection();
  }, [filter]);

  useEffect(() => {

    if (videoRef.current && remoteStream) {
      console.log("remoteStream", remoteStream);
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return {
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
    setEditing,
    currentEdit,
    setCurrentEdit,
    getCurrentEdit,
    setCurrentStream,
  };
};

export default useVideo;
