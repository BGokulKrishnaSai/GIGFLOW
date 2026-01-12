import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import socketService from '../services/socketService'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const { id: gigId } = useParams()
  const { user } = useSelector((s) => s.auth)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [otherUser, setOtherUser] = useState(null)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        // Load messages
        const res = await api.get(`/messages/${gigId}`)
        setMessages(res.data.data || [])

        // Load gig to determine participants
        const gigRes = await api.get(`/gigs/${gigId}`)
        const gig = gigRes.data.data
        const ownerId = gig.ownerId?._id || gig.ownerId
        const assignedTo = gig.assignedTo?._id || gig.assignedTo

        let other = null
        if (user._id === ownerId && assignedTo) other = assignedTo
        if (user._id === assignedTo && ownerId) other = ownerId
        setOtherUser(other)
      } catch (err) {
        console.error('Failed to load messages or gig', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()

    let socket = socketService.getSocket()
    if (!socket && user?._id) {
      socket = socketService.connect(user._id)
    }

    const handler = (msg) => {
      const incoming = msg.data ? msg.data : msg
      setMessages((m) => [...m, incoming])
    }

    if (socket) socket.on('message', handler)
    return () => {
      if (socket) socket.off('message', handler)
    }
  }, [gigId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!text.trim()) return
    try {
      // Determine recipient: prefer the derived otherUser, fallback to message history
      let other = otherUser
      if (!other && messages.length > 0) {
        other = messages[0].from._id === user._id ? messages[0].to._id : messages[0].from._id
      }

      if (!other) {
        alert('No participant to send message to yet.')
        return
      }

      const payload = { gigId, to: other, text }
      const res = await api.post('/messages', payload, { withCredentials: true })
      setMessages((m) => [...m, res.data.data])
      setText('')
    } catch (err) {
      console.error('Failed to send', err)
      alert('Failed to send message')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-4 sm:py-8">
      <div className="w-full max-w-2xl flex flex-col flex-1 bg-white rounded-lg shadow-lg border border-gray-200 mx-0 sm:mx-auto" style={{ minHeight: 400 }}>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold">Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-2 sm:py-4" style={{ minHeight: 300, maxHeight: 500 }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${m.from._id === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-2xl px-3 sm:px-4 py-2 max-w-[85vw] sm:max-w-xs break-words shadow text-sm relative ${
                      m.from._id === user._id
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <div className="font-semibold mb-1 text-xs opacity-80">
                      {m.from._id === user._id ? 'You' : m.from.name}
                    </div>
                    <div>{m.text}</div>
                    <div className="flex items-center justify-end gap-1 text-[10px] opacity-60 mt-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {m.from._id === user._id && (
                        <span className="ml-1">
                          {m.seen ? (
                            <span title="Seen">✔✔</span>
                          ) : (
                            <span title="Sent">✔</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
        <div className="px-2 sm:px-6 py-3 border-t border-gray-200 flex gap-2 bg-gray-50">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-2xl px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            placeholder="Type a message..."
            onKeyDown={e => { if (e.key === 'Enter') send() }}
          />
          <button
            onClick={send}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-2xl font-semibold hover:bg-blue-700 transition text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
