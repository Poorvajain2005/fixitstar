'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, ArrowRight, CheckCircle, Shield, MapPin, Camera } from "lucide-react";
import Link from "next/link";

const GetStarted = () => {
  const userTypes = [
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: "For Citizens",
      description: "Report issues, track progress, and make your community better",
      steps: [
        "Create your citizen account",
        "Verify your email address",
        "Download the mobile app (optional)",
        "Start reporting issues in your area"
      ],
      buttonText: "Citizen Sign Up",
      buttonLink: "/login/citizen"
    },
    {
      icon: <Building className="h-8 w-8 text-primary" />,
      title: "For Administrators",
      description: "Manage reports, assign tasks, and monitor resolution progress",
      steps: [
        "Request admin access from your municipality",
        "Complete verification process",
        "Access the admin dashboard",
        "Start managing community reports"
      ],
      buttonText: "Admin Login",
      buttonLink: "/login/admin"
    }
  ];

  const requirements = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Account Requirements",
      items: ["Valid email address", "Basic personal information", "Location permissions (for reporting)"]
    },
    {
      icon: <Camera className="h-6 w-6 text-primary" />,
      title: "Reporting Requirements",
      items: ["Clear photos of the issue", "Accurate location information", "Detailed description", "Category selection"]
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Location Services",
      items: ["GPS enabled device", "Location permissions granted", "Internet connection", "Camera access (for photos)"]
    }
  ];

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Started</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of citizens and administrators working together to create cleaner, safer communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {userTypes.map((userType, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {userType.icon}
                </div>
                <CardTitle className="text-xl">{userType.title}</CardTitle>
                <p className="text-muted-foreground">{userType.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  {userType.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link href={userType.buttonLink}>
                    {userType.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What You'll Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requirements.map((requirement, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {requirement.icon}
                </div>
                <h3 className="font-semibold mb-4">{requirement.title}</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {requirement.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our growing community of proactive citizens and dedicated administrators working together to improve neighborhoods across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login/citizen">
                <User className="mr-2 h-5 w-5" /> Citizen Portal
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login/admin">
                <Building className="mr-2 h-5 w-5" /> Admin Portal
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
