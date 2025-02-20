import {
  SessionClient,
  UnexpectedError,
  UnauthenticatedError,
  PostResult,
  RepostMutation,
  CreateRepostRequest,
} from "@lens-protocol/client";

const createRepost = async (
  request: CreateRepostRequest,
  sessionClient: SessionClient
): Promise<PostResult | UnexpectedError | UnauthenticatedError> => {
  const result = await sessionClient.mutation(RepostMutation, {
    request,
  });

  if (result.isOk()) {
    return result.value;
  }

  return result.error;
};

export default createRepost;
