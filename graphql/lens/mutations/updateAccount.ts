import {
  SessionClient,
  UnexpectedError,
  UnauthenticatedError,
  SetAccountMetadataRequest,
  SetAccountMetadataResult,
  SetAccountMetadataMutation,
} from "@lens-protocol/client";

const updateAccount = async (
  request: SetAccountMetadataRequest,
  sessionClient: SessionClient
): Promise<
  SetAccountMetadataResult | UnexpectedError | UnauthenticatedError
> => {
  const result = await sessionClient.mutation(SetAccountMetadataMutation, {
    request,
  });

  if (result.isOk()) {
    return result.value;
  }

  return result.error;
};

export default updateAccount;
