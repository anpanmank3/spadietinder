"use client"

import { useState, useEffect } from "react"
import { ProfileCard } from "@/components/profile-card"
import { ActionButtons } from "@/components/action-buttons"
import { SubmissionForm } from "@/components/submission-form"
import { Header } from "@/components/header"
import { CompletionModal } from "@/components/completion-modal"

interface Profile {
  id: string
  nickname: string
  photoUrl: string
  pokerHistory: string
  bio: string
  twitterAccount?: string
}

const maleProfiles: Profile[] = [
  {
    id: "m1",
    nickname: "Taro",
    photoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    pokerHistory: "JOPT 2023 準優勝 / WSOP 参加経験",
    bio: "ポーカー歴5年。勝負強さが取り柄。\n趣味はカメラと旅。",
    twitterAccount: "@taro_poker",
  },
  {
    id: "m2",
    nickname: "Ken",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    pokerHistory: "WPTファイナリスト / オンライン大会常勝",
    bio: "仕事もポーカーも真剣。\n好きなハンドはA♠️K♣️。",
    twitterAccount: "@ken_poker",
  },
  {
    id: "m3",
    nickname: "Ryo",
    photoUrl: "https://images.unsplash.com/photo-15447237953fb6469f5b39",
    pokerHistory: "JOPT本戦常連 / WSOP出場権獲得",
    bio: "戦略派。冷静と情熱のあいだ。\n趣味：筋トレとラーメン巡り。",
    twitterAccount: "@ryo_poker",
  },
  {
    id: "m4",
    nickname: "Yuki",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    pokerHistory: "全日本選手権ベスト8 / SPADIE常連",
    bio: "アグレッシブなプレイスタイル。\n映画と読書が好き。",
    twitterAccount: "@yuki_poker",
  },
  {
    id: "m5",
    nickname: "Daiki",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    pokerHistory: "オンライントーナメント優勝3回",
    bio: "タイトなプレイを心がけてます。\n筋トレとサウナが日課。",
    twitterAccount: "@daiki_poker",
  },
  {
    id: "m6",
    nickname: "Shin",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    pokerHistory: "APT参戦経験あり / 国内大会多数入賞",
    bio: "確率論で勝負。データ分析好き。\nカフェ巡りが趣味。",
    twitterAccount: "@shin_poker",
  },
  {
    id: "m7",
    nickname: "Koji",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-ab3db95bfbce",
    pokerHistory: "JOPT Main Event ファイナルテーブル",
    bio: "ポーカーは心理戦。読み合いが楽しい。\n料理も得意です。",
    twitterAccount: "@koji_poker",
  },
  {
    id: "m8",
    nickname: "Takeshi",
    photoUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556",
    pokerHistory: "WSOPサテライト優勝 / 海外遠征多数",
    bio: "世界を見てきた。経験が武器。\n旅行と写真撮影が好き。",
    twitterAccount: "@takeshi_poker",
  },
  {
    id: "m9",
    nickname: "Hiro",
    photoUrl: "https://images.unsplash.com/photo-1488426862023-ab3db95bfbce",
    pokerHistory: "SPADIE年間ランキングTOP10",
    bio: "コンスタントに結果を出すタイプ。\n音楽とギターが趣味。",
    twitterAccount: "@hiro_poker",
  },
  {
    id: "m10",
    nickname: "Satoshi",
    photoUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453",
    pokerHistory: "国内キャッシュゲーム強豪 / 配信者",
    bio: "ライブ配信でポーカー解説してます。\nゲームとアニメも好き。",
    twitterAccount: "@satoshi_poker",
  },
]

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [originalProfiles, setOriginalProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([])
  const [reviewedCount, setReviewedCount] = useState(0)
  const [superLikeUsed, setSuperLikeUsed] = useState(false)
  const [likeType, setLikeType] = useState<"like" | "superlike" | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [actionType, setActionType] = useState<"no" | "like" | "superlike" | null>(null)
  const [userActions, setUserActions] = useState<{ userId: string; action: 'no' | 'like' | 'superlike' }[]>([])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

      // ⭐ 重み付きだけど「同じ人は1回だけ」になる並び替え
  const createWeightedOrder = (profiles: Profile[]): Profile[] => {
    // id ごとの重み（ここを好きに調整）
    const weights: { [key: string]: number } = {
      "65": 3, // 3倍出やすい
      "93": 2,
      "34": 2,
      "1": 2,
      "26": 2,
      "81": 2,
      "91": 2,
      "109": 2,
    }

    // 残り候補と対応する重み
    const remaining = [...profiles]
    const remainingWeights = remaining.map((p) => weights[p.id] ?? 1)
    const result: Profile[] = []

    while (remaining.length > 0) {
      const totalWeight = remainingWeights.reduce((sum, w) => sum + w, 0)
      const r = Math.random() * totalWeight

      let acc = 0
      let selectedIndex = 0

      for (let i = 0; i < remaining.length; i++) {
        acc += remainingWeights[i]
        if (r <= acc) {
          selectedIndex = i
          break
        }
      }

      // この1人を次の順番として確定
      result.push(remaining[selectedIndex])

      // 候補から削除（＝同じ人は二度と選ばれない）
      remaining.splice(selectedIndex, 1)
      remainingWeights.splice(selectedIndex, 1)
    }

    console.log(
      `[v0] Created weighted order: ${profiles.length} unique profiles -> reordered with weights`
    )

    return result
  }

    
  useEffect(() => {
    const loadCsv = async () => {
      try {
        console.log("[v0] CSVファイルの読み込みを開始")
        const res = await fetch("/profiles.csv")
        console.log("[v0] Fetch response status:", res.status)
        const text = await res.text()
        console.log("[v0] CSV text length:", text.length)

        const rows: string[][] = []
        let currentRow: string[] = []
        let currentField = ""
        let insideQuotes = false

        for (let i = 0; i < text.length; i++) {
          const char = text[i]
          const nextChar = text[i + 1]

          if (char === '"' && nextChar === '"') {
            currentField += '"'
            i++
          } else if (char === '"') {
            insideQuotes = !insideQuotes
          } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField.trim())
            currentField = ""
          } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') {
              i++
            }
            if (currentField || currentRow.length > 0) {
              currentRow.push(currentField.trim())
              if (currentRow.some(f => f.length > 0)) {
                rows.push(currentRow)
              }
              currentRow = []
              currentField = ""
            }
          } else {
            currentField += char
          }
        }

        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim())
          if (currentRow.some(f => f.length > 0)) {
            rows.push(currentRow)
          }
        }

        console.log("[v0] Total CSV rows parsed:", rows.length)

        if (rows.length === 0) {
          console.error("[v0] No rows parsed from CSV")
          return
        }

        const headers = rows[0].map(h => h.trim())
        console.log("[v0] CSV headers:", headers)

        const list: Profile[] = []
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i]
          const row: any = {}
          
          headers.forEach((h, idx) => {
            row[h] = (cols[idx] ?? "").trim()
          })

          console.log(`[v0] Row ${i}:`, row)

          const number = String(row.number || "").trim()
          const name = String(row.name || "").trim()
          
          if (number && name && !isNaN(Number(number))) {
            const profile = {
              id: number,
              nickname: name,
              pokerHistory: row.result || "",
              bio: row.profile || "",
              photoUrl: `/profile-images/${number}.jpg`,
              twitterAccount: row.account || "",
            }
            
            console.log(`[v0] Parsed profile ${i}:`, profile)
            list.push(profile)
          } else {
            console.log(`[v0] Skipping invalid row ${i} - number: "${number}", name: "${name}"`)
          }
        }

        console.log("[v0] Total valid profiles loaded:", list.length)
        
        setOriginalProfiles(list)
        const shuffledProfiles = shuffleArray(list)
        console.log("[v0] Profiles shuffled for random display")
        setProfiles(shuffledProfiles)
      } catch (e) {
        console.error("[v0] CSV読み込みエラー:", e)
      }
    }

    loadCsv()
  }, [])

  const handlePass = () => {
    if (currentIndex < profiles.length) {
      const profile = profiles[currentIndex]
      setUserActions((prev) => [...prev, { userId: profile.id, action: 'no' }])
      setActionType("no")

      setTimeout(() => {
        const newReviewedCount = reviewedCount + 1
        setReviewedCount(newReviewedCount)
        setCurrentIndex((prev) => prev + 1)
        setActionType(null)

        if (newReviewedCount === 5) {
          setShowCompletionModal(true)
        }
      }, 300)
    }
  }

  const handleLike = () => {
    if (currentIndex < profiles.length) {
      const profile = profiles[currentIndex]
      setSelectedProfiles((prev) => [...prev, profile])
      setUserActions((prev) => [...prev, { userId: profile.id, action: 'like' }])
      setLikeType("like")
      setActionType("like")

      setTimeout(() => {
        const newReviewedCount = reviewedCount + 1
        setReviewedCount(newReviewedCount)
        setCurrentIndex((prev) => prev + 1)
        setLikeType(null)
        setActionType(null)

        if (newReviewedCount === 5) {
          setShowCompletionModal(true)
        }
      }, 500)
    }
  }

  const handleSuperLike = () => {
    if (currentIndex < profiles.length && !superLikeUsed) {
      const profile = profiles[currentIndex]
      setSelectedProfiles((prev) => [...prev, profile])
      setUserActions((prev) => [...prev, { userId: profile.id, action: 'superlike' }])
      setLikeType("superlike")
      setActionType("superlike")
      setSuperLikeUsed(true)

      setTimeout(() => {
        const newReviewedCount = reviewedCount + 1
        setReviewedCount(newReviewedCount)
        setCurrentIndex((prev) => prev + 1)
        setLikeType(null)
        setActionType(null)

        if (newReviewedCount === 5) {
          setShowCompletionModal(true)
        }
      }, 800)
    }
  }

  const handleContinueToForm = () => {
    setShowCompletionModal(false)
    setShowForm(true)
  }

  const handleReset = () => {
    console.log("[v0] Resetting and reshuffling profiles")
    const reshuffled = shuffleArray(originalProfiles)
    setProfiles(reshuffled)
    
    setCurrentIndex(0)
    setSelectedProfiles([])
    setReviewedCount(0)
    setSuperLikeUsed(false)
    setShowForm(false)
    setShowCompletionModal(false)
    setLikeType(null)
    setActionType(null)
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(false)
    setUserActions([])
  }

  if (showForm) {
    return <SubmissionForm selectedProfiles={selectedProfiles} userActions={userActions} onReset={handleReset} />
  }

  const currentProfile = profiles[currentIndex]
  const hasMoreProfiles = currentIndex < profiles.length

  console.log("[v0] Current state:", {
    profilesCount: profiles.length,
    currentIndex,
    hasMoreProfiles,
    currentProfile
  })

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='40' fontSize='30' fill='%23f4d03f'%3E♠%3C/text%3E%3Ctext x='50' y='40' fontSize='30' fill='%23e91e63'%3E♥%3C/text%3E%3Ctext x='10' y='70' fontSize='30' fill='%23e91e63'%3E♦%3C/text%3E%3Ctext x='50' y='70' fontSize='30' fill='%23f4d03f'%3E♣%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <Header />

      <div className="absolute top-16 right-2 z-50">
        <div className="bg-primary border-3 border-background rounded-xl px-4 py-2 shadow-lg">
          <p className="game-title font-normal text-transparent font-sans text-xl">選択 {reviewedCount}/5</p>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-3 py-4 relative z-10 pb-28">
        <div className="w-full max-w-sm relative" style={{ height: "75vh", maxHeight: "650px" }}>
          {hasMoreProfiles ? (
            <ProfileCard
              profile={currentProfile}
              likeType={likeType}
              actionType={actionType}
              dragOffset={dragOffset}
              isDragging={isDragging}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(offset) => {
                setIsDragging(false)
                setDragOffset({ x: 0, y: 0 })

                if (offset.x < -100) {
                  handlePass()
                } else if (offset.x > 100) {
                  handleLike()
                } else if (offset.y < -100) {
                  handleSuperLike()
                }
              }}
              onDrag={(offset) => setDragOffset(offset)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <p className="text-2xl font-black text-primary game-title mb-3">全て確認しました！</p>
                <p className="text-base font-bold text-foreground">{selectedProfiles.length}名を選択済み</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-6 left-0 right-0 z-20 px-3">
        <ActionButtons
          onPass={handlePass}
          onLike={handleLike}
          onSuperLike={handleSuperLike}
          disabled={!hasMoreProfiles}
          superLikeDisabled={superLikeUsed}
        />
      </div>

      <CompletionModal
        isOpen={showCompletionModal}
        onContinue={handleContinueToForm}
        selectedCount={selectedProfiles.length}
      />
    </div>
  )
}
