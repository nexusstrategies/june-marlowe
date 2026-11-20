// Sample artist site v2. Paintings are placeholder data; swap this list for the artist's own.
// wIn / hIn are the real sizes in inches. The wall draws every painting to the same scale.
const PAINTINGS = [
  { id: "sunday-kitchen", title: "Sunday Kitchen", cat: "still-life", wIn: 16, hIn: 20, price: 210, w: 1400, h: 1715, featured: true,
    alt: "Painting of eggs, onions and two pitchers on a patterned cloth",
    blurb: "Eggs, onions and my mother's blue pitcher. The cloth took longer than everything else put together." },
  { id: "garden-cuttings", title: "Garden Cuttings", cat: "flowers", wIn: 18, hIn: 24, price: 185, w: 1400, h: 1867,
    alt: "Painting of roses, daisies and lilies in loose bright strokes",
    blurb: "Everything that was blooming the second week of June, cut before breakfast and painted before lunch." },
  { id: "blood-orange", title: "Blood Orange", cat: "still-life", wIn: 10, hIn: 10, price: 75, w: 1400, h: 1400,
    alt: "Painting of a whole orange beside three cut segments",
    blurb: "A small one, painted in a single sitting before the fruit dried out." },
  { id: "wisteria-cottage", title: "Wisteria Cottage", cat: "doors", wIn: 14, hIn: 10, price: 150, sold: true, w: 1400, h: 1012,
    alt: "Painting of a purple door in a white wall covered in wisteria",
    blurb: "A purple door I passed on a walk and went back for with a sketchbook." },
  { id: "delphiniums-by-the-window", title: "Delphiniums by the Window", cat: "flowers", wIn: 14, hIn: 16, price: 195, w: 1400, h: 1576,
    alt: "Painting of tall blue flowers in a glass vase in a sunlit room",
    blurb: "Tall blue stems that would not stay still. I painted them leaning." },
  { id: "the-red-door", title: "The Red Door", cat: "doors", wIn: 12, hIn: 16, price: 140, w: 1400, h: 1932,
    alt: "Painting of a red door surrounded by pink climbing flowers",
    blurb: "Pink flowers over a red door. Too much, and exactly right." },
  { id: "blue-bottles-january", title: "Blue Bottles, January", cat: "still-life", wIn: 12, hIn: 14, price: 160, w: 1400, h: 1646,
    alt: "Painting of a cobalt blue bottle and a clear bottle on a snowy windowsill",
    blurb: "The windowsill on the coldest morning of the year. The blue did all the work." },
  { id: "pumpkin-and-rose", title: "Pumpkin and Rose", cat: "still-life", wIn: 12, hIn: 10, price: 120, w: 1400, h: 1172,
    alt: "Painting of an orange pumpkin with a pink rose on a dark background",
    blurb: "The last rose of the year and the first pumpkin, on the same table for one afternoon." },
  { id: "chianti", title: "Chianti", cat: "still-life", wIn: 16, hIn: 20, price: 220, sold: true, w: 1400, h: 1731,
    alt: "Painting of a straw wrapped wine bottle and a glass in strong colour",
    blurb: "A bottle from a good dinner, painted the morning after." },
  { id: "coneflower-at-dusk", title: "Coneflower at Dusk", cat: "flowers", wIn: 12, hIn: 16, price: 95, w: 1400, h: 1867,
    alt: "Painting of a single pink coneflower on a dark background",
    blurb: "One flower, one evening, a dark ground. The simplest painting here." },
];

const $ = (id) => document.getElementById(id);
const money = (n) => "$" + n;
const size = (p) => `${p.wIn} × ${p.hIn} in`;
const cost = (p) => (p.sold ? '<span class="cost sold">Sold</span>' : `<span class="cost">${money(p.price)}</span>`);
const label = (p) => `${p.title}, ${size(p)}, ${p.sold ? "sold" : money(p.price)}. Open this painting`;

// featured painting, hung from the rail
const f = PAINTINGS.find((p) => p.featured);
$("featured").innerHTML = `
  <button class="work-btn" type="button" data-id="${f.id}" aria-label="${label(f)}">
    <div class="frame"><img src="images/sm/${f.id}.jpg" width="${f.w}" height="${f.h}" alt="${f.alt}" fetchpriority="high"></div>
  </button>
  <div class="placard"><strong>${f.title}</strong><span>Acrylic on canvas</span><span>${size(f)}</span>${cost(f)}</div>`;

// the wall, every painting at the same scale
const wall = $("wall");
wall.innerHTML = PAINTINGS.filter((p) => !p.featured).map((p) => `
  <figure class="work" style="--w:${p.wIn}" data-id="${p.id}" data-cat="${p.cat}" data-available="${p.sold ? "no" : "yes"}">
    <button class="work-btn" type="button" data-id="${p.id}" aria-label="${label(p)}">
      <div class="frame"><img src="images/sm/${p.id}.jpg" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy"></div>
    </button>
    <figcaption class="tag"><strong>${p.title}</strong><span>${size(p)}</span>${cost(p)}</figcaption>
  </figure>`).join("");

document.querySelectorAll(".chip").forEach((chip) => chip.addEventListener("click", () => {
  document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
  const fl = chip.dataset.filter;
  let shown = 0;
  wall.querySelectorAll(".work").forEach((c) => {
    const ok = fl === "all" || (fl === "available" ? c.dataset.available === "yes" : c.dataset.cat === fl);
    c.hidden = !ok;
    if (ok) shown++;
  });
  $("empty").hidden = shown !== 0;
}));

