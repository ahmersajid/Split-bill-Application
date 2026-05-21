import { useState } from 'react'
import '../FriendsList.css'

// Fallback to DiceBear avatar when imgUrl is missing or broken
function avatarUrl(name, bgCol) {
  const col = (bgCol || '#e8f3ee').replace('#', '')
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&backgroundColor=${col}`
}

// ── FriendsList ───────────────────────────────────────────────────────────────
// friends array order: default friends (id 1,2,3) always first,
// newly added friends appended at the end — so index = natural position.
export default function FriendsList({ friends, selectedFriend, onSelect }) {
  return (
    <div className="card">
      <p className="section-label">Your Friends ({friends.length})</p>

      {/* max-height = 4 rows (312px) — scrollbar appears from the 5th friend */}
      <div className="fl-list">
        {friends.map((f, i) => (
          <FriendRow
            key={f.id}
            friend={f}
            index={i}          // position in array (0-based), shown as i+1 badge
            selected={selectedFriend?.id === f.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

// ── FriendRow ─────────────────────────────────────────────────────────────────
function FriendRow({ friend, index, selected, onSelect }) {
  const [hover, setHover] = useState(false)

  const isOwed  = friend.balance < 0   // friend owes you
  const youOwe  = friend.balance > 0   // you owe the friend
  const settled = friend.balance === 0

  const avatarSrc = friend.imgUrl?.trim() || avatarUrl(friend.name, friend.bgCol)

  const handleError = (e) => {
    const fallback = avatarUrl(friend.name, friend.bgCol)
    if (e.target.src !== fallback) {
      e.target.src = fallback
    } else {
      e.target.style.display = 'none'
    }
  }

  return (
    <div
      className={[
        'fr-row',
        selected ? 'fr-row--selected' : '',
        hover    ? 'fr-row--hover'    : '',
      ].join(' ')}
      style={{ animationDelay: `${index * 0.06}s` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Index badge — shows 1-based position; default friends stay #1 #2 #3 */}
      <span className={`fr-index ${selected ? 'fr-index--selected' : ''}`}>
        #{index + 1}
      </span>

      {/* Avatar */}
      <div className={`fr-avatar ${selected ? 'fr-avatar--sel' : ''}`}>
        <img src={avatarSrc} alt={friend.name} onError={handleError} />
      </div>

      {/* Info */}
      <div className="fr-info">
        <p className="fr-name">{friend.name}</p>

        {settled && (
          <p className="fr-bal fr-bal--neutral">⚖️ All settled up</p>
        )}
        {isOwed && (
          <p className="fr-bal fr-bal--green">
            💸 {friend.name} pays you ₨{Math.abs(friend.balance).toLocaleString()}
          </p>
        )}
        {youOwe && (
          <p className="fr-bal fr-bal--red">
            🧾 You pay ₨{friend.balance.toLocaleString()} to {friend.name}
          </p>
        )}
      </div>

      {/* Action button */}
      {selected ? (
        <button
          className="btn-icon"
          onClick={(e) => { e.stopPropagation(); onSelect(friend) }}
          title="Deselect"
        >
          ✕
        </button>
      ) : (
        <button
          className="btn-pill"
          onClick={(e) => { e.stopPropagation(); onSelect(friend) }}
        >
          Split →
        </button>
      )}
    </div>
  )
}