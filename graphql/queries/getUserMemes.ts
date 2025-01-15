import { dialtoneGraphClient } from "@/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

const MEMES = gql`
  query ($owner: String!) {
    memeAddeds(where: { owner: $owner }) {
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

export const getUserMemes = async (
  owner: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = dialtoneGraphClient.query({
    query: MEMES,
    variables: {
      owner,
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
