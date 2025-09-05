import { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  displayName: string
  photoURL?: string
  xp: number
  level: number
}

export interface VolleyEvent {
  id?: string
  title: string
  timestamp: number
  dateISO: string
  location: string
  spots: number
  skill: 'Casual' | 'Competitive' | 'Pro'
  hostUid: string
  attendees?: string[]
}

type Comment = {
  id: string
  text: string
  uid: string
  displayName: string
  createdAt?: Timestamp
}

import { Timestamp } from 'firebase/firestore'

interface ChatMessage {
  id: string
  text: string
  uid: string
  displayName: string
  createdAt: Timestamp
}



