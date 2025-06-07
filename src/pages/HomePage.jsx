import React from "react";
import { useEffect } from "react";

// Importing images 
import DarkLogo from "../assets/images/logo-dark.svg";
import LightLogo from "../assets/images/logo-light.svg";
import LogoAirBnbBlack from "../assets/images/logo/actual-size/logo-air-bnb__black.svg";
import LogoIbmBlack from "../assets/images/logo/actual-size/logo-ibm__black.svg";
import LogoGoogleBlack from "../assets/images/logo/actual-size/logo-google__black.svg";
import CardExpenses from "../assets/images/card-expenses.png";
import HeroImg1Min from "../assets/images/hero-img-1-min.jpg";
import About2Min from "../assets/images/about_2-min.jpg";
import ArchLine from "../assets/images/arch-line.svg";
import ArchLineReverse from "../assets/images/arch-line-reverse.svg"

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

// HEADER
const Header = function () {
  return (
    <header
      className="fbs__net-navbar navbar navbar-expand-lg dark"
      aria-label="freebootstrap.net navbar"
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* <!-- Start Logo--> */}
        <a className="navbar-brand w-auto" href="index.html">
          {/* <!-- If you use a text logo, uncomment this if it is commented--> */}
          {/* <!-- Vertex-->  */}

          {/* <!-- If you plan to use an image logo, uncomment this if it is commented--> */}

          {/* <!-- logo dark--> */}
          <img
            className="logo dark img-fluid"
            src={DarkLogo}
            alt="FreeBootstrap.net image placeholder"
          />

          {/* <!-- logo light--> */}
          <img
            className="logo light img-fluid"
            src={LightLogo}
            alt="FreeBootstrap.net image placeholder"
          />
        </a>
        {/* <!-- End Logo--> */}

        {/* <!-- Start offcanvas--> */}
        <div
          className="offcanvas offcanvas-start w-75"
          id="fbs__net-navbars"
          tabIndex="-1"
          aria-labelledby="fbs__net-navbarsLabel"
        >
          <div className="offcanvas-header">
            <div className="offcanvas-header-logo">
              {/* <!-- If you use a text logo, uncomment this if it is commented--> */}

              {/* <!-- h5#fbs__net-navbarsLabel.offcanvas-title Vertex--> */}

              {/* <!-- If you plan to use an image logo, uncomment this if it is commented--> */}
              <a
                className="logo-link"
                id="fbs__net-navbarsLabel"
                href="index.html"
              >
                {/* <!-- logo dark--> */}
                <img
                  className="logo dark img-fluid"
                  src={DarkLogo}
                  alt="FreeBootstrap.net image placeholder"
                />

                {/* <!-- logo light--> */}
                <img
                  className="logo light img-fluid"
                  src={LightLogo}
                  alt="FreeBootstrap.net image placeholder"
                />
              </a>
            </div>
            <button
              className="btn-close btn-close-black"
              type="button"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body align-items-lg-center">
            <ul className="navbar-nav nav me-auto ps-lg-5 mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link scroll-link active"
                  aria-current="page"
                  href="#home"
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link scroll-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link scroll-link" href="#pricing">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link scroll-link" href="#how-it-works">
                  How It Works
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link scroll-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown <i className="bi bi-chevron-down"></i>
                </a>

                <ul className="dropdown-menu">
                  <li>
                    <a className="nav-link scroll-link dropdown-item" href="#">
                      Multipages
                    </a>
                  </li>
                  <li>
                    <a
                      className="nav-link scroll-link dropdown-item"
                      href="#services"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      className="nav-link scroll-link dropdown-item"
                      href="#pricing"
                    >
                      Pricing
                    </a>
                  </li>
                  <li className="nav-item dropstart">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropstart <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="nav-link scroll-link dropdown-item"
                          href="#services"
                        >
                          Services
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-link scroll-link dropdown-item"
                          href="#pricing"
                        >
                          Pricing
                        </a>
                      </li>
                      <li className="nav-item dropstart">
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Dropstart <i className="bi bi-chevron-right"></i>
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              className="nav-link scroll-link dropdown-item"
                              href="#services"
                            >
                              Services
                            </a>
                          </li>
                          <li>
                            <a
                              className="nav-link scroll-link dropdown-item"
                              href="#pricing"
                            >
                              Pricing
                            </a>
                          </li>
                          <li>
                            <a
                              className="nav-link scroll-link dropdown-item"
                              href="#"
                            >
                              Something else here
                            </a>
                          </li>
                          <li className="nav-item dropend">
                            <a
                              className="nav-link dropdown-toggle"
                              href="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Dropend <i className="bi bi-chevron-right"></i>
                            </a>
                            <ul className="dropdown-menu">
                              <li>
                                <a
                                  className="nav-link scroll-link dropdown-item"
                                  href="#services"
                                >
                                  Services
                                </a>
                              </li>
                              <li>
                                <a
                                  className="nav-link scroll-link dropdown-item"
                                  href="#pricing"
                                >
                                  Pricing
                                </a>
                              </li>
                              <li>
                                <a
                                  className="nav-link scroll-link dropdown-item"
                                  href="#"
                                >
                                  Something else here
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link scroll-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- End offcanvas--> */}

        <div className="ms-auto w-auto">
          <div className="header-social d-flex align-items-center gap-1">
            <a className="btn btn-primary py-2" href="#">
              Get Started
            </a>

            <button
              className="fbs__net-navbar-toggler justify-content-center align-items-center ms-auto"
              data-bs-toggle="offcanvas"
              data-bs-target="#fbs__net-navbars"
              aria-controls="fbs__net-navbars"
              aria-label="Toggle navigation"
              aria-expanded="false"
            >
              <svg
                className="fbs__net-icon-menu"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="21" x2="3" y1="6" y2="6"></line>
                <line x1="15" x2="3" y1="12" y2="12"></line>
                <line x1="17" x2="3" y1="18" y2="18"></line>
              </svg>
              <svg
                className="fbs__net-icon-close"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
{
  /* End Header  */
}

