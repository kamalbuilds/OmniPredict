"use client";
import { FunctionComponent, useEffect } from "react";
import { IndexerProps } from "../types/modals.types";


const Indexer: FunctionComponent<IndexerProps> = ({ indexer, setIndexer }) => {
  useEffect(() => {
    if (indexer) {
      setTimeout(() => {
        setIndexer(undefined);
      }, 5000);
    }
  }, [indexer]);

  return (
    <div className="fixed bottom-5 right-5 w-fit h-fit z-200">
      <div className="w-fit h-10 sm:h-16 flex items-center justify-center rounded-md bg-sea text-black rounded-md">
        <div className="relative w-fit h-fit flex items-center justify-center px-4 py-2 text-xs">
          {indexer}
        </div>
      </div>
    </div>
  );
};

export default Indexer;
