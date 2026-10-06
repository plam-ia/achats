
const CATEGORIES=["Sport","Vêtements","Maison","Tech","Beauté / santé","Événements","Voyages","Cadeaux","Autres"];
const STATUSES=[["idea","💡 Idée"],["model_found","🔎 Modèle trouvé - En cours d'achat"],["purchased","✅ Acheté"]];
const PRIORITIES=[["low","Basse"],["medium","Moyenne"],["high","Haute"],["urgent","Urgent"]];
let sb,currentUser=null,items=[],people=[],buyStatusFilter="",buyPriorityFilter="",giftPersonFilter="";

const $=id=>document.getElementById(id);
const esc=(s="")=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const money=n=>(n===null||n===undefined||n==="")?"":new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(Number(n));

function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function statusLabel(v){return (STATUSES.find(x=>x[0]===v)||["",v])[1]}
function priorityLabel(v){return (PRIORITIES.find(x=>x[0]===v)||["",v])[1]}
function empty(t){return `<div class="empty">${esc(t)}</div>`}
function emoji(c){return {"Sport":"🏃","Vêtements":"👕","Maison":"🏠","Tech":"💻","Beauté / santé":"✨","Événements":"🎟️","Voyages":"✈️","Cadeaux":"🎁","Autres":"•"}[c]||"•"}

function itemCard(it){
  const person=people.find(p=>p.id===it.person_id);
  const preview=it.preview_image_url?`<img src="${esc(it.preview_image_url)}" alt="">`:`<span>${emoji(it.category)}</span>`;
  const price=it.last_seen_price!=null?`<div class="price">${money(it.last_seen_price)}</div>`:"";
  const target=it.target_price!=null?`<div class="price-target">cible ${money(it.target_price)}</div>`:"";
  const comment=it.notes?`<div class="item-comment">${esc(it.notes)}</div>`:"";
  const link=it.product_url?`<a class="product-link" href="${esc(it.product_url)}" target="_blank" rel="noopener noreferrer">Voir le produit ↗</a>`:"";
  return `<article class="item-card" data-id="${it.id}">
    <div class="item-top">
      <div class="thumb">${preview}</div>
      <div>
        <div class="item-title">${esc(it.title)}</div>
        ${it.model_name?`<div class="item-model">${esc(it.model_name)}</div>`:""}
        <div class="item-sub">${esc([it.category,person?.name,it.merchant].filter(Boolean).join(" · "))}</div>
        <div class="meta-row">
          <span class="badge ${it.status==="purchased"?"green":""}">${esc(statusLabel(it.status))}</span>
          <span class="badge ${esc(it.priority)}">${esc(priorityLabel(it.priority))}</span>
        </div>
      </div>
      <div class="price-box">${price}${target}</div>
    </div>
    ${comment}
    <div class="item-actions">${link}<button class="edit-link" data-edit-id="${it.id}" type="button">Modifier</button></div>
  </article>`;
}

async function init(){
  const cfg=window.APP_CONFIG||{};
  if(!cfg.SUPABASE_URL||!cfg.SUPABASE_PUBLISHABLE_KEY||cfg.SUPABASE_URL.includes("COLLE_ICI")){
    $("authMessage").textContent="Renseigne config.js avec ton Project URL et ta Publishable key Supabase.";return;
  }
  sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
  const {data:{session}}=await sb.auth.getSession();
  if(session?.user) await enterApp(session.user);
  sb.auth.onAuthStateChange(async(_,session)=>{if(session?.user&&!currentUser)await enterApp(session.user);if(!session?.user&&currentUser)exitApp()});
}

async function enterApp(user){currentUser=user;$("authView").classList.add("hidden");$("appView").classList.remove("hidden");await reloadAll()}
function exitApp(){currentUser=null;items=[];people=[];$("appView").classList.add("hidden");$("authView").classList.remove("hidden")}
async function reloadAll(){
  const [pRes,iRes]=await Promise.all([
    sb.from("people").select("*").order("name"),
    sb.from("items").select("*").eq("item_type","buy").order("created_at",{ascending:false})
  ]);
  if(pRes.error)toast("Erreur personnes : "+pRes.error.message);
  if(iRes.error)toast("Erreur achats : "+iRes.error.message);
  people=pRes.data||[];items=iRes.data||[];renderAll();
}

