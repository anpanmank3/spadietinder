"use client"

import { Card } from "@/components/ui/card"
import { Trophy } from 'lucide-react'
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useMemo } from "react"

interface Profile {
  id: string
  nickname: string
  photoUrl: string
  pokerHistory: string
  bio: string
  twitterAccount?: string
}

interface ProfileCardProps {
  profile: Profile
  likeType: "like" | "superlike" | null
  actionType: "no" | "like" | "superlike" | null
  dragOffset: { x: number; y: number }
  isDragging: boolean
  onDragStart: () => void
  onDrag: (offset: { x: number; y: number }) => void
  onDragEnd: (offset: { x: number; y: number }) => void
}

const characterImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-2l0OuY8acrWR4utHIZxpVj6I0ZssPy.png", // Red spade
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-4m4v8L8AZ0CX8f3fhzgxkwJnkLW988.png", // Yellow diamond
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-mIUigB8zpXkzJWRVmDyzh4nm7q6GqC.png", // Green club
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-o5eQOSsuhhrpCad1peu0XyV3uRqdk1.png", // Orange heart
]

export function ProfileCard({
  profile,
  likeType,
  actionType,
  dragOffset,
  isDragging,
  onDragStart,
  onDrag,
  onDragEnd,
}: ProfileCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])

  const randomCharacter = useMemo(() => {
    const hash = profile.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return characterImages[hash % characterImages.length]
  }, [profile.id])

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={onDragStart}
      onDrag={(_, info) => {
        onDrag({ x: info.offset.x, y: info.offset.y })
      }}
      onDragEnd={(_, info) => {
        onDragEnd({ x: info.offset.x, y: info.offset.y })
      }}
      animate={
        likeType === "superlike"
          ? {
              y: -800,
              scale: 1.1,
              filter: "blur(0px) drop-shadow(0 0 30px rgba(244, 208, 63, 0.8))",
            }
          : likeType === "like"
            ? { x: 400, rotate: 30 }
            : actionType === "no"
              ? { x: -400, rotate: -30 }
              : {}
      }
      transition={likeType === "superlike" ? { duration: 0.8, ease: "easeOut" } : { duration: 0.5, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-4 border-primary shadow-2xl relative h-full">
        {(likeType === "superlike" || actionType === "superlike") && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-primary px-2 text-center"
              style={{
                textShadow: "3px 3px 0 oklch(0.15 0.02 250), 4px 4px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              SUPER LIKE
            </motion.div>
          </div>
        )}

        {(likeType === "like" || actionType === "like") && !isDragging && (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
              animate={{ opacity: 1, rotate: -12, scale: 1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black text-accent"
              style={{
                textShadow: "3px 3px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              LIKE
            </motion.div>
          </div>
        )}

        {actionType === "no" && !isDragging && (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, rotate: 20, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 12, scale: 1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black text-destructive"
              style={{
                textShadow: "3px 3px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              NO
            </motion.div>
          </div>
        )}

        {likeType === "superlike" && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "50%",
                }}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  y: -300,
                  scale: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: Math.random() * 0.2,
                }}
              >
                ⭐
              </motion.div>
            ))}
          </div>
        )}

        {isDragging && dragOffset.x < -50 && (
          <div className="absolute inset-0 bg-destructive/30 backdrop-blur-sm z-40 flex items-center justify-center">
            <div
              className="text-5xl sm:text-6xl md:text-7xl font-black text-destructive transform rotate-12"
              style={{
                textShadow: "3px 3px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              NO
            </div>
          </div>
        )}
        {isDragging && dragOffset.x > 50 && (
          <div className="absolute inset-0 bg-accent/30 backdrop-blur-sm z-40 flex items-center justify-center">
            <div
              className="text-5xl sm:text-6xl md:text-7xl font-black text-accent transform -rotate-12"
              style={{
                textShadow: "3px 3px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              LIKE
            </div>
          </div>
        )}
        {isDragging && dragOffset.y < -50 && (
          <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm z-40 flex items-center justify-center">
            <div
              className="text-4xl sm:text-5xl md:text-6xl font-black text-primary px-2 text-center"
              style={{
                textShadow: "3px 3px 0 oklch(0.15 0.02 250), 4px 4px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              SUPER LIKE
            </div>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-full overflow-hidden">
          <div className="relative aspect-[4/5] w-full">
            <img
              src={profile.photoUrl || "/placeholder.svg"}
              alt={profile.nickname}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-2xl" />

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold">{profile.nickname}</h2>
              {profile.twitterAccount && profile.twitterAccount.trim() !== "" && (
                <a
                  href={`https://twitter.com/${profile.twitterAccount.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>@{profile.twitterAccount.replace('@', '')}</span>
                </a>
              )}
            </div>

            {/* Bio Section */}
            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line font-medium mb-2">
              {profile.bio}
            </p>

            {/* Poker History Section */}
            <div className="flex items-start gap-2 bg-primary/20 backdrop-blur-sm rounded-xl p-2.5 border border-primary/30">
              <Trophy className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary" />
              <p className="text-xs font-medium text-white/90 leading-relaxed">{profile.pokerHistory}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="absolute -top-3 -left-3 w-16 h-16 chip-bounce">
        <img
          src={randomCharacter || "/placeholder.svg"}
          alt="Character"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>
    </motion.div>
  )
}
