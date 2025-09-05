import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EventList from '../components/EventList'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('../firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}))


describe('EventList', () => {
  it('renders heading', () => {
    render(
      <MemoryRouter>
        <EventList />
      </MemoryRouter>
    )
    expect(screen.getByText(/Upcoming Games/i)).toBeInTheDocument()
  })
})