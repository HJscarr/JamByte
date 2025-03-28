// ProgressSteps.tsx
import { DocumentMagnifyingGlassIcon, DocumentCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const steps = [
  { 
    id: '01', 
    name: 'Upload CV', 
    description: 'Upload your CV in PDF or DOCX format',
    href: '#', 
    status: 'complete',
    icon: DocumentTextIcon 
  },
  { 
    id: '02', 
    name: 'AI Analysis', 
    description: 'Our AI analyses your CV against Amazon Leadership Principles and STAR format',
    href: '#', 
    status: 'current',
    icon: DocumentMagnifyingGlassIcon 
  },
  { 
    id: '03', 
    name: 'Get Recommendations', 
    description: 'Receive detailed suggestions for improvement',
    href: '#', 
    status: 'upcoming',
    icon: DocumentCheckIcon 
  },
];

export function CVProgressSteps() {
  return (
    <div className="my-8">
      <nav aria-label="Progress">
        <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === 'complete' ? (
                <a href={step.href} className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <step.icon className="h-6 w-6 text-gray-200" aria-hidden="true" />
                    </span>
                    <span className="ml-4">
                      <p className="text-sm font-medium text-gray-200">{step.name}</p>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </span>
                  </span>
                </a>
              ) : step.status === 'current' ? (
                <a href={step.href} aria-current="step" className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <step.icon className="h-6 w-6 text-gray-200" aria-hidden="true" />
                  </span>
                  <span className="ml-4">
                    <p className="text-sm font-medium text-gray-200">{step.name}</p>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </span>
                </a>
              ) : (
                <a href={step.href} className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <step.icon className="h-6 w-6 text-gray-200" aria-hidden="true" />
                    </span>
                    <span className="ml-4">
                      <p className="text-sm font-medium text-gray-200 group-hover:text-gray-300">{step.name}</p>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </span>
                  </span>
                </a>
              )}
              {stepIdx !== steps.length - 1 ? (
                <>
                  <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}