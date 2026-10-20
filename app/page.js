'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [content, setContent] = useState({
    heroTitle: 'Cabinet & Countertop Made With Expertise',
    heroSubtitle: 'Beyond cabinets — a refined approach to kitchens, vanities, and living spaces crafted with precision.',
    aboutText: 'K Cabinetry brings together European craftsmanship and American production standards.',
    phone: '(470) 243-8599',
    email: 'info@kcabinetry.net',
    address: 'The Bluffs, 7800 Austell Rd, Austell, Georgia 30168'
  })

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(setContent).catch(() => {})
  }, [])

  return (
    <>
      <header>
        <div className="container nav">
          <Link href="/"><img src="/logo.svg" alt="K Cabinetry" style={{height: 56}} /></Link>
          <nav className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/products">Products</Link>
            <Link href="/capabilities">Capabilities</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <Link href="/contact" className="btn">Request Quote</Link>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <p className="gold" style={{letterSpacing: '0.15em', fontSize: 13, textTransform: 'uppercase'}}>Made in the United States & Europe</p>
          <h1 className="serif" dangerouslySetInnerHTML={{__html: content.heroTitle.replace(/\n/g, '<br>')}} />
          <p style={{fontSize: 18, maxWidth: 560, color: '#ccc'}}>{content.heroSubtitle}</p>
          <Link href="/products" className="btn" style={{marginTop: 24, display: 'inline-block'}}>Explore Products</Link>
        </div>
      </section>

      <section className="bg-cream" style={{padding: '80px 0'}}>
        <div className="container" style={{textAlign: 'center', maxWidth: 800}}>
          <h2 className="serif" style={{fontSize: 40, marginBottom: 16}}>Crafting Masterpieces.<br/>Defining Lifestyles.</h2>
          <p style={{fontSize: 18, color: '#555', lineHeight: 1.6}}>{content.aboutText}</p>
        </div>
      </section>

      <section style={{padding: '80px 0'}}>
        <div className="container">
          <div className="grid-3">
            <Link href="/products" className="card">
              <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop" alt="Shaker" />
              <h3 className="serif" style={{fontSize: 24, marginTop: 12}}>Shaker Cabinets</h3>
            </Link>
            <Link href="/products" className="card">
              <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop" alt="Surfaces" />
              <h3 className="serif" style={{fontSize: 24, marginTop: 12}}>Dekton & Granite</h3>
            </Link>
            <Link href="/products" className="card">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" alt="Vanities" />
              <h3 className="serif" style={{fontSize: 24, marginTop: 12}}>Vanities</h3>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32}}>
          <div>
            <img src="/logo.svg" alt="K Cabinetry" style={{height: 40, filter: 'brightness(0) invert(1)'}} />
            <p style={{fontSize: 14, marginTop: 12}}>Cabinets & countertops made with expertise.</p>
          </div>
          <div>
            <p style={{color: '#fff', fontWeight: 500}}>Contact</p>
            <p style={{fontSize: 14}}>{content.address}<br/>{content.phone}<br/>{content.email}</p>
          </div>
        </div>
        <div className="container" style={{marginTop: 32, paddingTop: 16, borderTop: '1px solid #333', fontSize: 12}}>© 2026 K Cabinetry</div>
      </footer>
    </>
  )
}