"use client"

import { useState, useEffect, useRef } from "react"

export function QuestTracker() {
  const [completed, setCompleted] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    // Listen for postMessage from the offerwall iframe when user clicks Start
    const handleMessage = (e: MessageEvent) => {
      if (
        typeof e.data === "object" &&
        (e.data?.type === "offer_click" || e.data?.type === "offerwall_click")
      ) {
        triggerProgress()
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Also listen for clicks on any link inside the offerwall iframe container
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if a Start / offer button was clicked inside the offerwall container
      if (
        target.closest('[data-offerwall]') ||
        (target.tagName === 'A' && target.closest('.offerwall-container'))
      ) {
        triggerProgress()
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  function triggerProgress() {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    // After 90 seconds, go to 1 of 2
    timerRef.current = setTimeout(() => {
      setCompleted(1)
    }, 90_000)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="flex justify-center mt-3">
      <div
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-sm font-semibold"
        style={{
          background: "rgba(10, 6, 20, 0.85)",
          borderColor: completed >= 1 ? "#a855f7" : "#6d28d9",
          color: "#e2d9f3",
          boxShadow: `0 0 12px ${completed >= 1 ? "rgba(168,85,247,0.35)" : "rgba(109,40,217,0.25)"}`,
        }}
      >
        <span>{completed} of 2 Quests Completed</span>
        {completed < 2 && (
          <svg
            className="w-4 h-4 animate-spin"
            style={{ color: "#a855f7" }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {completed >= 2 && (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  )
}
