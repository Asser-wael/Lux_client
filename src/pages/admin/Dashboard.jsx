import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  PiCurrencyDollarDuotone,
  PiShoppingBagDuotone,
  PiUsersDuotone,
  PiPackageDuotone,
  PiChartLineUpDuotone,
} from "react-icons/pi";
import useSocket from "../../hooks/useSocket";
import {
  fetchDashboardCards,
  fetchRevenueChart,
  fetchOrdersChart,
  fetchLatestOrders,
  fetchLowStockProducts,
  setRevenuePeriod,
  setOrdersPeriod,
} from "../../features/dashboard/dashboardSlice";
import { setEditid } from "../../features/products/productSlice";
import EditProduct from "../../components/products/EditProduct";
import useCountUp from "../../hooks/useCountUp";


const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const currency = (n) =>
  `${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} EGP`;

const PeriodFilter = ({ current, onChange }) => (
  <div className="flex items-center gap-1 rounded-full border border-border bg-bg p-1">
    {["weekly", "monthly", "yearly"].map((p) => (
      <button
        key={p}
        onClick={() => onChange(p)}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${current === p ? "bg-primary text-white" : "text-muted hover:text-text"
          }`}
      >
        {p}
      </button>
    ))}
  </div>
);

const toneClasses = {
  accent: "bg-accent/10 text-accent",
  primary: "bg-primary/10 text-primary",
};

// StatCard مع إضافة الـ CountUp
const StatCard = ({ icon, label, rawValue = 0, isCurrency = false, tone = "accent" }) => {
  const animatedValue = useCountUp(rawValue, 1200);
  const displayValue = isCurrency ? currency(animatedValue) : animatedValue.toLocaleString("en-US");

  return (
    <motion.div
      variants={cardVariants}
      className="group card relative overflow-hidden p-5 sm:p-6 transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${toneClasses[tone]}`}
        >
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
      </div>
      <p className="mt-4 truncate text-2xl font-semibold text-text sm:text-3xl">
        {displayValue}
      </p>
      <span
        className={`absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${tone === "primary" ? "bg-primary" : "bg-accent"
          }`}
      />
    </motion.div>
  );
};

const StatCardSkeleton = () => (
  <div className="card animate-pulse p-5 sm:p-6">
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-xl bg-border/60" />
      <span className="h-3 w-20 rounded bg-border/60" />
    </div>
    <div className="mt-4 h-7 w-24 rounded bg-border/60" />
  </div>
);

const ChartSkeleton = () => (
  <div className="card p-6">
    <div className="mb-6 flex items-center justify-between">
      <div className="h-5 w-24 animate-pulse rounded bg-border/60" />
      <div className="h-8 w-40 animate-pulse rounded-full bg-border/60" />
    </div>
    <div className="h-[260px] animate-pulse rounded-xl bg-border/40" />
  </div>
);

const RowSkeleton = () => (
  <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0">
    <div className="flex min-w-0 items-center gap-3">
      <span className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-border/60" />
      <div className="space-y-1.5">
        <div className="h-3 w-24 animate-pulse rounded bg-border/60" />
        <div className="h-2.5 w-14 animate-pulse rounded bg-border/50" />
      </div>
    </div>
    <div className="h-3 w-14 shrink-0 animate-pulse rounded bg-border/60" />
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const socket = useSocket();

  const [onlineUsers, setOnlineUsers] = useState(0);

  const { products, editid } = useSelector((state) => state.products);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (count) => {
      setOnlineUsers(count);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket]);

  const {
    cards,
    revenueChart,
    ordersChart,
    latestOrders,
    lowStock,
    revenuePeriod,
    ordersPeriod,
    loading,
  } = useSelector((state) => state.dashboard);

  const handleEdit = (product) => {
    dispatch(setEditid(product._id));
  };
  useEffect(() => {
    dispatch(fetchDashboardCards());
    dispatch(fetchLatestOrders());
    dispatch(fetchLowStockProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRevenueChart(revenuePeriod));
  }, [dispatch, revenuePeriod]);

  useEffect(() => {
    dispatch(fetchOrdersChart(ordersPeriod));
  }, [dispatch, ordersPeriod]);

  const cardsLoading = loading && !cards;

  const profitMargin = useMemo(() => {
    if (!cards?.totalRevenue) return null;
    const pct = ((cards.totalProfit || 0) / cards.totalRevenue) * 100;
    return Number.isFinite(pct) ? pct.toFixed(1) : null;
  }, [cards]);

  if (editid) {
    return <EditProduct />;
  }

  return (
    <div className="min-h-screen space-y-8 bg-bg p-4 sm:space-y-10 sm:p-8 lg:p-10">
      {/* هيدر + أونلاين يوزرز */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Overview
          </p>
          <h1 className="mt-1 text-2xl text-text sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">A snapshot of how your store is performing.</p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-border bg-card px-4 py-2 sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-sm text-muted">{onlineUsers} online now</span>
        </div>
      </motion.div>

      {/* الكروت - تم تعديل التنسيق ليكون سطر واحد على الموبايل */}
      {cardsLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-3 xl:grid-cols-5"
        >
          <StatCard
            icon={<PiCurrencyDollarDuotone />}
            label="Total Revenue"
            rawValue={cards?.totalRevenue}
            isCurrency={true}
            tone="accent"
          />
          <StatCard
            icon={<PiChartLineUpDuotone />}
            label={profitMargin ? `Profit · ${profitMargin}%` : "Profit"}
            rawValue={cards?.totalProfit}
            isCurrency={true}
            tone="primary"
          />
          <StatCard
            icon={<PiShoppingBagDuotone />}
            label="Total Orders"
            rawValue={cards?.totalOrders}
            tone="accent"
          />
          <StatCard
            icon={<PiUsersDuotone />}
            label="Total Users"
            rawValue={cards?.totalUsers}
            tone="primary"
          />
          <StatCard
            icon={<PiPackageDuotone />}
            label="Total Products"
            rawValue={cards?.totalProducts}
            tone="accent"
          />
        </motion.div>
      )}

      {/* الشارتات */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loading && !revenueChart?.length ? (
          <ChartSkeleton />
        ) : (
          <div className="card p-4 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg text-text">Revenue</h3>
              <PeriodFilter
                current={revenuePeriod}
                onChange={(p) => dispatch(setRevenuePeriod(p))}
              />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueChart}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="_id"
                  stroke="var(--muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {loading && !ordersChart?.length ? (
          <ChartSkeleton />
        ) : (
          <div className="card p-4 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg text-text">Orders</h3>
              <PeriodFilter
                current={ordersPeriod}
                onChange={(p) => dispatch(setOrdersPeriod(p))}
              />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ordersChart}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="_id"
                  stroke="var(--muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--bg)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--text)",
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* الجداول */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-4 sm:p-6">
          <h3 className="mb-5 text-lg text-text">Latest Orders</h3>
          <div>
            {loading && !latestOrders?.length ? (
              <>
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
              </>
            ) : latestOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">No orders yet.</p>
            ) : (
              latestOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                      {(order.user?.name || "G")[0].toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-xs capitalize text-muted">{order.status}</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-accent">
                    {currency(order.totalPrice)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <h3 className="mb-5 text-lg text-text">Low Stock Products</h3>
          <div>
            {loading && !lowStock?.length ? (
              <>
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
              </>
            ) : lowStock.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">All stock is healthy 👍</p>
            ) : (
              lowStock.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.color} / {item.size}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      Edit
                    </button>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}