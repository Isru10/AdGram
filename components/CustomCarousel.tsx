"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiZap, FiMessageSquare, FiShield } from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// The data for our service cards remains the same
const services = [
  {
    icon: FiZap,
    title: 'Post an Ad Instantly',
    description: 'List your Telegram channel or group for sale in under a minute. It\'s fast, simple, and effective.',
  },
  {
    icon: FiMessageSquare,
    title: 'Chat in Real-Time',
    description: 'Connect directly with potential buyers or sellers through our secure, real-time messaging system.',
  },
  {
    icon: FiShield,
    title: 'Secure Your Deal',
    description: 'Negotiate terms and finalize your transaction with confidence, all within one seamless platform.',
  },
];

export default function CustomCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoized functions to prevent re-creation on every render
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  }, []);
  
  // Autoplay functionality
  useEffect(() => {
    const autoplay = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(autoplay); // Clean up the interval on component unmount
  }, [nextSlide]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* The main viewport that hides overflowing slides */}
      <div className="overflow-hidden">
        {/* The inner container that moves horizontally */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {services.map((service, index) => (
            // Each slide takes up the full width of the container
            <div className="flex-shrink-0 w-full p-4" key={index}>
              <div className="bg-slate-800 h-full p-8 rounded-xl border border-slate-700 flex flex-col items-center text-center">
                <div className="bg-slate-700 text-blue-400 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                  <service.icon size={30} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 md:-left-12 transform -translate-y-1/2 bg-slate-700/50 p-3 rounded-full text-white hover:bg-slate-700 transition"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 md:-right-12 transform -translate-y-1/2 bg-slate-700/50 p-3 rounded-full text-white hover:bg-slate-700 transition"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === index ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}