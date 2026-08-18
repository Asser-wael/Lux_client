import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaTiktok,
} from "react-icons/fa";
import {
  FiArrowUp,
  FiMapPin,
  FiPhone,
  FiShoppingBag,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useSelector((state) => state.auth || state.user || {});

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[var(--border)] bg-[var(--card)] max-md:pb-40">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -left-40 -top-40
            h-96 w-96
            rounded-full
            bg-[var(--primary)]/5
            blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-40 -right-40
            h-96 w-96
            rounded-full
            bg-[var(--accent)]/5
            blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* =========================================
            TOP SECTION
        ========================================== */}
        <div
          className="
            grid
            gap-10
            border-b
            border-[var(--border)]
            py-14
            sm:py-16
            lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]
            lg:gap-12
          "
        >
          {/* =========================================
              BRAND
          ========================================== */}
          <div className="max-w-sm">
            <Link
              to="/"
              onClick={scrollToTop}
              className="
                logo
                inline-block
                text-4xl
                font-bold
                tracking-wide
                text-[var(--text)]
                transition-colors
                duration-300
                hover:text-[var(--primary)]
              "
            >
              LUXE
            </Link>

            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
              Discover timeless fashion crafted with elegance, quality, and
              attention to every detail.
            </p>

            {/* Social Media */}
            <div className="mt-7 flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  group
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--bg)]
                  text-[var(--muted)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-pink-500
                  hover:bg-pink-500
                  hover:text-white
                "
              >
                <FaInstagram
                  size={19}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201227675757"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="
                  group
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--bg)]
                  text-[var(--muted)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-green-500
                  hover:bg-green-500
                  hover:text-white
                "
              >
                <FaWhatsapp
                  size={19}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  group
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--bg)]
                  text-[var(--muted)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-blue-500
                  hover:bg-blue-500
                  hover:text-white
                "
              >
                <FaFacebookF
                  size={16}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="
                  group
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--bg)]
                  text-[var(--muted)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                  dark:hover:border-white
                "
              >
                <FaTiktok
                  size={16}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>
            </div>
          </div>

          {/* =========================================
              SHOP
          ========================================== */}
          <div>
            <h3 className="logo text-xl font-bold text-[var(--text)]">
              Shop
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  onClick={scrollToTop}
                  className="footer-link flex items-center gap-2"
                >
                  <FiShoppingBag size={15} />
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  onClick={scrollToTop}
                  className="footer-link"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================================
              ACCOUNT
          ========================================== */}
          <div>
            <h3 className="logo text-xl font-bold text-[var(--text)]">
              Account
            </h3>

            <ul className="mt-6 space-y-4">
              {user ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      onClick={scrollToTop}
                      className="footer-link flex items-center gap-2 font-medium text-[var(--text)]"
                    >
                      <FiUser size={15} />
                      {user.name || "My Profile"}
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/orders"
                      onClick={scrollToTop}
                      className="footer-link"
                    >
                      Order History
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/cart"
                      onClick={scrollToTop}
                      className="footer-link"
                    >
                      My Cart
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={scrollToTop}
                      className="footer-link flex items-center gap-2"
                    >
                      <FiUser size={15} />
                      Login
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/register"
                      onClick={scrollToTop}
                      className="footer-link"
                    >
                      Create Account
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/cart"
                      onClick={scrollToTop}
                      className="footer-link"
                    >
                      My Cart
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* =========================================
              CONTACT
          ========================================== */}
          <div>
            <h3 className="logo text-xl font-bold text-[var(--text)]">
              Contact
            </h3>

            <div className="mt-6 space-y-5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/201227675757"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex items-start gap-3
                  text-sm text-[var(--muted)]
                  transition-colors
                  hover:text-[var(--primary)]
                "
              >
                <span
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-lg
                    border border-[var(--border)]
                    bg-[var(--bg)]
                    transition-all duration-300
                    group-hover:border-green-500
                    group-hover:text-green-500
                  "
                >
                  <FaWhatsapp size={17} />
                </span>

                <span className="pt-1" dir="ltr">
                  +20 122 767 5757
                </span>
              </a>

              {/* Phone */}
              <a
                href="tel:+201227675757"
                className="
                  group
                  flex items-start gap-3
                  text-sm text-[var(--muted)]
                  transition-colors
                  hover:text-[var(--primary)]
                "
              >
                <span
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-lg
                    border border-[var(--border)]
                    bg-[var(--bg)]
                    transition-all duration-300
                    group-hover:border-[var(--primary)]
                    group-hover:text-[var(--primary)]
                  "
                >
                  <FiPhone size={16} />
                </span>

                <span className="pt-1" dir="ltr">
                  +20 122 767 5757
                </span>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3 text-sm text-[var(--muted)]">
                <span
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-lg
                    border border-[var(--border)]
                    bg-[var(--bg)]
                  "
                >
                  <FiMapPin size={16} />
                </span>

                <span className="pt-1 leading-6">
                  Cairo, Egypt
                  <br />
                  Worldwide Shipping
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            BOTTOM BAR
        ========================================== */}
        <div
          className="
            flex
            flex-col
            gap-5
            py-6
            text-center
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-left
          "
        >
          {/* Copyright */}
          <p className="text-xs text-[var(--muted)] sm:text-sm">
            © {currentYear} LUXE. All rights reserved.
          </p>

          {/* Small Links */}
          <div className="flex items-center justify-center gap-4 text-xs text-[var(--muted)] sm:text-sm">
            <Link
              to="/products"
              onClick={scrollToTop}
              className="transition-colors hover:text-[var(--primary)]"
            >
              Shop
            </Link>

            <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

            <Link
              to="/cart"
              onClick={scrollToTop}
              className="transition-colors hover:text-[var(--primary)]"
            >
              Cart
            </Link>

            <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

            <Link
              to="/orders"
              onClick={scrollToTop}
              className="transition-colors hover:text-[var(--primary)]"
            >
              Orders
            </Link>
          </div>

          {/* Back To Top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="
              fixed
              bottom-5 right-5
              z-40
              flex h-11 w-11
              items-center justify-center
              rounded-full
              border border-[var(--border)]
              bg-[var(--card)]
              text-[var(--text)]
              shadow-lg
              transition-all duration-300
              hover:-translate-y-1
              hover:border-[var(--primary)]
              hover:text-[var(--primary)]
              sm:bottom-7 sm:right-7
            "
          >
            <FiArrowUp size={18} />
          </button>
        </div>
      </div>

      {/* Footer Link CSS */}
      <style>
        {`
          .footer-link {
            display: inline-flex;
            align-items: center;
            color: var(--muted);
            font-size: 0.875rem;
            transition:
              color 0.25s ease,
              transform 0.25s ease;
          }

          .footer-link:hover {
            color: var(--primary);
            transform: translateX(4px);
          }

          .dark .footer-link:hover {
            color: var(--primary-hover);
          }
        `}
      </style>
    </footer>
  );
}