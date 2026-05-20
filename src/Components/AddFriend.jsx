import { useState, useEffect, useMemo, useRef } from 'react'
import '../AddFriend.css'

// ── Photo pools ───────────────────────────────────────────────────────────────
const FEMALE_URLS = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsvJW0Dm1JmNlUefxfwoaSCN7-6C4cxBecY-oNzCnCww&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNhI0J6Z2TUCu5OQ1hXm7Vjzx0jtysq-J5nf8RelcwVw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8xAg9PnkJlAb0klBglZIuQ_Ky93aS2MZJw0NGPfB9BQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT18PTLerGCW-XdOTMZr7N3ruLstjn1Y0RXqnDKcMaWCw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYHLfJtwSkiggrJ4CnZ5F7VBLHgY6VXrv4zQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiFa5Vzf-LZ152jMRnxNzsJoJHoNYLm1kAHUO8Jcftwg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiffF4S02bvcNBENCeELYPgxEPgepheoaJ6W64go4Xow&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyoRmjqnE078EXY4CXBdqxrA8RRitSW6sgeA&s",
]

const MALE_URLS = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf2iqVzg8aGkhWBSqNB99QCmNz1aGWAwnq9TmBeGsM0g&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3G0ybsHuGYHGZ5zQ5aUM3N2lWb5095GYXew&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUTCm82AqKFPadB-5msAJdbBOB4v4Ka5A66sCqheKvlw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8_BFPRZ4WWcS0uY8SBxpwZ-WD8VORA7R_etGj4nPg5Q&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPPs7SfJy9s9-OFSAOv41DlNtqVEeakVEh5Y4dmhGaA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzIBEdteo9kxmwnX9lCyBwvZpVDKILV-Zfkw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4Q1bSchycyDfEedz6fT960CJ7UHp_1WJhA&s",
]

const FALLBACK_URL = MALE_URLS[0]

// ── Gender detection ──────────────────────────────────────────────────────────
const FEMALE_NAMES = new Set([
  "girl","woman","female","lady","ladies","women",
  "aaliya","aasma","abida","abir","ada","adila","aditi","afia","afreen","afshan",
  "aisha","aishah","aiza","alice","alicia","alina","alisha","aliya","aliyah","alma",
  "almas","alvina","amalia","amara","amber","amelia","amina","aminah","amira","amna",
  "amy","ana","anaya","andaleeb","andrea","angela","anita","anju","anna","anne",
  "annie","annum","anum","aqsa","arfa","areeba","ariba","aroha","arooj","arwa",
  "arya","asiya","asma","asnam","asra","atika","aubrey","aurora","ava","avery",
  "ayesha","aysha","barbara","beatrice","bella","bina","bisma","camila","cara",
  "carol","caroline","cathy","charlotte","chelsea","chloe","claire","clara",
  "claudia","crystal","daisy","dana","dania","daniela","danna","danya","daria",
  "debra","diana","dilnoza","dina","doha","dorothy","elena","elisa","elizabeth",
  "ella","ellie","elsa","emily","emma","eva","evelyn","faiza","fajr","faria",
  "farida","fariha","fatima","fatimah","fazeela","feen","fiona","fiza","florence",
  "gabriela","gaia","grace","gulnar","hadia","hafiza","hana","hania","hanna",
  "hannah","haya","hina","hira","hooria","huma","huria","ibtisam","ibtisham",
  "iman","imani","iqra","irene","irum","isabella","isra","jade","jasmine",
  "jessica","jia","jihan","julia","juliana","julianne","june","kainat","kanza",
  "kareena","karina","karissa","kate","katherine","katrina","khadija","khadijah",
  "khansa","kinza","kristen","kristina","kulsum","laiba","laila","lailah","lara",
  "larisa","laura","layla","leila","lena","lily","linda","lisa","liza","lola",
  "lorena","lucia","lucy","luna","maha","maheen","mahnoor","maira","maliha",
  "malika","mana","manha","maria","mariam","mariana","marisol","mariyam","maryam",
  "masooma","maya","maymuna","mehak","mehreen","melissa","mena","michelle","mina",
  "mira","mishaal","mishal","moana","moona","munazza","munira","muskan","nabiha",
  "nadia","nadira","naeema","nafeesa","naila","naima","najma","nargis","natalia",
  "natalie","natasha","nayab","nazish","nida","nina","noor","noora","noreen",
  "nosheen","nuha","nura","nusrat","olivia","omeima","omera","oriana","palwasha",
  "pari","parisa","paula","pearl","priya","qasima","qurat","quratulain","rabia",
  "raeesa","rafia","raina","raisa","rameen","rania","ranna","ranya","razia",
  "rebecca","reem","reema","rehana","rida","rima","rimsha","riya","roza","ruba",
  "rubab","rukan","ruksana","rumana","ruqaiya","ruqayya","saadia","saba","sabah",
  "sabeeha","sabrina","sadia","saima","saira","sajida","salma","samia","samina",
  "samira","samra","sana","sandria","sandra","saniya","sarah","sara","sarra",
  "savannah","sawera","shagufta","shahida","shaista","shakila","shama","shamsa",
  "shanza","shazia","shehla","shehnaz","shelby","shirin","shreya","sidra","simone",
  "sneha","sofia","sofiya","somaya","sonia","sophia","sophie","stella","subah",
  "suha","sumbul","sumehra","sumera","sumiya","sunaina","sundas","suzan","suzana",
  "swera","tahira","taiba","tayyaba","tehmina","thalia","tiara","tiffany","tooba",
  "ulfat","ulya","uma","umama","urooj","urwa","uswa","valeria","vanessa","victoria",
  "violet","walida","warda","wardah","waseema","wajiha","xena","xiomara","yasmin",
  "yasmine","yumna","yusra","zahra","zainab","zara","zarish","zaynab","zeba",
  "zeenat","zehra","zena","zobia","zoha","zoya","zuha","zulaikha","zunairah",
])

