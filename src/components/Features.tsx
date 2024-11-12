'use client'

import React from 'react';
import Image from 'next/image';

const features = [
  { name: 'Micro-Computer', description: 'Raspberry Pi 2 Zero with colour coded headers' },
  { name: 'Motion Sensor', description: 'A passive infrared motion sensor that can detect radiation (heat) emitted by living objects' },
  { name: 'Camera', description: 'A micro camera for recording video or taking photos' },
  { name: 'Power Supply', description: 'A premium power supply has been included to ensure the longevity of your components' },
  { name: 'SD Memory Card', description: 'A 16GB Micro-SD card to use as storage for the device' },
  { name: 'Essential Accessories', description: 'MicroSD card adapter (for memory), a 3-pin sensor cable (for motion sensing), a micro-USB adapter (For recording), and the official case for the device' },
];

export const Features: React.FC = () => {
  return (
    <div className="bg-gray-900 mt-32 sm:px-60">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 sm:px-6 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-50 sm:text-4xl">What's in the box?</h2>
          <p className="mt-4 text-gray-200">
            This bundle includes a range of high quality components that you can use to build this project and many more!
          </p>

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-600 pt-4">
                <dt className="font-medium text-gray-50">{feature.name}</dt>
                <dd className="mt-2 text-sm text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
          <Image
            src="/img/Pi-Guard/pizero2wh.webp"
            alt="Raspberry Pi Zero v2."
            width={500}
            height={300}
            className="rounded-lg bg-gray-100 w-full h-full object-cover"
          />
          <Image
            src="/img/Pi-Guard/pirsensor.webp"
            alt="PIR Sensor"
            width={500}
            height={300}
            className="rounded-lg bg-gray-100 w-full h-full object-cover"
          />
          <Image
            src="/img/Pi-Guard/Camera.webp"
            alt="Camera module"
            width={500}
            height={300}
            className="rounded-lg bg-gray-100 w-full h-full object-cover"
          />
          <Image
            src="/img/Pi-Guard/PSU.webp"
            alt="Power Supply Unit"
            width={500}
            height={300}
            className="rounded-lg bg-gray-100 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Features;