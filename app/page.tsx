"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import Hero from "@/components/Hero";
import Search from "@/components/Search";

gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  const imageContainer = useRef<HTMLDivElement>(null);

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

  useGSAP(() => {}, []);

  return (
    <>
      <main className="relative min-h-screen w-full overflow-x-hidden">
        <Hero />
        <Search />
      </main>
    </>
  );
}
