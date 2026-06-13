import { useState, useEffect } from "react";

const PLANS = [
  {
    name: "Free",
    price: 0,
    letters: 2,
    features: ["2 cover letters/month", "Basic templates", "Download as text"],
    cta: "Current Plan",
    isFree: true,
  },
  {
    name: "Pro",
    price: 9,
    letters: 30,
    features: ["30 cover letters/month", "AI tone customization", "Download PDF", "ATS optimization tips"],
    cta: "Subscribe — $9/mo",
    highlight: true,
    payLink: "https://www.paynow.co.zw/Payment/Link/?q=c2VhcmNoPVRhZGl3YXRvZmElNDBnbWFpbC5jb20mYW1vdW50PTkuMDAmcmVmZXJlbmNlPVBybytwbGFuJmw9MQ%3d%3d",
  },
  {
    name: "Unlimited",
    price: 19,
    letters: Infinity,
    features: ["Unlimited cover letters", "LinkedIn summary writer", "Interview prep questions", "Priority AI speed"],
    cta: "Subscribe — $19/mo",
    payLink: "https://www.paynow.co.zw/Payment/Link/?q=c2VhcmNoPVRhZGl3YXRvZmElNDBnbWFpbC5jb20mYW1vdW50PTE5LjAwJnJlZmVyZW5jZT1VbmxpbWl0ZWQrcGxhbiZsPTE%3d",
  },
];

const TONES = ["Professional", "Enthusiastic", "Concise", "Creative", "Formal"];

const SAMPLE_OUTPUT = `Dear Hiring Manager,

I am writing to express my strong interest in the {role} position at {company}. With my background in {skills}, I am confident I would be a valuable addition to your team.

Throughout my career, I have developed a deep expertise in delivering results that align with business objectives. I am particularly drawn to {company} because of its reputation for innovation and its commitment to excellence in the industry.

I thrive in fast-paced environments and bring both strategic thinking and hands-on execution to every role. I would welcome the opportunity to discuss how my experience can contribute to your team's continued success.

Thank you sincerely for your time and consideration.

Warm regards,
[Your Name]`;

