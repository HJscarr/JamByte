"use client";

import dynamic from "next/dynamic";
import React, { useRef, useEffect, useState, lazy, Suspense } from "react";
import Image from "next/image";
import {
  UsersIcon,
  RocketLaunchIcon,
  WrenchIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import Charity from "@/components/Charity";
import LazyPlaceholder from "@/components/LazyPlaceholder";
import useFadeInOnScroll from "@/components/useFadeInOnScroll";
import SignUpBanner from "@/components/SignUpBanner";
import Photos from "@/components/Photos";

const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => <LazyPlaceholder />,
  ssr: false,
});

const HeroVideo = dynamic(() => import("@/components/HeroVideo"), {
  loading: () => <LazyPlaceholder />,
  ssr: false,
});

const features = [
  {
    name: "Coding Companion.",
    description:
      "Your AI Coding Companion is a great tool to bounce ideas off, debug code and explain concepts!",
    icon: UsersIcon,
  },
  {
    name: "Launch into Tech.",
    description:
      "It has never been easier to learn how to code. The art of prompting AI is already an invaluable tool for some of the most innovative engineers.",
    icon: RocketLaunchIcon,
  },
  {
    name: "Unlock your Potential.",
    description:
      "Build quicker than ever before when using AI to improve existing code or write it from scratch!",
    icon: WrenchIcon,
  },
];

export default function HomePage() {
  const [heroAnimated, setHeroAnimated] = useState(false);
  const [featureAnimated, setFeatureAnimated] = useState(false);
  const [charityAnimated, setCharityAnimated] = useState(false);
  const [newsLetterAnimated, setNewsLetterAnimated] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const heroVideoRef = useRef(null);
  const featureRef = useRef(null);
  const charityRef = useRef(null);
  const newsLetterRef = useRef(null);

  const heroVisible = useFadeInOnScroll(heroVideoRef);
  const featureVisible = useFadeInOnScroll(featureRef);
  const charityVisible = useFadeInOnScroll(charityRef);
  const newsLetterVisible = useFadeInOnScroll(newsLetterRef);

  useEffect(() => {
    const checkIfAtBottom = () => {
      const threshold = 100;
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - threshold
      ) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", checkIfAtBottom);
    return () => window.removeEventListener("scroll", checkIfAtBottom);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (heroVisible && !heroAnimated) setHeroAnimated(true);
    if (featureVisible && !featureAnimated) setFeatureAnimated(true);
    if (charityVisible && !charityAnimated) setCharityAnimated(true);
    if (newsLetterVisible && !newsLetterAnimated) setNewsLetterAnimated(true);
  }, [heroVisible, featureVisible, charityVisible, newsLetterVisible]);

  return (
    <div>
      {/* Scroll to Top/Bottom Button */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        {!isAtBottom ? (
          <button
            onClick={scrollToBottom}
            className="flex items-center justify-center h-8 w-8 bg-white bg-opacity-50 rounded-full animate-bounce"
            aria-label="Scroll to bottom"
          >
            <ChevronDownIcon className="h-6 w-6 text-white" />
          </button>
        ) : (
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center h-8 w-8 bg-white bg-opacity-50 rounded-full animate-bounce"
            aria-label="Scroll to top"
          >
            <ChevronDownIcon className="h-6 w-6 text-white transform rotate-180" />
          </button>
        )}
      </div>

      <div className="sm:px-24">
        <Hero />
      </div>

      <div
        className="flex justify-center"
        ref={heroVideoRef}
        style={{
          transform: heroAnimated ? "translateY(0)" : "translateY(20%)",
          transition: "transform 2s",
        }}
      >
        {heroVisible && <HeroVideo />}
      </div>

      <div className="mb-12 sm:mb-24 mt-12 pt-12 sm:mt-8">
        <Photos />
      </div>


      <div
        ref={featureRef}
        style={{
          transform: featureAnimated ? "translateY(0)" : "translateY(20%)",
          transition: "transform 2s",
        }}
        className="overflow-hidden bg-grey-900 pt-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap md:flex-row flex-col">
          <div className="flex-1 sm:px-20 py-4">
            <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">
              Progress faster
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Supercharged with AI ⚡️
            </p>
            <p className="mt-6 text-lg leading-8 text-white">
              Our video tutorials are accompanied with an AI Coding Companion
              powered by ChatGPT-4. With instant tailored advice, there has
              never been a better time to learn.
            </p>
            <dl className="mt-10 space-y-8 text-base leading-7 text-white">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center my-2">
                  <dt className="flex-shrink-0" style={{ width: "24px" }}>
                    <feature.icon
                      aria-hidden="true"
                      className="h-6 w-6 text-secondary"
                    />
                  </dt>
                  <dd className="ml-4 flex-grow">
                    <span className="font-bold">{feature.name}</span>{" "}
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex-1 px-6 py-4 flex justify-center items-center">
            <Image
              src="/img/ChatBot.webp"
              alt="Product screenshot"
              className="rounded-xl shadow-xl ring-1 ring-gray-100/20"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>

      <div
        className="pt-20"
        ref={charityRef}
        style={{
          transform: charityAnimated ? "translateY(0)" : "translateY(20%)",
          transition: "transform 2s",
        }}
      >
        <Charity />
      </div>

      <SignUpBanner />
    </div>
  );
}
