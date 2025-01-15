import { useState } from "react";

const useGif = () => {
  const [gifLoading, setGifLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [gifs, setGifs] = useState<any[]>([]);

  const handleSearch = async () => {
    setGifLoading(true);
    try {
      const response = await fetch("/api/giphy", {
        method: "POST",
        body: search,
      });
      const allGifs = await response.json();
      setGifs(allGifs?.results);
    } catch (err: any) {
      console.error(err.message);
    }
    setGifLoading(false);
  };

  return {
    gifLoading,
    search,
    setSearch,
    handleSearch,
    gifs,
  };
};

export default useGif;
