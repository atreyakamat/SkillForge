import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { peerAPI } from '../services/api.js'

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

  async function sendRequest({ to, skills, message, deadline }) {
    const optimistic = { id: crypto.randomUUID(), to, skills, message, deadline, status: 'sending', ts: Date.now() }
    setRequests((r) => [optimistic, ...r])
    try {
      const res = await peerAPI.requestReview({ to, skills, message, deadline })
      const saved = res.data?.request || res.data
      setRequests((r) => [saved, ...r.filter(x => x.id !== optimistic.id)])
      addNotification(`Review request sent to ${to?.name || to?.email || 'user'}`)
      return saved
    } catch (err) {
      setRequests((r) => r.filter(x => x.id !== optimistic.id))
      throw err
    }
  }

  function updateRequestStatus(id, status) {
    setRequests((r) => r.map(x => x.id === id ? { ...x, status } : x))
  }

  async function submitReview({ requestId, forUser, skills, anonymous, comments, confidence }) {
    const optimistic = { id: crypto.randomUUID(), requestId, forUser, skills, anonymous, comments, confidence, ts: Date.now(), status: 'submitting' }
    setReviews((rs) => [optimistic, ...rs])
    try {
      const res = await peerAPI.submitReviewForRequest(requestId, { forUser, skills, anonymous, comments, confidence })
      const saved = res.data?.review || res.data
      setReviews((rs) => [saved, ...rs.filter(x => x.id !== optimistic.id)])
      addNotification('Peer review submitted')
      return saved
    } catch (err) {
      setReviews((rs) => rs.filter(x => x.id !== optimistic.id))
      throw err
    }
  }

  async function loadReviews(params) {
    const res = await peerAPI.getReviews(params)
    const items = res.data?.reviews || res.data || []
    setReviews(items)
    return items
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
    loadReviews,
  }), [reviews, requests, notifications])

  return <PeerReviewContext.Provider value={value}>{children}</PeerReviewContext.Provider>
}

export function usePeerReview() {
  const ctx = useContext(PeerReviewContext)
  if (!ctx) throw new Error('usePeerReview must be used within PeerReviewProvider')
  return ctx
}


