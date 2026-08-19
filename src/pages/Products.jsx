import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiChevronDown,
  FiStar,
  FiShoppingBag,
  FiInbox,
} from "react-icons/fi";

import { getProducts } from "../features/products/productSlice";
import { getCategories } from "../features/category/categorySlice";
import { colorNameToHex } from "../utils/colorMap.js";

// ==========================================
// MOTION CONFIG (matches Home.jsx language)
// ==========================================
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: Math.min(index, 8) * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 320, damping: 34 } },
  exit: { x: "100%", transition: { duration: 0.25, ease: "easeIn" } },
};

// ==========================================
// HELPERS
// ==========================================
// Cheapest effective price across every size of every variant
// (offerPrice wins over price when it's a real discount).
function getEffectivePrice(size) {
  const hasOffer =
    size.offerPrice !== undefined &&
    size.offerPrice !== null &&
    Number(size.offerPrice) > 0 &&
    Number(size.offerPrice) < Number(size.price);
  return hasOffer ? Number(size.offerPrice) : Number(size.price);
}

function getPriceInfo(item) {
  const allSizes = (item?.variants ?? []).flatMap((v) => v.sizes ?? []);
  if (allSizes.length === 0) return { price: "—", oldPrice: null };

  const cheapest = allSizes.reduce((min, s) =>
    getEffectivePrice(s) < getEffectivePrice(min) ? s : min
  );

  const hasOffer =
    cheapest.offerPrice !== undefined &&
    cheapest.offerPrice !== null &&
    Number(cheapest.offerPrice) > 0 &&
    Number(cheapest.offerPrice) < Number(cheapest.price);

  return {
    price: hasOffer ? cheapest.offerPrice : cheapest.price,
    oldPrice: hasOffer ? cheapest.price : null,
  };
}

function getMinPrice(item) {
  const allSizes = (item?.variants ?? []).flatMap((v) => v.sizes ?? []);
  if (allSizes.length === 0) return 0;
  return Math.min(...allSizes.map(getEffectivePrice));
}

function getInStock(item) {
  return (item?.variants ?? []).some((v) =>
    (v.sizes ?? []).some((s) => Number(s.stock) > 0)
  );
}



