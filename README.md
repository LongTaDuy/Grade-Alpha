<div align="center">

# Grade Alpha

### **GPAA** · *Semester performance, priced like a stock.*

**If your transcript had a ticker, this would be the terminal.**

Chart your GPA like an asset, read the tape, and stress-test finals before the closing bell—all in the browser, no backend drama.

<br/>

`GPAA +2.4%` · *mock data · for vibes & velocity*

</div>

---

<br/>

## 📈 The walkthrough *(demo)*

**This thing wants to be clicked.** Drag sliders, flip bull/base/bear, watch the curve repaint.

| | |
|:---:|:---|
| **GIF** | ![Grade Alpha demo](./demo-placeholder.gif) |
| **Live** | *`[ add your deployed URL here ]`* |

> *Placeholder above—drop in a screen recording or GIF when you ship.*

<br/>

## Why this exists

Most GPA tools look like homework. **Grade Alpha** borrows the language of markets on purpose: your cumulative average behaves a bit like a position—momentum, volatility, scenarios, a story you tell yourself before year-end.

It’s a creative exercise in **product framing**: same math-shaped problem, totally different emotional and visual read. The goal isn’t a perfect forecast—it’s a **memorable interface** for thinking about the semester.

<br/>

## Features *(the prospectus)*

- **Semester price action** — A 16-week, stock-style GPA curve with area fill and “open → projected close” language  
- **Prediction engine** — Deterministic blend of letter-grade expectations, study hours, stress, and credit mix *(believable, not oracle-grade)*  
- **Scenario desk** — **Bull / Base / Bear** cases—same inputs, different tape  
- **Analyst note** — Short, finance-flavored commentary that updates with the model  
- **Signals** — **Trend** (Bullish · Neutral · Bearish), **volatility score**, and **confidence**—dashboard candy with meaning baked in  

<br/>

## How it works *(executive summary)*

Letter grades map to GPA points. The model **blends** your current cumulative GPA with an estimated semester GPA, then nudges for **study hours** (tailwind) and **stress** (headwind). Course load feeds **volatility**; stress and overload trim **confidence**. Weekly points **interpolate** from your current GPA toward the projected close, with a little controlled noise—because real semesters aren’t a straight line.

Smart enough to feel intentional. Light enough to ship in the frontend.

<br/>

## Sample output *(fictional tape)*

```
Trend:          Bullish
Projected Close: 3.74
Volatility:     47
Confidence:     78%

Analyst Note:
"Your academic tape is printing higher highs. Under the base case,
 we see a projected term close near 3.74 (semester estimate ~3.55)."
```

*Your mileage will vary. Past performance does not guarantee… you know the rest.*

<br/>

## Tech stack

- **Next.js 14+** — App Router  
- **TypeScript** — types over vibes  
- **Tailwind CSS** — layout & polish  
- **shadcn/ui** — components with restraint  
- **Framer Motion** — motion when it earns its keep  
- **Recharts** — the curve is the hero  
- **Local state only** — v1: no auth, no DB, no API calls  

**Run locally:** `npm install` → `npm run dev` → open `http://localhost:3000`

<br/>

## Design philosophy

The UI is **dark-mode by default**, **terminal-calm**, and **finance-literate**—not because students belong on a trading floor, but because **familiar visual language reduces cognitive load** and makes the metaphor land. Spacing, hierarchy, and glow are doing real work: they sell the idea that this is a **small product**, not a class assignment with a React dependency.

<br/>

## Disclaimer

**This will not save your GPA—but it might motivate you.**  
Forecasts are for entertainment, reflection, and portfolio storytelling. Don’t bet your registrar on a mock ticker.

<br/>

---

<div align="center">

**Grade Alpha** · Built with intention · Ship the metaphor

</div>

<br/>

---

## 🔔 Closing Bell — *after-hours appendix*

<div align="center">

![When your GPA and your portfolio both need a candlestick](./fun.gif)

**Caption:** *“Diversified portfolio: equities, bonds, and whatever that midterm just did to your thesis.”*

</div>

*GIF: `./fun.gif` — swap in your own loop when ready. The meme potential is **priced in**.*
