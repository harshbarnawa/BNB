import React from "react";
import "./App.css";

const services = [
  ["01", "Websites & digital experiences", "Brand-led websites designed to turn visitors into enquiries."],
  ["02", "E-commerce development", "Online stores with considered product discovery and shopping journeys."],
  ["03", "Custom web applications", "Dashboards, portals and software for real business workflows."],
  ["04", "UI engineering", "Responsive interfaces and frontend experiences built with care."]
];
const demos = ["Business websites", "E-commerce websites", "Portfolio websites", "SaaS & dashboards", "Landing pages", "Custom web applications"];
const products = [["Mechanical keyboards", "KEYBOARDS", "keys"], ["Precision gaming mice", "MICE", "mouse"], ["Audio & desk essentials", "SETUP GEAR", "audio"]];

function Arrow(){return <span className="arrow">↗</span>}

export default function App(){
  return <div className="site-shell">
    <div className="announcement">BUILD BETTER. BYTE BY BYTE.<span>INDEPENDENT DIGITAL STUDIO · TECH STORE</span></div>
    <header className="header">
      <a className="brand" href="#home"><b>B<span>N</span>B</b><small>BOARD N BYTE<br/>BUILD WHAT'S NEXT</small></a>
      <nav><a href="#services">Services</a><a href="#gallery">Design gallery</a><a href="#store">Tech store</a><a href="#about">About</a></nav>
      <a className="header-cta" href="#contact">Let's talk <Arrow/></a>
    </header>
    <main id="home">
      <section className="hero">
        <div><div className="eyebrow"><i/> DIGITAL STUDIO + TECH STORE</div><h1>Ideas into <em>digital.</em><br/>Setups into<br/>something more.</h1><p className="lead">We build thoughtful digital experiences and bring together the tech that powers your everyday.</p><div className="actions"><a className="btn" href="#services">Explore services <Arrow/></a><a className="plain-link" href="#store">Discover the store <Arrow/></a></div><div className="hero-foot">01 / 02 <span>ONE BRAND. TWO WAYS TO BUILD.</span></div></div>
        <div className="hero-art"><div className="ring ring-a"/><div className="ring ring-b"/><div className="core">BNB<small>BOARD N BYTE</small></div><div className="float float-a">⌘ <span><b>Digital</b><small>Design · Develop · Deliver</small></span></div><div className="float float-b">▦ <span><b>Technology</b><small>Discover · Upgrade · Create</small></span></div><label>MADE FOR WHAT'S NEXT</label></div>
      </section>
      <section className="wrap pathways"><div className="kicker">THE BNB EXPERIENCE <span>01 — CHOOSE YOUR PATH</span></div><div className="path-grid">
        <a className="path-card" href="#services"><div className="kicker">01 / DIGITAL SERVICES <Arrow/></div><div className="browser"><div className="browser-bar">● ● ●</div><div className="browser-copy"><i/> <b>Make your<br/>next move.</b><small>Digital experiences, built with intent.</small></div></div><h2>Build your digital presence.</h2><p>Websites, e-commerce and custom software for ambitious ideas.</p></a>
        <a className="path-card" href="#store"><div className="kicker">02 / TECH STORE <Arrow/></div><div className="gear"><div className="keyboard">{Array.from({length:30},(_,i)=><i key={i}/>)}</div><div className="gear-mouse"/></div><h2>Make your setup yours.</h2><p>PC peripherals, desk essentials and gear for the way you work and play.</p></a>
      </div></section>
      <section className="wrap section" id="services"><div className="section-head"><div><div className="kicker">WHAT WE DO <span>02 — DIGITAL SERVICES</span></div><h2>Good work starts<br/>with <em>clear thinking.</em></h2></div><p>From a first idea to a complete product, we shape digital experiences around the people who use them.</p></div><div className="service-grid">{services.map(s=><article key={s[0]}><div className="kicker">{s[0]} <span>BNB SERVICES</span></div><h3>{s[1]}</h3><p>{s[2]}</p><a href="#contact">Discuss a project <Arrow/></a></article>)}</div></section>
      <section className="gallery"><div className="wrap"><div className="section-head"><div><div className="kicker">DESIGN STARTING POINTS <span>03 — THE GALLERY</span></div><h2>See a direction.<br/><em>Make it yours.</em></h2></div><p>Explore interactive design concepts, choose a starting point and shape it around your business. Demo experiences will use clearly labelled sample data.</p></div><div className="demo-grid">{demos.map((d,i)=><a href="#contact" className="demo-card" key={d}><div className={"demo-art demo-"+i}><span>0{i+1}</span><div><b>{["Studio / Co.","OBJECTS","Selected work","Overview","Launch faster","Workspace"][i]}</b><i/></div></div><h3>{d} <Arrow/></h3></a>)}</div></div></section>
      <section className="wrap section" id="store"><div className="section-head"><div><div className="kicker">THE TECH STORE <span>04 — GEAR UP</span></div><h2>Tools for your<br/><em>kind of flow.</em></h2></div><p>A considered collection of PC peripherals and tech essentials. Product previews are illustrative until real stock and suppliers are confirmed.</p></div><div className="product-grid">{products.map(p=><article className="product-card" key={p[0]}><div className={"product-art "+p[2]}><span>PREVIEW</span>{p[2]==="keys"?<div className="keys">{Array.from({length:30},(_,i)=><i key={i}/>)}</div>:p[2]==="mouse"?<div className="mouse"/>:<div className="headphones"/>}</div><small>{p[1]}</small><h3>{p[0]}</h3><p>Explore the collection</p></article>)}</div><div className="store-note"><i/> STORE PREVIEW — LIVE SELLING BEGINS AFTER STOCK, SOURCING AND FULFILMENT ARE VERIFIED.</div></section>
      <section className="about" id="about"><div className="wrap about-inner"><div><div className="kicker">A SMALL STUDIO. A BIG BUILD MINDSET.</div><h2>Built with intent.<br/><em>Growing by design.</em></h2></div><p>BNB is a founder-led digital studio and technology store. We bring design, development and useful technology together under one roof — with clear communication and work that earns its place.</p></div></section>
      <section className="wrap contact" id="contact"><div><div className="kicker">HAVE SOMETHING IN MIND? <span>05 — START HERE</span></div><h2>Let's make<br/>something <em>useful.</em></h2><p>Tell us what you're planning. We'll understand the requirement first, then work out the right next step.</p></div><div className="contact-card"><small>BNB / 001</small><h3>Start a conversation.</h3><p>Project enquiries, collaborations and questions about the store.</p><label>CONTACT CHANNELS TO BE CONFIGURED</label></div></section>
    </main>
    <footer><a className="brand" href="#home"><b>B<span>N</span>B</b><small>BOARD N BYTE<br/>BUILD WHAT'S NEXT</small></a><span>© 2026 BNB · BOARD N BYTE</span><a href="#home">BACK TO TOP ↑</a></footer>
  </div>
}