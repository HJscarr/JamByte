import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlayCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface lesson {
  title: string;
  description: string;
  video: string;
  length: string;
}

interface LessonListProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lessons: lesson[];
  setSelectedLesson: (index: number) => void;
  currentIndex: number;
  progress: { [key: number]: number };
  thumbnails: Record<string, string>;
}

export const LessonList: React.FC<LessonListProps> = ({ open, setOpen, lessons, setSelectedLesson, currentIndex, progress }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-x-0 top-0 bottom-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-auto bg-gray-900 shadow-xl max-h-[100vh] pb-8">
                    <div className="pt-6 px-4 sm:px-6 mb-3">
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-100">
                        lesson List
                      </Dialog.Title>
                      <div className="h-0.5 mt-2 bg-gray-100"></div>
                    </div>

                    {/* lesson List */}
                    {lessons.map((lesson, index) => (
                      <div 
                        key={`lesson-${index}`} // Added unique key prop
                        className={`group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-700 ${currentIndex === index ? "bg-gray-800" : ""}`}
                        onClick={() => setSelectedLesson(index)}
                      >
                        <div className={`mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg ${currentIndex === index ? "bg-gray-900" : "bg-gray-800"} group-hover:bg-gray-600`}>
                          <PlayCircleIcon className="h-6 w-6 text-secondary group-hover:text-secondary" aria-hidden="true" />
                        </div>
                        <div>
                          <a href="#" className="font-semibold text-gray-100">
                            {lesson.title}
                            <span className="absolute inset-0"></span>
                          </a>
                          <div className="flex items-center mt-1 gap-1">
                            <ClockIcon className="h-4 w-4 text-gray-200" aria-hidden="true" />
                            <p className="text-gray-200">{lesson.length}</p>
                          </div>
                          <p className="text-sm text-gray-400">{progress[index] ? `Progress: ${Math.round((progress[index] || 0) * 100)}%` : 'Not Started'}</p>

                          {/* Progress Bar */}
                          <div className="relative bg-gray-300 mt-1 rounded h-2 w-40">
                            <div className="absolute left-0 top-0 h-2 rounded bg-secondary" style={{ width: `${(progress[index] || 0) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LessonList;