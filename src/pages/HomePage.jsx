import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import ArchLineReverse from "../assets/images/arch-line-reverse.svg";
import PersonSq2Min from "../assets/images/person-sq-2-min.jpg";
import PersonSq1Min from "../assets/images/person-sq-1-min.jpg";
import PersonSq5Min from "../assets/images/person-sq-5-min.jpg";
import PersonSq3Min from "../assets/images/person-sq-3-min.jpg";
import PersonSq7Min from "../assets/images/person-sq-7-min.jpg";
import PersonSq8Min from "../assets/images/person-sq-8-min.jpg";

// Styles

import "../assets/vendors/bootstrap/bootstrap.min.css";
import "../assets/vendors/bootstrap-icons/font/bootstrap-icons.min.css";
import "../assets/vendors/glightbox/glightbox.min.css";
import "../assets/vendors/swiper/swiper-bundle.min.css";
import "../assets/vendors/aos/aos.css";
import "../assets/css/style.css";

// End styles
// Javascript and libraries

import "../assets/vendors/bootstrap/bs-darkmode";
import "../assets/vendors/bootstrap/bootstrap.bundle.min";
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
import logo from "../assets/img/xpay-logo.png";
import Pricing from "../components/PricingSection";
import { useAuth } from "../context/AuthContext";
// HEADER
const Header = function () {
  const { user } = useAuth();
  return (
    <header
      className="fbs__net-navbar navbar navbar-expand-lg dark"
      aria-label="freebootstrap.net navbar"
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* <!-- Start Logo--> */}
        <a className="navbar-brand w-auto" href="index.html">
          <img
            className="logo  img-fluid w-[100px]"
            src={logo}
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
                <Link className="nav-link scroll-link" to="/docs">
                  How It Works
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link scroll-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link scroll-link" href="/login">
                  Login Now
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- End offcanvas--> */}

        <div className="ms-auto w-auto">
          <div className="header-social d-flex align-items-center gap-1">
            <Link
              className="btn btn-primary py-2"
              to={user ? "/dashboard" : "/login"}
            >
              {user ? "Dashboard" : "Get Started"}
            </Link>

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
                  Welcome to X-Pay
                </span>
                <h1
                  className="hero-title mb-3"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Turn Attention into Earnings with X-Pay Tokens
                </h1>
                <p
                  className="hero-description mb-4 mb-lg-5"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Your gateway to daily passive income. Purchase X-Pay Tokens,
                  watch engaging videos, earn daily rewards, and even advertise
                  your own content.
                  <p className="pt-6">
                    ✓ Trusted by thousands ✓ Transparent & Secure ✓ Multiple
                    earning opportunities
                  </p>
                </p>
                <div
                  className="cta d-flex gap-2 mb-4 mb-lg-5"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Link className="btn" to={"/login"}>
                    Get Started Now
                  </Link>
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
              {/* <img
                className="img-card img-fluid"
                src={CardExpenses}
                alt="Image card"
                data-aos="fade-down"
                data-aos-delay="600"
              /> */}
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
                  The Future of Investment Meets Entertainment
                </h2>
                <div data-aos="fade-up" data-aos-delay="200">
                  <p>
                    X-Pay is an innovative fintech-investment platform designed
                    to make earning money simple, accessible, and fun.
                  </p>
                  <p>
                    With X-Pay, your attention becomes valuable. By purchasing
                    X-Pay Tokens, you turn your capital into an
                    income-generating asset simply by watching videos every day.
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
                    <span className="text">Digital Investment</span>
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
                    To empower users financially by converting their time and
                    attention into real value, while offering creators and
                    advertisers a powerful platform to grow.
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
                          <h3 className="fs-6 fw-bold mb-3">Daily Earnings</h3>
                          <p>
                            Watch videos every day and earn a fixed percentage
                            of your capital.
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
                          <h3 className="fs-6 fw-bold mb-3">Easy Start</h3>
                          <p>
                            Just purchase X-Pay Tokens and begin earning
                            instantly.
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
                            Advertise Your Business
                          </h3>
                          <p>
                            Reach a wide audience with targeted, affordable
                            video ads.
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
                          <h3 className="fs-6 fw-bold mb-3">Secure Platform</h3>
                          <p>
                            Backed by strong encryption, anti-fraud systems, and
                            transparent transactions.
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
                <h3 className="fs-5 mb-4">Purchase X-Pay Tokens </h3>
                <p>Buy tokens using USDT.</p>
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
              <h3 className="fs-5 mb-4">Watch Daily Videos </h3>
              <p>Log in and watch 1 short videos daily.</p>
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
              <h3 className="fs-5 mb-4">Earn Daily Returns - </h3>
              <p>Earn a percentage of your capital each day.</p>
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
                <h3 className="fs-5 mb-4">Advertise or Upload </h3>
                <p>Submit content for review and start promoting or earning.</p>
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

