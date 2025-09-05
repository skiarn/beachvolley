import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import CreateEventModal from './CreateEventModal'
import type { VolleyEvent } from '../types'

export default function EventList() {
    const [events, setEvents] = useState<VolleyEvent[]>([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const q = query(collection(db, 'events'), orderBy('timestamp', 'asc'))
        const unsub = onSnapshot(q, (snap) => {
            return setEvents(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<VolleyEvent, 'id'>) })))
        })
        return () => unsub()
    }, [])

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Upcoming Games</h1>
                <div>
                    <button onClick={() => setOpen(true)} className="px-3 py-2 rounded bg-amber-400">Create Game</button>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {events.length === 0 && <div className="p-6 bg-white/60 rounded">No games yet — create the first!</div>}
                {events.map(e => (
                    <Link key={e.id} to={`/event/${e.id}`} className="p-4 bg-white/60 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition">
                        <div>
                            <div className="font-semibold">{e.title}</div>
                            <div className="text-sm text-gray-600">{e.dateISO} · {e.location} · {e.skill}</div>
                        </div>
                        <div className="text-sm mt-1 sm:mt-0">{(e.attendees?.length || 0)}/{e.spots}</div>
                    </Link>
                ))}
            </div>

            <CreateEventModal open={open} onClose={() => setOpen(false)} />
        </div>
    )
}