function renderAll(){renderDashboard();renderBuy();renderPeople();renderGifts()}
function renderDashboard(){
  $("countIdeas").textContent=items.filter(i=>i.status==="idea").length;
  $("countModels").textContent=items.filter(i=>i.status==="model_found").length;
  $("countPurchased").textContent=items.filter(i=>i.status==="purchased").length;
  $("countLow").textContent=items.filter(i=>i.priority==="low").length;
  $("countMedium").textContent=items.filter(i=>i.priority==="medium").length;
  $("countHigh").textContent=items.filter(i=>i.priority==="high").length;
  $("countUrgent").textContent=items.filter(i=>i.priority==="urgent").length;
}
function renderBuy(){
  const q=$("buySearch").value.trim().toLowerCase();
  let list=[...items];
  if(buyStatusFilter)list=list.filter(i=>i.status===buyStatusFilter);
  if(buyPriorityFilter)list=list.filter(i=>i.priority===buyPriorityFilter);
  if(q)list=list.filter(i=>[i.title,i.model_name,i.category,i.notes,i.merchant].some(v=>String(v||"").toLowerCase().includes(q)));
  $("buyItems").innerHTML=list.length?list.map(itemCard).join(""):empty("Aucun achat avec ces filtres.");
  wireCards();
}
function renderPeople(){
  $("peopleList").innerHTML=people.length?people.map(p=>{
    const count=items.filter(i=>i.category==="Cadeaux"&&i.person_id===p.id).length;
    return `<div class="person-row"><div class="person-avatar">${esc(p.name[0]?.toUpperCase()||"?")}</div><div class="grow"><strong>${esc(p.name)}</strong><div class="muted">${count} idée${count>1?"s":""}</div></div><button class="link-btn" data-person-filter="${p.id}">Voir</button></div>`;
  }).join(""):empty("Aucune personne ajoutée.");
}
function renderGifts(){
  let list=items.filter(i=>i.category==="Cadeaux");
  if(giftPersonFilter)list=list.filter(i=>i.person_id===giftPersonFilter);
  $("clearGiftPersonFilter").classList.toggle("hidden",!giftPersonFilter);
  $("giftItems").innerHTML=list.length?list.map(itemCard).join(""):empty("Aucune idée cadeau.");
  wireCards();
}
function wireCards(){
  document.querySelectorAll("[data-edit-id]").forEach(b=>b.onclick=e=>{e.stopPropagation();openItem(b.dataset.editId)});
  document.querySelectorAll(".item-card").forEach(c=>c.onclick=e=>{if(e.target.closest("a,button"))return;openItem(c.dataset.id)});
}
function switchView(v){
  document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
  $(v+"View").classList.add("active");
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===v));
  $("pageTitle").textContent=v==="gifts"?"Cadeaux":"Achats";
}
function fillCategories(selected){$("itemCategory").innerHTML=CATEGORIES.map(c=>`<option ${c===selected?"selected":""}>${esc(c)}</option>`).join("")}
function fillPeople(selected){$("itemPerson").innerHTML=`<option value="">—</option>`+people.map(p=>`<option value="${p.id}" ${p.id===selected?"selected":""}>${esc(p.name)}</option>`).join("")}
function refreshDynamicFields(){
  $("personField").classList.toggle("hidden",$("itemCategory").value!=="Cadeaux");
  $("modelFields").classList.toggle("hidden",$("itemStatus").value==="idea");
}
function openNew(){
  $("itemForm").reset();$("itemId").value="";fillCategories("Sport");fillPeople("");$("itemStatus").value="idea";$("itemPriority").value="medium";$("deleteItemButton").classList.add("hidden");$("itemDialogTitle").textContent="Ajouter une idée";refreshDynamicFields();$("itemDialog").showModal();
}
function openItem(id){
  const it=items.find(x=>x.id===id);if(!it)return;
  $("itemId").value=it.id;fillCategories(it.category);fillPeople(it.person_id||"");$("itemTitle").value=it.title||"";$("itemStatus").value=it.status||"idea";$("itemPriority").value=it.priority||"medium";$("itemNotes").value=it.notes||"";$("itemModelName").value=it.model_name||"";$("itemProductUrl").value=it.product_url||"";$("itemPreviewImage").value=it.preview_image_url||"";$("itemLastPrice").value=it.last_seen_price??"";$("itemTargetPrice").value=it.target_price??"";$("itemMerchant").value=it.merchant||"";$("deleteItemButton").classList.remove("hidden");$("itemDialogTitle").textContent=it.title;refreshDynamicFields();$("itemDialog").showModal();
}
const numOrNull=v=>v===""?null:Number(v);
async function saveItem(e){
  e.preventDefault();
  const id=$("itemId").value,old=items.find(i=>i.id===id),status=$("itemStatus").value;
  const payload={user_id:currentUser.id,item_type:"buy",title:$("itemTitle").value.trim(),category:$("itemCategory").value,person_id:$("itemCategory").value==="Cadeaux"&&$("itemPerson").value?$("itemPerson").value:null,status,priority:$("itemPriority").value,notes:$("itemNotes").value.trim()||null,model_name:status!=="idea"?($("itemModelName").value.trim()||null):null,product_url:status!=="idea"?($("itemProductUrl").value.trim()||null):null,preview_image_url:status!=="idea"?($("itemPreviewImage").value.trim()||null):null,merchant:status!=="idea"?($("itemMerchant").value.trim()||null):null,last_seen_price:status!=="idea"?numOrNull($("itemLastPrice").value):null,target_price:status!=="idea"?numOrNull($("itemTargetPrice").value):null};
  const res=id?await sb.from("items").update(payload).eq("id",id).select().single():await sb.from("items").insert(payload).select().single();
  if(res.error){toast("Erreur : "+res.error.message);return}
  if(res.data.last_seen_price!=null&&(!id||Number(res.data.last_seen_price)!==Number(old?.last_seen_price))){
    await sb.from("price_history").insert({user_id:currentUser.id,item_id:res.data.id,price:res.data.last_seen_price});
  }
  $("itemDialog").close();toast(id?"Achat modifié":"Idée ajoutée");await reloadAll();
}
async function deleteItem(){
  const id=$("itemId").value;if(!id||!confirm("Supprimer définitivement cet achat ?"))return;
  const {error}=await sb.from("items").delete().eq("id",id);if(error){toast("Erreur : "+error.message);return}
  $("itemDialog").close();toast("Supprimé");await reloadAll();
}
async function addPerson(e){
  e.preventDefault();const name=$("personName").value.trim();if(!name)return;
  const {error}=await sb.from("people").insert({user_id:currentUser.id,name});if(error){toast("Erreur : "+error.message);return}
  $("personDialog").close();$("personForm").reset();toast("Personne ajoutée");await reloadAll();
}

