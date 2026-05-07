"use client";

import React from "react";
<<<<<<< HEAD

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
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Users, MapPin, Shield, BarChart3, Bell } from "lucide-react";
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc

const Features = () => {
  const features = [
    {
<<<<<<< HEAD
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
=======
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Fast & Easy Reporting",
      description:
        "Report issues in seconds with our intuitive interface. Just snap a photo, add a description, and submit - no paperwork required.",
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: "Real-Time Notifications",
      description:
        "Stay informed with instant updates on your reports. Get notified when your issue is being reviewed, in progress, or resolved.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Collaboration",
      description:
        "See what others are reporting in your area and collaborate on community initiatives to make your neighborhood better.",
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Precise Location Tracking",
      description:
        "Pinpoint exact locations with GPS technology. Help authorities find and resolve issues faster with accurate coordinates.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security. Report issues anonymously or with your identity protected.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Data Analytics Dashboard",
      description:
        "Access insights on community issues, resolution times, and trends. Help your local government make data-driven decisions.",
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
    },
  ];

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how FixIt empowers citizens and authorities to work
            together for cleaner, safer communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300 border-border"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Why Choose FixIt?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">
                Round-the-clock reporting and monitoring
              </p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">
                Average resolution rate across communities
              </p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">
                Issues resolved nationwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
