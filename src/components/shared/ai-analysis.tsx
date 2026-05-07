<<<<<<< HEAD
"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import {
  analyzeIssueImage,
  AnalyzeIssueImageOutput,
} from "@/ai/flows/analyze-issue-image-flow";

import { useToast } from "@/hooks/use-toast";

import {
  Camera,
  LoaderCircle,
  AlertCircle,
  X,
  Send,
  ImageUp,
  RotateCcw,
  Sparkles,
  BrainCircuit,
} from "lucide-react";

import {
  IssueType,
  IssuePriority,
} from "@/types/issue";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

interface AiAnalysisComponentProps {
  onClose: () => void;
}

const issueTypes: IssueType[] = [
  "Road",
  "Garbage",
  "Streetlight",
  "Park",
  "Other",
];

const issuePriorities: IssuePriority[] = [
  "Low",
  "Medium",
  "High",
];

const AI_IMAGE_STORAGE_KEY = "aiCapturedImage";

const AiAnalysisComponent: React.FC<
  AiAnalysisComponentProps
> = ({ onClose }) => {
  const [hasCameraPermission, setHasCameraPermission] =
    useState<boolean | null>(null);

  const [capturedImage, setCapturedImage] =
    useState<string | null>(null);

  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeIssueImageOutput | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [isCapturing, setIsCapturing] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [description, setDescription] =
    useState("");

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const mediaStreamRef =
    useRef<MediaStream | null>(null);

  const router = useRouter();

  const { toast } = useToast();

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      mediaStreamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.mediaDevices
        ) {
          const stream =
            await navigator.mediaDevices.getUserMedia(
              {
                video: {
                  facingMode: "environment",
                },
              }
            );

          mediaStreamRef.current = stream;

          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error(err);

        setHasCameraPermission(false);

        setError(
          "Camera access denied. You can still upload an image."
        );
=======

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'; // Use next/image
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { analyzeIssueImage, AnalyzeIssueImageOutput } from '@/ai/flows/analyze-issue-image-flow'; // Ensure correct import
import { useToast } from "@/hooks/use-toast";
import { Camera, LoaderCircle, AlertCircle, X, Send, ImageUp, RotateCcw, Sparkles } from 'lucide-react'; // Added Sparkles
import { IssueType, IssuePriority } from '@/types/issue'; // Import IssueType and Priority
import { useRouter } from 'next/navigation'; // Import useRouter
import { cn } from '@/lib/utils'; // Import cn utility
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Label } from '@/components/ui/label'; // Import Label

interface AiAnalysisComponentProps {
  onClose: () => void; // Callback to close the dialog
}

const issueTypes: IssueType[] = ["Road", "Garbage", "Streetlight", "Park", "Other"];
const issuePriorities: IssuePriority[] = ["Low", "Medium", "High"]; // For validation

const AI_IMAGE_STORAGE_KEY = 'aiCapturedImage'; // Key for sessionStorage

const AiAnalysisComponent: React.FC<AiAnalysisComponentProps> = ({ onClose }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeIssueImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Separate state for analysis loading
  const [isCapturing, setIsCapturing] = useState(false); // Separate state for image capture/processing
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState(''); // State for optional description
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null); // Ref to store the stream
  const router = useRouter();
  const { toast } = useToast();

  // Function to stop the camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null; // Clear the ref
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Ensure video element source is cleared
      }
      console.log("Camera stopped.");
    }
     // Optionally hide camera view or update state if needed
  };

  // Get camera permission on mount
  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        try {
          // Check permission status first without prompting
          const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (permissionStatus.state === 'granted') {
              const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); // Prefer rear camera
              mediaStreamRef.current = stream; // Store the stream
              setHasCameraPermission(true);
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
          } else if (permissionStatus.state === 'prompt') {
              // Only prompt if permission is not yet granted or denied
              const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
              mediaStreamRef.current = stream;
              setHasCameraPermission(true);
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
          } else { // denied state
              console.warn('Camera permission denied.');
              setHasCameraPermission(false);
              toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Camera permission denied. You can still upload an image.',
              });
          }
           // Listen for changes in permission state
          permissionStatus.onchange = () => {
              setHasCameraPermission(permissionStatus.state === 'granted');
              if (permissionStatus.state !== 'granted' && mediaStreamRef.current) {
                  stopCamera(); // Stop camera if permission is revoked
              }
          };

        } catch (err) {
          console.error('Error accessing camera:', err);
          setHasCameraPermission(false);
          setError(`Camera access failed: ${err instanceof Error ? err.message : String(err)}. Please check permissions or try uploading.`);
          toast({
            variant: 'destructive',
            title: 'Camera Error',
            description: 'Could not access camera. Check permissions or try uploading.',
          });
        }
      } else {
        setHasCameraPermission(false);
        setError('Camera not supported on this device or browser.');
         toast({
            variant: 'destructive',
            title: 'Camera Error',
            description: 'Camera not supported.',
          });
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
      }
    };

    getCameraPermission();

