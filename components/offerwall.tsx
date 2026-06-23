"use client"

import { useEffect, useState } from "react"

interface Offer {
  id: string
  name: string
  description: string
  payout: number
  picture: string
  url: string
}

interface OfferwallProps {
  s1?: string
  s2?: string
  apiUrl?: string
  hiddenOffers?: string[] // Accepts the list of completed task IDs to hide
  onOfferClick?: () => void
}

export function Offerwall({ s1 = "", s2 = "", apiUrl = "", hiddenOffers = [], onOfferClick }: OfferwallProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiUrl) return

    const fetchOffers = async () => {
      try {
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error("Failed to fetch offers")
        const data = await res.json()
        setOffers(data.offers || [])
      } catch (err) {
        setError("Failed to load offers. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [apiUrl])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-10 h-10 border-4 border-[#56ab2f] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading offers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  // Filter out the completed offers, then grab the top 5 remaining ones
  const displayOffers = offers
    .filter((offer) => !hiddenOffers.includes(offer.id))
    .slice(0, 5)

  if (displayOffers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-sm text-gray-500">No new offers available at this time.</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {displayOffers.map((offer, index) => (
        <a
          key={offer.id}
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onOfferClick?.()}
          className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3 transition-all duration-200 group relative"
        >
          {index < 2 && (
            <div className="absolute -top-2 -left-2 bg-[#56ab2f] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              EASIEST
            </div>
          )}

          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-gray-900 font-medium text-sm leading-tight mb-1">
              {offer.name}
            </h3>
            <p className="text-gray-500 text-xs leading-snug">
              {offer.description}
            </p>
          </div>

          <button className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
            Start
          </button>
        </a>
      ))}
    </div>
  )
                         }
      
