"use strict";const entries=[
["Krishna Kumar Gupta — LIVE project-payment workbook","live","01_JP / Rohini / Personnel / Krishna / 02_HUMAN_GOOGLE_SHEETS","03_JP_Cost_Estimation / 03_PROJECT_PAYMENT_REGISTERS / Krishna LIVE"],
["AEC Cost Rate Master — LIVE rate workbook","live","AEC / 03_MASTER_DATABASE","03_JP_Cost_Estimation / 04_COST_RATE_REFERENCES / AEC LIVE"],
["Krishna vendor-payment test v0.6","test","Rohini / Krishna / 02_HUMAN_GOOGLE_SHEETS","03_JP_Cost_Estimation / 97_STAGED_INTAKE_NOT_ADMITTED / Krishna tests"],
["Krishna vendor-summary test v0.7","test","Rohini / Krishna / 02_HUMAN_GOOGLE_SHEETS","03_JP_Cost_Estimation / 97_STAGED_INTAKE_NOT_ADMITTED / Krishna tests"],
["Krishna native-summary PRE backup","history","Rohini / Krishna / 02_HUMAN_GOOGLE_SHEETS","03_JP_Cost_Estimation / 90_VERSION_HISTORY / Krishna"],
["Krishna ledger PRE snapshot","history","Rohini / Krishna / 02_HUMAN_GOOGLE_SHEETS","03_JP_Cost_Estimation / 90_VERSION_HISTORY / Krishna"],
["Krishna historical backend setup document","history","Rohini / Krishna / 02_HUMAN_GOOGLE_SHEETS","03_JP_Cost_Estimation / 90_VERSION_HISTORY / Krishna"],
["AEC rate master G067 POST snapshot","history","AEC / 03_MASTER_DATABASE","03_JP_Cost_Estimation / 90_VERSION_HISTORY / AEC Rate Master"],
["AEC rate master G067 PRE snapshot","history","AEC / 03_MASTER_DATABASE","03_JP_Cost_Estimation / 90_VERSION_HISTORY / AEC Rate Master"],
["AEC rate master CR02 G065 POST snapshot","history","AEC / 03_MASTER_DATABASE","03_JP_Cost_Estimation / 90_VERSION_HISTORY / AEC Rate Master"],
["AEC rate master CR02 G065 PRE snapshot","history","AEC / 03_MASTER_DATABASE","03_JP_Cost_Estimation / 90_VERSION_HISTORY / AEC Rate Master"]
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function show(){const type=document.getElementById("kind").value;document.getElementById("items").innerHTML=entries.filter(e=>type==="all"||e[1]===type).map(e=>'<article class="item"><h3>'+esc(e[0])+'<span class="status">'+esc(e[1])+'</span></h3><p><b>Previously:</b> '+esc(e[2])+'</p><p><b>Now:</b> '+esc(e[3])+'</p></article>').join("");}
document.getElementById("kind").addEventListener("change",show);show();