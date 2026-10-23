import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── DESIGN SYSTEM — professional palette (Linear / Stripe / Notion inspired) ───
// Single accent (pine green = animal health), ink-based neutrals, hairline borders.
const T={
  coral:"#1F7A5C", coralBg:"#E8F3EE",
  navy:"#1E2420", navyL:"#2C342E",
  cream:"#FAF8F4", warm:"#F3F0EA",
  white:"#FFFFFF",
  sage:"#1F7A5C", sageBg:"#E8F3EE",
  gold:"#C08A3E", goldBg:"#F8F0E2",
  sky:"#3A5BCC", lilac:"#7A6A9E", lilacBg:"#F0EDF6",
  rose:"#C0564A",
  g1:"#F4F2ED", g2:"#E6E2DA", g3:"#76726A", g4:"#4A463F",
  line:"#E6E2DA",
  amber:"#E8A33D", amberBg:"#FBF3E4",
};

const SP=[{id:"all",e:"🐾",l:"Tous"},{id:"chien",e:"🐕",l:"Chiens"},{id:"chat",e:"🐱",l:"Chats"},{id:"lapin",e:"🐰",l:"Lapins"},{id:"oiseau",e:"🦜",l:"Oiseaux"},{id:"reptile",e:"🦎",l:"Reptiles"},{id:"rongeur",e:"🐹",l:"Rongeurs"},{id:"cheval",e:"🐴",l:"Chevaux"}];
const RG=["Toute la France","Hauts-de-France","Île-de-France","Auvergne-Rhône-Alpes","Nouvelle-Aquitaine","Occitanie","PACA","Bretagne","Grand Est","Normandie","Pays de la Loire"];
const FP="M220,40 L260,35 L310,50 L340,60 L370,55 L410,70 L430,90 L450,100 L460,130 L450,160 L470,180 L480,210 L470,240 L490,265 L500,290 L490,320 L470,340 L450,360 L420,380 L390,390 L360,400 L340,420 L310,430 L280,440 L260,450 L230,440 L200,430 L170,420 L150,400 L130,380 L110,360 L90,340 L80,310 L70,280 L75,250 L70,220 L80,195 L70,170 L80,145 L100,125 L120,110 L140,95 L160,80 L185,60 Z";
const sv=(lat,lng)=>({x:((lng+5)/15)*420+80,y:((52-lat)/11)*420+30});
const LV=["Débutant","Explorateur","Passionné","Expert","Légende"];

const AN=[
  {id:1,name:"Luna",ph:"https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=700&fit=crop",sp:"chien",br:"Golden Retriever",ag:"2 ans",gn:"♀",ow:"Sophie M.",v:true,vc:true,pd:true,dt:"1.2km",ct:"Lille",rg:"Hauts-de-France",bi:"Soleil en peluche",tg:["Joueur","Sociable"],e:"",c:"#C8924E",co:97,pu:"reproduction",la:50.63,lo:3.07,ster:true,chip:true,allerg:"Aucune",energy:4,social:5,clean:5,food:"Croquettes premium",toy:"Balle 🎾",weight:"28 kg"},
  {id:2,name:"Rocky",ph:"https://images.unsplash.com/photo-1605897472359-85e4b94d685d?w=600&h=700&fit=crop",sp:"chien",br:"Labrador Noir",ag:"3 ans",gn:"♂",ow:"Marc D.",v:true,vc:true,pd:false,dt:"2.4km",ct:"Roubaix",rg:"Hauts-de-France",bi:"Athlète né",tg:["Sportif","Loyal"],e:"",c:"#5E7A9E",co:88,pu:"balade",la:50.69,lo:3.18,ster:false,chip:true,allerg:"Pollen",energy:5,social:4,clean:4,food:"BARF",toy:"Frisbee",weight:"32 kg"},
  {id:3,name:"Mimi",ph:"https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=700&fit=crop",sp:"chat",br:"British Shorthair",ag:"3 ans",gn:"♀",ow:"Léa B.",v:true,vc:true,pd:true,dt:"0.6km",ct:"Paris",rg:"Île-de-France",bi:"Reine de velours",tg:["Câlin","Élégant"],e:"",c:"#8B72A8",co:93,pu:"reproduction",la:48.86,lo:2.35,ster:true,chip:true,allerg:"Aucune",energy:2,social:3,clean:5,food:"Pâtée + croquettes",toy:"Souris en laine 🐭",weight:"5 kg"},
  {id:4,name:"Rio",ph:"https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=700&fit=crop",sp:"oiseau",br:"Ara Macao",ag:"4 ans",gn:"♂",ow:"Fatima K.",v:true,vc:false,pd:false,dt:"2.1km",ct:"Lyon",rg:"Auvergne-Rhône-Alpes",bi:"DJ à plumes",tg:["Bavard","Coloré"],e:"",c:"#C77A52",co:88,pu:"social",la:45.75,lo:4.83,ster:false,chip:false,allerg:"Aucune",energy:4,social:5,clean:3,food:"Graines & fruits",toy:"Miroir",weight:"1.2 kg"},
  {id:5,name:"Draco",ph:"https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?w=600&h=700&fit=crop",sp:"reptile",br:"Dragon Barbu",ag:"3 ans",gn:"♂",ow:"Maxime D.",v:true,vc:false,pd:false,dt:"4.1km",ct:"Bordeaux",rg:"Nouvelle-Aquitaine",bi:"Gardien zen",tg:["Calme","Rare"],e:"",c:"#4E9E78",co:82,pu:"reproduction",la:44.84,lo:-0.58,ster:false,chip:false,allerg:"Aucune",energy:2,social:2,clean:4,food:"Insectes & légumes",toy:"Branche à grimper",weight:"0.4 kg"},
  {id:6,name:"Éclipse",ph:"https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=700&fit=crop",sp:"cheval",br:"Andalou",ag:"6 ans",gn:"♀",ow:"Isabelle V.",v:true,vc:true,pd:true,dt:"8km",ct:"Rennes",rg:"Bretagne",bi:"Pure élégance",tg:["Élégant","Docile"],e:"",c:"#6B6B70",co:94,pu:"reproduction",la:48.11,lo:-1.68,ster:true,chip:true,allerg:"Aucune",energy:3,social:4,clean:5,food:"Foin & granulés",toy:"Ballon",weight:"450 kg"},
  {id:7,name:"Noisette",ph:"https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=700&fit=crop",sp:"rongeur",br:"Cochon d'Inde",ag:"1 an",gn:"♀",ow:"Emma F.",v:true,vc:false,pd:false,dt:"1.5km",ct:"Marseille",rg:"PACA",bi:"Mini célébrité",tg:["Doux","Sociable"],e:"",c:"#C98A6E",co:90,pu:"reproduction",la:43.30,lo:5.37,ster:false,chip:false,allerg:"Aucune",energy:3,social:5,clean:4,food:"Foin & légumes frais",toy:"Tunnel",weight:"1 kg"},
  {id:8,name:"Caramel",ph:"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=700&fit=crop",sp:"lapin",br:"Bélier Français",ag:"1 an",gn:"♀",ow:"Chloé M.",v:true,vc:true,pd:false,dt:"1.1km",ct:"Toulouse",rg:"Occitanie",bi:"Ambassadrice carottes",tg:["Curieux","Doux"],e:"",c:"#B89A56",co:80,pu:"reproduction",la:43.60,lo:1.44,ster:true,chip:true,allerg:"Aucune",energy:4,social:4,clean:4,food:"Foin Timothy 🌾",toy:"Carotte en bois 🥕",weight:"2.5 kg"},
  {id:9,name:"Simba",ph:"https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&h=700&fit=crop",sp:"chat",br:"Maine Coon",ag:"2 ans",gn:"♂",ow:"Julien R.",v:true,vc:true,pd:true,dt:"1.9km",ct:"Strasbourg",rg:"Grand Est",bi:"Lion miniature",tg:["Grand","Joueur"],e:"",c:"#B89A56",co:85,pu:"reproduction",la:48.58,lo:7.75,ster:true,chip:true,allerg:"Aucune",energy:3,social:5,clean:5,food:"Croquettes grain-free",toy:"Plumeau",weight:"7 kg"},
];

const VT=[
  {id:1,name:"Dr. Moreau",spec:"Généraliste",sp:["chien","chat"],r:4.9,dt:"0.4km",ok:true,p:"45€",sl:["Auj. 14h","Dem. 9h"],tc:true,pt:true,ct:"Lille",la:50.63,lo:3.06},
  {id:2,name:"Dr. Lefebvre",spec:"NAC & Reptiles",sp:["lapin","reptile","rongeur"],r:4.7,dt:"1.1km",ok:false,p:"65€",sl:[],tc:true,pt:true,ct:"Villeneuve",la:50.62,lo:3.14},
  {id:3,name:"Dr. Alaoui",spec:"Chats & NAC",sp:["chat","lapin"],r:4.9,dt:"0.6km",ok:true,p:"50€",sl:["Auj. 16h","Dem. 11h"],tc:false,pt:true,ct:"Paris",la:48.86,lo:2.38},
  {id:4,name:"Dr. Bernard",spec:"Dermato canine",sp:["chien","chat"],r:4.8,dt:"2.0km",ok:true,p:"55€",sl:["Jeu 15h","Ven 10h"],tc:true,pt:true,ct:"Lyon",la:45.75,lo:4.83},
  {id:5,name:"Dr. Vidal",spec:"Équins & Ferme",sp:["cheval"],r:4.6,dt:"3.2km",ok:true,p:"80€",sl:["Ven 11h","Sam 9h"],tc:false,pt:false,ct:"Seclin",la:50.55,lo:3.03},
];

const AS=[
  {id:1,name:"SPA Lille",type:"adoption",rg:"Hauts-de-France",an:43,ug:8,em:"",vf:true,ds:"Refuge municipal. Adoption gratuite le week-end.",la:50.63,lo:3.07},
  {id:2,name:"Refuge du Cœur",type:"adoption",rg:"Île-de-France",an:127,ug:15,em:"",vf:true,ds:"Association loi 1901, familles d'accueil bénévoles.",la:48.86,lo:2.35},
  {id:3,name:"NAC Rescue France",type:"adoption",rg:"Île-de-France",an:62,ug:12,em:"",vf:true,ds:"Seule asso nationale dédiée aux NAC.",la:48.87,lo:2.33},
  {id:4,name:"Équi-Secours",type:"sauvetage",rg:"Bretagne",an:18,ug:3,em:"",vf:true,ds:"Sauvetage et réhabilitation équins.",la:48.11,lo:-1.68},
  {id:5,name:"Dragon Rescue",type:"adoption",rg:"Île-de-France",an:19,ug:5,em:"",vf:true,ds:"Dragons barbus, geckos, tortues.",la:48.85,lo:2.34},
];

