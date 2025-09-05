import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, orderBy, onSnapshot as onSnap, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'
import Chat from './Chat'
import type { VolleyEvent, Comment } from '../types'

export default function EventPage(){
  const { id } = useParams()
  const [event, setEvent] = useState<VolleyEvent | null>(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(()=>{
    if(!id) return
    const d = doc(db, 'events', id)
    const unsub = onSnapshot(d, snap => { setEvent({ id: snap.id, ...snap.data() } as VolleyEvent) })
    const q = query(collection(db, `events/${id}/comments`), orderBy('createdAt', 'asc'))
    const unsubC = onSnap(q, snap => setComments(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Comment, 'id'>) }))))
    return () => { unsub(); unsubC(); }
  }, [id])

  if(!event) return <div>Loading...</div>

  const joined = auth.currentUser && (event.attendees || []).includes(auth.currentUser.uid)

  const toggleJoin = async () => {
    if(!auth.currentUser) return alert('Sign in')
    const d = doc(db, 'events', id!)
    if(joined) await updateDoc(d, { attendees: arrayRemove(auth.currentUser.uid) })
    else await updateDoc(d, { attendees: arrayUnion(auth.currentUser.uid) })
  }

  const postComment = async () => {
    if(!auth.currentUser) return alert('Sign in')
    await addDoc(collection(db, `events/${id}/comments`), {
      text: comment,
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: serverTimestamp()
    })
    setComment('')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/60 p-4 rounded">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <div className="text-sm text-gray-600">{event.dateISO} · {event.location} · {event.skill}</div>
        <div className="mt-2">Players: {(event.attendees||[]).length}/{event.spots}</div>
        <div className="mt-2">
          <button onClick={toggleJoin} className={`px-3 py-1 rounded ${joined ? 'bg-gray-300' : 'bg-amber-400'}`}>{joined ? 'Leave' : 'Join'}</button>
        </div>
      </div>

      <div className="bg-white/60 p-4 rounded">
        <h3 className="font-semibold mb-2">Comments</h3>
        <div className="space-y-2">
          {comments.map(c=> (
            <div key={c.id} className="p-2 bg-white rounded shadow-sm">
              <div className="text-sm font-medium">{c.displayName}</div>
              <div className="text-sm">{c.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input className="flex-1 p-2 border rounded" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Leave a comment" />
          <button onClick={postComment} className="px-3 py-1 bg-blue-500 text-white rounded">Post</button>
        </div>
      </div>

      <Chat eventId={id!} />

    </div>
  )
}

