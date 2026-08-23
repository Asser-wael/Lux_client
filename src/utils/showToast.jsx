import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiAlertTriangle,
  FiTruck,
  FiX,
} from "react-icons/fi";

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
        border-[var(--border)]
        bg-[var(--glass)]
        shadow-[var(--shadow)]
        backdrop-blur-[20px]
      "
      style={{
        boxShadow: `
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
              ${accent} 50%,
              transparent 100%
            )
          `,
          boxShadow: `0 0 14px ${accent}`,
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
              color: accent,
              background: `
                radial-gradient(
                  circle at center,
                  ${accent}18,
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
                background: accent,
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
              border-[var(--border)]
              px-4
              py-3.5
            "
            style={{
              background: `
                linear-gradient(
                  135deg,
                  ${accent}12 0%,
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
                background: accent,
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
                    color: accent,
                    textShadow: `
                      0 0 18px ${accent}40
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
                    color: accent,
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
          LUXURY PROGRESS BAR
      ========================================== */}

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
    // ADMIN ORDER
    // ========================================

    adminOrder: {
      accent: "var(--primary)",
      icon: <FiShoppingBag />,
      title: "New Order",
    },

    // ========================================
    // LOW STOCK
    // ========================================

    lowStock: {
      accent: "var(--accent)",
      icon: <FiAlertTriangle />,
      title: "Stock Alert",
    },

    // ========================================
    // ORDER STATUS
    // ========================================

    orderStatus: {
      accent: "var(--primary)",
      icon: <FiTruck />,
      title: "Order Update",
    },

    // ========================================
    // SUCCESS
    // ========================================

    success: {
      accent: "var(--primary)",
      icon: <FiCheckCircle />,
      title: "Success",
    },

    // ========================================
    // ERROR
    // ========================================

    error: {
      accent: "#EF4444",
      icon: <FiXCircle />,
      title: "An Error Occurred",
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
      />
    ),
    {
      duration: 4000,
      position: "top-right",
    }
  );
};