export default function App() {
  const [tab, setTab] = useState("generator");
  const [form, setForm] = useState({ role: "", company: "", skills: "", experience: "", tone: "Professional" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usedLetters, setUsedLetters] = useState(1);
  const [plan, setPlan] = useState("Free");
  const [copied, setCopied] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const maxLetters = PLANS.find(p => p.name === plan)?.letters || 2;
  const remaining = maxLetters === Infinity ? "∞" : maxLetters - usedLetters;

  async function generate() {
    if (!form.role || !form.company || !form.skills) return;
    if (usedLetters >= maxLetters) {
      setTab("pricing");
      return;
    }
    setLoading(true);
    setOutput("");

    const prompt = `Write a compelling, ${form.tone.toLowerCase()} cover letter for a ${form.role} position at ${form.company}. 
The applicant's key skills are: ${form.skills}. 
${form.experience ? `Their experience: ${form.experience}.` : ""}
Make it concise (3 paragraphs), ATS-friendly, and genuine. No generic filler. End with a strong closing.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Error generating letter.";
      setOutput(text);
      setUsedLetters(u => u + 1);
    } catch {
      setOutput("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e0d0",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #c9a84c; border-radius: 3px; }
        .nav-link { cursor: pointer; padding: 8px 20px; border-radius: 24px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.5px; }
        .nav-link:hover { background: rgba(201,168,76,0.1); color: #c9a84c; }
        .nav-active { background: rgba(201,168,76,0.15); color: #c9a84c; }
        .input-field { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(201,168,76,0.2); border-radius: 10px; padding: 14px 16px; color: #e8e0d0; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; resize: vertical; }
        .input-field:focus { border-color: #c9a84c; background: rgba(201,168,76,0.04); }
        .input-field::placeholder { color: rgba(232,224,208,0.3); }
        .tone-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid rgba(201,168,76,0.25); background: transparent; color: rgba(232,224,208,0.6); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; transition: all 0.2s; }
        .tone-btn:hover { border-color: #c9a84c; color: #c9a84c; }
        .tone-active { border-color: #c9a84c; background: rgba(201,168,76,0.15); color: #c9a84c; }
        .gen-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #c9a84c, #e8c96d); border: none; border-radius: 12px; color: #0a0a0f; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; letter-spacing: 0.5px; transition: all 0.2s; }
        .gen-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.4); }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .output-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(201,168,76,0.15); border-radius: 12px; padding: 24px; min-height: 200px; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.8; white-space: pre-wrap; color: #e8e0d0; }
        .copy-btn { padding: 10px 24px; background: transparent; border: 1px solid rgba(201,168,76,0.4); border-radius: 8px; color: #c9a84c; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .copy-btn:hover { background: rgba(201,168,76,0.1); }
        .plan-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(201,168,76,0.15); border-radius: 16px; padding: 32px 28px; transition: all 0.3s; }
        .plan-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); }
        .plan-highlight { border-color: #c9a84c; background: rgba(201,168,76,0.06); }
        .plan-btn { width: 100%; padding: 14px; border-radius: 10px; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; margin-top: 24px; }
        .plan-btn-gold { background: linear-gradient(135deg, #c9a84c, #e8c96d); color: #0a0a0f; }
        .plan-btn-gold:hover { box-shadow: 0 6px 24px rgba(201,168,76,0.4); transform: translateY(-1px); }
        .plan-btn-outline { background: transparent; border: 1px solid rgba(201,168,76,0.3); color: #c9a84c; }
        .plan-btn-outline:hover { background: rgba(201,168,76,0.08); }
        .plan-btn-disabled { background: rgba(255,255,255,0.05); color: rgba(232,224,208,0.3); cursor: default; }
        .shimmer { background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.1) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; height: 16px; margin-bottom: 12px; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .dot-pulse::after { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #c9a84c; animation: dotpulse 1s infinite; margin-left: 8px; }
        @keyframes dotpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#c9a84c,#e8c96d)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✍</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#e8e0d0" }}>LetterCraft <span style={{ color: "#c9a84c" }}>AI</span></span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {["generator", "pricing"].map(t => (
              <button key={t} className={`nav-link ${tab === t ? "nav-active" : ""}`} onClick={() => setTab(t)} style={{ background: "none", border: "none", textTransform: "capitalize" }}>
                {t === "generator" ? "✦ Generator" : "◈ Pricing"}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(232,224,208,0.5)" }}>
              {plan} Plan · {remaining} left
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c22,#c9a84c44)", border: "1px solid #c9a84c55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👤</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>

        {/* GENERATOR TAB */}
        {tab === "generator" && (
          <div className={animateIn ? "fade-up" : ""} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
            {/* Left: Form */}
            <div>
              <div style={{ marginBottom: 36 }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", marginBottom: 8 }}>AI Cover Letter Generator</p>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 900, lineHeight: 1.15, color: "#e8e0d0" }}>
                  Land the interview.<br /><span style={{ color: "#c9a84c" }}>In minutes.</span>
                </h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(232,224,208,0.5)", marginBottom: 8 }}>Job Title *</label>
                  <input className="input-field" placeholder="e.g. Senior Product Designer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(232,224,208,0.5)", marginBottom: 8 }}>Company *</label>
                  <input className="input-field" placeholder="e.g. Spotify" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(232,224,208,0.5)", marginBottom: 8 }}>Key Skills *</label>
                  <input className="input-field" placeholder="e.g. Figma, UX research, design systems" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(232,224,208,0.5)", marginBottom: 8 }}>Relevant Experience <span style={{ color: "rgba(232,224,208,0.3)" }}>(optional)</span></label>
                  <textarea className="input-field" rows={3} placeholder="e.g. 5 years at startups, led redesign of checkout flow..." value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(232,224,208,0.5)", marginBottom: 10 }}>Tone</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TONES.map(t => (
                      <button key={t} className={`tone-btn ${form.tone === t ? "tone-active" : ""}`} onClick={() => setForm(f => ({ ...f, tone: t }))}>{t}</button>
                    ))}
                  </div>
                </div>

                {usedLetters >= maxLetters && (
                  <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 10, padding: "14px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#c9a84c" }}>
                    ⚡ You've used all {maxLetters} free letters this month. <button onClick={() => setTab("pricing")} style={{ background: "none", border: "none", color: "#e8c96d", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Upgrade to Pro →</button>
                  </div>
                )}

                <button className="gen-btn" onClick={generate} disabled={loading || !form.role || !form.company || !form.skills}>
                  {loading ? <span className="dot-pulse">Crafting your letter</span> : "✦ Generate Cover Letter"}
                </button>
              </div>
            </div>

            {/* Right: Output */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#e8e0d0" }}>Your Letter</h2>
                {output && <button className="copy-btn" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button>}
              </div>

              {loading ? (
                <div className="output-box">
                  <div className="shimmer" style={{ width: "70%" }} />
                  <div className="shimmer" style={{ width: "90%" }} />
                  <div className="shimmer" style={{ width: "55%" }} />
                  <div className="shimmer" style={{ width: "80%", marginTop: 20 }} />
                  <div className="shimmer" style={{ width: "95%" }} />
                  <div className="shimmer" style={{ width: "60%" }} />
                </div>
              ) : output ? (
                <div className="output-box">{output}</div>
              ) : (
                <div className="output-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 380, color: "rgba(232,224,208,0.2)", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✍</div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}>Fill in the details and<br />your letter appears here</p>
                </div>
              )}

              {output && (
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <button className="copy-btn" style={{ flex: 1 }} onClick={() => { setOutput(""); setForm({ role: "", company: "", skills: "", experience: "", tone: "Professional" }); }}>
                    ↺ New Letter
                  </button>
                  <button className="copy-btn" style={{ flex: 1 }} onClick={copy}>
                    ⬇ Download .txt
                  </button>
                </div>
              )}

              {/* Usage bar */}
              <div style={{ marginTop: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(232,224,208,0.5)" }}>Monthly usage</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#c9a84c" }}>{usedLetters} / {maxLetters === Infinity ? "∞" : maxLetters}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${maxLetters === Infinity ? 20 : Math.min((usedLetters / maxLetters) * 100, 100)}%`, background: "linear-gradient(90deg,#c9a84c,#e8c96d)", borderRadius: 2, transition: "width 0.4s ease" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {tab === "pricing" && (
          <div className={animateIn ? "fade-up" : ""}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", marginBottom: 12 }}>Simple Pricing</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 900, color: "#e8e0d0" }}>
                Invest in your <span style={{ color: "#c9a84c" }}>career</span>
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: "rgba(232,224,208,0.5)", marginTop: 12 }}>Cancel anytime. No hidden fees.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" }}>
              {PLANS.map(p => (
                <div key={p.name} className={`plan-card ${p.highlight ? "plan-highlight" : ""}`} style={{ position: "relative" }}>
                  {p.highlight && (
                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#c9a84c,#e8c96d)", color: "#0a0a0f", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: "4px 14px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>
                      MOST POPULAR
                    </div>
                  )}
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(232,224,208,0.4)", marginBottom: 16 }}>{p.name}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 900, color: "#e8e0d0" }}>${p.price}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(232,224,208,0.4)" }}>/month</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: 20 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                        <span style={{ color: "#c9a84c", fontSize: 14, marginTop: 2 }}>✦</span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(232,224,208,0.75)", lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`plan-btn ${p.isFree ? "plan-btn-disabled" : p.highlight ? "plan-btn-gold" : "plan-btn-outline"}`}
                    onClick={() => { if (!p.isFree && p.payLink) { window.open(p.payLink, "_blank"); } }}
                    disabled={p.isFree}
                  >
                    {plan === p.name && !p.isFree ? "✓ Pay with Paynow" : p.cta}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 48 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(232,224,208,0.3)" }}>
                🔒 Payments secured by Stripe · 30-day money-back guarantee
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
