import Link from 'next/link'
export default function About() {
  return (
    <>
      <header><div className="container nav"><Link href="/"><img src="/logo.svg" alt="K Cabinetry" style={{height:56}} /></Link><nav className="nav-links"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/products">Products</Link><Link href="/capabilities">Capabilities</Link><Link href="/contact">Contact</Link></nav><Link href="/contact" className="btn">Request Quote</Link></div></header>
      <section className="bg-cream" style={{padding:'80px 0'}}><div className="container" style={{textAlign:'center'}}><p className="gold" style={{letterSpacing:'0.15em'}}>ABOUT</p><h1 className="serif" style={{fontSize:48}}>Earning Trust Through Craftsmanship</h1></div></section>
      <section style={{padding:'60px 0'}}><div className="container" style={{maxWidth:800}}><p style={{fontSize:18, lineHeight:1.7, color:'#555'}}>With production capabilities in the United States and Europe, we combine modern manufacturing technology with traditional attention to detail. Our teams focus on consistent quality, reliable schedules, and finishes that meet the expectations of developers, contractors, and designers.</p></div></section>
      <footer className="footer"><div className="container">© 2026 K Cabinetry</div></footer>
    </>
  )
}