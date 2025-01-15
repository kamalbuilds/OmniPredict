import { SetStateAction, useEffect, useState } from "react";
import { Social } from "../types/feed.types";
import {
  Account,
  MainContentFocus,
  PageSize,
  Post,
  PostReferenceType,
  PostsRequest,
  PublicClient,
  SessionClient,
} from "@lens-protocol/client";
import {
  fetchPostReferences,
  fetchPosts,
  follow,
  unfollow,
} from "@lens-protocol/client/actions";
import { FEED_TYPES, STORAGE_NODE } from "@/lib/constants";
import { EditorType } from "@/components/Feed/types/feed.types";
import { CurrentSession } from "@/components/Common/types/common.types";

const useFeed = (
  client: SessionClient | PublicClient | undefined,
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void,
  setSignless: (e: SetStateAction<boolean>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
) => {
  const [socials, setSocials] = useState<Social[]>([Social.Lens]);
  const [feedType, setFeedType] = useState<string>("for you");
  const [feed, setFeed] = useState<Post[]>([]);
  const [paginated, setPaginated] = useState<string | undefined>();
  const [profilePaginated, setProfilePaginated] = useState<
    string | undefined
  >();
  const [feedPaginated, setFeedPaginated] = useState<string | undefined>();
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [feedTypeOpen, setFeedTypeOpen] = useState<boolean>(false);
  const [moreFeedLoading, setMoreFeedLoading] = useState<boolean>(false);
  const [moreFeedPostLoading, setMoreFeedPostLoading] =
    useState<boolean>(false);
  const [moreProfileFeedLoading, setMoreProfileFeedLoading] =
    useState<boolean>(false);
  const [feedSwitch, setFeedSwitch] = useState<{
    type: "profile" | "post" | "all";
    profile?: Account;
    post?: Post;
  }>({
    type: "all",
  });
  const [feedProfile, setFeedProfile] = useState<Post[]>([]);
  const [postFeed, setPostFeed] = useState<Post[]>([]);
  const [feedProfileLoading, setFeedProfileLoading] = useState<boolean>(false);
  const [feedPostLoading, setFeedPostLoading] = useState<boolean>(false);
  const [mainPost, setMainPost] = useState<Post[]>([]);
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const handleFollow = async () => {
    if (!feedSwitch?.profile || !client) return;

    setFollowLoading(true);
    try {
      if (feedSwitch?.profile?.operations?.isFollowedByMe) {
        const res = await unfollow(client as SessionClient, {
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
        const res = await follow(client as SessionClient, {
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
    if (!client) return;
    setFeedLoading(true);
    try {
      let postsRequest: PostsRequest = {
        pageSize: PageSize.Ten,
      };
      if (feedType == FEED_TYPES[0]) {
        postsRequest = {
          ...postsRequest,
        };
      } else if (feedType == FEED_TYPES[1]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
            },
          },
        };
      } else if (feedType == FEED_TYPES[2]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Image],
            },
          },
        };
      } else {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [
                MainContentFocus.TextOnly,
                MainContentFocus.Article,
                MainContentFocus.Story,
              ],
            },
          },
        };
      }

      const res = await fetchPosts(client, postsRequest);

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

        setFeed(posts);
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
      let postsRequest: PostsRequest = {
        pageSize: PageSize.Ten,
        cursor: paginated,
      };
      if (feedType == FEED_TYPES[0]) {
        postsRequest = {
          ...postsRequest,
        };
      } else if (feedType == FEED_TYPES[1]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
            },
          },
        };
      } else if (feedType == FEED_TYPES[2]) {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Image],
            },
          },
        };
      } else {
        postsRequest = {
          ...postsRequest,
          filter: {
            metadata: {
              mainContentFocus: [
                MainContentFocus.TextOnly,
                MainContentFocus.Article,
                MainContentFocus.Story,
              ],
            },
          },
        };
      }

      const res = await fetchPosts(client, postsRequest);

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
        pageSize: PageSize.Ten,
        cursor: profilePaginated,
        filter: {
          authors: [feedSwitch?.profile?.address],
        },
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

  useEffect(() => {
    if (client && feedSwitch?.type == "all") {
      handleFeed();
    }
  }, [feedType, client, feedSwitch]);

  return {
    feedType,
    setFeedType,
    socials,
    setSocials,
    feed,
    feedLoading,
    handleMoreFeed,
    paginated,
    feedTypeOpen,
    setFeedTypeOpen,
    moreFeedLoading,
    setFeed,
    setFeedSwitch,
    feedSwitch,
    feedProfile,
    postFeed,
    feedPostLoading,
    feedProfileLoading,
    feedPaginated,
    profilePaginated,
    handleMoreProfileFeed,
    handleMorePostFeed,
    moreFeedPostLoading,
    moreProfileFeedLoading,
    setPostFeed,
    setFeedProfile,
    mainPost,
    setMainPost,
    followLoading,
    handleFollow,
  };
};

export default useFeed;
