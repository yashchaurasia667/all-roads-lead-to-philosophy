import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import Graph from "./Graph";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<{ title: string; next: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState<boolean>(false);

  const handleScrape = async (url: string) => {
    if (complete) return;
    if (!url) return;
    setLoading(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await res.json();
      if (!result.success) {
        console.error("Request failed", result.error);
        return;
      }

      setData((prev) => {
        const exists = prev.some((item) => item.title === result.title);
        if (exists) return prev;

        return [...prev, { title: result.title, next: result.next }];
      });
      if (result.title === "Philosophy") setComplete(true);
    } catch (err) {
      console.error("Failed to fetch from internal API:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setData([]);
    setComplete(false);

    const keyword = searchTerm.trim().split(" ").join("_");
    const search_url = `https://en.wikipedia.org/wiki/${keyword}`;

    handleScrape(search_url);
  };

  useEffect(() => {
    if (data.length === 0) return;

    const lastItem = data[data.length - 1];
    if (lastItem.title === "Philosophy") return;

    if (lastItem.next) {
      const isAlreadyVisited = data.some(
        (item) => item.title === lastItem.next,
      );

      if (!isAlreadyVisited) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleScrape(lastItem.next);
      }
    }
  }, [data]);

  return (
    <section
      id="search"
      className="z-10 min-h-screen w-full max-w-full overflow-x-hidden flex flex-col lg:grid lg:grid-cols-[30%_1fr] px-4 sm:px-8 py-6 gap-6"
    >
      <form
        onSubmit={onSearch}
        className="w-full flex flex-col items-center lg:items-end justify-center gap-3"
      >
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Type a random Wikipedia page"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212cc] text-base sm:text-lg text-white outline-none px-4 py-3 sm:py-4 rounded-full border-2 border-[#f0dac2] focus:border-red-500 transition-all box-border"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full lg:w-fit text-base sm:text-lg cursor-pointer outline-none bg-red-900 hover:bg-red-800 active:bg-red-700 rounded-full px-8 py-3 transition-all font-medium text-white disabled:opacity-50"
        >
          {loading ? "Scraping..." : "Search"}
        </button>
      </form>

      <section className="results relative w-full max-w-full lg:h-full overflow-auto touch-pan-x touch-pan-y rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="min-w-[600px] min-h-[500px] w-full h-full">
          <Graph data={data} />
        </div>
      </section>
    </section>
  );
};

export default Search;
