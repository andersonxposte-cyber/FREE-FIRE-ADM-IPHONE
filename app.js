const $=id=>document.getElementById(id);let data=JSON.parse(localStorage.getItem("ffadm")||'{"balance":0,"bets":[],"tours":[],"notes":[]}');
function save(){localStorage.setItem("ffadm",JSON.stringify(data));render()}
function money(n){return Number(n||0).toLocaleString("pt-PT")+" MT"}
function render(){$("balance").textContent=money(data.balance);$("betCount").textContent=data.bets.length;$("tourCount").textContent=data.tours.length;$("noteCount").textContent=data.notes.length;
$("betList").innerHTML=data.bets.map((b,i)=>`<div class="item"><div><b>${esc(b.player||"Sem nick")}</b><small>${b.mode} · ${money(b.amount)} · Comissão ${money(b.commission)}</small></div><button onclick="del('bets',${i})">Apagar</button></div>`).join("")||'<p class="muted">Ainda não existem apostas.</p>';
$("tourList").innerHTML=data.tours.map((t,i)=>`<div class="item"><div><b>${esc(t.name)}</b><small>${t.type} · Inscrição ${money(t.fee)}</small></div><button onclick="del('tours',${i})">Apagar</button></div>`).join("")||'<p class="muted">Ainda não existem campeonatos.</p>';
$("noteList").innerHTML=data.notes.map((n,i)=>`<div class="item"><div><b>${esc(n.title)}</b><small>${esc(n.body)}</small></div><button onclick="del('notes',${i})">Apagar</button></div>`).join("")||'<p class="muted">Sem notas.</p>'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.del=(k,i)=>{data[k].splice(i,1);save()};
function go(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("selected",b.dataset.go===id))}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
$("addBet").onclick=()=>{let amount=Number($("amount").value);if(amount<5||amount>100000)return alert("Insere um valor entre 5 e 100000 MT.");data.bets.unshift({player:$("player").value,amount,mode:$("mode").value,commission:amount>=30?10:amount>=10?5:0});save();$("player").value="";$("amount").value=""};
$("addTour").onclick=()=>{if(!$("tourName").value.trim())return alert("Indica o nome do campeonato.");data.tours.unshift({name:$("tourName").value,type:$("tourType").value,fee:Number($("tourFee").value||0)});save();$("tourName").value="";$("tourFee").value=""};
$("addNote").onclick=()=>{if(!$("noteTitle").value.trim())return alert("Indica o título.");data.notes.unshift({title:$("noteTitle").value,body:$("noteBody").value});save();$("noteTitle").value="";$("noteBody").value=""};
$("addMoney").onclick=()=>{let n=Number($("movement").value);if(n>0){data.balance+=n;save();$("movement").value=""}};
$("takeMoney").onclick=()=>{let n=Number($("movement").value);if(n>0&&n<=data.balance){data.balance-=n;save();$("movement").value=""}else alert("Valor inválido ou saldo insuficiente.")};
$("settings").onclick=()=>alert("Os dados ficam guardados neste dispositivo. Faz cópias de segurança regularmente.");
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
render();