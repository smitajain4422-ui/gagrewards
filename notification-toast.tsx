'use client'

import { useState, useEffect } from 'react'

interface Toast {
  id: number
  username: string
  location: string
  amount: string
}

const T1_LOCATIONS = [
  'Texas', 'California', 'New York', 'Florida', 'Illinois',
  'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow',
  'Sydney', 'Melbourne', 'Brisbane', 'Toronto', 'Vancouver'
]

// Roblox-style usernames
const ROBLOX_USERNAMES = [
  'xXProGamer2015Xx', 'NoobSlayer9000', 'CoolKid_Official', 'DarkNinja777', 'EpicPlayer2024',
  'GamerBoy_YT', 'ItzShadow', 'ProBuilder123', 'RobloxKing99', 'SkillzMaster',
  'xBlueWolf', 'DragonSlayerX', 'NinjaWarrior88', 'TheRealGamer', 'LegendaryPro',
  'SuperNoob101', 'MegaGamer_HD', 'iPlay4Fun', 'BeastMode2025', 'xXDarkLordXx',
  'GamingWithAlex', 'ProGamerGirl', 'ItzMeJake', 'CoolDude5000', 'NightmareKid',
  'FastRunner99', 'BuilderPro_YT', 'RobloxQueen22', 'ShadowNinja_X', 'EliteGamer77'
]

const AMOUNTS = ['5,000', '7,500', '10,000', '15,000', '20,000', '25,000']

export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [nextId, setNextId] = useState(0)

  useEffect(() => {
    const showNotification = () => {
      const randomDelay = Math.random() * 30000 + 30000 // 30-60 seconds
      
      const timer = setTimeout(() => {
        const newToast: Toast = {
          id: nextId,
          username: ROBLOX_USERNAMES[Math.floor(Math.random() * ROBLOX_USERNAMES.length)],
          location: T1_LOCATIONS[Math.floor(Math.random() * T1_LOCATIONS.length)],
          amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)]
        }
        
        setToasts(prev => [...prev, newToast])
        setNextId(prev => prev + 1)

        // Remove toast after 4 seconds
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id))
        }, 4000)
      }, randomDelay)

      return () => clearTimeout(timer)
    }

    showNotification()
  }, [nextId])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-400/50 rounded-lg p-3 shadow-lg animate-slide-in max-w-xs"
        >
          <p className="text-sm text-white">
            <span className="font-semibold">{toast.username}</span> from <span className="font-semibold">{toast.location}</span> just claimed <span className="text-yellow-300 font-bold">{toast.amount} Robux</span>!
          </p>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// Brainrot-specific notification toast
interface BrainrotToast {
  id: number
  username: string
  location: string
  brainrot: string
}

const BRAINROTS = [
  'Spyder Elephant', 'Strawberry Elephant', 'John Pork', 'Mythic Lucky Block',
  'Tung Tung Tung Sahur', 'Secret Lucky Block', 'Headless Horseman', 'Meowl',
  'Robo Grafito', 'Glaciator', 'Rubrikiko'
]

export function BrainrotNotificationToast() {
  const [toasts, setToasts] = useState<BrainrotToast[]>([])
  const [nextId, setNextId] = useState(0)

  useEffect(() => {
    const showNotification = () => {
      const randomDelay = Math.random() * 30000 + 30000 // 30-60 seconds
      
      const timer = setTimeout(() => {
        const newToast: BrainrotToast = {
          id: nextId,
          username: ROBLOX_USERNAMES[Math.floor(Math.random() * ROBLOX_USERNAMES.length)],
          location: T1_LOCATIONS[Math.floor(Math.random() * T1_LOCATIONS.length)],
          brainrot: BRAINROTS[Math.floor(Math.random() * BRAINROTS.length)]
        }
        
        setToasts(prev => [...prev, newToast])
        setNextId(prev => prev + 1)

        // Remove toast after 4 seconds
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id))
        }, 4000)
      }, randomDelay)

      return () => clearTimeout(timer)
    }

    showNotification()
  }, [nextId])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-gradient-to-r from-orange-900 to-orange-800 border border-orange-400/50 rounded-lg p-3 shadow-lg animate-slide-in max-w-xs"
        >
          <p className="text-sm text-white">
            <span className="font-semibold">{toast.username}</span> from <span className="font-semibold">{toast.location}</span> just got <span className="text-yellow-300 font-bold">{toast.brainrot}</span>!
          </p>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
