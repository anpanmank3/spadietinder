"use client"

import { Button } from "@/components/ui/button"
import { X, Heart, Star } from "lucide-react"

interface ActionButtonsProps {
  onPass: () => void
  onLike: () => void
  onSuperLike: () => void
  disabled?: boolean
  superLikeDisabled?: boolean
}

export function ActionButtons({ onPass, onLike, onSuperLike, disabled, superLikeDisabled }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 relative z-10">
      <Button
        size="icon"
        variant="outline"
        onClick={onPass}
        disabled={disabled}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-destructive hover:scale-110 active:scale-95 transition-all hover:bg-destructive/20 bg-card shadow-xl disabled:opacity-50"
      >
        <X className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" strokeWidth={4} />
      </Button>

      <Button
        size="icon"
        onClick={onSuperLike}
        variant="outline"
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-primary hover:scale-110 active:scale-95 transition-all hover:bg-primary/20 bg-card shadow-xl disabled:opacity-50"
        disabled={disabled || superLikeDisabled}
      >
        <Star className="w-8 h-8 sm:w-10 sm:h-10 text-primary fill-primary" />
      </Button>

      <Button
        size="icon"
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-accent to-secondary hover:scale-110 active:scale-95 transition-all shadow-xl border-4 border-background disabled:opacity-50"
      >
        <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-accent-foreground text-accent-foreground" />
      </Button>
    </div>
  )
}
