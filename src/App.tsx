import { Routes, Route, Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Auth from "./components/Auth"
import EventList from "./components/EventList"
import EventPage from "./components/EventPage"
import Profile from "./components/Profile"


export default function App() {
  const location = useLocation()


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 via-white to-amber-50">
      <header className="bg-white/70 backdrop-blur sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-extrabold">🏐 BeachVolley</Link>
          <nav className="flex gap-3 items-center text-sm sm:text-base">
            <Link to="/">Games</Link>
            <Link to="/profile">Profile</Link>
            <Auth />
          </nav>
        </div>
      </header>


      <main className="flex-1 max-w-4xl mx-auto p-2 sm:p-4 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Routes location={location}>
              <Route path="/" element={<EventList />} />
              <Route path="/event/:id" element={<EventPage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}