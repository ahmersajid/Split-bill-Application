import { useState } from 'react'
import './App.css'
import AddFriendForm from './Components/AddFriend'
import FriendsList   from './Components/FriendsList'
import SplitBill     from './Components/SplitBill'

const COLORS = ["#d4f0e4","#dbeafe","#fde8f0","#fef3c7","#ede9fe","#fce7f3"]

const INIT_FRIENDS = [
  {
    id: 1,
    name: "John Doe",
    bgCol: "#d4f0e4",
    imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3B5YfV77sehcB_I4--2g4P3Ap5T2MAnGV6h0XOFm3tQ&s",
    balance: 0,
  },
  {
    id: 2,
    name: "Olivia Smith",
    bgCol: "#dbeafe",
    imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYVfqvHNHRFrDFMxO7zqQ7hcL8SGd9MUOC7pR3w9cAFw&s",
    balance: 0,
  },
  {
    id: 3,
    name: "Alice Johnson",
    bgCol: "#fde8f0",
    imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6K-82HiFDtkG1kE6palDNgFmo9wIupWD76zLdMSdVTg&s",
    balance: 0,
  },
]

export default function App() {
  const [friends, setFriends]               = useState(INIT_FRIENDS)
  const [selectedFriendId, setSelectedFriendId] = useState(null)
  const [view, setView]                     = useState("list") // "list" | "add"

  const selectedFriend = selectedFriendId
    ? friends.find(f => f.id === selectedFriendId) ?? null
    : null

  const handleSelect = (f) => {
    setSelectedFriendId(prev => prev === f.id ? null : f.id)
    setView("list")
  }

  const totalOwed = friends.filter(f => f.balance < 0).reduce((s,f) => s + Math.abs(f.balance), 0)
  const totalYouOwe = friends.filter(f => f.balance > 0).reduce((s,f) => s + f.balance, 0)

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="logo-wrap">
          <div className="logo-icon">🤝</div>
          <div>
            <h1 className="logo-title">Split<span>Buddy</span></h1>
            <p className="logo-sub">Track shared expenses, effortlessly</p>
          </div>
        </div>
        <div className="summary-chips">
          <div className="chip" style={{background:"var(--mint-light)",border:"1.5px solid #3db87a33"}}>
            <span>💸</span>
            <span style={{color:"var(--txt2)",fontWeight:600}}>You'll receive</span>
            <span style={{color:"var(--mint-dark)",fontWeight:800}}>₨{totalOwed.toLocaleString()}</span>
          </div>
          <div className="chip" style={{background:"var(--rose-light)",border:"1.5px solid #f27e7e33"}}>
            <span>🧾</span>
            <span style={{color:"var(--txt2)",fontWeight:600}}>You pay</span>
            <span style={{color:"var(--rose-dark)",fontWeight:800}}>₨{totalYouOwe.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="app-body">
        {/* Left */}
        <div className="left-col">
          {/* Tab bar */}
          <div className="tab-bar">
            <button className={`tab-btn ${view==="list" ? "active":""}`} onClick={() => setView("list")}>
              👥 Friends
            </button>
            <button className={`tab-btn ${view==="add" ? "active":""}`}
              onClick={() => { setView("add"); setSelectedFriendId(null) }}>
              ＋ Add Friend
            </button>
          </div>

          {view === "list" ? (
            <FriendsList friends={friends} selectedFriend={selectedFriend} onSelect={handleSelect} />
          ) : (
            <AddFriendForm
              friends={friends}
              setFriends={setFriends}
              colors={COLORS}
              onDone={() => setView("list")}
            />
          )}
        </div>

        {/* Right */}
        <div className="right-col">
          {selectedFriend ? (
            <SplitBill
              key={selectedFriend.id}
              friend={selectedFriend}
              setFriends={setFriends}
              onClose={() => setSelectedFriendId(null)}
            />
          ) : (
            <div className="card empty-panel">
              <div className="empty-float">👆</div>
              <p style={{fontSize:18,fontWeight:700,color:"var(--txt2)"}}>Select a Friend</p>
              <p style={{fontSize:14,color:"var(--txt3)",maxWidth:200,lineHeight:1.7}}>
                Pick someone from the list to start splitting a bill
              </p>
              <div style={{
                padding:"7px 18px", background:"var(--mint-light)",
                borderRadius:"var(--r-full)", fontSize:12, fontWeight:700,
                color:"var(--mint-dark)", border:"1.5px solid var(--sage-light)"
              }}>Tap "Split →" on any friend</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}