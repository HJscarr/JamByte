'use client'

import React from 'react';
import Image from 'next/image';
import { ComputerDesktopIcon, WifiIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'WiFi.',
    description:
      'You will need an WiFi connection, for both your Computer/Laptop & the device you will be building.',
    icon: WifiIcon,
  },
  {
    name: 'Computer/Laptop.',
    description: 'To connect, control and program the device you will need a computer or laptop.',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Bundles of Curiosity.',
    description: 'A passion to learn and discover a new world of technology will go a long way!',
    icon: QuestionMarkCircleIcon,
  },
]

export const Prerequisites: React.FC = () => {
  return (
    <div className="overflow-hidden bg-gray-900 md:ml-36 mt-18 pt-48 pb-28">
      <div className="mx-auto max-w-7xl sm:px-4 lg:px-28">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">Prerequisites</h2>
              <p className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-gray-100">Requirements for the Course</p>
              <p className="mt-6 text-base sm:text-lg leading-8 text-gray-200">
                To complete the course you will need the following...
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-sm sm:text-base leading-7 text-gray-200 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-100">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-secondary" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            src="/img/pre-req.webp"
            alt="Product screenshot"
            width={450}  
            height={300} 
            className="mx-auto pt-5 sm:mx-0 -mt-12"
          />
        </div>
      </div>
    </div>
  )
}

export default Prerequisites;