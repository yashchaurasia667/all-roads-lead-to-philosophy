import { LinkIcon } from "@phosphor-icons/react";
import Link from "next/link";
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
      if (result.title == "Philosophy") setComplete(true);
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
    console.log(`Searching for: ${search_url}`);

    handleScrape(search_url);
  };

  const nodes = useMemo(() => {
    return data.map((node, index) => (
      <span key={index} className="m-5 relative flex gap-4">
        <Link
          href={`https://en.wikipedia.org/wiki/${node.title}`}
          target="_blank"
          className="inline-block text-xl border-5 hover:scale-105 rounded-[50%] p-5 hover:bg-[#f0dac2] transition-all group"
        >
          <span className="z-10 flex flex-col px-4 py-2 rounded-xl bg-[#f0dac2] text-black absolute top-0 left-[130%] invisible hover:visible group-hover:visible transition-all transition-duration-[500]">
            <p className="text-2xl font-medium">{node.title}</p>
            <Link
              href={`https://en.wikipedia.org/wiki/${node.title}`}
              target="_blank"
              className="text-lg hover:underline"
            >
              {`https://en.wikipedia.org/wiki/${node.title}`}
              <LinkIcon size={16} stroke="black" className="inline px-4" />
            </Link>
          </span>
        </Link>
      </span>
    ));
  }, [data]);

  useEffect(() => {
    if (data.length === 0) return;

    const lastItem = data[data.length - 1];
    if (lastItem.title == "Philosophy") return;

    if (lastItem.next) {
      const isAlreadyVisited = data.some(
        (item) => item.title === lastItem.next,
      );

      if (!isAlreadyVisited) {
        console.log(`Searching for: ${lastItem.next}`);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleScrape(lastItem.next);
      }
    }
  }, [data]);

  return (
    <section id="search" className="z-10 min-h-screen grid grid-cols-[40%_1fr]">
      <form
        onSubmit={onSearch}
        className="px-5 py-8 flex flex-col justify-center items-end"
      >
        <input
          type="text"
          placeholder="Type a random Wikipedia page"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-full w-full bg-[#121212cc] text-lg outline-none px-4 py-4 border-2 border-[#f0dac2] focus-within:border-3 transition-all border-box"
        />
        <button
          type="submit"
          className="text-lg ml-2 cursor-pointer outline-none bg-red-900 hover:bg-red-800 active:bg-red-700 my-4 rounded-full px-8 py-3 hover:font-medium transition-all"
        >
          Search
        </button>
      </form>

      <section className="results h-full">{<Graph data={data} />}</section>
    </section>
  );
};

export default Search;
