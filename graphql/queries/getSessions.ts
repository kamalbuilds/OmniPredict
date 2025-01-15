import { dialtoneGraphClient } from "@/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

const AGENT = gql`
  query ($owner: String!, $skip: Int!) {
    sessionAddeds(where: { owner: $owner }, first: 20, skip: $skip) {
      blockTimestamp
      encryptedData
      sessionId
      transactionHash
      owner
      id
      blockNumber
    }
  }
`;

export const getSessions = async (
  owner: string,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = dialtoneGraphClient.query({
    query: AGENT,
    variables: {
      owner,
      skip,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);

  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
