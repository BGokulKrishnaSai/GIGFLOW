import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import socketService from '../services/socketService'
import { useSelector } from 'react-redux'

export default function Chat() {
  const { id: gigId } = useParams()
  const { user } = useSelector((s) => s.auth)
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])  // New: Users list
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [otherUser, setOtherUser] = useState(null)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  // ✅ FIXED: Load public users + gig-specific messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 1. Public users list (always works)
        const usersRes = await api.get('/messages')
        setUsers(usersRes.data.users || [])

        // 2. Try gig messages (fails gracefully if no auth/gig)
        try {
          const res = await api.get(`/messages/${gigId}`)
          setMessages(res.data.data || [])
        } catch (gigErr) {
          console.log('Gig chat requires login:', gigErr)
          setMessages([])
        }

        // 3. Load gig for participants (optional)
        try {
          const gigRes = await api.get(`/gigs/${gigId}`)
          const gig = gigRes.data.data
          const ownerId = gig.ownerId?._id || gig.ownerId
          const assignedTo = gig.assignedTo?._id || gig.assignedTo
          
          let other = null
          if (user?._id === ownerId && assignedTo) other = assignedTo
          if (user?._id === assignedTo && ownerId) other = ownerId
          setOtherUser(other)
        } catch (gigErr) {
          console.log('Gig not found, using demo chat')
        }
      } catch (err) {
        console.error('Chat load error:', err)
        setUsers([])
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Socket (existing logic perfect)
    let socket = socketService.getSocket()
    if (!socket && user?._id) {
      socket = socketService.connect(user._id)
    }

    const handler = (msg) => {
      const incoming = msg.data ? msg.data : msg
      setMessages((m) => [...m, incoming])
    }

    if (socket) socket.on('message', handler)
    return () => socket?.off('message', handler)
  }, [gigId, user?._id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!text.trim()) return
    if (!user?._id) {
      alert('Please login to send messages')
      navigate('/login')
      return
    }

    try {
      let other = otherUser
      if (!other && users.length > 0) {
        other = users[0]._id  // Fallback to first user
      }

      if (!other) {
        alert('No recipient available')
        return
      }

      const payload = { gigId, to: other, text }
      const res = await api.post('/messages', payload)
      setMessages((m) => [...m, res.data.data || res.data])
      setText('')
    } catch (err) {
      console.error('Send failed:', err)
      alert('Failed to send (check login)')
    }
  }

  if (!gigId) {
    return <div className="p-8 text-center">Select a gig to chat</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-4 sm:py-8">
      <div className="w-full max-w-4xl flex flex-col bg-white rounded-lg shadow-lg border mx-4 sm:mx-auto" style={{ minHeight: 500 }}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Chat #{gigId.slice(-4)}</h2>
          <div className="text-sm text-gray-500">
            {users.length} users online
          </div>
        </div>

        {/* Users Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto bg-gray-50 hidden md:block">
            <h3 className="font-semibold mb-3">Users ({users.length})</h3>
            {users.map(user => (
              <div key={user._id} className="p-2 hover:bg-gray-200 rounded cursor-pointer mb-1">
                {user.avatar || '👤'} {user.name}
              </div>
            ))}
            {!users.length && <p className="text-gray-500">No users</p>}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-center text-gray-500 py-8">Loading chat...</p>
              ) : messages.length ? (
                messages.map((m) => (
                  <div
                    key={m._id || Math.random()}
                    className={`flex mb-3 ${m.from?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl shadow ${
                      m.from?._id === user?._id
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white border rounded-bl-none shadow-lg'
                    }`}>
                      <div className="font-semibold text-sm mb-1">
                        {m.from?.name || m.from || 'Unknown'}
                      </div>
                      <div className="text-sm">{m.text || m.content}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                />
                <button
                  onClick={send}
                  disabled={!text.trim() || !user}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
