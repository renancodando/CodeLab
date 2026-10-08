import * as THREE from 'three';
import SunCalc from 'suncalc';
import { initialFrame,stepEnvironment,StormClock } from './simulation';
import type { AmbientFrame,ThunderEvent } from './simulation';
import { Clouds } from './clouds';
import { WeatherEffects } from './effects';
import {Neblina} from './neblina';
import { QualityController } from './quality';
import type { EnvironmentState } from '../types';
import { defaultEnvironment } from './weather';
import {combinarMeteorologia} from './meteorologia/confianca';
import {transmissaoAtmosferica} from './meteorologia/iluminacao';

export class LivingWorld {
 private renderer:THREE.WebGLRenderer;
 private scene=new THREE.Scene();
 private camera=new THREE.PerspectiveCamera(47,1,.1,500);
 private target={...defaultEnvironment};
 private climate=initialFrame(defaultEnvironment);
 private storms=new StormClock();
 private effects=new WeatherEffects();
 private neblina=new Neblina();
 private cloudLayer:Clouds;
 private qualityControl=new QualityController();
 private wetMaterials:{material:THREE.MeshStandardMaterial;color:THREE.Color;roughness:number}[]=[];
 private lastAstronomy=0;
 private ultimaFusao=0;
 private atmosfera=combinarMeteorologia([]);
 private transmissaoSolar=1;
 private alvoSolar=1;
 private ultimaMascara=0;
 private diagnostico?:{atualizar:(frame:AmbientFrame)=>void;descartar:()=>void};
 private colors=[new THREE.Color("#74a4b4"),new THREE.Color("#6c7d84"),new THREE.Color("#d5c7a1"),new THREE.Color("#c58e77")];
 private flashes=false;
 private clock=new THREE.Clock();
 private frame=0;
 private resize:ResizeObserver;
 private trees:THREE.Group[]=[];

 private falls:THREE.Mesh[]=[];
 private birds:THREE.Group[]=[];
 private windows:THREE.MeshStandardMaterial[]=[];
 private sun=new THREE.DirectionalLight('#ffd8a0',3);
 private ambient=new THREE.HemisphereLight('#b1c5da','#343a25',1.8);
 private sky:THREE.Mesh;
 private water:THREE.Mesh;
 private stars:THREE.Points;

