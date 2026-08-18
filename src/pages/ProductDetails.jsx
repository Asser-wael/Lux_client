import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiUser, FiMinus, FiPlus } from "react-icons/fi";

import {
  getProductDetails,
  addReview,
} from "../features/products/productSlice";

import {
  addToCart,
  selectCartActionLoading,
} from "../features/cart/cartSlice";

import Loading from "../components/common/Loading";
import { colorNameToHex } from "../utils/colorMap";

// Animation
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Get cheapest product price
function getMinPrice(item) {
  const sizes = [];

  item?.variants?.forEach((variant) => {
    variant.sizes?.forEach((size) => {
      sizes.push(size);
    });
  });

  if (!sizes.length) {
    return {
      price: "—",
      oldPrice: null,
    };
  }

  let cheapest = sizes[0];

  sizes.forEach((size) => {
    const sizePrice = Number(size.offerPrice || size.price || 0);
    const cheapestPrice = Number(
      cheapest.offerPrice || cheapest.price || 0
    );

    if (sizePrice < cheapestPrice) {
      cheapest = size;
    }
  });

  const price = Number(cheapest.price || 0);
  const offerPrice = Number(cheapest.offerPrice || 0);

  if (offerPrice > 0 && offerPrice < price) {
    return {
      price: offerPrice,
      oldPrice: price,
    };
  }

  return {
    price,
    oldPrice: null,
  };
}

