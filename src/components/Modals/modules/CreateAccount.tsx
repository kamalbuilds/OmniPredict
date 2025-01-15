import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import useCreateAccount from "../hooks/useCreateAccount";
import { INFURA_GATEWAY } from "@/lib/constants";
import { CreateAccountProps } from "../types/modals.types";

const CreateAccount: FunctionComponent<CreateAccountProps> = ({
  address,
  lensAccount,
  setLensAccount,
  setCreateAccount,
  setIndexer,
  storageClient,
}): JSX.Element => {
  const { account, accountLoading, setAccount, handleCreateAccount } =
    useCreateAccount(
      address,
      lensAccount,
      setLensAccount,
      setCreateAccount,
      setIndexer,
      storageClient
    );
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer items-center justify-center"
      onClick={() => setCreateAccount(false)}
    >
      <div
        className="rounded-md border border-viol w-96 h-fit text-sm text-white flex items-center justify-start p-3 cursor-default flex-col gap-6 bg-sea"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-fit pb-3 h-fit flex items-center justify-center">
          Create Lens Account
        </div>
        <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center">
          <div className="relative items-center justify-center flex w-fit h-fit">
            <label
              className="relative w-20 rounded-full h-20 flex items-center justify-center border border-viol cursor-pointer bg-sea"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {account?.pfp && (
                <Image
                  src={URL.createObjectURL(account.pfp)}
                  objectFit="cover"
                  layout="fill"
                  draggable={false}
                  className="rounded-full"
                />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg"
                hidden
                required
                id="files"
                multiple={false}
                name="pfp"
                disabled={accountLoading}
                onChange={(e) => {
                  e.stopPropagation();
                  if (!e.target.files || e.target.files.length === 0) return;
                  setAccount({
                    ...account,
                    pfp: e?.target?.files?.[0],
                  });
                }}
              />
            </label>
          </div>
          <div className="relative w-full h-fit flex items-start justify-between flex-row gap-3 text-white">
            <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
              <div className="relative w-fit h-fit flex">Username</div>
              <input
                disabled={accountLoading}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    username: e.target.value,
                  })
                }
                className="relative w-full bg-sea h-8 border border-viol focus:outline-none p-1"
                value={account?.username}
              />
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
              <div className="relative w-fit h-fit flex">Display Name</div>
              <input
                disabled={accountLoading}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    localname: e.target.value,
                  })
                }
                className="relative w-full bg-sea h-8 border border-viol focus:outline-none p-1"
                value={account?.localname}
              />
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-col gap-1.5 items-start justify-start">
            <div className="relative w-fit h-fit flex">Bio</div>
            <textarea
              disabled={accountLoading}
              onChange={(e) =>
                setAccount({
                  ...account,
                  bio: e.target.value,
                })
              }
              className="relative w-full bg-sea h-14 overflow-y-scroll border border-viol focus:outline-none p-1"
              value={account?.bio}
              style={{
                resize: "none",
              }}
            ></textarea>
          </div>
        </div>
        <div className="relative flex w-full justify-center h-fit">
          <div
            className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 ${
              !accountLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !accountLoading && handleCreateAccount()}
          >
            <div className="absolute top-0 left-0 flex w-28 h-8">
              <Image
                src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                layout="fill"
                objectFit="fill"
                draggable={false}
              />
            </div>
            {accountLoading ? (
              <div className="relative w-4 h-4 animate-spin flex">
                <Image
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                />
              </div>
            ) : (
              <div className="relative flex w-fit h-fit font-digi">Create</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
