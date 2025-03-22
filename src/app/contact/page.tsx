import Image from 'next/image';

const Contact = () => {
  return (     
    <div className="isolate bg-grey-900 px-6 pb-40 sm:pb-64 lg:px-8 animate-fadeIn relative">
      <div className="absolute bottom-0 left-[10%] sm:left-[30%] lg:left-[40%] w-[35%] sm:w-[35%] lg:w-[50%] h-[35%] sm:h-[35%] lg:h-[50%]">
        <Image
          src="/img/ManCoding.webp"
          alt="Man coding illustration"
          width={800}
          height={800}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="absolute -bottom-5 right-[10%] sm:right-[30%] lg:right-[40%] w-[35%] sm:w-[35%] lg:w-[50%] h-[35%] sm:h-[35%] lg:h-[50%]">
        <Image
          src="/img/GirlBuilding.webp"
          alt="Girl building illustration"
          width={800}
          height={800}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="mx-auto max-w-2xl text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-200">Contact Us</h2>
        <p className="mt-8 text-lg sm:text-xl leading-8 text-gray-200">
          Have a question or need assistance? We're here to help!
        </p>
        <p className="mt-4 text-base sm:text-lg leading-8 text-gray-200">
          Please email us at{' '}
          <a href="mailto:support@jambyte.io" className="text-secondary hover:text-pink-400 transition-colors">
            support@jambyte.io
          </a>
        </p>
        <p className="mt-4 text-sm sm:text-base text-gray-300">
          We aim to respond to all inquiries within 24-48 hours.
        </p>
      </div>
    </div>
  )
}

export default Contact;