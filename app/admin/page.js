'use client'
import { useState, useEffect } from 'react'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [content, setContent] = useState({})
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('k_admin') === '1') setAuth(true)
  }, [])

  const login = (e) => {
    e.preventDefault()
    if (user === 'admin' && pass === 'kcabinets2026') {
      localStorage.setItem('k_admin', '1')
      setAuth(true)
    } else setMsg('Invalid credentials')
  }

  const logout = () => { localStorage.removeItem('k_admin'); setAuth(false) }

  useEffect(() => {
    if (auth) fetch('/api/content').then(r => r.json()).then(setContent)
  }, [auth])

  const save = async () => {
    await fetch('/api/content', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(content) })
    setMsg('Saved successfully')
    setTimeout(() => setMsg(''), 2000)
  }

  if (!auth) return (
    <div style={{maxWidth: 360, margin: '120px auto', padding: 24, border: '1px solid #eee'}}>
      <h2 className="serif">Admin Login</h2>
      <form onSubmit={login}>
        <input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0', border:'1px solid #ddd'}} />
        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0', border:'1px solid #ddd'}} />
        <button className="btn" type="submit" style={{width:'100%'}}>Login</button>
      </form>
      {msg && <p style={{color:'red', fontSize:14}}>{msg}</p>}
      <p style={{fontSize:12, color:'#888', marginTop:16}}>Default: admin / kcabinets2026</p>
    </div>
  )

  return (
    <div style={{maxWidth: 720, margin: '40px auto', padding: 24}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 className="serif">Edit Site Content</h2>
        <button onClick={logout} style={{background:'#eee', border:'none', padding:'8px 16px', cursor:'pointer'}}>Logout</button>
      </div>
      {msg && <p style={{color:'green'}}>{msg}</p>}
      <label style={{display:'block', marginTop:16, fontSize:14}}>Hero Title</label>
      <textarea value={content.heroTitle||''} onChange={e => setContent({...content, heroTitle: e.target.value})} style={{width:'100%', padding:10, minHeight:60}} />
      <label style={{display:'block', marginTop:12, fontSize:14}}>Hero Subtitle</label>
      <textarea value={content.heroSubtitle||''} onChange={e => setContent({...content, heroSubtitle: e.target.value})} style={{width:'100%', padding:10, minHeight:60}} />
      <label style={{display:'block', marginTop:12, fontSize:14}}>About Text</label>
      <textarea value={content.aboutText||''} onChange={e => setContent({...content, aboutText: e.target.value})} style={{width:'100%', padding:10, minHeight:100}} />
      <label style={{display:'block', marginTop:12, fontSize:14}}>Phone</label>
      <input value={content.phone||''} onChange={e => setContent({...content, phone: e.target.value})} style={{width:'100%', padding:10}} />
      <label style={{display:'block', marginTop:12, fontSize:14}}>Email</label>
      <input value={content.email||''} onChange={e => setContent({...content, email: e.target.value})} style={{width:'100%', padding:10}} />
      <label style={{display:'block', marginTop:12, fontSize:14}}>Address</label>
      <input value={content.address||''} onChange={e => setContent({...content, address: e.target.value})} style={{width:'100%', padding:10}} />
      <button className="btn" onClick={save} style={{marginTop:20}}>Save Changes</button>
      <p style={{marginTop:24}}><a href="/" style={{color:'#c9a227'}}← View Site</a></p>
    </div>
  )
}