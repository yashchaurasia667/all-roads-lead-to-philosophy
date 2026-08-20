"use client";

import Image from "next/image";
import Link from "next/link";
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";

import gsap from "gsap";
import { ReactLenis, useLenis } from "lenis/react";

import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { LinkIcon } from "@phosphor-icons/react";

export default function Home() {
  const images = [
    "adam.jpeg",
    "mad_clown.jpeg",
    "temptation.jpeg",
    "fallen_angel.jpeg",
  ];

  const imageContainer = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<{ title: string; next: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState<boolean>(false);

  const imageElements = useMemo(() => {
    return images.map((img, index) => (
      <div key={index} className="relative w-full h-full img-elm">
        <Image
          src={`/${img}`}
          fill
          className="object-cover"
          alt="bg"
          loading="eager"
        />
      </div>
    ));
  }, []);

  const nodes = useMemo(() => {
    return data.map((node, index) => (
      <span key={index} className="my-5 relative flex gap-4">
        <Link
          href={`https://en.wikipedia.org/wiki/${node.title}`}
          target="_blank"
          className="inline-block text-xl border-5 hover:scale-105 rounded-[50%] p-6 transition-all"
        >
          {" "}
        </Link>
        <span className="flex flex-col px-6 py-4 rounded-xl bg-[#f0dac2] text-black absolute">
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
      </span>
    ));
  }, [data]);

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
        // Prevent duplicate entries
        const exists = prev.some((item) => item.title === result.title);
        if (exists) return prev; // Return existing array without triggering a re-render

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
        handleScrape(lastItem.next);
      }
    }
  }, [data]);

  const changeBgBrightness = (direction: number) => {
    if (direction == 1)
      gsap.to(imageContainer.current, {
        filter: "brightness(20%)",
        duration: 0.3,
        ease: "power2.inOut",
      });
    else if (direction == -1)
      gsap.to(imageContainer.current, {
        filter: "brightness(70%)",
        duration: 3.5,
      });
  };

  // const lenis = useLenis((e) => {
  //   e.on("scroll", () => {
  //     console.log("Scrolling");
  //     if (e.direction == 1) {
  //       e.scrollTo("#search", {
  //         duration: 1.5,
  //         onStart: () => changeBgBrightness(e.direction),
  //       });
  //     } else if (e.direction == -1) {
  //       e.scrollTo("#hero", {
  //         duration: 1.5,
  //         onStart: () => changeBgBrightness(e.direction),
  //       });
  //     }
  //   });
  // }, []);

  return (
    <>
      <ReactLenis root />
      <main className="relative min-h-screen w-full overflow-x-hidden">
        <div
          ref={imageContainer}
          className="grid grid-cols-4 fixed inset-0 w-full h-[100dvh] -z-10"
          style={{ filter: "brightness(70%)" }}
        >
          {imageElements}
        </div>

        <section
          id="hero"
          className="relative h-dvh w-full flex flex-col items-center justify-center px-4"
        >
          <h1 className="relative inline-block group origin-bottom font-medium text-8xl abril-fatface text-center z-10 transition-all duration-300 hover:-skew-x-12 hover:[text-shadow:0_0_2px_currentColor,0_0_2px_currentColor] after:absolute after:bottom-0 after:left-0 after:h-[4px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
            All Roads Lead to Philosophy
          </h1>

          <CaretDownIcon
            size={48}
            fill="#ffffffaa"
            className="z-10 font-bold absolute bottom-6 animate-caret cursor-pointer hover:scale-105"
            onClick={() => {
              lenis?.scrollTo("#search");
            }}
          />
        </section>

        <section
          id="search"
          className="z-10 min-h-screen grid grid-cols-[40%_1fr]"
        >
          <form
            onSubmit={onSearch}
            className="px-5 py-8 flex flex-col justify-center items-end"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-full w-full bg-[#111212aa] text-lg outline-none px-4 py-4 border-2 border-[#f0dac2] focus-within:border-3 transition-all border-box"
            />
            <button
              type="submit"
              className="text-lg ml-2 cursor-pointer outline-none bg-red-900 hover:bg-red-800 active:bg-red-700 my-4 rounded-full px-8 py-3 hover:font-medium transition-all"
            >
              Search
            </button>
          </form>

          <section className="results">{nodes}</section>
        </section>
      </main>
    </>
  );
}
