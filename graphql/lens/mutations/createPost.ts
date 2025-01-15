import {
  SessionClient,
  UnexpectedError,
  UnauthenticatedError,
  CreatePostRequest,
  PostMutation,
  PostResult,
} from "@lens-protocol/client";

const createPost = async (
  request: CreatePostRequest,
  sessionClient: SessionClient
): Promise<PostResult | UnexpectedError | UnauthenticatedError> => {
  const result = await sessionClient.mutation(PostMutation, {
    request,
  });

  if (result.isOk()) {
    return result.value;
  }

  return result.error;
};

export default createPost;
