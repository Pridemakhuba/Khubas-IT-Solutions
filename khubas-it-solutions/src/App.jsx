import { useState, useEffect, useRef } from "react";

const TEAL = "#00e5cc";
const DARK = "#060a0f";
const SURFACE = "#0d1520";
const BORDER = "#1a2a3a";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal: #00e5cc;
    --teal2: #00bfa5;
    --dark: #060a0f;
    --surface: #0d1520;
    --surface2: #121e2e;
    --border: #1a2a3a;
    --text: #e8f4f8;
    --muted: #6b8fa8;
    --red: #ff4444;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--dark);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    cursor: crosshair;
  }

  /* SCANLINE OVERLAY */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,229,204,0.015) 2px,
      rgba(0,229,204,0.015) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* NOISE TEXTURE */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9998;
    opacity: 0.6;
  }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px;
    height: 64px;
    background: rgba(6,10,15,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 2px;
    color: var(--text);
    text-decoration: none;
  }
  .nav-logo span { color: var(--teal); }

  .nav-logo-icon {
    width: 34px; height: 34px;
    background: var(--teal);
    clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 14px; color: var(--dark);
    font-family: 'Space Mono', monospace;
  }

  .nav-links {
    display: flex; gap: 32px; list-style: none;
  }
  .nav-links a {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
    position: relative;
  }
  .nav-links a::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: var(--teal);
    transform: scaleX(0); transition: transform 0.2s;
  }
  .nav-links a:hover { color: var(--teal); }
  .nav-links a:hover::after { transform: scaleX(1); }

  .nav-cta {
    background: var(--teal);
    color: var(--dark) !important;
    padding: 8px 18px;
    font-family: 'Space Mono', monospace !important;
    font-size: 11px !important;
    font-weight: 700;
    text-decoration: none;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: background 0.2s !important;
  }
  .nav-cta:hover { background: #00bfa5 !important; }
  .nav-cta::after { display: none !important; }

  /* HERO */
  .hero {
    min-height: 100vh;
    padding: 120px 40px 80px;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    overflow: hidden;
  }

  .hero-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,229,204,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,204,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .hero-glow {
    position: absolute;
    top: 20%; right: 10%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,229,204,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--teal);
    border: 1px solid rgba(0,229,204,0.3);
    display: inline-block;
    padding: 5px 14px;
    margin-bottom: 24px;
  }

  .hero h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 8vw, 110px);
    line-height: 0.92;
    letter-spacing: -1px;
    margin-bottom: 32px;
  }

  .hero h1 .line-teal { color: var(--teal); display: block; }
  .hero h1 .line-outline {
    -webkit-text-stroke: 2px rgba(232,244,248,0.3);
    color: transparent;
    display: block;
  }

  .hero-desc {
    color: var(--muted);
    font-size: 15px;
    line-height: 1.7;
    max-width: 420px;
    margin-bottom: 40px;
  }

  .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

  .btn-primary {
    background: var(--teal);
    color: var(--dark);
    padding: 14px 32px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    transition: all 0.2s;
    cursor: pointer;
    border: none;
  }
  .btn-primary:hover { background: #00bfa5; transform: translateY(-2px); }

  .btn-outline {
    background: transparent;
    color: var(--teal);
    padding: 13px 32px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
    border: 1px solid rgba(0,229,204,0.4);
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    transition: all 0.2s;
    cursor: pointer;
  }
  .btn-outline:hover { border-color: var(--teal); background: rgba(0,229,204,0.06); }

  /* HERO RIGHT — stats */
  .hero-right {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 24px 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .stat-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--teal);
  }
  .stat-card:hover { border-color: rgba(0,229,204,0.4); }

  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    color: var(--teal);
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
  }

  .stat-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* SECTION BASE */
  section {
    padding: 100px 40px;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-label::before {
    content: '';
    width: 24px; height: 1px;
    background: var(--teal);
  }

  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 1;
    margin-bottom: 16px;
  }

  .section-sub {
    color: var(--muted);
    font-size: 15px;
    line-height: 1.7;
    max-width: 560px;
    margin-bottom: 64px;
  }

  /* SERVICES */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  .service-card {
    background: var(--surface);
    padding: 40px 32px;
    transition: background 0.3s;
    position: relative;
    overflow: hidden;
  }
  .service-card:hover { background: var(--surface2); }
  .service-card:hover .service-icon { color: var(--dark); background: var(--teal); }

  .service-icon {
    width: 48px; height: 48px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    margin-bottom: 24px;
    transition: all 0.3s;
    color: var(--teal);
  }

  .service-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  .service-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .service-price {
    font-family: 'Space Mono', monospace;
    font-size: 18px;
    color: var(--teal);
    font-weight: 700;
  }

  /* PRICING */
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .price-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 32px 28px;
    position: relative;
    transition: all 0.3s;
    overflow: hidden;
  }
  .price-card.featured {
    border-color: var(--teal);
    background: var(--surface2);
  }
  .price-card.featured::before {
    content: 'POPULAR';
    position: absolute; top: 16px; right: 16px;
    background: var(--teal);
    color: var(--dark);
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 3px 8px;
  }
  .price-card:hover:not(.featured) { border-color: rgba(0,229,204,0.3); }

  .price-name {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
  }
  .price-amount {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    color: var(--text);
    line-height: 1;
    margin-bottom: 4px;
  }
  .price-amount span { font-size: 24px; vertical-align: top; margin-top: 10px; display: inline-block; }
  .price-period {
    font-size: 12px; color: var(--muted);
    margin-bottom: 28px;
    font-family: 'Space Mono', monospace;
  }
  .price-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
  .price-features li {
    font-size: 13px;
    color: var(--muted);
    display: flex; align-items: center; gap: 8px;
  }
  .price-features li::before { content: '▸'; color: var(--teal); }

  /* EXTRAS */
  .extras-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .extra-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 20px 24px;
    display: flex; justify-content: space-between; align-items: center;
    transition: border-color 0.2s;
  }
  .extra-card:hover { border-color: rgba(0,229,204,0.3); }
  .extra-name { font-size: 14px; font-weight: 500; }
  .extra-price { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--teal); }

  /* CONTACT */
  .contact-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
  }

  .contact-info { display: flex; flex-direction: column; gap: 24px; }

  .contact-item {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    transition: border-color 0.2s;
  }
  .contact-item:hover { border-color: rgba(0,229,204,0.3); }

  .contact-icon {
    width: 40px; height: 40px; flex-shrink: 0;
    border: 1px solid var(--teal);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    color: var(--teal);
  }
  .contact-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .contact-val { font-size: 14px; color: var(--text); }

  /* FORM */
  .contact-form { display: flex; flex-direction: column; gap: 16px; }

  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .form-input, .form-select, .form-textarea {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--teal); }
  .form-textarea { resize: vertical; min-height: 100px; }
  .form-select option { background: var(--surface); }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 40px;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 20px;
  }

  .footer-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 2px;
  }
  .footer-brand span { color: var(--teal); }

  .footer-powered {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 1px;
    text-align: center;
  }
  .footer-powered strong { color: var(--teal); }

  .footer-copy {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--muted);
  }

  /* TICKER */
  .ticker {
    background: var(--teal);
    color: var(--dark);
    padding: 10px 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .ticker-inner {
    display: inline-block;
    animation: ticker 20s linear infinite;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* MOBILE */
  @media (max-width: 768px) {
    nav { padding: 0 20px; }
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; padding: 100px 20px 60px; }
    .hero-right { display: none; }
    section { padding: 60px 20px; }
    .services-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .contact-wrapper { grid-template-columns: 1fr; }
    .extras-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; text-align: center; padding: 24px 20px; }
  }

  /* ANIMATE IN */
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const services = [
  { icon: "🛒", name: "E-Commerce Website", desc: "Full-featured online stores with payment integration, product management, and secure checkout.", price: "R12 000" },
  { icon: "💼", name: "Business Website", desc: "Professional corporate sites that establish authority and convert visitors into clients.", price: "R12 000" },
  { icon: "📚", name: "Educational Website", desc: "Learning platforms, course portals, and school management systems.", price: "R8 000" },
  { icon: "🌍", name: "Nonprofit Website", desc: "Cause-driven sites designed to inspire action and grow community support.", price: "R3 000" },
  { icon: "💡", name: "Infopreneur Website", desc: "Content-first platforms for creators, bloggers, and knowledge businesses.", price: "R3 500" },
  { icon: "🎨", name: "Portfolio Website", desc: "Showcase your work beautifully. Designed to impress and win clients.", price: "R2 500" },
];

