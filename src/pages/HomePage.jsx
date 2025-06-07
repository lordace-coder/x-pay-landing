import React from "react";
import { useEffect } from "react";
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

export default function HomePage() {
  useEffect(() => {
    AOS.init();
    new PureCounter();
  }, []);
  return <div>HomePage</div>;
}
