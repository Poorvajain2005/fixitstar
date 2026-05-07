"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

import {
  Camera,
  MapPin,
  Upload,
  LoaderCircle,
  AlertCircle,
  Sparkles,
  ImageUp,
  ShieldAlert,
  BrainCircuit,
  Radar,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import {
  getCurrentLocationInfo,
  LocationInfo,
} from "@/services/geolocation";

import { Issue, IssuePriority, IssueType } from "@/types/issue";
import { addIssueToDb, calculateDueDate } from "@/lib/mock-db";

import {
  analyzeIssueImage,
  AnalyzeIssueImageOutput,
} from "@/ai/flows/analyze-issue-image-flow";

const issueTypes: IssueType[] = [
  "Road",
  "Garbage",
  "Streetlight",
  "Park",
  "Other",
];

const priorities: IssuePriority[] = ["Low", "Medium", "High"];
const AI_IMAGE_STORAGE_KEY = "aiCapturedImage";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be 500 characters or less"),
  type: z.enum(issueTypes, { required_error: "Please select an issue type." }),
  priority: z.enum(priorities, { required_error: "Please select a priority level." }),
  location: z.object({
    latitude: z.number().refine((val) => val !== 0, "Location must be acquired."),
    longitude: z.number().refine((val) => val !== 0, "Location must be acquired."),
    address: z.string().optional(),
  }),
  image: z.instanceof(File).optional(),
  imageDataUri: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ReportIssuePage() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AnalyzeIssueImageOutput | null>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [currentPriority, setCurrentPriority] = useState<IssuePriority>("Medium");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const aiType = searchParams?.get("aiType") as IssueType | null;
  const aiTitle = searchParams?.get("aiTitle");
  const aiDescription = searchParams?.get("aiDescription");
  const aiPriority = searchParams?.get("aiPriority") as IssuePriority | null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: aiTitle || "",
      description: aiDescription || "",
      type: aiType || undefined,
      priority: aiPriority || "Medium",
      location: { latitude: 0, longitude: 0, address: undefined },
      imageDataUri: undefined,
    },
  });

  const watchPriority = form.watch("priority");

  // Sync priority updates to control descriptions dynamically
  useEffect(() => {
    if (watchPriority) {
      setCurrentPriority(watchPriority);
    }
  }, [watchPriority]);

  // Handle retrieval of images from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(AI_IMAGE_STORAGE_KEY);
        if (stored) {
          console.log("Retrieved image from sessionStorage");
          setImagePreview(stored);
          form.setValue("imageDataUri", stored);
          fetch(stored)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File(
                [blob],
                `ai-capture-${Date.now()}.jpg`,
                { type: "image/jpeg" }
              );
              form.setValue("image", file);
            });
        }
      } catch (err) {
        console.error("Failed to process sessionStorage image preview", err);
      }
    }
  }, [form]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);
    form.clearErrors("location.latitude");
    form.clearErrors("location.longitude");

    try {
      const locationInfo = await getCurrentLocationInfo();
      setLocation(locationInfo);

      form.setValue("location.latitude", locationInfo.latitude, { shouldValidate: true });
      form.setValue("location.longitude", locationInfo.longitude, { shouldValidate: true });
      form.setValue("location.address", locationInfo.address || "");

      toast({
        title: "Location Acquired",
        description: locationInfo.address || "GPS coordinates captured.",
      });
    } catch (err: any) {
      setLocationError(err.message || "Failed to obtain location data.");
      form.setError("location.latitude", { type: "manual", message: "Failed to get location." });
      form.setError("location.longitude", { type: "manual", message: "Failed to get location." });
      toast({
        title: "Location Error",
        description: err.message || "Failed to access your device location services.",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Run on mount to grab automatic location if missing
  useEffect(() => {
    if (
      form.getValues("location.latitude") === 0 &&
      form.getValues("location.longitude") === 0
    ) {
      handleGetLocation();
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    form.setValue("image", file);
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      form.setValue("imageDataUri", result);
      setAiAnalysisResult(null);
      setAnalysisError(null);
      handleAiAnalysis(result);
    };

    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected image file.",
      });
    };

    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleShowCamera = async () => {
    if (showCamera) {
      stopCamera();
      return;
    }
    setCameraError(null);

    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      setShowCamera(true);
      if (hasCameraPermission === null || hasCameraPermission === true) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          mediaStreamRef.current = stream;
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access failed:", err);
          setHasCameraPermission(false);
          setCameraError("Camera access denied or camera not found. Please enable permissions.");
          toast({
            variant: "destructive",
            title: "Camera Error",
            description: "Could not access hardware camera. Enable permissions or upload instead.",
          });
          setShowCamera(false);
        }
      } else {
        setCameraError("Camera access denied. Please enable permissions in browser settings.");
        setShowCamera(false);
      }
    } else {
      setCameraError("Camera capture features are not supported on this browser.");
      setShowCamera(false);
    }
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current || isTakingPhoto) return;

    setIsTakingPhoto(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImagePreview(imageDataUrl);
    form.setValue("imageDataUri", imageDataUrl);

    fetch(imageDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        form.setValue("image", file);
      });

    setAiAnalysisResult(null);
    setAnalysisError(null);
    stopCamera();
    handleAiAnalysis(imageDataUrl);

    setTimeout(() => {
      setIsTakingPhoto(false);
    }, 100);
  };

  const handleAiAnalysis = async (imageDataUri: string) => {
    if (!imageDataUri) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiAnalysisResult(null);

    const currentDescription = form.getValues("description");

    try {
      const result = await analyzeIssueImage({
        imageDataUri,
        description: currentDescription,
      });

      if (!issueTypes.includes(result.detectedType)) {
        console.warn(`AI detected type "${result.detectedType}" is invalid. Defaulting to Other.`);
        result.detectedType = "Other";
      }
      if (!priorities.includes(result.suggestedPriority)) {
        console.warn(`AI suggested priority "${result.suggestedPriority}" is invalid. Defaulting to Medium.`);
        result.suggestedPriority = "Medium";
      }

      setAiAnalysisResult(result);

      if (!form.getValues("type") || form.getValues("type") === aiType) {
        form.setValue("type", result.detectedType);
      }
      if (!form.getValues("title") || form.getValues("title") === aiTitle) {
        form.setValue("title", result.suggestedTitle);
      }
      if (
        !form.getValues("description") ||
        form.getValues("description") === aiDescription
      ) {
        form.setValue("description", result.suggestedDescription);
      }

      form.setValue("priority", result.suggestedPriority);
      setCurrentPriority(result.suggestedPriority);

      toast({
        title: "AI Analysis Complete",
        description: `Suggested Type: ${result.detectedType}, Priority: ${result.suggestedPriority}`,
      });
    } catch (err: any) {
      console.error("AI analysis failed:", err);
      const errMsg = err?.message || "An unknown error occurred during AI computer vision analysis.";
      setAnalysisError(errMsg);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: errMsg,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityDescription = (priority: IssuePriority): string => {
    switch (priority) {
      case "High":
        return "High: Critical issue affecting safety or essential services. Expected resolution within 3 days.";
      case "Medium":
        return "Medium: Standard issue causing inconvenience. Expected resolution within 5 days.";
      case "Low":
        return "Low: Minor issue or cosmetic problem. Expected resolution within 7 days.";
      default:
        return "Select the urgency of this issue.";
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const submissionLocation = data.location;
    if (submissionLocation.latitude === 0 && submissionLocation.longitude === 0) {
      toast({
        title: "Submission Failed",
        description: "Your physical GPS coordinates are required to dispatch civic resolution workflows.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const reporterId =
        typeof window !== "undefined"
          ? localStorage.getItem("citizenUserEmail") || "citizen123"
          : "citizen123";

      const reportedAt = Date.now();
      const dueDate = calculateDueDate(reportedAt, data.priority);

      const issue: Issue = {
        id: `issue${Date.now()}${Math.random().toString(16).slice(2)}`,
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        location: submissionLocation,
        status: "Pending",
        reportedById: reporterId,
        reportedAt: reportedAt,
        dueDate: dueDate,
        imageUrl: data.imageDataUri,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      addIssueToDb(issue);

      // Reset form variables
      form.reset({
        title: "",
        description: "",
        type: undefined,
        priority: "Medium",
        location: { latitude: 0, longitude: 0, address: undefined },
        imageDataUri: undefined,
        image: undefined,
      });

      setImagePreview(null);
      setAiAnalysisResult(null);
      setLocation(null);
      setLocationError(null);
      setAnalysisError(null);
      setCurrentPriority("Medium");

      try {
        sessionStorage.removeItem(AI_IMAGE_STORAGE_KEY);
      } catch (e) {
        console.error("Could not remove item from sessionStorage", e);
      }

      let dueDateString = "N/A";
      if (dueDate) {
        try {
          dueDateString = new Date(dueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch (e) {
          console.error("Error formatting due date value", e);
        }
      }

      toast({
        title: "Issue Reported Successfully!",
        description: `Your report "${issue.title}" is officially registered. Expected resolution by ${dueDateString}.`,
        duration: 5000,
      });

      router.push("/citizen/dashboard");
    } catch {
      toast({
        title: "Submission Failed",
        description: "Could not submit issue report. Please check network connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-10">
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/10 blur-3xl rounded-full" />
      </div>

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Badge className="rounded-full px-4 py-1 bg-primary/10 text-primary border border-primary/20">
            AI Civic Intelligence
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 border-border/50 bg-background/40 backdrop-blur-xl"
          >
            Real-Time Reporting
          </Badge>
        </div>

        <div className="flex gap-5 items-start">
          <div className="w-16 h-16 shrink-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-border/50 flex items-center justify-center">
            <Radar className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Smart Civic{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Reporting
              </span>
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-3xl">
              AI-assisted civic issue detection with computer vision analysis, severity
              intelligence, geolocation tagging, and scheduled resolution tracking.
            </p>
          </div>
        </div>
      </motion.div>

      {/* COMPACT MAIN CONTAINER CARD */}
      <Card className="relative overflow-hidden rounded-[32px] border border-border/50 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/[0.03]">
        <CardContent className="relative z-10 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* IMAGE SECTOR */}
              <FormField
                control={form.control}
                name="imageDataUri"
                render={({ fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      Upload Civic Evidence (Recommended for AI Detection)
                    </FormLabel>
                    <FormControl>
                      <Card className="overflow-hidden rounded-[28px] border-dashed border-2 border-primary/20 hover:border-primary/50 transition-colors bg-gradient-to-br from-primary/5 to-violet-500/5 backdrop-blur-xl">
                        <CardContent className="p-6 text-center">
                          {imagePreview ? (
                            <div className="space-y-5">
                              <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-black shadow-inner">
                                <Image
                                  src={imagePreview}
                                  alt="Captured civic issue"
                                  width={1200}
                                  height={800}
                                  unoptimized
                                  className="w-full max-h-[380px] object-contain"
                                />
                                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/40 backdrop-blur-xl px-4 py-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-xs font-medium text-white">
                                    AI Vision Ready
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap justify-center gap-3">
                                <Button
                                  type="button"
                                  onClick={triggerUpload}
                                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600"
                                  disabled={isAnalyzing || isTakingPhoto}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Change Image
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleShowCamera}
                                  className="rounded-2xl border-border/50 bg-background/60"
                                  disabled={isAnalyzing || isTakingPhoto}
                                >
                                  <Camera className="mr-2 h-4 w-4" />
                                  Retake
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="rounded-2xl"
                                  onClick={() => {
                                    setImagePreview(null);
                                    form.setValue("image", undefined);
                                    form.setValue("imageDataUri", undefined);
                                    setAiAnalysisResult(null);
                                    stopCamera();
                                  }}
                                  disabled={isAnalyzing || isTakingPhoto}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {showCamera ? (
                                <div className="space-y-4">
                                  <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-black">
                                    <video
                                      ref={videoRef}
                                      autoPlay
                                      muted
                                      playsInline
                                      className="w-full aspect-video object-cover"
                                    />
                                    {isTakingPhoto && (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                                        <LoaderCircle className="h-8 w-8 animate-spin text-white mb-2" />
                                        <span className="text-white text-sm">Processing...</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex justify-center gap-3">
                                    <Button
                                      type="button"
                                      onClick={handleTakePhoto}
                                      className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600"
                                      disabled={isTakingPhoto || isAnalyzing}
                                    >
                                      <Camera className="mr-2 h-4 w-4" />
                                      Take Photo
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={stopCamera}
                                      className="rounded-2xl"
                                      disabled={isTakingPhoto || isAnalyzing}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-center py-12">
                                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-6">
                                    <BrainCircuit className="h-10 w-10 text-primary" />
                                  </div>
                                  <h3 className="text-xl font-black mb-2">
                                    Upload Civic Evidence
                                  </h3>
                                  <p className="text-muted-foreground text-sm max-w-md mb-8">
                                    Capture an image of the pothole, trash dump, streetlights or issue to
                                    leverage smart AI classification modeling.
                                  </p>

                                  <div className="flex flex-wrap gap-4 justify-center">
                                    <Button
                                      type="button"
                                      onClick={triggerUpload}
                                      className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-primary/10"
                                      disabled={isAnalyzing}
                                    >
                                      <Upload className="mr-2 h-4 w-4" />
                                      Upload Image
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={handleShowCamera}
                                      className="h-12 rounded-2xl border-border/50 bg-background/60"
                                      disabled={isAnalyzing}
                                    >
                                      <Camera className="mr-2 h-4 w-4" />
                                      Use Device Camera
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {cameraError && (
                                <Alert variant="destructive" className="rounded-2xl text-left max-w-md mx-auto">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Camera Access Blocked</AlertTitle>
                                  <AlertDescription>{cameraError}</AlertDescription>
                                </Alert>
                              )}

                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* MANUAL AI ANALYSIS RE-TRIGGER */}
              {imagePreview && !aiAnalysisResult && !isAnalyzing && !analysisError && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    form.getValues("imageDataUri") &&
                    handleAiAnalysis(form.getValues("imageDataUri")!)
                  }
                  className="rounded-xl flex items-center gap-1.5 border-primary/20 hover:bg-primary/5 text-primary"
                >
                  <Sparkles className="h-4 w-4" /> Analyze with AI
                </Button>
              )}

              {/* AI WORKFLOW LOADER */}
              {isAnalyzing && (
                <div className="flex items-center text-muted-foreground text-sm p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-primary" />
                  Analyzing image context and optimizing suggestions...
                </div>
              )}

              {/* COMPREHENSIVE AI SUCESS CHIPS */}
              {aiAnalysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[28px] border border-emerald-500/10 bg-emerald-500/[0.04] p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-foreground">AI Automation Succeeded</h3>
                      <p className="text-xs text-muted-foreground">
                        Classified issue elements and updated forms. Review fields below.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-emerald-500/15 bg-background/50 p-4">
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                        AI Detected Type
                      </div>
                      <div className="text-lg font-black tracking-tight">
                        {aiAnalysisResult.detectedType}
                      </div>
                    </div>
                    <div className="rounded-xl border border-emerald-500/15 bg-background/50 p-4">
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                        Urgency Level
                      </div>
                      <div className="text-lg font-black text-orange-500 tracking-tight">
                        {aiAnalysisResult.suggestedPriority}
                      </div>
                    </div>
                    <div className="rounded-xl border border-emerald-500/15 bg-background/50 p-4">
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                        Proposed Slug
                      </div>
                      <div className="text-sm font-bold line-clamp-1">
                        {aiAnalysisResult.suggestedTitle}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {analysisError && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Image Extraction Failed</AlertTitle>
                  <AlertDescription>{analysisError}</AlertDescription>
                </Alert>
              )}

              {/* FORM SYSTEM FIELDS */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-background/60">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {issueTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Priority *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-background/60">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              <span className="flex items-center gap-2">
                                <ShieldAlert
                                  className={`h-4 w-4 ${
                                    priority === "High"
                                      ? "text-destructive"
                                      : priority === "Medium"
                                      ? "text-orange-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                                {priority}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getPriorityDescription(currentPriority)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Issue Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Deep pothole at Center Street crossing"
                        className="h-12 rounded-2xl border-border/50 bg-background/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide deep architectural details. Describe scope, size, or hazards."
                        rows={4}
                        className="rounded-2xl border-border/50 bg-background/60 resize-none"
                        {...field}
                        onBlur={() => {
                          if (
                            imagePreview &&
                            !isAnalyzing &&
                            form.getValues("imageDataUri") &&
                            form.getValues("description") !== aiDescription
                          ) {
                            handleAiAnalysis(form.getValues("imageDataUri")!);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* INTEGRATED GEOLOCATION SERVICES */}
              <FormField
                control={form.control}
                name="location.latitude"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">Active Geolocation Tag *</FormLabel>
                    <Card className="rounded-[28px] border border-border/50 bg-background/40 backdrop-blur-xl">
                      <CardContent className="p-6 space-y-4">
                        {isGettingLocation && (
                          <div className="flex items-center text-muted-foreground text-sm">
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-primary" />{" "}
                            Pinging GPS Satellites...
                          </div>
                        )}

                        {locationError && !isGettingLocation && (
                          <Alert variant="destructive" className="rounded-2xl">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>GPS Error</AlertTitle>
                            <AlertDescription className="text-xs">{locationError}</AlertDescription>
                          </Alert>
                        )}

                        {location && !isGettingLocation && (
                          <div className="flex items-start text-sm text-foreground bg-background/50 p-4 rounded-2xl border border-border">
                            <MapPin className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-base">
                                {location.address || "Resolving coordinate address..."}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Latitude: {location.latitude.toFixed(5)} · Longitude:{" "}
                                {location.longitude.toFixed(5)}
                              </p>
                            </div>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGetLocation}
                          disabled={isGettingLocation}
                          className="rounded-2xl h-11"
                        >
                          {isGettingLocation ? (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                          )}
                          {location ? "Refresh Current Geolocation" : "Acquire Current GPS Coordinates"}
                        </Button>
                      </CardContent>
                    </Card>
                    <FormDescription>
                      Civic issues are automatically mapped on civic dispatch grids.
                    </FormDescription>
                    {(form.formState.errors.location?.latitude ||
                      form.formState.errors.location?.longitude) && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        GPS coords required. Click button above to verify device location.
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* PRIMARY SUBMISSION CTA */}
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-base font-semibold bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-primary/20"
                disabled={isSubmitting || isGettingLocation || isAnalyzing || isTakingPhoto}
              >
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? "Dispatching Report..." : "Submit Smart Civic Report"}
              </Button>

              <canvas ref={canvasRef} className="hidden" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}