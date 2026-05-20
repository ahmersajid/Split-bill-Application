import { useState, useEffect, useRef } from 'react'
import '../SplitBill.css'

function avatarUrl(name, bgCol) {
  const col = (bgCol || "#e8f3ee").replace("#","")
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&backgroundColor=${col}`
}

export default function SplitBill({ friend, setFriends, onClose }) {
  const [bill,    setBill]    = useState("")
  const [myShare, setMyShare] = useState("")
  const [paidBy,  setPaidBy]  = useState("you")  // "you" | "friend"
  const [error,   setError]   = useState("")
  const [done,    setDone]    = useState(false)
  const closeTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current)
      }
    }
  }, [])

  const totalBill  = parseFloat(bill)    || 0
  const myExpense  = parseFloat(myShare) || 0
  const theirShare = totalBill > 0 ? Math.max(0, totalBill - myExpense) : 0
  const pct        = totalBill > 0 ? Math.min(100, Math.round((myExpense / totalBill) * 100)) : 0
  const myShareInvalid = myShare !== "" && (myExpense < 0 || myExpense > totalBill)

  const handleSplit = () => {
    if (!totalBill || totalBill <= 0) { setError("Please enter a valid total bill amount."); return }
    if (myExpense < 0)                { setError("Your expense cannot be negative."); return }
    if (myExpense > totalBill)        { setError("Your expense cannot exceed the total bill."); return }

    setError("")

    /*
      paidBy === "you"    → you paid full bill → friend owes you theirShare
                          → balance -= theirShare  (negative = they owe you)
      paidBy === "friend" → friend paid full bill → you owe them myExpense
                          → balance += myExpense   (positive = you owe them)
    */
    setFriends(prev => prev.map(f => {
      if (f.id !== friend.id) return f
      const delta = paidBy === "you" ? -theirShare : +myExpense
      return { ...f, balance: f.balance + delta }
    }))

    setDone(true)
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
    }
    closeTimer.current = setTimeout(onClose, 1000)
  }

  const handleReset = () => {
    setBill(""); setMyShare(""); setPaidBy("you"); setError(""); setDone(false)
  }

  return (
    <div className="card sb-card">
      {/* header */}
      <div className="sb-header">
        <div className="sb-avatar">
          <img
            src={friend.imgUrl?.trim() || avatarUrl(friend.name, friend.bgCol)}
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
        <div style={{flex:1}}>
          <p className="section-label" style={{marginBottom:2}}>💳 Split a Bill</p>
          <h2 className="sb-title">with {friend.name}</h2>
        </div>
        <button className="btn-icon" onClick={onClose} title="Close">✕</button>
      </div>

      <div className="sb-divider"/>

      {/* live summary strip */}
      {totalBill > 0 && (
        <div className="sb-strip">
          {[
            {label:"You pay",             val:myExpense,  color:"var(--mint-dark)"},
            {label:`${friend.name} pays`, val:theirShare, color:"var(--teal)"},
            {label:"Total",               val:totalBill,  color:"var(--txt2)"},
          ].map((c,i) => (
            <div key={i} className="sb-strip-cell" style={{borderRight: i<2 ? "1px solid var(--bdr)" : "none"}}>
              <p className="sb-strip-label">{c.label}</p>
              <p className="sb-strip-val" style={{color:c.color}}>₨{c.val.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* progress bar */}
      {totalBill > 0 && (
        <div className="sb-progress-wrap">
          <div className="sb-progress-meta">
            <span>Your share</span>
            <span style={{color:"var(--mint-dark)",fontWeight:800}}>{pct}%</span>
          </div>
          <div className="sb-progress-track">
            <div className="sb-progress-fill" style={{width:`${pct}%`}} />
          </div>
        </div>
      )}

      {/* FORM */}
      <div className="sb-form">
        {/* Total bill */}
        <div className="sb-field">
          <label className="af-label">🧾 Total Bill Amount</label>
          <div className={`sb-input-wrap ${myShareInvalid ? "invalid":""}`}>
            <span className="sb-prefix">₨</span>
            <input className="sb-input" type="number" min="0" step="any"
              placeholder="0.00" value={bill}
              onChange={e => { setBill(e.target.value); setError("") }} />
          </div>
        </div>

        {/* Your expense */}
        <div className="sb-field">
          <label className="af-label">🙋 Your Expense</label>
          <div className={`sb-input-wrap ${myShareInvalid ? "invalid":""}`}>
            <span className="sb-prefix">₨</span>
            <input className="sb-input" type="number" min="0" step="any"
              placeholder="0.00" value={myShare}
              onChange={e => { setMyShare(e.target.value); setError("") }} />
          </div>
        </div>

        {/* Friend expense (read-only) */}
        <div className="sb-field">
          <label className="af-label">👤 {friend.name}'s Expense</label>
          <div className="sb-input-wrap sb-input-wrap--ro">
            <span className="sb-prefix sb-prefix--ro">₨</span>
            <input className="sb-input sb-input--ro" type="number" readOnly
              placeholder="Auto-calculated"
              value={theirShare > 0 ? theirShare : ""} />
          </div>
        </div>

        {/* Who paid */}
        <div className="sb-field">
          <label className="af-label">💰 Who Paid the Bill?</label>
          <div className="sb-payer">
            <button
              className={`sb-payer-btn ${paidBy==="you" ? "active":""}`}
              onClick={() => setPaidBy("you")}
            >🙋 You</button>
            <button
              className={`sb-payer-btn ${paidBy==="friend" ? "active":""}`}
              onClick={() => setPaidBy("friend")}
            >👤 {friend.name}</button>
          </div>
        </div>
      </div>

      {error && <div className="err-box">⚠️ {error}</div>}

      {/* outcome hint */}
      {totalBill > 0 && !done && (
        <div className="sb-outcome">
          {paidBy === "you" ? (
            <p>📢 <strong style={{color:"var(--mint-dark)"}}>{friend.name}</strong> pays you{" "}
              <strong style={{color:"var(--mint-dark)"}}>₨{theirShare.toLocaleString()}</strong></p>
          ) : (
            <p>📢 You pay <strong style={{color:"var(--rose-dark)"}}>{friend.name}</strong>{" "}
              <strong style={{color:"var(--rose-dark)"}}>₨{myExpense.toLocaleString()}</strong></p>
          )}
        </div>
      )}

      {/* actions */}
      <div className="sb-actions">
        <button className="btn-ghost" style={{flex:1}} onClick={handleReset}>↺ Reset</button>
        <button
          className={`btn-primary ${done ? "success":""}`}
          style={{flex:2, cursor: done ? "not-allowed":"pointer"}}
          onClick={handleSplit}
          disabled={done}
        >
          {done ? "✓ Done! Settling..." : "🤝 Split Bill"}
        </button>
      </div>
    </div>
  )
}