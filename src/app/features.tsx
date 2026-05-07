'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Users, MapPin, Shield, BarChart3, Bell } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Fast & Easy Reporting",
      description: "Report issues in seconds with our intuitive interface. Just snap a photo, add a description, and submit - no paperwork required."
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: "Real-Time Notifications",
      description: "Stay informed with instant updates on your reports. Get notified when your issue is being reviewed, in progress, or resolved."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Collaboration",
      description: "See what others are reporting in your area and collaborate on community initiatives to make your neighborhood better."
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Precise Location Tracking",
      description: "Pinpoint exact locations with GPS technology. Help authorities find and resolve issues faster with accurate coordinates."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security. Report issues anonymously or with your identity protected."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Data Analytics Dashboard",
      description: "Access insights on community issues, resolution times, and trends. Help your local government make data-driven decisions."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how FixIt empowers citizens and authorities to work together for cleaner, safer communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Choose FixIt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Round-the-clock reporting and monitoring</p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Average resolution rate across communities</p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">Issues resolved nationwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
