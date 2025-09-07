"use client";
import React, { useState } from 'react'
import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { cn } from "@/lib/utils";

interface LetterTipsProps {
  country?: 'AUSTRALIA' | 'CANADA'
}

const CardSpotlight = ({
  children,
  radius = 200,
  color = "hsl(var(--primary))",
  className,
  onClick,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
  onClick?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  return (
    <div
      className={cn(
        "group/spotlight relative rounded-md border border-border bg-card",
        onClick && "cursor-pointer",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute z-0 -inset-px rounded-md opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        {isHovering && onClick && (
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [240, 214, 91],
              [209, 183, 70],
            ]}
            dotSize={2}
            showGradient={false}
          />
        )}
      </motion.div>
      {children}
    </div>
  );
};

export default function LetterTips({}: LetterTipsProps) {

  const handleExpertServiceClick = () => {
    console.log('Navigate to SOP Review page');
    // Add your navigation logic here
  };

  const handleGetReviewClick = () => {
    console.log('Navigate to SOP Review and Update page');
    // Add your navigation logic here
  };

  const staticTips = [
    {
      icon: '✨',
      text: 'Review and personalize the generated content'
    },
    {
      icon: '📋',
      text: 'Check for specific program requirements'
    },
    {
      icon: '📅',
      text: 'Ensure all dates and details are accurate'
    }
  ]

  return (
    <div className="relative w-full">
      {/* Main container */}
      <div className="relative bg-background/80 backdrop-blur-sm rounded-lg border border-border shadow-sm overflow-hidden">
        {/* Animated border shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_8s_ease-in-out_infinite] pointer-events-none"></div>
        
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <span className="text-primary text-xs">💡</span>
              </div>
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              Pro Tips
            </h3>
          </div>

          {/* Static Tips */}
          <div className="space-y-2 mb-4">
            {staticTips.map((tip, index) => (
              <div
                key={index}
                className="relative p-3 rounded-md bg-card/30 border border-border/50"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center bg-muted/50 text-muted-foreground">
                    <span className="text-xs">{tip.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {tip.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Expert Service Card */}
          <CardSpotlight
            className="p-3 mb-3 hover:shadow-lg transition-all duration-300"
            radius={150}
            color="hsl(var(--primary) / 0.1)"
            onClick={handleExpertServiceClick}
          >
            <div className="relative z-10">
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center bg-primary/10 text-primary-foreground">
                  <span className="text-xs">👨‍💼</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed text-foreground font-medium">
                    Get expert review from our in-house specialists
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="px-2 py-0.5 flex bg-primary/90 rounded-full">
                      <span className="text-[10px] font-medium text-primary-foreground">Expert Service</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full bg-primary animate-pulse"
                          style={{
                            animationDelay: `${i * 150}ms`,
                            animationDuration: '1.5s'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="transition-all duration-200 transform group-hover/spotlight:translate-x-0 group-hover/spotlight:opacity-100 translate-x-1 opacity-60">
                  <div className="w-3 h-3 text-primary">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </CardSpotlight>

          {/* Interactive Get Review CTA */}
          <CardSpotlight
            className="p-3"
            radius={180}
            color="hsl(var(--primary) / 0.15)"
            onClick={handleGetReviewClick}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-xs text-foreground">Need Expert Review?</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    Our specialists ensure your SOP meets all requirements
                  </p>
                </div>
                <div className="ml-3 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-md group-hover/spotlight:bg-primary/90 transition-all duration-200 whitespace-nowrap flex items-center gap-1">
                  Get Review
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </CardSpotlight>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}