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

import {
  Issue,
  IssuePriority,
  IssueType,
} from "@/types/issue";

import {
  addIssueToDb,
  calculateDueDate,
} from "@/lib/mock-db";

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

const priorities: IssuePriority[] = [
  "Low",
  "Medium",
  "High",
];

const AI_IMAGE_STORAGE_KEY =
  "aiCapturedImage";

const formSchema = z.object({
  title: z
    .string()
    .min(5)
    .max(100),

  description: z
    .string()
    .min(10)
    .max(500),

  type: z.enum(issueTypes),

  priority: z.enum(priorities),

  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),

  image: z.instanceof(File).optional(),

  imageDataUri: z.string().optional(),
});

type FormData = z.infer<
  typeof formSchema
>;

export default function ReportIssuePage() {
  const [location, setLocation] =
    useState<LocationInfo | null>(null);

  const [locationError, setLocationError] =
    useState<string | null>(null);

  const [isGettingLocation, setIsGettingLocation] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [analysisError, setAnalysisError] =
    useState<string | null>(null);

  const [
    aiAnalysisResult,
    setAiAnalysisResult,
  ] =
    useState<AnalyzeIssueImageOutput | null>(
      null
    );

  const [showCamera, setShowCamera] =
    useState(false);

  const [
    hasCameraPermission,
    setHasCameraPermission,
  ] = useState<boolean | null>(null);

  const [cameraError, setCameraError] =
    useState<string | null>(null);

  const [isTakingPhoto, setIsTakingPhoto] =
    useState(false);

  const [currentPriority, setCurrentPriority] =
    useState<IssuePriority>("Medium");

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const mediaStreamRef =
    useRef<MediaStream | null>(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const { toast } = useToast();

  const aiType =
    searchParams?.get(
      "aiType"
    ) as IssueType | null;

  const aiTitle =
    searchParams?.get("aiTitle");

  const aiDescription =
    searchParams?.get(
      "aiDescription"
    );

  const aiPriority =
    searchParams?.get(
      "aiPriority"
    ) as IssuePriority | null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      title: aiTitle || "",

      description:
        aiDescription || "",

      type: aiType || undefined,

      priority:
        aiPriority || "Medium",

      location: {
        latitude: 0,
        longitude: 0,
        address: undefined,
      },

      imageDataUri: undefined,
    },
  });

  useEffect(() => {
    const subscription = form.watch(
      (value, { name }) => {
        if (
          name === "priority" &&
          value.priority
        ) {
          setCurrentPriority(
            value.priority
          );
        }
      }
    );

    return () =>
      subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const stored =
      sessionStorage.getItem(
        AI_IMAGE_STORAGE_KEY
      );

    if (stored) {
      setImagePreview(stored);

      form.setValue(
        "imageDataUri",
        stored
      );
    }
  }, [form]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      mediaStreamRef.current =
        null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }

    setShowCamera(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleGetLocation =
    async () => {
      setIsGettingLocation(true);

      setLocationError(null);

      try {
        const locationInfo =
          await getCurrentLocationInfo();

        setLocation(locationInfo);

        form.setValue(
          "location.latitude",
          locationInfo.latitude
        );

        form.setValue(
          "location.longitude",
          locationInfo.longitude
        );

        form.setValue(
          "location.address",
          locationInfo.address || ""
        );

        toast({
          title:
            "Location Acquired",
          description:
            locationInfo.address ||
            "GPS coordinates captured.",
        });
      } catch (err: any) {
        setLocationError(
          err.message
        );

        toast({
          title:
            "Location Error",

          description:
            err.message,

          variant:
            "destructive",
        });
      } finally {
        setIsGettingLocation(false);
      }
    };

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    form.setValue("image", file);

    const reader =
      new FileReader();

    reader.onloadend = () => {
      const result =
        reader.result as string;

      setImagePreview(result);

      form.setValue(
        "imageDataUri",
        result
      );

      handleAiAnalysis(result);
    };

    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleShowCamera =
    async () => {
      if (showCamera) {
        stopCamera();

        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode:
                  "environment",
              },
            }
          );

        mediaStreamRef.current =
          stream;

        setHasCameraPermission(
          true
        );

        setShowCamera(true);

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;
        }
      } catch {
        setHasCameraPermission(
          false
        );

        setCameraError(
          "Camera access denied."
        );
      }
    };

  const handleTakePhoto = () => {
    if (
      !videoRef.current ||
      !canvasRef.current
    )
      return;

    setIsTakingPhoto(true);

    const canvas =
      canvasRef.current;

    const video =
      videoRef.current;

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageDataUrl =
      canvas.toDataURL(
        "image/jpeg",
        0.9
      );

    setImagePreview(
      imageDataUrl
    );

    form.setValue(
      "imageDataUri",
      imageDataUrl
    );

    stopCamera();

    handleAiAnalysis(
      imageDataUrl
    );

    setTimeout(() => {
      setIsTakingPhoto(false);
    }, 300);
  };

  const handleAiAnalysis =
    async (
      imageDataUri: string
    ) => {
      setIsAnalyzing(true);

      setAnalysisError(null);

      try {
        const result =
          await analyzeIssueImage(
            {
              imageDataUri,

              description:
                form.getValues(
                  "description"
                ),
            }
          );

        setAiAnalysisResult(
          result
        );

        form.setValue(
          "type",
          result.detectedType
        );

        form.setValue(
          "title",
          result.suggestedTitle
        );

        form.setValue(
          "description",
          result.suggestedDescription
        );

        form.setValue(
          "priority",
          result.suggestedPriority
        );

        toast({
          title:
            "AI Analysis Complete",

          description:
            "Issue classified successfully.",
        });
      } catch (err: any) {
        setAnalysisError(
          err.message
        );
      } finally {
        setIsAnalyzing(false);
      }
    };

  const getPriorityDescription =
    (
      priority: IssuePriority
    ) => {
      switch (priority) {
        case "High":
          return "Critical infrastructure risk requiring immediate municipal action.";

        case "Medium":
          return "Moderate public inconvenience with elevated civic priority.";

        case "Low":
          return "Minor infrastructure issue with lower urgency.";

        default:
          return "";
      }
    };

  const onSubmit = async (
    data: FormData
  ) => {
    setIsSubmitting(true);

    try {
      const reporterId =
        typeof window !== "undefined"
          ? localStorage.getItem("citizenUserEmail") || "citizen123"
          : "citizen123";

      const issue: Issue = {
        id: `issue-${Date.now()}`,

        title: data.title,

        description:
          data.description,

        type: data.type,

        priority:
          data.priority,

        location:
          data.location,

        status: "Pending",

        reportedById:
          reporterId,

        reportedAt:
          Date.now(),

        dueDate:
          calculateDueDate(
            Date.now(),
            data.priority
          ),

        imageUrl:
          data.imageDataUri,
      };

      addIssueToDb(issue);

      toast({
        title:
          "Issue Submitted",

        description:
          "Civic issue registered successfully.",
      });

      sessionStorage.removeItem(
        AI_IMAGE_STORAGE_KEY
      );

      router.push(
        "/citizen/dashboard"
      );
    } catch {
      toast({
        title:
          "Submission Failed",

        description:
          "Could not submit issue.",

        variant:
          "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-10">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/10 blur-3xl rounded-full" />
      </div>

      {/* HERO */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
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
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-border/50 flex items-center justify-center">
            <Radar className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Smart Civic
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                {" "}
                Reporting
              </span>
            </h1>

            <p className="text-muted-foreground text-lg mt-4 max-w-3xl">
              AI-assisted civic issue
              detection with multimodal
              analysis, severity
              intelligence, geospatial
              tracking, and governance
              prioritization.
            </p>
          </div>
        </div>
      </motion.div>

      <Card className="relative overflow-hidden rounded-[32px] border border-border/50 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/[0.03]">
        <CardContent className="relative z-10 p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit
              )}
              className="space-y-8"
            >
              {/* IMAGE */}
              <Card className="overflow-hidden rounded-[28px] border border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  {imagePreview ? (
                    <div className="space-y-5">
                      <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-black">
                        <Image
                          src={
                            imagePreview
                          }
                          alt="Issue"
                          width={1200}
                          height={800}
                          unoptimized
                          className="w-full max-h-[420px] object-contain"
                        />

                        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/40 backdrop-blur-xl px-4 py-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                          <span className="text-xs font-medium text-white">
                            AI Vision
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="button"
                          onClick={
                            triggerUpload
                          }
                          className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Change Image
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={
                            handleShowCamera
                          }
                          className="rounded-2xl border-border/50 bg-background/60"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Retake
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {showCamera ? (
                        <div className="space-y-4">
                          <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-black">
                            <video
                              ref={
                                videoRef
                              }
                              autoPlay
                              muted
                              playsInline
                              className="w-full aspect-video object-cover"
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              onClick={
                                handleTakePhoto
                              }
                              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Capture
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={
                                stopCamera
                              }
                              className="rounded-2xl"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-16">
                          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-6">
                            <BrainCircuit className="h-12 w-12 text-primary" />
                          </div>

                          <h3 className="text-2xl font-black mb-3">
                            Upload
                            Civic
                            Evidence
                          </h3>

                          <p className="text-muted-foreground max-w-md mb-8">
                            Capture
                            infrastructure
                            issues for AI
                            severity
                            analysis and
                            governance
                            prioritization.
                          </p>

                          <div className="flex flex-wrap gap-4">
                            <Button
                              type="button"
                              onClick={
                                triggerUpload
                              }
                              className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-primary/20"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                              Image
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={
                                handleShowCamera
                              }
                              className="h-12 rounded-2xl border-border/50 bg-background/60 backdrop-blur-xl"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Open
                              Camera
                            </Button>
                          </div>
                        </div>
                      )}

                      <input
                        ref={
                          fileInputRef
                        }
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={
                          handleImageChange
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI ANALYSIS */}
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-black mb-2">
                    AI Analysis in
                    Progress
                  </h3>

                  <p className="text-muted-foreground">
                    Processing
                    infrastructure
                    intelligence...
                  </p>
                </div>
              )}

              {analysisError && (
                <Alert
                  variant="destructive"
                  className="rounded-2xl"
                >
                  <AlertCircle className="h-4 w-4" />

                  <AlertTitle>
                    Analysis Failed
                  </AlertTitle>

                  <AlertDescription>
                    {analysisError}
                  </AlertDescription>
                </Alert>
              )}

              {aiAnalysisResult && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-[28px] border border-primary/10 bg-primary/5 p-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black">
                        AI Analysis
                        Complete
                      </h3>

                      <p className="text-muted-foreground">
                        Civic issue
                        classified
                        successfully
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
                      <div className="text-xs uppercase text-muted-foreground mb-2">
                        Issue Type
                      </div>

                      <div className="text-2xl font-black">
                        {
                          aiAnalysisResult.detectedType
                        }
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
                      <div className="text-xs uppercase text-muted-foreground mb-2">
                        Priority
                      </div>

                      <div className="text-2xl font-black text-orange-500">
                        {
                          aiAnalysisResult.suggestedPriority
                        }
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
                      <div className="text-xs uppercase text-muted-foreground mb-2">
                        AI Title
                      </div>

                      <div className="text-lg font-bold">
                        {
                          aiAnalysisResult.suggestedTitle
                        }
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FORM GRID */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={
                    form.control
                  }
                  name="type"
                  render={({
                    field,
                  }) => (
                    <FormItem>
                      <FormLabel>
                        Issue
                        Type
                      </FormLabel>

                      <Select
                        onValueChange={
                          field.onChange
                        }
                        value={
                          field.value
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-background/60">
                            <SelectValue placeholder="Select issue type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {issueTypes.map(
                            (
                              type
                            ) => (
                              <SelectItem
                                key={
                                  type
                                }
                                value={
                                  type
                                }
                              >
                                {
                                  type
                                }
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={
                    form.control
                  }
                  name="priority"
                  render={({
                    field,
                  }) => (
                    <FormItem>
                      <FormLabel>
                        Priority
                      </FormLabel>

                      <Select
                        onValueChange={
                          field.onChange
                        }
                        value={
                          field.value
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-background/60">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {priorities.map(
                            (
                              priority
                            ) => (
                              <SelectItem
                                key={
                                  priority
                                }
                                value={
                                  priority
                                }
                              >
                                {
                                  priority
                                }
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormDescription>
                        {getPriorityDescription(
                          currentPriority
                        )}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              {/* TITLE */}
              <FormField
                control={
                  form.control
                }
                name="title"
                render={({
                  field,
                }) => (
                  <FormItem>
                    <FormLabel>
                      Issue
                      Title
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter issue title"
                        className="h-12 rounded-2xl border-border/50 bg-background/60"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={
                  form.control
                }
                name="description"
                render={({
                  field,
                }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Describe the civic issue..."
                        className="rounded-2xl border-border/50 bg-background/60 resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* LOCATION */}
              <Card className="rounded-[28px] border border-border/50 bg-background/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-primary" />

                        <h3 className="font-black text-lg">
                          Real-Time
                          GPS
                          Location
                        </h3>
                      </div>

                      {location ? (
                        <div>
                          <p className="font-medium">
                            {
                              location.address
                            }
                          </p>

                          <p className="text-sm text-muted-foreground mt-1">
                            Lat:{" "}
                            {location.latitude.toFixed(
                              5
                            )}{" "}
                            · Lon:{" "}
                            {location.longitude.toFixed(
                              5
                            )}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Location
                          unavailable
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={
                        handleGetLocation
                      }
                      disabled={
                        isGettingLocation
                      }
                      className="rounded-2xl"
                    >
                      {isGettingLocation ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {locationError && (
                    <Alert
                      variant="destructive"
                      className="mt-4 rounded-2xl"
                    >
                      <AlertCircle className="h-4 w-4" />

                      <AlertDescription>
                        {
                          locationError
                        }
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isAnalyzing
                }
                className="w-full h-14 rounded-2xl text-base font-semibold bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-primary/20"
              >
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}

                {isSubmitting
                  ? "Submitting Report..."
                  : "Submit Smart Civic Report"}
              </Button>

              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}