$("loginForm").addEventListener("submit",async e=>{e.preventDefault();$("authMessage").textContent="";const {error}=await sb.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginPassword").value});if(error)$("authMessage").textContent=error.message});
$("addButton").onclick=openNew;
$("addPersonButton").onclick=()=>$("personDialog").showModal();
$("itemForm").addEventListener("submit",saveItem);
$("personForm").addEventListener("submit",addPerson);
$("deleteItemButton").onclick=deleteItem;
$("itemCategory").addEventListener("change",refreshDynamicFields);
$("itemStatus").addEventListener("change",refreshDynamicFields);
$("buySearch").addEventListener("input",renderBuy);
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
document.querySelectorAll("#buyStatusChips .chip").forEach(c=>c.onclick=()=>{buyStatusFilter=c.dataset.status;document.querySelectorAll("#buyStatusChips .chip").forEach(x=>x.classList.toggle("active",x===c));renderBuy()});
document.querySelectorAll("#buyPriorityChips .chip").forEach(c=>c.onclick=()=>{buyPriorityFilter=c.dataset.priority;document.querySelectorAll("#buyPriorityChips .chip").forEach(x=>x.classList.toggle("active",x===c));renderBuy()});
document.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>{
  if(b.dataset.statusFilter!==undefined){buyStatusFilter=b.dataset.statusFilter;buyPriorityFilter=""}
  if(b.dataset.priorityFilter!==undefined){buyPriorityFilter=b.dataset.priorityFilter;buyStatusFilter=""}
  document.querySelectorAll("#buyStatusChips .chip").forEach(x=>x.classList.toggle("active",x.dataset.status===buyStatusFilter));
  document.querySelectorAll("#buyPriorityChips .chip").forEach(x=>x.classList.toggle("active",x.dataset.priority===buyPriorityFilter));
  switchView("buy");renderBuy();
});
document.addEventListener("click",e=>{const p=e.target.closest("[data-person-filter]");if(p){giftPersonFilter=p.dataset.personFilter;renderGifts()}});
$("clearGiftPersonFilter").onclick=()=>{giftPersonFilter="";renderGifts()};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
init();
