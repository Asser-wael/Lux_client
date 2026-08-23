import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiAlertTriangle,
  FiTruck,
  FiX,
  FiBell,
} from "react-icons/fi";

// ==========================================
// CONSTANTS
// ==========================================

const PERSISTENT_ACCENT = "#10B981"; // Emerald green

// ==========================================
// TOAST CARD COMPONENT
// ==========================================

const ToastCard = ({
  t,
  accent,
  icon,
  title,
  message,
  isSuccess,
  amount,
  isAdminOrder,
  persistent,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -18,
        scale: 0.94,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: t.visible ? 1 : 0,
        y: t.visible ? 0 : -18,
        scale: t.visible ? 1 : 0.94,
        filter: t.visible ? "blur(0px)" : "blur(6px)",
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        filter: "blur(4px)",
      }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        relative
        w-[390px]
        max-w-[calc(100vw-32px)]
        overflow-hidden
        rounded-[22px]
        border
        bg-[var(--glass)]
        shadow-[var(--shadow)]
        backdrop-blur-[20px]
      "
      style={{
        borderColor: persistent
          ? `${PERSISTENT_ACCENT}40`
          : "var(--border)",
        boxShadow: persistent
          ? `
            0 20px 50px rgba(0, 0, 0, 0.14),
            0 0 30px ${PERSISTENT_ACCENT}20
          `
          : `
            0 20px 50px rgba(0, 0, 0, 0.14),
            0 0 30px ${accent}12
          `,
      }}
    >
      {/* ==========================================
          TOP ACCENT LINE
      ========================================== */}

      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent 0%,
              ${persistent ? PERSISTENT_ACCENT : accent} 50%,
              transparent 100%
            )
          `,
          boxShadow: `0 0 14px ${persistent ? PERSISTENT_ACCENT : accent}`,
        }}
      />

      <div className="p-4 sm:p-5">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex items-start gap-3.5">

          {/* Icon Badge */}
          <div
            className="
              relative
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-[var(--border)]
            "
            style={{
              color: persistent ? PERSISTENT_ACCENT : accent,
              background: `
                radial-gradient(
                  circle at center,
                  ${persistent ? PERSISTENT_ACCENT : accent}18,
                  transparent 80%
                )
              `,
            }}
          >
            {/* Glow */}
            <span
              className="
                absolute
                inset-0
                rounded-2xl
                opacity-25
                blur-sm
              "
              style={{
                background: persistent ? PERSISTENT_ACCENT : accent,
              }}
            />

            <span className="relative text-[20px] drop-shadow-sm">
              {icon}
            </span>
          </div>

          {/* Title + Message */}
          <div className="min-w-0 flex-1 pt-0.5">

            <div className="flex items-center gap-2">

              <h3
                className="
                  font-serif
                  text-[16px]
                  font-bold
                  tracking-tight
                "
                style={{
                  color: "var(--text)",
                }}
              >
                {title}
              </h3>

              {/* Success Pulse */}
              {isSuccess && (
                <span
                  className="
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                    animate-pulse
                  "
                  style={{
                    background: "var(--primary)",
                    boxShadow: "0 0 8px var(--primary)",
                  }}
                />
              )}
            </div>

            <p
              className="
                mt-1
                line-clamp-2
                text-[13px]
                font-medium
                leading-relaxed
              "
              style={{
                color: "var(--muted)",
              }}
            >
              {message}
            </p>

            {/* Persistent badge */}
            {persistent && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="
                  mt-2
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-2.5
                  py-1
                "
                style={{
                  background: `${PERSISTENT_ACCENT}14`,
                  color: PERSISTENT_ACCENT,
                }}
              >
                <FiBell size={11} />
                <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
                  Requires attention
                </span>
              </motion.div>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            aria-label="Close notification"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-transparent
              text-[var(--muted)]
              transition-all
              duration-200
              hover:border-[var(--border)]
              hover:bg-[var(--card)]
              hover:text-[var(--text)]
            "
          >
            <FiX size={14} />
          </button>
        </div>

        {/* ==========================================
            ADMIN ORDER AMOUNT
        ========================================== */}

        {isAdminOrder && amount !== undefined && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.12,
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              relative
              mt-4
              overflow-hidden
              rounded-2xl
              border
              px-4
              py-3.5
            "
            style={{
              borderColor: `${PERSISTENT_ACCENT}30`,
              background: `
                linear-gradient(
                  135deg,
                  ${PERSISTENT_ACCENT}14 0%,
                  transparent 65%
                )
              `,
            }}
          >
            {/* Background Glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-24
                w-24
                rounded-full
                blur-2xl
                opacity-20
              "
              style={{
                background: PERSISTENT_ACCENT,
              }}
            />

            <div className="relative flex items-center justify-between gap-4">

              {/* Label */}
              <div className="flex flex-col">

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                  "
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Order Total
                </span>

                <span
                  className="
                    mt-1
                    text-[10px]
                    font-medium
                  "
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Payment amount
                </span>
              </div>

              {/* Amount */}
              <motion.div
                initial={{
                  scale: 0.8,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.18,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                className="flex items-baseline gap-1"
              >
                <span
                  className="
                    text-[23px]
                    font-black
                    tracking-tight
                  "
                  style={{
                    color: PERSISTENT_ACCENT,
                    textShadow: `
                      0 0 18px ${PERSISTENT_ACCENT}40
                    `,
                  }}
                >
                  {Number(amount).toLocaleString("en-US")}
                </span>

                <span
                  className="
                    text-[11px]
                    font-bold
                    tracking-wide
                  "
                  style={{
                    color: PERSISTENT_ACCENT,
                  }}
                >
                  EGP
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ==========================================
          BOTTOM BAR
          - Persistent toasts (adminOrder / lowStock):
            green animated bar + icon, no countdown
            (stays until the user closes it manually).
          - Regular toasts: normal countdown progress bar.
      ========================================== */}

      {persistent ? (
        <div
          className="
            relative
            flex
            h-[26px]
            w-full
            items-center
            justify-center
            gap-1.5
            overflow-hidden
          "
          style={{
            background: `${PERSISTENT_ACCENT}12`,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${PERSISTENT_ACCENT}30, transparent)`,
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["-100% 0%", "200% 0%"],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <span
            className="relative flex h-1.5 w-1.5 rounded-full"
            style={{
              background: PERSISTENT_ACCENT,
              boxShadow: `0 0 6px ${PERSISTENT_ACCENT}`,
            }}
          />

          <span
            className="relative text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{ color: PERSISTENT_ACCENT }}
          >
            Tap × to dismiss
          </span>
        </div>
      ) : (
        <div
          className="h-[2.5px] w-full overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.03)",
          }}
        >
          <motion.div
            initial={{
              width: "100%",
            }}
            animate={{
              width: "0%",
            }}
            transition={{
              duration: 4,
              ease: "linear",
            }}
            className="h-full"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  ${accent},
                  var(--primary)
                )
              `,
              boxShadow: `0 0 10px ${accent}`,
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// SHOW TOAST HANDLER
// ==========================================

export const showToast = ({
  type,
  message,
  amount,
}) => {
  const config = {
    // ========================================
    // ADMIN ORDER — stays until manually dismissed
    // ========================================

    adminOrder: {
      accent: PERSISTENT_ACCENT,
      icon: <FiShoppingBag />,
      title: "New Order",
      persistent: true,
    },

    // ========================================
    // LOW STOCK — stays until manually dismissed
    // ========================================

    lowStock: {
      accent: PERSISTENT_ACCENT,
      icon: <FiAlertTriangle />,
      title: "Stock Alert",
      persistent: true,
    },

    // ========================================
    // ORDER STATUS
    // ========================================

    orderStatus: {
      accent: "var(--primary)",
      icon: <FiTruck />,
      title: "Order Update",
      persistent: false,
    },

    // ========================================
    // SUCCESS
    // ========================================

    success: {
      accent: "var(--primary)",
      icon: <FiCheckCircle />,
      title: "Success",
      persistent: false,
    },

    // ========================================
    // ERROR
    // ========================================

    error: {
      accent: "#EF4444",
      icon: <FiXCircle />,
      title: "An Error Occurred",
      persistent: false,
    },
  };

  // ==========================================
  // HANDLE BOOLEAN TYPES
  // ==========================================

  let selectedType = type;

  if (type === true) {
    selectedType = "success";
  }

  if (type === false) {
    selectedType = "error";
  }

  const current = config[selectedType];

  // ==========================================
  // FALLBACK
  // ==========================================

  if (!current) {
    toast(message);
    return;
  }

  // ==========================================
  // CUSTOM TOAST
  // ==========================================

  toast.custom(
    (t) => (
      <ToastCard
        t={t}
        accent={current.accent}
        icon={current.icon}
        title={current.title}
        message={message}
        amount={amount}
        isAdminOrder={selectedType === "adminOrder"}
        isSuccess={selectedType === "success"}
        persistent={current.persistent}
      />
    ),
    {
      // ✅ persistent toasts never auto-dismiss
      duration: current.persistent ? Infinity : 4000,
      position: "top-right",
    }
  );
};