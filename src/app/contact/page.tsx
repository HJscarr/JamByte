"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import useFadeInOnScroll from "@/components/useFadeInOnScroll";

const Contact: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactRef = useRef(null);
  const [contactVisible, setContactVisible] = useState(false);
  const isContactVisible = useFadeInOnScroll(contactRef);

  useEffect(() => {
    if (isContactVisible && !contactVisible) {
      setContactVisible(true);
    }
  }, [isContactVisible, contactVisible]);

  const contactSignup = async (
    firstname: string,
    lastname: string,
    email: string,
    message: string
  ): Promise<number> => {
    let statusCode = 0;
    try {
      const response = await fetch(
        "https://b65l1amssg.execute-api.eu-west-1.amazonaws.com/Prod/",
        {
          mode: "cors",
          method: "PUT",
          body: JSON.stringify({ firstname, lastname, email, message }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      statusCode = response.status;
      await response.json();
    } catch (err) {
      console.error(err);
    }
    return statusCode;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid()) {
      setResponseMessage("Please fill in all the fields before submitting.");
      return;
    }

    const { firstName, lastName, email, message } = formData;
    const statusCode = await contactSignup(firstName, lastName, email, message);
    const firstDigit = Math.floor(statusCode / 100);

    switch (firstDigit) {
      case 2:
        setResponseMessage(
          "Thanks for reaching out! We will be with you shortly!"
        );
        break;
      case 4:
        setResponseMessage("Invalid request. Please try again.");
        break;
      case 5:
        setResponseMessage("Server error. Please try again later.");
        break;
      default:
        setResponseMessage("An unexpected error occurred. Please try again.");
        break;
    }
  };

  return (     
    <div className="isolate bg-grey-900 px-6 py-24 sm:py-32 lg:px-8" ref={contactRef} style={{
      backgroundImage: `url(${"/img/ManCoding.webp"}), url(${"/img/GirlBuilding.webp"})`,
      backgroundSize: '20%, 20%',
      backgroundPosition: '10% 3%, 90% 5%',
      backgroundRepeat: 'no-repeat, no-repeat',
      opacity: contactVisible ? 1 : 0,
      transition: 'opacity 1s ease-in-out'
    }}>
      <div className="mx-auto max-w-2xl text-center" >
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-200">Contact us</h2>
        <p className="mt-2 text-base sm:text-lg leading-8 text-gray-200">
          Get in touch, please be as specific as possible with your query.
        </p>
      </div>
      <form onSubmit={handleFormSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20 px-6 sm:px-0">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-200">
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
              />
              {submitted && formData.firstName.trim() === '' && <p className="text-red-500 text-sm mt-1">First name is required.</p>}
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-200">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete="family-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
              />
              {submitted && formData.lastName.trim() === '' && <p className="text-red-500 text-sm mt-1">Last name is required.</p>}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-200">
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
              />
              {submitted && formData.email.trim() === '' && <p className="text-red-500 text-sm mt-1">Email is required.</p>}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-200">
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
              />
            </div>
            {submitted && formData.message.trim() === '' && <p className="text-red-500 text-sm mt-1">Message is required.</p>}
          </div>
        
        </div>
        <div className="mt-10">
          <button
            type="submit"
            // disabled={!isFormValid()}
            className="block w-full rounded-md bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-3.5 py-2.5 text-center text-sm font-semibold text-gray-200 shadow-sm hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Let's talk
          </button>
        </div>
        
        {/* Display response message if available */}
        {responseMessage && <p className="mt-4 text-white">{responseMessage}</p>}
      </form>
    </div>
  )
}

export default Contact;