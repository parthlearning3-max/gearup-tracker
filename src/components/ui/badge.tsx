import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        new: "border-transparent bg-status-new text-white",
        progress: "border-transparent bg-status-progress text-white",
        complete: "border-transparent bg-status-complete text-white",
        overdue: "border-transparent bg-status-overdue text-white",
        scrap: "border-transparent bg-status-scrap text-white",
        corrective: "border-transparent bg-destructive/10 text-destructive border-destructive/20",
        preventive: "border-transparent bg-primary/10 text-primary border-primary/20",
        low: "border-transparent bg-muted text-muted-foreground",
        medium: "border-transparent bg-status-progress/10 text-status-progress border-status-progress/20",
        high: "border-transparent bg-status-overdue/10 text-status-overdue border-status-overdue/20",
        urgent: "border-transparent bg-destructive text-white animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
