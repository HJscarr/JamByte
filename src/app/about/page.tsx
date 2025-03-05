import Image from 'next/image';
import image7 from '@/images/real-life/img7.jpg';

const people = [
  {
    name: 'James Scarr',
    role: 'Co-Founder / Teacher',
    imageUrl: '/img/James.webp',
    description: `James holds a First Class Honours degree in Computer Science. Currently working as a programming consultant for Amazon Web Services.

    James' journey with technology started long before his formal education - building his first computer at the age of 14. This passion was ignited further after being deeply moved by the movie 'The Imitation Game'. Infused with a deep love for both technology and teaching, he views tech as a transformative power capable of reshaping the future.

    His mission with JamByte is not just to teach students the essentials of programming and electronics, but also to inspire curiosity and innovation.`
  },
  {
    name: 'Pinchu Ye',
    role: 'Co-Founder / Engineer',
    imageUrl: '/img/Pinchu.webp',
    description: `Pinchu is the technological maestro behind JamByte. graduating from the Imperial College University, Pinchu holds both a first-class degree in Computer Science and a first-class master's degree.

    Working as a software engineer for Amazon Web Services, Pinchu has a wealth of knowledge, experience, and passion for pushing technological boundaries.

    When not immersed in the latest technological trends or brainstorming course content for JamByte, Pinchu unwinds by spending quality time with his beloved dog, Cookie.`
  },
];

export default function About() {
  return (
    <div>
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-bold tracking-tight text-secondary sm:text-6xl">Inspiring a generation</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Our aim is to inspire a love for technology in as many individuals across the country as possible; empowering them to solve the problems we face as a species.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                We want to enable the next generation of creators to make a better world for everyone.
              </p>
            </div>
            <div className="relative h-[200px] lg:h-[300px] rounded-xl overflow-hidden">
              <Image
                src={image7}
                alt="Inspiring technology"
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-6">Our team</h2>
          <p className="text-3xl leading-8 text-slate-300 mb-32">
            We are a pair of creators aiming to bring you the best in technology education.
          </p>

          <ul role="list" className="flex justify-center gap-x-24 flex-wrap">
            {people.map((person) => (
              <li key={person.name} className="text-left flex flex-col items-center mb-12">
                <div
                  className={`w-48 h-48 bg-center rounded-lg mb-8 ${person.name === 'James Scarr' ? '' : 'bg-cover'}`}
                  style={{
                    backgroundImage: `url(${person.imageUrl})`,
                    backgroundSize: '100%',
                    backgroundPosition: 'center 20%'
                  }}
                ></div>
                <h3 className="text-base font-semibold leading-7 mb-2 tracking-tight text-white">{person.name}</h3>
                <p className="text-sm font-semibold leading-6 text-secondary mb-8">{person.role}</p>
                <p className="text-lg leading-6 text-slate-300 max-w-md">
                  {person.name === 'James Scarr' ? (
                    <>
                      James holds a First Class Honours degree in Computer Science. Currently working as a programming consultant for Amazon Web Services.<br /><br />
                      James' love for technology is evident through the drones, computers and electronics he builds. This passion was born after being deeply moved by the movie 'The Imitation Game'. He views tech as a transformative power capable of reshaping the future.<br /><br />
                      His mission with JamByte is not just to teach students the essentials of programming and electronics, but also to inspire curiosity and innovation.
                    </>
                  ) : person.name === 'Pinchu Ye' ? (
                    <>
                      Pinchu graduated from Imperial College University, and holds both a first-class degree in Computer Science and a first-class master's degree.<br /><br />
                      Working as a software engineer for Amazon Web Services, Pinchu has a wealth of knowledge, experience, and passion for pushing technological boundaries.<br /><br />
                      When not immersed in the latest technological trends or brainstorming course content for JamByte, Pinchu unwinds by spending quality time with his beloved dog, Cookie.
                    </>
                  ) : (
                    person.description
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}