import { SetStateAction, useEffect, useState } from "react";
import {
  Account,
  AccountStats,
  MainContentFocus,
  PageSize,
  Post,
  PostReferenceType,
  PostType,
  PublicClient,
  SessionClient,
} from "@lens-protocol/client";
import {
  fetchAccountStats,
  fetchPostReferences,
  fetchPosts,
  fetchTimeline,
  follow,
  unfollow,
} from "@lens-protocol/client/actions";
import { EditorType } from "@/components/Feed/types/feed.types";
import { StorageClient } from "@lens-protocol/storage-node-client";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { v4 as uuidv4 } from "uuid";
import {
  CurrentSession,
  LensAccount,
} from "@/components/Common/types/common.types";
import { STORAGE_NODE } from "@/lib/constants";

const useReach = (
  lensAccount: LensAccount | undefined,
  client: PublicClient,
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void,
  storageClient: StorageClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  gifOpen: { id: string; gif: string; open: boolean }
) => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState<string>("");
  const [paginated, setPaginated] = useState<string | undefined>();
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [moreFeedLoading, setMoreFeedLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<AccountStats | undefined>();
  const [feedSwitch, setFeedSwitch] = useState<{
    type: "profile" | "post" | "all";
    profile?: Account;
    post?: Post;
  }>({
    type: "all",
  });
  const [moreFeedPostLoading, setMoreFeedPostLoading] =
    useState<boolean>(false);
  const [moreProfileFeedLoading, setMoreProfileFeedLoading] =
    useState<boolean>(false);
  const [feedProfile, setFeedProfile] = useState<Post[]>([]);
  const [postFeed, setPostFeed] = useState<Post[]>([]);
  const [feedProfileLoading, setFeedProfileLoading] = useState<boolean>(false);
  const [feedPostLoading, setFeedPostLoading] = useState<boolean>(false);
  const [mainPost, setMainPost] = useState<Post[]>([]);
  const [profilePaginated, setProfilePaginated] = useState<
    string | undefined
  >();
  const [feedPaginated, setFeedPaginated] = useState<string | undefined>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const handleFollow = async () => {
    if (!feedSwitch?.profile || !lensAccount?.sessionClient) return;

    setFollowLoading(true);
    try {
      if (feedSwitch?.profile?.operations?.isFollowedByMe) {
        const res = await unfollow(lensAccount?.sessionClient as SessionClient, {
          account: feedSwitch?.profile?.address,
        });

        if (
          (res as any)?.reason?.includes(
            "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
          )
        ) {
          setSignless?.(true);
        } else if (res.isOk()) {
          setIndexer?.("Unfollow Indexing");
          setFeedSwitch((prev) => ({
            ...prev,
            profile: {
              ...prev.profile!,
              operations: {
                ...prev.profile?.operations!,
                isFollowedByMe: false,
              },
            },
          }));
        } else {
          setNotification?.("Something went wrong :( Try again?");
        }
      } else {
        const res = await follow(lensAccount?.sessionClient as SessionClient, {
          account: feedSwitch?.profile?.address,
        });

        if (
          (res as any)?.reason?.includes(
            "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
          )
        ) {
          setSignless?.(true);
        } else if (res.isOk()) {
          setIndexer?.("Follow Indexing");
          setFeedSwitch((prev) => ({
            ...prev,
            profile: {
              ...prev.profile!,
              operations: {
                ...prev.profile?.operations!,
                isFollowedByMe: true,
              },
            },
          }));
        } else {
          setNotification?.("Something went wrong :( Try again?");
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setFollowLoading(false);
  };

  const handleFeed = async () => {
    if (!client || !lensAccount) return;
    setFeedLoading(true);
 
    try {
      const res = await fetchPosts(client, {
        pageSize: PageSize.Ten,
        filter: {
          
          authors: [lensAccount?.account?.address],
        },
      });

      if (res.isOk()) {
        setFeed((res?.value?.items || []) as Post[]);
        setCurrentSession((prev) => ({
          ...prev,
          editors: Array.from(
            { length: (res?.value?.items || []).length },
            (_) => EditorType.Video
          ),
        }));
        setPaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const handleMoreFeed = async () => {
    if (!client || !paginated) return;
    setMoreFeedLoading(true);
    try {
      const res = await fetchPosts(client, {
        pageSize: PageSize.Ten,
        filter: {
          authors: [lensAccount?.account?.address],
        },
        cursor: paginated,
      });

      if (res.isOk()) {
        setFeed([...feed, ...((res?.value?.items || []) as Post[])]);
        setCurrentSession((prev) => ({
          ...prev,
          editors: [
            ...prev.editors,
            ...Array.from(
              { length: (res?.value?.items || []).length },
              (_) => EditorType.Video
            ),
          ],
        }));
        setPaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreFeedLoading(false);
  };

  const handlePost = async () => {
    if (postContent?.trim() == "") return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image = {};
      if (gifOpen?.id == "post-reach") {
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
          title: postContent?.slice(0, 10),
          content: postContent,
          id: uuidv4(),
          locale: "en",
          ...image,
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
        },
        lensAccount?.sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setPostContent("");
        setIndexer?.("Post Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handleUserData = async () => {
    try {
      const res = await fetchAccountStats(client, {
        account: lensAccount?.account?.address,
      });

      if (res?.isOk()) {
        setUserData(res?.value as AccountStats);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handlePostFeed = async () => {
    if (!client) return;
    setFeedPostLoading(true);
    try {
      const res = await fetchPostReferences(client, {
        pageSize: PageSize.Ten,
        referencedPost: feedSwitch.post?.id,
        referenceTypes: [PostReferenceType.CommentOn],
      });

      if (res.isOk()) {
        const posts = (await Promise.all(
          (res?.value?.items || []).map(async (post) => {
            let picture = "";

            if ((post as Post)?.author?.metadata?.picture) {
              const cadena = await fetch(
                `${STORAGE_NODE}/${
                  (post as Post)?.author?.metadata?.picture?.split(
                    "lens://"
                  )?.[1]
                }`
              );

              if (cadena) {
                const json = await cadena.json();
                picture = json.item;
              }
            }

            return {
              ...post,
              author: {
                ...(post as Post)?.author,
                metadata: {
                  ...(post as Post)?.author?.metadata,
                  picture,
                },
              },
            } as Post;
          })
        )) as Post[];

        setPostFeed(posts);
        setCurrentSession((prev) => ({
          ...prev,
          editors: Array.from(
            { length: (res?.value?.items || []).length },
            (_) => EditorType.Video
          ),
        }));
        setFeedPaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedPostLoading(false);
  };

  const handleMorePostFeed = async () => {
    if (!client || !feedPaginated) return;
    setMoreFeedPostLoading(true);
    try {
      const res = await fetchPostReferences(client, {
        pageSize: PageSize.Ten,
        cursor: feedPaginated,
        referencedPost: feedSwitch.post?.id,
        referenceTypes: [PostReferenceType.CommentOn],
      });

      if (res.isOk()) {
        const posts = (await Promise.all(
          (res?.value?.items || []).map(async (post) => {
            let picture = "";

            if ((post as Post)?.author?.metadata?.picture) {
              const cadena = await fetch(
                `${STORAGE_NODE}/${
                  (post as Post)?.author?.metadata?.picture?.split(
                    "lens://"
                  )?.[1]
                }`
              );

              if (cadena) {
                const json = await cadena.json();
                picture = json.item;
              }
            }

            return {
              ...post,
              author: {
                ...(post as Post)?.author,
                metadata: {
                  ...(post as Post)?.author?.metadata,
                  picture,
                },
              },
            } as Post;
          })
        )) as Post[];

        setPostFeed([...postFeed, ...posts]);
        setCurrentSession((prev) => ({
          ...prev,
          editors: [
            ...prev.editors,
            ...Array.from(
              { length: (res?.value?.items || []).length },
              (_) => EditorType.Video
            ),
          ],
        }));
        setFeedPaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreFeedPostLoading(false);
  };

  const handleProfileFeed = async () => {
    if (!client) return;
    setFeedProfileLoading(true);
    try {
      const res = await fetchPosts(client, {
        pageSize: PageSize.Ten,
        filter: {
          authors: [feedSwitch?.profile?.address],
        },
      });

      if (res.isOk()) {
        const posts = (await Promise.all(
          (res?.value?.items || []).map(async (post) => {
            let picture = "";

            if ((post as any)?.author?.metadata?.picture) {
              const cadena = await fetch(
                `${STORAGE_NODE}/${
                  (post as any)?.author?.metadata?.picture?.split(
                    "lens://"
                  )?.[1]
                }`
              );

              if (cadena) {
                const json = await cadena.json();
                picture = json.item;
              }
            }

            return {
              ...post,
              author: {
                ...(post as any)?.author,
                metadata: {
                  ...(post as any)?.author?.metadata,
                  picture,
                },
              },
            } as any;
          })
        )) as Post[];

        setFeedProfile(posts);
        setCurrentSession((prev) => ({
          ...prev,
          editors: Array.from(
            { length: (res?.value?.items || []).length },
            (_) => EditorType.Video
          ),
        }));
        setProfilePaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedProfileLoading(false);
  };

  const handleMoreProfileFeed = async () => {
    if (!client || !profilePaginated) return;
    setMoreProfileFeedLoading(true);
    try {
      const res = await fetchPosts(client, {
        cursor: profilePaginated,
        pageSize: PageSize.Ten,
        filter: {
          authors: [feedSwitch?.profile?.address],
        },
      });

      if (res.isOk()) {
        const posts = (await Promise.all(
          (res?.value?.items || []).map(async (post) => {
            let picture = "";

            if ((post as any)?.author?.metadata?.picture) {
              const cadena = await fetch(
                `${STORAGE_NODE}/${
                  (post as any)?.author?.metadata?.picture?.split(
                    "lens://"
                  )?.[1]
                }`
              );

              if (cadena) {
                const json = await cadena.json();
                picture = json.item;
              }
            }

            return {
              ...post,
              author: {
                ...(post as any)?.author,
                metadata: {
                  ...(post as any)?.author?.metadata,
                  picture,
                },
              },
            } as any;
          })
        )) as Post[];

        setFeedProfile([...feedProfile, ...posts]);
        setCurrentSession((prev) => ({
          ...prev,
          editors: [
            ...prev.editors,
            ...Array.from(
              { length: (res?.value?.items || []).length },
              (_) => EditorType.Video
            ),
          ],
        }));
        setProfilePaginated(res?.value?.pageInfo?.next);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreProfileFeedLoading(false);
  };

  useEffect(() => {
    if (client && feedSwitch?.type == "all") {
      handleFeed();
      handleUserData();
    }
  }, [lensAccount, client, feedSwitch]);

  useEffect(() => {
    if (feedSwitch?.type == "profile") {
      handleProfileFeed();
    } else if (feedSwitch?.type == "post") {
      handlePostFeed();
      setMainPost([feedSwitch?.post!]);
    } else {
      setFeedProfile([]);
      setPostFeed([]);
      setMainPost([]);
    }
  }, [feedSwitch?.type]);

  return {
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
  };
};

export default useReach;