const extras = [
  { name: "Domain Setup", price: "R200 – R400" },
  { name: "Hosting Setup", price: "R300 – R800" },
  { name: "Website Maintenance", price: "R1 500/month" },
  { name: "SEO Optimization", price: "R500 – R1 500" },
];

export default function KhubasWebsite() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in").forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  };

  const tickerText = "WEBSITE DEVELOPMENT ✦ MANAGEMENT ✦ DESIGN ✦ SEO ✦ E-COMMERCE ✦ PORTFOLIO ✦ EDUCATIONAL ✦ NONPROFIT ✦ ";

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">K</div>
          KHUBAS <span>&nbsp;IT</span>
        </a>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#contact" className="nav-cta">Get a Quote</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <div className="hero" style={{ maxWidth: "100%", padding: "120px 60px 80px" }}>
        <div className="hero-grid-bg" />
        <div className="hero-glow" />

        <div style={{ position: "relative" }}>
          <div className="hero-label">Gqeberha, South Africa</div>
          <h1>
            <span>WEBSITES</span>
            <span className="line-teal">THAT WORK.</span>
            <span className="line-outline">DESIGNS</span>
            <span>THAT WIN.</span>
          </h1>
          <p className="hero-desc">
            Khubas IT Solutions builds high-performance websites — from e-commerce stores to educational platforms. We develop, manage, and design for businesses across South Africa.
          </p>
          <div className="hero-btns">
            <a href="#contact" className="btn-primary">Start Your Project</a>
            <a href="#services" className="btn-outline">View Services</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-num">6+</div>
              <div className="stat-label">Website Types</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">24H</div>
              <div className="stat-label">Response Time</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-num">R2 500</div>
            <div className="stat-label">Websites starting from</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: "transparent", borderColor: "rgba(0,229,204,0.3)" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "var(--muted)", marginBottom: "8px" }}>SUPPORTED BY</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", letterSpacing: "2px", color: "var(--teal)" }}>CODE · WITH · ME</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>ACADEMY</div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">{tickerText.repeat(4)}</div>
      </div>

      {/* SERVICES */}
      <section id="services">
        <div className="fade-in">
          <div className="section-label">What We Build</div>
          <h2 className="section-title">OUR SERVICES</h2>
          <p className="section-sub">From small portfolios to full-scale e-commerce platforms — we deliver websites that perform and convert.</p>
        </div>
        <div className="services-grid fade-in">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
              <div className="service-price">{s.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: "var(--surface)", maxWidth: "100%", padding: "100px 60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="fade-in">
            <div className="section-label">Transparent Pricing</div>
            <h2 className="section-title">CHOOSE YOUR TIER</h2>
            <p className="section-sub">No hidden fees. No surprises. Just clear pricing for quality websites.</p>
          </div>
          <div className="pricing-grid fade-in">
            <div className="price-card">
              <div className="price-name">Starter</div>
              <div className="price-amount"><span>R</span>2 500</div>
              <div className="price-period">one-time payment</div>
              <ul className="price-features">
                <li>Portfolio / Personal site</li>
                <li>Up to 5 pages</li>
                <li>Mobile responsive</li>
                <li>Contact form</li>
                <li>Basic SEO setup</li>
              </ul>
              <a href="#contact" className="btn-outline" style={{ display: "block", textAlign: "center" }}>Get Started</a>
            </div>
            <div className="price-card featured">
              <div className="price-name">Professional</div>
              <div className="price-amount"><span>R</span>3 500</div>
              <div className="price-period">one-time payment</div>
              <ul className="price-features">
                <li>Nonprofit / Infopreneur</li>
                <li>Up to 10 pages</li>
                <li>CMS integration</li>
                <li>Blog / News section</li>
                <li>Newsletter signup</li>
                <li>Advanced SEO</li>
              </ul>
              <a href="#contact" className="btn-primary" style={{ display: "block", textAlign: "center" }}>Get Started</a>
            </div>
            <div className="price-card">
              <div className="price-name">Enterprise</div>
              <div className="price-amount"><span>R</span>12 000</div>
              <div className="price-period">one-time payment</div>
              <ul className="price-features">
                <li>E-Commerce / Business</li>
                <li>Unlimited pages</li>
                <li>Payment gateway</li>
                <li>Admin dashboard</li>
                <li>Custom functionality</li>
                <li>1 month free support</li>
              </ul>
              <a href="#contact" className="btn-outline" style={{ display: "block", textAlign: "center" }}>Get Started</a>
            </div>
          </div>

          <div className="fade-in">
            <div className="section-label" style={{ marginBottom: "20px" }}>Add-On Services</div>
            <div className="extras-grid">
              {extras.map((e, i) => (
                <div key={i} className="extra-card">
                  <span className="extra-name">{e.name}</span>
                  <span className="extra-price">{e.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="fade-in">
          <div className="section-label">Let's Build Together</div>
          <h2 className="section-title">GET IN TOUCH</h2>
          <p className="section-sub">Ready to launch your website? Send us a message and we'll get back to you within 24 hours.</p>
        </div>
        <div className="contact-wrapper fade-in">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div>
                <div className="contact-label">WhatsApp / Call</div>
                <div className="contact-val">+27 68 316 5843</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-val">mrfadeex@gmail.com</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <div className="contact-label">Academy</div>
                <div className="contact-val">info@codewithmeacademy.co.za</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-label">Location</div>
                <div className="contact-val">Gqeberha (Port Elizabeth), Eastern Cape, South Africa</div>
              </div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid rgba(0,229,204,0.2)", padding: "24px", marginTop: "8px" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "8px" }}>Powered By</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "3px", color: "var(--teal)" }}>CODE · WITH · ME</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>School of Information Technology</div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="your@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone / WhatsApp</label>
              <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+27 ..." />
            </div>
            <div className="form-group">
              <label className="form-label">Service Interested In</label>
              <select className="form-select" value={form.service} onChange={e => setForm({...form, service: e.target.value})} required>
                <option value="">Select a service...</option>
                {services.map((s, i) => <option key={i} value={s.name}>{s.name} — {s.price}</option>)}
                <option value="other">Other / Not sure yet</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tell Us About Your Project</label>
              <textarea className="form-textarea" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Describe your website goals, timeline, any special requirements..." />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "16px" }}>
              {sent ? "✓ MESSAGE SENT!" : "SEND MESSAGE →"}
            </button>
            {sent && <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "var(--teal)", textAlign: "center" }}>We'll be in touch within 24 hours.</p>}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">KHUBAS <span>IT SOLUTIONS</span></div>
        <div className="footer-powered">Supported by <strong>CODE · WITH · ME ACADEMY</strong></div>
        <div className="footer-copy">© 2025 P.Makhuba.Dev · All rights reserved</div>
      </footer>
    </>
  );
}