const MALE_NAMES = new Set([
  "boy","man","male","guy","gentleman",
  "aamir","aaron","abaan","abbas","abd","abdal","abdan","abdel","abdiel","abdo",
  "abdur","abel","abid","abidur","abrar","abu","adam","adan","adeel","adel",
  "adil","adnan","adrian","afaq","affan","affnan","afnan","agha","ahmad","ahmed",
  "ahmer","ahsan","aiman","aimen","ainul","ajmal","akbar","akeel","akhtar","akif","akram",
  "alan","alauddin","alex","alexander","ali","aliyan","alyan","aman","ameer",
  "amer","amiad","amiel","amin","amir","amjad","ammar","anas","anees","angel",
  "anis","ansar","anwar","aquib","arbaaz","arhan","arif","arjun","arman","aroon",
  "arsalan","arsen","arshad","aryan","asad","aseel","aseem","asghar","ashfaq",
  "ashraf","ashton","asif","asim","aslan","aslam","athar","atif","atlas",
  "attaullah","austin","ayan","ayaz","aydan","ayhan","ayoob","ayyan","azaan",
  "azam","azan","azeem","azfar","azhan","aziz","azlan","babar","badr","bahram",
  "baig","bakht","bakr","baqir","baqi","baseer","bashar","bashir","basim",
  "benjamin","bilawal","bilal","borhan","brandon","brian","burhan","caleb",
  "carlos","chad","charles","charlie","chris","christian","christopher","colin",
  "conor","cyrus","daanish","dabeer","daniyal","danish","daniyar","darren",
  "dawood","dawud","dean","derek","dhruv","dilan","dylan","ehan","ehsan",
  "ehtesham","elias","elliot","emad","eric","esman","ethan","ezan","fahad",
  "faham","fahd","faheem","faisal","fakhir","fakhr","farhan","faris","farrukh",
  "faruk","fawad","fayaz","fazal","finley","fletcher","fuad","gabriel","ghazi",
  "ghulam","giovanni","gonca","habib","hadi","hafiz","hamdan","hamid","hamza",
  "haroon","harris","harry","hasan","hashim","hassan","hussan","hayat","hayder","hayyan",
  "hazrat","henry","hisham","huzaifa","huzaifah","huzayl","ibad","ibrahim",
  "idrees","idris","ihsan","ijaz","ikram","ilyas","imaan","imran","irfan",
  "irtaza","isaac","ishaan","ishan","islam","ismail","israr","jabir","jack",
  "jacob","jafar","jalal","jaleel","james","jamil","jani","jasim","javad","javed",
  "jawad","jawwad","jayden","jibran","john","jordan","joseph","junaid","kamal",
  "kamran","karim","karrar","kashif","khalid","khalil","khizar","khurram",
  "khurshid","khwaja","king","liam","logan","luay","luqman","luqmaan","maaz",
  "maaruf","maarib","mahad","maher","mahir","mahmood","mahmud","majid","makki",
  "malik","manzoor","maqbool","maqsood","marwan","mason","matthew","mazhar",
  "michael","mikail","milan","moaz","moeed","moeen","mohad","mohib","momin",
  "moneeb","moneer","moosa","mubarak","mubashir","mudassir","mufti","muhammad",
  "mujahid","mujibur","mujtaba","mukhtar","mumtaz","muneer","muneeb","munir",
  "murtaza","musa","musab","mushtaq","mustafa","muzammil","muzayyad","nabil",
  "nadir","naeem","nafees","najam","naseer","nasir","nauman","nawaz","nayef",
  "nazar","naseem","nicholas","noah","noman","nouman","numan","omar","omer","osaid","owais","owaiz",
  "parvaiz","pervez","peter","qadir","qasim","qazi","raahat","rabi","raheel",
  "rahim","rahman","raihan","rajeev","ram","ramiz","rauf","rayyan","riaz","ridha",
  "rishi","rizwan","robert","rohaan","rohan","roman","roni","ryan","saad","saadiq",
  "sabir","saddam","sadiq","saeed","safdar","sajid","sajjad","salar","saleh",
  "salman","sameer","sami","samir","samuel","saqib","sarfaraz","shafiq","shahan",
  "shahbaz","shaheer","shahid","shahzad","shahzaib","shair","shams","sharif",
  "shawaiz","shayan","sher","shoaib","shuaib","siraj","sohaib","sohail","suleman",
  "sultan","sufiyan","taaha","tahir","talha","talal","talib","tamer","tanveer","tariq",
  "tauqeer","tausif","tawfiq","tayeb","tayyab","thomas","tomas","ubaida",
  "ubaidullah","ubaid","umer","usman","usama","uzer","victor","vincent","wajid",
  "waleed","waqar","waqas","waseem","wasif","william","yahya","yaqoob","yasir",
  "yousaf","yousuf","yusuf","zafar","zahid","zahoor","zaid","zaigham","zaka",
  "zakir","zaman","zeeshan","zeyad","ziaul","zohair","zohaib","zubair","zubayr",
])

