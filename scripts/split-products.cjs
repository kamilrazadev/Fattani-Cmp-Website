const fs=require("fs");
const all=require("./products.full.json");
const heavy=["intro","whoFor","features","highlights"];
const slim=all.map(p=>{const q={...p,images:p.images.slice(0,2)};for(const k of heavy)q[k]=Array.isArray(p[k])?[]:"";return q});
const detail={};for(const p of all)detail[p.slug]={images:p.images,intro:p.intro,whoFor:p.whoFor,features:p.features,highlights:p.highlights};
fs.writeFileSync("../src/data/products.json",JSON.stringify(slim));
fs.writeFileSync("../src/data/product-details.json",JSON.stringify(detail));
console.log(fs.statSync("../src/data/products.json").size,fs.statSync("../src/data/product-details.json").size);
// Small precomputed counts for the mega-menu so the header never needs the whole catalogue.
const ranges=[[0,50000],[50000,100000],[100000,200000],[200000,350000],[350000,2000000]];
const stats={brands:{},ranges:ranges.map(([a,b])=>all.filter(p=>p.price>=a&&p.price<b).length),total:all.length};
for(const p of all)stats.brands[p.brand]=(stats.brands[p.brand]||0)+1;
fs.writeFileSync("../src/data/stats.json",JSON.stringify(stats));
