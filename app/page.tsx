"use client";

import { SyntheticEvent, useMemo, useRef, useState } from "react";
import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import Lenis from "lenis";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

  const imageContainer = useRef(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const onSearch = (e: SyntheticEvent) => {
    e.preventDefault();
    if (searchTerm === "") return;

    console.log("searching");
  };

  const scrollToSearch = () => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: "#search",
      ease: "power2.inOut",
    });
  };

  useGSAP(() => {
    let hasScrolled = false;

    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      endTrigger: "#search",
      end: "bottom 50%+=100px",
      onToggle: (self) => {
        if (!hasScrolled && self.direction === 1 && self.progress > 0) {
          hasScrolled = true;
          scrollToSearch();
        }
        hasScrolled = self.isActive;
        console.log("toggled, isActive:", self.isActive);
      },
    });
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <div
        ref={imageContainer}
        className="grid grid-cols-4 fixed inset-0 w-full h-[100dvh] -z-10 brightness-75"
      >
        {imageElements}
      </div>

      <section
        id="hero"
        className="relative h-[100dvh] w-full flex flex-col items-center justify-center px-4"
      >
        <h1 className="hero text-8xl font-medium abril-fatface text-center z-10">
          All Roads Lead to Philosophy
        </h1>

        <CaretDownIcon
          size={48}
          fill="#ffffffaa"
          className="z-10 font-bold absolute bottom-6 animate-caret cursor-pointer hover:scale-105"
        />
      </section>

      <section id="search" className="z-10 min-h-screen">
        <form onSubmit={onSearch} className="px-5 py-8 ">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 text-black border rounded"
          />
          <button type="submit" className="ml-2 p-2 rounded">
            Search
          </button>
        </form>

        <section className="results">results shown here</section>
      </section>
    </main>
  );
}