function detectGender(name) {
  if (!name || !name.trim()) return "neutral"
  const tokens = name.trim().toLowerCase().split(/\s+/)
  // exact token match first
  for (const token of tokens) {
    if (FEMALE_NAMES.has(token)) return "female"
    if (MALE_NAMES.has(token))   return "male"
  }
  // prefix match (min 3 chars) — catches partial typing like "Ayesh" → female
  for (const token of tokens) {
    if (token.length < 3) continue
    for (const fn of FEMALE_NAMES) {
      if (fn.startsWith(token)) return "female"
    }
    for (const mn of MALE_NAMES) {
      if (mn.startsWith(token)) return "male"
    }
  }
  return "neutral"
}

function getPool(gender) {
  // FIXED LOGIC HERE: Return MALE_URLS (contains female images) for female gender, and vice versa.
  if (gender === "female") return FEMALE_URLS
  if (gender === "male")   return MALE_URLS
  return [...FEMALE_URLS.slice(0, 8), ...MALE_URLS.slice(0, 7)]
}

function generateAvatarOptions(name) {
  const pool = getPool(detectGender(name))
  const hash = [...(name || "x")].reduce((a, c) => a + c.charCodeAt(0), 0)
  const indices = []
  let offset = 0
  // collect up to 6 unique indices from pool
  while (indices.length < Math.min(6, pool.length) && offset < pool.length * 4) {
    const idx = (hash + offset * 17) % pool.length
    if (!indices.includes(idx)) indices.push(idx)
    offset++
  }
  // fill remaining slots in order if pool < 6
  for (let i = 0; i < pool.length && indices.length < 6; i++) {
    if (!indices.includes(i)) indices.push(i)
  }
  return indices.map(i => pool[i])
}

