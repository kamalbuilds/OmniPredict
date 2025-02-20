import {
  SessionClient,
  UnexpectedError,
  UnauthenticatedError,
  AddReactionRequest,
  AddReactionMutation,
  AddReactionResult,
} from "@lens-protocol/client";

const addReaction = async (
  request: AddReactionRequest,
  sessionClient: SessionClient
): Promise<AddReactionResult | UnexpectedError | UnauthenticatedError> => {
  const result = await sessionClient.mutation(AddReactionMutation, {
    request,
  });

  if (result.isOk()) {
    return result.value;
  }

  return result.error;
};

export default addReaction;
