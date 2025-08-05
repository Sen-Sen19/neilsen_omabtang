<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AI Image Generator - Fixed Bottom Prompt</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css">
<style>
body {
  background: #0a0a0d;
  color: #ddd; /* softer light gray text */
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.container { 
  width: 100%;
  max-width: 900px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* ✅ Fixed Prompt Box */
.prompt-box {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background: rgba(25,25,25,0.95);
  border-top: 1px solid #555;
  padding: 10px;
  backdrop-filter: blur(10px);
  z-index: 1000;
}

#prompt {
  flex: 1;
  background: transparent;
  border: none;
  color: #eee;
  font-size: 15px;
  padding: 5px 10px;
}
#prompt:focus { outline: none; }

/* ✅ Buttons */
button {
  background: rgba(100,100,100,0.1);
  border: 1px solid #777;
  color: #ccc;
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: rgba(150,150,150,0.2);
}

/* ✅ Content Padding */
.content { padding-bottom: 80px; display: flex; flex-direction: column; gap: 15px; }

/* ✅ Preview Box */
#preview-box {
  background: rgba(255,255,255,0.05);
  border: 1px solid #555;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  min-height: 300px;
}
#preview-box img {
  width: 100%;
  border-radius: 10px;
  transition: 0.3s;
}
#preview-box img:hover {
  transform: scale(1.02);
  box-shadow: 0 0 10px rgba(100,100,100,0.3);
}

/* ✅ Loader */
.loader {
  border: 4px solid rgba(100,100,100,0.2);
  border-top: 4px solid #aaa;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 30px auto;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

/* ✅ Gallery */
#gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px,1fr));
  gap: 10px;
  margin-top: 15px;
}
.gallery-item {
  background: rgba(255,255,255,0.05);
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  position: relative;
}
.gallery-item img {
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.gallery-item img:hover {
  transform: scale(1.03);
  box-shadow: 0 0 10px rgba(100,100,100,0.3);
}

/* ✅ Delete Button */
.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255,0,0,0.3);
  border: 1px solid #900;
  color: #eee;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.delete-btn:hover { background: rgba(255,0,0,0.5); }

/* ✅ Confirmation Modal */
.confirm-box {
  background: #222;
  border: 1px solid #555;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  color: #eee;
  box-shadow: 0 0 20px rgba(50,50,50,0.5);
}
.confirm-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 998;
}

/* 📱 Mobile */
@media(max-width:600px){
  .container{padding:10px;}
  #preview-box{min-height:200px;}
  .prompt-box{flex-direction: column; border-radius: 0;}
}

.btn-dark {
  background: rgba(100,100,100,0.1);
  border: 1px solid #777;
  color: #ccc;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 13px;
}
.btn-dark:hover {
  background: rgba(150,150,150,0.2);
}

