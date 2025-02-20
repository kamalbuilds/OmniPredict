import { dialtoneGraphClient } from "@/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

const MEMES = gql`
  query ($skip: Int!) {
    memeAddeds(first: 20, skip: $skip) {
      id
      data
      blockNumber
      blockTimestamp
      metadata {
        lore
        image
      }
      feed
      symbol
      name
      owner
      transactionHash
      token
      workflows
    }
  }
`;

export const getMemes = async (skip: number): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = dialtoneGraphClient.query({
    query: MEMES,
    variables: {
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
