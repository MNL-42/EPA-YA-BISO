import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas=document.querySelector('#game');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9bc4d0);
scene.fog=new THREE.Fog(0x9bc4d0,95,360);
const camera=new THREE.PerspectiveCamera(64,innerWidth/innerHeight,.1,900);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
scene.add(new THREE.HemisphereLight(0xdff3ff,0x6d5942,2.0));
const sun=new THREE.DirectionalLight(0xffe3b2,2.2);sun.position.set(-90,140,80);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);

const mat=(color,rough=.85)=>new THREE.MeshStandardMaterial({color,roughness:rough});
const M={grass:mat(0x7d946d),asphalt:mat(0x42494a),line:mat(0xf2d98d),concrete:mat(0xb8aa91),window:mat(0x426574,.4),yellow:mat(0xf1c43d,.55),red:mat(0xb84938),blue:mat(0x447b9a),white:mat(0xe8e1d1),skin:mat(0x8b5138),dark:mat(0x252a2b),leaf:mat(0x376844),market:mat(0xc78b4e)};
const box=(w,h,d,material,x,y,z,parent=scene)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
const ground=new THREE.Mesh(new THREE.PlaneGeometry(700,700),M.grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);

// Axes urbains simplifiés, avec panneaux de rues lisibles.
function road(x,z,w,d,label){box(w,.12,d,M.asphalt,x,.02,z);const horizontal=w>d;const len=horizontal?w:d;for(let p=-len/2+7;p<len/2;p+=13){if(horizontal)box(5,.025,.18,M.line,x+p,.09,z);else box(.18,.025,5,M.line,x,.09,z+p)}const sign=box(4,.22,.16,mat(0x163e43),x,.3,z-d/2+1);const canvas2=document.createElement('canvas');canvas2.width=512;canvas2.height=64;const c=canvas2.getContext('2d');c.fillStyle='#173f43';c.fillRect(0,0,512,64);c.fillStyle='#fff4d0';c.font='bold 30px Arial';c.fillText(label,12,43);const tex=new THREE.CanvasTexture(canvas2);const plane=new THREE.Mesh(new THREE.PlaneGeometry(4, .5),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));plane.position.set(x,.65,z-d/2+.88);scene.add(plane)}
road(0,0,330,18,'BOULEVARD DU 30 JUIN');road(0,70,330,16,'AVENUE KASA-VUBU');road(0,-70,330,16,'AVENUE LUMUMBA');road(-95,0,15,250,'AVENUE DES HUILERIES');road(15,0,15,250,'AVENUE DE LA LIBÉRATION');road(115,0,15,250,'AVENUE SENDWE');

// Architecture low-poly construite par géométrie : chaque bâtiment a un nom, une palette et un volume distinct.
function building(x,z,w,h,d,name,color,kind='office'){
 const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);
 const body=box(w,h,d,mat(color),0,h/2,0,group);
 box(w+1,.6,d+1,mat(0x625b50),0,h+.3,0,group);
 if(kind==='tower'){for(let y=2;y<h-1;y+=2.6)for(let xx=-w/2+1.5;xx<w/2-1;xx+=2.3){box(.9,1.1,.08,M.window,xx,y,d/2+.06,group);box(.9,1.1,.08,M.window,xx,y,-d/2-.06,group)}}
 else if(kind==='market'){for(let xx=-w/2+2;xx<w/2-1;xx+=3){box(2.1,1.5,2.2,[M.red,M.yellow,M.blue,M.white][Math.abs(Math.floor(xx))%4],xx,1.2,0,group);const aw=box(2.4,.2,2.5,mat(0xeee0bd),xx,2.1,0,group);aw.rotation.z=-.08}}
 else {for(let xx=-w/2+1.8;xx<w/2-1;xx+=3.1)for(let y=2;y<h-1;y+=3){box(1.3,1.5,.09,M.window,xx,y,d/2+.06,group);box(1.3,1.5,.09,M.window,xx,y,-d/2-.06,group)}}
 const label=document.createElement('canvas');label.width=512;label.height=96;const ctx=label.getContext('2d');ctx.fillStyle='#102b31';ctx.fillRect(0,0,512,96);ctx.fillStyle='#ffe2a0';ctx.font='bold 30px Arial';ctx.fillText(name,14,60);const texture=new THREE.CanvasTexture(label);const sign=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(w,22),3),new THREE.MeshBasicMaterial({map:texture,transparent:false}));sign.position.set(0,Math.min(h+2,15),d/2+.15);group.add(sign);
 return group;
}
building(-55,-42,24,13,18,'GARE CENTRALE',0xd4c4a3,'civic');
building(-18,-43,25,18,20,'POSTE CENTRALE',0xd8c9aa,'civic');
building(42,-42,22,34,18,'IMMEUBLE SOZACOM',0x9eafb5,'tower');
building(88,-42,32,10,22,'GRAND MARCHÉ',0xc28a55,'market');
building(-55,38,30,9,24,'RTNC',0xc4b28e,'civic');
building(-10,38,34,16,25,'PALAIS DU PEUPLE',0xd6c8ad,'civic');
building(43,38,35,8,28,'STADE DES MARTYRS',0x9aa98c,'civic');
building(94,38,28,12,22,'MARCHÉ DE MATONGÉ',0xc68c58,'market');
building(-54,108,28,10,24,'STADE TATA RAPHAËL',0x9eaa8d,'civic');
building(0,108,24,24,20,'TOUR DE L’ÉCHANGEUR',0xc8b99c,'tower');
building(52,108,28,12,22,'PALAIS DE LA NATION',0xd8c7a5,'civic');
building(104,108,27,7,22,'JARDIN BOTANIQUE',0x71936c,'market');

