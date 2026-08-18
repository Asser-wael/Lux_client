import React, { useEffect, useState } from "react";
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from "react-redux";
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiXCircle,
  FiClock,
  FiExternalLink,
  FiDollarSign,
  FiShoppingBag,
  FiCreditCard,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getOrders,
  changeOrderStatus,
} from "../../features/order/orderSlice";

export default function OrdersAdmin() {
  const dispatch = useReduxDispatch();

  const { orders, loading, actionLoading } = useReduxSelector(
    (state) => state.orders
  );

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  // =========================
  // Handle status update
  // =========================
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);

    const result = await dispatch(
      changeOrderStatus({
        id: orderId,
        status: newStatus,
      })
    );

    if (changeOrderStatus.fulfilled.match(result)) {
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }
    }

    setUpdatingOrderId(null);
  };

  // =========================
  // Quick stats
  // =========================
  const totalSpent =
    orders?.reduce(
      (acc, curr) => acc + (curr.totalPrice || 0),
      0
    ) || 0;

  const totalOrders = orders?.length || 0;

  const pendingOrders =
    orders?.filter((o) => o.status === "pending").length || 0;

  // =========================
  // Filter
  // =========================
  const filteredOrders = (orders || []).filter((order) => {
    const orderCode = order._id
      ? order._id.slice(-6).toUpperCase()
      : "";

    const customerName =
      order.shippingAddress?.fullName?.toLowerCase() || "";

    const phone = order.shippingAddress?.phone || "";

    const query = searchQuery.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" ||
      order.status === selectedStatus;

    const matchesSearch =
      orderCode.includes(searchQuery.toUpperCase()) ||
      customerName.includes(query) ||
      phone.includes(query);

    return matchesStatus && matchesSearch;
  });

  // =========================
  // Status config
  // =========================
  const statusConfig = {
    pending: {
      label: "Pending",
      bg: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
      icon: FiClock,
    },

    confirmed: {
      label: "Confirmed",
      bg: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
      icon: FiCheckCircle,
    },

    shipped: {
      label: "Shipped",
      bg: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
      icon: FiTruck,
    },

    delivered: {
      label: "Delivered",
      bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
      icon: FiPackage,
    },

    cancelled: {
      label: "Cancelled",
      bg: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
      icon: FiXCircle,
    },
  };

  const getStatusBadge = (status) => {
    const current =
      statusConfig[status] || statusConfig.pending;

    const Icon = current.icon;

    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          px-2.5
          sm:px-3
          py-1
          rounded-full
          text-[10px]
          sm:text-xs
          font-semibold
          border
          whitespace-nowrap
          ${current.bg}
        `}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />

        {current.label}
      </span>
    );
  };

  return (
    <div
      className="
        min-h-screen
        bg-[var(--bg)]
        sm:-translate-x-8
        sm:px-4
        md:px-6
        lg:px-8
        py-4
        sm:py-6
        md:py-8
        text-[var(--text)]
        transition-colors
        duration-300
        overflow-x-hidden
          max-sm:-translate-x-10
         max-sm:px-10

      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          space-y-5
          sm:space-y-6
          lg:space-y-8
        "
      >
        {/* =========================
            Header
        ========================= */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            justify-between
            items-start
            sm:items-center
            gap-4
            border-b
            border-[var(--border)]
            pb-4
            sm:pb-6
          "
        >
          <div className="min-w-0">
            <h1
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-serif
                font-bold
                tracking-tight
                text-[var(--text)]
              "
            >
              Orders Management
            </h1>

            <p
              className="
                text-xs
                sm:text-sm
                text-[var(--muted)]
                mt-1
              "
            >
              Review, track, and update store order statuses
            </p>
          </div>

          <button
            onClick={() => dispatch(getOrders())}
            disabled={loading}
            className="
              w-full
              sm:w-auto
              inline-flex
              justify-center
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-xs
              font-semibold
              border
              border-[var(--border)]
              bg-[var(--card)]
              hover:bg-[var(--border)]/30
              transition
              shadow-sm
              disabled:opacity-50
              shrink-0
            "
          >
            <FiRefreshCw
              className={`
                w-4
                h-4
                ${loading ? "animate-spin" : ""}
              `}
            />

            Refresh Orders
          </button>
        </div>

        {/* =========================
            Quick Stats
        ========================= */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-3
            sm:gap-5
          "
        >
          {/* Revenue */}
          <div
            className="
              card
              p-4
              sm:p-6
              flex
              items-center
              gap-4
              sm:gap-5
              min-w-0
            "
          >
            <div
              className="
                p-3
                sm:p-3.5
                bg-[var(--primary)]/10
                text-[var(--primary)]
                rounded-2xl
                shrink-0
              "
            >
              <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  sm:text-xs
                  font-medium
                  text-[var(--muted)]
                  uppercase
                  tracking-wider
                "
              >
                Total Revenue
              </p>

              <h3
                className="
                  text-xl
                  sm:text-2xl
                  text-[var(--text)]
                  mt-1
                  truncate
                "
              >
                {totalSpent.toLocaleString()}{" "}
                <span
                  className="
                    text-xs
                    sm:text-sm
                    font-sans
                    font-normal
                    text-[var(--muted)]
                  "
                >
                  EGP
                </span>
              </h3>
            </div>
          </div>

          {/* Orders */}
          <div
            className="
              card
              p-4
              sm:p-6
              flex
              items-center
              gap-4
              sm:gap-5
              min-w-0
            "
          >
            <div
              className="
                p-3
                sm:p-3.5
                bg-[var(--accent)]/10
                text-[var(--accent)]
                rounded-2xl
                shrink-0
              "
            >
              <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  sm:text-xs
                  font-medium
                  text-[var(--muted)]
                  uppercase
                  tracking-wider
                "
              >
                Total Orders
              </p>

              <h3
                className="
                  text-xl
                  sm:text-2xl
                  text-[var(--text)]
                  mt-1
                "
              >
                {totalOrders}{" "}
                <span
                  className="
                    text-xs
                    sm:text-sm
                    font-sans
                    font-normal
                    text-[var(--muted)]
                  "
                >
                  orders
                </span>
              </h3>
            </div>
          </div>

          {/* Pending */}
          <div
            className="
              card
              p-4
              sm:p-6
              flex
              items-center
              gap-4
              sm:gap-5
              min-w-0
              sm:col-span-2
              lg:col-span-1
            "
          >
            <div
              className="
                p-3
                sm:p-3.5
                bg-amber-500/10
                text-amber-600
                dark:text-amber-400
                rounded-2xl
                shrink-0
              "
            >
              <FiClock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  sm:text-xs
                  font-medium
                  text-[var(--muted)]
                  uppercase
                  tracking-wider
                "
              >
                Pending Actions
              </p>

              <h3
                className="
                  text-xl
                  sm:text-2xl
                  font-serif
                  font-bold
                  text-[var(--text)]
                  mt-1
                "
              >
                {pendingOrders}{" "}
                <span
                  className="
                    text-xs
                    sm:text-sm
                    font-sans
                    font-normal
                    text-[var(--muted)]
                  "
                >
                  orders
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* =========================
            Filter & Search
        ========================= */}
        <div
          className="
            glass
            p-3
            sm:p-5
            space-y-4
            overflow-hidden
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-4
              justify-between
              items-stretch
              lg:items-center
            "
          >
            {/* Search */}
            <div
              className="
                relative
                w-full
                lg:w-96
                shrink-0
              "
            >
              <FiSearch
                className="
                  w-4
                  h-4
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[var(--muted)]
                "
              />

              <input
                type="text"
                placeholder="Search by code, customer name, phone..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="
                  w-full
                  pl-11
                  pr-4
                  py-2.5
                  rounded-xl
                  text-sm
                  transition
                  outline-none
                  min-w-0
                "
              />
            </div>

            {/* Status Tabs */}
            <div
              className="
                flex
                items-center
                gap-1.5
                overflow-x-auto
                w-full
                lg:w-auto
                pb-1
                lg:pb-0
                scrollbar-none
                min-w-0
              "
            >
              {[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "confirmed", label: "Confirmed" },
                { id: "shipped", label: "Shipped" },
                { id: "delivered", label: "Delivered" },
                { id: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setSelectedStatus(tab.id)
                  }
                  className={`
                    px-3
                    sm:px-4
                    py-2
                    rounded-xl
                    text-[10px]
                    sm:text-xs
                    font-medium
                    whitespace-nowrap
                    transition
                    shrink-0
                    ${selectedStatus === tab.id
                      ? "btn-primary shadow-md"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/40"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================
            Orders Table
        ========================= */}
        {/* =========================
    Orders Table / Mobile Cards
========================= */}

        <div className="card overflow-hidden">

          {/* =========================
      Desktop / Tablet Table
  ========================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className="
          bg-[var(--border)]/20
          border-b border-[var(--border)]
          text-[var(--muted)]
          font-medium
          text-xs
          uppercase
          tracking-wider
        "
              >
                <tr>
                  <th className="p-4 pl-6">Order Code</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Update Status</th>
                  <th className="p-4 pr-6 text-center">Actions</th>
                </tr>
              </thead>

              <tbody
                className="
          divide-y
          divide-[var(--border)]
          text-[var(--text)]
        "
              >
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="
                p-12
                text-center
                text-[var(--muted)]
                font-medium
              "
                    >
                      <FiRefreshCw
                        className="
                  w-6 h-6
                  animate-spin
                  mx-auto
                  mb-2
                  text-[var(--primary)]
                "
                      />

                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const orderCode = `#${order._id
                      .slice(-6)
                      .toUpperCase()}`;

                    const isUpdating =
                      updatingOrderId === order._id;

                    return (
                      <tr
                        key={order._id}
                        className="
                  hover:bg-[var(--border)]/20
                  transition-colors
                "
                      >
                        {/* Order Code */}
                        <td
                          className="
                    p-4
                    pl-6
                    font-semibold
                    font-serif
                    text-base
                  "
                        >
                          {orderCode}
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <div className="font-medium">
                            {order.shippingAddress?.fullName ||
                              "Guest Customer"}
                          </div>

                          <div className="text-xs text-[var(--muted)]">
                            {order.shippingAddress?.phone}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="p-4 text-[var(--muted)]">
                          {order.items?.length || 0} item(s)
                        </td>

                        {/* Payment */}
                        <td className="p-4">
                          <span
                            className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      font-medium
                      bg-[var(--border)]/40
                      px-2.5
                      py-1
                      rounded-lg
                      border
                      border-[var(--border)]
                      whitespace-nowrap
                    "
                          >
                            {order.paymentMethod === "wallet" ? (
                              <FiCreditCard
                                className="
                          w-3.5 h-3.5
                          text-[var(--primary)]
                        "
                              />
                            ) : (
                              <FiDollarSign
                                className="
                          w-3.5 h-3.5
                          text-emerald-600
                        "
                              />
                            )}

                            {order.paymentMethod === "wallet"
                              ? "E-Wallet"
                              : "COD"}
                          </span>
                        </td>

                        {/* Total */}
                        <td
                          className="
                    p-4
                    font-bold
                    whitespace-nowrap
                  "
                        >
                          {order.totalPrice?.toLocaleString()} EGP
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          {getStatusBadge(order.status)}
                        </td>

                        {/* Update */}
                        <td className="p-4">
                          <select
                            disabled={isUpdating || actionLoading}
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value
                              )
                            }
                            className="
                      text-xs
                      font-medium
                      py-1.5
                      px-2.5
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--card)]
                      text-[var(--text)]
                      focus:ring-2
                      focus:ring-[var(--primary)]/30
                      cursor-pointer
                      disabled:opacity-50
                    "
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 text-center">
                          <button
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="
                      p-2.5
                      text-[var(--muted)]
                      hover:text-[var(--primary)]
                      hover:bg-[var(--border)]/40
                      rounded-xl
                      transition
                    "
                            title="View order details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="
                p-12
                text-center
                text-[var(--muted)]
              "
                    >
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* =========================
      Mobile Orders
  ========================= */}

          <div className="md:hidden">

            {loading ? (
              <div
                className="
          p-10
          text-center
          text-[var(--muted)]
        "
              >
                <FiRefreshCw
                  className="
            w-6 h-6
            animate-spin
            mx-auto
            mb-2
            text-[var(--primary)]
          "
                />

                Loading orders...
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">

                {filteredOrders.map((order) => {
                  const orderCode = `#${order._id
                    .slice(-6)
                    .toUpperCase()}`;

                  const isUpdating =
                    updatingOrderId === order._id;

                  return (
                    <div
                      key={order._id}
                      className="
                p-4
                space-y-4
                bg-[var(--card)]
                hover:bg-[var(--border)]/10
                transition
              "
                    >

                      {/* =========================
                  Card Header
              ========================= */}

                      <div
                        className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
                      >
                        <div className="min-w-0">

                          <div
                            className="
                      font-serif
                      font-bold
                      text-lg
                      truncate
                    "
                          >
                            {orderCode}
                          </div>

                          <div
                            className="
                      text-xs
                      text-[var(--muted)]
                      mt-1
                    "
                          >
                            {order.shippingAddress?.fullName ||
                              "Guest Customer"}
                          </div>

                        </div>

                        <div className="shrink-0">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>


                      {/* =========================
                  Customer
              ========================= */}

                      <div
                        className="
                  grid
                  grid-cols-2
                  gap-3
                  text-sm
                "
                      >

                        <div
                          className="
                    rounded-xl
                    bg-[var(--border)]/20
                    p-3
                    min-w-0
                  "
                        >
                          <span
                            className="
                      block
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[var(--muted)]
                      mb-1
                    "
                          >
                            Customer
                          </span>

                          <span
                            className="
                      font-medium
                      break-words
                    "
                          >
                            {order.shippingAddress?.fullName ||
                              "Guest Customer"}
                          </span>
                        </div>


                        <div
                          className="
                    rounded-xl
                    bg-[var(--border)]/20
                    p-3
                    min-w-0
                  "
                        >
                          <span
                            className="
                      block
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[var(--muted)]
                      mb-1
                    "
                          >
                            Phone
                          </span>

                          <span
                            className="
                      font-medium
                      break-words
                      text-xs
                    "
                          >
                            {order.shippingAddress?.phone ||
                              "N/A"}
                          </span>
                        </div>

                      </div>


                      {/* =========================
                  Order Info
              ========================= */}

                      <div
                        className="
                  grid
                  grid-cols-2
                  gap-3
                "
                      >

                        {/* Items */}
                        <div
                          className="
                    rounded-xl
                    border
                    border-[var(--border)]
                    p-3
                  "
                        >
                          <span
                            className="
                      block
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[var(--muted)]
                      mb-1
                    "
                          >
                            Items
                          </span>

                          <span className="font-semibold text-sm">
                            {order.items?.length || 0} item(s)
                          </span>
                        </div>


                        {/* Payment */}
                        <div
                          className="
                    rounded-xl
                    border
                    border-[var(--border)]
                    p-3
                  "
                        >
                          <span
                            className="
                      block
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[var(--muted)]
                      mb-1
                    "
                          >
                            Payment
                          </span>

                          <span
                            className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                    "
                          >
                            {order.paymentMethod === "wallet" ? (
                              <>
                                <FiCreditCard
                                  className="
                            w-3.5 h-3.5
                            text-[var(--primary)]
                          "
                                />

                                E-Wallet
                              </>
                            ) : (
                              <>
                                <FiDollarSign
                                  className="
                            w-3.5 h-3.5
                            text-emerald-600
                          "
                                />

                                COD
                              </>
                            )}
                          </span>
                        </div>

                      </div>


                      {/* =========================
                  Total
              ========================= */}

                      <div
                        className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  pt-1
                "
                      >
                        <span
                          className="
                    text-xs
                    text-[var(--muted)]
                    uppercase
                    tracking-wider
                  "
                        >
                          Total
                        </span>

                        <span
                          className="
                    text-lg
                    font-serif
                    font-bold
                  "
                        >
                          {order.totalPrice?.toLocaleString()} EGP
                        </span>
                      </div>


                      {/* =========================
                  Status Update
              ========================= */}

                      <div className="space-y-2">

                        <label
                          className="
                    block
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[var(--muted)]
                  "
                        >
                          Update Status
                        </label>

                        <select
                          disabled={
                            isUpdating ||
                            actionLoading
                          }
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="
                    w-full
                    text-sm
                    font-medium
                    py-3
                    px-3
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--card)]
                    text-[var(--text)]
                    outline-none
                    focus:ring-2
                    focus:ring-[var(--primary)]/30
                    disabled:opacity-50
                  "
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="shipped">
                            Shipped
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>

                      </div>


                      {/* =========================
                  View Details
              ========================= */}

                      <button
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="
                  w-full
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  px-4
                  rounded-xl
                  border
                  border-[var(--border)]
                  text-sm
                  font-semibold
                  text-[var(--text)]
                  hover:text-[var(--primary)]
                  hover:bg-[var(--border)]/20
                  transition
                "
                      >
                        <FiEye className="w-4 h-4" />

                        View Order Details
                      </button>

                    </div>
                  );
                })}

              </div>
            ) : (
              <div
                className="
          p-10
          text-center
          text-sm
          text-[var(--muted)]
        "
              >
                No orders found matching your criteria.
              </div>
            )}

          </div>

        </div>
      </div>

      {/* =========================
          Order Detail Modal
      ========================= */}
      {selectedOrder && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/60
            backdrop-blur-md
            flex
            items-center
            justify-center
            p-3
            sm:p-4
          "
        >
          <div
            className="
              card
              w-full
              max-w-2xl
              max-h-[92vh]
              overflow-y-auto
              shadow-2xl
              p-4
              sm:p-6
              md:p-8
              space-y-5
              sm:space-y-6
              relative
              border
              border-[var(--border)]
            "
          >
            {/* Modal Header */}
            <div
              className="
                flex
                justify-between
                items-start
                gap-3
                border-b
                border-[var(--border)]
                pb-4
              "
            >
              <div className="min-w-0">
                <h3
                  className="
                    text-xl
                    sm:text-2xl
                    font-serif
                    font-bold
                    text-[var(--text)]
                    break-all
                  "
                >
                  Order #
                  {selectedOrder._id
                    .slice(-6)
                    .toUpperCase()}
                </h3>

                <p
                  className="
                    text-[10px]
                    sm:text-xs
                    text-[var(--muted)]
                    mt-0.5
                  "
                >
                  Placed on{" "}
                  {new Date(
                    selectedOrder.createdAt
                  ).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="
                  text-[var(--muted)]
                  hover:text-[var(--text)]
                  p-2
                  rounded-xl
                  hover:bg-[var(--border)]/40
                  text-lg
                  transition
                  shrink-0
                "
              >
                ✕
              </button>
            </div>

            {/* Quick Status */}
            <div
              className="
                flex
                flex-col
                sm:flex-row
                items-start
                sm:items-center
                justify-between
                gap-3
                bg-[var(--border)]/20
                p-3
                sm:p-4
                rounded-2xl
                border
                border-[var(--border)]
              "
            >
              <span
                className="
                  text-[10px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[var(--muted)]
                "
              >
                Order Status
              </span>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  sm:gap-3
                  w-full
                  sm:w-auto
                "
              >
                {getStatusBadge(
                  selectedOrder.status
                )}

                <select
                  disabled={
                    updatingOrderId ===
                    selectedOrder._id ||
                    actionLoading
                  }
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder._id,
                      e.target.value
                    )
                  }
                  className="
                    flex-1
                    sm:flex-none
                    text-xs
                    font-semibold
                    py-1.5
                    px-3
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--card)]
                    text-[var(--text)]
                  "
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="shipped">
                    Shipped
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            {/* Shipping Details */}
            <div
              className="
                bg-[var(--border)]/20
                p-4
                sm:p-5
                rounded-2xl
                space-y-3
                border
                border-[var(--border)]
              "
            >
              <h4
                className="
                  text-[10px]
                  sm:text-xs
                  font-bold
                  text-[var(--primary)]
                  uppercase
                  tracking-wider
                  flex
                  items-center
                  gap-2
                "
              >
                <FiMapPin className="w-4 h-4" />

                Shipping Information
              </h4>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-3
                  text-sm
                  text-[var(--text)]
                "
              >
                <div className="min-w-0">
                  <span
                    className="
                      text-[var(--muted)]
                      text-xs
                      block
                    "
                  >
                    Customer Name
                  </span>

                  <span className="font-semibold break-words">
                    {selectedOrder.shippingAddress?.fullName}
                  </span>
                </div>

                <div className="min-w-0">
                  <span
                    className="
                      text-[var(--muted)]
                      text-xs
                      block
                    "
                  >
                    Phone Number
                  </span>

                  <span className="font-semibold break-words">
                    {selectedOrder.shippingAddress?.phone}
                  </span>
                </div>

                <div className="min-w-0">
                  <span
                    className="
                      text-[var(--muted)]
                      text-xs
                      block
                    "
                  >
                    City
                  </span>

                  <span className="font-semibold break-words">
                    {selectedOrder.shippingAddress?.city}
                  </span>
                </div>

                <div className="min-w-0">
                  <span
                    className="
                      text-[var(--muted)]
                      text-xs
                      block
                    "
                  >
                    Address
                  </span>

                  <span className="font-semibold break-words">
                    {selectedOrder.shippingAddress?.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Payment */}
            {selectedOrder.paymentMethod ===
              "wallet" &&
              selectedOrder.walletPayment && (
                <div
                  className="
                    border
                    border-[var(--primary)]/30
                    bg-[var(--primary)]/5
                    p-4
                    sm:p-5
                    rounded-2xl
                    space-y-3
                  "
                >
                  <h4
                    className="
                      text-[10px]
                      sm:text-xs
                      font-bold
                      text-[var(--primary)]
                      uppercase
                      tracking-wider
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <FiCreditCard className="w-4 h-4" />

                    Wallet Payment Proof
                  </h4>

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-3
                      text-sm
                    "
                  >
                    <div className="min-w-0">
                      <span
                        className="
                          text-[var(--muted)]
                          text-xs
                          block
                        "
                      >
                        Sender Name
                      </span>

                      <span
                        className="
                          font-medium
                          text-[var(--text)]
                          break-words
                        "
                      >
                        {
                          selectedOrder
                            .walletPayment
                            .senderName
                        }
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span
                        className="
                          text-[var(--muted)]
                          text-xs
                          block
                        "
                      >
                        Sender Phone
                      </span>

                      <span
                        className="
                          font-medium
                          text-[var(--text)]
                          break-words
                        "
                      >
                        {
                          selectedOrder
                            .walletPayment
                            .senderPhone
                        }
                      </span>
                    </div>

                    <div className="sm:col-span-2 min-w-0">
                      <span
                        className="
                          text-[var(--muted)]
                          text-xs
                          block
                        "
                      >
                        Transaction Reference ID
                      </span>

                      <span
                        className="
                          font-mono
                          text-xs
                          text-[var(--text)]
                          bg-[var(--card)]
                          px-2
                          py-1
                          rounded
                          border
                          border-[var(--border)]
                          inline-block
                          mt-0.5
                          max-w-full
                          break-all
                        "
                      >
                        {
                          selectedOrder
                            .walletPayment
                            .transactionId
                        }
                      </span>
                    </div>
                  </div>

                  {selectedOrder.walletPayment
                    .transferImage && (
                      <div className="pt-2">
                        <a
                          href={
                            selectedOrder
                              .walletPayment
                              .transferImage
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                          inline-flex
                          items-center
                          gap-2
                          text-xs
                          font-semibold
                          text-[var(--primary)]
                          hover:underline
                        "
                        >
                          <FiExternalLink className="w-4 h-4" />

                          Open Payment Transfer Receipt
                        </a>
                      </div>
                    )}
                </div>
              )}

            {/* Order Items */}
            <div className="space-y-3">
              <h4
                className="
                  text-[10px]
                  sm:text-xs
                  font-bold
                  text-[var(--muted)]
                  uppercase
                  tracking-wider
                "
              >
                Order Items (
                {selectedOrder.items?.length || 0})
              </h4>

              <div
                className="
                  divide-y
                  divide-[var(--border)]
                  border
                  border-[var(--border)]
                  rounded-2xl
                  overflow-hidden
                  bg-[var(--card)]
                "
              >
                {selectedOrder.items?.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="
                        p-3
                        sm:p-4
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-3
                        sm:gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          sm:gap-4
                          min-w-0
                        "
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="
                              w-12
                              h-12
                              sm:w-14
                              sm:h-14
                              object-cover
                              rounded-xl
                              border
                              border-[var(--border)]
                              shrink-0
                            "
                          />
                        )}

                        <div className="min-w-0">
                          <div
                            className="
                              font-semibold
                              text-sm
                              text-[var(--text)]
                              truncate
                            "
                          >
                            {item.name}
                          </div>

                          <div
                            className="
                              text-[10px]
                              sm:text-xs
                              text-[var(--muted)]
                              mt-0.5
                              break-words
                            "
                          >
                            Color:{" "}
                            {item.color || "N/A"}{" "}
                            | Size:{" "}
                            {item.size || "N/A"}{" "}
                            | Qty: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div
                        className="
                          text-sm
                          font-bold
                          text-[var(--text)]
                          whitespace-nowrap
                          sm:shrink-0
                        "
                      >
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}{" "}
                        EGP
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="
                border-t
                border-[var(--border)]
                pt-4
                flex
                flex-col
                sm:flex-row
                justify-between
                items-start
                sm:items-center
                gap-4
              "
            >
              <div>
                <span
                  className="
                    text-[10px]
                    sm:text-xs
                    text-[var(--muted)]
                    block
                    uppercase
                    tracking-wider
                  "
                >
                  Grand Total
                </span>

                <span
                  className="
                    text-xl
                    sm:text-2xl
                    font-serif
                    font-bold
                    text-[var(--text)]
                  "
                >
                  {selectedOrder.totalPrice?.toLocaleString()} EGP
                </span>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="
                  btn-primary
                  w-full
                  sm:w-auto
                  px-6
                  py-2.5
                  rounded-xl
                  text-xs
                  font-semibold
                  shadow-md
                "
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}