// scale drawing: the painting above a 7-foot (84 in) sofa, 1 unit = 1 inch
function scaleDrawing(p) {
  const x = (120 - p.wIn) / 2, y = 34 - p.hIn;
  return `<svg viewBox="0 0 120 78" role="img" aria-label="${p.title} drawn to scale above a 7-foot sofa">
    <rect x="0" y="72" width="120" height="6" fill="#1c0f20"/>
    <rect x="${x - 0.6}" y="${y - 0.6}" width="${p.wIn + 1.2}" height="${p.hIn + 1.2}" fill="#fcfbf8"/>
    <image href="images/sm/${p.id}.jpg" x="${x}" y="${y}" width="${p.wIn}" height="${p.hIn}" preserveAspectRatio="xMidYMid slice"/>
    <g fill="#523159">
      <rect x="18" y="42" width="84" height="22" rx="4"/>
      <rect x="16" y="50" width="11" height="19" rx="4"/>
      <rect x="93" y="50" width="11" height="19" rx="4"/>
    </g>
    <rect x="25" y="55" width="70" height="11" rx="3" fill="#63406b"/>
    <rect x="20" y="68" width="3" height="4" fill="#1c0f20"/><rect x="97" y="68" width="3" height="4" fill="#1c0f20"/>
  </svg>`;
}

// painting view
const view = $("view");
let current = null;
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".work-btn");
  if (!btn) return;
  current = PAINTINGS.find((p) => p.id === btn.dataset.id);
  const img = $("v-img");
  img.src = `images/${current.id}.jpg`; img.alt = current.alt; img.width = current.w; img.height = current.h;
  $("v-title").textContent = current.title;
  $("v-cost").innerHTML = current.sold ? '<span class="sold">Sold</span>' : money(current.price);
  $("v-blurb").textContent = current.blurb;
  $("v-size").textContent = size(current);
  $("v-scale").innerHTML = scaleDrawing(current);
  const buy = $("v-buy");
  buy.disabled = !!current.sold;
  buy.textContent = current.sold ? "This one has sold" : "Buy this painting";
  buy.removeAttribute("data-state");
  $("v-ask").textContent = current.sold ? "Ask for one like it" : "Ask a question";
  $("v-note").hidden = true;
  view.showModal();
  view.scrollTop = 0;
});
$("v-back").addEventListener("click", () => view.close());
$("v-buy").addEventListener("click", () => {
  const b = $("v-buy");
  b.dataset.state = "loading"; b.textContent = "Opening checkout…";
  setTimeout(() => { b.removeAttribute("data-state"); b.textContent = "Buy this painting"; $("v-note").hidden = false; }, 700);
});
$("v-ask").addEventListener("click", () => {
  view.close();
  document.querySelector('textarea[name="message"]').value = current.sold
    ? `I missed "${current.title}". Do you have anything like it?`
    : `I have a question about "${current.title}".`;
  form.elements.painting.value = current.title;
  $("contact").scrollIntoView();
  document.querySelector('input[name="name"]').focus({ preventScroll: true });
});

// contact form: really sends. An n8n workflow checks the message and emails it to the site owner.
const FORM_URL = "https://irie.app.n8n.cloud/webhook/demo/artist/contact";
const form = $("contact-form");
const sendBtn = $("send");
const formNote = $("form-note");
const say = (text) => { formNote.textContent = text; formNote.hidden = !text; };
const rules = {
  name: (v) => (v.trim() ? "" : "Add your name so June knows who is writing."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "That email is missing something. Check it for a typo."),
  message: (v) => (v.trim() ? "" : "Write a line or two about what you would like to know."),
};
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (sendBtn.dataset.state === "loading") return;
  say("");
  let bad = 0;
  for (const [name, check] of Object.entries(rules)) {
    const el = form.elements[name];
    const msg = check(el.value);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    form.querySelector(`.field-err[data-for="${name}"]`).textContent = msg;
    if (msg) bad++;
  }
  if (bad) {
    sendBtn.dataset.state = "error"; sendBtn.textContent = "Fix the marked fields";
    setTimeout(() => { sendBtn.removeAttribute("data-state"); sendBtn.textContent = "Send message"; }, 1800);
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  sendBtn.dataset.state = "loading"; sendBtn.textContent = "Sending…"; sendBtn.disabled = true;
  let result = null;
  try {
    const res = await fetch(FORM_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(20000) });
    result = res.ok ? await res.json() : null;
  } catch (err) { result = null; }
  sendBtn.disabled = false;
  if (result && result.ok) {
    sendBtn.dataset.state = "success"; sendBtn.textContent = "Message sent";
    say(`Sent. A confirmation email is on its way to ${data.email}. On this sample site, messages go to Nexus AI Strategies, who built it.`);
    form.reset(); form.elements.painting.value = "";
    setTimeout(() => { sendBtn.removeAttribute("data-state"); sendBtn.textContent = "Send message"; }, 6000);
    return;
  }
  sendBtn.dataset.state = "error"; sendBtn.textContent = "Not sent. Try again";
  say(result && result.error === "busy"
    ? "The form has had a lot of messages this hour, so this one was not sent. Your words are still here. Try again in a little while."
    : "The message did not go through, so nothing was sent. Your words are still here. Check your connection and press the button again.");
  setTimeout(() => { sendBtn.removeAttribute("data-state"); sendBtn.textContent = "Send message"; }, 2500);
});