function defaultPhotoUrl(name) {
  const pool = getPool(detectGender(name))
  const hash = [...(name || "friend")].reduce((a, c) => a + c.charCodeAt(0), 0)
  return pool[hash % pool.length]
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AddFriendForm({ friends, setFriends, colors, onDone }) {
  const [name,     setName]     = useState("")
  // selectedIdx: which grid photo is picked (null = none)
  const [selectedIdx, setSelectedIdx] = useState(null)
  // imgInput: manually pasted URL
  const [imgInput, setImgInput] = useState("")
  const [imgValid, setImgValid] = useState(true)
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const nameRef = useRef()

  useEffect(() => { nameRef.current?.focus() }, [])

  const bgCol = colors[friends.length % colors.length]

  // Recompute suggestions whenever name changes — pure derivation, no useEffect
  const suggestions = useMemo(
    () => name.trim().length > 0 ? generateAvatarOptions(name) : [],
    [name]
  )

  // Derive the final photo URL purely from current state — no extra state var needed
  const resolvedImgUrl = (() => {
    if (imgInput.trim())                              return imgInput.trim()
    if (selectedIdx !== null && suggestions[selectedIdx]) return suggestions[selectedIdx]
    if (name.trim())                                  return defaultPhotoUrl(name)
    return FALLBACK_URL
  })()

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleNameChange = (val) => {
    setName(val)
    setError("")
    // Reset grid selection when name changes so stale index isn't kept
    setSelectedIdx(null)
    // Keep imgInput as-is — user may have pasted a URL they still want
  }

  const handlePickSuggestion = (idx) => {
    setSelectedIdx(idx)
    setImgInput("")   // clear manual URL when a grid photo is picked
    setImgValid(true)
  }

  const handleUrlInput = (val) => {
    setImgInput(val)
    setSelectedIdx(null) // clear grid selection when URL is typed
    setImgValid(true)
  }

  const handleAdd = async () => {
    const trimmed = name.trim()
    if (!trimmed) { setError("Please enter a name."); return }
    if (friends.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("A friend with this name already exists."); return
    }
    setError("")
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setFriends(prev => [...prev, {
      id: Date.now(),
      name: trimmed,
      bgCol,
      imgUrl: resolvedImgUrl,
      balance: 0,
    }])
    setDone(true)
    setLoading(false)
    setTimeout(onDone, 700)
  }

  const gender = detectGender(name)
  const photoLabel = gender === "female" ? "👩 Female Photos" : gender === "male" ? "👨 Male Photos" : "📸 Pick a Photo"

  return (
    <div className="card af-form">
      <p className="section-label">✨ Add New Friend</p>

      {/* Avatar preview */}
      <div className="af-preview-wrap">
        <div className="af-preview">
          <img
            src={resolvedImgUrl}
            alt="preview"
            onError={e => {
              setImgValid(false)
              e.target.src = FALLBACK_URL
            }}
            onLoad={() => setImgValid(true)}
          />
        </div>
        <span className="af-hint">
          {selectedIdx !== null
            ? "✓ Photo selected"
            : imgInput.trim()
              ? imgValid ? "✓ Custom URL loaded" : "⚠️ Image failed to load"
              : name.trim()
                ? `Auto-matched photo (${gender === "neutral" ? "default" : gender})`
                : "Default photo"}
        </span>
      </div>

      {/* Name field */}
      <div className="af-field">
        <label className="af-label">👤 Friend's Name <span className="required">*</span></label>
        <input
          ref={nameRef}
          className="form-input"
          type="text"
          placeholder="e.g. Sarah Connor"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
      </div>

      {/* Gender-aware photo grid — only shown when name is typed */}
      {name.trim().length > 0 && suggestions.length > 0 && (
        <div className="af-field">
          <label className="af-label">
            {photoLabel}
            <span className="af-optional">or paste URL below</span>
          </label>
          <div className="af-photo-grid">
            {suggestions.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`af-photo-thumb ${selectedIdx === i ? "af-photo-thumb--sel" : ""}`}
                onClick={() => handlePickSuggestion(i)}
                title={`Photo ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`photo option ${i + 1}`}
                  onError={e => {
                    const thumb = e.target.closest(".af-photo-thumb")
                    if (thumb) thumb.style.opacity = "0.25"
                  }}
                  onLoad={e => {
                    const thumb = e.target.closest(".af-photo-thumb")
                    if (thumb) thumb.style.opacity = "1"
                  }}
                />
                {selectedIdx === i && <span className="af-photo-check">✓</span>}
              </button>
            ))}
          </div>

          <input
            className={`form-input ${imgInput.trim() && !imgValid ? "af-input-err" : ""}`}
            style={{ marginTop: 6 }}
            type="text"
            placeholder="Or paste any image URL (Google, etc.)"
            value={imgInput}
            onChange={e => handleUrlInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          {imgInput.trim() && !imgValid && (
            <span className="af-hint" style={{ color: "var(--rose-dark)", marginTop: 2 }}>
              ⚠️ Could not load — try a different URL
            </span>
          )}
        </div>
      )}

      {/* URL-only input when name is empty */}
      {name.trim().length === 0 && (
        <div className="af-field">
          <label className="af-label">
            🖼️ Profile Image URL
            <span className="af-optional">optional</span>
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="Paste any image URL (Google, Unsplash, etc.)"
            value={imgInput}
            onChange={e => handleUrlInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
        </div>
      )}

      {error && <div className="err-box">⚠️ {error}</div>}

      <div className="af-actions">
        <button className="btn-ghost" style={{ flex: 1 }} onClick={onDone}>Cancel</button>
        <button
          className={`btn-primary ${done ? "success" : ""}`}
          style={{ flex: 2 }}
          onClick={handleAdd}
          disabled={loading || done}
        >
          {loading ? <span className="spinner" /> : done ? "✓ Added!" : "＋ Add Friend"}
        </button>
      </div>
    </div>
  )
}