import React from "react";
import { useEffect } from "react";

// Styles 
import "../assets/vendors/bootstrap/bootstrap.min.css";
import "../assets/vendors/bootstrap-icons/font/bootstrap-icons.min.css";
import "../assets/vendors/glightbox/glightbox.min.css";
import "../assets/vendors/swiper/swiper-bundle.min.css";
import "../assets/vendors/aos/aos.css";
// End styles 

// Javascript and libraries
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { gsap } from "gsap";
import imagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";
import "swiper/css"; // ✅ basic styles
import "swiper/css/navigation"; // ✅ only if you use navigation
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import PureCounter from "@srexi/purecounterjs";
// end of javascript and libraries 


export default function HomePage() {
  useEffect(() => {
    AOS.init();
    new PureCounter();
  }, []);
  return <div>HomePage</div>;
}
