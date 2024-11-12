import React from 'react';
import { AcademicCapIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Upskill England',
    description:
      'Every purchase helps ensure the next generation of problem solvers come from all backgrounds.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Share passion',
    description:
      'Share the passion of technology and building with a larger community.',
    icon: FaceSmileIcon,
  }
];

const Charity: React.FC = () => {
  return (
    <div className="bg-grey-800 pt-24 pb-28 sm:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">Educational Aid</h2>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Courses that bring everyone up to speed
          </p>
          <p className="mt-6 text-md sm:text-lg leading-8 text-gray-200">
            For every 100 courses sold, one will be gifted to an upskilling charity.
          </p>
          <p className="flex justify-center items-center text-4xl mt-4 leading-8 text-gray-200">
            🎁
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt className="flex items-center text-base font-semibold leading-7 text-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <span className="ml-4">{feature.name}</span>
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-200">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Charity;