// Show stars
function StarRating({ value = 0, size = "text-base" }) {
  return (
    <div className={`flex items-center gap-0.5 text-primary ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={star <= Math.round(value) ? "fill-current" : ""}
        />
      ))}
    </div>
  );
}

// Select rating
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl text-primary transition-transform hover:scale-110"
        >
          <FiStar
            className={
              star <= (hover || value) ? "fill-current" : ""
            }
          />
        </button>
      ))}
    </div>
  );
}

// Small product card
function MiniProductCard({ item, index }) {
  const navigate = useNavigate();
  const { price, oldPrice } = getMinPrice(item);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      onClick={() => navigate(`/products/${item._id}`)}
      className="card group flex-shrink-0 w-44 sm:w-52 flex flex-col overflow-hidden cursor-pointer"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-bg">
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1 p-3 border-t border-border">
        <span className="text-sm font-semibold text-text truncate">
          {item.name}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text">
            EGP {price}
          </span>

          {oldPrice !== null && (
            <span className="text-xs text-muted line-through">
              EGP {oldPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Product row
function ProductRail({ title, subtitle, items }) {
  if (!items || !items.length) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      className="mx-auto max-w-7xl px-6 pb-16"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-muted mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {items.map((item, index) => (
          <MiniProductCard
            key={item._id}
            item={item}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}

// Reviews
function ReviewsSection({ product, productId }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user);
  const reviewLoading = useSelector(
    (state) => state.products.reviewLoading
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const reviews = product?.reviews || [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      return;
    }

    dispatch(
      addReview({
        productId,
        rating,
        comment,
      })
    ).then((result) => {
      if (!result.error) {
        setRating(0);
        setComment("");
      }
    });
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUp}
      className="mx-auto max-w-7xl px-6 pb-20"
    >
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text">
              Reviews
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <StarRating value={product?.rating || 0} />

              <span className="text-sm text-muted">
                {product?.rating
                  ? product.rating.toFixed(1)
                  : "0.0"}

                {" · "}

                {product?.numReviews || 0}{" "}
                {product?.numReviews === 1
                  ? "review"
                  : "reviews"}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-2xl p-6 mb-8">
          {user ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Your rating
                </label>

                <StarPicker
                  value={rating}
                  onChange={setRating}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Your review
                </label>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share what you thought about this piece…"
                  className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={
                  reviewLoading ||
                  !rating ||
                  !comment.trim()
                }
                className="btn-primary self-start px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted">
                You need to be logged in to write a review.
              </p>

              <Link
                to="/login"
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
                Log In to Review
              </Link>
            </div>
          )}
        </div>

        {!reviews.length ? (
          <p className="text-sm text-muted">
            No reviews yet — be the first to share your thoughts.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {reviews
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt) -
                  new Date(a.createdAt)
              )
              .map((review) => (
                <div
                  key={review._id}
                  className="py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-muted shrink-0">
                      <FiUser />
                    </div>

                    <div>
                      <span className="text-sm font-semibold text-text block">
                        {review.name ||
                          review.user?.name ||
                          "Anonymous"}
                      </span>

                      <span className="text-xs text-muted">
                        {review.createdAt
                          ? new Date(
                            review.createdAt
                          ).toLocaleDateString()
                          : ""}
                      </span>
                    </div>

                    <div className="ml-auto">
                      <StarRating
                        value={review.rating}
                        size="text-sm"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-muted leading-6">
                    {review.comment}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetails, detailsLoading } = useSelector(
    (state) => state.products
  );

  const {
    product: currentProduct,
    relatedProducts,
    differentProducts,
  } = productDetails;

  const cartActionLoading = useSelector(
    selectCartActionLoading
  );

  const [color, setColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Get product
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  // Scroll top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  // Select first variant
  useEffect(() => {
    if (!currentProduct?.variants?.length) {
      setColor(null);
      setSelectedSize(null);
      setQuantity(1);
      return;
    }

    const firstVariant = currentProduct.variants[0];

    const firstSize =
      firstVariant.sizes?.find(
        (size) => Number(size.stock || 0) > 0
      ) || null;

    setColor(firstVariant);
    setSelectedSize(firstSize);
    setQuantity(1);
  }, [currentProduct]);

  // Keep quantity inside stock
  useEffect(() => {
    if (!selectedSize) {
      setQuantity(1);
      return;
    }

    const stock = Number(selectedSize.stock || 0);

    setQuantity((prev) =>
      Math.min(
        Math.max(prev, 1),
        Math.max(stock, 1)
      )
    );
  }, [selectedSize]);

  if (detailsLoading) {
    return <Loading />;
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text">
        Product not found
      </div>
    );
  }

  const stock = Number(selectedSize?.stock || 0);

  const isOutOfStock =
    !selectedSize || stock <= 0;

  const price = Number(selectedSize?.price || 0);
  const offerPrice = Number(
    selectedSize?.offerPrice || 0
  );

  const hasOffer =
    offerPrice > 0 && offerPrice < price;

  const finalPrice = hasOffer
    ? offerPrice
    : price;

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      Math.max(1, prev - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((prev) =>
      Math.min(stock, prev + 1)
    );
  };

  const changeColor = (variant) => {
    setColor(variant);

    const firstSize =
      variant.sizes?.find(
        (size) => Number(size.stock || 0) > 0
      ) || null;

    setSelectedSize(firstSize);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (
      isOutOfStock ||
      !currentProduct._id ||
      !color?.color?.name ||
      !selectedSize?.size
    ) {
      return;
    }

    dispatch(
      addToCart({
        productId: currentProduct._id,
        color: color.color.name,
        size: selectedSize.size,
        quantity,
      })
    );
  };

  return (
    <div className="min-h-screen bg-bg text-text">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="text-sm text-muted">
          Home / Products / {currentProduct.name}
        </div>
      </div>

      {/* Product */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-12 lg:grid-cols-[1.1fr_1fr_0.7fr]">

        {/* Image */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="card p-4"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-bg">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="py-4"
        >
          <span className="inline-block rounded-full border border-border px-4 py-1 text-xs uppercase tracking-widest text-primary">
            {currentProduct.category?.name || "New Arrival"}
          </span>

          <h1 className="mt-5 text-5xl leading-tight">
            {currentProduct.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <StarRating
              value={currentProduct.rating || 0}
            />

            <span className="text-sm text-muted">
              {currentProduct.numReviews
                ? `${Number(
                  currentProduct.rating || 0
                ).toFixed(1)} (${currentProduct.numReviews} reviews)`
                : "No ratings yet"}
            </span>
          </div>

          <p className="mt-6 leading-8 text-muted">
            {currentProduct.description}
          </p>

          {/* Colors */}
          {currentProduct.variants?.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider">
                Color
              </h3>

              <div className="flex flex-wrap gap-3">
                {currentProduct.variants.map((variant) => {
                  const colorName = variant.color?.name;

                  const isSelected =
                    color?.color?.name === colorName;

                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => changeColor(variant)}
                      title={colorName}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${isSelected
                          ? "border-primary scale-110"
                          : "border-border"
                        }`}
                      style={{
                        backgroundColor:
                          colorNameToHex(colorName),
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {color?.sizes?.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider">
                Size
              </h3>

              <div className="flex flex-wrap gap-3">
                {color.sizes.map((size) => {
                  const isSelected =
                    selectedSize?.size === size.size;

                  const outOfStock =
                    Number(size.stock || 0) <= 0;

                  return (
                    <button
                      key={size.size}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={`rounded-xl border px-6 py-3 transition-all uppercase ${isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-border hover:border-primary"
                        } ${outOfStock
                          ? "cursor-not-allowed opacity-40"
                          : ""
                        }`}
                    >
                      {size.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Buy Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="card h-fit p-6"
        >
          <h3 className="mb-5 text-lg font-bold">
            Select Variant
          </h3>

          <div className="rounded-lg border border-border px-4 py-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">
                Size
              </span>

              <span className="font-semibold">
                {selectedSize?.size || "—"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted">
                Price
              </span>

              <div className="flex items-center gap-2">
                {hasOffer && (
                  <span className="text-sm text-muted line-through">
                    EGP {price}
                  </span>
                )}

                <span className="font-semibold text-primary">
                  EGP {finalPrice || "—"}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted">
                Stock
              </span>

              <span
                className={`text-xs font-semibold ${!isOutOfStock
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {!isOutOfStock
                  ? `${stock} In Stock`
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold">
              Quantity
            </label>

            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={
                  isOutOfStock || quantity <= 1
                }
                className="text-lg disabled:opacity-30"
              >
                <FiMinus />
              </button>

              <span className="font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  isOutOfStock || quantity >= stock
                }
                className="text-lg disabled:opacity-30"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              isOutOfStock || cartActionLoading
            }
            className="btn-primary mt-6 w-full rounded-xl px-5 py-4 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cartActionLoading
              ? "Adding..."
              : isOutOfStock
                ? "Out of Stock"
                : "Add To Cart"}
          </button>

          <button
            type="button"
            disabled={isOutOfStock}
            className="mt-3 w-full rounded-xl border border-primary px-5 py-4 font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now
          </button>
        </motion.div>
      </section>

      {/* Product Details */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="mx-auto max-w-7xl px-6 pb-16"
      >
        <div className="card p-8">
          <h2 className="text-3xl">
            Product Details
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-muted">
            {currentProduct.description}
          </p>
        </div>
      </motion.section>

      {/* Related */}
      <ProductRail
        title="You Might Also Like"
        subtitle="More from the same category"
        items={relatedProducts}
      />

      {/* Different */}
      <ProductRail
        title="Explore Something Different"
        subtitle="A different side of the collection"
        items={differentProducts}
      />

      {/* Reviews */}
      <ReviewsSection
        product={currentProduct}
        productId={id}
      />
    </div>
  );
}