/* ✅ Small Version for Gallery Items */
.btn-dark-sm {
  background: rgba(100,100,100,0.1);
  border: 1px solid #666;
  color: #bbb;
  border-radius: 6px;
  padding: 3px 6px;
  font-size: 11px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-dark-sm:hover {
  background: rgba(150,150,150,0.2);
}
</style>
</head>
<body>
<div class="container">
  <div class="content">
    <!-- ✅ Gallery -->
    <div id="gallery"></div>
    <!-- ✅ Preview -->
    <div id="preview-box"><p>🖼️ Your generated image will appear here</p></div>
  </div>

  <!-- ✅ Prompt Bar Fixed -->
  <div class="prompt-box">
    <input type="text" id="prompt" placeholder="Describe your image...">
    <button id="dice">🎲</button>
    <button id="generate">Generate</button>
  </div>
</div>
<script>
const promptInput=document.getElementById("prompt");
const preview=document.getElementById("preview-box");
const gallery=document.getElementById("gallery");

let history=JSON.parse(localStorage.getItem("ai_gallery"))||[];
let lastPreview=JSON.parse(localStorage.getItem("ai_preview"))||null;

/* 🎲 Random prompt */
const ideas = [
  "Cyberpunk alley glowing with holograms",
  "Dragon made of stars soaring through space",
  "Neon samurai standing under a rainy Tokyo night",
  "Steampunk airship flying over a foggy city",
  "Robot painting a portrait of a human",
  "Ancient tree with glowing runes in a mystical forest",
  "Futuristic city with floating cars and skyscrapers",
  "Underwater kingdom with bioluminescent creatures",
  "Magical wizard casting a spell in a dark cave",
  "Post-apocalyptic wasteland with abandoned buildings",
  "Galaxy inside a crystal sphere floating in space",
  "Retro 80s synthwave sunset with palm trees",
  "Astronaut exploring an alien jungle",
  "Dark castle surrounded by lightning storms",
  "Phoenix rising from glowing embers",
  "A giant whale swimming in the clouds",
  "Samurai duel on a snowy mountain peak",
  "Spaceship landing on a lava planet",
  "Cyber witch with glowing tattoos",
  "Floating islands connected by waterfalls",
  "Cute alien pet with big eyes and colorful fur",
  "Mystical dragon flying above an ancient temple",
  "Abandoned amusement park overtaken by nature",
  "Warrior with futuristic armor wielding an energy sword",
  "Giant robot walking through a ruined city",
  "Astronaut looking at Earth from the Moon",
  "Futuristic motorcycle chase through neon streets",
  "Castle in the sky surrounded by auroras",
  "Time traveler stepping through a glowing portal",
  "Alien desert with three suns and strange rock formations",
  "Vampire queen in a gothic throne room",
  "Robot playing a grand piano in an empty concert hall",
  "Cyborg cat with glowing eyes on a rooftop",
  "Golden dragon curled around a crystal tower",
  "Ancient ruins with floating magical orbs",
  "Post-apocalyptic survivor with a gas mask",
  "Ocean wave made of pure light crashing into shore",
  "Shadowy assassin in a futuristic cityscape",
  "Magical fox spirit under cherry blossom trees",
  "Skull-shaped mountain surrounded by storm clouds",
  "Spaceship battle above a burning planet",
  "Astronaut discovering a glowing alien egg",
  "Ancient samurai ghost emerging from the mist",
  "Neon cyber dragon wrapped around a skyscraper",
  "Surreal dreamscape with melting clocks",
  "Futuristic AI core glowing with energy",
  "Giant tree growing in the middle of a desert",
  "Sky full of air balloons at sunrise",
  "Fantasy warrior riding a mechanical horse",
  "Retro robot serving coffee in a 1950s diner",
  "Fairy queen sitting on a throne made of flowers",
  "Haunted house with glowing windows on a hill",
  "Glitchy digital world with broken pixels",
  "Floating jellyfish creatures illuminating the night sky", 
    "Crystal cave glowing with rainbow lights",
  "Knight fighting a giant stone golem",
  "Spaceship drifting in a nebula with purple clouds",
  "Futuristic Tokyo street with holographic billboards",
  "Mystic waterfall flowing upwards into the sky",
  "Robot bartender serving drinks in a cyber bar",
  "Epic battle between fire and ice dragons",
  "Alien jungle with plants that glow in the dark",
  "Astronaut riding a giant butterfly on an alien planet",
  "Temple hidden in the clouds surrounded by eagles",
  "Futuristic racing cars with jet engines on a neon track",
  "Haunted forest with ghostly wisps floating around",
  "Steampunk inventor with mechanical wings",
  "Skyline filled with floating cubes and strange physics",
  "Cyberpunk hacker sitting in front of glowing screens",
  "Fantasy portal opening above a medieval town",
  "Astronaut discovering a mirror planet with inverted sky",
  "Cityscape where buildings are made of glass and light",
  "Mechanical dragon breathing digital flames",
  "Ancient library filled with levitating books",
  "Giant spider weaving webs between skyscrapers",
  "Robot samurai guarding a neon temple",
  "Surreal desert where the sand is made of stars",
  "Deep sea diver encountering a glowing leviathan",
  "Witch flying on a broom through a futuristic city",
  "Angel descending with burning white wings",
  "Alien marketplace with strange foods and creatures",
  "Futuristic cyber knight with a plasma sword",
  "Massive meteor shower over a frozen tundra",
  "Holographic koi fish swimming in the air",
  "Apocalyptic city overrun by AI-controlled drones",
  "Magical castle growing out of a crystal mountain",
  "Street filled with robotic dogs and neon graffiti",
  "Giant ancient turtle carrying a forest on its back",
  "Futuristic train flying through the clouds",
  "Sci-fi soldier with glowing armor in a battlefield",
  "Forest where the trees are bioluminescent mushrooms",
  "Cyberpunk market under glowing lanterns",
  "Robot artist painting on the moon",
  "Dragon curled around a futuristic skyscraper",
  "Ancient deity awakening from a stone statue",
  "Underwater ruins of a lost city",
  "Futuristic desert caravan with hover bikes",
  "Astronaut floating among giant cosmic whales",
  "Samurai meditating under falling cherry blossoms",
  "Post-apocalyptic robot tending to a small garden",
  "Giant snake made of electricity",
  "Sunken pirate ship glowing with cursed treasure",
  "Spaceship wreckage turned into a colony",
  "Massive tree growing out of a volcano",
  "Alien landscape where the sky is filled with rings",
  "Digital ghost haunting an abandoned data center",
  "Golden temple shining in a stormy ocean",
  "Cybernetic crow perched on a streetlight",
  "Futuristic gladiator fighting in a holographic arena",
   "Cyberpunk angel with mechanical wings flying over a city",
  "Floating islands with waterfalls cascading into the sky",
  "Ancient robot buried in a desert, half-covered in sand",
  "Viking ship sailing through glowing northern lights",
  "Fantasy warrior riding a giant wolf into battle",
  "Galaxy dragon flying between planets",
  "Neon-lit alley with rain reflecting the signs",
  "Massive holographic whale swimming above skyscrapers",
  "Portal opening to a parallel cyber dimension",
  "Giant octopus wrapping around a futuristic submarine",
  "Sky filled with massive glowing jellyfish",
  "Ancient ruins where trees have grown into the stone",
  "Samurai fighting a robotic tiger under a red moon",
  "Frozen castle shimmering under aurora borealis",
  "Gladiator robot fighting in a dystopian arena",
  "Haunted abandoned amusement park at night",
  "Cybernetic phoenix rising from digital ashes",
  "Robot child holding a glowing flower in a wasteland",
  "Epic spaceship battle in an asteroid field",
  "Floating market on clouds with airships docking",
  "Alien coral reef with creatures made of glass",
  "Futuristic knight with a holographic shield",
  "Digital city where roads are made of light",
  "Forest spirit with glowing antlers walking in mist",
  "Desert storm revealing a giant buried statue",
  "Magical fox with nine glowing tails in a moonlit forest",
  "Robotic horse galloping through a neon desert",
  "Medieval castle with cyber enhancements",
  "Dark sorcerer summoning shadows in a storm",
  "Lava waterfall glowing in a volcanic landscape",
  "Street full of holographic graffiti that moves",
  "Massive clockwork city powered by gears",
  "Cyber ninja jumping between skyscrapers",
  "Ancient dragon sleeping under a mountain of gold",
  "AI-powered temple with holographic monks",
  "Surreal landscape where the sky is upside down",
  "Underwater volcano erupting with glowing magma",
  "Cybernetic wolf pack hunting under neon lights",
  "Alien spaceship disguised as a mountain",
  "Shattered moon pieces floating around a planet",
  "Robot gardener taking care of crystal flowers",
  "Massive storm with lightning dragons flying",
  "Sky whales swimming through clouds at sunset",
  "Ancient civilization on a giant floating turtle",
  "Cyberpunk street samurai with glowing katana",
  "Futuristic city with flying cars and holograms",
  "Dark knight riding a flaming horse",
  "Giant holographic dragon circling a tower",
  "Neon graffiti alley with robots dancing",
  "Fantasy mage casting a spell over a city",
  "Abandoned spaceship overtaken by alien plants",
  "City built inside a gigantic hollow tree",
  "Robot owl perched on a futuristic lamppost",
  "Futuristic samurai duel in the rain",
  "Alien desert with crystal spires",
  "Skyline covered with giant glowing mushrooms",
  "Cyberpunk carnival with holographic rides",
  "Golden palace floating in a sea of clouds",
  "Massive AI core glowing in a dark chamber",
  "Robot warrior kneeling under a cherry blossom tree"
];

document.getElementById("dice").addEventListener("click",()=>promptInput.value=ideas[Math.floor(Math.random()*ideas.length)]);

/* 🔄 Load saved */
history.forEach(item=>renderGalleryItem(item));
if(lastPreview) showPreview(lastPreview.url,lastPreview.prompt,lastPreview.id);

/* 🚀 Generate */
document.getElementById("generate").addEventListener("click", async ()=>{
  const prompt=promptInput.value.trim()||"Futuristic neon city";
  const id=Date.now();
  preview.innerHTML=`<div class="loader"></div><p>⏳ Generating...</p>`;
  const imgUrl=await generateImage(prompt);

  // Move old preview → gallery
  if(lastPreview){history.unshift(lastPreview);renderGalleryItem(lastPreview);}
  showPreview(imgUrl,prompt,id);
  lastPreview={prompt,url:imgUrl,id};

  localStorage.setItem("ai_preview",JSON.stringify(lastPreview));
  localStorage.setItem("ai_gallery",JSON.stringify(history.slice(0,50)));
});

/* Dummy AI (replace with PHP fetch) */
async function generateImage(prompt){
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&rand=${Date.now()}`;
}

/* ✅ Preview with Download */
function showPreview(url,prompt,id){
  preview.innerHTML=`
    <strong>📝 ${prompt}</strong>
    <img src="${url}">
    <div style="margin-top:5px;">
      <button class="btn-dark" onclick="downloadImage('${url}')">⬇ Download</button>
    </div>
    <p style="font-size:12px;color:#aaa;">Latest generated</p>`;
}

/* ✅ Gallery with Download */
function renderGalleryItem(item){
  if(document.querySelector(`.gallery-item[data-id="${item.id}"]`)) return;
  const div=document.createElement("div");
  div.className="gallery-item";
  div.dataset.id=item.id;
  div.innerHTML=`
    <button class="delete-btn" onclick="deleteImage(${item.id})">✖</button>
    <img src="${item.url}" onclick="openInPreview('${item.url}','${item.prompt}',${item.id})">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:3px;">
      <p style="font-size:12px;color:#aaa;margin:0;">${item.prompt}</p>
        <button class="btn-dark-sm" onclick="downloadImage('\${item.url}')">⬇</button>
    </div>`;
  gallery.prepend(div);
}

/* ✅ Download Helper */
async function downloadImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = "ai_image.png"; // Force file name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl); // Clean up
}

/* ✅ Delete with Confirmation */
function deleteImage(id){
  showConfirm("🗑️ Delete this image?","Yes, delete","Cancel",()=>{
    document.querySelector(`.gallery-item[data-id="${id}"]`)?.remove();
    history = history.filter(i=>i.id!==id);
    localStorage.setItem("ai_gallery",JSON.stringify(history));
  });
}

/* ✅ Open gallery image in preview */
function openInPreview(url,prompt,id){
  showPreview(url,prompt,id);
}

/* ✅ Confirmation Modal */
function showConfirm(msg,okText,cancelText,onConfirm){
  const backdrop=document.createElement("div");
  backdrop.className="confirm-backdrop";
  backdrop.style=`position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9998;`;

  const box=document.createElement("div");
  box.className="confirm-box";
  box.style=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
             background:#1a1a1a;padding:20px;border:1px solid #444;border-radius:10px;
             text-align:center;z-index:9999;color:white;box-shadow:0 0 20px rgba(0,255,255,0.3);`;

  box.innerHTML=`
    <p>${msg}</p>
    <button id="confirm-ok" style="margin:10px;background:rgba(0,255,255,0.2);border:1px solid cyan;border-radius:8px;padding:6px 12px;">${okText}</button>
    <button id="confirm-cancel" style="margin:10px;background:rgba(255,0,0,0.2);border:1px solid red;border-radius:8px;padding:6px 12px;">${cancelText}</button>`;

  document.body.append(backdrop,box);
  document.getElementById("confirm-ok").onclick=()=>{ onConfirm(); backdrop.remove(); box.remove(); };
  document.getElementById("confirm-cancel").onclick=()=>{ backdrop.remove(); box.remove(); };
}
</script>

</body>
</html>
