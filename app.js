const cities = {
  Thetford: "Thetford",
  "Fort Sterling": "FortSterling",
  Lymhurst: "Lymhurst",
  Bridgewatch: "Bridgewatch",
  Martlock: "Martlock",
  Caerleon: "Caerleon"
};

/* ---------- quick item suggestions ---------- */
const itemExamples = [
  "T4_2H_CLAYMORE","T5_2H_CLAYMORE","T6_2H_CLAYMORE","T7_2H_CLAYMORE","T8_2H_CLAYMORE",
  "T4_HEAD_PLATE_SET1","T5_HEAD_PLATE_SET1","T6_HEAD_PLATE_SET1","T7_HEAD_PLATE_SET1","T8_HEAD_PLATE_SET1"
];
const itemList = document.getElementById('itemList');
itemExamples.forEach(it => {
  const o = document.createElement('option');
  o.value = it;
  itemList.appendChild(o);
});

/* ---------- helpers ---------- */
async function fetchPrices(ids, city){
  const url = `https://west.albion-online-data.com/api/v2/stats/prices/${ids.join(',')}.json?locations=${city}&qualities=1`;
  const res = await fetch(url);
  return res.json();
}

async function fetchRecipe(itemId){
  // 1. Download NDJSON file
  const url = "https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.txt.json";
  const text = await (await fetch(url)).text();

  // 2. Parse line-by-line
  const items = text
    .split('\n')
    .filter(l => l.trim())          // drop empty lines
    .map(JSON.parse);               // each line is its own JSON object

  return items.find(i => i["@uniquename"] === itemId);
}

function craftCount(matQty, rrr, useFocus){
  const base = useFocus ? matQty / 2 : matQty;
  const saved = base * (rrr / 100);
  return Math.ceil(base - saved);
}

/* ---------- main button click ---------- */
document.getElementById('calcBtn').addEventListener('click', async () => {
  const itemId = document.getElementById('itemSearch').value.trim();
  if(!itemId){ alert('Type an item first'); return; }

  const city = cities[document.getElementById('city').value];
  const rrr  = parseFloat(document.getElementById('rrr').value) || 0;
  const useFocus = document.getElementById('focus').checked;
  const qty  = parseInt(document.getElementById('qty').value) || 1;

  const recipe = await fetchRecipe(itemId);
  if(!recipe?.craftingrequirements?.craftresource){
    alert('Recipe not found or not craftable'); return;
  }

  const mats = Array.isArray(recipe.craftingrequirements.craftresource)
               ? recipe.craftingrequirements.craftresource
               : [recipe.craftingrequirements.craftresource];

  const matIds     = mats.map(m => m["@uniquename"]);
  const prices     = await fetchPrices(matIds.concat([itemId]), city);
  const priceMap   = new Map(prices.filter(p => p.sell_price_min > 0)
                                   .map(p => [p.item_id, p.sell_price_min]));
  const sellPrice  = prices.find(p => p.item_id === itemId)?.sell_price_min || 0;

  let totalMatCost = 0;
  const tbody = document.getElementById('matBody');
  tbody.innerHTML = '';

  mats.forEach(m => {
    const id     = m["@uniquename"];
    const count  = parseInt(m["@count"]);
    const needed = craftCount(count, rrr, useFocus) * qty;
    const price  = priceMap.get(id) || 0;
    totalMatCost += needed * price;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${id}</td>
      <td>${needed}</td>
      <td>${price.toLocaleString()}</td>
      <td>${(needed * price).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('matCost').textContent  = totalMatCost.toLocaleString();
  document.getElementById('sellPrice').textContent = (sellPrice * qty).toLocaleString();
  document.getElementById('profit').textContent = ((sellPrice * qty) - totalMatCost).toLocaleString();
  document.getElementById('results').hidden = false;
});
