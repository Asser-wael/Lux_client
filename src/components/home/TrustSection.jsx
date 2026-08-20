import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { getTrustItems } from "../../features/trust/trustSlice";

// ============================================================
// ANIMATION
// ============================================================

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ============================================================
// TRUST ITEM
// ============================================================

function TrustItem({ item, index }) {
  const [img, setImg] = useState(null);

  return (
    <>
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="
          group flex flex-col items-center gap-4
          text-center px-4
          sm:flex-row sm:text-left sm:gap-5
        "
      >
        <button
          type="button"
          onClick={() => setImg(item?.image)}
          className="
            flex h-14 w-14 shrink-0 items-center justify-center
            rounded-full border border-[var(--border)]
            bg-[var(--bg)] overflow-hidden
            transition-colors duration-300
            group-hover:border-[var(--primary)]
            cursor-zoom-in
          "
        >
          <img
            src={item?.image}
            alt={item?.title || "Trust badge"}
            className="h-7 w-7 object-contain"
          />
        </button>

        <div>
          <h3 className="font-serif text-sm sm:text-base font-medium text-[var(--text)] leading-snug">
            {item?.title}
          </h3>
        </div>
      </motion.div>

      {/* Image Preview */}
      {img && (
        <div
          onClick={() => setImg(null)}
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-black/80 backdrop-blur-sm
            p-4 cursor-zoom-out
          "
        >
          <img
            src={img}
            alt={item?.title || "Trust badge"}
            onClick={(e) => e.stopPropagation()}
            className="
              max-h-[90vh]
              max-w-[90vw]
              object-contain
              rounded-2xl
              shadow-2xl
            "
          />

          <button
            type="button"
            onClick={() => setImg(null)}
            className="
              absolute top-5 right-5
              flex h-10 w-10 items-center justify-center
              rounded-full
              bg-white/10 text-white
              text-2xl
              hover:bg-white/20
              transition
            "
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

// ============================================================
// SKELETON
// ============================================================

function TrustSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-y-10 gap-x-4 lg:grid-cols-4 lg:gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5 px-4"
        >
          <div className="h-14 w-14 shrink-0 rounded-full bg-[var(--card)] animate-pulse" />
          <div className="h-3 w-24 rounded-full bg-[var(--card)] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TRUST SECTION
// ============================================================

export default function TrustSection() {
  const dispatch = useDispatch();

  const { trustItems, loading } = useSelector((state) => state.trust);

  useEffect(() => {
    dispatch(getTrustItems());
  }, [dispatch]);

  if (!loading && (!trustItems || trustItems.length === 0)) {
    return null;
  }

  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg)]">

      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-14">
        {loading ? (
          <TrustSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-y-10 gap-x-4 lg:grid-cols-4 lg:gap-8">
            {trustItems.map((item, index) => (
              <TrustItem key={item?._id || index} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}