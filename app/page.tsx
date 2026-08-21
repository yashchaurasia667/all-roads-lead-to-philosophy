"use client";

import Link from "next/link";
import { useRef } from "react";

import gsap from "gsap";
import { ReactLenis, useLenis } from "lenis/react";

import Hero from "@/components/Hero";
import Search from "@/components/Search";

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

  return (
    <>
      <ReactLenis root />
      <main className="relative min-h-screen w-full overflow-x-hidden">
        <Hero />
        <Search />
      </main>
    </>
  );
}
