import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import jamjargif from "../assets/img/jamjar.gif";

function emailHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
  }
  return hash.toString();
}

export const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [showGif, setShowGif] = useState(false);

  const contactSignup = async (email: string): Promise<number> => {
    let statusCode = 0;
    await fetch('https://b65l1amssg.execute-api.eu-west-1.amazonaws.com/Prod/', {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify({
        email: email,
        user_id: emailHash(email)
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(email);
    console.log(emailHash(email));

    const statusCode = await contactSignup(email);

    switch (statusCode) {
      case 200:
        setResponseMessage("Thanks for signing up! We will be with you shortly!");
        setShowGif(true);
        break;
      case 400:
        setResponseMessage("Invalid request. Please try again.");
        break;
      case 500:
        setResponseMessage("Server error. Please try again later.");
        break;
      default:
        setResponseMessage("An unexpected error occurred. Please try again.");
        break;
    }
  }

  return (
    <div className="bg-secondary items-center p-10 rounded-lg shadow-md w-2/5 mt-24 mb-56 mx-auto">
      <h2 className="text-xl text-white font-semibold mb-4">Sign up to our newsletter</h2>

      <form id="signupform" onSubmit={onSubmit}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" type="submit">Sign Up</button>
      </form>

      {responseMessage && <p className="mt-4 text-white">{responseMessage}</p>}
      {showGif && (
        <div className="relative left-1/2 w-48 transform -translate-x-1/2 mt-10">
          <Image
            src={jamjargif as StaticImageData}
            alt="Success GIF"
            layout="responsive"
            width={192}
            height={192}
          />
        </div>
      )}
    </div>
  );
}

export default ContactForm;