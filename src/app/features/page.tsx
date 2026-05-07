"use client";

import React from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  BrainCircuit,
  Radar,
  ShieldCheck,
  BellRing,
  MapPinned,
  Sparkles,
  Activity,
  Layers3,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <BrainCircuit className="h-7 w-7" />,
      title:
        "AI-Powered Civic Intelligence",

      description:
        "Multimodal AI analyzes images, text, geospatial metadata, and contextual signals to classify civic issues and assign dynamic severity scores.",

      gradient:
        "from-blue-500/20 to-cyan-500/20",
    },

    {
      icon: <Radar className="h-7 w-7" />,
      title:
        "Real-Time Governance Tracking",

      description:
        "Track live issue resolution workflows, authority actions, escalation pipelines, and community-driven prioritization systems.",

      gradient:
        "from-violet-500/20 to-fuchsia-500/20",
    },

    {
      icon: <MapPinned className="h-7 w-7" />,
      title:
        "Geospatial Heatmaps",

      description:
        "Interactive heatmaps and AI clustering reveal high-risk civic hotspots, recurring infrastructure failures, and unresolved urban zones.",

      gradient:
        "from-emerald-500/20 to-teal-500/20",
    },

    {
      icon: <BellRing className="h-7 w-7" />,
      title:
        "Intelligent Notifications",

      description:
        "Receive contextual real-time alerts for issue updates, escalations, authority responses, and nearby high-priority incidents.",

      gradient:
        "from-orange-500/20 to-amber-500/20",
    },

    {
      icon: <ShieldCheck className="h-7 w-7" />,
      title:
        "AI Abuse Prevention",

      description:
        "Integrated moderation systems perform spam filtering, fake-image detection, duplicate suppression, and credibility scoring.",

      gradient:
        "from-rose-500/20 to-pink-500/20",
    },

    {
      icon: <BarChart3 className="h-7 w-7" />,
      title:
        "Predictive Civic Analytics",

      description:
        "Predictive intelligence models analyze historical reports, environmental patterns, and urban density to forecast civic-risk zones.",

      gradient:
        "from-indigo-500/20 to-blue-500/20",
    },
  ];

  const metrics = [
    {
      value: "24/7",
      label:
        "Continuous AI Monitoring",
    },

    {
      value: "97%",
      label:
        "Issue Classification Accuracy",
    },

    {
      value: "10K+",
      label:
        "Civic Issues Resolved",
    },

    {
      value: "70%",
      label:
        "Faster Resolution Routing",
    },
  ];

  return (
    <section className="relative overflow-hidden py-28">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20">
        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* GLOWS */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto mb-20 max-w-4xl text-center"
        >
          <Badge className="mb-6 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-500">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Governance Infrastructure
          </Badge>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Intelligent Civic
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              {" "}
              Infrastructure
            </span>
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-muted-foreground">
            FixIt combines multimodal AI,
            geospatial intelligence, and
            predictive analytics to transform
            fragmented civic reporting into
            scalable governance infrastructure.
          </p>
        </motion.div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map(
            (feature, index) => (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay:
                    index * 0.08,
                }}
              >
                <Card className="group relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-xl shadow-black/[0.03] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                  {/* GRADIENT */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  {/* TOP BORDER */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <CardContent className="relative z-10 p-8">
                    {/* ICON */}
                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl">
                      {feature.icon}
                    </div>

                    {/* TITLE */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-black tracking-tight leading-snug">
                        {feature.title}
                      </h3>

                      <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>

                    {/* DESC */}
                    <p className="leading-relaxed text-muted-foreground text-[15px]">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </div>

        {/* METRICS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="mt-24"
        >
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/[0.03]">
            {/* GLOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-violet-500/5" />

            <div className="relative z-10 grid grid-cols-2 gap-6 p-8 md:grid-cols-4 md:p-12">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="text-center"
                >
                  <div className="mb-3 text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                    {metric.value}
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BOTTOM STRIP */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="mt-20 flex flex-wrap items-center justify-center gap-4"
        >
          {[
            "Multimodal AI",
            "Geospatial Mapping",
            "Duplicate Clustering",
            "Predictive Analytics",
            "Severity Intelligence",
            "Governance Automation",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/50 dark:bg-white/5 px-5 py-3 backdrop-blur-xl"
            >
              <Layers3 className="h-4 w-4 text-primary" />

              <span className="text-sm font-medium">
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;