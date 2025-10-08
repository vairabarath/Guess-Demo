    import React, { useState } from "react";
    import { motion, AnimatePresence } from "framer-motion";

    interface ToggleWithTooltipProps {
      label: string;
      checked: boolean;
      onChange: (value: boolean) => void;
      color: "emerald" | "amber" | "rose";
      description: string;
      icon: React.ReactNode;
      disabled?: boolean;
    }

    export const ToggleWithTooltip: React.FC<ToggleWithTooltipProps> = ({
      label,
      checked,
      onChange,
      color,
      description,
      icon,
      disabled = false,
    }) => {
      const [showTooltip, setShowTooltip] = useState(false);

      const colorClasses = {
        emerald: {
          bg: checked ? "bg-emerald-600" : "bg-gray-600",
          translate: checked ? "translate-x-6" : "translate-x-0",
          border: "border-emerald-500",
          glow: "shadow-emerald-500/50",
        },
        amber: {
          bg: checked ? "bg-amber-600" : "bg-gray-600",
          translate: checked ? "translate-x-6" : "translate-x-0",
          border: "border-amber-500",
          glow: "shadow-amber-500/50",
        },
        rose: {
          bg: checked ? "bg-rose-600" : "bg-gray-600",
          translate: checked ? "translate-x-6" : "translate-x-0",
          border: "border-rose-500",
          glow: "shadow-rose-500/50",
        },
      };

      const colors = colorClasses[color];

      return (
        <div className="relative font-sans">
          <motion.div
            className={`p-4 rounded-xl border-2 ${
              colors.border
            } bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 ${
              disabled ? "opacity-50" : ""
            } ${checked ? `shadow-lg ${colors.glow}` : ""}`}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="text-2xl"
                  animate={{ rotate: checked ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {icon}
                </motion.div>
                <span className="text-white font-semibold">{label}</span>
              </div>
              <motion.button
                type="button"
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  colors.bg
                } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
              >
                <motion.span
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                  animate={{
                    x: checked ? 24 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              </motion.button>
            </div>

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-600 max-w-xs"
                >
                  {description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-600 transform rotate-45"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      );
    };