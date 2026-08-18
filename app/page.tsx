"use client";

import Image from "next/image";
import { SyntheticEvent, useMemo, useRef, useState } from "react";

import gsap from "gsap";
import { ReactLenis, useLenis } from "lenis/react";

import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";

export default function Home() {
  const images = [
    "adam.jpeg",
    "mad_clown.jpeg",
    "temptation.jpeg",
    "fallen_angel.jpeg",
  ];

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

  const imageContainer = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [brightness, setBrightness] = useState<number>(75);

  const onSearch = (e: SyntheticEvent) => {
    e.preventDefault();
    if (searchTerm === "") return;

    console.log("searching");
  };
  const changeBgBrightness = (direction: number) => {
    if (direction == 1)
      gsap.to(imageContainer.current, {
        filter: "brightness(50%)",
        duration: 0.3,
        ease: "power2.inOut",
      });
    else if (direction == -1)
      gsap.to(imageContainer.current, {
        filter: "brightness(70%)",
        duration: 3.5,
      });
  };

  const lenis = useLenis((e) => {
    e.on("scroll", () => {
      if (e.direction == 1) {
        e.scrollTo("#search", {
          duration: 1.5,
          onStart: () => changeBgBrightness(e.direction),
        });
      } else if (e.direction == -1) {
        e.scrollTo("#hero", {
          duration: 1.5,
          onStart: () => changeBgBrightness(e.direction),
        });
      }
    });
  }, []);

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
          <h1 className="text-8xl font-medium abril-fatface text-center z-10">
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

        <section id="search" className="z-10 min-h-screen grid grid-cols-2">
          <form
            onSubmit={onSearch}
            className="px-5 py-8 flex flex-col justify-center items-start"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-3/4 bg-[#111212aa] text-lg outline-none border-none px-4 py-4"
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded cursor-pointer bg-red-900 my-4 rounded-xl px-6 py-4"
            >
              Search
            </button>
          </form>

          <section className="results">results shown here</section>
        </section>
      </main>
    </>
  );
}
