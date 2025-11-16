"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface Profile {
  id: string
  name: string
  age: number
  bio: string
  imageUrl: string
}

interface MatchModalProps {
  profile: Profile
  onClose: () => void
}

export function MatchModal({ profile, onClose }: MatchModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div
        className={`w-full max-w-md transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <Card className="relative overflow-hidden border-4 border-primary shadow-2xl bg-card">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-primary hover:bg-primary/80 transition-colors shadow-lg"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>

          {/* Content */}
          <div className="p-8 text-center space-y-6">
            {/* Celebration Icon */}
            <div className="flex justify-center gap-3 text-6xl">
              <div className="w-16 h-16 rounded-full bg-chart-3 flex items-center justify-center border-4 border-background shadow-lg animate-bounce">
                <span className="text-3xl">♥</span>
              </div>
              <div
                className="w-16 h-16 rounded-full bg-chart-4 flex items-center justify-center border-4 border-background shadow-lg animate-bounce"
                style={{ animationDelay: "0.1s" }}
              >
                <span className="text-3xl">♦</span>
              </div>
              <div
                className="w-16 h-16 rounded-full bg-chart-5 flex items-center justify-center border-4 border-background shadow-lg animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="text-3xl">♣</span>
              </div>
            </div>

            {/* Match Text */}
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-primary game-title">It&apos;s a Match!</h2>
              <p className="text-lg text-foreground font-bold">
                You and <span className="text-secondary">{profile.name}</span> liked each other
              </p>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary shadow-xl">
                  <img
                    src={profile.imageUrl || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-gradient-to-br from-chart-3 to-chart-5 flex items-center justify-center shadow-lg border-4 border-background">
                  <span className="text-2xl">♠</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-accent to-secondary hover:opacity-90 transition-opacity shadow-lg text-base font-black border-2 border-background"
              >
                Send a Message
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onClose}
                className="w-full text-base font-bold border-4 border-primary bg-card hover:bg-primary/20"
              >
                Keep Playing
              </Button>
            </div>
          </div>

          <div className="absolute top-4 left-4 text-3xl text-primary opacity-20">♠</div>
          <div className="absolute bottom-4 right-4 text-3xl text-secondary opacity-20">♥</div>
        </Card>
      </div>
    </div>
  )
}