// Végétation, poteaux, kiosques et clôtures pour donner de la profondeur à la rue.
for(let i=0;i<95;i++){const x=((i*37)%290)-145,z=((i*61)%250)-125;if(Math.abs(x)<13||Math.abs(z)<10)continue;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18,.25,2.3,6),mat(0x76513a));trunk.position.set(x,1.15,z);scene.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5+(i%3)*.3,1),M.leaf);crown.position.set(x,3,z);crown.castShadow=true;scene.add(crown)}
for(let i=0;i<18;i++){const x=-75+i*8;box(2.5,1.2,2.1,[M.red,M.yellow,M.blue,M.white][i%4],x,.7,12);box(2.8,.18,2.4,mat(0xd8b35c),x,1.4,12)}

// Personnages 3D procéduraux, entièrement construits en primitives et assemblés en rig simple.
function makePerson({shirt=0x287a75,pants=0x292e37,skin=0x75452f,cap=false,scale=1}={}){
 const root=new THREE.Group();const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.72,4,8),mat(shirt));torso.position.y=1.55;root.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.29,12,10),mat(skin));head.position.y=2.25;root.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8,0,Math.PI*2,0,Math.PI*.55),mat(cap?0x242a2d:0x171513));hair.position.y=2.34;root.add(hair);
 const legMat=mat(pants),armMat=mat(shirt),shoeMat=mat(0x1d2022);
 const limbs=[];
 for(const side of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.55,3,6),legMat);leg.position.set(side*.19,.62,0);root.add(leg);limbs.push(leg);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.52,3,6),armMat);arm.position.set(side*.48,1.55,0);arm.rotation.z=side*.12;root.add(arm);limbs.push(arm);const shoe=new THREE.Mesh(new THREE.BoxGeometry(.24,.12,.38),shoeMat);shoe.position.set(side*.19,.12,.08);root.add(shoe)}
 root.scale.setScalar(scale);root.userData.limbs=limbs;return root;
}
const player=makePerson({shirt:0x176b68,pants:0x252a33,skin:0x75452f});player.position.set(0,0,5);scene.add(player);
const pedestrians=[];const outfits=[0x276d8d,0xb65a3c,0x9b7b35,0x6b8b57,0x7b5b91,0xe0d4bc];
for(let i=0;i<12;i++){const p=makePerson({shirt:outfits[i%outfits.length],pants:i%2?0x252a33:0x554b43,skin:[0x75452f,0x925d40,0x603a2c][i%3],cap:i%3===0,scale:.9});p.position.set(-82+(i*17)%165,0,-22+(i*31)%42);p.userData.phase=i*.7;scene.add(p);pedestrians.push(p)}

