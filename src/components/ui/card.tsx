import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
<<<<<<< HEAD
      "rounded-2xl border border-slate-200/60 bg-white/70 text-card-foreground backdrop-blur-md shadow-xl shadow-slate-200/30 transition-all duration-200 dark:border-slate-800/50 dark:bg-slate-900/40 dark:shadow-none",
=======
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Kept existing styles, border added by default
      // Optional: Add transition for hover effects if desired elsewhere
      // "transition-shadow hover:shadow-md",
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
<<<<<<< HEAD
    className={cn("flex flex-col space-y-1.5 p-6", className)}
=======
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Standard padding
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
<<<<<<< HEAD
  HTMLDivElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
=======
  HTMLDivElement, // Changed to div for broader compatibility, use h3 semantically where needed
  React.HTMLAttributes<HTMLHeadingElement> // Keep HTMLHeadingElement for props type safety
>(({ className, ...props }, ref) => (
  // Use <h3> or appropriate heading level semantically when using CardTitle
  <div
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight", // Slightly reduced size from 2xl
      className
    )}
    {...props} // This allows passing `as="h3"` or similar
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <p
    ref={ref}
    className={cn("text-sm text-slate-700 dark:text-slate-300", className)}
=======
  <p // Use <p> tag for semantic correctness
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
=======
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // Standard padding, remove top padding
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
<<<<<<< HEAD
    className={cn("flex items-center p-6 pt-0", className)}
=======
    className={cn("flex items-center p-6 pt-0", className)} // Standard padding, remove top padding
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
