"use client";

import React from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  User,
  Building,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MapPinned,
  Camera,
  Sparkles,
  Radar,
  Layers3,
} from "lucide-react";

const GetStarted = () => {
  const userTypes = [
    {
      id: "citizen",

      icon: <User className="h-7 w-7" />,

      title: "Citizen Access",

      description:
        "Report infrastructure problems, monitor civic issue resolution, and participate in AI-assisted urban governance.",

      steps: [
        "Create your civic account",
        "Verify your identity",
        "Enable GPS permissions",
        "Start reporting local issues",
      ],

      buttonText:
        "Continue as Citizen",

      buttonLink:
        "/login/citizen",

      gradient:
        "from-blue-500/10 to-cyan-500/10",
    },

    {
      id: "admin",

      icon: (
        <Building className="h-7 w-7" />
      ),

      title:
        "Authority Dashboard",

      description:
        "Manage issue escalation workflows, monitor analytics, and coordinate intelligent civic response systems.",

      steps: [
        "Request municipality access",
        "Complete authority verification",
        "Access governance dashboard",
        "Manage civic operations",
      ],

      buttonText:
        "Continue as Authority",

      buttonLink:
        "/login/admin",

      gradient:
        "from-violet-500/10 to-fuchsia-500/10",
    },
  ];

  const requirements = [
    {
      id: "security",

      icon: (
        <ShieldCheck className="h-6 w-6" />
      ),

      title:
        "Secure Authentication",

      items: [
        "Verified email identity",
        "Role-based authorization",
        "Protected civic credentials",
      ],
    },

    {
      id: "reporting",

      icon: (
        <Camera className="h-6 w-6" />
      ),

      title:
        "AI Issue Reporting",

      items: [
        "Photo & video uploads",
        "Contextual issue details",
        "Multimodal AI analysis",
      ],
    },

    {
      id: "location",

      icon: (
        <MapPinned className="h-6 w-6" />
      ),

      title:
        "Geospatial Services",

      items: [
        "GPS-enabled device",
        "Location permissions",
        "Interactive civic mapping",
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden py-28">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20">
        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* GLOWS */}
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />
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
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto mb-20 max-w-4xl text-center"
        >
          <Badge className="mb-6 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-600">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Governance Platform
          </Badge>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Get Started With
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {" "}
              FixIt
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Join citizens and authorities
            using AI-powered civic
            intelligence to improve
            infrastructure management,
            transparency, and urban
            governance systems.
          </p>
        </motion.div>

        {/* USER TYPE CARDS */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {userTypes.map(
            (userType, index) => (
              <motion.div
                key={userType.id}
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
                  duration: 0.45,
                  delay:
                    index * 0.1,
                }}
              >
                <Card className="group relative h-full overflow-hidden rounded-[36px] border border-black/5 bg-white/80 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(59,130,246,0.12)]">
                  {/* GRADIENT */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${userType.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  {/* LIGHT */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

                  <CardContent className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
                    <div>
                      {/* ICON */}
                      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl border border-black/5 bg-white shadow-lg">
                        {userType.icon}
                      </div>

                      {/* TITLE */}
                      <h2 className="text-3xl font-black tracking-tight">
                        {userType.title}
                      </h2>

                      {/* DESC */}
                      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                        {userType.description}
                      </p>

                      {/* STEPS */}
                      <div className="mt-8 space-y-4">
                        {userType.steps.map(
                          (
                            step,
                            idx
                          ) => (
                            <div
                              key={`${userType.id}-${idx}`}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              </div>

                              <span className="text-sm text-muted-foreground">
                                {step}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* BUTTON */}
                    <Button
                      asChild
                      className="mt-10 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-blue-500/20"
                    >
                      <Link
                        href={
                          userType.buttonLink
                        }
                      >
                        {
                          userType.buttonText
                        }

                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </div>

        {/* REQUIREMENTS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="mt-24"
        >
          <div className="relative overflow-hidden rounded-[40px] border border-black/5 bg-white/80 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-transparent to-violet-500/[0.03]" />

            <div className="relative z-10 p-10 md:p-14">
              <div className="mb-12 text-center">
                <Badge className="mb-5 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-violet-600">
                  <Layers3 className="mr-2 h-4 w-4" />
                  Platform Infrastructure
                </Badge>

                <h2 className="text-4xl font-black tracking-tight">
                  What You’ll Need
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                  FixIt integrates AI-driven
                  governance workflows,
                  geospatial intelligence,
                  and secure civic identity
                  systems.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {requirements.map(
                  (requirement) => (
                    <div
                      key={
                        requirement.id
                      }
                      className="rounded-[28px] border border-black/5 bg-white p-8 shadow-lg"
                    >
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                        {
                          requirement.icon
                        }
                      </div>

                      <h3 className="mb-5 text-xl font-bold tracking-tight">
                        {
                          requirement.title
                        }
                      </h3>

                      <div className="space-y-4">
                        {requirement.items.map(
                          (
                            item,
                            idx
                          ) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

                              <span className="text-sm leading-relaxed text-muted-foreground">
                                {item}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="mt-24 text-center"
        >
          <Badge className="mb-6 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-emerald-600">
            <Radar className="mr-2 h-4 w-4" />
            Smart Governance Starts Here
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready To Improve
            <br />
            Your Community?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Participate in a modern civic
            ecosystem powered by AI-driven
            analytics, transparency, and
            real-time urban intelligence.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 shadow-xl shadow-blue-500/20"
            >
              <Link href="/login/citizen">
                <User className="mr-2 h-5 w-5" />
                Citizen Portal
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 rounded-2xl border-black/10 bg-white px-8 shadow-lg"
            >
              <Link href="/login/admin">
                <Building className="mr-2 h-5 w-5" />
                Authority Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStarted;