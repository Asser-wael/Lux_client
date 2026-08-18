// Maps a stored color name (e.g. "Rose Gold", "Navy") to a real hex/CSS color
// so swatches always render something sensible, since the schema only stores
// color.name (no hex field). Falls back to trying the raw name as a CSS
// color keyword, then to a neutral gray if nothing matches.
const NAME_TO_HEX = {
  beige: "#e8dcc8",
  camel: "#c19a6b",
  "rose gold": "#e6b8a2",
  "off white": "#f7f4ef",
  offwhite: "#f7f4ef",
  cream: "#fdf6e3",
  charcoal: "#36454f",
  burgundy: "#6d1b2f",
  wine: "#5b1f2c",
  mustard: "#d9a441",
  olive: "#708238",
  navy: "#1b2a4a",
  "navy blue": "#1b2a4a",
  blush: "#e8b4bc",
  taupe: "#8b7d6b",
  ivory: "#fffff0",
  champagne: "#f4e3c1",
  emerald: "#0f5132",
  sand: "#c2b280",
  mint: "#a8e0c9",
  coral: "#ff7f50",
  terracotta: "#c66b3d",
  rust: "#b7410e",
  khaki: "#c3b091",
  gold: "#d4af37",
};

export function colorNameToHex(name) {
  if (!name) return "#c9c9c9";

  const key = name.trim().toLowerCase();

  if (NAME_TO_HEX[key]) return NAME_TO_HEX[key];

  // try the raw name as a native CSS color keyword ("Red", "Navy", "Black"...)
  const probe = document.createElement("span").style;
  probe.color = "";
  probe.color = key.replace(/\s+/g, "");
  if (probe.color !== "") return key.replace(/\s+/g, "");

  return "#c9c9c9";
}