//  <!-- ======= Hero =======-->
const Hero = function () {
  return (
    <section className="hero__v6 section" id="home">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="row">
              <div className="col-lg-11">
                <span
                  className="hero-subtitle text-uppercase"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  Innovative Fintech Solutions
                </span>
                <h1
                  className="hero-title mb-3"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Secure, Efficient, and User-Friendly Financial Services
                </h1>
                <p
                  className="hero-description mb-4 mb-lg-5"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Experience the future of finance with our secure, efficient,
                  and user-friendly financial services.
                </p>
                <div
                  className="cta d-flex gap-2 mb-4 mb-lg-5"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <a className="btn" href="#">
                    Get Started Now
                  </a>
                  <a className="btn btn-white-outline" href="#">
                    Learn More
                    <svg
                      className="lucide lucide-arrow-up-right"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                  </a>
                </div>
                <div
                  className="logos mb-4"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <span className="logos-title text-uppercase mb-4 d-block">
                    Trusted by major companies worldwide
                  </span>
                  <div className="logos-images d-flex gap-4 align-items-center">
                    <img
                      className="img-fluid js-img-to-inline-svg"
                      src={LogoAirBnbBlack}
                      alt="Company 1"
                      style={{ width: 110 + "px" }}
                    />
                    <img
                      className="img-fluid js-img-to-inline-svg"
                      src={LogoIbmBlack}
                      alt="Company 2"
                      style={{ width: 80 + "px" }}
                    />
                    <img
                      className="img-fluid js-img-to-inline-svg"
                      src={LogoGoogleBlack}
                      alt="Company 3"
                      style={{ width: 110 + "px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-img">
              <img
                className="img-card img-fluid"
                src={CardExpenses}
                alt="Image card"
                data-aos="fade-down"
                data-aos-delay="600"
              />
              <img
                className="img-main img-fluid rounded-4"
                src={HeroImg1Min}
                alt="Hero Image"
                data-aos="fade-in"
                data-aos-delay="500"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <!-- End Hero--> */}
    </section>
  );
};
{
  /* <!-- End Hero--> */
}

// <!-- ======= About =======-->
const About = function () {
  return (
    <section className="about__v4 section" id="about">
      <div className="container">
        <div className="row">
          <div className="col-md-6 order-md-2">
            <div className="row justify-content-end">
              <div className="col-md-11 mb-4 mb-md-0">
                <span
                  className="subtitle text-uppercase mb-3"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  About us
                </span>
                <h2 className="mb-4" data-aos="fade-up" data-aos-delay="100">
                  Experience the future of finance with our secure, efficient,
                  and user-friendly financial services
                </h2>
                <div data-aos="fade-up" data-aos-delay="200">
                  <p>
                    Founded with the vision of revolutionizing the financial
                    industry, we are a leading fintech company dedicated to
                    providing innovative and secure financial solutions.
                  </p>
                  <p>
                    Our cutting-edge platform ensures your transactions are
                    safe, streamlined, and easy to manage, empowering you to
                    take control of your financial journey with confidence and
                    convenience.
                  </p>
                </div>
                <h4
                  className="small fw-bold mt-4 mb-3"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  Key Values and Vision
                </h4>
                <ul
                  className="d-flex flex-row flex-wrap list-unstyled gap-3 features"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <li className="d-flex align-items-center gap-2">
                    <span className="icon rounded-circle text-center">
                      <i className="bi bi-check"></i>
                    </span>
                    <span className="text">Innovation</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <span className="icon rounded-circle text-center">
                      <i className="bi bi-check"></i>
                    </span>
                    <span className="text">Security</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <span className="icon rounded-circle text-center">
                      <i className="bi bi-check"></i>
                    </span>
                    <span className="text">User-Centric Design </span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <span className="icon rounded-circle text-center">
                      <i className="bi bi-check"></i>
                    </span>
                    <span className="text">Transparency</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <span className="icon rounded-circle text-center">
                      <i className="bi bi-check"></i>
                    </span>
                    <span className="text">Empowerment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="img-wrap position-relative">
              <img
                className="img-fluid rounded-4"
                src={About2Min}
                alt="FreeBootstrap.net image placeholder"
                data-aos="fade-up"
                data-aos-delay="0"
              />
              <div
                className="mission-statement p-4 rounded-4 d-flex gap-4"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="mission-icon text-center rounded-circle">
                  <i className="bi bi-lightbulb fs-4"></i>
                </div>
                <div>
                  <h3 className="text-uppercase fw-bold">Mission Statement</h3>
                  <p className="fs-5 mb-0">
                    Our mission is to empower individuals and businesses by
                    delivering secure, efficient, and user-friendly financial
                    services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
{
  /* <!-- End About--> */
}

// <!-- ======= Features =======-->
const Features = function () {
  return (
    <section className="section features__v2" id="features">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="d-lg-flex p-5 rounded-4 content"
              data-aos="fade-in"
              data-aos-delay="0"
            >
              <div className="row">
                <div
                  className="col-lg-5 mb-5 mb-lg-0"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  <div className="row">
                    <div className="col-lg-11">
                      <div className="h-100 flex-column justify-content-between d-flex">
                        <div>
                          <h2 className="mb-4">Why Choose us</h2>
                          <p className="mb-5">
                            Experience the future of finance with our secure,
                            efficient, and user-friendly financial services. Our
                            cutting-edge platform ensures your transactions are
                            safe, streamlined, and easy to manage, empowering
                            you to take control of your financial journey with
                            confidence and convenience."
                          </p>
                        </div>
                        <div className="align-self-start">
                          <a
                            className="glightbox btn btn-play d-inline-flex align-items-center gap-2"
                            href="https://www.youtube.com/watch?v=DQx96G4yHd8"
                            data-gallery="video"
                          >
                            <i className="bi bi-play-fill"></i> Watch the Video
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="row justify-content-end">
                    <div className="col-lg-11">
                      <div className="row">
                        <div
                          className="col-sm-6"
                          data-aos="fade-up"
                          data-aos-delay="0"
                        >
                          <div className="icon text-center mb-4">
                            <i className="bi bi-person-check fs-4"></i>
                          </div>
                          <h3 className="fs-6 fw-bold mb-3">
                            User-Friendly Interface
                          </h3>
                          <p>
                            Easy navigation with responsive design for various
                            devices.
                          </p>
                        </div>
                        <div
                          className="col-sm-6"
                          data-aos="fade-up"
                          data-aos-delay="100"
                        >
                          <div className="icon text-center mb-4">
                            <i className="bi bi-graph-up fs-4"></i>
                          </div>
                          <h3 className="fs-6 fw-bold mb-3">
                            Financial Analytics
                          </h3>
                          <p>
                            Budget tracking, expense categorization, and
                            personalized insights.
                          </p>
                        </div>
                        <div
                          className="col-sm-6"
                          data-aos="fade-up"
                          data-aos-delay="200"
                        >
                          <div className="icon text-center mb-4">
                            <i className="bi bi-headset fs-4"></i>
                          </div>
                          <h3 className="fs-6 fw-bold mb-3">
                            Customer Support
                          </h3>
                          <p>
                            24/7 service via chat, email, phone, and a detailed
                            help center.
                          </p>
                        </div>
                        <div
                          className="col-sm-6"
                          data-aos="fade-up"
                          data-aos-delay="300"
                        >
                          <div className="icon text-center mb-4">
                            <i className="bi bi-shield-lock fs-4"></i>
                          </div>
                          <h3 className="fs-6 fw-bold mb-3">
                            Security Features
                          </h3>
                          <p>
                            Data encryption, fraud detection, and prevention
                            mechanisms.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// <!-- End Features-->

// <!-- ======= Pricing =======-->
const Pricing = function () {
  return (
    <section className="section pricing__v2" id="pricing">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md-5 mx-auto text-center">
            <span
              className="subtitle text-uppercase mb-3"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              Pricing
            </span>
            <h2 className="mb-3" data-aos="fade-up" data-aos-delay="100">
              Plan for every budget
            </h2>
            <p data-aos="fade-up" data-aos-delay="200">
              Experience the future of finance with our secure, efficient, and
              user-friendly financial services
            </p>
          </div>
        </div>
        <div className="row">
          <div
            className="col-md-4 mb-4 mb-md-0"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="p-5 rounded-4 price-table h-100">
              <h3>Personal</h3>
              <p>
                Choose a plan that fits your personal financial needs and start
                managing your finances more effectively.
              </p>
              <div className="price mb-4">
                <strong>$7</strong>
                <span>/ month</span>
              </div>
              <div>
                <a className="btn" href="#">
                  Get Started
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-8" data-aos="fade-up" data-aos-delay="400">
            <div className="p-5 rounded-4 price-table popular h-100">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="mb-3">Business</h3>
                  <p>
                    Optimize your business financial operations with our
                    tailored business plans.
                  </p>
                  <div className="price mb-4">
                    <strong className="me-1">$29</strong>
                    <span>/ month</span>
                  </div>
                  <div>
                    <a className="btn btn-white hover-outline" href="#">
                      Get Started
                    </a>
                  </div>
                </div>
                <div className="col-md-6 pricing-features">
                  <h4 className="text-uppercase fw-bold mb-3">Features</h4>
                  <ul className="list-unstyled d-flex flex-column gap-3">
                    <li className="d-flex gap-2 align-items-start mb-0">
                      <span className="icon rounded-circle position-relative mt-1">
                        <i className="bi bi-check"></i>
                      </span>
                      <span>Personalized financial insights and reports</span>
                    </li>
                    <li className="d-flex gap-2 align-items-start mb-0">
                      <span className="icon rounded-circle position-relative mt-1">
                        <i className="bi bi-check"></i>
                      </span>
                      <span>Priority customer support</span>
                    </li>
                    <li className="d-flex gap-2 align-items-start mb-0">
                      <span className="icon rounded-circle position-relative mt-1">
                        <i className="bi bi-check"></i>
                      </span>
                      <span>Access to exclusive investment opportunities</span>
                    </li>
                    <li className="d-flex gap-2 align-items-start mb-0">
                      <span className="icon rounded-circle position-relative mt-1">
                        <i className="bi bi-check"></i>
                      </span>
                      <span>AI-driven financial recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// <!-- End Pricing-->

//  <!-- ======= How it works =======-->
const HowItWorks = function () {
  return (
    <section className="section howitworks__v1" id="how-it-works">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md-6 text-center mx-auto">
            <span
              className="subtitle text-uppercase mb-3"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              How it works
            </span>
            <h2 data-aos="fade-up" data-aos-delay="100">
              How It Works
            </h2>
            <p data-aos="fade-up" data-aos-delay="200">
              Our platform is designed to make managing your finances simple and
              efficient. Follow these easy steps to get started:{" "}
            </p>
          </div>
        </div>
        <div className="row g-md-5">
          <div className="col-md-6 col-lg-3">
            <div
              className="step-card text-center h-100 d-flex flex-column justify-content-start position-relative"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div data-aos="fade-right" data-aos-delay="500">
                <img
                  className="arch-line"
                  src={ArchLine}
                  alt="FreeBootstrap.net image placeholder"
                />
              </div>
              <span className="step-number rounded-circle text-center fw-bold mb-5 mx-auto">
                1
              </span>
              <div>
                <h3 className="fs-5 mb-4">Sign Up</h3>
                <p>
                  Visit our website or download our app to sign up. Provide
                  basic information to set up your secure account.
                </p>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="step-card reverse text-center h-100 d-flex flex-column justify-content-start position-relative">
              <div data-aos="fade-right" data-aos-delay="1100">
                <img
                  className="arch-line reverse"
                  src={ArchLineReverse}
                  alt="FreeBootstrap.net image placeholder"
                />
              </div>
              <span className="step-number rounded-circle text-center fw-bold mb-5 mx-auto">
                2
              </span>
              <h3 className="fs-5 mb-4">Set Up Your Profile</h3>
              <p>
                Add your personal or business details to tailor the platform to
                your specific needs.
              </p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3"
            data-aos="fade-up"
            data-aos-delay="1200"
          >
            <div className="step-card text-center h-100 d-flex flex-column justify-content-start position-relative">
              <div data-aos="fade-right" data-aos-delay="1700">
                <img
                  className="arch-line"
                  src={ArchLine}
                  alt="FreeBootstrap.net image placeholder"
                />
              </div>
              <span className="step-number rounded-circle text-center fw-bold mb-5 mx-auto">
                3
              </span>
              <h3 className="fs-5 mb-4">Explore Features</h3>
              <p>
                Access your dashboard for a summary of your finances: balances,
                recent transactions, and insights.
              </p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3"
            data-aos="fade-up"
            data-aos-delay="1800"
          >
            <div className="step-card last text-center h-100 d-flex flex-column justify-content-start position-relative">
              <span className="step-number rounded-circle text-center fw-bold mb-5 mx-auto">
                4
              </span>
              <div>
                <h3 className="fs-5 mb-4">Invest and Grow</h3>
                <p>
                  Discover a variety of investment opportunities tailored to
                  your financial goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
{
  /* <!-- End How it works--> */
}

// <!-- ======= Stats =======-->
const Stats = function () {
  return (
    <section className="stats__v3 section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="d-flex flex-wrap content rounded-4"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="rounded-borders">
                <div className="rounded-border-1"></div>
                <div className="rounded-border-2"></div>
                <div className="rounded-border-3"></div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-4 mb-4 mb-md-0 text-center"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="stat-item">
                  <h3 className="fs-1 fw-bold">
                    <span
                      className="purecounter"
                      data-purecounter-start="0"
                      data-purecounter-end="10"
                      data-purecounter-duration="2"
                    >
                      0
                    </span>
                    <span>K+</span>
                  </h3>
                  <p className="mb-0">Customer Satisfaction</p>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-4 mb-4 mb-md-0 text-center"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="stat-item">
                  <h3 className="fs-1 fw-bold">
                    {" "}
                    <span
                      className="purecounter"
                      data-purecounter-start="0"
                      data-purecounter-end="200"
                      data-purecounter-duration="2"
                    >
                      0
                    </span>
                    <span>%+</span>
                  </h3>
                  <p className="mb-0">Revenue Increase</p>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-4 mb-4 mb-md-0 text-center"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="stat-item">
                  <h3 className="fs-1 fw-bold">
                    <span
                      className="purecounter"
                      data-purecounter-start="0"
                      data-purecounter-end="20"
                      data-purecounter-duration="2"
                    >
                      0
                    </span>
                    <span>x</span>
                  </h3>
                  <p className="mb-0">Business Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// <!-- End Stats-->

export default function HomePage() {
  useEffect(() => {
    AOS.init();
    new PureCounter();
  }, []);
  return (
    <div className="site-wrap">
      <Header />
      <main>
        <Hero />
        <About />
        <Features />
        <Pricing />
        <HowItWorks />
        <Stats />
      </main>
    </div>
  );
}
