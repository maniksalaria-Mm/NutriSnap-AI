const $=id=>document.getElementById(id);const foods=[["Roti (1 medium)",110,3,18,3],["Cooked rice (1 cup)",205,4,45,.4],["Dal (1 bowl)",180,10,25,5],["Paneer (100 g)",265,18,4,20],["Boiled egg (1)",78,6,1,5],["Banana (1 medium)",105,1,27,.4],["Milk (250 ml)",150,8,12,8],["Oats (50 g dry)",190,6,32,4],["Chicken breast (100 g)",165,31,0,3.6],["Curd (100 g)",98,3.5,4.7,4.3],["Rajma (1 bowl)",210,13,35,2],["Chole (1 bowl)",270,12,38,8],["Idli (2 pieces)",120,4,24,1],["Dosa (1 medium)",168,4,25,5],["Poha (1 bowl)",250,5,40,8],["Almonds (10)",70,2.5,2.5,6],["Whey protein (1 scoop)",120,24,3,1.5],["Sprouts (1 bowl)",100,7,18,1],["Paratha (1 medium)",260,6,36,10],["Apple (1 medium)",95,.5,25,.3],["Soy chunks (50 g dry)",172,26,17,.5],["Buttermilk (250 ml)",60,3,6,2]];const def={goal:2000,pg:140,cg:220,fg:65,entries:{},custom:[]};let state;try{state={...def,...JSON.parse(localStorage.getItem("dailyFuel")||"{}")}}catch{state={...def}}let dateKey=key(new Date()),selected=null;function key(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}function date(k){return new Date(k+"T12:00:00")}function all(){return [...foods,...state.custom]}function entries(){return state.entries[dateKey]||[]}function total(a){return a.reduce((t,e)=>({cal:t.cal+e.cal*e.qty,p:t.p+e.p*e.qty,c:t.c+e.c*e.qty,f:t.f+e.f*e.qty}),{cal:0,p:0,c:0,f:0})}function n(v){return Math.round(v).toLocaleString("en-IN")}function save(){localStorage.setItem("dailyFuel",JSON.stringify(state));render()}function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}function render(){let d=date(dateKey);$("dayTitle").textContent=dateKey===key(new Date())?"Today":d.toLocaleDateString("en-IN",{weekday:"long"});$("dayDate").textContent=d.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});let t=total(entries());$("remaining").textContent=n(Math.max(0,state.goal-t.cal));$("eaten").textContent=n(t.cal);$("goalText").textContent=n(state.goal);$("calBar").style.width=Math.min(100,t.cal/state.goal*100)+"%";[["p",t.p,state.pg],["c",t.c,state.cg],["f",t.f,state.fg]].forEach(([k,v,g])=>{$(k+"Text").textContent=`${n(v)} / ${g}g`;$ (k+"Bar").style.width=(g?Math.min(100,v/g*100):0)+"%"});$("meals").innerHTML=["Breakfast","Lunch","Dinner","Snacks"].map(m=>{let es=entries().filter(e=>e.meal===m);return `<section class="meal"><div class="mealhead"><b>${m}</b><small>${n(total(es).cal)} kcal</small></div>${es.length?es.map(e=>`<div class="foodrow"><div>${esc(e.name)}<small>${e.qty} serving · ${n(e.cal*e.qty)} kcal</small></div><button class="remove" data-r="${e.id}">×</button></div>`).join(""):'<div class="empty">Nothing logged yet</div>'}</section>`}).join("");document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{state.entries[dateKey]=entries().filter(e=>e.id!==b.dataset.r);save()});$("history").innerHTML=Array.from({length:7},(_,i)=>{let d=new Date();d.setDate(d.getDate()-6+i);let v=total(state.entries[key(d)]||[]).cal;return `<div class="histrow"><span>${d.toLocaleDateString("en-IN",{weekday:"short"})}</span><div class="histtrack"><i style="width:${Math.min(100,v/state.goal*100)}%"></i></div><b>${v?n(v):"—"}</b></div>`}).join("")}function openFood(){selected=null;$("searchFood").value="";$("servingCount").value=1;$("chosen").textContent="Choose a food above.";$("addSelected").disabled=true;results();$("foodDlg").showModal()}function results(){let q=$("searchFood").value.toLowerCase();$("results").innerHTML=all().filter(f=>f[0].toLowerCase().includes(q)).slice(0,35).map(f=>`<button class="result" type="button" data-food="${all().indexOf(f)}">${esc(f[0])}<small>${f[1]} kcal</small></button>`).join("")||'<p class="empty">No match. Create a custom food.</p>';document.querySelectorAll("[data-food]").forEach(b=>b.onclick=()=>{selected=all()[+b.dataset.food];$("chosen").textContent=`${selected[0]} · ${selected[1]} kcal | P ${selected[2]}g · C ${selected[3]}g · F ${selected[4]}g`;$("addSelected").disabled=false})}$("searchFood").oninput=results;$("addSelected").onclick=()=>{if(!selected)return;let e={id:crypto.randomUUID(),name:selected[0],cal:+selected[1],p:+selected[2],c:+selected[3],f:+selected[4],qty:Math.max(.25,+$("servingCount").value||1),meal:$("mealType").value};state.entries[dateKey]=[...entries(),e];$("foodDlg").close();save()};function customOpen(){$("customDlg").showModal()}$("createCustom").onclick=()=>{$("foodDlg").close();customOpen()};$("addCustomFromList").onclick=customOpen;$("customForm").onsubmit=e=>{e.preventDefault();state.custom.push([$ ("cfName").value.trim(),+$("cfCal").value,+$("cfP").value||0,+$("cfC").value||0,+$("cfF").value||0]);$("customDlg").close();e.target.reset();save()};function settingsOpen(){$("goalIn").value=state.goal;$("pIn").value=state.pg;$("cIn").value=state.cg;$("fIn").value=state.fg;$("settingsDlg").showModal()}$("settingsForm").onsubmit=e=>{e.preventDefault();state.goal=+$("goalIn").value||2000;state.pg=+$("pIn").value||0;state.cg=+$("cIn").value||0;state.fg=+$("fIn").value||0;$("settingsDlg").close();save()};function manage(){$("customList").innerHTML=state.custom.map((f,i)=>`<div class="foodrow">${esc(f[0])} — ${f[1]} kcal <button class="remove" data-c="${i}">×</button></div>`).join("")||'<p class="empty">No custom foods yet.</p>';document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{state.custom.splice(+b.dataset.c,1);save();manage()});$("manageDlg").showModal()}$("manageOpen").onclick=manage;$("export").onclick=()=>{let a=document.createElement("a"),u=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.href=u;a.download="daily-fuel-backup.json";a.click();URL.revokeObjectURL(u)};$("import").onchange=async e=>{try{let x=JSON.parse(await e.target.files[0].text());if(!x.entries||!Array.isArray(x.custom))throw 0;state={...def,...x};save()}catch{alert("Backup file could not be read")}};$("prev").onclick=()=>{let d=date(dateKey);d.setDate(d.getDate()-1);dateKey=key(d);render()};$("next").onclick=()=>{let d=date(dateKey);d.setDate(d.getDate()+1);if(key(d)<=key(new Date()))dateKey=key(d);render()};["addTop","navAdd"].forEach(id=>$(id).onclick=openFood);["settingsOpen","navSettings"].forEach(id=>$(id).onclick=settingsOpen);document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());
// Hybrid AI meal scanner: photos go to the server endpoint; diary entries remain local.
let scanPhotoData = null;
function openScan() {
  $("scanStatus").textContent = "";
  $("scanResults").innerHTML = "";
  $("mealPhoto").value = "";
  $("photoPreview").hidden = true;
  $("analyzeBtn").disabled = true;
  scanPhotoData = null;
  $("scanDlg").showModal();
}
$("scanOpen").onclick = openScan;
const navScan = $("navScan");
if (navScan) navScan.onclick = openScan;
$("mealPhoto").onchange = async (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { $("scanStatus").textContent = "Please select an image."; return; }
  if (file.size > 8 * 1024 * 1024) { $("scanStatus").textContent = "Please choose a photo under 8 MB."; return; }
  scanPhotoData = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  $("photoPreview").src = scanPhotoData;
  $("photoPreview").hidden = false;
  $("analyzeBtn").disabled = false;
  $("scanStatus").textContent = "Photo ready. Keep the full meal in frame.";
};
$("analyzeBtn").onclick = async () => {
  if (!scanPhotoData) return;
  $("analyzeBtn").disabled = true;
  $("scanStatus").textContent = "Analysing photo…";
  $("scanResults").innerHTML = "";
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({image: scanPhotoData, meal: $("scanMeal").value})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Analysis failed.");
    if (!Array.isArray(data.items) || data.items.length === 0) throw new Error(data.note || "Couldn't identify food clearly. Try a brighter photo or add food manually.");
    $("scanStatus").textContent = "Review the estimated food and portion, then add the items you want.";
    $("scanResults").innerHTML = data.items.map((item, i) => `
      <div class="aiitem">
        <div><b>${esc(item.name)}</b><small>${esc(item.portion || "Estimated portion")} · ${Math.round(item.calories)} kcal</small>
        <small>P ${Math.round(item.protein)}g · C ${Math.round(item.carbs)}g · F ${Math.round(item.fat)}g</small></div>
        <button class="addai" type="button" data-ai-add="${i}">＋ Add</button>
      </div>`).join("") + `<p class="note">${esc(data.note || "All values are estimates; actual nutrition depends on ingredients and portion size.")}</p>`;
    document.querySelectorAll("[data-ai-add]").forEach(button => button.onclick = () => {
      const item = data.items[Number(button.dataset.aiAdd)];
      const entry = {id: crypto.randomUUID(), name: item.name + " (AI estimate)", cal: Number(item.calories)||0,
        p: Number(item.protein)||0, c: Number(item.carbs)||0, f: Number(item.fat)||0, qty: 1, meal: $("scanMeal").value};
      state.entries[dateKey] = [...(state.entries[dateKey] || []), entry];
      save();
      button.textContent = "Added ✓";
      button.disabled = true;
    });
  } catch (error) {
    $("scanStatus").textContent = error.message || "Could not analyse the photo. You can still add foods manually.";
  } finally { $("analyzeBtn").disabled = false; }
};

render();if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));