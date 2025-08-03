"use client"

import { motion } from "framer-motion"

export function SkeletonLoader() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-slate-200 to-blue-200 dark:from-slate-700 dark:to-blue-700 rounded-full"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
          <div className="space-y-2 flex-1">
            <motion.div
              className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 dark:from-slate-700 dark:to-blue-700 rounded-lg"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
              }}
              style={{ width: `${60 + i * 10}%` }}
            />
            <motion.div
              className="h-3 bg-gradient-to-r from-slate-200 to-blue-200 dark:from-slate-700 dark:to-blue-700 rounded-lg"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.15,
              }}
              style={{ width: `${40 + i * 15}%` }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-md">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <motion.div
            className="h-4 w-24 bg-gradient-to-r from-slate-300 to-blue-300 dark:from-slate-600 dark:to-blue-600 rounded"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
          <motion.div
            className="h-12 w-full bg-gradient-to-r from-slate-200 to-blue-200 dark:from-slate-700 dark:to-blue-700 rounded-xl"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
            }}
          />
        </motion.div>
      ))}

      <motion.div
        className="h-12 w-full bg-gradient-to-r from-blue-300 to-slate-300 dark:from-blue-600 dark:to-slate-600 rounded-xl"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  )
}
