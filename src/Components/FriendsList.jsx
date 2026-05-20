import { useState } from 'react'
import '../FriendsList.css'

function avatarUrl(name, bgCol) {
  const col = (bgCol || "#e8f3ee").replace("#","")
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&backgroundColor=${col}`
}

export default function FriendsList({ friends, selectedFriend, onSelect }) {
  return (
    <div className="card">
      <p className="section-label">Your Friends ({friends.length})</p>
      <div className="fl-list">
        {friends.map((f, i) => (
          <FriendRow
            key={f.id}
            friend={f}
            index={i}
            selected={selectedFriend?.id === f.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

function FriendRow({ friend, index, selected, onSelect }) {
  const [hover, setHover] = useState(false)
  const isOwed  = friend.balance < 0
  const youOwe  = friend.balance > 0
  const settled = friend.balance === 0
  const avatarSrc = friend.imgUrl?.trim() || avatarUrl(friend.name, friend.bgCol)

  return (
    <div
      className={`fr-row ${selected ? "fr-row--selected" : ""} ${hover ? "fr-row--hover" : ""}`}
      style={{ animationDelay:`${index * 0.06}s` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* avatar */}
      <div className={`fr-avatar ${selected ? "fr-avatar--sel" : ""}`}>
        <img
          src={avatarSrc}
          alt={friend.name}
          onError={e => {
            const fallback = avatarUrl(friend.name, friend.bgCol)
            if (e.target.src !== fallback) {
              e.target.src = fallback
            } else {
              e.target.style.display = "none"
            }
          }}
        />
      </div>

      {/* info */}
      <div className="fr-info">
        <p className="fr-name">{friend.name}</p>
        {settled && <p className="fr-bal fr-bal--neutral">⚖️ All settled up</p>}
        {isOwed  && <p className="fr-bal fr-bal--green">💸 {friend.name} pays you ₨{Math.abs(friend.balance).toLocaleString()}</p>}
        {youOwe  && <p className="fr-bal fr-bal--red">🧾 You pay ₨{friend.balance.toLocaleString()} to {friend.name}</p>}
      </div>

      {/* button */}
      {selected ? (
        <button className="btn-icon"
          onClick={e => { e.stopPropagation(); onSelect(friend) }}>✕</button>
      ) : (
        <button className="btn-pill"
          onClick={e => { e.stopPropagation(); onSelect(friend) }}>Split →</button>
      )}
    </div>
  )
}