 private moon:THREE.Mesh;
 private pointer={x:0,y:0};
 private reduced=matchMedia('(prefers-reduced-motion: reduce)');
 private moonLight=new THREE.DirectionalLight('#95b2db',.5);
 private paused=false;
 private active=true;
 private disposed=false;
 private lastFrame=0;
 private vegetationUniforms={time:{value:0},wind:{value:1},direction:{value:new THREE.Vector2(1,0)}};
 constructor(private container:HTMLElement,private onClimate:(frame:AmbientFrame)=>void=()=>{},private onThunder:(event:ThunderEvent)=>void=()=>{}) {
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.15));this.renderer.shadowMap.enabled=false;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-60,right:60,top:65,bottom:-40,far:230});this.sun.shadow.bias=-.001;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.08;
  container.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-hidden','true');
  this.scene.fog=new THREE.FogExp2('#748f9d',.006);
  this.camera.position.set(2,15,48);this.camera.lookAt(-7,10,-28);
  this.scene.add(this.ambient,this.sun,this.moonLight);
  const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{top:{value:new THREE.Color('#779eac')},bottom:{value:new THREE.Color('#e5b791')}},vertexShader:'varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',fragmentShader:'varying vec3 vPos; uniform vec3 top; uniform vec3 bottom; void main(){float h=normalize(vPos).y; gl_FragColor=vec4(mix(bottom,top,smoothstep(-0.1,0.65,h)),1.0);}'});
  this.sky=new THREE.Mesh(new THREE.SphereGeometry(220,32,16),skyMaterial);this.scene.add(this.sky);
  const waterMaterial=new THREE.ShaderMaterial({transparent:true,uniforms:{time:{value:0},light:{value:1},wind:{value:1},rain:{value:0}},vertexShader:'varying vec3 p; uniform float time; uniform float wind; void main(){ p=position; vec3 q=position; q.z+=(sin(q.x*.24+time*.42)*.055+sin(q.y*.16+time*.29)*.085+sin((q.x+q.y)*.08+time*.17)*.035)*(.35+wind*.65); gl_Position=projectionMatrix*modelViewMatrix*vec4(q,1.0); }',fragmentShader:'varying vec3 p; uniform float time; uniform float light; uniform float wind; uniform float rain; void main(){float wave=sin(p.x*.42+time*.28+sin(p.y*.31+time*.16))*sin(p.y*.27+time*.21); vec3 c=mix(vec3(.055,.12,.15),vec3(.26,.42,.43),smoothstep(.25,1.,wave)); wave+=sin(length(p.xy)*18.-time*5.)*rain*.055; float glow=pow(max(0.,sin(p.x*.11+time*.055)),28.)*.11;gl_FragColor=vec4(c*(.35+light*.65)+glow,.95);}'});
  this.water=new THREE.Mesh(new THREE.PlaneGeometry(400,400,60,60),waterMaterial);this.water.rotation.x=-Math.PI/2;this.water.position.y=-7;this.scene.add(this.water);
  const rng=this.random(414);
  for(let i=0;i<16;i++) {const x=(rng()-.5)*240,z=-70-rng()*110;const mountain=new THREE.Mesh(new THREE.ConeGeometry(12+rng()*15,20+rng()*35,8),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.48,.14,.26+rng()*.15),flatShading:true}));mountain.position.set(x,0,z);this.scene.add(mountain);}
  this.island(-25,5,-38,12,17,rng,true);
  this.island(7,13,-63,8,13,rng,true);
  this.island(-2,0,-17,11,14,rng,false);
  this.island(-46,0,-80,15,25,rng,true);
  this.island(32,2,-46,15,18,rng,false);
  this.batchVegetation();
  this.cloudLayer=new Clouds(rng);this.scene.add(this.cloudLayer.group,this.effects.group,this.neblina.grupo);
  if(import.meta.env.DEV&&new URLSearchParams(location.search).has('diagnostico-clima'))void import('./meteorologia/diagnostico').then(({montarDiagnostico})=>{if(!this.disposed)this.diagnostico=montarDiagnostico(()=>this.target,estado=>this.setEnvironment(estado));});
  const starPositions=new Float32Array(1000*3);for(let i=0;i<1000;i++){const phi=rng()*Math.PI*2,theta=rng()*Math.PI*.48;starPositions[i*3]=Math.sin(theta)*Math.cos(phi)*190;starPositions[i*3+1]=Math.cos(theta)*190;starPositions[i*3+2]=Math.sin(theta)*Math.sin(phi)*190;}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));starGeometry.setAttribute('visibilidade',new THREE.BufferAttribute(new Float32Array(1000).fill(1),1));
  const materialEstrelas=new THREE.PointsMaterial({color:'#fff5d8',size:.27,transparent:true,opacity:0,depthWrite:false});
  materialEstrelas.onBeforeCompile=shader=>{shader.vertexShader='attribute float visibilidade;varying float mascaraNuvens;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nmascaraNuvens=visibilidade;');shader.fragmentShader='varying float mascaraNuvens;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','diffuseColor.a*=mascaraNuvens;\n#include <opaque_fragment>');};
  this.stars=new THREE.Points(starGeometry,materialEstrelas);this.scene.add(this.stars);
  const moonMat=new THREE.ShaderMaterial({transparent:true,uniforms:{phase:{value:.5},alpha:{value:1}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float phase;uniform float alpha;void main(){vec2 p=vUv*2.-1.;float r=dot(p,p);if(r>1.)discard;vec3 n=vec3(p,sqrt(1.-r));float a=phase*6.2831853;vec3 light=vec3(sin(a),0.,-cos(a));float d=max(.025,dot(n,light));float grain=.93+.07*sin(p.x*64.)*sin(p.y*53.);gl_FragColor=vec4(vec3(.93,.9,.77)*d*grain,alpha);}'});
  this.moon=new THREE.Mesh(new THREE.PlaneGeometry(6.5,6.5),moonMat);this.scene.add(this.moon);
  for(let i=0;i<9;i++){const bird=new THREE.Group();const mat=new THREE.MeshBasicMaterial({color:'#262d28',side:THREE.DoubleSide});for(const side of [-1,1]){const wing=new THREE.Mesh(new THREE.PlaneGeometry(.75,.12),mat);wing.position.x=side*.34;bird.add(wing);}bird.position.set(rng()*100-50,20+rng()*12,-35-rng()*45);bird.userData.seed=rng()*10;this.birds.push(bird);this.scene.add(bird);}
  const seen=new Set<THREE.Material>();this.scene.traverse(obj=>{if(obj instanceof THREE.Mesh){if(obj.material instanceof THREE.MeshStandardMaterial){obj.castShadow=true;obj.receiveShadow=true;if(!seen.has(obj.material)){seen.add(obj.material);this.wetMaterials.push({material:obj.material,color:obj.material.color.clone(),roughness:obj.material.roughness});}}}});
  this.resize=new ResizeObserver(()=>{const {width,height}=container.getBoundingClientRect();this.renderer.setSize(width,height);this.camera.aspect=width/Math.max(height,1);this.camera.fov=width<600?60:47;this.camera.updateProjectionMatrix();});this.resize.observe(container);
  window.addEventListener('pointermove',this.onPointer);document.addEventListener('visibilitychange',this.onVisibility);this.renderer.domElement.addEventListener('webglcontextlost',this.onLost);this.renderer.domElement.addEventListener('webglcontextrestored',this.onRestored);this.renderer.render(this.scene,this.camera);this.animate();
 }
 private random(seed:number){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
 private island(x:number,y:number,z:number,r:number,h:number,rng:()=>number,castle:boolean){
  const group=new THREE.Group();group.position.set(x,y,z);
  const stone=new THREE.MeshStandardMaterial({color:'#4a5448',roughness:.98,flatShading:true});
  const base=new THREE.Mesh(new THREE.ConeGeometry(r,h,14,3),stone);base.rotation.z=Math.PI;base.position.y=-h/2;group.add(base);
  const ground=new THREE.Mesh(new THREE.CylinderGeometry(r*.96,r,.85,18),new THREE.MeshStandardMaterial({color:'#536c3c',roughness:1}));group.add(ground);
  for(let i=0;i<28;i++){const a=rng()*6.28,d=Math.sqrt(rng())*r*.85;const tree=this.tree(.6+rng()*1.2,rng);tree.position.set(Math.cos(a)*d,.4,Math.sin(a)*d);group.add(tree);}
  for(let i=0;i<3;i++){const material=new THREE.MeshBasicMaterial({color:'#aad7d1',transparent:true,opacity:.45,side:THREE.DoubleSide});const fall=new THREE.Mesh(new THREE.PlaneGeometry(.35+rng()*.8,h+8,1,12),material);fall.position.set((i-1)*r*.45,-h/2-3,r*.9);fall.userData.seed=rng()*6;this.falls.push(fall);group.add(fall);}
  if(castle){for(let i=0;i<5;i++){const tower=new THREE.Group();const height=3+rng()*5;const wall=new THREE.Mesh(new THREE.CylinderGeometry(.7,1,height,8),new THREE.MeshStandardMaterial({color:'#b5ad94',roughness:.9}));wall.position.y=height/2;tower.add(wall);const roof=new THREE.Mesh(new THREE.ConeGeometry(1.2,2,8),new THREE.MeshStandardMaterial({color:'#3a5149',metalness:.2,roughness:.6}));roof.position.y=height+1;tower.add(roof);const lightMat=new THREE.MeshStandardMaterial({color:'#e8bd72',emissive:'#e9a94a',emissiveIntensity:1.5});const window=new THREE.Mesh(new THREE.PlaneGeometry(.25,.6),lightMat);window.position.set(0,height*.7,.87);tower.add(window);this.windows.push(lightMat);tower.position.set((i-2)*1.8,0,(rng()-.5)*3);group.add(tower);}}
  this.scene.add(group);
 }
 private tree(scale:number,rng:()=>number){const tree=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.2,2.4,5),new THREE.MeshStandardMaterial({color:'#4e412d'}));trunk.position.y=1.2;tree.add(trunk);const foliage=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.23+rng()*.09,.33,.19+rng()*.1),flatShading:true});for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.9+i*.08,1),foliage);crown.position.set((rng()-.5)*.6,1.7+i*.5,(rng()-.5)*.4);crown.scale.y=.8;tree.add(crown);}tree.scale.setScalar(scale);tree.userData.seed=rng()*10;tree.userData.mass=scale;this.trees.push(tree);return tree;}
 private batchVegetation(){
  this.scene.updateMatrixWorld(true);
  const materials=[new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,flatShading:true}),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,flatShading:true})];
  for(const material of materials)material.onBeforeCompile=shader=>{shader.uniforms.uTime=this.vegetationUniforms.time;shader.uniforms.uWind=this.vegetationUniforms.wind;shader.uniforms.uDirection=this.vegetationUniforms.direction;shader.vertexShader='uniform float uTime; uniform float uWind; uniform vec2 uDirection;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.xz += uDirection * (sin(uTime*.32 + instanceMatrix[3].x*.31 + instanceMatrix[3].z*.17)*.72 + sin(uTime*.11 + instanceMatrix[3].x*.08)*.28) * uWind * .021 * max(position.y + .5, 0.0);');};
  const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.1,.2,2.4,5),materials[0],this.trees.length);
  const crowns=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),materials[1],this.trees.length*3);
  this.trees.forEach((tree,index)=>{tree.children.forEach((child,i)=>{const mesh=child as THREE.Mesh;const target=i===0?trunks:crowns;const n=i===0?index:index*3+i-1;target.setMatrixAt(n,mesh.matrixWorld);target.setColorAt(n,(mesh.material as THREE.MeshStandardMaterial).color);mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();});tree.removeFromParent();});
  this.scene.add(trunks,crowns);this.trees=[];
 }
 setEnvironment(state:EnvironmentState){this.target={...state};this.ultimaFusao=0;}
 setActive(active:boolean){this.active=active;this.qualityControl.reset();}
 setFlashes(enabled:boolean){this.flashes=enabled;}
 private onPointer=(e:PointerEvent)=>{this.pointer={x:(e.clientX/innerWidth-.5),y:(e.clientY/innerHeight-.5)};};
 private onVisibility=()=>{cancelAnimationFrame(this.frame);this.paused=document.hidden;this.lastFrame=performance.now();this.storms.reset();if(!this.paused){this.clock.getDelta();this.animate();}};
 private onLost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(this.frame);this.container.dataset.status='lost';};
 private onRestored=()=>{delete this.container.dataset.status;this.onVisibility();};
 private animate=()=>{
  if(this.paused||this.disposed)return;this.frame=requestAnimationFrame(this.animate);const now=performance.now(),budget=this.reduced.matches?100:this.active?1000/30:1000/15,elapsed=now-this.lastFrame;if(elapsed<budget-1)return;this.lastFrame=now;const dt=Math.min(elapsed/1000,.25),t=this.clock.getElapsedTime();
  if(this.qualityControl.sample(elapsed,budget,this.reduced.matches)){this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.qualityControl.ratio));this.renderer.shadowMap.enabled=this.qualityControl.tier==='high';this.container.dataset.quality=this.qualityControl.tier;}
  const f=this.climate;if(now-this.ultimaFusao>=1000||this.ultimaFusao===0){this.ultimaFusao=now;this.atmosfera=combinarMeteorologia(this.target.fontes??[],Date.now());}
  stepEnvironment(f,this.target,dt,Date.now(),this.atmosfera);const day=f.daylight,cloud=f.clouds;
  this.cloudLayer.step(f,dt,this.reduced.matches?.1:1,this.qualityControl.particles);
  if(now-this.ultimaMascara>2000){
   this.ultimaMascara=now;const posicoes=this.stars.geometry.attributes.position,mascara=this.stars.geometry.attributes.visibilidade;
   for(let i=0;i<posicoes.count;i++)mascara.setX(i,1-this.cloudLayer.campo.ocultacao(posicoes.getX(i),posicoes.getY(i),posicoes.getZ(i),this.camera.position));mascara.needsUpdate=true;
   this.alvoSolar=this.cloudLayer.campo.ocultacao(this.sun.position.x*2,this.sun.position.y*2,this.sun.position.z*2,this.camera.position);
  }
  this.transmissaoSolar+=(this.alvoSolar-this.transmissaoSolar)*(1-Math.exp(-dt/5));
  const luz=transmissaoAtmosferica(f,this.transmissaoSolar);
  if(now-this.lastAstronomy>1000){this.lastAstronomy=now;this.renderer.shadowMap.needsUpdate=true;const date=new Date();const sun=SunCalc.getPosition(date,this.target.latitude,this.target.longitude);f.sunAltitude=sun.altitude;f.daylight=THREE.MathUtils.smoothstep(sun.altitude,-.16,.35);const twilight=1-Math.min(1,Math.abs(sun.altitude)*3);this.sun.position.set(-Math.sin(sun.azimuth)*100,Math.sin(sun.altitude)*100,Math.cos(sun.azimuth)*100);this.sun.color.setHSL(.1,.3+twilight*.35,.8);
   const moon=SunCalc.getMoonPosition(date,this.target.latitude,this.target.longitude),phase=SunCalc.getMoonIllumination(date);this.moon.position.set(-Math.sin(moon.azimuth)*150,Math.sin(moon.altitude)*150,Math.cos(moon.azimuth)*150);this.moon.lookAt(this.camera.position);this.moonLight.position.copy(this.moon.position);const mascaraLua=this.cloudLayer.campo.ocultacao(this.moon.position.x,this.moon.position.y,this.moon.position.z,this.camera.position);const noturna=transmissaoAtmosferica(f,mascaraLua).noturna;f.moonlight=(1-f.daylight)*phase.fraction*Math.max(0,Math.sin(moon.altitude))*noturna;const mat=this.moon.material as THREE.ShaderMaterial;mat.uniforms.phase.value=phase.phase;mat.uniforms.alpha.value=moon.altitude>-.05?(1-day*.8)*noturna:0;
   const skyMat=this.sky.material as THREE.ShaderMaterial;skyMat.uniforms.top.value.set('#111c31').lerp(this.colors[0],day).lerp(this.colors[1],cloud*.7);skyMat.uniforms.bottom.value.set('#39445c').lerp(this.colors[2],day).lerp(this.colors[3],twilight*.35);(this.scene.fog as THREE.FogExp2).color.copy(skyMat.uniforms.bottom.value);this.container.style.setProperty('--daylight',String(day));this.container.dataset.weather=f.rain>.6?'heavy-rain':f.rain>.005?'rain':f.chuvaDistante>.005?'nearby-rain':f.clouds>.75?'overcast':f.clouds>.3?'partly-cloudy':'clear';this.container.dataset.geometries=String(this.renderer.info.memory.geometries);this.container.dataset.drawCalls=String(this.renderer.info.render.calls);this.container.dataset.quality=this.qualityControl.tier;
  }
  const flash=this.storms.step(dt,f.storm,this.flashes,this.reduced.matches,this.onThunder);this.sun.intensity=day*2.15*luz.direta;this.ambient.intensity=.42+day*1.05*luz.difusa+flash;this.renderer.toneMappingExposure=.96+day*.16;this.moonLight.intensity=f.moonlight*.8;(this.scene.fog as THREE.FogExp2).density=f.fog;(this.stars.material as THREE.PointsMaterial).opacity=(1-day)*(.72-f.moonlight*.32)*(.965+Math.sin(t*.13)*.035);
  const motion=this.reduced.matches?.1:1,wind=.1+f.ventoEfetivo/35;this.vegetationUniforms.time.value=t*motion;this.vegetationUniforms.wind.value+=(wind*motion-this.vegetationUniforms.wind.value)*(1-Math.exp(-dt/3));this.vegetationUniforms.direction.value.set(-Math.sin(f.direction*Math.PI/180),-Math.cos(f.direction*Math.PI/180));
  this.effects.step(f,dt,motion,this.qualityControl.particles,this.cloudLayer.campo.celulas);
  this.neblina.avancar(f,dt,motion,this.qualityControl.particles);
  if(now-this.lastAstronomy<dt*1000+2){this.container.dataset.chuva=String(f.rain);this.container.dataset.situacao=this.atmosfera.situacao;this.container.dataset.massas=String(this.cloudLayer.campo.massas.length);}
  for(const {material,color,roughness} of this.wetMaterials){material.color.copy(color).multiplyScalar(1-f.wetness*.23);material.roughness=Math.max(.18,roughness-f.wetness*.45);}
  for(const fall of this.falls){fall.scale.x=(.92+f.runoff*.7+Math.sin(t*1.7+fall.userData.seed)*.025*motion);(fall.material as THREE.MeshBasicMaterial).opacity=.18+day*.2+f.runoff*.09+Math.sin(t*1.9+fall.userData.seed)*.015*motion;fall.rotation.z=Math.sin(f.direction*Math.PI/180)*f.wind*.0005;}
  for(let i=0;i<this.birds.length;i++){const bird=this.birds[i];bird.visible=i<f.birdActivity*this.birds.length;if(!bird.visible)continue;bird.position.x+=dt*(.72+f.wind*.012)*motion;if(bird.position.x>70)bird.position.x=-70;for(let j=0;j<bird.children.length;j++)bird.children[j].rotation.z=Math.sin(t*3.2+bird.userData.seed)*.3*(j?1:-1)*motion;}
  const water=this.water.material as THREE.ShaderMaterial;water.uniforms.time.value=t*motion;water.uniforms.light.value=day+f.moonlight*.25;water.uniforms.wind.value=wind;water.uniforms.rain.value=f.rain;
  for(let i=0;i<this.windows.length;i++){const material=this.windows[i];material.emissiveIntensity=((1-day)*(1.75+Math.sin(t*.17+i*.83)*.06)+.08)*(1-f.condensacao*.3);material.roughness=.55+f.condensacao*.4;}
  if(!this.reduced.matches){this.camera.position.x=THREE.MathUtils.lerp(this.camera.position.x,2+this.pointer.x*.18,.012);this.camera.position.y=THREE.MathUtils.lerp(this.camera.position.y,15-this.pointer.y*.09,.012);}
  this.diagnostico?.atualizar(f);this.onClimate(f);this.renderer.render(this.scene,this.camera);
 }
 dispose(){this.disposed=true;this.diagnostico?.descartar();cancelAnimationFrame(this.frame);this.resize.disconnect();window.removeEventListener('pointermove',this.onPointer);document.removeEventListener('visibilitychange',this.onVisibility);this.scene.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.Points||obj instanceof THREE.LineSegments){obj.geometry.dispose();for(const m of Array.isArray(obj.material)?obj.material:[obj.material])m.dispose();}});this.renderer.domElement.removeEventListener("webglcontextlost",this.onLost);this.renderer.domElement.removeEventListener("webglcontextrestored",this.onRestored);this.renderer.dispose();this.container.replaceChildren();}
}
