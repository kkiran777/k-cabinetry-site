import Link from 'next/link'
export default function Capabilities() {
  return (
    <>
      <header><div className="container nav"><Link href="/"><img src="/logo.svg" alt="K Cabinetry" style={{height:56}} /></Link><nav className="nav-links"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/products">Products</Link><Link href="/capabilities">Capabilities</Link><Link href="/contact">Contact</Link></nav><Link href="/contact" className="btn">Request Quote</Link></div></header>
      <section className="bg-cream" style={{padding:'60px 0'}}><div className="container" style={{textAlign:'center'}}><h1 className="serif" style={{fontSize:48}}>Production & Project Support</h1></div></section>
      <section style={{padding:'40px 0'}}><div className="container" style={{maxWidth:800}}><p>Modern equipment supports both high-volume multi-family orders and detailed custom runs. Facilities in the United States and Europe allow flexible sourcing while maintaining quality standards.</p></div></section>
      <footer className="footer"><div className="container">© 2026 K Cabinetry</div></footer>
    </>
  )
}