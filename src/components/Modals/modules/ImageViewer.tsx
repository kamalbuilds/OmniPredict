import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { ImageViewerProps } from "../types/modals.types";

const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  setImageView,
  imageView,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-200 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-screen h-full col-start-1 justify-self-center grid grid-flow-col auto-cols-auto self-start cursor-pointer"
        onClick={() => setImageView(undefined)}
      >
        <div className="relative w-full h-full flex py-8 flex items-center justify-center">
          <div className="relative w-5/6 sm:w-4/5 h-4/5 justify-center flex items-center">
            <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto px-4">
              <Image
                src={imageView}
                layout="fill"
                objectFit="contain"
                draggable={false}
                alt={imageView}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
