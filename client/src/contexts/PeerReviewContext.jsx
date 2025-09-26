import { createContext, useContext, useMemo, useRef, useState } from 'react'

const PeerReviewContext = createContext(null)

export function PeerReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]) // given/received reviews
  const [requests, setRequests] = useState([]) // review requests
  const [notifications, setNotifications] = useState([])
  const idRef = useRef(1)

  function addNotification(message) {
    const id = idRef.current++
    const note = { id, message, read: false, ts: Date.now() }
    setNotifications((n) => [note, ...n].slice(0, 20))
    return id
  }

  function markNotificationRead(id) {
    setNotifications((n) => n.map(x => x.id === id ? { ...x, read: true } : x))
  }

  function sendRequest({ to, skills, message, deadline }) {
    const req = { id: crypto.randomUUID(), to, skills, message, deadline, status: 'sent', ts: Date.now() }
    setRequests((r) => [req, ...r])
    addNotification(`Review request sent to ${to?.name || to?.email || 'user'}`)
    return req
  }

  function updateRequestStatus(id, status) {
    setRequests((r) => r.map(x => x.id === id ? { ...x, status } : x))
  }

  function submitReview({ forUser, skills, anonymous, comments, confidence }) {
    const rv = { id: crypto.randomUUID(), forUser, skills, anonymous, comments, confidence, ts: Date.now() }
    setReviews((rs) => [rv, ...rs])
    addNotification('Peer review submitted')
    return rv
  }

  const value = useMemo(() => ({
    reviews,
    requests,
    notifications,
    addNotification,
    markNotificationRead,
    sendRequest,
    updateRequestStatus,
    submitReview,
  }), [reviews, requests, notifications])

  return <PeerReviewContext.Provider value={value}>{children}</PeerReviewContext.Provider>
}

export function usePeerReview() {
  const ctx = useContext(PeerReviewContext)
  if (!ctx) throw new Error('usePeerReview must be used within PeerReviewProvider')
  return ctx
}


