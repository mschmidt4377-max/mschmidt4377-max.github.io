const CASES = window.CASES || [];
const PLUGINS = [
  ["Gmail", /gmail|inbox|email/i],
  ["Google Calendar", /google calendar|\bcalendar\b/i],
  ["Notion", /\bnotion\b/i],
  ["Slack", /\bslack\b/i],
  ["Telegram", /\btelegram\b/i],
  ["WhatsApp", /\bwhatsapp\b/i],
  ["Amazon", /\bamazon\b/i],
  ["Home Assistant", /home assistant/i],
  ["Tesla / Tessie", /\btesla\b|\btessie\b/i],
  ["GitHub", /\bgithub\b/i],
  ["Cursor", /\bcursor\b/i],
  ["MCP", /\bmcp\b/i],
  ["YouTube", /\byoutube\b/i],
  ["LinkedIn", /\blinkedin\b/i]
];
function pluginsOf(x) {
  const blob = x.title + " " + x.desc;
  return [...new Set(PLUGINS.filter(([,re]) => re.test(blob)).map(([n]) => n))];
}
const grid = document.getElementById("grid");
const q = document.getElementById("q");
const cat = document.getElementById("cat");
const kind = document.getElementById("kind");
const plugin = document.getElementById("plugin");
const count = document.getElementById("count");
[...new Set((window.CASES||[]).map(c => c.cat))].sort().forEach(c => {
  const o = document.createElement("option"); o.value = c; o.textContent = c; cat.appendChild(o);
});
function render() {
  const CASES = window.CASES || [];
  const query = q.value.trim().toLowerCase();
  const rows = CASES.filter(x => {
    if (cat.value && x.cat !== cat.value) return false;
    if (kind.value && x.kind !== kind.value) return false;
    const plugs = pluginsOf(x);
    if (plugin.value === "__any__" && !plugs.length) return false;
    if (plugin.value && plugin.value !== "__any__" && !plugs.includes(plugin.value)) return false;
    if (!query) return true;
    return [x.title, x.desc, x.who, x.handle, x.cat].join(" ").toLowerCase().includes(query);
  });
  count.textContent = rows.length;
  grid.innerHTML = rows.length ? "" : '<div class="empty">No matches.</div>';
  rows.forEach(x => {
    const el = document.createElement("article");
    el.innerHTML = `<div class="meta"><span class="chip cat">${x.cat}</span><span class="chip src">${x.kind}</span></div><h2>${x.title}</h2><p>${x.desc}</p><div class="who">${x.handle ? '@'+x.handle+' · ' : ''}${x.who}${x.url ? ' · <a href="'+x.url+'" target="_blank" rel="noopener">source</a>' : ''}</div>`;
    grid.appendChild(el);
  });
}
[q, cat, kind, plugin].forEach(el => el.addEventListener(el === q ? "input" : "change", render));
render();
