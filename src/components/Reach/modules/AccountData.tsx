import { FunctionComponent, JSX } from "react";
import { AccountDataProps } from "../types/reach.types";

const AccountData: FunctionComponent<AccountDataProps> = ({
  data,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-start justify-between bg-gris rounded-md p-1 text-xxs font-digi border border-sea">
      <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start text-left">
        <div className="relative w-fit h-fit flex">Posts:</div>
        <div className="relative w-fit h-fit flex">
          {data?.feedStats?.posts || 0}
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start text-left">
        <div className="relative w-fit h-fit flex">Comments:</div>
        <div className="relative w-fit h-fit flex">
          {data?.feedStats?.comments || 0}
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start text-left">
        <div className="relative w-fit h-fit flex">Quotes:</div>
        <div className="relative w-fit h-fit flex">
          {data?.feedStats?.quotes || 0}
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start text-left">
        <div className="relative w-fit h-fit flex">Reposts:</div>
        <div className="relative w-fit h-fit flex">
          {data?.feedStats?.reposts || 0}
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col gap-1 items-start justify-start text-left">
        <div className="relative w-fit h-fit flex">Reactions:</div>
        <div className="relative w-fit h-fit flex">
          {data?.feedStats?.reactions || 0}
        </div>
      </div>
    </div>
  );
};

export default AccountData;
