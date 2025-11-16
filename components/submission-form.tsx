"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface Profile {
  id: string
  name: string
  age: number
  bio: string
  imageUrl: string
}

interface SubmissionFormProps {
  selectedProfiles: Profile[]
  userActions: { userId: string; action: 'no' | 'like' | 'superlike' }[]
  onReset?: () => void
}

export function SubmissionForm({ selectedProfiles, userActions, onReset }: SubmissionFormProps) {
  const [nickname, setNickname] = useState("")
  const [gameId, setGameId] = useState("")
  const [twitter, setTwitter] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ nickname?: string; gameId?: string; twitter?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: { nickname?: string; gameId?: string; twitter?: string } = {}

    if (!nickname.trim()) {
      newErrors.nickname = "ニックネームを入力してください"
    }

    if (!gameId.trim()) {
      newErrors.gameId = "Game IDを入力してください"
    }

    if (!twitter.trim()) {
      newErrors.twitter = "Twitterアカウントを入力してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickname,
            twitter,
            gameId,
            selections: userActions,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to submit')
        }

        console.log("[v0] Submission successful:", { nickname, gameId, twitter, userActions })
        setSubmitted(true)
      } catch (error) {
        console.error('[v0] Submission error:', error)
        setSubmitError('送信に失敗しました。もう一度お試しください。')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleResubmit = () => {
    if (onReset) {
      onReset()
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative">
        <div
          className="fixed inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='40' fontSize='30' fill='%23f4d03f'%3E♠%3C/text%3E%3Ctext x='50' y='40' fontSize='30' fill='%23e91e63'%3E♥%3C/text%3E%3Ctext x='10' y='70' fontSize='30' fill='%23e91e63'%3E♦%3C/text%3E%3Ctext x='50' y='70' fontSize='30' fill='%23f4d03f'%3E♣%3C/text%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />

        <main className="flex-1 flex items-center justify-center p-3 sm:p-4 relative z-10">
          <Card className="border-4 border-primary shadow-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full">
            <div className="text-center space-y-5 sm:space-y-6">
              <div className="text-6xl sm:text-8xl mb-3 sm:mb-4">
                <div className="inline-flex gap-2 sm:gap-3">
                  <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 chip-bounce">
                    <img
                      src="/images/design-mode/1.png"
                      alt="Spade character"
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                  <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 chip-bounce">
                    <img
                      src="/images/design-mode/4.png"
                      alt="Heart character"
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                  <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 chip-bounce">
                    <img
                      src="/images/design-mode/2.png"
                      alt="Diamond character"
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                  <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 chip-bounce">
                    <img
                      src="/images/design-mode/3.png"
                      alt="Club character"
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary game-title leading-tight">
                  ご応募ありがとう
                  <br />
                  ございます！
                </h2>

                <div className="bg-accent/10 border-2 border-accent rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <p className="text-base sm:text-lg font-bold text-foreground">応募が完了しました</p>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                    マッチング結果は後日
                    <br />
                    ご連絡いたします
                  </p>
                </div>

                <div className="bg-secondary/10 border-2 border-secondary rounded-2xl p-4 sm:p-6 space-y-2">
                  <p className="text-base sm:text-lg font-black text-secondary game-title">何度でもご応募OK！</p>
                  <p className="text-xs sm:text-sm text-foreground/90">
                    気になる相手がいたら
                    <br />
                    ぜひ再度チャレンジしてください
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={handleResubmit}
                className="w-full h-14 sm:h-16 text-lg font-black game-title bg-gradient-to-r from-accent to-secondary hover:scale-105 active:scale-95 transition-all shadow-xl border-4 border-background mt-6 sm:mt-8 sm:text-2xl"
              >
                もう一度、いい出会いを探す 
              </Button>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='40' fontSize='30' fill='%23f4d03f'%3E♠%3C/text%3E%3Ctext x='50' y='40' fontSize='30' fill='%23e91e63'%3E♥%3C/text%3E%3Ctext x='10' y='70' fontSize='30' fill='%23e91e63'%3E♦%3C/text%3E%3Ctext x='50' y='70' fontSize='30' fill='%23f4d03f'%3E♣%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 relative z-10">
        <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
          <Card className="border-4 border-primary shadow-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-black text-primary game-title mb-2 text-center">情報入力</h2>
            <p className="text-center text-foreground font-bold mb-5 sm:mb-6 text-sm sm:text-base">
              {selectedProfiles.length}名を選択済み
            </p>

            {submitError && (
              <div className="mb-4 p-3 bg-destructive/10 border-2 border-destructive rounded-lg">
                <p className="text-destructive text-sm font-bold text-center">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-base sm:text-lg font-bold text-foreground">
                  ニックネーム
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value)
                    setErrors((prev) => ({ ...prev, nickname: undefined }))
                  }}
                  placeholder="ニックネームを入力"
                  className={`h-12 sm:h-14 border-2 ${errors.nickname ? "border-destructive" : "border-primary"} focus:border-accent text-base sm:text-lg font-medium`}
                />
                {errors.nickname && <p className="text-destructive text-xs sm:text-sm font-bold">{errors.nickname}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-base sm:text-lg font-bold text-foreground">
                  連絡用Twitter account
                </Label>
                <Input
                  id="twitter"
                  type="text"
                  value={twitter}
                  onChange={(e) => {
                    setTwitter(e.target.value)
                    setErrors((prev) => ({ ...prev, twitter: undefined }))
                  }}
                  placeholder="@youraccount"
                  className={`h-12 sm:h-14 border-2 ${errors.twitter ? "border-destructive" : "border-primary"} focus:border-accent text-base sm:text-lg font-medium`}
                />
                {errors.twitter && <p className="text-destructive text-xs sm:text-sm font-bold">{errors.twitter}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameId" className="text-base sm:text-lg font-bold text-foreground">
                  Game ID
                </Label>
                <Input
                  id="gameId"
                  type="text"
                  value={gameId}
                  onChange={(e) => {
                    setGameId(e.target.value)
                    setErrors((prev) => ({ ...prev, gameId: undefined }))
                  }}
                  placeholder="なければ「なし」"
                  className={`h-12 sm:h-14 border-2 ${errors.gameId ? "border-destructive" : "border-primary"} focus:border-accent text-base sm:text-lg font-medium`}
                />
                {errors.gameId && <p className="text-destructive text-xs sm:text-sm font-bold">{errors.gameId}</p>}
              </div>

              <Button
                variant="secondary"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 sm:h-14 text-lg font-black game-title bg-gradient-to-r from-accent to-secondary hover:scale-105 active:scale-95 transition-all shadow-xl border-4 border-background sm:text-3xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
