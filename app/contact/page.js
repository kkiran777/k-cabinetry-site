'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
export default function Contact() {
  const [c, setC] = useState({})
  useEffect(() => { fetch('/api/content').then(r=>r.json()).then(setC) }, [])
  return (
    <>
      <header><div className="container nav"><Link href="/"><img src="/logo.svg" alt="K Cabinetry" style={{height:56}} /></Link><nav className="nav-links"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/products">Products</Link><Link href="/capabilities">Capabilities</Link><Link href="/contact">Contact</Link></nav><Link href="/contact" className="btn">Request Quote</Link></div></header>
      <section className="bg-cream" style={{padding:'60px 0'}}><div className="container" style={{textAlign:'center'}}><h1 className="serif" style={{fontSize:48}}>Start a Conversation</h1></div></section>
      <section style={{padding:'40px 0'}}><div className="container" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:40}}><div><h3>Get in Touch</h3><p>{c.address}<br/>{c.phone}<br/>{c.email}</p></div><form onSubmit={e=>{e.preventDefault();alert('Thank you. We will respond shortly.')}}><input placeholder="Name" required style={{width:'100%',padding:10,margin:'8px 0',border:'1px solid #ddd'}} /><input type="email" placeholder="Email" required style={{width:'100%',padding:10,margin:'8px 0',border:'1px solid #ddd'}} /><textarea placeholder="Project details" rows={4} style={{width:'100%',padding:10,margin:'8px 0',border:'1px solid #ddd'}} /><button className="btn" type="submit">Send</button></form></div></section>
      <footer className="footer"><div className="container">© 2026 K Cabinetry</div></footer>
    </>
  )
}