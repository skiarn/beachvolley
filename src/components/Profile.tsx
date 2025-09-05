import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import type { UserProfile } from '../types'

export default function Profile(){
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(()=>{
    const u = auth.currentUser
    if(!u) return
    const pDoc = doc(db, 'profiles', u.uid)
    const unsub = onSnapshot(pDoc, snap => {
      if(!snap.exists()){
        setDoc(pDoc, { uid: u.uid, displayName: u.displayName, photoURL: u.photoURL, xp: 0, level: 1 }, { merge: true })
      }
      setProfile(snap.data() as UserProfile)
    })
    return () => unsub()
  }, [])

  if(!auth.currentUser) return <div>Please sign in to view your profile</div>
  if(!profile) return <div>Loading profile...</div>

  const gainXP = async (n=10) => {
    const pDoc = doc(db, 'profiles', auth.currentUser!.uid)
    const nextXP = (profile.xp || 0) + n
    const nextLevel = Math.floor(nextXP / 100) + 1
    await setDoc(pDoc, { xp: nextXP, level: nextLevel }, { merge: true })
  }

  return (
    <div className="bg-white/60 p-4 rounded">
      <div className="flex items-center gap-4">
        <img src={profile.photoURL} className="w-16 h-16 rounded-full" />
        <div>
          <div className="font-bold text-lg">{profile.displayName}</div>
          <div className="text-sm">Level {profile.level} · XP {profile.xp}</div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={() => gainXP(25)} className="px-3 py-1 bg-amber-400 rounded">Play a match (+25 XP)</button>
        <p className="mt-2 text-sm text-gray-600">XP helps you level up and unlock titles like <em>Sand Master</em> or <em>Volley Legend</em>.</p>
      </div>
    </div>
  )
}
