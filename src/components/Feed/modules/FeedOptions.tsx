import { FEED_TYPES, INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { FeedOptionsProps, Social } from "../types/feed.types";

const FeedOptions: FunctionComponent<FeedOptionsProps> = ({
  socials,
  setSocials,
  feedType,
  setFeedType,
  setFeedTypeOpen,
  feedTypeOpen,
}): JSX.Element => {
  return (
    <div className="relative w-full tablet:w-3/5 h-fit flex flex-col galaxy:flex-row gap-4 items-center justify-center galaxy:justify-between px-4 py-1 rounded-md galaxy:rounded-full bg-white border border-viol ">
      <div className="relative w-full h-fit flex flex-row gap-1 items-center justify-center galaxy:items-start galaxy:justify-start">
        {[
          {
            image: "QmYCDxCv7mJyjn49n84kP6d3ADgGp422ukKzRyd2ZcGEsW",
            social: Social.Lens,
          },
          {
            image: "QmUKK5v4h56nJeQs5aHheYqZ9njMxAGQxRLbv7htBjKo7c",
            social: Social.Bluesky,
          },

          {
            image: "QmPCihZbtGi8FMRW6F21KGPR2bbkmLkjpQbqvcwr2ZZrDw",
            social: Social.Farcaster,
          },
        ].map((item, key) => {
          return (
            <div
              key={key}
              className={`border bg-viol border-viol w-8 h-8 cursor-pointer flex relative hover:opacity-70 rounded-full ${
                socials.includes(item.social) && "opacity-70"
              }`}
              onClick={() =>
                setSocials((prev) => {
                  let socialsPrev = [...prev];

                  if (socialsPrev.includes(item.social)) {
                    socialsPrev = socialsPrev.filter((s) => s !== item.social);
                  } else {
                    socialsPrev = [...socialsPrev, item.social];
                  }

                  return socialsPrev;
                })
              }
            >
              <Image
                title={item.social}
                draggable={false}
                src={`${INFURA_GATEWAY}${item.image}`}
                layout="fill"
                alt="type"
              />
            </div>
          );
        })}
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-1">
        <div className="text-light text-left w-fit h-fit flex text-sm">
          feed:
        </div>
        <div className="relative w-full h-fit flex flex-row items-center justify-start gap-3">
          <div className="relative rounded-md border border-light bg-dark flex whitespace-nowrap items-center justify-center text-left py-1 px-3 text-viol text-xs h-fit w-20">
            {feedType}
          </div>
          <div
            className="relative text-viol hover:opacity-70 cursor-pointer w-6 h-6"
            onClick={() => setFeedTypeOpen(!feedTypeOpen)}
          >
            <Image
              alt="option"
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}Qmd63TQtZM3vGXy9F2XJJzeMLxuvp1Png7R3yZwkCcW2Mf`}
            />
          </div>
          {feedTypeOpen && (
            <div className="absolute w-24 h-fit rounded-md flex bg-light right-0 top-8 flex-col gap-2 border border-dark p-2 z-40">
              {FEED_TYPES.map((type, key) => {
                return (
                  <div
                    key={key}
                    className="relative flex w-full h-7 rounded-md bg-viol active:scale-95 cursor-pointer items-center justify-center text-center text-xs text-black hover:opacity-80 border border-black"
                    onClick={() => {
                      setFeedTypeOpen(false);
                      setFeedType(type);
                    }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedOptions;
