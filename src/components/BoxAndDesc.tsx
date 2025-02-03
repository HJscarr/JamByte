"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; 
import Link from "next/link";
import { StarIcon } from "@heroicons/react/20/solid";
import { RocketLaunchIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@/context/AuthContext';
import CheckoutHandler from "./CheckoutHandler";
import StockChecker from "./StockChecker";
import { useHasBought } from '@/hooks/useHasBought';

const product = {
  name: "Pi-Guard",
  price: "£74",
  href: "#",
  images: [
    {
      src: "/img/Pi-Guard/PiSpyBox.webp",
      alt: "A box containing the electronics required to build Pi-Guard.",
    },
  ],
  description: (
    <>
      Learn programming, electronics, and networking by creating a home security
      device. It records audio and video when it detects motion!
    </>
  ),
  highlights: [
    {
      key: "electronics",
      content: "A box of high quality electronics, used to build the device",
    },
    {
      key: "video-tutorials",
      content: (
        <span>
          Expertly crafted{" "}
          <a
            href="https://www.youtube.com/watch?v=23edi4G0BWk&ab_channel=JamByte"
            className="text-secondary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            video tutorials
          </a>
          , created by programmers at Amazon
        </span>
      ),
    },
    {
      key: "ai-assistant",
      content:
        "An AI assistant to accelerate your learning, powered by ChatGPT-4",
    },
    {
      key: "documents",
      content:
        "Written documents, resources and materials to develop your skills",
    },
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};

const reviews = { href: "#", average: 4.5, totalCount: 1 };

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const BoxAndDesc = () => {
  const [successUrl, setSuccessUrl] = useState<string>('');
  const { data: hasBought = false } = useHasBought(product.name);
  const auth = useAuth();

  useEffect(() => {
    setSuccessUrl(`${window.location.origin}/checkout-success`);
  }, []);

  return (
    <div className="overflow-hidden bg-gray-900 pb-32 mt-6 sm:mt-20 sm:px-40">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 sm:gap-y-20 lg:mx-0 lg:max-w-none">
          <div className="overflow-hidden rounded-lg lg:flex lg:items-center lg:justify-center">
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              width={500} 
              height={500}
              className="rounded-lg bg-transparent w-full h-auto mt-4 lg:mt-8 lg:w-6/7 sm:pr-12 object-contain"
            />
          </div>

          <div className="sm:mt-4">
            <h2 className="sr-only">Product information</h2>
            <h1 className="text-2xl font-bold tracking-tight text-gray-50 sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text pb-4">
              A JamByte Course
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xl sm:text-3xl tracking-tight text-gray-50">
                {product.price}
              </p>
              <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-2 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                Free Shipping
                <CheckCircleIcon className="ml-1 h-4 w-4" />
              </span>
            </div>

            <div className="">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <a
                  href="https://uk.trustpilot.com/review/jambyte.io"
                  className="flex items-center text-sm font-medium bg-gradient-to-r from-secondary to-red-400 text-transparent mt-4 bg-clip-text"
                >
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          reviews.average > rating
                            ? "text-secondary"
                            : "text-gray-200",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="ml-3">Avg reviews</span>
                </a>
              </div>

              <div className="pt-4 text-sm text-gray-200">
                <StockChecker productId="price_1OkwbGGAlR94zWojhzJ8TgdB" />
              </div>
              <div className="pt-7 flex">
                {hasBought ? (
                  <>
                    <Link href="/lesson">
                      <button
                        type="button"
                        className="flex-shrink-0 flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 w-32 sm:w-36 py-3 text-xs sm:text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Start&nbsp;Learning
                        <RocketLaunchIcon className="h-4 sm:h-5 w-4 sm:w-5 ml-2 text-white" />
                      </button>
                    </Link>
                  </>
                ) : (
                  <CheckoutHandler
                    priceID="price_1QVtp8GAlR94zWojDJgWQxD3"
                    successUrl={successUrl}
                    cancelUrl="https://jambyte.io/Pi-Guard"
                  />
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-md sm:text-base text-gray-50">
                  {product.description}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-md sm:text-base font-semibold text-gray-50">
                Included in this course:
              </h3>
              <div className="mt-2">
                <ul role="list" className="list-disc space-y-2 pl-4 text-md">
                  {product.highlights.map((highlight) => (
                    <li key={highlight.key} className="text-gray-200">
                      <span className="text-gray-100">{highlight.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxAndDesc;