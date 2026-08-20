import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { FiArrowRight, FiArrowUpRight, FiShoppingBag, FiStar, FiHeart, FiPlus } from "react-icons/fi";

import { getCategories } from "../features/category/categorySlice";
import { getPopularProducts } from "../features/popular/popularSlice";
import { getLatestProducts } from "../features/products/productSlice";
import TrustSection from "../components/home/TrustSection.jsx";
import Skills from "../components/home/Skills";

// ============================================================
// ANIMATION
// ============================================================

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ============================================================
// STATIC CONTENT
// ============================================================

const marqueeItems = [
  "Luxury Essentials",
  "Premium Quality",
  "New Arrivals",
  "Worldwide Shipping",
  "Limited Drops",
  "Modern Silhouettes",
];

const swiperBreakpoints = {
  320: { slidesPerView: 1.4, spaceBetween: 14 },
  640: { slidesPerView: 2.5, spaceBetween: 20 },
  1024: { slidesPerView: 4, spaceBetween: 26 },
};

// ============================================================
// HELPERS
// ============================================================

function getPriceInfo(item) {
  const firstVariant = item?.variants?.[0];
  const firstSize = firstVariant?.sizes?.[0];

  if (firstSize) {
    const price = Number(firstSize.price || 0);
    const offerPrice = Number(firstSize.offerPrice || 0);
    const hasOffer = offerPrice > 0 && price > 0 && offerPrice < price;

    return {
      price: hasOffer ? offerPrice : price,
      oldPrice: hasOffer ? price : null,
    };
  }

  return {
    price: item?.price ?? "—",
    oldPrice: item?.oldPrice ?? null,
  };
}

// ============================================================
// PRODUCT CARD
// ============================================================