// Véhicules stylisés : taxis jaunes de Kinshasa, minibus et voitures privées.
function makeCar(type='taxi',color=0xf1c43d){const root=new THREE.Group();const body=box(2.25,.65,4.2,mat(color),0,.78,0,root);box(1.65,.78,2.15,M.window,0,1.42,-.15,root);box(1.5,.12,1.9,mat(0x30383a),0,1.84,-.15,root);for(const x of [-1.12,1.12])for(const z of [-1.35,1.35]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.22,12),mat(0x17191b));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.4,z);root.add(wheel)}for(const x of [-.72,.72]){box(.28,.18,.08,mat(0xfff0c0),x,.82,2.12,root);box(.28,.18,.08,mat(0xc83c2d),x,.82,-2.12,root)}if(type==='minibus'){box(.18,.5,2.8,mat(0xb84232),0,1.1,.2,root)}return root}
const cars=[];for(let i=0;i<9;i++){const car=makeCar(i%4===0?'minibus':'taxi',i%4===0?0xe6dfc9:(i%3===0?0xd6d8d3:0xf1c43d));car.position.set(-95+i*23,0,((i%2)*2-1)*6);car.rotation.y=i%2?Math.PI:0;scene.add(car);cars.push({mesh:car,type:i%4===0?'minibus':'taxi',occupied:false})}

let activeCar=null;const pressed={};let yaw=0,speed=0;
function nearestCar(){let best=null,dist=8;for(const c of cars){if(c.occupied)continue;const d=c.mesh.position.distanceTo(player.position);if(d<dist){dist=d;best=c}}return best}
function interact(){if(activeCar){activeCar.occupied=false;activeCar.mesh.visible=true;player.visible=true;player.position.copy(activeCar.mesh.position);player.position.x+=2.8;activeCar=null;speed=0;document.querySelector('#status').textContent='À PIED · Okitani na motuka.';return}const c=nearestCar();if(!c){document.querySelector('#status').textContent='Approche-toi d’un taxi jaune ou d’un minibus.';return}activeCar=c;c.occupied=true;c.mesh.visible=false;player.visible=false;document.querySelector('#status').textContent='AU VOLANT · Taxi ya jaune !';}
document.querySelector('#interact').addEventListener('click',interact);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();pressed[k]=true;b.setPointerCapture(e.pointerId)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>pressed[k]=false))});
const keyNames={ArrowUp:'forward',ArrowDown:'back',ArrowLeft:'left',ArrowRight:'right',w:'forward',s:'back',a:'left',d:'right'};addEventListener('keydown',e=>{pressed[keyNames[e.key]||e.key]=true;if(e.key==='e'||e.key===' ')interact()});addEventListener('keyup',e=>pressed[keyNames[e.key]||e.key]=false);
function district(){const z=(activeCar?activeCar.mesh.position.z:player.position.z);return z<-35?'GOMBE':z<50?'LINGWALA • MATONGÉ':z<100?'KALAMU':'LIMETE'}
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);const turn=(pressed.left?1:0)-(pressed.right?1:0);const drive=(pressed.forward?1:0)-(pressed.back?1:0);
 if(activeCar){yaw+=turn*dt*1.8;speed+=(drive*23-speed*2.3)*dt;speed*=Math.pow(.985,dt*60);activeCar.mesh.rotation.y=yaw;activeCar.mesh.translateZ(-speed*dt);activeCar.mesh.position.x=THREE.MathUtils.clamp(activeCar.mesh.position.x,-155,155);activeCar.mesh.position.z=THREE.MathUtils.clamp(activeCar.mesh.position.z,-125,125);player.position.copy(activeCar.mesh.position)}
 else {yaw+=turn*dt*2.3;if(drive){player.position.x+=Math.sin(yaw)*drive*dt*5;player.position.z+=Math.cos(yaw)*drive*dt*5;player.rotation.y=yaw}player.position.x=THREE.MathUtils.clamp(player.position.x,-155,155);player.position.z=THREE.MathUtils.clamp(player.position.z,-125,125)}
 pedestrians.forEach(p=>{p.position.x+=Math.sin(clock.elapsedTime*.5+p.userData.phase)*dt*.6;p.rotation.y=Math.sin(clock.elapsedTime*.5+p.userData.phase)*.25});
 const target=activeCar?activeCar.mesh.position:player.position;const behind=new THREE.Vector3(Math.sin(yaw)*13,8,Math.cos(yaw)*13);const desired=target.clone().add(behind);camera.position.lerp(desired,.09);camera.lookAt(target.x,target.y+1.3,target.z);
 document.querySelector('#district').textContent='📍 '+district();document.querySelector('#interact').textContent=activeCar?'DESCENDRE':'MONTER DANS UN TAXI';renderer.render(scene,camera);
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))});
animate();document.querySelector('#loading').style.opacity='0';setTimeout(()=>document.querySelector('#loading')?.remove(),700);
