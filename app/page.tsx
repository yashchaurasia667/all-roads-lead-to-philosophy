"use client";

import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import Image from "next/image";

export default function Home() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="grid grid-cols-4 absolute inset-0 w-full h-full -z-10 brightness-75">
        <div className="relative w-full h-full">
          <Image src="/adam.jpeg" fill className="object-cover" alt="bg" />
        </div>
        <div className="relative w-full h-full">
          <Image src="/mad_clown.jpeg" fill className="object-cover" alt="bg" />
        </div>
        <div className="relative w-full h-full">
          <Image
            src="/temptation.jpeg"
            fill
            className="object-cover"
            alt="bg"
          />
        </div>
        <div className="relative w-full h-full">
          <Image
            src="/fallen_angel.jpeg"
            fill
            className="object-cover"
            alt="bg"
          />
        </div>
      </div>

      <p className="text-8xl font-medium abril-fatface text-center z-10 text-[#f0dac2]">
        All Roads Lead to Philosophy
      </p>

      <CaretDownIcon
        size={48}
        fill="#ffffffaa"
        className="z-10 font-bold absolute bottom-4 animate-caret cursor-pointer hover:scale-105"
      />
    </section>
  );
}
