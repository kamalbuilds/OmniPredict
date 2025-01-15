import {
  SessionClient,
  UnexpectedError,
  PublicClient,
  TransactionStatusRequest,
  TransactionStatusResult,
  TransactionStatusQuery,
} from "@lens-protocol/client";

export const poll = async (
  request: TransactionStatusRequest,
  client: SessionClient | PublicClient
): Promise<TransactionStatusResult | UnexpectedError> => {
  const result = await client.query(TransactionStatusQuery, {
    request,
  });

  if (result.isOk()) {
    return result.value;
  }

  return result.error;
};
export default poll;
