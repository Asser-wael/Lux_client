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
// TOAST CARD COMPONENT (LUXURY DESIGN)
// ==========================================

const ToastCard = ({ t, accent, icon, title, message, isSuccess }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -16,
        scale: 0.94,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: t.visible ? 1 : 0,
        y: t.visible ? 0 : -16,
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
        rounded-[20px]
        border
        border-[var(--border)]
        bg-[var(--glass)]
        shadow-[var(--shadow)]
        backdrop-blur-[20px]
      "
      style={{
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.12), 0 0 25px ${accent}15`,
      }}
    >
      {/* Top Accent Line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />

      <div className="flex items-start gap-3.5 p-4 sm:p-5">
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
            transition-transform
            duration-300
            hover:scale-105
          "
          style={{
            color: accent,
            background: `radial-gradient(circle at center, ${accent}18, transparent 80%)`,
          }}
        >
          <span
            className="absolute inset-0 rounded-2xl opacity-25 blur-sm"
            style={{ background: accent }}
          />

          <span className="relative text-[20px] drop-shadow-sm">
            {icon}
          </span>
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h3
              className="font-serif text-[16px] font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {title}
            </h3>

            {/* Green Pulse Dot - Rendered ONLY on Success */}
            {isSuccess && (
              <span
                className="h-2 w-2 shrink-0 rounded-full animate-pulse"
                style={{
                  background: "var(--primary)",
                  boxShadow: "0 0 8px var(--primary)",
                }}
              />
            )}
          </div>

          <p
            className="mt-1 line-clamp-2 text-[13px] font-medium leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => toast.dismiss(t.id)}
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

      {/* Luxury Animated Progress Bar */}
      <div
        className="h-[2.5px] w-full overflow-hidden"
        style={{
          background: `rgba(0,0,0,0.03)`,
        }}
      >
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{
            duration: 4,
            ease: "linear",
          }}
          className="h-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, var(--primary))`,
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

export const showToast = ({ type, message }) => {
  const config = {
    adminOrder: {
      accent: "var(--primary)",
      icon: <FiShoppingBag />,
      title: "New Order",
    },

    lowStock: {
      accent: "var(--accent)",
      icon: <FiAlertTriangle />,
      title: "Stock Alert",
    },

    orderStatus: {
      accent: "var(--primary)",
      icon: <FiTruck />,
      title: "Order Update",
    },

    success: {
      accent: "var(--primary)", // Theme primary green/accent color
      icon: <FiCheckCircle />,
      title: "Success",
    },

    error: {
      accent: "#EF4444",
      icon: <FiXCircle />,
      title: "An Error Occurred",
    },
  };

  // Handle boolean response types
  let selectedType = type;
  if (type === true) selectedType = "success";
  if (type === false) selectedType = "error";

  const current = config[selectedType];

  if (!current) {
    toast(message);
    return;
  }

  toast.custom(
    (t) => (
      <ToastCard
        t={t}
        accent={current.accent}
        icon={current.icon}
        title={current.title}
        message={message}
        isSuccess={selectedType === "success"}
      />
    ),
    {
      duration: 4000,
      position: "top-right",
    }
  );
};