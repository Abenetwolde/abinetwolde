"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Link as ScrollLink } from "react-scroll";
import { IoIosArrowForward } from "react-icons/io";
import type { main } from "@/types/main";

interface HeroProps {
  mainData: main;
}

/**
 * Lightweight in-component "typewriter" that cycles strings.
 * Implemented with minimal JS (no external bundle).
 */
function useLightTypewriter(strings: string[], interval = 3000) {
  const [text, setText] = useState<string>(strings?.[0] ?? "");
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const deletingRef = useRef<NodeJS.Timeout | null>(null);
  const pauseRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!strings || strings.length === 0) return;

    const type = () => {
      const cur = strings[idxRef.current % strings.length];
      charRef.current++;
      setText(cur.slice(0, charRef.current));
      if (charRef.current >= cur.length) {
        // pause then delete
        pauseRef.current = setTimeout(() => {
          deletingRef.current = setInterval(deleteChar, 50);
        }, Math.max(700, interval - 1000));
        clearInterval(typingRef.current as NodeJS.Timeout);
      }
    };

    const deleteChar = () => {
      const cur = strings[idxRef.current % strings.length];
      charRef.current--;
      setText(cur.slice(0, charRef.current));
      if (charRef.current <= 0) {
        clearInterval(deletingRef.current as NodeJS.Timeout);
        idxRef.current++;
        // small pause then type next
        pauseRef.current = setTimeout(() => {
          typingRef.current = setInterval(type, 30);
        }, 300);
      }
    };

    // start typing
    typingRef.current = setInterval(type, 30);

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (deletingRef.current) clearInterval(deletingRef.current);
      if (pauseRef.current) clearTimeout(pauseRef.current);
    };
  }, [strings, interval]);

  return text;
}

/**
 * Optimized Hero - CSS animations and minimal JS
 */
const Hero = React.memo(function Hero({ mainData }: HeroProps) {
  const { theme } = useTheme();
  const { name, titles = [], heroImage, shortDesc, techStackImages = [] } = mainData;
  const typeText = useLightTypewriter(titles, 3200);

  // Start/stop animation only when visible to user (saves CPU when off-screen)
  const wrapperRef = useRef<HTMLElement | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // When >= 20% visible, enable animations
          if (e.isIntersecting && e.intersectionRatio >= 0.2) {
            setAnimate(true);
          } else {
            setAnimate(false);
          }
        });
      },
      { threshold: [0, 0.2, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // memoize tech icons markup to avoid re-creation every render
  const techNodes = useMemo(
    () =>
      techStackImages.slice(0, 4).map((src, i) => (
        <div
          key={i}
          className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
          // positions handled in parent absolute containers
        >
          <Image src={src} alt={`tech-${i}`} width={48} height={48} priority={false} />
        </div>
      )),
    [techStackImages]
  );

  return (
    <section
      id="home"
      ref={wrapperRef}
      className={`relative min-h-screen w-full mx-auto overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Background: low fetch priority, moderate quality */}
      <div className="absolute inset-0 opacity-10 min-h-screen h-full w-full pointer-events-none">
        <Image
          src="/background.jpeg"
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "bottom" }}
          quality={60}
          priority={false}
        //   fetchPriority="low"
        />
      </div>

      <div className="py-16 lg:py-48 flex flex-col-reverse lg:flex-row justify-around gap-10 lg:gap-0 relative z-10">
        <div className="flex flex-col gap-4 md:gap-6 text-left lg:w-1/2 2xl:w-1/3 mx-4 md:mx-6 xl:mx-0">
          <h1 className="text-4xl md:text-6xl font-bold">
            I&apos;m {name}
          </h1>

          <div className="flex flex-row items-start md:items-center gap-1.5">
            <h2 className="text-lg md:text-2xl">I am into</h2>
            {/* Light weight typewriter text */}
            <span
              aria-live="polite"
              className="ml-2 text-pink-700 dark:text-pink-600 text-lg md:text-2xl font-medium"
            >
              {typeText}
              <span className="inline-block w-1 h-[1.15em] align-middle bg-pink-700 dark:bg-pink-600 ml-1 animate-cursor" />
            </span>
          </div>

          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{shortDesc}</p>

          <ScrollLink
            className="w-fit text-sm md:text-base py-2 px-4 cursor-pointer flex items-center gap-1 rounded-md bg-pink-600 hover:bg-violet-700 dark:bg-pink-700 hover:dark:bg-pink-800 transition-colors group text-white"
            to={"about"}
            offset={-60}
            smooth={true}
            duration={500}
            isDynamic={true}
          >
            About Me
            <IoIosArrowForward className="group-hover:translate-x-1 transition-transform" />
          </ScrollLink>
        </div>

        <div className="relative mx-0 mt-12 flex items-center justify-center w-full lg:w-auto">
          {/* Avatar */}
          <div className="w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden">
            {/* Mark avatar as priority for LCP but keep moderate quality */}
            <Image
              alt="avatar"
              src={"/me2.png"}
              width={720}
              height={720}
              priority={false}
              sizes="(max-width: 768px) 60vw, 30vw"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rotating tech icons — CSS-only animation, GPU-accelerated.
              We only add the animation CSS class when `animate` is true.
          */}
     <div
  aria-hidden
  className={`absolute inset-0 hidden md:flex items-center justify-center pointer-events-none ${
    animate ? "rotate-animate" : ""
  }`}
  style={{ willChange: animate ? "transform" : "auto" }}
>
  <div className="relative w-full h-full">
    {/* top */}
    <div className="absolute -top-20 left-1/2 -translate-x-1/2">{techNodes[0]}</div>
    {/* right */}
    <div className="absolute top-1/2 -right-20 -translate-y-1/2">{techNodes[1]}</div>
    {/* bottom */}
    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">{techNodes[2]}</div>
    {/* left */}
    <div className="absolute top-1/2 -left-20 -translate-y-1/2">{techNodes[3]}</div>
  </div>
</div>

        </div>
      </div>

      {/* decorative svg */}
      <svg className="absolute hidden md:block right-0 bottom-0 translate-x-6 translate-y-4 opacity-25 lg:opacity-60" width="186" height="186" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ... keep your same large path here ... */}
        <defs>
          <linearGradient id="a" x1="56.392" y1="0" x2="189.028" y2="2.312" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2D88E2"></stop>
            <stop offset="1" stopColor="#36EC74"></stop>
          </linearGradient>
        </defs>
      </svg>

      {/* Inline styles scoped to this component (Tailwind + a little CSS) */}
      <style jsx>{`
        /* cursor blink for typewriter */
        .animate-cursor {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }

        /* rotation animation — GPU-accelerated */
        .rotate-animate {
          animation: rotate360 20s linear infinite;
        }
        @keyframes rotate360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* respects reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .rotate-animate { animation: none !important; }
          .animate-cursor { animation: none !important; opacity: 1; }
        }
      `}</style>
    </section>
  );
});

export default Hero;
