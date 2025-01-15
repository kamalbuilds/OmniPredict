"use client";
import { AppContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import ImageViewer from "./ImageViewer";
import { useAccount } from "wagmi";
import CreateAccount from "./CreateAccount";
import Indexer from "./Indexer";
import Notification from "./Notification";
import Gif from "./Gif";
import Signless from "./Signless";
import PostLive from "./PostLive";

const Modals: FunctionComponent = (): JSX.Element => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  return (
    <>
      {context?.gifOpen?.open && <Gif setGifOpen={context?.setGifOpen} />}
      {context?.postLive && (
        <PostLive
          setPostLive={context?.setPostLive}
          setIndexer={context?.setIndexer}
          storageClient={context?.storageClient!}
          sessionClient={context?.lensAccount?.sessionClient!}
          setNotification={context?.setNotification}
          setSignless={context?.setSignless!}
          currentSession={context?.currentSession!}
        />
      )}
      {context?.indexer && (
        <Indexer indexer={context?.indexer} setIndexer={context?.setIndexer} />
      )}
      {context?.imageView && (
        <ImageViewer
          imageView={context?.imageView}
          setImageView={context?.setImageView}
        />
      )}
      {context?.notification && (
        <Notification
          notification={context?.notification}
          setNotification={context?.setNotification}
        />
      )}
      {context?.signless && (
        <Signless
          lensAccount={context?.lensAccount}
          setSignless={context?.setSignless}
        />
      )}
      {context?.createAccount && (
        <CreateAccount
          address={address}
          setLensAccount={context?.setLensAccount}
          lensAccount={context?.lensAccount}
          setCreateAccount={context?.setCreateAccount}
          setIndexer={context?.setIndexer}
          storageClient={context?.storageClient!}
        />
      )}
    </>
  );
};

export default Modals;
