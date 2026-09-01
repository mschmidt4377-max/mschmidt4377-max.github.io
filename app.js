const CASES = window.CASES || [];
const PLUGINS = [
  ["Home Assistant", /home assistant/i],
  ["Gmail", /gmail|inbox|email/i],
  ["Google Calendar", /google calendar|\bcalendar\b/i],
  ["Google Drive", /google drive|\bdrive\b/i],
  ["Google Keep", /google keep|\bkeep notes\b/i],
  ["Google Photos", /google photos/i],
  ["Google Sheets", /google sheet|\.sheet|spreadsheet/i],
  ["Notion", /\bnotion\b/i],
  ["Slack", /\bslack\b/i],
  ["Linear", /\blinear\b/i],
  ["Telegram", /\btelegram\b/i],
  ["WhatsApp", /\bwhatsapp\b/i],
  ["Amazon", /\bamazon\b/i],
  ["Stripe", /\bstripe\b/i],
  ["X / X API", /\bx api\b|\bx account\b|mentions|timeline/i],
  ["LinkedIn", /\blinkedin\b/i],
  ["YouTube", /\byoutube\b/i],
  ["TranscriptAPI", /transcriptapi|youtube transcript/i],
  ["Composio", /\bcomposio\b/i],
  ["AgentMail", /\bagentmail\b/i],
  ["Bland / phone", /\bbland\b|phone number/i],
  ["Amplemarket", /\bamplemarket\b/i],
  ["Gong", /\bgong\b/i],
  ["Granola", /\bgranola\b/i],
  ["TradingView", /\btradingview\b/i],
  ["IBKR", /\bibkr\b|interactive brokers/i],
  ["Tessie", /\btessie\b/i],
  ["Tesla / Tessie", /\btesla\b|\btessie\b/i],
  ["PostHog", /\bposthog\b/i],
  ["Google Search Console", /\bgsc\b|search console/i],
  ["Ahrefs", /\bahrefs\b/i],
  ["Arduino", /\barduino\b/i],
  ["Musescore", /\bmusescore\b/i],
  ["ContentDrips", /\bcontentdrips\b/i],
  ["Affonso", /\baffonso\b/i],
  ["Apify", /\bapify\b/i],
  ["Facebook Marketplace", /facebook marketplace|fb marketplace/i],
  ["AutoTrader", /\bautotrader\b/i],
  ["e-Boks", /\be-boks\b/i],
  ["Fitbit", /\bfitbit\b/i],
  ["Framer", /\bframer\b/i],
  ["Dynamics 365", /\bd365\b|dynamics 365/i],
  ["Render", /\brender\b/i],
  ["GitHub", /\bgithub\b/i],
  ["OpenAI realtime", /openai realtime|realtime transcription/i],
  ["Cursor", /\bcursor\b/i],
  ["MCP", /\bmcp\b/i],
  ["Todoist", /\btodoist\b/i],
  ["CRM", /\bcrm\b/i],
  ["Etsy", /\betsy\b/i],
  ["Unreal Engine", /\bunreal\b/i],
  ["Meta ads", /\bmeta ads\b/i],
  ["Herdr", /\bherdr\b/i]
];

function pluginsOf(x) {
  if (x.plugins && x.plugins.length) return x.plugins;
  const blob = x.title + " " + x.desc;
  const hits = [];
  PLUGINS.forEach(([name, re]) => { if (re.test(blob)) hits.push(name); });
  return [...new Set(hits)];
}

const grid = document.getElementById("grid");
const q = document.getElementById("q");
const cat = document.getElementById("cat");
const kind = document.getElementById("kind");
const plugin = document.getElementById("plugin");
const count = document.getElementById("count");

const cats = [...new Set(CASES.map(c => c.cat))].sort();
cats.forEach(c => {
  const o = document.createElement("option");
  o.value = c; o.textContent = c; cat.appendChild(o);
});

const pluginNames = [...new Set(CASES.flatMap(pluginsOf))].sort();
pluginNames.forEach(n => {
  const o = document.createElement("option");
  o.value = n; o.textContent = n; plugin.appendChild(o);
});

function render() {
  const query = q.value.trim().toLowerCase();
  const c = cat.value;
  const k = kind.value;
  const p = plugin.value;
  const rows = CASES.filter(x => {
    if (c && x.cat !== c) return false;
    if (k && x.kind !== k) return false;
    const plugs = pluginsOf(x);
    if (p === "__any__" && !plugs.length) return false;
    if (p && p !== "__any__" && !plugs.includes(p)) return false;
    if (!query) return true;
    const blob = [x.title, x.desc, x.who, x.handle, x.cat, plugs.join(" ")].join(" ").toLowerCase();
    return blob.includes(query);
  });
  count.textContent = rows.length;
  grid.innerHTML = "";
  if (!rows.length) {
    grid.innerHTML = '<div class="empty">No matches.</div>';
    return;
  }
  rows.forEach(x => {
    const el = document.createElement("article");
    const sourceLabel = x.kind === "curated" ? "Curated" : x.kind === "influencer" ? "Influencer" : "Giveaway reply";
    const plugs = pluginsOf(x);
    const plugChips = plugs.map(n => `<span class="chip plug">${n}</span>`).join("");
    el.innerHTML = `
      <div class="meta">
        <span class="chip cat">${x.cat}</span>
        <span class="chip src">${sourceLabel}</span>
        ${plugChips}
      </div>
      <h2>${x.title}</h2>
      <p>${x.desc}</p>
      <div class="who">${x.handle ? '@'+x.handle+' · ' : ''}${x.who}${x.url ? ' · <a href="'+x.url+'" target="_blank" rel="noopener">source</a>' : ''}</div>
    `;
    grid.appendChild(el);
  });
}
q.addEventListener("input", render);
cat.addEventListener("change", render);
kind.addEventListener("change", render);
plugin.addEventListener("change", render);
render();
