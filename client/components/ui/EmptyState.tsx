"use client";

/**
 * Empty State Component
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="empty-state"
    >
      {icon && (
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-6 p-6 rounded-full bg-gray-100 dark:bg-dark-800"
        >
          {icon}
        </motion.div>
      )}

      <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md text-sm leading-relaxed mb-8">
        {description}
      </p>

      {(actionLabel && actionHref) && (
        <Link href={actionHref}>
          <button className="btn-primary">
            {actionLabel}
          </button>
        </Link>
      )}

      {(actionLabel && onAction) && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
