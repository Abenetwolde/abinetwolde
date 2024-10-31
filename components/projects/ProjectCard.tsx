import { project } from "@/types/main"
import Image from "next/image"
import Link from "next/link"
import { FaGithub, FaVideo } from "react-icons/fa"
import { MdOutlineInsertPhoto } from "react-icons/md";
import { BiLinkExternal } from "react-icons/bi"
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from "react"
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
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
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [openModal, setOpenModal] = useState({
        photos: false,
        video: false,
        site: false,
        code: false
    });

    const handleModalOpen = (type: any) => {
        setOpenModal({ ...openModal, [type]: true });
    };

    const handleModalClose = (type: any) => {
        setOpenModal({ ...openModal, [type]: false });
    };
    const toggleOverlay = () => {
        setOverlayVisible(!isOverlayVisible);
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
                        {links.video.trim() && (
                            <Tooltip placement='top' title="Watch Video" arrow>
                                <button onClick={() => handleModalOpen("video")} className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                    <FaVideo size={20} />
                                </button>
                            </Tooltip>
                        )}
                        {links.visit.trim() && (
                            <Tooltip placement='top' title="Visit Site" arrow>
                                <Link href={links.visit} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
                                    <BiLinkExternal size={20} />
                                </Link>
                            </Tooltip>
                        )}
                        {links.code.trim() && (
                            <Tooltip placement='top' title="View Code" arrow>
                                <Link href={links.code} target="_blank" className="bg-white text-black p-2 rounded-lg hover:bg-black hover:text-white transition-all">
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
            </div>
            <Dialog PaperProps={{
                style: {
                    width: '90%',
                    height: '90%',
                    maxWidth: 'none',
                },
            }} open={openModal.photos} onClose={() => handleModalClose("photos")}>
                <DialogTitle>Photos</DialogTitle>
                <DialogContent style={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1} // Show one image at a time
            navigation
            pagination={{ clickable: true }}
            style={{ width: '100%', height: '100%' }} // Make Swiper take full size
        >
            {images?.map((image:any, index:any) => (
                <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img 
                     src={image.src || image} // Use image directly
                        alt={`Slide ${index + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Ensure the image fits
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleModalClose("photos")}>Close</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openModal.video} onClose={() => handleModalClose("video")}>
                <DialogTitle>Video</DialogTitle>
                <DialogContent>
                    {/* Content for video */}
                    <iframe src={links.video} width="100%" height="315" allow="autoplay" title="Video" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleModalClose("video")}>Close</Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    )
}

export default Project