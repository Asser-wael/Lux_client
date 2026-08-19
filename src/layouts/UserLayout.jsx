import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiShield,
  FiHome,
  FiShoppingCart,
  FiBell,
  FiGrid,
  FiTag,
} from "react-icons/fi";

import { logoutUser } from "../features/auth/authSlice";
import ThemeToggle from "../components/common/ToggleButton";
import Footer from "../components/common/Footer";

// ==========================================
// Config
// ==========================================

const NAV_LINKS = [
  { label: "Home", path: "/", icon: FiHome },
  { label: "Shop", path: "/products", icon: FiShoppingBag },
  { label: "Collections", path: "/collections", icon: FiGrid },
  { label: "Sale", path: "/sale", icon: FiTag },
];

const BOTTOM_NAV_ITEMS = [
  { key: "home", label: "Home", icon: FiHome, path: "/" },
  { key: "shop", label: "Shop", icon: FiShoppingBag, path: "/products" },
  { key: "notifications", label: "Notifications", icon: FiBell, path: "/notifications" },
  { key: "cart", label: "Cart", icon: FiShoppingCart, path: "/cart" },
  { key: "account", label: "Account", icon: FiUser, path: "/profile" },
];

// ==========================================
// Animation Variants
// ==========================================

const diagonalFadeIn = {
  hidden: { opacity: 0, x: -10, y: -10 },
  visible: (index = 0) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const dropdownVariants = {
  hidden: { opacity: 0, x: -15, y: -15 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, x: 10, y: 10, transition: { duration: 0.25, ease: "easeOut" } },
};

const drawerVariants = {
  hidden: { opacity: 0, x: -280, y: -40 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -280, y: -40, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

// ==========================================
// Shared Styles
// ==========================================

const linkBase =
  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]";

const iconBtnBase = "text-lg text-[var(--text)] transition-colors hover:text-[var(--primary)]";

// ==========================================
// CartBadge
// ==========================================

function CartBadge({ count }) {
  if (!count) return null;
  return (
    <span
      className="
        absolute -right-2 -top-2 flex h-4 w-4
        items-center justify-center rounded-full
        bg-[var(--bg)] text-[10px] font-bold text-accent
      "
    >
      {count}
    </span>
  );
}

// ==========================================
// AccountDropdown
// ==========================================

function AccountDropdown({ user, onClose, onLogout }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
      className="
        absolute right-0 top-10 z-50 w-48 rounded-2xl
        border border-[var(--border)] bg-[var(--card)]
        p-2 shadow-[var(--shadow)]
      "
    >
      {user ? (
        <>
          <Link to="/profile" onClick={onClose} className={linkBase}>
            <FiUser /> Profile
          </Link>
          <Link to="/orders" onClick={onClose} className={linkBase}>
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/notifications" onClick={onClose} className={linkBase}>
            <FiBell /> Notifications
          </Link>
          <button
            onClick={onLogout}
            className={`w-full text-left ${linkBase} hover:text-red-500`}
          >
            <FiLogOut /> Logout
          </button>

          {user.role === "admin" && (
            <>
              <div className="my-1.5 border-t border-[var(--border)]" />
              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-wider text-[var(--muted)] hover:text-[var(--primary)]"
              >
                <FiShield /> Admin Dashboard
              </Link>
            </>
          )}
        </>
      ) : (
        <>
          <Link to="/login" onClick={onClose} className={linkBase}>
            <FiUser /> Sign In
          </Link>
          <Link to="/register" onClick={onClose} className={linkBase}>
            <FiShield /> Sign Up
          </Link>
        </>
      )}
    </motion.div>
  );
}

// ==========================================
// Navbar (Desktop + Mobile Header)
// ==========================================

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart?.items) || [];

  const [accountOpen, setAccountOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setAccountOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={diagonalFadeIn}
        custom={0}
        className="sticky top-0 z-40 hidden md:block border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <motion.div custom={1} variants={diagonalFadeIn}>
            <Link
              to="/"
              className="logo text-2xl font-bold uppercase tracking-[3px] text-[var(--text)] transition-colors hover:text-[var(--primary)]"
            >
              LUXORA
            </Link>
          </motion.div>

          <nav className="flex items-center gap-8 text-[13px] font-medium tracking-wider">
            {NAV_LINKS.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.path} custom={2 + index} variants={diagonalFadeIn}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-1.5 text-[var(--text)] transition-colors hover:text-[var(--primary)]"
                  >
                    <Icon className="text-sm" />
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="flex items-center gap-5">
            <motion.div custom={6} variants={diagonalFadeIn}>
              <ThemeToggle />
            </motion.div>

            <motion.div custom={7} variants={diagonalFadeIn}>
              <Link to="/notifications" aria-label="Notifications" className={`relative ${iconBtnBase}`}>
                <FiBell />
              </Link>
            </motion.div>

            <motion.div custom={8} variants={diagonalFadeIn}>
              <Link to="/cart" aria-label="Cart" className={`relative ${iconBtnBase}`}>
                <FiShoppingBag />
                <CartBadge count={cartItems.length} />
              </Link>
            </motion.div>

            <motion.div custom={9} variants={diagonalFadeIn} className="relative">
              <button
                onClick={() => setAccountOpen((value) => !value)}
                className={`flex items-center gap-1.5 ${iconBtnBase}`}
              >
                <FiUser />
                <FiChevronDown
                  className="text-xs transition-transform duration-200"
                  style={{ transform: accountOpen ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <AccountDropdown
                    user={user}
                    onClose={() => setAccountOpen(false)}
                    onLogout={handleLogout}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={diagonalFadeIn}
        custom={0}
        className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl md:hidden"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <motion.button
              custom={1}
              variants={diagonalFadeIn}
              onClick={() => setDrawerOpen(true)}
              aria-label="Menu"
              className="text-xl text-[var(--text)] hover:text-[var(--primary)]"
            >
              <FiMenu />
            </motion.button>

            <motion.div custom={2} variants={diagonalFadeIn}>
              <ThemeToggle />
            </motion.div>
          </div>

          <motion.div custom={3} variants={diagonalFadeIn}>
            <Link to="/" className="logo text-xl font-bold uppercase tracking-[2px] text-[var(--text)]">
              LUXORA
            </Link>
          </motion.div>

          <motion.div custom={4} variants={diagonalFadeIn}>
            <Link to="/cart" className="relative text-xl text-[var(--text)]">
              <FiShoppingBag />
              <CartBadge count={cartItems.length} />
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              onClick={closeDrawer}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
              className="fixed left-0 top-0 bottom-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
                <span className="logo text-xl font-bold tracking-[2px] text-[var(--text)]">LUXORA</span>
                <button onClick={closeDrawer} aria-label="Close" className="text-[var(--text)] hover:text-[var(--primary)]">
                  <FiX className="text-xl" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {NAV_LINKS.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div key={link.path} custom={index} initial="hidden" animate="visible" variants={diagonalFadeIn}>
                      <Link
                        to={link.path}
                        onClick={closeDrawer}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]"
                      >
                        <Icon className="text-lg" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div custom={NAV_LINKS.length} initial="hidden" animate="visible" variants={diagonalFadeIn}>
                  <Link
                    to="/notifications"
                    onClick={closeDrawer}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]"
                  >
                    <FiBell className="text-lg" />
                    Notifications
                  </Link>
                </motion.div>

                {user && (
                  <motion.div custom={NAV_LINKS.length + 1} initial="hidden" animate="visible" variants={diagonalFadeIn}>
                    <Link
                      to="/orders"
                      onClick={closeDrawer}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]"
                    >
                      <FiShoppingBag className="text-lg" />
                      Orders
                    </Link>
                  </motion.div>
                )}

                <motion.div custom={NAV_LINKS.length + 2} initial="hidden" animate="visible" variants={diagonalFadeIn}>
                  <Link
                    to={user ? "/profile" : "/login"}
                    onClick={closeDrawer}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]"
                  >
                    <FiUser className="text-lg" />
                    Account
                  </Link>
                </motion.div>
                {user && (
                  <div className="px-3">
                    <button
                      onClick={async () => {
                        try {
                          await dispatch(logoutUser()).unwrap();
                          closeDrawer();
                          navigate("/");
                        } catch (error) {
                          console.error("Logout failed:", error);
                        }
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-500/10"
                    >
                      <FiLogOut className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
                {user?.role === "admin" && (
                  <motion.div custom={NAV_LINKS.length + 3} initial="hidden" animate="visible" variants={diagonalFadeIn}>
                    <Link
                      to="/admin"
                      onClick={closeDrawer}
                      className="flex items-center gap-2 px-4 py-3 text-[12px] font-bold tracking-wider text-[var(--muted)] hover:text-[var(--primary)]"
                    >
                      <FiShield />
                      Admin Dashboard
                    </Link>
                  </motion.div>
                )}
              </nav>

              {!user && (
                <div className="flex flex-col gap-3 border-t border-[var(--border)] p-5">
                  <Link to="/login" onClick={closeDrawer} className="btn-primary rounded-xl py-3 text-center text-[13px] font-semibold">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeDrawer}
                    className="rounded-xl border border-[var(--border)] py-3 text-center text-[13px] font-semibold text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ==========================================
// BottomNav
// ==========================================

function BottomNav() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around px-2 py-1">
        {BOTTOM_NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const to = item.key === "account" && !user ? "/login" : item.path;

          return (
            <motion.div
              key={item.key}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={diagonalFadeIn}
              className="flex flex-1"
            >
              <Link to={to} className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2">
                {active && (
                  <motion.div
                    layoutId="bottomNavDot"
                    transition={{ type: "spring", stiffness: 380, damping: 25 }}
                    className="absolute top-1 h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"
                  />
                )}

                <Icon className="text-lg" style={{ color: active ? "var(--primary)" : "var(--muted)" }} />

                <span
                  className="text-[10px] tracking-wide"
                  style={{ color: active ? "var(--text)" : "var(--muted)", fontWeight: active ? 700 : 500 }}
                >
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}

// ==========================================
// UserLayout
// ==========================================

export default function UserLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-0">
        <motion.div
          key={location.pathname}
          variants={pageTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full w-full"
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}