<<<<<<< HEAD
    return () => {
      stopCamera();
    };
  }, []);

  const handleAnalysis = async (
    imageDataUri: string
  ) => {
    if (!imageDataUri) return;

    setIsLoading(true);

    setError(null);

    setAnalysisResult(null);

    try {
      const result = await analyzeIssueImage({
        imageDataUri,
        description,
      });

      if (
        !issueTypes.includes(result.detectedType)
      ) {
        result.detectedType = "Other";
      }

      if (
        !issuePriorities.includes(
          result.suggestedPriority
        )
      ) {
        result.suggestedPriority = "Medium";
      }

      setAnalysisResult(result);

      toast({
        title: "AI Analysis Complete",
        description:
          "Issue processed successfully.",
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "AI analysis failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const captureImage = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current
    )
      return;

    setIsCapturing(true);

    const video = videoRef.current;

    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageDataUrl =
      canvas.toDataURL("image/jpeg", 0.9);

    setCapturedImage(imageDataUrl);

    stopCamera();

    await handleAnalysis(imageDataUrl);

    setIsCapturing(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const result = reader.result as string;

      setCapturedImage(result);

      await handleAnalysis(result);
    };

    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUseDetails = () => {
    if (!analysisResult || !capturedImage)
      return;

    sessionStorage.setItem(
      AI_IMAGE_STORAGE_KEY,
      capturedImage
    );

    const query = new URLSearchParams({
      aiType: analysisResult.detectedType,
      aiTitle: analysisResult.suggestedTitle,
      aiDescription:
        analysisResult.suggestedDescription,
      aiPriority:
        analysisResult.suggestedPriority,
    });

    router.push(
      `/citizen/dashboard/report?${query.toString()}`
    );

    onClose();
  };

  const resetState = async () => {
    setCapturedImage(null);

    setAnalysisResult(null);

    setError(null);

    setDescription("");

    setIsLoading(false);

    setIsCapturing(false);

    sessionStorage.removeItem(
      AI_IMAGE_STORAGE_KEY
    );

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: "environment",
            },
          }
        );

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setHasCameraPermission(true);
    } catch {
      setHasCameraPermission(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500/10 blur-3xl rounded-full" />
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />

      {error && (
        <Alert
          variant="destructive"
          className="rounded-2xl"
        >
          <AlertCircle className="h-4 w-4" />

          <AlertTitle>Error</AlertTitle>

          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!capturedImage ? (
        <Card className="overflow-hidden rounded-[32px] border border-border/50 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/[0.03]">
          <CardContent className="p-6 space-y-6">
            {/* HEADER */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  AI Civic Scanner
                </h2>

                <p className="text-muted-foreground">
                  Capture infrastructure issues
                  with multimodal AI analysis.
                </p>
              </div>
            </div>

            {/* CAMERA */}
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-black shadow-2xl">
              {hasCameraPermission ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full aspect-video object-cover"
                  />

                  {/* AI STATUS */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/40 backdrop-blur-xl px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                    <span className="text-xs font-medium text-white">
                      AI Vision Active
                    </span>
                  </div>
                </>
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center text-center text-white p-8">
                  <Camera className="h-16 w-16 opacity-60 mb-4" />

                  <h3 className="text-xl font-bold mb-2">
                    Camera Unavailable
                  </h3>

                  <p className="text-white/70 text-sm">
                    Upload an image instead.
                  </p>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-3">
              <Label>
                Optional Context Description
              </Label>

              <Textarea
                placeholder="Describe the issue briefly for smarter AI prioritization..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="rounded-2xl border-border/50 bg-background/60 resize-none"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={captureImage}
                disabled={
                  !hasCameraPermission ||
                  isCapturing ||
                  isLoading
                }
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-primary/20"
              >
                {isCapturing ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}

                Capture Issue
              </Button>

              <Button
                variant="outline"
                onClick={triggerUpload}
                className="flex-1 h-12 rounded-2xl border-border/50 bg-background/60 backdrop-blur-xl"
              >
                <ImageUp className="mr-2 h-4 w-4" />

                Upload Image
=======
    // Cleanup function to stop the video stream when component unmounts
    return () => {
      stopCamera();
    };
  }, [toast]); // Add toast as dependency

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && !isCapturing) {
        setIsCapturing(true); // Indicate capture/processing started
        setError(null); // Clear previous errors
        setAnalysisResult(null); // Reset previous analysis

        const video = videoRef.current;
        const canvas = canvasRef.current;
        // Set canvas size to match video feed for better quality
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        if (context) {
            try {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                 // Use JPEG with quality setting for potentially smaller size
                const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Quality 0.9

                if (!imageDataUrl || imageDataUrl === 'data:,') {
                   throw new Error("Canvas generated an empty image data URL.");
                }

                // Check image size - optional, but good for debugging
                const imageSizeInBytes = Math.round((imageDataUrl.length * (3/4)) - (imageDataUrl.endsWith('==') ? 2 : (imageDataUrl.endsWith('=') ? 1 : 0)));
                console.log(`Captured image size: ${Math.round(imageSizeInBytes / 1024)} KB`);

                setCapturedImage(imageDataUrl);
                stopCamera(); // Stop camera after capture
                handleAnalysis(imageDataUrl); // Trigger analysis immediately
            } catch (captureError) {
                 console.error("Error during image capture or processing:", captureError);
                 setError(`Capture failed: ${captureError instanceof Error ? captureError.message : String(captureError)}`);
                 toast({ variant: 'destructive', title: 'Capture Failed', description: 'Could not process image from camera.' });
            }
        } else {
             console.error("Could not get 2D context from canvas.");
             setError("Could not get canvas context to capture image.");
             toast({ variant: 'destructive', title: 'Capture Failed', description: 'Could not get canvas context.' });
        }
        setIsCapturing(false); // Indicate capture/processing finished
    } else {
        console.warn("Capture attempt failed: Video ref, canvas ref, or isCapturing state issue.");
        if (!videoRef.current) setError("Camera feed not available.");
        else if (!canvasRef.current) setError("Canvas element not ready.");
        else if (isCapturing) setError("Capture already in progress.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isCapturing) {
      setIsCapturing(true); // Use capturing state for file reading as well
      setError(null);
      setAnalysisResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

         if (!base64String || base64String === 'data:,') {
            setError('Failed to read the uploaded file correctly.');
            toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read image data from file.' });
            setIsCapturing(false);
            return;
        }

        // Check image size
         const imageSizeInBytes = Math.round((base64String.length * (3/4)) - (base64String.endsWith('==') ? 2 : (base64String.endsWith('=') ? 1 : 0)));
         console.log(`Uploaded image size: ${Math.round(imageSizeInBytes / 1024)} KB`);


        setCapturedImage(base64String);
        handleAnalysis(base64String); // Trigger analysis immediately
        setIsCapturing(false);
      };
      reader.onerror = (err) => {
         console.error("FileReader error:", err);
        setError('Failed to read the uploaded file.');
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: 'Could not read the selected file.',
        });
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
     // Reset file input to allow selecting the same file again
     if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle AI Analysis
  const handleAnalysis = async (imageDataUri: string) => {
    if (!imageDataUri || imageDataUri === 'data:,') {
      setError('No valid image available for analysis.');
      console.error('handleAnalysis called with invalid imageDataUri');
      return;
    }
    setIsLoading(true); // Start analysis loading
    setError(null);
    setAnalysisResult(null);
    console.log("Starting AI analysis..."); // Log start

    try {
      // Pass both image data URI and the current description state
      const result = await analyzeIssueImage({ imageDataUri, description });
      console.log("AI Analysis result:", result); // Log result

      // Validate received data
      if (!result || typeof result !== 'object') {
          throw new Error("Invalid response received from AI analysis.");
      }

      if (!issueTypes.includes(result.detectedType)) {
           console.warn(`AI detected type "${result.detectedType}" is invalid. Defaulting to "Other".`);
           result.detectedType = "Other";
      }
       if (!issuePriorities.includes(result.suggestedPriority)) {
           console.warn(`AI suggested priority "${result.suggestedPriority}" is invalid. Defaulting to Medium.`);
           result.suggestedPriority = "Medium";
       }

      setAnalysisResult(result); // Store the full result including priority
      toast({
        title: 'Analysis Complete',
        description: `Detected: ${result.detectedType}, Priority: ${result.suggestedPriority}`,
      });
    } catch (err) {
      console.error('AI analysis failed:', err); // Log the full error
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      // Check for specific API key error message
      if (errorMessage.includes("API key not valid")) {
           setError("Analysis failed: Invalid API Key. Please check your GOOGLE_GENAI_API_KEY environment variable.");
           toast({ variant: 'destructive', title: 'API Key Error', description: "Invalid Google AI API Key.", duration: 10000 });
      } else {
           setError(`Analysis failed: ${errorMessage}`);
           toast({ variant: 'destructive', title: 'Analysis Failed', description: errorMessage, duration: 10000 });
      }
    } finally {
      setIsLoading(false); // Stop analysis loading
      console.log("AI analysis finished."); // Log finish
    }
  };

   // Navigate to report page with AI results
   const handleUseDetails = () => {
        if (!analysisResult || !capturedImage) {
            console.error("Attempted to use details without analysis result or captured image.");
            setError("Cannot proceed without a successful analysis and an image.");
            return;
        }

        try {
             // Store the large image Data URI in sessionStorage
             sessionStorage.setItem(AI_IMAGE_STORAGE_KEY, capturedImage);
             console.log("Image stored in sessionStorage");
        } catch (e) {
            console.error("Failed to store image in sessionStorage:", e);
            setError("Could not prepare image for the report form. Session storage might be full or disabled.");
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save image data for the next step.',
            });
            return; // Stop navigation if storage fails
        }

        // Construct the query parameters including the suggested priority
        const query = new URLSearchParams({
            aiType: analysisResult.detectedType,
            aiTitle: analysisResult.suggestedTitle,
            aiDescription: analysisResult.suggestedDescription,
            aiPriority: analysisResult.suggestedPriority, // Add priority to query params
            // DO NOT include aiImage: capturedImage (it's in sessionStorage)
        });

        // Navigate to the report page with the query parameters
        const reportUrl = `/citizen/dashboard/report?${query.toString()}`;
        console.log("Navigating to:", reportUrl);
        try {
           router.push(reportUrl);
           onClose(); // Close the dialog after initiating navigation
        } catch(navigationError) {
            console.error("Error during navigation:", navigationError);
            setError("Failed to navigate to the report page.");
             toast({ variant: 'destructive', title: 'Navigation Error', description: 'Could not open the report form.' });
        }
    };

  // Reset state to start over
  const resetState = async () => {
      setCapturedImage(null);
      setAnalysisResult(null);
      setError(null);
      setIsLoading(false);
      setIsCapturing(false);
      setDescription(''); // Reset description as well
      console.log("State reset."); // Log reset

      // Clear stored image from session storage if it exists
       try {
           sessionStorage.removeItem(AI_IMAGE_STORAGE_KEY);
           console.log("Cleared image from sessionStorage");
       } catch (e) {
           console.error("Could not remove image from sessionStorage:", e);
       }


      // Restart camera if permission was granted and it's not already running
      if (hasCameraPermission && !mediaStreamRef.current) {
          console.log("Attempting to restart camera...");
          if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
             try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                 mediaStreamRef.current = stream;
                 if (videoRef.current) {
                     videoRef.current.srcObject = stream;
                     console.log("Camera stream restarted.");
                 } else {
                    console.warn("Video ref not available on camera restart attempt.");
                 }
             } catch (err) {
                 console.error("Error restarting camera:", err);
                 setError('Could not restart camera.');
                 setHasCameraPermission(false); // Assume permission issue if restart fails
                 toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not restart camera.' });
             }
          }
      } else if (hasCameraPermission && mediaStreamRef.current) {
          console.log("Camera already running.");
      } else if (!hasCameraPermission) {
          console.log("Camera permission not granted, cannot restart.");
      }

      // Reset file input value as well
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Hidden canvas */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" // Accept common image types
        style={{ display: 'none' }}
      />

      {/* Display general errors prominently */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
           <Button variant="outline" size="sm" onClick={resetState} className="mt-2">Try Again</Button>
        </Alert>
      )}

      {!capturedImage && !error ? ( // Only show camera/upload if no image and no critical error
        // Camera View or Upload Prompt
        <Card>
          <CardContent className="p-4 space-y-4">
            {hasCameraPermission === null && <Skeleton className="w-full aspect-video rounded-md" />}

            {/* Always render video element but hide if no permission or stream inactive */}
             <video
               ref={videoRef}
               className={cn(
                    "w-full aspect-video rounded-md bg-black",
                    (!hasCameraPermission || !mediaStreamRef.current || hasCameraPermission === false) && "hidden" // Hide if no permission or no active stream
               )}
               autoPlay
               muted
               playsInline // Important for mobile
             />

             {/* Show placeholder if camera permission denied or not yet determined */}
              {hasCameraPermission === false && !error && ( // Don't show placeholder if there's a different error
                   <div className="w-full aspect-video rounded-md bg-muted flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                       <Camera className="h-12 w-12 opacity-50 mb-2" />
                       <p className="text-sm">Camera access denied or unavailable.</p>
                       <p className="text-xs">You can upload an image instead.</p>
                   </div>
              )}


            <div className="flex justify-center gap-4">
              <Button onClick={captureImage} disabled={!hasCameraPermission || !mediaStreamRef.current || isLoading || isCapturing}>
                 {isCapturing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                 {isCapturing ? 'Processing...' : 'Capture'}
              </Button>
              <Button variant="outline" onClick={triggerFileUpload} disabled={isLoading || isCapturing}>
                 <ImageUp className="mr-2 h-4 w-4" /> Upload
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
              </Button>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD
      ) : (
        <Card className="overflow-hidden rounded-[32px] border border-border/50 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/[0.03]">
          <CardContent className="p-6 space-y-6">
            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-black shadow-2xl">
              <Image
                src={capturedImage}
                alt="Captured issue"
                width={1200}
                height={800}
                unoptimized
                className="w-full max-h-[420px] object-contain"
              />
            </div>

            {/* LOADING */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-black mb-2">
                  AI Processing in Progress
                </h3>

                <p className="text-muted-foreground max-w-sm">
                  Analyzing infrastructure
                  patterns, contextual risk,
                  and severity indicators...
                </p>
              </div>
            )}

            {/* RESULTS */}
            {analysisResult && !isLoading && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="space-y-5 border-t border-border/50 pt-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black">
                      AI Analysis Complete
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Multimodal civic
                      intelligence processed
                      successfully
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
                    <div className="text-xs uppercase text-muted-foreground mb-2">
                      Issue Type
                    </div>

                    <div className="text-2xl font-black">
                      {
                        analysisResult.detectedType
                      }
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
                    <div className="text-xs uppercase text-muted-foreground mb-2">
                      Priority
                    </div>

                    <div className="text-2xl font-black text-orange-500">
                      {
                        analysisResult.suggestedPriority
                      }
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                  <div className="text-xs uppercase text-primary mb-2">
                    AI Summary
                  </div>

                  <p className="leading-relaxed text-sm">
                    {
                      analysisResult.suggestedDescription
                    }
                  </p>
                </div>

                <Button
                  onClick={handleUseDetails}
                  className="w-full h-14 rounded-2xl text-base font-semibold bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-primary/20"
                >
                  <Send className="mr-2 h-5 w-5" />

                  Continue to Smart Report
                </Button>
              </motion.div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                variant="outline"
                onClick={resetState}
                className="flex-1 h-12 rounded-2xl border-border/50 bg-background/60 backdrop-blur-xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" />

                Start Over
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="flex-1 h-12 rounded-2xl border-border/50 bg-background/60 backdrop-blur-xl"
              >
                <X className="mr-2 h-4 w-4" />

                Close
=======
      ) : capturedImage && !error ? ( // Only show analysis view if image captured and no critical error
        // Analysis View
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Image Preview */}
            <div className="relative w-full max-h-[40vh] rounded-md overflow-hidden flex justify-center items-center bg-muted border">
                 <Image
                   src={capturedImage}
                   alt="Captured issue"
                   width={400} // Provide width/height or use layout="fill" with sized parent
                   height={300}
                   className="object-contain max-h-[300px]" // Ensure image fits within bounds and max height
                   unoptimized // Use this if the src is a data URI to avoid Next.js optimization attempts
                 />
            </div>

             {/* Optional Description Input */}
            <div className="space-y-2">
                <Label htmlFor="ai-description">Add Description (Optional, helps AI assess priority)</Label>
                <Textarea
                    id="ai-description"
                    placeholder="e.g., Pothole is deep and cars are swerving."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    disabled={isLoading} // Disable while analyzing
                />
                {/* Button to re-trigger analysis with updated description */}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAnalysis(capturedImage)}
                    disabled={isLoading || !capturedImage}
                    className="flex items-center gap-1"
                >
                     <Sparkles className="h-4 w-4 text-primary"/> Re-Analyze with Description
                 </Button>
            </div>


            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center justify-center space-x-2 text-muted-foreground pt-4">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <span>Analyzing image...</span>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResult && !isLoading && (
              <div className="space-y-3 text-sm border-t pt-4 mt-4">
                 <h3 className="font-semibold text-base text-foreground">AI Analysis Results:</h3>
                 <p><strong>Detected Type:</strong> {analysisResult.detectedType}</p>
                 <p><strong>Suggested Priority:</strong> {analysisResult.suggestedPriority}</p>
                 <p><strong>Suggested Title:</strong> {analysisResult.suggestedTitle}</p>
                 <p><strong>Suggested Description:</strong> {analysisResult.suggestedDescription}</p>
                  {/* Button to Proceed */}
                  <Button onClick={handleUseDetails} className="w-full mt-2">
                     <Send className="mr-2 h-4 w-4" /> Use Details & Report Issue
                  </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t mt-4">
              {/* Start Over Button */}
              <Button variant="outline" onClick={resetState} disabled={isLoading || isCapturing}>
                 <RotateCcw className="mr-2 h-4 w-4" /> Start Over
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
              </Button>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD
      )}
    </div>
  );
}
=======
      ) : null } {/* Render nothing if image is captured but there's an error */}

      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <Button variant="ghost" onClick={() => { stopCamera(); onClose(); }}>
          <X className="mr-2 h-4 w-4" /> Close
        </Button>
      </div>
    </div>
  );
};

export default AiAnalysisComponent;

>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
