import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUpload,
  FiShoppingBag,
  FiCheckCircle,
  FiLoader,
  FiArrowRight,
} from "react-icons/fi";
import {
  clearCart,
  getCart,
  selectCartItems,
  selectCartLoading,
} from "../features/cart/cartSlice";
import { checkoutOrder } from "../features/order/orderSlice";

// Gets the correct price for a variant (offer price if present, otherwise regular price)
const getItemPrice = (item) => {
  const variant = item.product?.variants?.find(
    (v) => v.color?.name === item.color
  );
  const sizeInfo = variant?.sizes?.find((s) => s.size === item.size);
  return sizeInfo?.offerPrice ?? sizeInfo?.price ?? item.price ?? 0;
};

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);
  const checkoutLoading = useSelector((state) => state.orders.checkoutLoading);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    paymentMethod: "cash",
    senderName: "",
    senderPhone: "",
    transactionId: "",
  });
  const [transferImage, setTransferImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + getItemPrice(item) * item.quantity,
        0
      ),
    [cartItems]
  );

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTransferImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems.length || checkoutLoading) return;

    const fd = new FormData();
    fd.append("fullName", form.fullName);
    fd.append("phone", form.phone);
    fd.append("city", form.city);
    fd.append("address", form.address);
    fd.append("paymentMethod", form.paymentMethod);
    fd.append("totalPrice", total);

    // Send cart items as JSON in FormData
    fd.append(
      "items",
      JSON.stringify(
        cartItems.map((item) => ({
          product: item.product?._id || item.product,
          name: item.product?.name,
          color: item.color,
          size: item.size,
          price: getItemPrice(item),
          quantity: item.quantity,
          image: item.product?.image,
        }))
      )
    );

    if (form.paymentMethod === "wallet") {
      fd.append("senderName", form.senderName);
      fd.append("senderPhone", form.senderPhone);
      fd.append("transactionId", form.transactionId);
      if (transferImage) fd.append("image", transferImage);
    }

    const res = await dispatch(checkoutOrder(fd));
    if (checkoutOrder.fulfilled.match(res)) {
      setSubmitted(true);
      dispatch(clearCart())
      setTimeout(() => navigate("/orders"), 600);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-border bg-card px-4 py-3 pl-11 text-sm text-text placeholder:text-muted focus:outline-none";

  if (submitted) {
    return (
      <div
        dir="ltr"
        className="flex min-h-screen items-center justify-center bg-bg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex flex-col items-center gap-4 px-10 py-14 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
            className="text-6xl text-primary"
          >
            <FiCheckCircle />
          </motion.div>
          <h2 className="text-3xl text-text">Order Placed Successfully!</h2>
          <p className="text-muted">Redirecting to your orders page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="min-h-screen bg-bg px-4 py-10 md:px-10 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <span className="text-sm uppercase tracking-[0.2em] text-primary">
          Checkout
        </span>
        <h1 className="text-4xl text-text md:text-5xl">Complete Your Order</h1>
        <p className="mt-2 text-muted">
          Review your cart and enter shipping and payment details
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Shipping Information */}
          <div className="card p-6 md:p-8">
            <div className="mb-6 flex items-center gap-2">
              <FiMapPin className="text-primary" />
              <h3 className="text-2xl text-text">Shipping Address</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                icon={<FiUser />}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={inputBase}
                required
              />
              <Field
                icon={<FiPhone />}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className={inputBase}
                required
              />
              <Field
                icon={<FiHome />}
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City / Region"
                className={inputBase}
                required
              />
              <Field
                icon={<FiMapPin />}
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Detailed Address"
                className={inputBase}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6 md:p-8">
            <div className="mb-6 flex items-center gap-2">
              <FiCreditCard className="text-primary" />
              <h3 className="text-2xl text-text">Payment Method</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PaymentOption
                active={form.paymentMethod === "cash"}
                icon={<FiDollarSign />}
                title="Cash on Delivery"
                onClick={() =>
                  setForm((f) => ({ ...f, paymentMethod: "cash" }))
                }
              />
              <PaymentOption
                active={form.paymentMethod === "wallet"}
                icon={<FiCreditCard />}
                title="E-Wallet"
                onClick={() =>
                  setForm((f) => ({ ...f, paymentMethod: "wallet" }))
                }
              />
            </div>

            <AnimatePresence initial={false}>
              {form.paymentMethod === "wallet" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 md:grid-cols-2">
                    <Field
                      icon={<FiUser />}
                      name="senderName"
                      value={form.senderName}
                      onChange={handleChange}
                      placeholder="Sender Name"
                      className={inputBase}
                      required={form.paymentMethod === "wallet"}
                    />
                    <Field
                      icon={<FiPhone />}
                      name="senderPhone"
                      value={form.senderPhone}
                      onChange={handleChange}
                      placeholder="Sender Phone Number"
                      className={inputBase}
                      required={form.paymentMethod === "wallet"}
                    />
                    <Field
                      icon={<FiCreditCard />}
                      name="transactionId"
                      value={form.transactionId}
                      onChange={handleChange}
                      placeholder="Transaction ID"
                      className={inputBase + " md:col-span-2"}
                      required={form.paymentMethod === "wallet"}
                    />

                    <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center transition hover:border-primary md:col-span-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage}
                        required={form.paymentMethod === "wallet"}
                      />
                      {preview ? (
                        <img
                          src={preview}
                          alt="Transfer Receipt"
                          className="h-32 rounded-lg object-cover"
                        />
                      ) : (
                        <>
                          <FiUpload className="text-2xl text-primary" />
                          <span className="text-sm text-muted">
                            Upload transfer receipt image
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={checkoutLoading || !cartItems.length}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center justify-center gap-2 rounded-xl py-4 text-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkoutLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              >
                <FiLoader />
              </motion.span>
            ) : (
              <FiArrowRight />
            )}
            {checkoutLoading ? "Processing Order..." : "Place Order"}
          </motion.button>
        </motion.form>

        {/* Order Summary */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card sticky top-6 h-fit p-6 md:p-8"
        >
          <div className="mb-6 flex items-center gap-2">
            <FiShoppingBag className="text-primary" />
            <h3 className="text-2xl text-text">Order Summary</h3>
          </div>

          {cartLoading ? (
            <p className="text-muted">Loading cart items...</p>
          ) : !cartItems.length ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted">
              <FiShoppingBag className="text-4xl" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cartItems.map((item, i) => (
                <motion.div
                  key={`${item.product?._id || item.product}-${item.color}-${item.size}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-text">{item.product?.name}</p>
                    <p className="text-xs text-muted">
                      {item.color} · {item.size} · × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm text-primary">
                    EGP {getItemPrice(item) * item.quantity}
                  </span>
                </motion.div>
              ))}

              <div className="mt-2 flex items-center justify-between border-t border-border pt-4 text-lg text-text">
                <span>Total</span>
                <span className="text-primary">EGP {total}</span>
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

function Field({ icon, className, ...props }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        {icon}
      </span>
      <input {...props} className={className} />
    </div>
  );
}

function PaymentOption({ active, icon, title, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-5 text-sm transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted hover:border-primary/50"
      }`}
    >
      <span className="text-xl">{icon}</span>
      {title}
    </motion.button>
  );
}