function ProductCard({ item, index = 0, badgeLabel, showNewTag = false }) {
  const navigate = useNavigate();
  const { price, oldPrice } = getPriceInfo(item);
  const swatches = item?.variants?.slice(0, 4) ?? [];

  return (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      onClick={() => navigate(`/products/${item._id}`)}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="image-zoom relative aspect-[3/4] overflow-hidden bg-[var(--card)]">
        <img
          src={item?.image}
          alt={item?.name || "Product"}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top labels */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {showNewTag && (
            <span className="px-3 py-1.5 bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em]">
              New
            </span>
          )}
          {badgeLabel && (
            <span className="px-3 py-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em]">
              {badgeLabel}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
        >
          <FiHeart />
        </button>

        {/* Quick view */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-[400ms] group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${item._id}`);
            }}
            className="w-full bg-white text-black py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors hover:bg-black hover:text-white"
          >
            <FiPlus />
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 px-0.5">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
            {item?.category?.name || "Collection"}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
            <FiStar className="fill-current" />
            {item?.rating ?? "4.9"}
          </span>
        </div>

        <h3 className="font-serif text-lg font-medium text-[var(--text)] truncate underline-offset-4 group-hover:underline">
          {item?.name}
        </h3>

        {swatches.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {swatches.map((variant, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-[var(--border)]"
                style={{ backgroundColor: variant?.color?.hex || variant?.color?.name || "#ccc" }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm font-bold text-[var(--text)]">
            EGP {Number(price || 0).toLocaleString()}
          </span>
          {oldPrice && (
            <span className="text-xs text-[var(--muted)] line-through">
              EGP {Number(oldPrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================
// HOME
// ============================================================

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { products, loading: popularLoading } = useSelector((state) => state.popular);
  const { latestProducts, loading: newLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getPopularProducts());
    dispatch(getLatestProducts());
  }, [dispatch]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <main className="w-full min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="px-3 sm:px-5 pt-3">
        <div className="relative min-h-[680px] lg:min-h-[820px] overflow-hidden bg-black">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover scale-[1.04]">
            <source src="/images/10380604-uhd_4096_2160_25fps.mp4" type="video/mp4" />
          </video>

          <div className="hero-overlay absolute inset-0" />

          <div className="absolute inset-0 flex items-end">
            <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 pb-14 sm:pb-20 lg:pb-24">
              <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="max-w-3xl text-white">
                <span className="inline-flex items-center gap-3 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-medium text-white/70 mb-6">
                  <span className="w-8 h-px bg-white" />
                  New Season {new Date().getFullYear()}
                </span>

                <motion.h1
                  custom={1}
                  variants={fadeUp}
                  className="font-serif text-5xl sm:text-7xl lg:text-[8.5rem] font-medium leading-[0.88] tracking-[-0.05em]"
                >
                  Defined
                  <br />
                  <span className="italic font-normal">by Style.</span>
                </motion.h1>

                <motion.p
                  custom={2}
                  variants={fadeUp}
                  className="mt-7 max-w-lg text-sm sm:text-base text-white/65 leading-relaxed"
                >
                  A curated collection of modern essentials designed around simplicity, confidence and timeless form.
                </motion.p>

                <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/products")}
                    className="btn-primary px-7 py-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]"
                  >
                    <FiShoppingBag />
                    Shop Collection
                    <FiArrowRight />
                  </button>

                  <button
                    onClick={() => navigate("/collections")}
                    className="px-7 py-4 border border-white/40 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-black"
                  >
                    Explore
                  </button>
                </motion.div>
              </motion.div>

              <div className="hidden lg:flex absolute bottom-20 right-16 text-white/60 text-[9px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
                Scroll to explore
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MARQUEE
          Pure CSS animation (see .marquee / .marquee-track in index.css)
          — kept off framer-motion here so it never restarts or stutters
          when Home re-renders (e.g. every time a Redux loading flag flips).
      ============================================================ */}
      <section className="border-b border-[var(--border)]">
        <div className="marquee py-5">
          <div className="marquee-track items-center gap-12 text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>
                <span className="text-[var(--text)]">✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TRUST
      ============================================================ */}
      <Skills />

      <h1>Turst</h1>
      <TrustSection />

      {/* ============================================================
          CATEGORIES
      ============================================================ */}
      <section className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">01 — Collections</span>
            <h2 className="font-serif text-4xl sm:text-6xl mt-3">Shop by Line</h2>
          </div>
          <button
            onClick={() => navigate("/collections")}
            className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--text)]"
          >
            All Collections
            <FiArrowUpRight />
          </button>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[var(--card)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {categories?.slice(0, 4).map((item, index) => (
              <motion.div
                key={item?._id || index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                onClick={() => navigate(`/collections/${item._id}`)}
                className="image-zoom group relative aspect-[3/4] overflow-hidden cursor-pointer bg-[var(--card)]"
              >
                <img src={item?.image} alt={item?.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-[0.25em] text-white/60">Collection</span>
                      <h3 className="font-serif text-xl sm:text-3xl mt-1">{item?.name}</h3>
                    </div>
                    <span className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
                      <FiArrowUpRight />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================
          BEST SELLERS
      ============================================================ */}
      <section className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">02 — Most Wanted</span>
            <h2 className="font-serif text-4xl sm:text-6xl mt-3">Best Sellers</h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            Shop All
            <FiArrowUpRight />
          </button>
        </div>

        {popularLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[var(--card)] animate-pulse" />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={swiperBreakpoints}
            className="!pb-8"
          >
            {products?.map((raw, index) => {
              const item = raw?.id || raw;
              return (
                <SwiperSlide key={item?._id || index}>
                  <ProductCard item={item} index={index} badgeLabel="Bestseller" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </section>

      {/* ============================================================
          EDITORIAL
      ============================================================ */}
      <section className="px-3 sm:px-5 pb-24">
        <div className="max-w-[1450px] mx-auto bg-[var(--card)] overflow-hidden grid lg:grid-cols-2">
          <div className="min-h-[450px] lg:min-h-[650px] flex flex-col justify-center p-8 sm:p-14 lg:p-20">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">The Monochrome Edit</span>
            <h2 className="font-serif text-5xl sm:text-7xl leading-[0.95] mt-5">
              Less.
              <br />
              <span className="italic">But Better.</span>
            </h2>
            <p className="max-w-md mt-7 text-sm leading-7 text-[var(--muted)]">
              Clean silhouettes, refined materials and timeless pieces created for everyday confidence.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="btn-primary mt-8 w-fit px-7 py-4 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-3"
            >
              Discover the Edit
              <FiArrowRight />
            </button>
          </div>

          <div className="image-zoom min-h-[450px] lg:min-h-[650px]">
            <img src="/images/hero-fashion.png" alt="Monochrome collection" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ============================================================
          NEW ARRIVALS
      ============================================================ */}
      <section className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 pb-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)]">03 — Fresh Drops</span>
            <h2 className="font-serif text-4xl sm:text-6xl mt-3">Just Landed</h2>
          </div>
          <button
            onClick={() => navigate("/products?sort=new")}
            className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            New Arrivals
            <FiArrowUpRight />
          </button>
        </div>

        {newLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[var(--card)] animate-pulse" />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={swiperBreakpoints}
            className="!pb-8"
          >
            {latestProducts?.map((item, index) => (
              <SwiperSlide key={item?._id || index}>
                <ProductCard item={item} index={index} showNewTag />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* ============================================================
          BRAND STATEMENT
      ============================================================ */}
      <section className="border-y border-[var(--border)] py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--muted)]">Our Philosophy</span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-tight mt-6">
            Style is not about
            <br />
            <span className="italic">more.</span> It is about meaning.
          </h2>
          <p className="max-w-xl mx-auto mt-7 text-sm leading-7 text-[var(--muted)]">
            We believe great style lives in the details: thoughtful design, quality materials and pieces that remain
            relevant long after the season ends.
          </p>
        </div>
      </section>

      {/* ============================================================
          NEWSLETTER
      ============================================================ */}
      <section className="bg-[var(--primary)] text-[var(--bg)] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[9px] uppercase tracking-[0.35em] opacity-60">Stay in the loop</span>
          <h2 className="font-serif text-4xl sm:text-6xl mt-5">Join the list.</h2>
          <p className="max-w-md mx-auto mt-5 text-sm opacity-60 leading-6">
            Be the first to discover new collections, limited drops and exclusive pieces.
          </p>

          <div className="max-w-lg mx-auto mt-8 flex border border-[var(--bg)]/30">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent border-0 px-5 py-4 text-sm text-[var(--bg)] placeholder:text-[var(--bg)]/50 focus:ring-0"
            />
            <button className="shrink-0 px-6 text-[9px] uppercase tracking-[0.2em] font-bold border-l border-[var(--bg)]/30 transition-colors hover:bg-[var(--bg)] hover:text-[var(--primary)]">
              Join
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}