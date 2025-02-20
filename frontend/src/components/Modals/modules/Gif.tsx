import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { INFURA_GATEWAY } from "@/lib/constants";
import useGif from "../hooks/useGif";
import { GifProps } from "../types/modals.types";

const Gif: FunctionComponent<GifProps> = ({ setGifOpen }): JSX.Element => {
  const { gifLoading, search, setSearch, handleSearch, gifs } = useGif();

  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer items-center justify-center"
      onClick={() => setGifOpen((prev) => ({
        ...prev,
        open: false
      }))}
    >
      <div
        className="rounded-sm w-96 h-fit text-sm text-black flex items-center justify-start p-3 cursor-default flex-col gap-6 bg-dark border border-sea max-h-[15rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-fit flex flex-row items-center text-white justify-between text-xs gap-2">
          <input
            className="relative w-full h-10 py-px px-3 border border-white rounded-sm bg-dark"
            placeholder={"Search Memes + Gifs"}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" &&
                search?.trim() !== "" &&
                !gifLoading &&
                handleSearch();
            }}
          />
          <div className="relative flex w-fit h-fit">
            <div
              className={`relative px-3 py-1 flex items-center justify-center text-black w-28 h-8 ${
                !gifLoading && "cursor-pointer active:scale-95"
              }`}
              onClick={() =>
                !gifLoading && search?.trim() !== "" && handleSearch()
              }
            >
              <div className="absolute top-0 left-0 flex w-28 h-8">
                <Image
                  src={`${INFURA_GATEWAY}QmRU57vbmZm7EbKrJksFD6SfyLkZ2qUwfZHqXzy8XJvZAH`}
                  layout="fill"
                  objectFit="fill"
                  draggable={false}
                />
              </div>
              {gifLoading ? (
                <div className="relative w-4 h-4 animate-spin flex">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    draggable={false}
                    src={`${INFURA_GATEWAY}QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                  />
                </div>
              ) : (
                <div className="relative flex w-fit h-fit font-digi">
                  Search
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative flex items-start justify-start overflow-y-scroll w-full h-fit">
          <div className="flex flex-wrap items-start justify-start gap-3 w-fit h-fit">
            {gifs?.map((gif: any, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-md flex items-center justify-center cursor-pointer hover:opacity-70 bg-black border border-sea"
                  onClick={() =>
                    setGifOpen(
                      (prev) =>
                        ({
                          ...prev,
                          open: false,
                          gif: gif?.media_formats?.gif?.url as string,
                        } as any)
                    )
                  }
                >
                  <Image
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    src={gif?.media_formats?.gif?.url}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gif;
