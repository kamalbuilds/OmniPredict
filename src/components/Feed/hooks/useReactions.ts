import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction, useState } from "react";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { MainContentFocus, Post, SessionClient } from "@lens-protocol/client";
import { v4 as uuidv4 } from "uuid";
import createRepost from "../../../../graphql/lens/mutations/createRepost";
import addReaction from "../../../../graphql/lens/mutations/addReaction";

const useReactions = (
  storageClient: StorageClient,
  sessionClient: SessionClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  post: Post,
  setFeed: (e: SetStateAction<Post[]>) => void,
  gifOpen: { id: string; gif: string } | undefined
) => {
  const [content, setContent] = useState<string>("");
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [interactionsLoading, setInteractionsLoading] = useState<{
    mirror: boolean;
    like: boolean;
  }>({
    mirror: false,
    like: false,
  });
  const [commentQuote, setCommentQuote] = useState<
    "Comment" | "Quote" | undefined
  >();

  const handleComment = async () => {
    if (!commentQuote) return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image = {};
      if (gifOpen?.id == commentQuote) {
        focus = MainContentFocus.Image;
        schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";
        image = {
          type: "image/png",
          item: gifOpen?.gif,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: content?.slice(0, 10),
          content: content,
          id: uuidv4(),
          locale: "en",
          ...image,
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
          commentOn: {
            post: post?.id,
          },
        },
        sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setContent("");
        setCommentQuote(undefined);
        setIndexer?.("Comment Indexing");
        setFeed((prev) => {
          const newFeed = [...prev];

          newFeed[newFeed?.findIndex((p) => p?.id == post?.id)] = {
            ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)],
            operations: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                ?.operations!,
              hasCommented: {
                ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                  ?.operations?.hasCommented!,
                onChain: true,
                optimistic: true,
              },
            },
            stats: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats!,
              comments:
                Number(
                  newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats
                    ?.comments || 0
                ) + 1,
            },
          };

          return newFeed;
        });
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handleLike = async () => {
    setInteractionsLoading({
      ...interactionsLoading,
      like: true,
    });
    try {
      const res = await addReaction(
        {
          post: post?.id,
          reaction: post?.operations?.hasUpvoted ? "DOWNVOTE" : "UPVOTE",
        },
        sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.success) {
        setIndexer?.("Reaction Success");
        setFeed((prev) => {
          const newFeed = [...prev];

          newFeed[newFeed?.findIndex((p) => p?.id == post?.id)] = {
            ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)],
            operations: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                ?.operations!,
              hasUpvoted:
                newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                  ?.operations?.hasUpvoted!,
            },
            stats: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats!,
              reactions:
                Number(
                  newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats
                    ?.reactions || 0
                ) + 1,
            },
          };

          return newFeed;
        });
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading({
      ...interactionsLoading,
      like: false,
    });
  };

  const handleMirror = async () => {
    setInteractionsLoading({
      ...interactionsLoading,
      mirror: true,
    });
    try {
      const res = await createRepost(
        {
          post: post?.id,
        },
        sessionClient!
      );
      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setIndexer?.("Mirror Indexing");
        setFeed((prev) => {
          const newFeed = [...prev];

          newFeed[newFeed?.findIndex((p) => p?.id == post?.id)] = {
            ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)],
            operations: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                ?.operations!,
              hasReposted: {
                ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                  ?.operations?.hasReposted!,
                onChain: true,
                optimistic: true,
              },
            },
            stats: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats!,
              reposts:
                Number(
                  newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats
                    ?.reposts || 0
                ) + 1,
            },
          };

          return newFeed;
        });
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading({
      ...interactionsLoading,
      mirror: false,
    });
  };

  const handleQuote = async () => {
    if (!commentQuote) return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image = {};
      if (gifOpen?.id == commentQuote) {
        focus = MainContentFocus.Image;
        schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";
        image = {
          type: "image/png",
          item: gifOpen?.gif,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: content?.slice(0, 10),
          content: content,
          id: uuidv4(),
          locale: "en",
          ...image,
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
          quoteOf: {
            post: post?.id,
          },
        },
        sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setContent("");
        setCommentQuote(undefined);
        setIndexer?.("Quote Indexing");
        setFeed((prev) => {
          const newFeed = [...prev];

          newFeed[newFeed?.findIndex((p) => p?.id == post?.id)] = {
            ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)],
            operations: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                ?.operations!,
              hasQuoted: {
                ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]
                  ?.operations?.hasQuoted!,
                onChain: true,
                optimistic: true,
              },
            },
            stats: {
              ...newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats!,
              quotes:
                Number(
                  newFeed[newFeed?.findIndex((p) => p?.id == post?.id)]?.stats
                    ?.quotes || 0
                ) + 1,
            },
          };

          return newFeed;
        });
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  return {
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
  };
};

export default useReactions;
