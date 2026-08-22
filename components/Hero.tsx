import { useMemo } from "react";
import Image from "next/image";
import { CaretDownIcon } from "@phosphor-icons/react";

const Hero = () => {
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
  return (
    <>
      <div
        // ref={imageContainer}
        className="grid grid-cols-4 fixed inset-0 w-full h-[100dvh] -z-10"
        style={{ filter: "brightness(70%)" }}
      >
        {imageElements}
      </div>

      <section
        id="hero"
        className="relative h-dvh w-full flex flex-col items-center justify-center px-4"
      >
        <h1 className="relative inline-block group origin-bottom font-medium text-6xl lg:text-8xl abril-fatface text-center z-10 transition-all duration-300 hover:-skew-x-12 hover:[text-shadow:0_0_2px_currentColor,0_0_2px_currentColor] after:absolute after:bottom-0 after:left-0 after:h-[4px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
          All Roads Lead to Philosophy
        </h1>

        <CaretDownIcon
          size={48}
          fill="#ffffffaa"
          className="z-10 font-bold absolute bottom-6 animate-caret cursor-pointer hover:scale-105"
          // onClick={() => {
          //   lenis?.scrollTo("#search");
          // }}
        />
      </section>
    </>
  );
};

export default Hero;
