'use client'

import { useState } from 'react'
import GradientButton from '@/components/GradientButton';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const manCodingUrl = "/img/ManCoding.webp";
const girlBuildingUrl = "/img/GirlBuilding.webp";


export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false); // Track form submission
  const [messageSent, setMessageSent] = useState(false); // Track if message was sent (on submit)

  const contactSignup = async (firstname:string, lastname:string, email: string, message: string): Promise<number> => {
    let statusCode = 0;
    await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/contact', {
      method: 'POST',
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        message: message
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  
    return statusCode;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const isFormValid = () => {
    return formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.message.trim() !== ''
  };
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setMessageSent(true);
    
    if (!isFormValid()) {
      return;
    }
    
    const { firstName, lastName, email, message } = formData;

    const statusCode = await contactSignup(firstName, lastName, email, message);
  };

  return (     
    <div className="isolate bg-grey-900 px-6 py-24 sm:py-32 lg:px-8" style={{
      backgroundImage: `url(${manCodingUrl}), url(${girlBuildingUrl})`,
      backgroundSize: '20%, 20%',
      backgroundPosition: '10% 5%, 90% 5%',
      backgroundRepeat: 'no-repeat, no-repeat',
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
        <div className="mt-10 flex justify-center">
          {messageSent ? (
            <GradientButton className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 w-full flex justify-center">
              <span className="flex items-center gap-2 mx-auto text-center whitespace-nowrap">
                Message Received
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
            </GradientButton>
          ) : (
            <GradientButton type="submit" className="bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 w-full flex justify-center">
              <span className="flex items-center gap-2 mx-auto text-center whitespace-nowrap">
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
                Let's talk
              </span>
            </GradientButton>
          )}
        </div>
      </form>
    </div>
  )
}