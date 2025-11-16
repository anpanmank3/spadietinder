"use client"

import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CompletionModalProps {
  isOpen: boolean
  onContinue: () => void
  selectedCount: number
}

export function CompletionModal({ isOpen, onContinue, selectedCount }: CompletionModalProps) {
  return (
    <Dialog open={isOpen}>
      {/* ×ボタン非表示 */}
      <DialogContent className="border-4 border-primary bg-background max-w-md [&>button]:hidden">

        <div className="text-center space-y-6 py-8">

          {/* ⭐ 1人以上選んだときだけタイトルと説明文を表示 */}
          {selectedCount > 0 && (
            <>
              <h2 className="text-5xl font-black game-title sm:text-5xl text-primary">
                {selectedCount}人を選びました！
              </h2>

              <DialogDescription className="text-base sm:text-lg font-bold text-foreground px-4">
                次のステップに進んで情報を入力してください
              </DialogDescription>
            </>
          )}

          {/* ⭐ ボタンの文言を条件分岐 */}
          <Button
            variant="secondary"
            onClick={onContinue}
            className="w-full h-14 text-xl font-black game-title bg-gradient-to-r from-accent to-secondary hover:scale-105 transition-all shadow-xl border-4 border-background mt-4"
          >
            {selectedCount === 0
              ? "もう一度運命の出会いを探す"
              : "入力フォームへ"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
