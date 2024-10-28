import { project } from "@/types/main"
import Image from "next/image"
import Link from "next/link"
import { FaGithub, FaVideo } from "react-icons/fa"
import { BiLinkExternal } from "react-icons/bi"
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } }
};

const Project = ({ name, images, category, techstack, links }: project) => {

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });
    const controls = useAnimation();

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial='hidden'
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-2 bg-white dark:bg-grey-800 rounded-lg p-4">

            <div className="relative group rounded-lg bg-violet-50">
                <div className="w-full overflow-hidden">
                    <Swiper
                        modules={[Autoplay]}
                        slidesPerView={1}
                         spaceBetween={1}
                        loop={true} // Infinite scroll
                        autoplay={{
                            delay: 2000, // Delay between transitions
                            disableOnInteraction: false, // Keeps autoplay running after interaction
                        }}
                    >
                        {images?.map((image: any, index: any) => (
                            <SwiperSlide key={index} className="flex justify-center">
                                <div className="w-full ">
                                    <Image
                                        src={image}
                                        alt={`carousel-image-${index}`}
                                        width={1000}
                                        height={1000}
                                        
                                        className="rounded-lg  object-cover w-full h-48"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                {(links.visit.trim() || links.code.trim() || links.video.trim()) &&
                    <div className=" z-50 absolute top-0 scale-x-0 group-hover:scale-100 transition-transform origin-left duration-200 ease-linear bg-gray-800 bg-opacity-60 w-full h-full rounded-lg flex items-center gap-4 justify-center">
                           <Link href={links.video} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <FaVideo size={20} />
                            </Link>
                        {links.visit.trim() &&
                            <Link href={links.visit} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <BiLinkExternal size={20} />
                            </Link>
                        }
                        {links.code.trim() &&
                            <Link href={links.code} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <FaGithub size={20} />
                            </Link>
                        }
                        {links.video.trim() &&
                            <Link href={links.video} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                <FaVideo size={20} />
                            </Link>
                        }
                    </div>
                }
            </div>

            <div className="my-2 flex flex-col gap-3">
                <h3 className="text-xl font-medium">{name}</h3>
                <p className="text-sm text-gray-400"> <span className="font-medium">Tech Stack:</span> {techstack}</p>
            </div>

        </motion.div>
    )
}

export default Project