// <!-- ======= Services =======-->
const Services = function () {
  return (
    <section className="section services__v3" id="services">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md-8 mx-auto text-center">
            <span
              className="subtitle text-uppercase mb-3"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              Our Services
            </span>
            <h2 className="mb-3" data-aos="fade-up" data-aos-delay="100">
              Empowering Financial Innovation Through Cutting-Edge Services
            </h2>
          </div>
        </div>
        <div className="row g-4">
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <div className="service-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between gap-5">
              <div>
                <span className="icon mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0"
                    y="0"
                    viewBox="0 0 64 64"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M50.327 4H25.168a6.007 6.007 0 0 0-6 6v5.11h-8.375a3.154 3.154 0 0 0-3.12 3.18v5.47a1 1 0 0 0 .724.961 3.204 3.204 0 0 1 0 6.097 1 1 0 0 0-.724.962v5.49a3.154 3.154 0 0 0 3.12 3.18H34.5c-2.147 8.057 9.408 12.135 12.77 4.441a1 1 0 0 0-1.841-.779 4.778 4.778 0 1 1-4.403-6.636c1.039-.159 2.453 1.082 3.063-.225.449-1.37-1.383-1.598-2.336-1.734V31.8a1 1 0 0 0-.72-.96 3.21 3.21 0 0 1 0-6.11 1 1 0 0 0 .72-.96v-5.48a3.154 3.154 0 0 0-3.12-3.18H21.168V10a4.004 4.004 0 0 1 4-4h3.21l1.24 3.066a3.982 3.982 0 0 0 3.708 2.503h8.826a3.984 3.984 0 0 0 3.71-2.503L47.1 6h3.228a4.004 4.004 0 0 1 4 4v1.6a1 1 0 0 0 2 0V10a6.007 6.007 0 0 0-6-6ZM38.633 17.11a1.153 1.153 0 0 1 1.12 1.18v4.792a5.234 5.234 0 0 0 0 9.405V35.6a6.789 6.789 0 0 0-4.333 2.85H10.793a1.153 1.153 0 0 1-1.12-1.18v-4.8a5.232 5.232 0 0 0 0-9.401V18.29a1.153 1.153 0 0 1 1.12-1.18Zm5.375-8.793a1.994 1.994 0 0 1-1.856 1.252h-8.826a1.991 1.991 0 0 1-1.854-1.252l-.934-2.312H44.94Z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M55.327 14.6a1 1 0 0 0-1 1V54a4.004 4.004 0 0 1-4 4H25.168a4.004 4.004 0 0 1-4-4V43.45a1 1 0 0 0-2 0V54a6.007 6.007 0 0 0 6 6h25.16a6.007 6.007 0 0 0 6-6V15.6a1 1 0 0 0-1-1Z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M41.185 54.52a1 1 0 0 0 0-2h-6.891a1 1 0 0 0 0 2ZM24.713 28.383a.853.853 0 1 1-.835 1.028.998.998 0 0 0-1.184-.775c-1.765.61-.18 2.94 1.017 3.265-.271 1.919 2.27 1.926 2-.003a2.852 2.852 0 0 0-.998-5.515.851.851 0 1 1 .821-1.084 1 1 0 0 0 1.926-.54 2.857 2.857 0 0 0-1.749-1.893v-.518a1 1 0 0 0-2 0v.521a2.852 2.852 0 0 0 1.002 5.514Z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M24.713 36.43a9.092 9.092 0 0 0 9.082-9.082c-.499-12.047-17.666-12.045-18.163 0a9.092 9.092 0 0 0 9.08 9.082Zm0-16.163a7.09 7.09 0 0 1 7.082 7.081c-.371 9.388-13.793 9.387-14.163 0a7.09 7.09 0 0 1 7.08-7.081ZM46.413 37.53l-4.757 4.757-1.68-1.68a1 1 0 0 0-1.413 1.415l2.386 2.386a1 1 0 0 0 1.414 0l5.464-5.464a1 1 0 0 0-1.414-1.414Z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </span>
                <h3 className="fs-5 mb-3">Digital Payments</h3>
                <p className="mb-4">
                  Seamless and secure transactions through various digital
                  platforms, enabling quick and convenient payments for
                  businesses and consumers alike.
                </p>
              </div>
              <a
                className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                href="#"
              >
                <span className="icons">
                  <i className="icon-1 bi bi-arrow-right-short"></i>
                  <i className="icon-2 bi bi-arrow-right-short"> </i>
                </span>
                <span>Read more</span>
              </a>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="service-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between gap-5">
              <div>
                <span className="icon mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0"
                    y="0"
                    viewBox="0 0 64 64"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="m57.936 58.647-4.47-11.871a9.542 9.542 0 0 0-5.914-5.693l-7.659-2.609-1.944-2.116v-2.62a13.043 13.043 0 0 0 4.739-5.175 14.256 14.256 0 0 0 3.237.14 2.909 2.909 0 0 0 2.905-2.906v-5.382a2.895 2.895 0 0 0-1.495-2.523 13.84 13.84 0 0 0-2.807-7.777 1 1 0 0 0-1.597 1.205 11.879 11.879 0 0 1 2.386 6.19c-.012-.01-2.017.036-1.987-.023-4.064-11.113-18.668-11.126-22.702.024h-1.875c.73-9.938 13.556-14.987 21.539-8.81a1 1 0 0 0 1.196-1.605c-9.394-7.24-24.311-1.02-24.754 10.758a2.895 2.895 0 0 0-1.566 2.561v5.382a2.909 2.909 0 0 0 2.905 2.906c.4-.042 2.932.115 3.213-.122a12.843 12.843 0 0 0 4.542 5.038v2.757l-1.825 2.184-7.553 2.521a9.547 9.547 0 0 0-5.917 5.695l-4.47 11.871a1.008 1.008 0 0 0 .935 1.352H49.97a1 1 0 0 0 0-2H36.123l-2.985-7.876 2.014-2.491 2.009 1.746a1.007 1.007 0 0 0 1.643-.594l1.322-8.118 6.785 2.312a7.549 7.549 0 0 1 4.682 4.504L55.555 58H53.97a1 1 0 0 0 0 2H57a1.007 1.007 0 0 0 .936-1.353zm-13.77-39.136h1.759a.906.906 0 0 1 .905.904v5.382a.906.906 0 0 1-.905.906h-1.759zm-24.334 7.192h-1.759a.906.906 0 0 1-.905-.906v-5.382a.906.906 0 0 1 .905-.904h1.76s.038 5.959 0 7.192zm12.146-15.6a10.16 10.16 0 0 1 9.15 6.288L38.85 18.43a4.677 4.677 0 0 1-4.986-.747 6.633 6.633 0 0 0-7.78-.736l-3.91 2.325c1.2-4.704 5.135-8.169 9.803-8.169zM21.832 23.168V21.8l5.273-3.133a4.632 4.632 0 0 1 5.433.51 6.72 6.72 0 0 0 7.15 1.07l2.098-.957a12.113 12.113 0 0 1 .38 2.98c-.464 14.245-18.826 15.065-20.334.9zM35.95 34.706v1.718l-3.968 5.464-4.153-5.473v-1.78a11.242 11.242 0 0 0 8.12.071zm-9.164 3.643 3.852 5.075-3.771 3.28-1.206-7.008zM8.444 58l3.96-10.516a7.551 7.551 0 0 1 4.681-4.505l6.724-2.245 1.387 8.06a1.007 1.007 0 0 0 1.641.585l2.01-1.746 2.013 2.491L27.875 58zm25.54 0h-3.97L32 52.763zm-1.985-9.65-1.642-2.03 1.642-1.428 1.642 1.427zm5.12-1.658-3.772-3.28 3.693-5.085 1.224 1.332z"
                        fill="currentColor"
                        opacity="1"
                        data-original="currentColor"
                      ></path>
                    </g>
                  </svg>
                </span>
                <h3 className="fs-5 mb-3">Personal Finance Management</h3>
                <p className="mb-4">
                  Seamless and secure transactions through various digital
                  platforms, enabling quick and convenient payments for
                  businesses and consumers alike.
                </p>
              </div>
              <a
                className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                href="#"
              >
                <span className="icons">
                  <i className="icon-1 bi bi-arrow-right-short"></i>
                  <i className="icon-2 bi bi-arrow-right-short"> </i>
                </span>
                <span>Read more</span>
              </a>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="service-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between gap-5">
              <div>
                <span className="icon mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0"
                    y="0"
                    viewBox="0 0 64 64"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M35.719 21.413a1 1 0 0 0-1.586 1.218 15.554 15.554 0 0 1 1.806 3.012h-6.1a19.93 19.93 0 0 0-3.417-8.42 15.637 15.637 0 0 1 5.012 2.652 1 1 0 0 0 1.245-1.565 17.676 17.676 0 1 0-11.002 31.51c14.511.067 22.936-16.94 14.042-28.407zm.966 6.23a15.507 15.507 0 0 1 .001 8.994h-6.533a35.942 35.942 0 0 0-.001-8.995zM29.84 38.635h6.102a15.688 15.688 0 0 1-9.534 8.447 19.91 19.91 0 0 0 3.432-8.447zm-1.402-6.491a34.461 34.461 0 0 1-.292 4.492h-12.94a34.731 34.731 0 0 1 .001-8.995h12.938a34.461 34.461 0 0 1 .293 4.503zm-6.812-15.67c2.533-.006 5.021 3.488 6.193 9.168H15.535c1.138-5.63 3.672-9.12 6.092-9.168zm-4.683.734a19.903 19.903 0 0 0-3.429 8.434H7.417a15.707 15.707 0 0 1 9.527-8.434zM6 32.149a15.682 15.682 0 0 1 .671-4.507h6.53a35.936 35.936 0 0 0 0 8.995H6.67A15.558 15.558 0 0 1 6 32.15zm1.413 6.487h6.1a19.912 19.912 0 0 0 3.43 8.446 15.69 15.69 0 0 1-9.53-8.446zm8.118 0h12.29c-2.589 12.171-9.703 12.166-12.29 0zM16.844 8.31H38.91a8.42 8.42 0 0 1 8.4 8.106l-2.018-2.018a1 1 0 0 0-1.414 1.414l3.74 3.74a1 1 0 0 0 1.414 0l3.74-3.74a1 1 0 0 0-1.413-1.414l-2.048 2.047A10.421 10.421 0 0 0 38.911 6.31H16.844a1 1 0 0 0 0 2zM50.105 44.448a1 1 0 0 0-1.413 0l-3.74 3.74a1 1 0 1 0 1.413 1.414l2.018-2.018a8.419 8.419 0 0 1-8.4 8.107H17.916a1 1 0 0 0 0 2h22.067a10.42 10.42 0 0 0 10.401-10.136l2.048 2.047a1 1 0 0 0 1.413-1.414zM58.589 27.13a1 1 0 0 0-1.694 1.062 7.174 7.174 0 1 1-2.549-2.453 1 1 0 1 0 .992-1.736 9.2 9.2 0 1 0-4.545 17.195c7.082.128 11.668-8.14 7.796-14.068z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M49.754 34.379a1.001 1.001 0 0 0-1.238-.682c-1.769.767.123 2.972 1.275 3.302a1 1 0 1 0 2-.024 3.075 3.075 0 0 0-1-5.975 1.078 1.078 0 1 1 1.053-1.306 1 1 0 0 0 1.187.77c1.894-.7-.034-3.134-1.24-3.463a1 1 0 1 0-2 .024 3.075 3.075 0 0 0 1 5.975 1.079 1.079 0 1 1-1.037 1.379z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </span>
                <h3 className="fs-5 mb-3">Online Lending</h3>
                <p className="mb-4">
                  Fast and accessible lending services that provide personal and
                  business loans through online platforms, simplifying the
                  borrowing process.
                </p>
              </div>
              <a
                className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                href="#"
              >
                <span className="icons">
                  <i className="icon-1 bi bi-arrow-right-short"></i>
                  <i className="icon-2 bi bi-arrow-right-short"> </i>
                </span>
                <span>Read more</span>
              </a>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="service-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between gap-5">
              <div>
                <span className="icon mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0"
                    y="0"
                    viewBox="0 0 64 64"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M59 47.487h-1.81v-27.61a5.223 5.223 0 0 0-5-5.409h-3.71a1 1 0 0 0 0 2h3.71a3.228 3.228 0 0 1 3 3.41v27.609H26.03a1.013 1.013 0 0 0-.996 1.02 34.358 34.358 0 0 0 1.49 3.57 2 2 0 0 0 1.828 1.188h7.296a2 2 0 0 0 1.828-1.188l1.149-2.589L58 49.487v2.74a2.823 2.823 0 0 1-2.82 2.82H8.82A2.823 2.823 0 0 1 6 52.227v-2.74h16.03a1 1 0 0 0 0-2H8.81v-27.61a3.228 3.228 0 0 1 3-3.41h6.89c-3.535 9.154 3.658 19.594 13.63 19.48 11.076.08 18.127-12.336 12.587-21.706a14.54 14.54 0 0 0-25.162-.073 1.646 1.646 0 0 1-.163.299H11.81a5.223 5.223 0 0 0-5 5.41v27.61H5a1 1 0 0 0-1 1v3.74a4.825 4.825 0 0 0 4.82 4.82h46.36a4.825 4.825 0 0 0 4.82-4.82v-3.74a1 1 0 0 0-1-1zm-23.352 3.778h-7.296l-.788-1.775h8.872zm-4.332-17.37a12.517 12.517 0 0 1-9.29-5.372l2.072-1.196a10.137 10.137 0 0 0 7.218 4.188zm2 .001v-2.38a10.12 10.12 0 0 0 7.224-4.178l2.073 1.197a12.5 12.5 0 0 1-9.297 5.361zm11.521-12.471A12.435 12.435 0 0 1 43.61 26.8l-2.064-1.192a10.127 10.127 0 0 0 .008-8.344l2.064-1.192a12.412 12.412 0 0 1 1.22 5.353zM33.33 8.967a12.503 12.503 0 0 1 9.295 5.37l-2.073 1.196a10.124 10.124 0 0 0-7.222-4.187zm7.129 12.458a8.144 8.144 0 0 1-8.13 8.14c-10.794-.446-10.804-15.824 0-16.27a8.138 8.138 0 0 1 8.13 8.13zM31.329 8.966v2.38a10.138 10.138 0 0 0-7.226 4.177l-2.073-1.196a12.518 12.518 0 0 1 9.3-5.36zm-10.295 7.095 2.064 1.192a10.022 10.022 0 0 0-.003 8.343l-2.064 1.192a12.473 12.473 0 0 1 .003-10.727z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M32.322 22.446a1.276 1.276 0 1 1-1.225 1.632 1 1 0 0 0-1.921.556 3.29 3.29 0 0 0 2.146 2.202v.352a1 1 0 0 0 2 0v-.363a3.272 3.272 0 0 0-1-6.38A1.276 1.276 0 1 1 33.57 18.9a1 1 0 0 0 1.956-.418 3.287 3.287 0 0 0-2.204-2.423c.082-.687-.226-1.374-1-1.385-.78.016-1.08.697-1 1.392a3.272 3.272 0 0 0 1 6.38z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </span>
                <h3 className="fs-5 mb-3">Investment Platforms</h3>
                <p className="mb-4">
                  User-friendly platforms that allow individuals to invest in
                  stocks, bonds, and other assets with minimal barriers, making
                  investment accessible to all.
                </p>
              </div>
              <a
                className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                href="#"
              >
                <span className="icons">
                  <i className="icon-1 bi bi-arrow-right-short"></i>
                  <i className="icon-2 bi bi-arrow-right-short"> </i>
                </span>
                <span>Read more</span>
              </a>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="service-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between gap-5">
              <div>
                <span className="icon mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0"
                    y="0"
                    viewBox="0 0 64 64"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M38.972 31.507a7.01 7.01 0 0 0-4.32-12.487H23.604a3.001 3.001 0 0 0-2.998 2.998v19.988a3.001 3.001 0 0 0 2.998 2.998h12.8c7.723-.104 9.639-10.635 2.568-13.497zm-16.367-9.49a1 1 0 0 1 1-.999h11.047a4.997 4.997 0 1 1 0 9.994H22.605zm13.798 20.988H23.604a1 1 0 0 1-.999-1v-8.994h13.798a4.997 4.997 0 0 1 0 9.994z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M51.798 12.238a27.71 27.71 0 0 0-3.132-2.708 1 1 0 0 0-1.186 1.609 25.317 25.317 0 0 1 2.162 1.82l-2.117 2.117A22.896 22.896 0 0 0 33.002 9.05V6.057a25.425 25.425 0 0 1 11.2 3.02 1 1 0 0 0 .946-1.761C26.702-2.634 3.907 11.036 4.02 32.012c-.31 15.036 12.945 28.294 27.983 27.983 24.827-.03 37.332-30.174 19.795-47.757zm-.734 2.126a25.768 25.768 0 0 1 6.899 16.648h-3A22.896 22.896 0 0 0 48.94 16.49zm-38.123 0 2.118 2.117A22.815 22.815 0 0 0 9.05 31.012H6.043a25.768 25.768 0 0 1 6.898-16.648zM6.043 33.01h2.999a22.896 22.896 0 0 0 6.025 14.524L12.94 49.66A25.768 25.768 0 0 1 6.043 33.01zm24.96 24.96a25.768 25.768 0 0 1-16.648-6.898l2.125-2.125a22.896 22.896 0 0 0 14.523 6.025zm-19.988-25.96a20.892 20.892 0 0 1 11.64-18.784 1 1 0 0 0-.892-1.788 23.283 23.283 0 0 0-5.294 3.626l-2.114-2.114a25.768 25.768 0 0 1 16.648-6.9v3.01a22.7 22.7 0 0 0-5.356.865 1 1 0 0 0 .558 1.918c13.1-3.976 26.996 6.454 26.785 20.168-1.15 27.836-40.823 27.84-41.975 0zm21.987 25.96v-2.998a22.896 22.896 0 0 0 14.523-6.025l2.125 2.125a25.768 25.768 0 0 1-16.648 6.899zm18.062-8.311-2.125-2.125a22.896 22.896 0 0 0 6.024-14.524h3a25.768 25.768 0 0 1-6.9 16.649z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </span>
                <h3 className="fs-5 mb-3">Cryptocurrency Trading</h3>
                <p className="mb-4">
                  Services that facilitate the buying, selling, and trading of
                  cryptocurrencies, offering users a gateway to the digital
                  currency market.
                </p>
              </div>
              <a
                className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                href="#"
              >
                <span className="icons">
                  <i className="icon-1 bi bi-arrow-right-short"></i>
                  <i className="icon-2 bi bi-arrow-right-short"> </i>
                </span>
                <span>Read more</span>
              </a>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="service-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between gap-5">
              <div>
                <span className="icon mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0"
                    y="0"
                    viewBox="0 0 64 64"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M49.5 4H24.34a6.007 6.007 0 0 0-6 6v5.29a1 1 0 0 0 2 0V10a4.005 4.005 0 0 1 4-4h3.218l1.237 3.066a3.984 3.984 0 0 0 3.71 2.503h8.826a3.984 3.984 0 0 0 3.71-2.503L46.277 6H49.5a4.004 4.004 0 0 1 4 4v44a4.004 4.004 0 0 1-4 4H24.34a4.005 4.005 0 0 1-4-4V39.42h11.8a6.774 6.774 0 0 0 12.998 2.159 1 1 0 0 0-1.842-.78 4.778 4.778 0 1 1-2.638-6.3 1 1 0 0 0 1.298-.56c.446-1.634-1.965-1.701-3.062-1.776a6.785 6.785 0 0 0-6.6 5.257H13.502a3.003 3.003 0 0 1-3-3v-7.932h27.4v2.672a1 1 0 0 0 2 0v-5.87a5.006 5.006 0 0 0-5-5H13.5a5.006 5.006 0 0 0-5 5c.007 1.424-.005 9.521 0 11.13a5.006 5.006 0 0 0 5 5h4.84V54a6.007 6.007 0 0 0 6 6H49.5a6.007 6.007 0 0 0 6-6V10a6.007 6.007 0 0 0-6-6zm-6.314 4.317a1.994 1.994 0 0 1-1.855 1.252h-8.827a1.992 1.992 0 0 1-1.854-1.252l-.934-2.312H44.12zM10.501 23.29a3.003 3.003 0 0 1 3-3h21.4a3.003 3.003 0 0 1 3 3v1.198H10.5z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M33.472 52.52a1 1 0 0 0 0 2h6.89a1 1 0 0 0 0-2zM37.844 37.294a1 1 0 0 0-1.414 1.415l2.387 2.387a1 1 0 0 0 1.414 0l5.464-5.465a1 1 0 0 0-1.414-1.414l-4.757 4.757zM13.29 33.143a1 1 0 0 0 0 2h2.45a1 1 0 0 0 0-2z"
                        fill="currentColor"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </span>
                <h3 className="fs-5 mb-3">Insurtech Solutions</h3>
                <p className="mb-4">
                  Innovative insurance services that leverage technology to
                  offer personalized policies, faster claims processing, and
                  enhanced customer experiences.
                </p>
              </div>
              <a
                className="special-link d-inline-flex gap-2 align-items-center text-decoration-none"
                href="#"
              >
                <span className="icons">
                  <i className="icon-1 bi bi-arrow-right-short"></i>
                  <i className="icon-2 bi bi-arrow-right-short"> </i>
                </span>
                <span>Read more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// <!-- Services-->

//  <!-- ======= Testimonials =======-->
const Testimonials = function () {
  return (
    <section className="section testimonials__v2" id="testimonials">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-5 mx-auto text-center">
            <span
              className="subtitle text-uppercase mb-3"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              Testimonials
            </span>
            <h2 className="mb-3" data-aos="fade-up" data-aos-delay="100">
              What Our Users Are Saying
            </h2>
            <p data-aos="fade-up" data-aos-delay="200">
              Real Stories of Success and Satisfaction from Our Diverse
              Community
            </p>
          </div>
        </div>
        <div className="row g-4" data-masonry='{"percentPosition": true }'>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <div className="testimonial rounded-4 p-4">
              <blockquote className="mb-3">
                &ldquo;X-Pay gave me daily earnings just by watching videos.
                It’s now my side income!&rdquo;
              </blockquote>
              <div className="testimonial-author d-flex gap-3 align-items-center">
                <div className="author-img">
                  <img
                    className="rounded-circle img-fluid"
                    src={PersonSq2Min}
                    alt="FreeBootstrap.net image placeholder"
                  />
                </div>
                <div className="lh-base">
                  <strong className="d-block">John Davis</strong>
                  <span>College Student</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="testimonial rounded-4 p-4">
              <blockquote className="mb-3">
                &ldquo; I advertised my boutique on X-Pay and saw immediate
                customer responses. &rdquo;
              </blockquote>
              <div className="testimonial-author d-flex gap-3 align-items-center">
                <div className="author-img">
                  <img
                    className="rounded-circle img-fluid"
                    src={PersonSq1Min}
                    alt="FreeBootstrap.net image placeholder"
                  />
                </div>
                <div className="lh-base">
                  <strong className="d-block">Emily Smith</strong>
                  <span>Entrepreneur</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="testimonial rounded-4 p-4">
              <blockquote className="mb-3">
                &ldquo;As a content creator, uploading on X-Pay gave me a fresh
                revenue stream. &rdquo;
              </blockquote>
              <div className="testimonial-author d-flex gap-3 align-items-center">
                <div className="author-img">
                  <img
                    className="rounded-circle img-fluid"
                    src={PersonSq5Min}
                    alt="FreeBootstrap.net image placeholder"
                  />
                </div>
                <div className="lh-base">
                  <strong className="d-block">Michael Rodriguez</strong>
                  <span>Investor</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="testimonial rounded-4 p-4">
              <blockquote className="mb-3">
                &ldquo; I never thought an investment could be this simple! The
                user-friendly interface and secure transaction process give me
                the confidence to handle my transactions independently. &rdquo;
              </blockquote>
              <div className="testimonial-author d-flex gap-3 align-items-center">
                <div className="author-img">
                  <img
                    className="rounded-circle img-fluid"
                    src={PersonSq3Min}
                    alt="FreeBootstrap.net image placeholder"
                  />
                </div>
                <div className="lh-base">
                  <strong className="d-block">Sarah Lee</strong>
                  <span>Real Estate Manager </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="testimonial rounded-4 p-4">
              <blockquote className="mb-3">
                &ldquo; The security features are outstanding. Knowing that my
                financial data is protected gives me peace of mind, and the
                platform's efficiency makes it a pleasure to use. &rdquo;
              </blockquote>
              <div className="testimonial-author d-flex gap-3 align-items-center">
                <div className="author-img">
                  <img
                    className="rounded-circle img-fluid"
                    src={PersonSq7Min}
                    alt="FreeBootstrap.net image placeholder"
                  />
                </div>
                <div className="lh-base">
                  <strong className="d-block">James Kim</strong>
                  <span>IT Consultant</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="testimonial rounded-4 p-4">
              <blockquote className="mb-3">
                &ldquo; The platform’s intuitive design and robust features have
                been a game-changer for my startup. It’s helped me streamline
                operations and focus on growing my business. &rdquo;
              </blockquote>
              <div className="testimonial-author d-flex gap-3 align-items-center">
                <div className="author-img">
                  <img
                    className="rounded-circle img-fluid"
                    src={PersonSq8Min}
                    alt="FreeBootstrap.net image placeholder"
                  />
                </div>
                <div className="lh-base">
                  <strong className="d-block">Laura Brown</strong>
                  <span>Entrepreneur</span>
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
  /* <!-- Testimonials--> */
}

// <!-- ======= Footer =======-->
const Footer = function () {
  return (
    <footer className="footer pt-5 pb-5">
      <div className="container">
        <div className="row justify-content-between mb-5 g-xl-5">
          <div className="col-md-4 mb-5 mb-lg-0">
            <h3 className="mb-3">About</h3>
            <p className="mb-4">
              The Future of Investment Meets Entertainment X-Pay is an
              innovative fintech-investment platform designed to make earning
              money simple, accessible, and fun. With X-Pay, your attention
              becomes valuable.
            </p>
          </div>
          <div className="col-md-7">
            <div className="row g-2">
              <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                <h3 className="mb-3">Company</h3>
                <ul className="list-unstyled">
                  <li>
                    <a href="page-about.html">Leadership</a>
                  </li>
                  <li>
                    <a href="page-careers.html">
                      Careers <span className="badge ms-1">we're hiring</span>
                    </a>
                  </li>
                  <li>
                    <a href="page-case-studies.html">Case Studies</a>
                  </li>
                  <li>
                    <a href="page-terms-conditions.html">
                      Terms &amp; Conditions
                    </a>
                  </li>
                  <li>
                    <a href="page-privacy-policy.html">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="page-404.html">404 page</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                <h3 className="mb-3">Accounts</h3>
                <ul className="list-unstyled">
                  <li>
                    <a href="page-signup.html">Register</a>
                  </li>
                  <li>
                    <a href="page-signin.html">Sign in</a>
                  </li>
                  <li>
                    <a href="page-forgot-password.html">Fogot Password</a>
                  </li>
                  <li>
                    <a href="page-coming-soon.html">Coming soon</a>
                  </li>
                  <li>
                    <a href="page-portfolio-masonry.html">Portfolio Masonry</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row credits pt-3">
          <div className="col-xl-8 text-center text-xl-start mb-3 mb-xl-0">
            &copy;
            <script>document.write(new Date().getFullYear());</script> X-Pay.
            All rights reserved <i className="bi bi-heart-fill text-danger"></i>{" "}
            by X-Pay
          </div>
        </div>
      </div>
    </footer>
  );
};
{
  /* <!-- End Footer--> */
}

// <!-- ======= Back to Top =======-->
const ButtonToTop = function () {
  return (
    <button id="back-to-top">
      <i className="bi bi-arrow-up-short"></i>
    </button>
  );
};
// <!-- End Back to top-->

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
        {/* X-PAY Introduction Section */}
        <section className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-4">
            Introducing X-PAY: A Secure Investment Platform Championed by
            Professional Traders
          </h1>
          <p className="text-lg text-gray-700 text-center mb-6">
            X-PAY is a revolutionary investment platform designed to provide a
            secure and transparent environment for investors to grow their
            wealth. Founded by a team of experienced professional traders with
            expertise in futures, stocks, and forex, X-PAY aims to tackle the
            chaos of scams in the investment industry.
          </p>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Our Mission
          </h2>
          <p className="text-gray-700 mb-6">
            X-PAY is committed to providing a reliable and trustworthy platform
            for investors to achieve their financial goals. We strive to create
            a community of informed and empowered investors who can make
            data-driven decisions with confidence.
          </p>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Key Features:
          </h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>
              Expert-led trading insights: Gain access to exclusive trading
              insights and analysis from our team of professional traders.
            </li>
            <li>
              Robust security measures: Our platform employs state-of-the-art
              security protocols to protect your investments and personal data.
            </li>
            <li>
              Video and banner advertising: Increase your visibility and reach a
              wider audience with our innovative video and banner advertising
              solutions.
            </li>
          </ul>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Advertise with X-PAY:
          </h2>
          <p className="text-gray-700 mb-4">
            Reach a targeted audience of investors and traders by advertising on
            our platform. Our video and banner ads offer a unique opportunity to
            increase brand awareness, drive website traffic, and generate leads.
          </p>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Benefits of Advertising on X-PAY:
          </h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>
              Targeted audience: Reach a highly engaged audience of investors
              and traders who are interested in financial services and
              investment opportunities.
            </li>
            <li>
              Increased brand visibility: Elevate your brand's profile and
              increase awareness among our community of investors.
            </li>
            <li>
              Measurable results: Track the performance of your ads and measure
              the effectiveness of your marketing campaigns.
            </li>
          </ul>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Join the X-PAY Community Today
          </h2>
          <p className="text-gray-700 mb-6">
            Be part of a secure and transparent investment ecosystem that
            prioritizes your financial well-being. Sign up for X-PAY today and
            experience the future of investing.
          </p>
        </section>
        <About />
        <Features />
        <Pricing />
        <HowItWorks />
        <Stats />
        <Services />
        <Footer />
      </main>
      <ButtonToTop />
    </div>
  );
}
