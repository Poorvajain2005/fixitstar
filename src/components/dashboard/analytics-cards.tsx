"use client";

import { motion } from "framer-motion";

import {
  Activity,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

const items = [
  {
    title: "Total Reports",
    value: "128",
    change: "+12%",
    icon: Activity,
    glow: "from-blue-500/20 to-cyan-500/10",
    text: "text-blue-500",
  },

  {
    title: "Resolved Issues",
    value: "94",
    change: "+18%",
    icon: CheckCircle2,
    glow: "from-emerald-500/20 to-green-500/10",
    text: "text-emerald-500",
  },

  {
    title: "In Progress",
    value: "21",
    change: "+4%",
    icon: Clock3,
    glow: "from-orange-500/20 to-red-500/10",
    text: "text-orange-500",
  },
];

export function AnalyticsCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-[28px] border border-border/50 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-xl shadow-black/[0.03]"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-60`}
          />

          <div className="relative p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  {item.title}
                </div>

                <div className="text-4xl font-black tracking-tight">
                  {item.value}
                </div>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.glow} flex items-center justify-center`}
              >
                <item.icon className={`h-7 w-7 ${item.text}`} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <TrendingUp className="h-4 w-4 text-emerald-500" />

              <span className="text-sm text-emerald-500 font-medium">
                {item.change}
              </span>

              <span className="text-sm text-muted-foreground">
                this month
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}