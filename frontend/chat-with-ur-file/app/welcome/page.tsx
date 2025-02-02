import React from "react";
import Image from "next/image";
import Link from "next/link";

const WelcomePage = () => {
  return (
    <div>
      <div className="flex flex-col items-center w-72 mx-auto mt-8">
        <h1 className="font-serif text-xl mb-3">Chat with your file</h1>
        <p className="text-center mb-8">
          Using this software, you can ask your questions and receive answers
          using an artificial intelligence assistant that uses a vector
          embedding model.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <Image src="/images/Frame.png" alt="logo" width={300} height={200} />
      </div>

      <div className="flex justify-center mt-6 mb-20">
        <Link href="/chat">
          <button className="flex justify-between bg-blue-600 text-white p-4 rounded-xl w-64 ">
            <p className="text-center ml-14">Continue</p>
            <Image src="/images/arrow-right.png" alt="arrow" width={20} height={20} className="flex justify-end"/>
          </button>
        </Link>
      </div>

    </div>
  );
};

export default WelcomePage;
