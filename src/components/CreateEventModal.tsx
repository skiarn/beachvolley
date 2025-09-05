import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'

export default function CreateEventModal({ open, onClose }: { open: boolean, onClose: () => void }){
  const [title, setTitle] = useState('')
  const [dateISO, setDateISO] = useState('')
  const [location, setLocation] = useState('Beach Court')
  const [spots, setSpots] = useState(4)
  const [skill, setSkill] = useState<'Casual'|'Competitive'|'Pro'>('Casual')

  const handleChangeSkill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'Casual' | 'Competitive' | 'Pro';
    setSkill(value);
  };
  if(!open) return null

  const create = async () => {
    if(!auth.currentUser) return alert('Please sign in to create a game')
    await addDoc(collection(db, 'events'), {
      title,
      dateISO,
      location,
      spots,
      skill,
      hostUid: auth.currentUser.uid,
      attendees: [auth.currentUser.uid],
      timestamp: Date.now(),
      createdAt: serverTimestamp(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-semibold mb-2">Create Game</h2>
        <input className="w-full mb-2 p-2 border rounded" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input className="w-full mb-2 p-2 border rounded" type="datetime-local" value={dateISO} onChange={e=>setDateISO(e.target.value)} />
        <input className="w-full mb-2 p-2 border rounded" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" />
        <div className="flex gap-2 mb-2">
          <select value={skill} onChange={handleChangeSkill} className="p-2 border rounded">
            <option>Casual</option>
            <option>Competitive</option>
            <option>Pro</option>
          </select>
          <input className="p-2 border rounded w-24" type="number" min={2} max={12} value={spots} onChange={e=>setSpots(Number(e.target.value))} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button onClick={create} className="px-3 py-1 bg-amber-400 rounded">Create</button>
        </div>
      </div>
    </div>
  )
}
