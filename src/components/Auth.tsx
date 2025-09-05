import { useEffect, useState } from 'react'
import { auth, googleProvider } from '../firebase'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'

export default function Auth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  if (!user) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => signInWithPopup(auth, googleProvider)}
          className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
        >Sign in</button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <img src={user.photoURL ?? undefined} alt="avatar" className="w-8 h-8 rounded-full" />
      <span className="text-sm">{user.displayName}</span>
      <button onClick={() => signOut(auth)} className="px-2 py-1 text-sm">Sign out</button>
    </div>
  )
}
