import React from 'react';
import Link from 'next/link';
import * as Fa from 'react-icons/fa';
import { social } from '@/types/main';
import { event } from '@/lib/gtag'; // Import the event function

const Socials = ({ socials }: { socials: social[] }) => {
  // Function to track social media link clicks
  const trackSocialClick = (platform: string) => {
    event({
      action: 'click',
      category: 'Social Media',
      label: platform, // e.g., "FaTwitter", "FaLinkedIn"
      value: 1, // Optional: represents the number of clicks
    });
  };

  return (
    <section
      id="socials"
      className="fixed xl:bottom-4 xl:left-4 2xl:bottom-10 2xl:left-10 hidden lg:flex flex-col gap-3 z-20"
    >
      {socials.map((s: social) => {
        return (
          <Link
            href={s.link}
            target="_blank"
            rel="noreferrer"
            key={s.icon}
            className="grid place-items-center p-3 hover:animate-bounce rounded-full bg-pink-700 text-white"
            onClick={() => trackSocialClick(s.icon)} // Add click tracking
          >
            {
              //@ts-ignore
              React.createElement(Fa[`${s.icon}`])
            }
          </Link>
        );
      })}
    </section>
  );
};

export default Socials;