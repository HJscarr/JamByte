import { WrenchScrewdriverIcon, CodeBracketIcon, ShieldCheckIcon, CpuChipIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Fundamental Programming Techniques',
    description:
      `You'll learn a wide-range of programming techinques that are used across languages and disciplines.`,
    icon: CodeBracketIcon,
  },
  {
    name: 'High Quality Electronic Components',
    description:
      'The bundle of high quality electronics will not only to help you succeed in this course but excel in future development.',
    icon: CpuChipIcon,
  },
  {
    name: 'An Innovative Approach to Technology',
    description:
      'Discover mental approaches that professional engineers employ in top tech companies.',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'A Completely Customiseable Home Security Device',
    description:
      'Create a fully customisable home security device that can be reassembled into different devices.',
    icon: ShieldCheckIcon,
  },
]

export const Outcomes = () => {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">Outcomes</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            What will you gain?
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Learn how to program in Python and BASH. This course contains a bundle of high quality electronic components, access to state of the art AI, and a multitude of technical problem solving skills.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-100">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-200">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Outcomes;