// ==========================================
// PRODUCT CARD
// ==========================================
function ProductCard({ item, index }) {
  const navigate = useNavigate();
  const { price, oldPrice } = getPriceInfo(item);
  const swatches = item?.variants?.slice(0, 5) ?? [];
  const inStock = getInStock(item);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      onClick={() => navigate(`/products/${item._id}`)}
      className="card group flex flex-col overflow-hidden cursor-pointer"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--border)]">
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white px-3 py-1.5 border border-white/40 rounded-full">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-transform">
            <FiShoppingBag className="text-sm" />
            View Details
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 border-t border-[var(--border)]">
        <span className="logo text-base font-semibold text-[var(--text)] truncate">
          {item.name}
        </span>

        {swatches.length > 0 && (
          <div className="flex items-center gap-1.5">
            {swatches.map((variant, i) => (
              <span
                key={variant.color?.name ?? i}
                title={variant.color?.name}
                className="w-3.5 h-3.5 rounded-full border border-[var(--border)] shrink-0"
                style={{ backgroundColor: colorNameToHex(variant.color?.name) }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[var(--text)]">
              EGP {price}
            </span>
            {oldPrice && (
              <span className="text-xs text-[var(--muted)] line-through">
                EGP {oldPrice}
              </span>
            )}
          </div>
          {item.rating && (
            <div className="flex items-center gap-1 text-[var(--muted)] text-xs">
              <FiStar className="text-[var(--primary)] fill-current" />
              {item.rating}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SKELETON CARD
// ==========================================
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)]">
      <div className="aspect-[4/5] bg-[var(--border)] animate-pulse" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3.5 w-3/4 bg-[var(--border)] rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-[var(--border)] rounded animate-pulse" />
      </div>
    </div>
  );
}

// ==========================================
// FILTER PANEL (shared between sidebar + mobile drawer)
// ==========================================
function FilterPanel({
  categories,
  selectedCategory,
  setSelectedCategory,
  colorOptions,
  selectedColors,
  toggleColor,
  sizeOptions,
  selectedSizes,
  toggleSize,
  priceBounds,
  priceRange,
  setPriceRange,
  onClear,
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${!selectedCategory
                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                : "text-[var(--text)] hover:bg-[var(--border)]/50"
              }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${selectedCategory === cat._id
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                  : "text-[var(--text)] hover:bg-[var(--border)]/50"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
          Price
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={priceBounds.min}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="w-full text-sm px-3 py-2 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          />
          <span className="text-[var(--muted)] text-sm">—</span>
          <input
            type="number"
            min={priceRange[0]}
            max={priceBounds.max}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full text-sm px-3 py-2 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-full mt-3 accent-[var(--primary)]"
        />
      </div>

      {/* Color */}
      {colorOptions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
            Color
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {colorOptions.map((name) => {
              const active = selectedColors.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleColor(name)}
                  title={name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${active
                      ? "border-[var(--primary)] scale-110"
                      : "border-[var(--border)]"
                    }`}
                  style={{ backgroundColor: colorNameToHex(name) }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      {sizeOptions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`min-w-10 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${active
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]"
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={onClear}
        className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)] text-left transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function Products() {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const priceBounds = useMemo(() => {
    if (!products?.length) return { min: 0, max: 10000 };
    const mins = products.map(getMinPrice);
    return {
      min: Math.floor(Math.min(...mins) / 50) * 50,
      max: Math.ceil(Math.max(...mins) / 50) * 50 || 10000,
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState([0, 10000]);
  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max]);
  }, [priceBounds.min, priceBounds.max]);

  const colorOptions = useMemo(() => {
    const set = new Set();
    products?.forEach((p) =>
      p.variants?.forEach((v) => v.color?.name && set.add(v.color.name))
    );
    return Array.from(set);
  }, [products]);

  const sizeOptions = useMemo(() => {
    const set = new Set();
    products?.forEach((p) =>
      p.variants?.forEach((v) => v.sizes?.forEach((s) => s.size && set.add(s.size)))
    );
    return Array.from(set).sort();
  }, [products]);

  const fuse = useMemo(
    () =>
      new Fuse(products ?? [], {
        keys: ["name", "description"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [products]
  );

  const filtered = useMemo(() => {
    let list = search.trim()
      ? fuse.search(search.trim()).map((r) => r.item)
      : products ?? [];

    if (selectedCategory) {
      list = list.filter(
        (p) => (p.category?._id ?? p.category) === selectedCategory
      );
    }

    if (selectedColors.length > 0) {
      list = list.filter((p) =>
        p.variants?.some((v) => selectedColors.includes(v.color?.name))
      );
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        p.variants?.some((v) =>
          v.sizes?.some((s) => selectedSizes.includes(s.size))
        )
      );
    }

    list = list.filter((p) => {
      const min = getMinPrice(p);
      return min >= priceRange[0] && min <= priceRange[1];
    });

    const sorted = [...list];
    if (sortBy === "price-asc") sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    if (sortBy === "price-desc") sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    if (sortBy === "newest")
      sorted.sort(
        (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)
      );

    return sorted;
  }, [products, search, selectedCategory, selectedColors, selectedSizes, priceRange, sortBy, fuse]);

  const toggleColor = (name) =>
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const toggleSize = (size) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSearch("");
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + selectedColors.length + selectedSizes.length;

  const sortLabels = {
    newest: "Newest",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* ===== HEADER ===== */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="mb-8"
      >
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--primary)]">
          Shop / All Products
        </span>
        <h1 className="logo text-4xl sm:text-5xl font-bold text-[var(--text)] mt-1">
          The Collection
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          {loading ? "Loading pieces…" : `${filtered.length} pieces available`}
        </p>
      </motion.div>

      {/* ===== TOOLBAR ===== */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the collection…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:border-[var(--primary)] transition-colors"
          >
            {sortLabels[sortBy]}
            <FiChevronDown
              className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] overflow-hidden z-30"
              >
                {Object.entries(sortLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--border)]/50 transition-colors ${sortBy === key
                        ? "text-[var(--primary)] font-semibold"
                        : "text-[var(--text)]"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter toggle (mobile + desktop) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:border-[var(--primary)] transition-colors lg:hidden"
        >
          <FiSliders />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </motion.div>

      <div className="flex gap-10">
        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterPanel
              categories={categories ?? []}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              colorOptions={colorOptions}
              selectedColors={selectedColors}
              toggleColor={toggleColor}
              sizeOptions={sizeOptions}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              priceBounds={priceBounds}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onClear={clearFilters}
            />
          </div>
        </aside>

        {/* ===== GRID ===== */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
              <FiInbox className="text-4xl text-[var(--muted)]" />
              <h3 className="logo text-xl font-semibold text-[var(--text)]">
                No pieces match your filters
              </h3>
              <p className="text-sm text-[var(--muted)] max-w-xs">
                Try widening your price range or clearing a filter.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary px-6 py-2.5 rounded-2xl text-sm font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((item, index) => (
                <ProductCard key={item._id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== MOBILE FILTER DRAWER ===== */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[var(--card)] z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="logo text-xl font-semibold text-[var(--text)]">
                  Filters
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)]"
                >
                  <FiX />
                </button>
              </div>
              <FilterPanel
                categories={categories ?? []}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                colorOptions={colorOptions}
                selectedColors={selectedColors}
                toggleColor={toggleColor}
                sizeOptions={sizeOptions}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                priceBounds={priceBounds}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onClear={clearFilters}
              />
              <button
                onClick={() => setDrawerOpen(false)}
                className="btn-primary w-full mt-8 py-3 rounded-2xl text-sm font-semibold"
              >
                Show {filtered.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}