const LS=[
  {id:1,name:"Oscar",ph:"https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=700&fit=crop",sp:"chien",br:"Beagle",e:"",ct:"Lille",rg:"Hauts-de-France",ti:"2h",ug:true,rw:"100€",ds:"Collier rouge, répond à son prénom.",la:50.64,lo:3.08},
  {id:2,name:"Kiwi",ph:"https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=600&h=700&fit=crop",sp:"oiseau",br:"Perruche",e:"",ct:"Paris",rg:"Île-de-France",ti:"5h",ug:true,rw:"30€",ds:"Bague orange. Dit son prénom.",la:48.87,lo:2.33},
  {id:3,name:"Cannelle",ph:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=700&fit=crop",sp:"chat",br:"Européen roux",e:"",ct:"Lyon",rg:"Auvergne-RA",ti:"1j",ug:false,rw:null,ds:"Stérilisée, puce électronique.",la:45.76,lo:4.84},
  {id:4,name:"Zeus",ph:"https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=700&fit=crop",sp:"chien",br:"Berger Aus.",e:"",ct:"Bordeaux",rg:"Nouvelle-Aq.",ti:"3h",ug:true,rw:"50€",ds:"Collier bleu, boiteux patte droite.",la:44.85,lo:-0.57},
];

const PT=[
  {id:1,au:"Marie L.",av:"",sp:"chien",rg:"Hauts-de-France",ti:"2h",ti2:"Mon Golden a une bosse — inquiétant ?",bo:"Depuis hier j'ai remarqué une petite bosse. Elle ne semble pas avoir mal mais je suis très inquiète...",li:12,rp:8,tg:"Santé",ug:false,vr:true},
  {id:2,au:"Thomas K.",av:"",sp:"oiseau",rg:"Île-de-France",ti:"4h",ti2:"Mon Ara arrache ses plumes — sans réponse",bo:"Ça fait 3 semaines que Rio plume ses plumes. 2 vétérinaires sans résultat.",li:24,rp:19,tg:"Comportement",ug:true,vr:false},
  {id:3,au:"Léa B.",av:"",sp:"chat",rg:"Île-de-France",ti:"6h",ti2:"Stérilisation : quel âge idéal pour un mâle ?",bo:"Mon Maine Coon a 7 mois. Le vétérinaire dit 8 mois mais j'ai lu 6 ailleurs.",li:18,rp:14,tg:"Conseil",ug:false,vr:true},
  {id:4,au:"Emma F.",av:"",sp:"rongeur",rg:"PACA",ti:"2j",ti2:"Cobaye senior 8 ans — alimentation ?",bo:"Noisette commence à avoir du mal avec les croquettes standard.",li:31,rp:22,tg:"Nutrition",ug:false,vr:true},
];

const PR=[
  {id:1,name:"Harnais Sport Pro",brand:"RuffWear",price:"69€",old:"89€",cat:"Chiens",e:"",r:4.8,pt:true},
  {id:2,name:"Croquettes Grain Free",brand:"Acana",price:"54€",old:null,cat:"Nutrition",e:"",r:4.9,pt:true},
  {id:3,name:"GPS Tractive",brand:"Tractive",price:"49€",old:null,cat:"Sécurité",e:"",r:4.6,pt:true},
  {id:4,name:"Médaille QR Code",brand:"Furrix",price:"9,90€",old:null,cat:"Sécurité",e:"",r:5.0,pt:true},
  {id:5,name:"Terrarium Chauffant",brand:"Exo Terra",price:"89€",old:"110€",cat:"Reptiles",e:"",r:4.8,pt:false},
  {id:6,name:"Foin Timothy",brand:"Oxbow",price:"14€",old:null,cat:"Lapins",e:"",r:4.9,pt:false},
];

const RW=[
  {n:"-15% Toilettage",c:250,p:"Toiletteurs partenaires",cat:"partenaire",ic:"heart"},
  {n:"-20% Croquettes Acana",c:300,p:"Acana",cat:"partenaire",ic:"cart"},
  {n:"-10€ chez le vétérinaire",c:400,p:"Vét. partenaires",cat:"partenaire",ic:"stethoscope"},
  {n:"GPS Tractive -30%",c:800,p:"Tractive",cat:"partenaire",ic:"pin"},
  {n:"1 Boost découverte",c:200,p:"Essaie la 1ère position 30 min",cat:"boost",ic:"zap"},
  {n:"Entrée événement offerte",c:600,p:"Balades & concours Furrix",cat:"boost",ic:"calendar"},
  {n:"Badge « Membre Or »",c:1000,p:"Statut affiché sur ton profil",cat:"badge",ic:"trophy"},
  {n:"Badge « Ambassadeur »",c:2000,p:"Réservé aux plus actifs",cat:"badge",ic:"star"},
];
const EARN=[
  {n:"Connexion quotidienne",pts:"+10 / jour",ic:"flame"},
  {n:"Compléter ton profil",pts:"+50",ic:"check"},
  {n:"Nouveau match",pts:"+15",ic:"heart"},
  {n:"Parrainer un ami",pts:"+100",ic:"share"},
  {n:"Aider un animal perdu",pts:"+80",ic:"pin"},
  {n:"Poster dans la communauté",pts:"+20",ic:"messages"},
];
const PF=[{e:"",t:"Swipes illimités",d:"Fini la limite 5/j"},{e:"",t:"Voir vos likes",d:"Avant de swiper"},{e:"",t:"Boost mensuel",d:"1ère position 30min"},{e:"",t:"Téléconsultation",d:"Vét vidéo 7j/7"},{e:"",t:"Alertes perdus",d:"Push temps réel"},{e:"",t:"PawPoints x2",d:"Double chaque action"}];

// Buttons: compact, 8px radius, restrained. Primary = solid accent, secondary = hairline.
const btn=(bg=T.coral,full=false,sm=false)=>({background:bg,color:T.white,border:'1px solid transparent',borderRadius:8,padding:sm?'7px 14px':full?'11px':'9px 18px',fontWeight:600,fontSize:sm?13:14,letterSpacing:'-0.01em',cursor:'pointer',fontFamily:"'Inter',-apple-system,sans-serif",width:full?'100%':'auto',transition:'background 0.15s,border-color 0.15s,opacity 0.15s'});
const gh=(c=T.navy)=>({...btn(T.white,false,false),background:T.white,border:'1px solid '+T.line,color:c});
// Card: hairline border, near-zero shadow — Notion/Linear surface
const cd=(mb=12)=>({background:T.white,borderRadius:10,padding:'16px',border:'1px solid '+T.line,boxShadow:'0 1px 2px rgba(0,0,0,0.03)',marginBottom:mb});

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pop{0%{transform:scale(0.96);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes beat{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(90px) rotate(540deg);opacity:0}}
  .fade{animation:fadeUp 0.28s ease both}.pop{animation:pop 0.2s ease both}
  .beat{animation:beat 1.6s ease-in-out infinite}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  .skel{background:linear-gradient(90deg,#F0EDE6 25%,#FAF8F2 50%,#F0EDE6 75%);background-size:800px 100%;animation:shimmer 1.2s infinite linear}
  .imgFade{opacity:0;transition:opacity 0.35s ease}
  .imgFade.loaded{opacity:1}
  .hov{transition:border-color 0.15s,background 0.15s,transform 0.15s,box-shadow 0.15s}
  .hov:hover{border-color:#D4D4D8!important;background:#FCFCFD!important;transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,0.05)!important}
  input,textarea,select{font-family:'Inter',-apple-system,sans-serif}
  input:focus,textarea:focus,select:focus{outline:none;border-color:#1F7A5C!important;box-shadow:0 0 0 3px rgba(31,122,92,0.12)}
  button{font-family:'Inter',-apple-system,sans-serif;transition:transform 0.12s ease,opacity 0.12s ease}
  button:active{transform:scale(0.97);opacity:0.9}
  button:focus-visible,a:focus-visible{outline:2px solid #1F7A5C;outline-offset:2px}
  @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
  body,#root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
`;

// ─── ICON SET (inline SVG, stroke-based, Lucide-style) ──────────────────────
const Ic=({d,s=18,sw=1.6,fill="none",c="currentColor",style})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...style}}>{d}</svg>
);
const ICON={
  discover:<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  health:<><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></>,
  community:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  messages:<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  calendar:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  user:<><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></>,
  bell:<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  bot:<><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M8 4h8M9 14h.01M15 14h.01"/></>,
  close:<><path d="M18 6 6 18M6 6l12 12"/></>,
  arrow:<><path d="M5 12h14M12 5l7 7-7 7"/></>,
  check:<><path d="M20 6 9 17l-5-5"/></>,
  alert:<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></>,
  shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></>,
  star:<><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/></>,
  heart:<><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></>,
  pin:<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
  video:<><path d="m23 7-7 5 7 5V7Z"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
  lock:<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  stethoscope:<><path d="M4 3v6a4 4 0 0 0 8 0V3M8 13v3a5 5 0 0 0 10 0v-1"/><circle cx="18" cy="14" r="2"/></>,
  cart:<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></>,
  gift:<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"/></>,
  zap:<><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></>,
  share:<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></>,
  plus:<><path d="M12 5v14M5 12h14"/></>,
  flame:<><path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3 1 2 2 2 2 2 1-3 1-5 2-8Z"/></>,
  trophy:<><path d="M6 9a6 6 0 0 0 12 0V3H6Z"/><path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M9 21h6M12 15v6"/></>,
  map:<><path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></>,
  send:<><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></>,
  syringe:<><path d="m18 2 4 4M17 7 3 21M9 11l4 4M14 6l4 4M11 9l1.5-1.5"/></>,
};

// ─── ANIMAL ILLUSTRATIONS (friendly line-art faces, currentColor) ───────────
const PAWS={
  chien:<><path d="M30 38c-7 0-13-5-13-13 0-3 1-6 2-8-2-4-2-9-1-12 4 1 7 4 9 7 2-1 4-1 6-1s4 0 6 1c2-3 5-6 9-7 1 3 1 8-1 12 1 2 2 5 2 8 0 8-6 13-13 13z" fill="currentColor" opacity="0.12"/><circle cx="25" cy="30" r="1.8" fill="currentColor"/><circle cx="35" cy="30" r="1.8" fill="currentColor"/><path d="M30 34c-1.5 0-2.5 1-2.5 2M30 34c1.5 0 2.5 1 2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><ellipse cx="30" cy="34" rx="1.6" ry="1.2" fill="currentColor"/></>,
  chat:<><path d="M18 18c2-4 4-6 5-6s2 4 2 7c2-1 3-1 5-1s3 0 5 1c0-3 1-7 2-7s3 2 5 6c2 3 3 7 3 11 0 8-7 13-15 13s-15-5-15-13c0-4 1-8 3-11z" fill="currentColor" opacity="0.12"/><path d="M24 30l3 1M36 30l-3 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="25" cy="29" r="1.6" fill="currentColor"/><circle cx="35" cy="29" r="1.6" fill="currentColor"/><path d="M30 33l-1.5 1.5h3z" fill="currentColor"/><path d="M30 34.5v2M30 36.5c-2 0-3-1-3.5-2M30 36.5c2 0 3-1 3.5-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>,
  lapin:<><ellipse cx="23" cy="16" rx="3" ry="9" fill="currentColor" opacity="0.12"/><ellipse cx="37" cy="16" rx="3" ry="9" fill="currentColor" opacity="0.12"/><circle cx="30" cy="34" r="11" fill="currentColor" opacity="0.12"/><circle cx="26" cy="32" r="1.6" fill="currentColor"/><circle cx="34" cy="32" r="1.6" fill="currentColor"/><path d="M30 35l-1.5 1.5h3z" fill="currentColor"/><path d="M30 36.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>,
  oiseau:<><path d="M30 16c8 0 14 6 14 14 0 7-5 13-14 13s-14-6-14-13c0-8 6-14 14-14z" fill="currentColor" opacity="0.12"/><path d="M30 16c-2-3-1-6 1-7 1 2 1 5-1 7z" fill="currentColor" opacity="0.3"/><circle cx="27" cy="28" r="1.8" fill="currentColor"/><path d="M33 28l6-2-6-1z" fill="currentColor"/></>,
  reptile:<><ellipse cx="30" cy="32" rx="14" ry="10" fill="currentColor" opacity="0.12"/><path d="M16 30c-2-1-4-1-5 0M44 30c2-1 4-1 5 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="24" cy="30" r="1.6" fill="currentColor"/><circle cx="36" cy="30" r="1.6" fill="currentColor"/><path d="M22 36c3 2 13 2 16 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M24 24l2-2M30 23v-2M36 24l-2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>,
  rongeur:<><circle cx="21" cy="24" r="5" fill="currentColor" opacity="0.12"/><circle cx="39" cy="24" r="5" fill="currentColor" opacity="0.12"/><circle cx="30" cy="34" r="11" fill="currentColor" opacity="0.12"/><circle cx="26" cy="33" r="1.5" fill="currentColor"/><circle cx="34" cy="33" r="1.5" fill="currentColor"/><circle cx="30" cy="36" r="1.3" fill="currentColor"/></>,
  cheval:<><path d="M22 14c-3 2-5 6-5 11l-2 14c0 5 6 8 15 8s15-3 15-8l-2-14c0-5-2-9-5-11-2 3-4 5-8 5s-6-2-8-5z" fill="currentColor" opacity="0.12"/><circle cx="25" cy="32" r="1.6" fill="currentColor"/><circle cx="35" cy="32" r="1.6" fill="currentColor"/><ellipse cx="30" cy="40" rx="4" ry="3" fill="currentColor" opacity="0.2"/><circle cx="28" cy="40" r="0.9" fill="currentColor"/><circle cx="32" cy="40" r="0.9" fill="currentColor"/></>,
  ferme:<><circle cx="30" cy="32" r="13" fill="currentColor" opacity="0.12"/><circle cx="25" cy="30" r="1.6" fill="currentColor"/><circle cx="35" cy="30" r="1.6" fill="currentColor"/><ellipse cx="30" cy="36" rx="3.5" ry="2.5" fill="currentColor" opacity="0.2"/></>,
};
// PetAvatar — renders a friendly illustrated face by species, tinted
const PetAvatar=({sp,size=48,color,bg})=>(
  <div style={{width:size,height:size,borderRadius:"30%",background:bg||"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
    <svg width={size*0.86} height={size*0.86} viewBox="8 8 44 40" style={{color:color||"#4A463F"}}>{PAWS[sp]||PAWS.chien}</svg>
  </div>
);
// PetPhoto — real photo if available, else illustrated avatar
const PetPhoto=({pet,size=48,round=true})=>(
  pet && pet.ph
    ? <img src={pet.ph} alt={pet.name||""} onError={e=>{e.target.style.visibility="hidden";}} style={{width:size,height:size,objectFit:"cover",borderRadius:round?"50%":12,flexShrink:0,background:(pet.c||"#ccc")+"22"}}/>
    : <PetAvatar sp={pet?pet.sp:"chien"} size={size} color={pet?pet.c:"#888"} bg={pet?(pet.c+"1A"):"#eee"}/>
);

// ─── MATCHING ENGINE ───────────────────────────────────────────────────
const SIZE_MAP={cheval:5,chien:3,chat:2,lapin:2,oiseau:1,rongeur:1,reptile:2,ferme:4};
const PURP_C={reproduction:{reproduction:1,social:.4,balade:.3,show:.5},balade:{balade:1,social:.8,reproduction:.3,show:.4},social:{social:1,balade:.8,reproduction:.4,show:.6},show:{show:1,social:.6,balade:.4,reproduction:.5}};
const parseAge=(s)=>{const n=parseFloat(s);return isNaN(n)?2:n;};
function computeScore(my,c){
  let s=0;
  s+=.35*(my.species===c.sp?1:(my.purpose==="social"?.6:.2));
  s+=.25*((PURP_C[my.purpose||"balade"]?.[c.pu||"balade"])??0.4);
  s+=.15*Math.max(0,1-Math.abs((SIZE_MAP[my.species]||2)-(SIZE_MAP[c.sp]||2))*.25);
  s+=.15*Math.max(0,1-Math.abs(parseAge(my.age)-parseAge(c.ag))*.15);
  s+=.05*(c.v?1:0)+.05*(c.vc?1:0);
  return Math.min(99,Math.max(62,Math.round(62+s*37)));
}
function buildPool(animals,my,filt,passedIds,cycle){
  const f=animals.filter(a=>{
    if(filt.species&&filt.species!=="all"&&a.sp!==filt.species)return false;
    if(filt.spF&&filt.spF!=="all"&&a.sp!==filt.spF)return false;
    if(filt.region&&filt.region!=="Toute la France"&&a.rg!==filt.region)return false;
    if(filt.purpose&&filt.purpose!=="all"&&a.pu!==filt.purpose)return false;
    if(filt.verified&&!a.v)return false;
    if(filt.pedigree&&!a.pd)return false;
    return true;
  });
  const cands=cycle===0?f.filter(a=>!passedIds.has(a.id)):f;
  return cands.map(a=>({...a,score:Math.min(99,Math.max(62,computeScore(my,a)+(Math.floor(Math.random()*7)-3)+(cycle>0&&passedIds.has(a.id)?-5:0)))}))
    .sort((a,b)=>b.score!==a.score?b.score-a.score:(parseFloat(a.dt)||99)-(parseFloat(b.dt)||99));
}

// ─── PERSISTENCE ────────────────────────────────────────────────────────────
const SK="pm_v3";
const todayStr=()=>new Date().toISOString().slice(0,10);
const yesterdayStr=()=>{const y=new Date();y.setDate(y.getDate()-1);return y.toISOString().slice(0,10);};
const loadLS=()=>{try{const r=localStorage.getItem(SK);return r?JSON.parse(r):null;}catch{return null;}};
const saveLS=(s)=>{try{localStorage.setItem(SK,JSON.stringify(s));}catch{}};

export default function Furrix() {
  const [screen,setScrn]=useState("onboard");
  const [onStep,setOS]=useState(0);
  const [myPet,setMP]=useState({name:"",species:"chien",breed:"",age:"",gender:"♂",purpose:"balade",ster:false,chip:false,vc:false,allerg:"",energy:3,social:3,clean:3,food:"",toy:"",weight:"",ownerName:"",ownerCity:"",ownerBio:""});

  // ── PERSISTED RETENTION STORE ──
  const [store,setStore]=useState(()=>{
    const s=loadLS();
    const base={streak:0,lastDay:null,swipesToday:0,paws:120,xp:0,level:1,dailyDone:false,matches:[]};
    if(!s)return base;
    if(s.lastDay&&s.lastDay!==todayStr()){
      if(s.lastDay!==yesterdayStr())return{...base,...s,streak:0,swipesToday:0,dailyDone:false};
      return{...base,...s,swipesToday:0,dailyDone:false};
    }
    return{...base,...s};
  });
  useEffect(()=>{saveLS(store);},[store]);

  // Derived (keep old names so render code works unchanged)
  const streak=store.streak;
  const level=store.level;
  const paws=store.paws;
  const xp=store.xp;
  const daily=store.dailyDone;
  const matches=store.matches;
  const setMatches=(fn)=>setStore(p=>({...p,matches:typeof fn==="function"?fn(p.matches):fn}));
  const setDaily=()=>{};
  const setPaws=(fn)=>setStore(p=>({...p,paws:typeof fn==="function"?fn(p.paws):fn}));

  // ── SWIPE ENGINE (60fps, zero rerender) ──
  const [ci,setCi]=useState(0);
  const cardRef=useRef(null);
  const dragging=useRef(false);
  const startXr=useRef(0);
  const curXr=useRef(0);
  const animating=useRef(false);
  const [passedIds]=useState(()=>new Set());
  const [cycle,setCycle]=useState(0);
  const [cardKey,setCardKey]=useState(0);
  const [almostMatch,setAlmostMatch]=useState(null);
  const [profM,setProfM]=useState(null);
  const [tab,setTab]=useState("discover");
  const [dSub,setDS]=useState("swipe");
  const [sTab,setST]=useState("vets");
  const [spF,setSpF]=useState("all");
  const [rgF,setRgF]=useState("Toute la France");
  const [showM,setShowM]=useState(null);
  const [chatP,setChatP]=useState(null);
  const [msgs,setMsgs]=useState({});
  const [mIn,setMIn]=useState("");
  const [mapM,setMapM]=useState("lost");
  const [hovP,setHovP]=useState(null);
  const [lostM,setLostM]=useState(null);
  const [vetM,setVetM]=useState(null);
  const [assoM,setAssoM]=useState(null);
  const [postM,setPostM]=useState(null);
  const [fOpen,setFO]=useState(false);
  const [filt,setFilt]=useState({purpose:"all",verified:false,pedigree:false});
  const [slSel,setSlSel]=useState(null);
  const [premM,setPremM]=useState(false);
  const [prem,setPrem]=useState(false);
  const [toast,setToast]=useState(null);
  const [rp,setRp]=useState(null);
  const [notif,setNotif]=useState(3);
  const [cartN,setCartN]=useState(0);
  const [mcat,setMcat]=useState("Tous");
  const [tcOpen,setTcO]=useState(false);
  const [npOpen,setNpO]=useState(false);
  const [npost,setNpost]=useState({title:"",body:"",tag:"Conseil"});
  const [cSp,setCSp]=useState("all");
  const [cSrch,setCSrch]=useState("");
  const [vSp,setVSp]=useState("all");
  const [shRw,setShRw]=useState(false);
  const [shSh,setShSh]=useState(false);
  const [aiO,setAiO]=useState(false);
  const [aiMsg,setAiMsg]=useState("");
  const [aiH,setAiH]=useState([{f:"ai",t:"Bonjour ! Je suis PawAI Posez-moi n'importe quelle question sur vos animaux !"}]);
  const [boost,setBoost]=useState(false);

  const sT=(m,t="ok")=>{setToast({m,t});setTimeout(()=>setToast(null),2600);};
  const aP=(n,r="")=>{
    setStore(prev=>{
      const mult=prem?2:1;const g=n*mult;
      const nx=prev.xp+g*2;const thr=[0,500,1500,3500,7500,15000];
      let nl=1;for(let i=thr.length-1;i>=0;i--)if(nx>=thr[i]){nl=i+1;break;}
      return{...prev,paws:prev.paws+g,xp:nx,level:nl};
    });
    setRp({n,r});setTimeout(()=>setRp(null),2000);
  };

  const swipeFilt={species:spF,region:rgF,purpose:filt.purpose,verified:filt.verified,pedigree:filt.pedigree};
  const pool=useMemo(()=>buildPool(AN,myPet,swipeFilt,passedIds,cycle),[myPet,spF,rgF,filt.purpose,filt.verified,filt.pedigree,cycle,cardKey]);// eslint-disable-line
  const anim=pool[ci%Math.max(pool.length,1)];

  const DAILY_FREE=5;
  const swipesLeft=Math.max(0,DAILY_FREE-store.swipesToday);
  const canSwipe=prem||swipesLeft>0;
  const streakAtRisk=store.streak>0&&store.lastDay!==todayStr()&&new Date().getHours()>=18;

  // Card transform via direct DOM (no rerender during drag)
  const setCardTf=useCallback((x,fly=false)=>{
    const el=cardRef.current;if(!el)return;
    el.style.transition=fly?"transform 0.38s cubic-bezier(0.25,1,0.5,1)":"none";
    el.style.transform=`translateX(${x}px) rotate(${x*0.042}deg)`;
    const lk=el.querySelector("[data-ov='like']");const np=el.querySelector("[data-ov='nope']");
    if(lk)lk.style.opacity=Math.min(Math.max(x/88,0),1);
    if(np)np.style.opacity=Math.min(Math.max(-x/88,0),1);
  },[]);

  const advanceCard=useCallback(()=>{
    setCi(prev=>{const next=prev+1;if(next>=pool.length){setCycle(c=>c+1);return 0;}return next;});
    setCardKey(k=>k+1);
  },[pool.length]);

  const commitSwipe=useCallback((dir)=>{
    const a=pool[ci%Math.max(pool.length,1)];
    if(!a)return;
    setStore(prev=>{
      if(!prem&&prev.swipesToday>=DAILY_FREE)return prev;
      const today=todayStr();
      const newCount=prev.swipesToday+1;
      const newStreak=prev.lastDay!==today?(prev.lastDay===yesterdayStr()?prev.streak+1:1):prev.streak;
      const dailyDone=newCount>=5;
      const bonus=(dailyDone&&!prev.dailyDone)?25:0;
      const mult=prem?2:1;
      const gain=(dir==="right"?10:2)*mult+bonus;
      const nx=prev.xp+(dir==="right"?20:4)*mult+bonus*2;
      const thr=[0,500,1500,3500,7500,15000];let nl=1;for(let i=thr.length-1;i>=0;i--)if(nx>=thr[i]){nl=i+1;break;}
      const newMatches=dir==="right"&&!prev.matches.find(m=>m.id===a.id)?[...prev.matches,{...a,matchedAt:Date.now()}]:prev.matches;
      return{...prev,swipesToday:newCount,lastDay:today,streak:newStreak,dailyDone,paws:prev.paws+gain,xp:nx,level:nl,matches:newMatches};
    });
    setRp({n:dir==="right"?10:2,r:dir==="right"?"Match !":"Swipe"});setTimeout(()=>setRp(null),2000);
    if(dir==="right"){setTimeout(()=>setShowM(a),200);}
    else{passedIds.add(a.id);if(a.score>=85){setAlmostMatch(a);setTimeout(()=>setAlmostMatch(null),4000);}}
    advanceCard();
  },[pool,ci,prem,passedIds,advanceCard]);// eslint-disable-line

  const flyOut=useCallback((dir)=>{
    const el=cardRef.current;if(!el||animating.current)return;
    if(!prem&&store.swipesToday>=DAILY_FREE){setPremM(true);return;}
    animating.current=true;
    const tx=dir==="right"?window.innerWidth*1.4:-window.innerWidth*1.4;
    el.style.transition="transform 0.38s cubic-bezier(0.25,1,0.5,1)";
    el.style.transform=`translateX(${tx}px) rotate(${dir==="right"?22:-22}deg)`;
    setTimeout(()=>{animating.current=false;commitSwipe(dir);},380);
  },[prem,store.swipesToday,commitSwipe]);

  const snapBack=useCallback(()=>{
    setCardTf(0,true);
    const el=cardRef.current;if(!el)return;
    ["[data-ov='like']","[data-ov='nope']"].forEach(s=>{const e=el.querySelector(s);if(e){e.style.transition="opacity 0.2s";e.style.opacity=0;}});
  },[setCardTf]);

  useEffect(()=>{
    const el=cardRef.current;if(!el)return;
    const onS=(e)=>{if(animating.current)return;dragging.current=true;startXr.current=e.clientX??e.touches?.[0]?.clientX??0;el.style.cursor="grabbing";};
    const onM=(e)=>{if(!dragging.current)return;const x=(e.clientX??e.touches?.[0]?.clientX??0)-startXr.current;curXr.current=x;setCardTf(x);};
    const onE=()=>{if(!dragging.current)return;dragging.current=false;el.style.cursor="grab";Math.abs(curXr.current)>88?flyOut(curXr.current>0?"right":"left"):(snapBack(),curXr.current=0);};
    el.addEventListener("mousedown",onS,{passive:true});el.addEventListener("mousemove",onM,{passive:true});el.addEventListener("mouseup",onE);el.addEventListener("mouseleave",onE);
    el.addEventListener("touchstart",onS,{passive:true});el.addEventListener("touchmove",onM,{passive:true});el.addEventListener("touchend",onE);
    return()=>{el.removeEventListener("mousedown",onS);el.removeEventListener("mousemove",onM);el.removeEventListener("mouseup",onE);el.removeEventListener("mouseleave",onE);el.removeEventListener("touchstart",onS);el.removeEventListener("touchmove",onM);el.removeEventListener("touchend",onE);};
  },[cardKey,setCardTf,flyOut,snapBack]);

  const doSw=(dir)=>{if(canSwipe)flyOut(dir);else setPremM(true);};

  const sendM=()=>{
    if(!mIn.trim()||!chatP)return;
    const k=chatP.id;
    setMsgs(p=>({...p,[k]:[...(p[k]||[]),{fr:"me",tx:mIn}]}));
    setMIn("");aP(5,"Message");
    setTimeout(()=>setMsgs(p=>({...p,[k]:[...(p[k]||[]),{fr:"them",tx:"Super profil On organise une rencontre ce weekend ?"}]})),1300);
  };

  const mPins=()=>{
    if(mapM==="lost")return LS.map(l=>({...l,color:T.rose,type:"lost",lat:l.la,lng:l.lo}));
    if(mapM==="vets")return VT.filter(v=>v.ok).map(v=>({...v,color:T.sage,type:"vet",e:"",lat:v.la,lng:v.lo}));
    if(mapM==="assos")return AS.map(a=>({...a,color:T.lilac,type:"asso",e:a.em,lat:a.la,lng:a.lo}));
    if(mapM==="animals")return pool.slice(0,8).map(a=>({...a,color:a.c,type:"animal",lat:a.la,lng:a.lo}));
    return[];
  };
  const handlePin=(p)=>{
    if(p.type==="lost")setLostM(LS.find(l=>l.id===p.id)||p);
    else if(p.type==="vet")setVetM(VT.find(v=>v.id===p.id)||p);
    else if(p.type==="asso")setAssoM(AS.find(a=>a.id===p.id)||p);
    else sT(p.name||"");
  };

  const fp=PT.filter(p=>(cSp==="all"||p.sp===cSp)&&(!cSrch||p.ti2.toLowerCase().includes(cSrch.toLowerCase())));
  const fprod=mcat==="Tous"?PR:PR.filter(p=>p.cat===mcat);
  const xpP=(xp%500)/500*100;

  const SN=(items,active,setA)=>(
    <div style={{display:"flex",gap:0,background:T.g1,borderRadius:8,padding:4,marginBottom:16}}>
      {items.map(i=><button key={i.id} onClick={()=>setA(i.id)} style={{flex:1,padding:"9px 4px",background:active===i.id?T.white:"transparent",color:active===i.id?T.navy:T.g3,border:"none",borderRadius:6,fontWeight:active===i.id?600:500,fontSize:13,cursor:"pointer",transition:"all 0.15s",boxShadow:active===i.id?"0 1px 2px rgba(0,0,0,0.06)":"none",fontFamily:"'Inter',sans-serif"}}>{i.l}</button>)}
    </div>
  );

  if(screen==="onboard") return (
    <div style={{fontFamily:"'Inter',sans-serif",minHeight:"100vh",maxWidth:430,margin:"0 auto",background:T.navy,overflowX:"hidden"}}>
      <style>{CSS}</style>
      {onStep===0&&(
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"0 28px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,width:1,height:1,pointerEvents:"none"}}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",paddingTop:60}}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:10,marginBottom:30}}>
              <div style={{width:64,height:64,borderRadius:18,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="48" height="48" viewBox="8 8 44 40" style={{color:"#C8924E"}}>{PAWS.chat}</svg></div>
              <div style={{width:80,height:80,borderRadius:22,background:T.coral,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(31,122,92,0.4)"}}><svg width="62" height="62" viewBox="8 8 44 40" style={{color:"white"}}>{PAWS.chien}</svg></div>
              <div style={{width:64,height:64,borderRadius:18,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="48" height="48" viewBox="8 8 44 40" style={{color:"#C98A6E"}}>{PAWS.lapin}</svg></div>
            </div>
            <h1 style={{fontFamily:"'Inter',sans-serif",fontSize:46,fontWeight:600,letterSpacing:"-0.03em",color:T.white,lineHeight:1.05,marginBottom:14}}>Furrix</h1>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:16,lineHeight:1.6,marginBottom:36,maxWidth:320}}>La plateforme qui réunit le suivi, la communauté et la rencontre pour tous vos animaux.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:36,width:"100%"}}>
              {[["12k+","Propriétaires"],["8","Espèces"],["4,9","Note moyenne"],["94%","Satisfaction"]].map(([v,l])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.07)",borderRadius:10,padding:"12px 8px"}}>
                  <div style={{fontWeight:600,fontSize:18,color:T.coral}}>{v}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:11,width:"100%"}}>
              <button style={{...btn(T.white),color:T.navy,width:"100%",padding:"16px",fontSize:15,fontWeight:600}} onClick={()=>setOS(1)}>Créer mon profil gratuit</button>
              <button style={{background:"none",border:"2px solid rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.7)",borderRadius:50,padding:"14px",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}} onClick={()=>setScrn("app")}>J'ai déjà un compte</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8,marginTop:28}}>
              {["Vérifié","Carte live","Vétérinaires","Associations","Communauté","PawAI"].map(f=>(
                <span key={f} style={{background:"rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.7)",borderRadius:10,padding:"5px 12px",fontSize:11,fontWeight:600}}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      {onStep===1&&(
        <div style={{padding:"56px 24px 40px",minHeight:"100vh"}}>
          <div style={{display:"flex",gap:6,marginBottom:22}}>{[1,2,3,4].map(n=><div key={n} style={{height:4,flex:1,borderRadius:2,background:n<=onStep?T.coral:"rgba(255,255,255,0.15)",transition:"background 0.3s"}}/>)}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:30,fontWeight:600,color:"white",marginBottom:6}}>Votre animal 🐶</div>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:14,marginBottom:20}}>Commençons par les bases</p>
          <div style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:24,display:"flex",flexDirection:"column",gap:16,border:"1px solid rgba(255,255,255,0.1)"}}>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:9,letterSpacing:"0.1em"}}>ESPÈCE</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {["chien","chat","lapin","oiseau","reptile","rongeur","cheval","ferme"].map((k,i)=>{
                  const sel=myPet.species===k;
                  return <button key={k} onClick={()=>setMP({...myPet,species:k})} style={{padding:"10px 4px",border:`1.5px solid ${sel?T.coral:"rgba(255,255,255,0.14)"}`,borderRadius:10,background:sel?"rgba(31,122,92,0.18)":"rgba(255,255,255,0.04)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}><svg width="30" height="30" viewBox="8 8 44 40" style={{color:sel?"#fff":"rgba(255,255,255,0.55)"}}>{PAWS[k]||PAWS.chien}</svg><span style={{fontSize:9,fontWeight:600,textTransform:"capitalize",color:sel?"#fff":"rgba(255,255,255,0.5)"}}>{k}</span></button>;
                })}
              </div>
            </div>
            {[{l:"PRÉNOM",k:"name",ph:"Max, Luna, Rio..."},{l:"RACE",k:"breed",ph:"Labrador, Maine Coon..."}].map(f=>(
              <div key={f.k}>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:7,letterSpacing:"0.1em"}}>{f.l}</div>
                <input value={myPet[f.k]} onChange={e=>setMP({...myPet,[f.k]:e.target.value})} placeholder={f.ph} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"13px 16px",fontSize:15,fontWeight:600,color:"white",fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:7,letterSpacing:"0.1em"}}>ÂGE</div>
                <input value={myPet.age} onChange={e=>setMP({...myPet,age:e.target.value})} placeholder="2 ans" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"13px 16px",fontSize:15,fontWeight:600,color:"white",fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:7,letterSpacing:"0.1em"}}>SEXE</div>
                <div style={{display:"flex",gap:6}}>
                  {["♂","♀"].map(g=><button key={g} onClick={()=>setMP({...myPet,gender:g})} style={{flex:1,padding:"12px",border:`1.5px solid ${myPet.gender===g?T.coral:"rgba(255,255,255,0.14)"}`,borderRadius:8,background:myPet.gender===g?"rgba(31,122,92,0.18)":"rgba(255,255,255,0.04)",color:"white",fontSize:18,fontWeight:600,cursor:"pointer"}}>{g}</button>)}
                </div>
              </div>
            </div>
            <button style={btn(T.coral,true)} onClick={()=>setOS(2)}>Continuer</button>
          </div>
        </div>
      )}
      {onStep===2&&(
        <div style={{padding:"50px 24px 40px",minHeight:"100vh"}}>
          <div style={{display:"flex",gap:6,marginBottom:22}}>{[1,2,3,4].map(n=><div key={n} style={{height:4,flex:1,borderRadius:2,background:n<=onStep?T.coral:"rgba(255,255,255,0.15)",transition:"background 0.3s"}}/>)}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:30,fontWeight:600,color:"white",marginBottom:6}}>Son profil 🐾</div>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:14,marginBottom:20}}>Plus c'est complet, plus les matchs sont pertinents</p>
          <div style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:20,display:"flex",flexDirection:"column",gap:18,border:"1px solid rgba(255,255,255,0.1)"}}>

            {/* Santé */}
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:10,letterSpacing:"0.1em"}}>SANTÉ 🩺</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[{k:"vc",l:"Vacciné"},{k:"ster",l:"Stérilisé"},{k:"chip",l:"Pucé (identifié)"}].map(t=>(
                  <div key={t.k} onClick={()=>setMP({...myPet,[t.k]:!myPet[t.k]})} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:8}}>
                    <span style={{fontSize:13,color:"white",fontWeight:500}}>{t.l}</span>
                    <div style={{width:42,height:24,background:myPet[t.k]?T.coral:"rgba(255,255,255,0.15)",borderRadius:50,position:"relative",transition:"background 0.2s"}}><div style={{position:"absolute",width:18,height:18,background:"white",borderRadius:"50%",top:3,left:myPet[t.k]?21:3,transition:"left 0.2s"}}/></div>
                  </div>
                ))}
                <input value={myPet.allerg} onChange={e=>setMP({...myPet,allerg:e.target.value})} placeholder="Allergies (ou « Aucune »)" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"12px 14px",fontSize:14,fontWeight:500,color:"white",fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
              </div>
            </div>

            {/* Caractère */}
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:10,letterSpacing:"0.1em"}}>CARACTÈRE ✨</div>
              {[{k:"energy",l:"Énergie ⚡"},{k:"social",l:"Sociabilité 🐾"},{k:"clean",l:"Propreté 🛁"}].map(t=>(
                <div key={t.k} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"white"}}>{t.l}</span><span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{myPet[t.k]}/5</span></div>
                  <div style={{display:"flex",gap:6}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setMP({...myPet,[t.k]:n})} style={{flex:1,height:10,borderRadius:5,border:"none",cursor:"pointer",background:n<=myPet[t.k]?T.coral:"rgba(255,255,255,0.12)",transition:"background 0.15s"}}/>)}</div>
                </div>
              ))}
            </div>

            {/* Habitudes */}
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:10,letterSpacing:"0.1em"}}>HABITUDES 🦴</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <input value={myPet.food} onChange={e=>setMP({...myPet,food:e.target.value})} placeholder="Alimentation (croquettes, BARF...)" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"12px 14px",fontSize:14,fontWeight:500,color:"white",fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
                <input value={myPet.toy} onChange={e=>setMP({...myPet,toy:e.target.value})} placeholder="Jouet préféré 🎾" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"12px 14px",fontSize:14,fontWeight:500,color:"white",fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
                <input value={myPet.weight} onChange={e=>setMP({...myPet,weight:e.target.value})} placeholder="Poids (ex. 12 kg)" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"12px 14px",fontSize:14,fontWeight:500,color:"white",fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
              </div>
            </div>

            <button style={btn(T.coral,true)} onClick={()=>setOS(3)}>Continuer</button>
          </div>
        </div>
      )}
      {onStep===3&&(
        <div style={{padding:"50px 24px 40px",minHeight:"100vh"}}>
          <div style={{display:"flex",gap:6,marginBottom:22}}>{[1,2,3,4].map(n=><div key={n} style={{height:4,flex:1,borderRadius:2,background:n<=onStep?T.coral:"rgba(255,255,255,0.15)",transition:"background 0.3s"}}/>)}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:30,fontWeight:600,color:"white",marginBottom:6}}>Et vous ? 👋</div>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:14,marginBottom:20}}>Quelques infos sur le maître</p>
          <div style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:24,display:"flex",flexDirection:"column",gap:16,border:"1px solid rgba(255,255,255,0.1)"}}>
            {[{l:"PRÉNOM",k:"ownerName",ph:"Votre prénom"},{l:"VILLE",k:"ownerCity",ph:"Lille, Paris, Lyon..."}].map(f=>(
              <div key={f.k}>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:7,letterSpacing:"0.1em"}}>{f.l}</div>
                <input value={myPet[f.k]} onChange={e=>setMP({...myPet,[f.k]:e.target.value})} placeholder={f.ph} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"13px 16px",fontSize:15,fontWeight:600,color:"white",fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
              </div>
            ))}
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:7,letterSpacing:"0.1em"}}>BIO</div>
              <textarea value={myPet.ownerBio} onChange={e=>setMP({...myPet,ownerBio:e.target.value})} placeholder="Parlez un peu de vous et de votre compagnon..." rows={3} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"13px 16px",fontSize:14,fontWeight:500,color:"white",fontFamily:"'Inter',sans-serif",resize:"none"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
            </div>
            <button style={btn(T.coral,true)} onClick={()=>setOS(4)}>Continuer</button>
          </div>
        </div>
      )}
      {onStep===4&&(
        <div style={{padding:"56px 24px 40px",minHeight:"100vh"}}>
          <div style={{display:"flex",gap:6,marginBottom:22}}>{[1,2,3,4].map(n=><div key={n} style={{height:4,flex:1,borderRadius:2,background:n<=onStep?T.coral:"rgba(255,255,255,0.15)",transition:"background 0.3s"}}/>)}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:30,fontWeight:600,color:"white",marginBottom:6}}>Vérification ✅</div>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:14,marginBottom:20}}>Ces badges augmentent vos matchs de +67%</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{ic:"shield",t:"France Identité",d:"Vérification officielle gratuite",b:"+40%"},{ic:"syringe",t:"Carnet de santé",d:"Vaccins et traitements",b:"+15%"},{ic:"trophy",t:"Pedigree / LOF",d:"Certifiez les origines",b:"+12%"}].map((v,i)=>(
              <div key={i} onClick={()=>sT(`${v.t} lancé`)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"14px 16px",display:"flex",gap:12,alignItems:"center",cursor:"pointer"}}>
                <div style={{width:42,height:42,background:T.coralBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.coral}}><Ic d={ICON[v.ic]} s={19}/></div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:"white"}}>{v.t}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>{v.d}</div></div>
                <div style={{fontSize:12,fontWeight:600,color:T.coral}}>{v.b}</div>
              </div>
            ))}
            <button style={btn(T.coral,true)} onClick={()=>setScrn("app")}>Accéder à Furrix</button>
            <button style={{background:"none",border:"none",color:"rgba(255,255,255,0.35)",fontWeight:600,fontSize:13,cursor:"pointer",padding:"8px",fontFamily:"'Inter',sans-serif"}} onClick={()=>setScrn("app")}>Passer</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:T.cream,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {toast&&<div className="pop" style={{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",background:toast.t==="err"?T.rose:toast.t==="warn"?"#D97706":T.sage,color:"white",padding:"11px 22px",borderRadius:50,zIndex:9999,fontWeight:600,fontSize:13,whiteSpace:"nowrap",pointerEvents:"none",boxShadow:"0 6px 20px rgba(0,0,0,0.18)"}}>{toast.m}</div>}
      {rp&&<div className="pop" style={{position:"fixed",top:72,right:16,background:T.navy,color:"white",padding:"8px 16px",borderRadius:50,zIndex:9998,fontWeight:600,fontSize:12,pointerEvents:"none"}}>+{rp.n} pts {rp.r}</div>}

      {showM&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          {[...Array(8)].map((_,i)=><div key={i} style={{position:"absolute",width:10,height:10,borderRadius:"50%",background:[T.coral,T.gold,T.sage,T.lilac][i%4],top:`${18+i*9}%`,left:`${8+i*11}%`,animation:`confetti ${0.7+i*0.1}s ease forwards`,animationDelay:`${i*0.05}s`}}/>)}
          <div className="pop" style={{background:"white",borderRadius:14,padding:"32px 28px",textAlign:"center",width:"100%",maxWidth:340,border:`1px solid ${T.line}`,boxShadow:"0 8px 40px rgba(0,0,0,0.12)"}}>
            <div style={{fontSize:13,fontWeight:600,color:T.coral,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:6}}>✨ Nouveau match</div>
            <div style={{margin:"6px 0 10px",display:"flex",justifyContent:"center",alignItems:"center",gap:12}}><PetPhoto pet={myPet.species?{sp:myPet.species,c:T.coral,ph:myPet.ph}:showM} size={72}/><div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#E8556E,#F0808F)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(232,85,110,0.35)"}}><Ic d={ICON.heart} s={17} fill="white" c="white"/></div><PetPhoto pet={showM} size={72}/></div>
            <p style={{color:T.g3,fontSize:15,marginBottom:10}}><strong style={{color:T.navy}}>{showM.name}</strong> 💕 <strong style={{color:T.navy}}>{myPet.name||"votre animal"}</strong></p>
            <div style={{background:T.warm,borderRadius:10,padding:"12px 16px",marginBottom:22}}>
              <div style={{fontSize:10,fontWeight:600,color:T.g3,marginBottom:5,letterSpacing:"0.08em"}}>COMPATIBILITÉ IA</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,background:T.g1,borderRadius:4,height:8}}><div style={{width:`${showM.co}%`,background:T.coral,height:"100%",borderRadius:4}}/></div>
                <span style={{fontWeight:600,color:T.coral,fontSize:17}}>{showM.co}%</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setShowM(null);setChatP(showM);setTab("matchs");}} style={{...btn(T.coral),flex:1,padding:"13px"}}>Écrire</button>
              <button onClick={()=>setShowM(null)} style={{...gh(T.coral),flex:1,padding:"13px"}}>Plus tard</button>
            </div>
          </div>
        </div>
      )}

      {premM&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:"16px 16px 0 0",padding:26,width:"100%",maxWidth:430,maxHeight:"88vh",overflowY:"auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:24,fontWeight:600,color:T.navy}}>Furrix <span style={{color:T.coral}}>Premium</span></div>
              <button onClick={()=>setPremM(false)} aria-label="Fermer" style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:T.g3}}><Ic d={ICON.close} s={18}/></button>
            </div>
            <div style={{background:T.goldBg,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
              
              <span style={{fontSize:12,fontWeight:600,color:T.gold}}>3 profils ont liké {myPet.name||"votre animal"} — expirent dans 23h</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
              {PF.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 13px",background:T.warm,borderRadius:8}}>
                  <span style={{flexShrink:0,color:T.coral,display:"flex"}}><Ic d={ICON[f.ic]||ICON.star} s={18}/></span>
                  <div><div style={{fontWeight:600,fontSize:13,color:T.navy}}>{f.t}</div><div style={{fontSize:11,color:T.g3,marginTop:1}}>{f.d}</div></div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[{p:"7,99€",per:"/mois",sub:"Sans engagement",best:false},{p:"59,99€",per:"/an",sub:"soit 4,92€/mois · -37%",best:true,lb:"LE PLUS CHOISI"}].map((o,i)=>(
                <div key={i} onClick={()=>{setPrem(true);setPremM(false);sT("Premium activé ! ");aP(100,"Bienvenue Premium");}} style={{border:`2px solid ${o.best?T.coral:T.g2}`,borderRadius:12,padding:o.best?"20px 12px 16px":"16px 12px",textAlign:"center",cursor:"pointer",background:o.best?"linear-gradient(160deg,#E8F3EE,#F6FBF8)":"white",position:"relative",boxShadow:o.best?"0 4px 16px rgba(31,122,92,0.15)":"none",transform:o.best?"scale(1.03)":"none"}}>
                  {o.lb&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#1F7A5C,#2E9E72)",color:"white",fontSize:9,fontWeight:700,padding:"4px 12px",borderRadius:10,letterSpacing:"0.05em",whiteSpace:"nowrap",boxShadow:"0 2px 6px rgba(31,122,92,0.3)"}}>{o.lb}</div>}
                  <div style={{fontWeight:700,fontSize:23,color:o.best?T.coral:T.navy,letterSpacing:"-0.02em"}}>{o.p}</div>
                  <div style={{fontSize:12,color:T.g3,marginTop:2}}>{o.per}</div>
                  <div style={{fontSize:10.5,color:o.best?T.coral:T.g3,fontWeight:o.best?600:400,marginTop:5}}>{o.sub}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>{setPrem(true);setPremM(false);sT("Essai gratuit activé ! ");aP(50,"Premium");}} style={{...btn(T.coral,true),padding:"14px",fontSize:15,boxShadow:"0 4px 16px rgba(31,122,92,0.35)"}}>Commencer mes 7 jours gratuits</button>
            <p style={{textAlign:"center",fontSize:11,color:T.g3,marginTop:10}}>Sans carte bancaire · Résiliable en 2 clics · Aucun engagement</p>
          </div>
        </div>
      )}

      {profM&&(()=>{const bars=[{l:"Énergie ⚡",v:profM.energy},{l:"Sociabilité 🐾",v:profM.social},{l:"Propreté ✨",v:profM.clean}];return(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:480,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setProfM(null)}>
          <div className="pop" style={{background:"white",borderRadius:"16px 16px 0 0",width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{height:220,background:`linear-gradient(155deg,${profM.c}22,${profM.c}44)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",borderRadius:"16px 16px 0 0",overflow:"hidden"}}>
              {profM.ph
                ? <img src={profM.ph} alt={`Photo de ${profM.name}`} className="imgFade" onLoad={e=>e.target.classList.add("loaded")} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                : null}
              <div style={{position:"absolute",inset:0,display:profM.ph?"none":"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="120" height="120" viewBox="8 8 44 40" style={{color:profM.c,filter:"drop-shadow(0 6px 12px rgba(0,0,0,0.12))"}}>{PAWS[profM.sp]||PAWS.chien}</svg>
              </div>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(0,0,0,0.1), transparent 40%, rgba(0,0,0,0.25))",pointerEvents:"none"}}/>
              <button onClick={()=>setProfM(null)} style={{position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.g4}}><Ic d={ICON.close} s={18}/></button>
              <div style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.92)",borderRadius:6,padding:"4px 10px",fontSize:12,fontWeight:600,color:profM.c}}>{profM.co}% compatible 💞</div>
            </div>
            <div style={{padding:"18px 20px 28px"}}>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:2}}>
                <span style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",color:T.navy}}>{profM.name}</span>
                <span style={{fontSize:15,color:T.g3}}>{profM.gn}</span>
                <span style={{fontSize:13,color:T.g3}}>· {profM.ag}</span>
              </div>
              <div style={{color:T.g3,fontSize:13,fontWeight:500,marginBottom:8}}>{profM.br} · 📍 {profM.ct} ({profM.dt})</div>
              <p style={{color:T.g4,fontSize:14,lineHeight:1.6,marginBottom:16}}>{profM.bi}</p>

              {/* Caractère */}
              <div style={{...cd(14)}}>
                <div style={{fontWeight:600,fontSize:13,color:T.navy,marginBottom:12}}>Caractère</div>
                {bars.map((b,i)=>(
                  <div key={i} style={{marginBottom:i<2?12:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:T.g4}}>{b.l}</span><span style={{fontSize:11,color:T.g3}}>{b.v}/5</span></div>
                    <div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(n=><div key={n} style={{flex:1,height:6,borderRadius:3,background:n<=b.v?profM.c:T.g2}}/>)}</div>
                  </div>
                ))}
              </div>

              {/* Santé */}
              <div style={{...cd(14)}}>
                <div style={{fontWeight:600,fontSize:13,color:T.navy,marginBottom:12}}>Santé 🩺</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[{l:"Vacciné",v:profM.vc},{l:"Stérilisé",v:profM.ster},{l:"Pucé",v:profM.chip},{l:"Vérifié",v:profM.v}].map((h,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:T.warm,borderRadius:8,padding:"9px 11px"}}>
                      <span style={{color:h.v?T.sage:T.g3,display:"flex"}}><Ic d={h.v?ICON.check:ICON.close} s={15}/></span>
                      <span style={{fontSize:12,color:T.g4,fontWeight:500}}>{h.l}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:10,display:"flex",justifyContent:"space-between",padding:"9px 11px",background:T.warm,borderRadius:8}}>
                  <span style={{fontSize:12,color:T.g3}}>Allergies</span><span style={{fontSize:12,color:T.g4,fontWeight:600}}>{profM.allerg}</span>
                </div>
                <div style={{marginTop:8,display:"flex",justifyContent:"space-between",padding:"9px 11px",background:T.warm,borderRadius:8}}>
                  <span style={{fontSize:12,color:T.g3}}>Poids</span><span style={{fontSize:12,color:T.g4,fontWeight:600}}>{profM.weight}</span>
                </div>
              </div>

              {/* Habitudes */}
              <div style={{...cd(16)}}>
                <div style={{fontWeight:600,fontSize:13,color:T.navy,marginBottom:12}}>Habitudes 🦴</div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"9px 11px",background:T.warm,borderRadius:8,marginBottom:8}}>
                  <span style={{fontSize:12,color:T.g3}}>Alimentation</span><span style={{fontSize:12,color:T.g4,fontWeight:600}}>{profM.food}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"9px 11px",background:T.warm,borderRadius:8}}>
                  <span style={{fontSize:12,color:T.g3}}>Jouet préféré</span><span style={{fontSize:12,color:T.g4,fontWeight:600}}>{profM.toy}</span>
                </div>
              </div>

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setProfM(null);if(canSwipe)flyOut("left");}} style={{...gh(T.g4),flex:1,padding:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ic d={ICON.close} s={16}/>Passer</button>
                <button onClick={()=>{setProfM(null);if(canSwipe)flyOut("right");else setPremM(true);}} style={{...btn(T.coral),flex:1,padding:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ic d={ICON.heart} s={16} fill="white" c="white"/>J'adore</button>
              </div>
            </div>
          </div>
        </div>
      );})()}

      {lostM&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div className="pop" style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430}}>
            <div style={{width:36,height:4,background:T.g2,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",gap:14,marginBottom:14}}>
              <div style={{fontSize:52}}>{lostM.e}</div>
              <div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",marginBottom:3}}>
                  <span style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:22,color:T.navy}}>{lostM.name}</span>
                  {lostM.ug&&<span style={{background:T.coralBg,color:T.rose,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>URGENT</span>}
                  {lostM.rw&&<span style={{background:T.goldBg,color:T.gold,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>{lostM.rw}</span>}
                </div>
                <div style={{color:T.sky,fontSize:13,fontWeight:600}}>{lostM.br} · {lostM.ct}</div>
                <div style={{color:T.g3,fontSize:12,marginTop:2}}>Perdu il y a {lostM.ti}</div>
              </div>
            </div>
            <p style={{color:T.g4,fontSize:13,lineHeight:1.7,marginBottom:16}}>{lostM.ds}</p>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <button onClick={()=>{setLostM(null);sT("Propriétaire contacté !");aP(30,"Aide ");}} style={{...btn(T.coral),flex:1,padding:"12px"}}>Appeler</button>
              <button onClick={()=>{setLostM(null);sT("Alerte partagée ! +30 pts");aP(30,"Partage");}} style={{...gh(T.coral),flex:1,padding:"12px"}}>↗ Partager</button>
            </div>
            <button onClick={()=>setLostM(null)} style={{width:"100%",background:"none",border:"none",color:T.g3,fontWeight:600,cursor:"pointer",fontSize:14,padding:"6px",fontFamily:"'Inter',sans-serif"}}>Fermer</button>
          </div>
        </div>
      )}

      {vetM&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div className="pop" style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430}}>
            <div style={{width:36,height:4,background:T.g2,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",gap:14,marginBottom:16}}>
              <div style={{width:58,height:58,background:T.coralBg,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}><Ic d={ICON.stethoscope} s={20}/></div>
              <div>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:20,color:T.navy}}>{vetM.name}</div>
                <div style={{color:T.sky,fontSize:13,fontWeight:600}}>{vetM.spec}</div>
                <div style={{fontSize:12,color:T.g3,marginTop:2}}>{vetM.ct} · {vetM.dt} · {vetM.p}</div>
                <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                  {vetM.tc&&<span style={{background:T.sageBg,color:T.sage,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>Téléconsult.</span>}
                  {vetM.pt&&<span style={{background:T.coralBg,color:T.coral,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>Partenaire</span>}
                </div>
              </div>
            </div>
            {vetM.ok&&vetM.sl.length>0?(
              <>
                <div style={{fontSize:11,color:T.rose,fontWeight:600,marginBottom:8}}>Plus que {vetM.sl.length} créneau{vetM.sl.length>1?"x":""} disponible{vetM.sl.length>1?"s":""}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
                  {vetM.sl.map(s=><button key={s} onClick={()=>setSlSel(s)} style={{background:slSel===s?T.coral:T.coralBg,color:slSel===s?"white":T.coral,border:"none",borderRadius:50,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>{s}</button>)}
                </div>
                <button onClick={()=>{setVetM(null);sT(`RDV confirmé avec ${vetM.name}`);aP(15,"RDV vétérinaire");}} style={btn(T.coral,true)}>Confirmer le RDV</button>
              </>
            ):(
              <button onClick={()=>sT("Alerte activée !")} style={btn(T.g3,true)}>M'alerter dès qu'un créneau se libère</button>
            )}
            {vetM.tc&&<button onClick={()=>{setVetM(null);setTcO(true);}} style={{...gh(T.sage),width:"100%",padding:"12px",marginTop:10}}>Consulter en vidéo maintenant</button>}
            <button onClick={()=>setVetM(null)} style={{width:"100%",background:"none",border:"none",color:T.g3,fontWeight:600,cursor:"pointer",fontSize:13,padding:"8px",marginTop:8,fontFamily:"'Inter',sans-serif"}}>Fermer</button>
          </div>
        </div>
      )}

      {assoM&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div className="pop" style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430,maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{width:36,height:4,background:T.g2,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",gap:12,marginBottom:14}}>
              <div style={{fontSize:46}}><Ic d={ICON.shield} s={26} c={T.lilac}/></div>
              <div>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:20,color:T.navy,display:"flex",gap:7,alignItems:"center"}}>{assoM.name}{assoM.vf&&<span style={{background:T.coralBg,color:T.sky,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:6,display:"inline-flex",alignItems:"center",gap:3}}><Ic d={ICON.check} s={11}/>Vérifié</span>}</div>
                <div style={{color:T.lilac,fontSize:12,fontWeight:600,marginTop:2,textTransform:"capitalize"}}>{assoM.type} · {assoM.rg}</div>
              </div>
            </div>
            <p style={{color:T.g4,fontSize:13,lineHeight:1.7,marginBottom:14}}>{assoM.ds}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:T.lilacBg,borderRadius:8,padding:"12px",textAlign:"center"}}><div style={{fontWeight:600,fontSize:22,color:T.lilac}}>{assoM.an}</div><div style={{fontSize:11,color:T.g3}}>À adopter</div></div>
              <div style={{background:T.coralBg,borderRadius:8,padding:"12px",textAlign:"center"}}><div style={{fontWeight:600,fontSize:22,color:T.rose}}>{assoM.ug}</div><div style={{fontSize:11,color:T.g3}}>Urgents</div></div>
            </div>
            <div style={{display:"flex",gap:9,marginBottom:10}}>
              <button onClick={()=>{setAssoM(null);sT("Contact envoyé");}} style={{...btn(T.coral),flex:1,padding:"12px"}}>Contacter</button>
              <button onClick={()=>{setAssoM(null);aP(50,"Don ");sT("Merci ! +50 pts");}} style={{...btn(T.lilac),flex:1,padding:"12px"}}> Faire un don</button>
            </div>
            <button onClick={()=>setAssoM(null)} style={{width:"100%",background:"none",border:"none",color:T.g3,fontWeight:600,cursor:"pointer",fontSize:13,padding:"6px",fontFamily:"'Inter',sans-serif"}}>Fermer</button>
          </div>
        </div>
      )}

      {postM&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div className="pop" style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430,maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{width:36,height:4,background:T.g2,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
              <PetAvatar sp={postM.sp} size={40} color={T.g4} bg={T.warm}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{postM.au}</div><div style={{fontSize:11,color:T.g3}}>{postM.rg} · {postM.ti}</div></div>
              <span style={{background:T.coralBg,color:T.coral,fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:10}}>{postM.tg}</span>
            </div>
            {postM.vr&&<div style={{background:T.sageBg,borderRadius:12,padding:"9px 13px",marginBottom:12,fontSize:12,color:T.sage,fontWeight:600}}>Réponse vétérinaire disponible</div>}
            {postM.ug&&<div style={{background:T.coralBg,borderRadius:12,padding:"9px 13px",marginBottom:12,fontSize:12,color:T.rose,fontWeight:600}}>Situation urgente</div>}
            <div style={{fontWeight:600,fontSize:16,color:T.navy,marginBottom:8}}>{postM.ti2}</div>
            <p style={{color:T.g4,fontSize:13,lineHeight:1.7,marginBottom:16}}>{postM.bo}</p>
            <div style={{display:"flex",gap:14,marginBottom:16}}><span style={{fontSize:13,color:T.g3}}> {postM.li}</span><span style={{fontSize:13,color:T.g3}}>{postM.rp} réponses</span></div>
            <div style={{background:T.warm,borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontWeight:600,fontSize:13,color:T.navy,marginBottom:8}}>Votre réponse</div>
              <textarea rows={3} placeholder="Partagez votre expérience..." style={{width:"100%",border:`2px solid ${T.g2}`,borderRadius:12,padding:"10px",fontSize:13,resize:"none",background:"white",color:T.navy,fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor=T.g2}/>
              <button onClick={()=>{setPostM(null);sT("Réponse publiée ! +5 pts");aP(5,"Réponse");}} style={{...btn(T.coral,true),marginTop:10,padding:"11px"}}>Publier</button>
            </div>
            <button onClick={()=>setPostM(null)} style={{width:"100%",background:"none",border:"none",color:T.g3,fontWeight:600,cursor:"pointer",fontSize:13,padding:"6px",fontFamily:"'Inter',sans-serif"}}>Fermer</button>
          </div>
        </div>
      )}

      {tcOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div className="pop" style={{background:"white",borderRadius:8,padding:28,width:"100%",maxWidth:360,textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:12}}><Ic d={ICON.video} s={20}/></div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:22,fontWeight:600,color:T.navy,marginBottom:8}}>Téléconsultation</div>
            <p style={{color:T.g3,fontSize:13,lineHeight:1.6,marginBottom:20}}>Vétérinaire en vidéo · 7j/7 · 8h–22h</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[{ic:"alert",t:"Urgence",p:"15€/10min"},{ic:"messages",t:"Conseil",p:"10€/15min"},{ic:"check",t:"Suivi",p:"8€/10min"},{ic:"syringe",t:"Ordonnance",p:"12€"}].map((o,i)=>(
                <div key={i} onClick={()=>{if(!prem){setPremM(true);setTcO(false);}else sT(`${o.t} — Connexion...`);}} style={{background:T.warm,borderRadius:10,padding:"14px 10px",cursor:"pointer",border:`1.5px solid ${T.g2}`}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:8,color:T.coral}}><Ic d={ICON[o.ic]||ICON.video} s={22}/></div>
                  <div style={{fontWeight:600,fontSize:13,color:T.navy}}>{o.t}</div>
                  <div style={{fontSize:11,color:T.g3,marginTop:3}}>{o.p}</div>
                  {!prem&&<div style={{fontSize:10,color:T.coral,fontWeight:600,marginTop:5}}>Premium</div>}
                </div>
              ))}
            </div>
            <button onClick={()=>setTcO(false)} style={{...gh(T.coral),width:"100%",padding:"12px"}}>Fermer</button>
          </div>
        </div>
      )}

      {npOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430,animation:"slideUp 0.3s ease"}}>
            <div style={{fontWeight:600,fontSize:17,color:T.navy,marginBottom:16}}>Nouvelle question</div>
            <input value={npost.title} onChange={e=>setNpost({...npost,title:e.target.value})} placeholder="Titre de votre question..." style={{width:"100%",border:`2px solid ${T.g2}`,borderRadius:8,padding:"12px 15px",fontSize:14,fontWeight:600,color:T.navy,marginBottom:10,fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor=T.g2}/>
            <textarea value={npost.body} onChange={e=>setNpost({...npost,body:e.target.value})} placeholder="Décrivez votre situation..." rows={4} style={{width:"100%",border:`2px solid ${T.g2}`,borderRadius:8,padding:"12px 15px",fontSize:13,resize:"none",color:T.navy,marginBottom:10,fontFamily:"'Inter',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.coral} onBlur={e=>e.target.style.borderColor=T.g2}/>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
              {["Conseil","Santé","Comportement","Nutrition","Reproduction","Urgence"].map(t=>(
                <button key={t} onClick={()=>setNpost({...npost,tag:t})} style={{background:npost.tag===t?T.coral:T.g1,color:npost.tag===t?"white":T.g4,border:"none",borderRadius:50,padding:"6px 14px",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}>{t}</button>
              ))}
            </div>
            <button onClick={()=>{setNpO(false);sT("Question publiée ! +10 pts");aP(10,"Post");}} style={btn(T.coral,true)}>Publier</button>
            <button onClick={()=>setNpO(false)} style={{...gh(T.coral),width:"100%",padding:"11px",marginTop:10}}>Annuler</button>
          </div>
        </div>
      )}

      {fOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:400,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430,animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <div style={{fontWeight:600,fontSize:18,color:T.navy}}>Filtres</div>
              <button onClick={()=>setFilt({purpose:"all",verified:false,pedigree:false})} style={{color:T.coral,fontWeight:600,fontSize:13,background:"none",border:"none",cursor:"pointer"}}>Réinitialiser</button>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.g3,marginBottom:8,letterSpacing:"0.09em"}}>RÉGION</div>
              <select value={rgF} onChange={e=>setRgF(e.target.value)} style={{width:"100%",padding:"12px 16px",border:`2px solid ${T.g2}`,borderRadius:8,fontSize:14,color:T.navy,background:"white",fontFamily:"'Inter',sans-serif",fontWeight:600}}>
                {RG.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.g3,marginBottom:8,letterSpacing:"0.09em"}}>OBJECTIF</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[{v:"all",l:"Tous"},{v:"reproduction",l:"Repro"},{v:"balade",l:"Balade"},{v:"social",l:"Social"}].map(o=>(
                  <button key={o.v} onClick={()=>setFilt({...filt,purpose:o.v})} style={{background:filt.purpose===o.v?T.coral:T.g1,color:filt.purpose===o.v?"white":T.g4,border:"none",borderRadius:50,padding:"8px 16px",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}>{o.l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:16,marginBottom:22}}>
              {[{k:"verified",l:"Vérifié"},{k:"pedigree",l:"Pedigree"}].map(t=>(
                <label key={t.k} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontWeight:600,fontSize:13,color:T.g4}}>
                  <input type="checkbox" checked={filt[t.k]} onChange={e=>setFilt({...filt,[t.k]:e.target.checked})} style={{width:18,height:18,accentColor:T.coral}}/>
                  {t.l}
                </label>
              ))}
            </div>
            <button style={btn(T.coral,true)} onClick={()=>{setFO(false);setCi(0);sT(`${pool.length} profils trouvés`);}}>Appliquer</button>
          </div>
        </div>
      )}

      {shRw&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:450,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430,maxHeight:"88vh",overflowY:"auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:22,color:T.navy}}>PawPoints & Récompenses</div>
              <button onClick={()=>setShRw(false)} aria-label="Fermer" style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.g3}}><Ic d={ICON.close} s={18}/></button>
            </div>
            <div style={{background:"linear-gradient(135deg,#1F7A5C,#2E9E72)",borderRadius:12,padding:"18px 20px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 4px 14px rgba(31,122,90,0.25)"}}>
              <div><div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Ton solde PawPoints</div><div style={{fontWeight:700,fontSize:32,color:"white"}}>{paws}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Niveau</div><div style={{fontWeight:600,fontSize:18,color:"white"}}>{LV[level-1]}</div></div>
            </div>
            <p style={{fontSize:12,color:T.g3,marginBottom:18,lineHeight:1.5}}>Gagne des points en étant actif, échange-les contre des avantages chez nos partenaires. </p>

            {/* Comment gagner */}
            <div style={{fontWeight:600,fontSize:13,color:T.navy,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.04em"}}>Comment gagner des points</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:22}}>
              {EARN.map((e,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:9,background:T.warm,borderRadius:8,padding:"9px 11px"}}>
                  <span style={{color:T.coral,display:"flex",flexShrink:0}}><Ic d={ICON[e.ic]} s={15}/></span>
                  <div style={{minWidth:0}}><div style={{fontSize:11.5,fontWeight:600,color:T.navy,lineHeight:1.2}}>{e.n}</div><div style={{fontSize:10.5,color:T.coral,fontWeight:600,marginTop:1}}>{e.pts}</div></div>
                </div>
              ))}
            </div>

            {/* Récompenses partenaires */}
            <div style={{fontWeight:600,fontSize:13,color:T.navy,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.04em"}}>Avantages partenaires</div>
            {RW.filter(r=>r.cat==="partenaire").map((r,i)=>(
              <div key={i} style={{...cd(10),display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,background:"linear-gradient(135deg,#EAF3EF,#D6EAE0)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.coral}}><Ic d={ICON[r.ic]||ICON.gift} s={18}/></div>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{r.n}</div><div style={{fontSize:12,color:T.g3,marginTop:2}}>{r.p}</div></div>
                <button onClick={()=>{if(paws>=r.c){setPaws(p=>p-r.c);sT(`${r.n} débloqué ! `);}else sT(`Il manque ${r.c-paws} points`,"warn");}} style={{...btn(paws>=r.c?T.coral:T.g3,false,true),padding:"8px 13px",display:"flex",alignItems:"center",gap:4}}><Ic d={ICON.zap} s={11} c="white"/>{r.c}</button>
              </div>
            ))}

            {/* Boost & événements */}
            <div style={{fontWeight:600,fontSize:13,color:T.navy,margin:"18px 0 10px",textTransform:"uppercase",letterSpacing:"0.04em"}}>Boost & événements</div>
            {RW.filter(r=>r.cat==="boost").map((r,i)=>(
              <div key={i} style={{...cd(10),display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,background:"linear-gradient(135deg,#FBF3E4,#F5E6C8)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.gold}}><Ic d={ICON[r.ic]||ICON.zap} s={18}/></div>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{r.n}</div><div style={{fontSize:12,color:T.g3,marginTop:2}}>{r.p}</div></div>
                <button onClick={()=>{if(paws>=r.c){setPaws(p=>p-r.c);sT(`${r.n} activé ! `);}else sT(`Il manque ${r.c-paws} points`,"warn");}} style={{...btn(paws>=r.c?T.gold:T.g3,false,true),padding:"8px 13px",display:"flex",alignItems:"center",gap:4}}><Ic d={ICON.zap} s={11} c="white"/>{r.c}</button>
              </div>
            ))}

            {/* Badges */}
            <div style={{fontWeight:600,fontSize:13,color:T.navy,margin:"18px 0 10px",textTransform:"uppercase",letterSpacing:"0.04em"}}>Badges & statut</div>
            {RW.filter(r=>r.cat==="badge").map((r,i)=>(
              <div key={i} style={{...cd(10),display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,background:"linear-gradient(135deg,#F0EDF6,#E2DCF0)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.lilac}}><Ic d={ICON[r.ic]||ICON.trophy} s={18}/></div>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{r.n}</div><div style={{fontSize:12,color:T.g3,marginTop:2}}>{r.p}</div></div>
                <button onClick={()=>{if(paws>=r.c){setPaws(p=>p-r.c);sT(`${r.n} obtenu ! `);}else sT(`Il manque ${r.c-paws} points`,"warn");}} style={{...btn(paws>=r.c?T.lilac:T.g3,false,true),padding:"8px 13px",display:"flex",alignItems:"center",gap:4}}><Ic d={ICON.zap} s={11} c="white"/>{r.c}</button>
              </div>
            ))}

            {/* Premium teaser — points font goûter, Premium donne l'illimité */}
            <div style={{marginTop:20,background:T.navy,borderRadius:12,padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:38,height:38,borderRadius:9,background:"linear-gradient(135deg,#E8A33D,#C08A3E)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic d={ICON.star} s={19} fill="white" c="white"/></div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:"white"}}>Tu veux tout en illimité ?</div><div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:2}}>Le Premium débloque swipes, boosts et likes sans compter.</div></div>
              <button onClick={()=>{setShRw(false);setPremM(true);}} style={{...btn(T.coral,false,true),padding:"8px 14px",flexShrink:0}}>Voir</button>
            </div>
          </div>
        </div>
      )}

      {shSh&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:450,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:"16px 16px 0 0",padding:24,width:"100%",maxWidth:430,maxHeight:"84vh",overflowY:"auto",animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:22,color:T.navy}}>Marketplace</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                {cartN>0&&<div style={{background:T.coral,color:"white",borderRadius:50,padding:"4px 12px",fontSize:12,fontWeight:600}}>{cartN} articles</div>}
                <button onClick={()=>setShSh(false)} aria-label="Fermer" style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.g3}}><Ic d={ICON.close} s={18}/></button>
              </div>
            </div>
            <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14}}>
              {["Tous","Chiens","Chats","Reptiles","Lapins","Sécurité","Nutrition"].map(c=>(
                <button key={c} onClick={()=>setMcat(c)} style={{background:mcat===c?T.coral:"white",color:mcat===c?"white":T.g3,border:`1.5px solid ${mcat===c?T.coral:T.g2}`,borderRadius:50,padding:"6px 14px",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}>{c}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
              {fprod.map(p=>(
                <div key={p.id} className="hov" style={{background:"white",borderRadius:10,padding:14,boxShadow:"0 1px 2px rgba(0,0,0,0.04)",cursor:"pointer",border:`1px solid ${T.g1}`}}>
                  {p.pt&&<div style={{marginBottom:4}}><span style={{background:T.goldBg,color:T.gold,fontSize:9,fontWeight:600,padding:"2px 7px",borderRadius:10}}><Ic d={ICON.star} s={16}/></span></div>}
                  <div style={{height:64,background:T.warm,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,border:`1px solid ${T.line}`}}><span style={{fontSize:22,fontWeight:600,color:T.g3,letterSpacing:"-0.02em"}}>{p.brand?.[0]||p.name[0]}</span></div>
                  <div style={{fontWeight:600,fontSize:13,color:T.navy,lineHeight:1.3}}>{p.name}</div>
                  <div style={{color:T.g3,fontSize:11,marginTop:2}}>{p.brand}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <div><span style={{fontWeight:600,fontSize:15,color:T.coral}}>{p.price}</span>{p.old&&<span style={{textDecoration:"line-through",color:T.g3,fontSize:11,marginLeft:6}}>{p.old}</span>}</div>
                    <button onClick={()=>{setCartN(c=>c+1);sT(`${p.name} ajouté`);aP(2,"Achat");}} style={{background:T.coral,color:"white",border:"none",borderRadius:"50%",width:30,height:30,fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aiO&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,28,30,0.45)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:"16px 16px 0 0",width:"100%",maxWidth:430,maxHeight:"75vh",display:"flex",flexDirection:"column",animation:"slideUp 0.3s ease"}}>
            <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.g1}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:42,height:42,background:T.coral,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}><Ic d={ICON.bot} s={20}/></div>
                <div><div style={{fontWeight:600,fontSize:15,color:T.navy}}>PawAI</div><div style={{fontSize:11,color:T.sage,fontWeight:600}}>● Expert animalier</div></div>
              </div>
              <button onClick={()=>setAiO(false)} aria-label="Fermer" style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.g3}}><Ic d={ICON.close} s={18}/></button>
            </div>
            <div style={{flex:1,padding:14,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,background:T.cream}}>
              {aiH.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.f==="me"?"flex-end":"flex-start"}}>
                  <div style={{background:m.f==="me"?T.coral:"white",color:m.f==="me"?"white":T.navy,padding:"10px 14px",borderRadius:m.f==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",maxWidth:"78%",fontSize:13,boxShadow:"0 1px 2px rgba(0,0,0,0.04)",lineHeight:1.5}}>{m.t}</div>
                </div>
              ))}
            </div>
            <div style={{padding:"12px 14px 24px",background:"white",display:"flex",gap:9,borderTop:`1px solid ${T.g1}`}}>
              <input value={aiMsg} onChange={e=>setAiMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&aiMsg.trim()){const q=aiMsg;setAiH(h=>[...h,{f:"me",t:q}]);setAiMsg("");setTimeout(()=>setAiH(h=>[...h,{f:"ai",t:`Bonne question sur "${q}" ! Pour votre ${myPet.species||"animal"}, je recommande de surveiller 48h. Si les symptômes persistent, consultez un vétérinaire. `}]),1200);}}} placeholder="Posez votre question..." style={{flex:1,border:`2px solid ${T.g2}`,borderRadius:50,padding:"11px 17px",fontSize:13,color:T.navy,background:T.g1,fontFamily:"'Inter',sans-serif"}} onFocus={e=>{e.target.style.borderColor=T.coral;e.target.style.background="white"}} onBlur={e=>{e.target.style.borderColor=T.g2;e.target.style.background=T.g1}}/>
              <button onClick={()=>{if(aiMsg.trim()){const q=aiMsg;setAiH(h=>[...h,{f:"me",t:q}]);setAiMsg("");setTimeout(()=>setAiH(h=>[...h,{f:"ai",t:`Concernant "${q}" — consultez un vétérinaire partenaire Furrix si ça dure plus de 48h. `}]),1200);}}} style={{width:44,height:44,background:T.coral,border:"none",borderRadius:10,cursor:"pointer",color:"white",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={ICON.send} s={18} c="white"/></button>
            </div>
          </div>
        </div>
      )}

      {tab==="matchs"&&chatP&&(
        <div style={{position:"fixed",inset:0,background:"white",zIndex:200,display:"flex",flexDirection:"column",maxWidth:430,margin:"0 auto"}}>
          <div style={{padding:"14px 16px",background:"white",borderBottom:`1px solid ${T.g1}`,display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setChatP(null)} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:T.coral,fontWeight:600}}>←</button>
            <PetPhoto pet={chatP} size={44}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:16,color:T.navy}}>{chatP.name} <span style={{color:T.g3,fontWeight:400,fontSize:13}}>· {chatP.ow}</span></div>
              <div style={{fontSize:11,color:T.sage,fontWeight:600}}>● En ligne · {chatP.co}% compatible</div>
            </div>
            <button onClick={()=>{if(!prem)setPremM(true);else sT("Appel vidéo lancé");}} style={{...btn(T.coral,false,true)}}>{prem?"Appel":"Appel"}</button>
          </div>
          <div style={{flex:1,padding:14,overflowY:"auto",background:T.cream,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:"white",borderRadius:10,padding:"10px 14px",textAlign:"center",border:`1px dashed ${T.g2}`}}>
              <div style={{fontSize:11,color:T.g3,marginBottom:5}}>Suggestion</div>
              <button onClick={()=>setMIn(`Bonjour ! ${chatP.name} et ${myPet.name||"mon animal"} ont ${chatP.co}% de compatibilité Vous habitez ${chatP.ct} ?`)} style={{background:T.coralBg,color:T.coral,border:"none",borderRadius:50,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Utiliser cette accroche</button>
            </div>
            {[{fr:"them",tx:`Bonjour ! ${chatP.name} adore rencontrer de nouveaux amis `},...(msgs[chatP.id]||[])].map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.fr==="me"?"flex-end":"flex-start"}}>
                <div style={{background:m.fr==="me"?T.coral:"white",color:m.fr==="me"?"white":T.navy,padding:"10px 15px",borderRadius:m.fr==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",maxWidth:"72%",fontSize:13,boxShadow:"0 1px 2px rgba(0,0,0,0.04)",lineHeight:1.5}}>{m.tx}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 14px 24px",background:"white",display:"flex",gap:10,borderTop:`1px solid ${T.g1}`}}>
            <input value={mIn} onChange={e=>setMIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendM()} placeholder="Votre message..." style={{flex:1,border:`2px solid ${T.g2}`,borderRadius:50,padding:"12px 17px",fontSize:14,color:T.navy,background:T.g1,fontFamily:"'Inter',sans-serif"}} onFocus={e=>{e.target.style.borderColor=T.coral;e.target.style.background="white"}} onBlur={e=>{e.target.style.borderColor=T.g2;e.target.style.background=T.g1}}/>
            <button onClick={sendM} style={{width:44,height:44,background:T.coral,border:"none",borderRadius:10,cursor:"pointer",color:"white",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={ICON.send} s={18} c="white"/></button>
          </div>
        </div>
      )}

      <div style={{background:"white",padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 2px rgba(0,0,0,0.04)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#1F7A5C,#3DBB88)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(31,122,92,0.3)"}}>
            <svg width="20" height="20" viewBox="8 8 44 40" style={{color:"white"}}>{PAWS.chien}</svg>
          </div>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:20,letterSpacing:"-0.03em",color:T.navy}}>
            Furrix
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={()=>setAiO(true)} title="Assistant" aria-label="Assistant Furrix" style={{width:34,height:34,background:T.white,border:`1px solid ${T.line}`,borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.g4}}><Ic d={ICON.bot} s={17}/></button>
          <div style={{background:T.warm,borderRadius:8,padding:"6px 9px",display:"flex",alignItems:"center",gap:5}}>
            <span style={{color:T.gold,display:"flex",animation:streak>=7?"beat 1.6s ease-in-out infinite":"none"}}><Ic d={ICON.flame} s={14}/></span>
            <span style={{fontSize:12,fontWeight:600,color:T.g4}}>{streak}</span>
          </div>
          <div onClick={()=>setShRw(true)} style={{background:T.coralBg,borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
            <span style={{fontSize:11,fontWeight:600,color:T.coral,letterSpacing:"0.02em"}}>{paws} pts</span>
          </div>
          <button onClick={()=>setNotif(0)} title="Notifications" aria-label="Notifications" style={{width:34,height:34,background:T.white,border:`1px solid ${T.line}`,borderRadius:8,cursor:"pointer",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",color:T.g4}}>
            <Ic d={ICON.bell} s={17}/>{notif>0&&<div style={{position:"absolute",top:-3,right:-3,minWidth:15,height:15,padding:"0 3px",background:T.coral,borderRadius:8,fontSize:9,fontWeight:600,color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>{notif}</div>}
          </button>
          {!prem&&<button onClick={()=>setPremM(true)} style={{...btn(T.coral,false,true),padding:"7px 12px",display:"flex",alignItems:"center",gap:5}}><Ic d={ICON.star} s={13} fill="white" c="white"/>Premium</button>}
        </div>
      </div>

      <div style={{background:"white",borderBottom:`1px solid ${T.line}`,padding:"10px 14px",display:"flex",gap:6,overflowX:"auto"}}>
        {SP.map(s=>(
          <button key={s.id} onClick={()=>{setSpF(s.id);setCi(0);}} style={{background:spF===s.id?"linear-gradient(135deg,#1F7A5C,#2E9E72)":T.white,color:spF===s.id?"white":T.g4,border:`1px solid ${spF===s.id?"transparent":T.line}`,borderRadius:8,padding:"6px 13px",fontWeight:500,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.15s",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:5}}>
            <span style={{fontSize:14}}>{s.e}</span>{s.l}
          </button>
        ))}
      </div>

      <div style={{padding:"0 14px 110px",overflowY:"auto"}}>

        {tab==="discover"&&(
          <div className="fade">
            <div style={{display:"flex",gap:0,margin:"12px 0 14px",background:T.warm,borderRadius:8,padding:3,border:`1px solid ${T.line}`}}>
              {[{id:"swipe",l:"Swipe"},{id:"map",l:"Carte"},{id:"lost",l:"Perdus"}].map(s=>(
                <button key={s.id} onClick={()=>setDS(s.id)} style={{flex:1,padding:"9px",background:dSub===s.id?"linear-gradient(135deg,#1F7A5C,#2E9E72)":"transparent",color:dSub===s.id?"white":T.g3,border:"none",borderRadius:6,fontWeight:dSub===s.id?600:500,fontSize:13,cursor:"pointer",transition:"all 0.15s",boxShadow:dSub===s.id?"0 2px 6px rgba(31,122,90,0.25)":"none",fontFamily:"'Inter',sans-serif"}}>{s.l}</button>
              ))}
            </div>

            {dSub==="swipe"&&(
              <>
                <div style={{background:T.navy,borderRadius:10,padding:"12px 16px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
                  
                  <div style={{flex:1}}>
                    <div style={{color:"white",fontWeight:600,fontSize:12}}>3 profils ont liké {myPet.name||"votre animal"} — expirent dans 23h</div>
                    <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,marginTop:1}}>142 propriétaires actifs en ce moment</div>
                  </div>
                  <button onClick={()=>setPremM(true)} style={{background:T.coral,color:"white",border:"none",borderRadius:10,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>Voir</button>
                </div>
                <div style={{...cd(10),display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:40,height:40,background:daily?T.sageBg:T.coralBg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{daily?"":""}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:daily?T.sage:T.navy}}>{daily?"Défi accompli ! +20 pts":"Défi du jour — Likez 3 profils"}</div>
                    <div style={{fontSize:11,color:T.g3,marginTop:1}}>{daily?"Revenez demain pour continuer":"Gagnez +20 PawPoints"}</div>
                  </div>
                  <div style={{fontSize:14,fontWeight:600,color:T.coral}}>{streak}j</div>
                </div>

                {!prem&&(
                  <div style={{...cd(10),background:canSwipe?T.warm:T.coralBg,border:`1.5px solid ${canSwipe?"transparent":"#E8C5C0"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontWeight:600,fontSize:13,color:canSwipe?T.navy:T.rose}}>{canSwipe?(swipesLeft===1?"Dernier swipe du jour !":`${swipesLeft} swipes restants aujourd'hui`):"Reviens demain — ou passe en illimité"}</span>
                      <button onClick={()=>setPremM(true)} style={{background:T.coral,color:"white",border:"none",borderRadius:10,padding:"4px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Illimité</button>
                    </div>
                    <div style={{background:canSwipe?T.g2:"#E8C5C0",borderRadius:4,height:5}}><div style={{width:`${Math.min((store.swipesToday/5)*100,100)}%`,background:canSwipe?"linear-gradient(90deg,#1F7A5C,#2E9E72)":T.rose,transition:"width 0.4s ease",height:"100%",borderRadius:4,transition:"width 0.4s"}}/></div>
                  </div>
                )}

                {streakAtRisk&&(
                  <div className="pop" style={{...cd(10),background:T.goldBg,border:"1.5px solid #FCD34D",display:"flex",gap:10,alignItems:"center"}}>
                    
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,color:T.gold}}>Série de {streak} jours en danger !</div><div style={{fontSize:11,color:T.gold,marginTop:1}}>Swipez pour garder votre streak</div></div>
                    
                  </div>
                )}

                {almostMatch&&(
                  <div className="pop" style={{...cd(10),background:T.coralBg,border:`2px solid ${T.coral}`,display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:24}}>{almostMatch.e}</span>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,color:T.coral}}>Vous avez failli matcher à {almostMatch.score}% !</div><div style={{fontSize:11,color:T.g3,marginTop:1}}>Premium pour les voir en premier</div></div>
                    <button onClick={()=>{setAlmostMatch(null);setPremM(true);}} style={{background:T.coral,color:"white",border:"none",borderRadius:10,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Voir</button>
                  </div>
                )}
                {anim&&<div style={{...cd(10),display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}><Ic d={ICON.bot} s={16}/></span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:T.g3,marginBottom:4}}>Compatibilité IA avec {myPet.name||"votre animal"}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,background:T.g2,borderRadius:4,height:7}}><div style={{width:`${anim.co}%`,background:anim.co>=90?T.sage:anim.co>=75?T.gold:T.coral,height:"100%",borderRadius:4}}/></div>
                      <span style={{fontWeight:600,color:anim.co>=90?T.sage:anim.co>=75?T.gold:T.coral,fontSize:14}}>{anim.co}%</span>
                    </div>
                  </div>
                  <button onClick={()=>setFO(true)} style={{width:34,height:34,background:T.g1,border:"none",borderRadius:50,fontSize:14,cursor:"pointer"}}></button>
                </div>}

                {anim?(
                  <div style={{position:"relative",height:520,marginBottom:16}}>
                    <div style={{position:"absolute",inset:0,background:"white",borderRadius:12,transform:"scale(0.94) translateY(12px)",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}/>
                    <div style={{position:"absolute",inset:0,background:"white",borderRadius:12,transform:"scale(0.97) translateY(6px)",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}/>
                    <div key={cardKey} ref={cardRef} style={{position:"absolute",inset:0,background:"white",borderRadius:12,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",overflow:"hidden",userSelect:"none",cursor:"grab",willChange:"transform"}}>
                      <div data-ov="like" style={{position:"absolute",top:20,left:20,background:T.sage,color:"white",padding:"7px 14px",borderRadius:11,fontWeight:600,fontSize:16,transform:"rotate(-12deg)",opacity:0,zIndex:5,pointerEvents:"none"}}>LIKE</div>
                      <div data-ov="nope" style={{position:"absolute",top:20,right:20,background:T.rose,color:"white",padding:"7px 14px",borderRadius:11,fontWeight:600,fontSize:16,transform:"rotate(12deg)",opacity:0,zIndex:5,pointerEvents:"none"}}>NOPE</div>
                      <div className="skel" style={{height:300,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                        {anim.ph
                          ? <img src={anim.ph} alt={`Photo de ${anim.name}, ${anim.br}`} draggable={false} className="imgFade" onLoad={e=>e.target.classList.add("loaded")} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                          : null}
                        <div style={{position:"absolute",inset:0,display:anim.ph?"none":"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(155deg,${anim.c}22,${anim.c}44)`}}>
                          <svg width="150" height="150" viewBox="8 8 44 40" style={{color:anim.c,filter:"drop-shadow(0 8px 16px rgba(0,0,0,0.12))"}}>{PAWS[anim.sp]||PAWS.chien}</svg>
                        </div>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.35) 100%)",pointerEvents:"none"}}/>
                        <div style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:500,color:T.g4}}>{anim.ct} · {anim.dt}</div>
                        <div style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.92)",borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:600,color:T.g4,border:`1px solid ${T.line}`}}>{anim.pu==="reproduction"?"Repro":anim.pu==="balade"?"Balade":anim.pu==="show"?"Expo":"Social"}</div>
                        <div style={{position:"absolute",bottom:12,left:14,right:14,display:"flex",gap:5,flexWrap:"wrap"}}>
                          {anim.vc&&<span style={{background:"rgba(255,255,255,0.95)",color:T.sage,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:6,border:`1px solid ${T.line}`}}>Vacciné</span>}
                          {anim.pd&&<span style={{background:"rgba(255,255,255,0.95)",color:T.gold,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:6,border:`1px solid ${T.line}`}}>Pedigree</span>}
                          {anim.v&&<span style={{background:"rgba(255,255,255,0.95)",color:T.sky,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:6,border:`1px solid ${T.line}`}}>Vérifié</span>}
                        </div>
                      </div>
                      <div style={{padding:"16px 20px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                          <div>
                            <span style={{fontFamily:"'Inter',sans-serif",fontSize:24,fontWeight:600,letterSpacing:"-0.02em",color:T.navy}}>{anim.name}</span>
                            <span style={{fontSize:15,marginLeft:6,color:T.g3}}>{anim.gn}</span>
                            <span style={{fontSize:13,color:T.g3,marginLeft:6}}>{anim.ag}</span>
                          </div>
                        </div>
                        <div style={{color:T.g3,fontSize:13,fontWeight:500,marginBottom:10}}>{anim.br} · {anim.ow}</div>
                        <p style={{color:T.g4,fontSize:13,lineHeight:1.7,marginBottom:11}}>{anim.bi}</p>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                          {anim.tg.map(t=><span key={t} style={{background:T.warm,border:`1px solid ${T.line}`,color:T.g4,fontSize:12,fontWeight:500,padding:"4px 11px",borderRadius:6}}>{t}</span>)}
                        </div>
                        <button onClick={()=>setProfM(anim)} style={{marginTop:12,width:"100%",background:T.coralBg,color:T.coral,border:"none",borderRadius:8,padding:"9px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>Voir le profil complet <Ic d={ICON.arrow} s={14}/></button>
                      </div>
                    </div>
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"50px 20px",background:"white",borderRadius:12}}>
                    <div style={{fontSize:52,marginBottom:10}}><Ic d={ICON.discover} s={20}/></div>
                    <p style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:17,color:T.navy,marginBottom:8}}>Plus de profils disponibles</p>
                    <button style={btn(T.coral)} onClick={()=>{setCi(0);setSpF("all");setRgF("Toute la France");}}>Élargir</button>
                  </div>
                )}
                {anim&&(
                  <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:18,marginBottom:18}}>
                    <button onClick={()=>doSw("left")} title="Passer" aria-label="Passer ce profil" style={{width:54,height:54,borderRadius:"50%",background:"white",border:`1px solid ${T.line}`,cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",color:T.g4,transition:"border-color 0.15s"}}><Ic d={ICON.close} s={22}/></button>
                    <button onClick={()=>{if(!prem)setPremM(true);else{sT("Super Like envoyé");aP(5,"Super Like");}}} title="Super Like" style={{width:46,height:46,borderRadius:"50%",background:"white",border:`1px solid ${T.line}`,cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",color:T.gold}}><Ic d={ICON.star} s={19}/></button>
                    <button onClick={()=>doSw("right")} title="J'aime" aria-label="Aimer ce profil" style={{width:54,height:54,borderRadius:"50%",background:T.coral,border:"none",cursor:"pointer",boxShadow:"0 2px 8px rgba(21,113,90,0.3)",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={ICON.heart} s={22} fill="white" c="white"/></button>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:14}}>
                  {[{v:matches.length,l:"Matchs"},{v:pool.length,l:"Profils"},{v:`${streak}j`,l:"Série"}].map(s=>(
                    <div key={s.l} style={{background:"white",borderRadius:10,padding:"14px 10px",textAlign:"center",border:`1px solid ${T.line}`}}>
                      <div style={{fontWeight:600,fontSize:22,letterSpacing:"-0.02em",color:T.navy}}>{s.v}</div>
                      <div style={{fontSize:10,color:T.g3,fontWeight:600,marginTop:1}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {dSub==="map"&&(
              <>
                <div style={{display:"flex",gap:7,marginBottom:11,overflowX:"auto"}}>
                  {[{id:"lost",l:"Perdus",c:"#C77A52"},{id:"vets",l:"Vétérinaires",c:T.sage},{id:"assos",l:"Associations",c:T.lilac},{id:"animals",l:"Animaux",c:T.coral}].map(m=>(
                    <button key={m.id} onClick={()=>setMapM(m.id)} style={{background:mapM===m.id?m.c:"white",color:mapM===m.id?"white":T.g4,border:`1.5px solid ${mapM===m.id?m.c:T.g2}`,borderRadius:50,padding:"7px 14px",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}>{m.l}</button>
                  ))}
                </div>
                <div style={{background:"white",borderRadius:10,padding:14,boxShadow:"0 1px 2px rgba(0,0,0,0.04)",marginBottom:13}}>
                  <svg viewBox="60 25 460 440" style={{width:"100%",height:"auto",display:"block"}}>
                    <rect x="60" y="25" width="460" height="440" fill="#EFF6FF" rx="12"/>
                    <path d={FP} fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5"/>
                    <path d="M460,380 L470,375 L480,385 L485,400 L478,415 L465,420 L455,410 L452,395 Z" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1"/>
                    {[{n:"Hauts-de-France",la:50.5,lo:2.8},{n:"Île-de-France",la:48.6,lo:2.3},{n:"Bretagne",la:48.1,lo:-3.2},{n:"Grand Est",la:48.5,lo:6.8},{n:"Auvergne-RA",la:45.5,lo:4.3},{n:"Occitanie",la:43.5,lo:2.1},{n:"PACA",la:43.8,lo:5.9},{n:"Nouv.Aq.",la:44.5,lo:0.1},{n:"Pays Loire",la:47.4,lo:-1.2}].map(r=>{const{x,y}=sv(r.la,r.lo);return <text key={r.n} x={x} y={y} textAnchor="middle" style={{fontSize:8,fill:"rgba(0,0,0,0.05)",fontFamily:"Inter,sans-serif"}}>{r.n}</text>;})}
                    {[{n:"Paris",la:48.87,lo:2.35},{n:"Lyon",la:45.75,lo:4.83},{n:"Marseille",la:43.30,lo:5.37},{n:"Bordeaux",la:44.84,lo:-0.58},{n:"Nantes",la:47.22,lo:-1.55},{n:"Lille",la:50.63,lo:3.07},{n:"Toulouse",la:43.60,lo:1.44},{n:"Rennes",la:48.11,lo:-1.68}].map(c=>{const{x,y}=sv(c.la,c.lo);return <g key={c.n}><circle cx={x} cy={y} r="3.5" fill="rgba(0,0,0,0.05)" stroke="white" strokeWidth="1"/><text x={x+6} y={y+3.5} style={{fontSize:7.5,fill:"rgba(0,0,0,0.05)"}}>{c.n}</text></g>;})}
                    {mPins().map(pin=>{const{x,y}=sv(pin.lat,pin.lng);const hov=hovP===`${pin.type}-${pin.id}`;return(<g key={`${pin.type}-${pin.id}`} style={{cursor:"pointer"}} onClick={()=>handlePin(pin)} onMouseEnter={()=>setHovP(`${pin.type}-${pin.id}`)} onMouseLeave={()=>setHovP(null)}><ellipse cx={x} cy={y+14} rx="5" ry="2.5" fill="rgba(0,0,0,0.1)"/><circle cx={x} cy={y} r={hov?14:11} fill={pin.color} stroke="white" strokeWidth="2.5" style={{transition:"r 0.2s",filter:hov?"drop-shadow(0 3px 8px rgba(0,0,0,0.25))":"none"}}/><polygon points={`${x-4},${y+8} ${x+4},${y+8} ${x},${y+16}`} fill={pin.color}/><text x={x} y={y+4} textAnchor="middle" style={{fontSize:10,userSelect:"none"}}>{pin.e||""}</text>{hov&&<g><rect x={x-36} y={y-32} width="72" height="18" rx="5" fill={T.navy} opacity="0.92"/><text x={x} y={y-19} textAnchor="middle" style={{fontSize:8,fill:"white",fontWeight:"700"}}>{pin.name}</text></g>}</g>);})}
                    <g><circle cx={sv(50.63,3.07).x} cy={sv(50.63,3.07).y} r="16" fill={T.coral} opacity="0.14"/><circle cx={sv(50.63,3.07).x} cy={sv(50.63,3.07).y} r="6" fill={T.coral} stroke="white" strokeWidth="2.5"/><text x={sv(50.63,3.07).x} y={sv(50.63,3.07).y-12} textAnchor="middle" style={{fontSize:8,fill:T.coral,fontWeight:"700"}}>Vous</text></g>
                  </svg>
                </div>
                {mapM==="lost"&&LS.map(l=>(<div key={l.id} className="hov" onClick={()=>setLostM(l)} style={{...cd(10),cursor:"pointer",border:l.ug?"1.5px solid #E8C5C0":"none"}}><div style={{display:"flex",gap:11,alignItems:"center"}}><div style={{width:46,height:46,borderRadius:8,background:l.ug?T.coralBg:T.g1,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><PetAvatar sp={l.sp} size={40} color={l.ug?T.rose:T.g4}/></div><div style={{flex:1}}><div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontWeight:600,fontSize:14,color:T.navy}}>{l.name}</span>{l.ug&&<span style={{background:T.coralBg,color:T.rose,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}><Ic d={ICON.alert} s={16}/></span>}{l.rw&&<span style={{background:T.goldBg,color:T.gold,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>{l.rw}</span>}</div><div style={{color:T.sky,fontSize:12,fontWeight:600,marginTop:1}}>{l.br} · {l.ct}</div></div></div></div>))}
                {mapM==="vets"&&VT.filter(v=>v.ok).map(v=>(<div key={v.id} className="hov" onClick={()=>setVetM(v)} style={{...cd(10),cursor:"pointer"}}><div style={{display:"flex",gap:11,alignItems:"center"}}><div style={{width:46,height:46,background:T.coralBg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}><Ic d={ICON.stethoscope} s={20}/></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{v.name}</div><div style={{color:T.sky,fontSize:12,fontWeight:600}}>{v.spec} · {v.ct}</div></div><span style={{background:T.sageBg,color:T.sage,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>● Dispo</span></div></div>))}
                {mapM==="assos"&&AS.map(a=>(<div key={a.id} className="hov" onClick={()=>setAssoM(a)} style={{...cd(10),cursor:"pointer"}}><div style={{display:"flex",gap:11,alignItems:"center"}}><div style={{width:42,height:42,background:T.lilacBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.lilac}}><Ic d={ICON.shield} s={19}/></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{a.name}</div><div style={{color:T.lilac,fontSize:12,fontWeight:600,textTransform:"capitalize"}}>{a.type} · {a.rg}</div></div></div></div>))}
                {mapM==="animals"&&pool.slice(0,6).map(a=>(<div key={a.id} className="hov" style={{...cd(10),display:"flex",gap:12,alignItems:"center",cursor:"pointer"}}><PetAvatar sp={a.sp} size={46} color={a.c} bg={`${a.c}1A`}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{a.name}</div><div style={{fontSize:12,color:T.sky,fontWeight:600}}>{a.br} · {a.ct}</div></div><button onClick={()=>doSw("right")} style={{...btn(T.coral,false,true),display:"flex",alignItems:"center",gap:5}}><Ic d={ICON.heart} s={14} fill="white" c="white"/>Aimer</button></div>))}
              </>
            )}

            {dSub==="lost"&&(
              <>
                <div style={{background:T.rose,borderRadius:10,padding:"14px 18px",marginBottom:12,display:"flex",gap:12,alignItems:"center"}}>
                  <span style={{fontSize:28}}><Ic d={ICON.alert} s={16}/></span>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:"white"}}>{LS.filter(l=>l.ug).length} alertes urgentes près de vous</div><p style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:2}}>Partager = +30 PawPoints</p></div>
                </div>
                {LS.map(l=>(<div key={l.id} className="hov" onClick={()=>setLostM(l)} style={{...cd(10),cursor:"pointer",border:l.ug?"1.5px solid #E8C5C0":"none"}}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:52,height:52,borderRadius:8,background:l.ug?T.coralBg:T.g1,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><PetAvatar sp={l.sp} size={44} color={l.ug?T.rose:T.g4}/></div><div style={{flex:1}}><div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:2}}><span style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:16,color:T.navy}}>{l.name}</span>{l.ug&&<span style={{background:T.coralBg,color:T.rose,fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:10}}>URGENT</span>}{l.rw&&<span style={{background:T.goldBg,color:T.gold,fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:10}}>{l.rw}</span>}</div><div style={{color:T.sky,fontSize:12,fontWeight:600}}>{l.br} · {l.ct}</div><div style={{color:T.g3,fontSize:11,marginTop:2}}>Il y a {l.ti} · {l.ds}</div></div></div></div>))}
                <div style={{...cd(0),border:`2px dashed ${T.g2}`,textAlign:"center",cursor:"pointer"}} onClick={()=>sT("Signalement lancé +30 pts")}>
                  <div style={{fontSize:28,marginBottom:6}}><Ic d={ICON.pin} s={20}/></div>
                  <div style={{fontWeight:600,fontSize:14,color:T.navy}}>Signaler un animal perdu</div>
                  <p style={{color:T.g3,fontSize:12,marginTop:4}}>+30 PawPoints · Aide la communauté</p>
                </div>
              </>
            )}
          </div>
        )}

        {tab==="soins"&&(
          <div className="fade" style={{paddingTop:12}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:24,color:T.navy,marginBottom:12}}>Soins &amp; Services 🏥</div>
            {SN([{id:"vets",l:"Vétérinaires"},{id:"assos",l:"Associations"},{id:"services",l:"Services"}],sTab,setST)}
            {sTab==="vets"&&(
              <>
                <div onClick={()=>setTcO(true)} style={{background:T.sage,borderRadius:10,padding:"16px 20px",marginBottom:14,cursor:"pointer",display:"flex",gap:14,alignItems:"center"}}>
                  <span style={{fontSize:36}}><Ic d={ICON.video} s={16}/></span>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:15,color:"white"}}>Téléconsultation disponible</div><p style={{color:"rgba(255,255,255,0.82)",fontSize:12,marginTop:2}}>Vétérinaire en vidéo · 7j/7 · Dès 8€</p></div>
                  <span style={{color:"rgba(255,255,255,0.6)",fontSize:22}}>›</span>
                </div>
                <div style={{background:T.navy,borderRadius:8,padding:"13px 16px",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
                  <span style={{fontSize:24}}><Ic d={ICON.messages} s={16}/></span>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:"white"}}>Conseil vétérinaire gratuit</div><p style={{color:"rgba(255,255,255,0.55)",fontSize:11,marginTop:2}}>Nos partenaires répondent en moins de 2h</p></div>
                  <button onClick={()=>setNpO(true)} style={{background:"white",color:T.navy,border:"none",borderRadius:50,padding:"7px 13px",fontWeight:600,fontSize:12,cursor:"pointer",flexShrink:0}}>Poser</button>
                </div>
                <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:12}}>
                  {SP.map(s=><button key={s.id} onClick={()=>setVSp(s.id)} style={{background:vSp===s.id?T.sage:"white",color:vSp===s.id?"white":T.g3,border:`1.5px solid ${vSp===s.id?T.sage:T.g2}`,borderRadius:50,padding:"5px 13px",fontWeight:600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}>{s.l}</button>)}
                </div>
                {VT.filter(v=>vSp==="all"||v.sp.includes(vSp)).map(v=>(
                  <div key={v.id} className="hov" onClick={()=>setVetM(v)} style={{...cd(12),cursor:"pointer"}}>
                    <div style={{display:"flex",gap:12}}>
                      <div style={{width:52,height:52,background:T.coralBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}><Ic d={ICON.stethoscope} s={20}/></div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:14,color:T.navy}}>{v.name}</span><span style={{background:v.ok?T.sageBg:"#F3F4F6",color:v.ok?T.sage:T.g3,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>{v.ok?"● Dispo":"○ Indispo"}</span></div>
                        <div style={{color:T.sky,fontSize:12,fontWeight:600,marginTop:2}}>{v.spec} · {v.ct}</div>
                        <div style={{display:"flex",gap:9,marginTop:5,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,color:"#F59E0B",fontWeight:600}}>{v.r}</span>
                          <span style={{fontSize:11,color:T.g3}}>{v.dt} · {v.p}</span>
                          {v.tc&&<span style={{fontSize:11,color:T.sage,fontWeight:600}}><Ic d={ICON.video} s={16}/></span>}
                          {v.pt&&<span style={{fontSize:11,color:T.coral,fontWeight:600}}><Ic d={ICON.star} s={16}/></span>}
                        </div>
                        {v.ok&&v.sl.length>0&&(
                          <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
                            {v.sl.map(s=><button key={s} onClick={e=>{e.stopPropagation();setSlSel(s);sT(`RDV : ${s} avec ${v.name}`);aP(15,"RDV");}} style={{background:slSel===s?T.coral:T.coralBg,color:slSel===s?"white":T.coral,border:"none",borderRadius:10,padding:"5px 13px",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>{s}</button>)}
                            <span style={{fontSize:10,color:T.rose,fontWeight:600,alignSelf:"center"}}>{v.sl.length} place{v.sl.length>1?"s":""}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {sTab==="assos"&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:14}}>
                  {[{v:AS.length,l:"Associations",e:"",c:T.lilac},{v:AS.reduce((s,a)=>s+a.an,0),l:"À adopter",e:"",c:T.coral},{v:AS.reduce((s,a)=>s+a.ug,0),l:"Urgents",e:"",c:T.rose}].map(s=>(
                    <div key={s.l} style={{background:"white",borderRadius:10,padding:"13px 8px",textAlign:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>
                      <div style={{fontWeight:600,fontSize:22,letterSpacing:"-0.02em",color:T.navy}}>{s.v}</div><div style={{fontSize:10,color:T.g3,fontWeight:600,marginTop:1}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {AS.map(a=>(<div key={a.id} className="hov" onClick={()=>setAssoM(a)} style={{...cd(12),cursor:"pointer"}}><div style={{display:"flex",gap:12}}><div style={{width:44,height:44,background:T.lilacBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.lilac}}><Ic d={ICON.shield} s={20}/></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:15,color:T.navy,display:"flex",gap:7,alignItems:"center"}}>{a.name}{a.vf&&<span style={{background:T.coralBg,color:T.sky,fontSize:9,fontWeight:600,padding:"2px 6px",borderRadius:6,display:"inline-flex",alignItems:"center",gap:2}}><Ic d={ICON.check} s={10}/></span>}</div><div style={{color:T.lilac,fontSize:12,fontWeight:600,marginTop:2,textTransform:"capitalize"}}>{a.type} · {a.rg}</div><p style={{color:T.g4,fontSize:12,lineHeight:1.5,marginTop:4}}>{a.ds}</p><div style={{display:"flex",gap:8,marginTop:7}}><span style={{background:T.lilacBg,color:T.lilac,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:10}}>{a.an}</span>{a.ug>0&&<span style={{background:T.coralBg,color:T.rose,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:10}}>{a.ug}</span>}</div></div></div></div>))}
                <div style={{background:T.lilac,borderRadius:10,padding:20,textAlign:"center",marginTop:4}}>
                  
                  <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:17,color:"white",marginBottom:6}}>Soutenir les associations</div>
                  <p style={{color:"rgba(255,255,255,0.82)",fontSize:13,lineHeight:1.6,marginBottom:14}}>100% reversé · +50 PawPoints par don</p>
                  <button style={btn("white",true)} onClick={()=>{sT("Don confirmé ! +50 pts");aP(50,"Don ");}}><span style={{color:T.lilac,fontWeight:600}}>Faire un don</span></button>
                </div>
              </>
            )}
            {sTab==="services"&&(
              <>
                <p style={{color:T.g3,fontSize:13,marginBottom:14}}>Professionnels certifiés proches de vous</p>
                {[{ic:"heart",t:"Toilettage",d:"Bain, coupe, soins",p:"À partir de 35€",ok:true},{ic:"pin",t:"Promenade",d:"Individuelles ou en groupe",p:"15€/h",ok:true},{ic:"shield",t:"Pet Sitting",d:"Garde à domicile",p:"25€/nuit",ok:true},{ic:"trophy",t:"Éducation canine",d:"Dressage, comportementaliste",p:"50€/séance",ok:true},{ic:"star",t:"Photographe",d:"Séance photo pro",p:"80€/séance",ok:false},{ic:"map",t:"Transport",d:"Aller/retour vétérinaire",p:"20€",ok:true}].map((s,i)=>(
                  <div key={i} className="hov" onClick={()=>sT(`${s.t} — réservation en cours`)} style={{...cd(10),cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:42,height:42,background:T.coralBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:T.coral,flexShrink:0}}><Ic d={ICON[s.ic]} s={19}/></div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:T.navy}}>{s.t}</div><div style={{color:T.g3,fontSize:12,marginTop:2}}>{s.d}</div><div style={{color:T.coral,fontWeight:600,fontSize:12,marginTop:4}}>{s.p}</div></div>
                    <span style={{background:s.ok?T.sageBg:"#F3F4F6",color:s.ok?T.sage:T.g3,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>{s.ok?"● Dispo":"○ Indispo"}</span>
                  </div>
                ))}

                {/* ─ ASSURANCES ─ */}
                <div style={{fontWeight:600,fontSize:14,color:T.navy,margin:"16px 0 10px"}}>Assurances animaux</div>
                {[
                  {name:"Assurance Confort",brand:"AXA",price:"9€/mois",cover:"Accidents + maladies",color:T.sky,popular:false},
                  {name:"Assurance Premium",brand:"Allianz",price:"19€/mois",cover:"Tout risque + dentaire",color:T.coral,popular:true},
                  {name:"Assurance Essentielle",brand:"Groupama",price:"5€/mois",cover:"Accidents uniquement",color:T.sage,popular:false},
                ].map((ins,i)=>(
                  <div key={i} className="hov" onClick={()=>sT(`Devis ${ins.brand} en cours...`)} style={{...cd(10),cursor:"pointer",border:ins.popular?`2px solid ${T.coral}`:"none",position:"relative"}}>
                    {ins.popular&&<div style={{position:"absolute",top:-10,right:14,background:T.coral,color:"white",fontSize:10,fontWeight:600,padding:"3px 12px",borderRadius:10}}>Recommandé</div>}
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{width:42,height:42,background:T.coralBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.coral}}><Ic d={ICON.shield} s={20}/></div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:14,color:T.navy}}>{ins.name}</div>
                        <div style={{color:T.g3,fontSize:11,marginTop:1}}>{ins.brand} · {ins.cover}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:600,fontSize:15,color:ins.color}}>{ins.price}</div>
                        <div style={{fontSize:10,color:T.g3}}>par animal</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {tab==="communaute"&&(
          <div className="fade" style={{paddingTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:24,color:T.navy}}>Communauté 💬</div>
              <button onClick={()=>setNpO(true)} style={btn(T.coral,false,true)}>+ Poster</button>
            </div>
            <p style={{color:T.g3,fontSize:13,marginBottom:12}}>Questions, conseils, expériences partagées</p>

            {/* ─ STORIES ─ */}
            <div style={{display:"flex",gap:12,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
              {[
                {name:"Sophie M.",e:"",color:"#A8895C",new:true},
                {name:"Thomas K.",e:"",color:T.rose,new:true},
                {name:"Léa B.",   e:"",color:"#7A6E96",new:false},
                {name:"Emma F.",  e:"",color:T.coral,  new:true},
                {name:"Marc D.",  e:"",color:"#5B7089",new:false},
                {name:"Fatima K.",e:"",color:"#5C8A72",new:true},
              ].map((s,i)=>(
                <div key={i} onClick={()=>sT(`Story de ${s.name} `)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
                  <div style={{width:50,height:50,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:600,fontSize:17,border:s.new?`2px solid ${T.coral}`:`2px solid ${T.line}`,boxSizing:"border-box",padding:2}}>
                    {s.name[0]}
                  </div>
                  <div style={{fontSize:9,color:T.g4,fontWeight:600,maxWidth:54,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name.split(" ")[0]}</div>
                  {s.new&&<div style={{width:8,height:8,background:T.coral,borderRadius:"50%",marginTop:-8}}/>}
                </div>
              ))}
              <div onClick={()=>sT("Créer une story — bientôt disponible")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
                <div style={{width:54,height:54,borderRadius:"50%",background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`2px dashed ${T.g2}`}}></div>
                <div style={{fontSize:9,color:T.g3,fontWeight:600}}>Ma story</div>
              </div>
            </div>

            {/* ─ TRENDING ─ */}
            <div style={{...cd(14),background:T.warm}}>
              <div style={{fontWeight:600,fontSize:13,color:T.navy,marginBottom:10}}>Tendances cette semaine</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {["#vaccination","#chihuahua","#reproduction","#alimentation","#reptiles","#adoption","#téléconsult"].map(tag=>(
                  <span key={tag} onClick={()=>setCSrch(tag.slice(1))} style={{background:"white",color:T.coral,border:`1.5px solid ${T.coralBg}`,borderRadius:50,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={{...cd(12)}}>
              <input value={cSrch} onChange={e=>setCSrch(e.target.value)} placeholder="Rechercher..." style={{width:"100%",border:`2px solid ${T.g2}`,borderRadius:12,padding:"10px 14px",fontSize:13,marginBottom:9,background:T.g1,color:T.navy,fontFamily:"'Inter',sans-serif"}} onFocus={e=>{e.target.style.borderColor=T.coral;e.target.style.background="white"}} onBlur={e=>{e.target.style.borderColor=T.g2;e.target.style.background=T.g1}}/>
              <div style={{display:"flex",gap:7,overflowX:"auto"}}>
                {SP.slice(0,6).map(s=><button key={s.id} onClick={()=>setCSp(s.id)} style={{background:cSp===s.id?T.coral:T.g1,color:cSp===s.id?"white":T.g3,border:"none",borderRadius:50,padding:"5px 13px",fontWeight:600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}>{s.l}</button>)}
              </div>
            </div>
            <div onClick={()=>setTcO(true)} style={{background:T.sage,borderRadius:10,padding:"14px 18px",marginBottom:14,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:28}}><Ic d={ICON.stethoscope} s={16}/></span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:"white"}}>Réponse vétérinaire gratuite</div><p style={{color:"rgba(255,255,255,0.82)",fontSize:12,marginTop:2}}>Nos partenaires répondent en moins de 2h</p></div>
              <button onClick={e=>{e.stopPropagation();setNpO(true);}} style={{background:"white",color:T.sage,border:"none",borderRadius:50,padding:"8px 14px",fontWeight:600,fontSize:12,cursor:"pointer",flexShrink:0}}>Poser</button>
            </div>
            {fp.length===0?(
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:44,marginBottom:10}}><Ic d={ICON.discover} s={20}/></div>
                <button style={btn(T.coral)} onClick={()=>setNpO(true)}>Soyez le premier à poster</button>
              </div>
            ):fp.map(post=>(
              <div key={post.id} className="hov" onClick={()=>setPostM(post)} style={{...cd(12),cursor:"pointer",border:post.ug?"1.5px solid #E8C5C0":"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",gap:9,alignItems:"center"}}>
                    <PetAvatar sp={post.sp} size={38} color={T.g4} bg={T.warm}/>
                    <div><div style={{fontWeight:600,fontSize:13,color:T.navy}}>{post.au}</div><div style={{fontSize:11,color:T.g3}}>{post.rg} · {post.ti}</div></div>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    <span style={{background:T.coralBg,color:T.coral,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>{post.tg}</span>
                    {post.ug&&<span style={{background:T.coralBg,color:T.rose,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}><Ic d={ICON.alert} s={16}/></span>}
                    {post.vr&&<span style={{background:T.sageBg,color:T.sage,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>Veto</span>}
                  </div>
                </div>
                <div style={{fontWeight:600,fontSize:14,color:T.navy,marginBottom:4}}>{post.ti2}</div>
                <p style={{color:T.g4,fontSize:12,lineHeight:1.6,marginBottom:8}}>{post.bo.slice(0,110)}...</p>
                <div style={{display:"flex",gap:14}}><span style={{fontSize:12,color:T.g3}}> {post.li}</span><span style={{fontSize:12,color:T.g3}}>{post.rp}</span></div>
              </div>
            ))}
          </div>
        )}

        {tab==="matchs"&&!chatP&&(
          <div className="fade" style={{paddingTop:14}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:24,color:T.navy,marginBottom:4}}>Mes Matchs 💛</div>
            <p style={{color:T.g3,fontSize:13,marginBottom:14}}>{matches.length} connexion{matches.length!==1?"s":""} actives</p>
            {!prem&&(
              <div onClick={()=>setPremM(true)} style={{background:T.navy,borderRadius:10,padding:"13px 16px",marginBottom:14,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:42,height:42,background:"rgba(255,255,255,0.1)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"white"}}><Ic d={ICON.lock} s={18} c="white"/></div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:"white"}}>3 profils ont liké {myPet.name||"votre animal"}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>Expirent dans 23h — débloquer Premium</div></div>
                <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
              </div>
            )}
            {matches.length===0?(
              <div style={{textAlign:"center",padding:"44px 20px"}}>
                <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:18,opacity:0.9}}>
                  <PetAvatar sp="chat" size={56} color="#8B72A8" bg="#8B72A81A"/>
                  <PetAvatar sp="chien" size={68} color={T.coral} bg={T.coralBg}/>
                  <PetAvatar sp="lapin" size={56} color="#C98A6E" bg="#C98A6E1A"/>
                </div>
                <p style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:18,color:T.navy,marginBottom:8}}>Pas encore de match 🐾</p>
                <p style={{fontSize:13,color:T.g3,marginBottom:18}}>Swipez pour trouver des compagnons !</p>
                <button style={btn(T.coral)} onClick={()=>setTab("discover")}>Découvrir des animaux</button>
              </div>
            ):matches.map((m,i)=>(
              <div key={i} className="hov" onClick={()=>setChatP(m)} style={{...cd(10),display:"flex",alignItems:"center",gap:13,cursor:"pointer"}}>
                <PetPhoto pet={m} size={54}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:15,color:T.navy}}>{m.name} <span style={{color:T.g3,fontWeight:400,fontSize:13}}>· {m.ow}</span></div>
                  <div style={{fontSize:12,color:T.g3,marginTop:2}}>{m.br} · {m.ct}</div>
                  <div style={{fontSize:11,color:T.sage,marginTop:2,fontWeight:600}}>{m.co}% compatible</div>
                </div>
                <div style={{background:T.coral,color:"white",width:20,height:20,borderRadius:"50%",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>1</div>
              </div>
            ))}
          </div>
        )}


        {tab==="events"&&(
          <div className="fade" style={{paddingTop:12}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:24,color:T.navy,marginBottom:4}}>Événements 📅</div>
            <p style={{color:T.g3,fontSize:13,marginBottom:14}}>Rencontres, balades et concours près de chez vous</p>

            {/* Bannière création event */}
            <div style={{background:T.coral,borderRadius:10,padding:"16px 20px",marginBottom:16,display:"flex",gap:14,alignItems:"center",cursor:"pointer"}} onClick={()=>sT("Créer un événement — bientôt disponible ")}>
              
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:15,color:"white"}}>Organisez un événement</div>
                <p style={{color:"rgba(255,255,255,0.82)",fontSize:12,marginTop:2}}>Balade, meet-up, concours — partagez avec la communauté</p>
              </div>
              <span style={{color:"rgba(255,255,255,0.6)",fontSize:22}}>›</span>
            </div>

            {/* Filtres espèces */}
            <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14}}>
              {SP.map(s=><button key={s.id} onClick={()=>setSpF(s.id)} style={{background:spF===s.id?T.coral:T.g1,color:spF===s.id?"white":T.g3,border:"none",borderRadius:50,padding:"6px 14px",fontWeight:600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s",fontFamily:"'Inter',sans-serif"}}>{s.l}</button>)}
            </div>

            {/* Événements */}
            {[
              {id:1,title:"Grande balade Golden Retrievers",date:"Sam 14 juin · 10h",loc:"Parc de la Citadelle, Lille",sp:"chien",e:"",color:"#E8A83A",participants:24,max:40,joined:false,badge:"Populaire",price:null},
              {id:2,title:"Expo & concours chats de race",date:"Dim 15 juin · 9h–18h",loc:"Parc des Expositions, Paris",sp:"chat",e:"",color:"#5B4B8A",participants:156,max:500,joined:false,badge:"Officiel",price:"12€"},
              {id:3,title:"Rencontre reptiles & NAC",date:"Sam 21 juin · 14h",loc:"Espace Nature, Lyon",sp:"reptile",e:"",color:"#059669",participants:18,max:30,joined:true,badge:null,price:null},
              {id:4,title:"Balade équestre matinale",date:"Dim 22 juin · 8h",loc:"Forêt de Rennes, Bretagne",sp:"cheval",e:"",color:"#374151",participants:8,max:12,joined:false,badge:"Complet bientôt",price:"5€"},
              {id:5,title:"Meet-up propriétaires lapins",date:"Sam 28 juin · 15h",loc:"Jardin des Plantes, Toulouse",sp:"lapin",e:"",color:"#D97706",participants:12,max:25,joined:false,badge:null,price:null},
              {id:6,title:"Concours photos animaux",date:"Tout juillet",loc:"En ligne — Furrix",sp:"all",e:"",color:T.coral,participants:89,max:200,joined:false,badge:"Lots à gagner",price:null},
            ].filter(ev=>spF==="all"||ev.sp===spF||ev.sp==="all").map(ev=>(
              <div key={ev.id} className="hov" style={{...cd(12),cursor:"pointer",border:ev.joined?`2px solid ${T.sage}`:"none"}} onClick={()=>{sT(ev.joined?`${ev.title} — déjà inscrit`:`Inscription à "${ev.title}" !`);aP(ev.joined?0:15,"Événement rejoint");}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:52,height:52,background:`${ev.color}18`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${ev.color}30`}}>{ev.sp==="all"?<Ic d={ICON.calendar} s={22} c={ev.color}/>:<PetAvatar sp={ev.sp} size={42} color={ev.color}/>}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <div style={{fontWeight:600,fontSize:14,color:T.navy,flex:1,paddingRight:8}}>{ev.title}</div>
                      {ev.joined&&<span style={{background:T.sageBg,color:T.sage,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10,flexShrink:0}}>Inscrit</span>}
                    </div>
                    <div style={{color:T.sky,fontSize:12,fontWeight:600,marginBottom:3}}>{ev.date}</div>
                    <div style={{color:T.g3,fontSize:11,marginBottom:8}}>{ev.loc}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                      {/* Barre de progression participants */}
                      <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                        <div style={{flex:1,background:T.g2,borderRadius:3,height:5,maxWidth:80}}>
                          <div style={{width:`${Math.min(ev.participants/ev.max*100,100)}%`,background:ev.participants/ev.max>0.8?T.rose:T.sage,height:"100%",borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:10,color:T.g3,fontWeight:600}}>{ev.participants}/{ev.max}</span>
                      </div>
                      {ev.price&&<span style={{background:T.goldBg,color:T.gold,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>{ev.price}</span>}
                      {ev.badge&&<span style={{background:T.coralBg,color:T.coral,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>{ev.badge}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA communauté */}
            <div style={{background:T.navy,borderRadius:10,padding:20,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:8}}><Ic d={ICON.map} s={20}/></div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:16,color:"white",marginBottom:6}}>Voir tous les événements sur la carte</div>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,lineHeight:1.6,marginBottom:14}}>Trouvez les rencontres proches de chez vous</p>
              <button style={btn(T.coral,true)} onClick={()=>{setTab("discover");setDS("map");setMapM("animals");}}>Ouvrir la carte</button>
            </div>
          </div>
        )}

        {tab==="moi"&&(
          <div className="fade" style={{paddingTop:14}}>
            <div style={{background:T.navy,borderRadius:10,padding:24,marginBottom:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:130,height:130,background:`${T.coral}22`,borderRadius:"50%"}}/>
              <div style={{position:"relative"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{marginBottom:10}}><PetAvatar sp={myPet.species} size={64} color="#fff" bg="rgba(255,255,255,0.1)"/></div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:22,fontWeight:600,color:"white"}}>{myPet.name||"Votre animal"}</div>
                    <div style={{color:"rgba(255,255,255,0.6)",fontSize:13,marginTop:3,textTransform:"capitalize"}}>{myPet.breed||myPet.species} · {myPet.age}</div>
                    {myPet.ownerName&&<div style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginTop:6,display:"flex",alignItems:"center",gap:5}}><Ic d={ICON.user} s={12} c="rgba(255,255,255,0.45)"/>{myPet.ownerName}{myPet.ownerCity?` · ${myPet.ownerCity}`:""}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:7,alignItems:"flex-end"}}>
                    {prem&&<span style={{background:T.coral,color:"white",borderRadius:10,padding:"4px 12px",fontSize:11,fontWeight:600}}>Premium</span>}
                    <span style={{background:"rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.7)",borderRadius:10,padding:"4px 12px",fontSize:11,fontWeight:600}}>Non vérifié</span>
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Niveau {level} — {LV[level-1]}</span>
                    <span style={{fontSize:11,color:T.coral,fontWeight:600}}>{xp%500}/500 XP</span>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.1)",borderRadius:4,height:8}}><div style={{width:`${xpP}%`,background:T.coral,height:"100%",borderRadius:4,transition:"width 0.6s"}}/></div>
                </div>
                <div style={{display:"flex",gap:16}}>
                  {[{v:`${streak}j`,l:"Streak"},{v:paws,l:"PawPoints"},{v:matches.length,l:"Matchs"},{v:"Top 12%",l:"Classement"}].map(s=>(
                    <div key={s.l} style={{textAlign:"center"}}>
                      <div style={{fontWeight:600,color:T.coral,fontSize:16}}>{s.v}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[{ic:"cart",t:"Marketplace",d:"Produits & accessoires",a:()=>setShSh(true)},{ic:"gift",t:"Récompenses",d:`${paws} points`,a:()=>setShRw(true)},{ic:"zap",t:"Booster le profil",d:boost?"Actif":"1ère position 30 min",a:()=>{if(!boost){if(paws>=200){setBoost(true);aP(-200,"Boost");sT("Boost activé — 1ère position 30 min !");}else sT("Il manque "+(200-paws)+" points — ou passe Premium pour l'illimité","warn");}else sT("Boost déjà actif","warn");}},{ic:"share",t:"Partager",d:"Lien de mon profil",a:()=>sT("Lien copié !")}].map((q,i)=>(
                <div key={i} className="hov" onClick={q.a} style={{background:"white",borderRadius:10,padding:"16px",cursor:"pointer",boxShadow:"0 1px 2px rgba(0,0,0,0.04)",transition:"all 0.2s",border:`1px solid ${T.g1}`}}>
                  <div style={{width:36,height:36,borderRadius:8,background:T.coralBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.coral,marginBottom:10}}><Ic d={ICON[q.ic]||ICON.star} s={18}/></div>
                  <div style={{fontWeight:600,fontSize:13,color:T.navy}}>{q.t}</div>
                  <div style={{fontSize:11,color:T.g3,marginTop:2}}>{q.d}</div>
                </div>
              ))}
            </div>

            <div style={cd(12)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontWeight:600,fontSize:14,color:T.navy}}>Vérifications du profil</div>
                <span style={{fontSize:12,color:T.coral,fontWeight:600}}>35% — +matchs</span>
              </div>
              <div style={{background:T.g2,borderRadius:4,height:7,marginBottom:12}}><div style={{width:"35%",background:T.coral,height:"100%",borderRadius:4}}/></div>
              {[{ic:"shield",t:"France Identité",gain:"+40% matchs"},{ic:"syringe",t:"Carnet de santé",gain:"+15% matchs"},{ic:"trophy",t:"Pedigree / LOF",gain:"+12% matchs"}].map((v,i)=>(
                <div key={i} onClick={()=>sT(`${v.t} — vérification lancée`)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<2?`1px solid ${T.g1}`:"none",cursor:"pointer"}}>
                  <span style={{color:T.g3,display:"flex"}}><Ic d={ICON.check} s={17}/></span>
                  <span style={{flex:1,fontSize:13,color:T.navy,fontWeight:500}}>{v.t}</span>
                  <span style={{fontSize:12,color:T.coral,fontWeight:600}}>{v.gain}</span>
                </div>
              ))}
            </div>

            <div style={cd(12)}>
              <div style={{fontWeight:600,fontSize:14,color:T.navy,marginBottom:10}}>Gagner des PawPoints</div>
              {[{a:"Swiper chaque jour",p:"+5",done:true},{a:"Envoyer un message",p:"+10",done:matches.length>0},{a:"Obtenir un match",p:"+10",done:matches.length>0},{a:"Compléter son profil",p:"+50",done:false},{a:"Partager une alerte perdue",p:"+30",done:false},{a:"Parrainer un ami",p:"+200",done:false}].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<5?`1px solid ${T.g1}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:22,height:22,background:row.done?T.sageBg:T.g1,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{row.done?"":"○"}</div>
                    <span style={{fontSize:13,color:row.done?T.sage:T.navy,textDecoration:row.done?"line-through":""}}>{row.a}</span>
                  </div>
                  <span style={{fontWeight:600,fontSize:13,color:T.coral}}>{row.p}</span>
                </div>
              ))}
            </div>

            {/* ─ CLASSEMENT LOCAL ─ */}
            <div style={cd(12)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:600,fontSize:14,color:T.navy}}>Classement — Hauts-de-France</div>
                <span style={{fontSize:11,color:T.coral,fontWeight:600}}>Voir tout</span>
              </div>
              {[
                {rank:1,  name:"Luna",ph:"https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=700&fit=crop",       owner:"Sophie M.",sp:"chien",c:"#C8924E",paws:1240,you:false},
                {rank:2,  name:"Rocky",ph:"https://images.unsplash.com/photo-1605897472359-85e4b94d685d?w=600&h=700&fit=crop",      owner:"Marc D.",  sp:"chien",c:"#5E7A9E",paws:980, you:false},
                {rank:3,  name:myPet.name||"Votre animal",owner:"Vous",sp:myPet.species,c:T.coral,paws:paws,you:true},
                {rank:4,  name:"Mimi",ph:"https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=700&fit=crop",       owner:"Léa B.",   sp:"chat",c:"#8B72A8",paws:310, you:false},
                {rank:5,  name:"Noisette",ph:"https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=700&fit=crop",   owner:"Emma F.",  sp:"rongeur",c:"#C98A6E",paws:280, you:false},
              ].map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<4?`1px solid ${T.g1}`:"none",background:p.you?"rgba(21,113,90,0.04)":"transparent",borderRadius:p.you?8:0,paddingLeft:p.you?8:0}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:i<3?"white":T.g3,flexShrink:0}}>
                    {p.rank}
                  </div>
                  <PetAvatar sp={p.sp} size={32} color={p.c} bg={`${p.c}1A`}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,color:p.you?T.coral:T.navy}}>{p.name}{p.you&&" (vous)"}</div>
                    <div style={{fontSize:11,color:T.g3}}>{p.owner}</div>
                  </div>
                  <div style={{fontWeight:600,fontSize:14,color:p.you?T.coral:T.g4}}>{p.paws}</div>
                </div>
              ))}
            </div>

            <div style={{background:T.coral,borderRadius:10,padding:20,marginBottom:12,textAlign:"center"}}>
              
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:15,color:"white",marginBottom:6}}>Parrainez un ami</div>
              <p style={{color:"rgba(255,255,255,0.85)",fontSize:13,lineHeight:1.6,marginBottom:14}}>Votre ami reçoit 50 PawPoints · Vous recevez 200 PawPoints</p>
              <button style={btn("white",true)} onClick={()=>sT("Lien de parrainage copié ! ")}><span style={{color:T.coral,fontWeight:600}}>Copier mon lien</span></button>
            </div>

            {!prem&&(
              <div style={{background:T.navy,borderRadius:10,padding:20,textAlign:"center"}}>
                <div style={{fontSize:26,marginBottom:7}}><Ic d={ICON.star} s={20}/></div>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:17,color:"white",marginBottom:6}}>Passez Premium</div>
                <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,lineHeight:1.6,marginBottom:14}}>Swipes illimités · Voir vos likes · Téléconsultation · RDV prioritaires</p>
                <button style={btn(T.coral,true)} onClick={()=>setPremM(true)}>Essai gratuit 7 jours</button>
              </div>
            )}

            {/* ─ CARNET DE SANTÉ NUMÉRIQUE ─ */}
            <div style={{...cd(12)}}>
              <div style={{fontWeight:600,fontSize:14,color:T.navy,marginBottom:12}}>Carnet de santé numérique</div>
              {[
                {ic:"syringe",label:"Vaccin Rage",date:"Mars 2025",status:"ok",next:"Mars 2026"},
                {ic:"shield",label:"Traitement antipuce",date:"Avr. 2025",status:"ok",next:"Juil. 2025"},
                {ic:"stethoscope",label:"Visite annuelle",date:"Jan. 2025",status:"warn",next:"Jan. 2026"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${T.g1}`:"none"}}>
                  <div style={{width:38,height:38,background:item.status==="ok"?T.sageBg:T.goldBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:item.status==="ok"?T.sage:T.gold}}><Ic d={ICON[item.ic]} s={17}/></div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,color:T.navy}}>{item.label}</div>
                    <div style={{fontSize:11,color:T.g3,marginTop:1}}>Dernier : {item.date} · Prochain : {item.next}</div>
                  </div>
                  <span style={{background:item.status==="ok"?T.sageBg:T.goldBg,color:item.status==="ok"?T.sage:T.gold,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:10}}>{item.status==="ok"?"À jour":"Bientôt"}</span>
                </div>
              ))}
              <button onClick={()=>sT("Carnet de santé — ajout en cours")} style={{...btn(T.coral,true),marginTop:12,padding:"11px",fontSize:12}}>+ Ajouter un document</button>
            </div>

            {/* ─ PRÉFÉRENCES & PARAMÈTRES ─ */}
            <div style={cd(0)}>
              <div style={{fontWeight:600,fontSize:14,color:T.navy,marginBottom:12}}>Préférences</div>
              {[
                {label:"Notifications push",   active:true,  locked:false},
                {label:"Alertes animaux perdus",active:true,  locked:false},
                {label:"Newsletter Furrix",   active:false, locked:false},
                {label:"PawPoints ×2",          active:prem,  locked:!prem},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${T.g1}`:"none"}}>
                  <span style={{fontSize:13,color:s.locked?T.g3:T.navy}}>{s.label}{s.locked?"":""}</span>
                  <div onClick={()=>{if(s.locked)setPremM(true);else sT("Préférence mise à jour");}} style={{width:44,height:26,background:s.active&&!s.locked?T.coral:"#E5E7EB",borderRadius:50,position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
                    <div style={{position:"absolute",width:20,height:20,background:"white",borderRadius:"50%",top:3,left:s.active&&!s.locked?21:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"white",borderTop:`1px solid ${T.g1}`,display:"flex",padding:"8px 2px 22px",boxShadow:"0 1px 2px rgba(0,0,0,0.04)",zIndex:100}}>
        {[
          {id:"discover",  ic:"discover",l:"Découvrir"},
          {id:"soins",     ic:"health",l:"Soins"},
          {id:"communaute",ic:"community",l:"Communauté"},
          {id:"matchs",    ic:"messages",l:"Matchs",badge:matches.length},
          {id:"events",    ic:"calendar",l:"Événements"},
          {id:"moi",       ic:"user",l:"Moi"},
        ].map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);if(t.id!=="matchs")setChatP(null);}} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 1px",position:"relative",minWidth:0}}>
            {tab===t.id&&<div style={{position:"absolute",top:-8,width:24,height:2,background:T.coral,borderRadius:2}}/>}
            <div style={{transition:"color 0.15s",color:tab===t.id?T.coral:T.g3,display:"flex"}}><Ic d={ICON[t.ic]} s={21} sw={tab===t.id?2:1.6}/></div>
            <div style={{fontSize:10,fontWeight:tab===t.id?600:500,color:tab===t.id?T.coral:T.g3,whiteSpace:"nowrap",fontFamily:"'Inter',sans-serif",letterSpacing:"-0.01em"}}>{t.l}</div>
            {(t.badge>0)&&<div style={{position:"absolute",top:0,right:"calc(50% - 18px)",background:T.coral,color:"white",minWidth:16,height:16,padding:"0 4px",borderRadius:8,fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{t.badge}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
