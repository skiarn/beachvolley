import { useEffect, useState, useRef } from 'react'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatMessage } from '../types'

export default function Chat({ eventId }: { eventId: string }){
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    const q = query(collection(db, `events/${eventId}/chat`), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, snap => setMessages(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChatMessage, 'id'>) }))))
    return () => unsub()
  }, [eventId])

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async ()=>{
    if(!auth.currentUser) return alert('Sign in')
    if(!text.trim()) return
    await addDoc(collection(db, `events/${eventId}/chat`), {
      text,
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: serverTimestamp()
    })
    setText('')
  }

  return (
    <div className="bg-white/60 p-4 rounded">
      <h3 className="font-semibold mb-2">Game Chat</h3>
      <div className="h-48 overflow-y-auto p-2 space-y-2 bg-white rounded">
              <AnimatePresence>
                {messages.map(m=> (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm bg-amber-50 rounded p-1"
                  >
                    <div className="font-medium">{m.displayName}</div>
                    <div>{m.text}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={endRef} />
            </div>
      <div className="mt-2 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Say something..." className="flex-1 p-2 border rounded" />
        <button onClick={send} className="px-3 py-1 bg-green-500 text-white rounded">Send</button>
      </div>
    </div>
  )
}
