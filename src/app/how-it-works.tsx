'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ShieldCheck, Wrench, CheckCircle, MapPin, Clock } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      step: "1",
      title: "Report the Issue",
      description: "Take a photo of the problem, add a clear description, select the appropriate category, and pinpoint the exact location on the map.",
      details: [
        "Use your phone camera to capture the issue",
        "Add detailed description and context",
        "Select from predefined categories (potholes, garbage, etc.)",
        "Set priority level based on urgency"
      ]
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      step: "2",
      title: "Admin Review & Assignment",
      description: "City administrators verify the report, assess priority, and assign it to the appropriate department for resolution.",
      details: [
        "Quality check and verification process",
        "Priority assessment and categorization",
        "Assignment to relevant municipal department",
        "Estimated resolution time calculation"
      ]
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      step: "3",
      title: "Resolution & Completion",
      description: "The assigned department addresses the issue, updates the status in real-time, and marks it as resolved upon completion.",
      details: [
        "Field team dispatched to location",
        "Real-time progress updates",
        "Photo evidence of completed work",
        "Quality assurance verification"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes reporting and resolving community issues simple and efficient for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">The Complete Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Location Pinpointing</h3>
              <p className="text-sm text-muted-foreground">Exact GPS coordinates ensure accurate issue location</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">Instant notifications at every stage of resolution</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">Multiple verification steps ensure quality resolution</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Completion Tracking</h3>
              <p className="text-sm text-muted-foreground">Comprehensive records of all resolved issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
