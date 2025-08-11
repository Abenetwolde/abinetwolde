import { project } from "@/types/main"
import Image from "next/image"
import Link from "next/link"
import { FaGithub, FaVideo } from "react-icons/fa"
import { MdOutlineInsertPhoto } from "react-icons/md";
import { BiLinkExternal } from "react-icons/bi"
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from "react"
import 'swiper/css';
import 'swiper/css/autoplay';
import { A11y, Autoplay, EffectCube, Scrollbar } from 'swiper/modules';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog'; // Import Dialog component
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';

import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React from "react";
import { event } from "@/lib/gtag";
const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } }
};

const Project = ({ name, images, blog, category, techstack, links, discription }: project) => {

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });
    const controls = useAnimation();
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [openModal, setOpenModal] = useState({
        photos: false,
        video: false,
        site: false,
        code: false
    });

    const handleModalOpen = (type: any) => {
        setOpenModal({ ...openModal, [type]: true });
        event({
            action: "open_modal",
            category: "Project",
            label: `${name} - ${type}`, // e.g., "Project X - photos"
            value: 1,
        });
    };

    const handleModalClose = (type: any) => {
        setOpenModal({ ...openModal, [type]: false });
    };
    const toggleOverlay = () => {
        setOverlayVisible(!isOverlayVisible);
        event({
            action: "click",
            category: "Project",
            label: name, // Project name as label
            value: 1,
        });
    };


    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial='hidden'
            onClick={toggleOverlay}
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-2 bg-white dark:bg-grey-800 rounded-lg p-4 overflow-hidden">

            <div className="relative group rounded-lg bg-violet-50 w-full ">
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
                                        loading='lazy'
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
                {(images || links.code.trim() || links.video.trim()) && (
                    <div
                        className={`z-50 absolute top-0 ${isOverlayVisible ? 'scale-100' : 'scale-x-0'
                            } group-hover:scale-100 transition-transform origin-left duration-200 ease-linear bg-gray-800 bg-opacity-60 w-full h-full rounded-lg flex items-center gap-4 justify-center`}
                    >
                        {images && (
                            <Tooltip placement='top' title="View Photos" arrow>
                                <button onClick={() => handleModalOpen("photos")} className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                    <MdOutlineInsertPhoto size={20} />
                                </button>
                            </Tooltip>
                        )}
                        {links?.video?.trim() && (
                            <Tooltip placement='top' title="Watch Video" arrow>
                                <button onClick={() => handleModalOpen("video")} className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                    <FaVideo size={20} />
                                </button>
                            </Tooltip>
                        )}
                        {links?.visit?.trim() && (
                            <Tooltip placement='top' title="Visit Site" arrow>
                                <Link href={links.visit} onClick={() =>
                                    event({
                                        action: "click",
                                        category: "Project Link",
                                        label: `${name} - Visit Site`,
                                        value: 1,
                                    })
                                } target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                    <BiLinkExternal size={20} />
                                </Link>
                            </Tooltip>
                        )}
                        {links?.code?.trim() && (
                            <Tooltip placement='top' title="View Code" arrow>
                                <Link href={links.code} onClick={() =>
                                    event({
                                        action: "click",
                                        category: "Github Link",
                                        label: `${name} - github repo`,
                                        value: 1,
                                    })
                                } target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                    <FaGithub size={20} />
                                </Link>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>

            <div className="my-2 flex flex-col gap-3">
                <h3 className="text-xl font-medium">{name}</h3>
                <p className="text-sm text-gray-400"> <span className="font-medium">Tech Stack:</span> {techstack}</p>
                <a href={blog} onClick={() =>
                    event({
                        action: "click",
                        category: "Blog Link",
                        label: `${name} - Blog Site`,
                        value: 1,
                    })
                } className="text-sm text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                    {blog && <span className="font-medium">Read the Blog</span>}
                </a>
            </div>
            <Dialog PaperProps={{
                style: {
                    width: '90%',
                    height: '100%',
                    maxWidth: 'none',
                },
            }} open={openModal.photos} onClose={() => handleModalClose("photos")}>
                <DialogTitle
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5', // Light gray background
                        padding: '8px'
                    }}
                >
                    Screenshots of {name}
                    <Button
                        onClick={() => handleModalClose("photos")}
                        variant="contained"
                        color="primary"
                        style={{
                            backgroundColor: '#FF7F7F', // Set button color
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'none'
                        }}
                    >
                        Close
                    </Button>
                </DialogTitle>
                <DialogContent
                    style={{
                        padding: 0,
                        overflowY: 'auto', // Enable scrolling
                        maxHeight: 'calc(100vh - 150px)',
                        ...(!discription && { // Check if description exists
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }),

                    }}
                >
                    <Swiper

                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        loop={true} // Enable looping
                        // onSlideChange={() => console.log('slide change')}
                        // onSwiper={(swiper) => console.log(swiper)}
                         style={{
            height: "auto",
            width: "100%",
            backgroundColor: "#f5f5f5", // Light gray background
            paddingBottom: "3rem", // Extra space for pagination controls
            "--swiper-navigation-size": "2.5rem", // Increase arrow size
            "--swiper-navigation-color": "#333", // Darker arrow color for visibility
            "--swiper-navigation-background-color": "rgba(255, 255, 255, 0.8)", // Semi-transparent background
            "--swiper-navigation-border-radius": "8px", // Rounded corners
            "--swiper-navigation-padding": "1rem", // Larger clickable area
          }}
          className="custom-swiper" // Add a class for additional styling
                    >
                        {images?.map((image: any, index: any) => (
                            <SwiperSlide
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <img
                                    src={image.src || image}
                                    alt={`Slide ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain', // Ensures full view without cropping
                                        paddingBottom: '1rem' // Additional padding for spacing from pagination
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {discription && (
                        <div
                            style={{
                                padding: '1rem',
                                width: '100%',
                                // maxHeight: '40%',
                                overflowY: 'auto',
                                backgroundColor: '#ffffff',
                                color: '#333',
                                textAlign: 'left',
                                lineHeight: '1.5',
                            }}
                            dangerouslySetInnerHTML={{ __html: discription }}
                        ></div>
                    )}
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={() => handleModalClose("photos")}>Close</Button>
                </DialogActions> */}
            </Dialog>


            <Dialog PaperProps={{
                style: {
                    width: '90%',
                    height: '100%',
                    maxWidth: 'none',
                },
            }} open={openModal.video} onClose={() => handleModalClose("video")}>
                <DialogTitle
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5', // Light gray background
                        padding: '8px'
                    }}
                >
                    Vedio
                    <Button
                        onClick={() => handleModalClose("video")}
                        variant="contained"
                        color="primary"
                        style={{
                            backgroundColor: '#FF7F7F', // Set button color
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'none'
                        }}
                    >
                        Close
                    </Button>
                </DialogTitle>
                <DialogContent style={{
                    padding: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }} >
                    {/* Content for video */}
                    <iframe
                        src={`https://www.youtube.com/embed/${links.video?.split('v=')[1]?.split('&')[0]}`} // Extract video ID
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            padding: 3
                        }}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="YouTube Video"
                    />
                </DialogContent>

            </Dialog>
        </motion.div>
    )
}

export default Project

function useRef(arg0: null) {
    throw new Error("Function not implemented.");
}
