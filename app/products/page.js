import Link from 'next/link'
export default function Products() {
  return (
    <>
      <header><div className="container nav"><Link href="/"><img src="/logo.svg" alt="K Cabinetry" style={{height:56}} /></Link><nav className="nav-links"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/products">Products</Link><Link href="/capabilities">Capabilities</Link><Link href="/contact">Contact</Link></nav><Link href="/contact" className="btn">Request Quote</Link></div></header>
      <section className="bg-cream" style={{padding:'60px 0'}}><div className="container" style={{textAlign:'center'}}><h1 className="serif" style={{fontSize:48}}>Cabinets, Surfaces & Vanities</h1></div></section>
      <section style={{padding:'40px 0'}}><div className="container grid-3"><div><img src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=800" style={{width:'100%',height:220,objectFit:'cover'}} /><h3 className="serif">Shaker & Framed</h3></div><div><img src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800" style={{width:'100%',height:220,objectFit:'cover'}} /><h3 className="serif">Frameless</h3></div><div><img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800" style={{width:'100%',height:220,objectFit:'cover'}} /><h3 className="serif">Surfaces</h3></div></div></section>
      <footer className="footer"><div className="container">© 2026 K Cabinetry</div></footer>
    </>
  )
}