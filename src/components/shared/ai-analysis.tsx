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
      }
    };

    getCameraPermission();

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
              </Button>
            </div>
          </CardContent>
        </Card>
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
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}