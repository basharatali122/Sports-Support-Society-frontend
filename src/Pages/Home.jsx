import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ContactUs from "../Components/ContactUs";
import Footer from "../Components/Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 px-4 sm:px-6 lg:px-8"></div>

            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to </span>
                  <span className="block text-indigo-600">
                    VU sports Society
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Unlock your true potential by joining our university sports
                  society a platform to refine your talent, enhance your skills,
                  and grow both on and off the field.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register" // ✅ Correct prop (instead of `navigate`)
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Join Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex justify-center items-center">
          <img
            className="h-56 w-[90%] object-contain sm:h-72 md:h-96 lg:h-full"
            src="https://img.freepik.com/premium-vector/soccer-players-with-ball-sports-soccer-team-silhouettes-decorated-with-triangle-mosaic-pattern-football-players-goalkeeper-posing-with-ball-isolated-vector-illustration_108855-3368.jpg?w=996"
            alt="Workflow illustration"
          />
        </div>
      </div>

      <ContactUs />
      <Footer />
    </div>
  );
}

export default Home;
