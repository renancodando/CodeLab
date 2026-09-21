import * as THREE from 'three';
import SunCalc from 'suncalc';
import type { EnvironmentState } from '../types';
import { defaultEnvironment } from './weather';

export class LivingWorld {
 private renderer:THREE.WebGLRenderer;
 private scene=new THREE.Scene();
 private camera=new THREE.PerspectiveCamera(47,1,.1,500);
 private target={...defaultEnvironment};
 private current={...defaultEnvironment};
 private clock=new THREE.Clock();
 private frame=0;
 private resize:ResizeObserver;
 private trees:THREE.Group[]=[];
 private clouds:THREE.Group[]=[];
 private falls:THREE.Mesh[]=[];
 private birds:THREE.Group[]=[];
 private windows:THREE.MeshStandardMaterial[]=[];
 private sun=new THREE.DirectionalLight('#ffd8a0',3);
 private ambient=new THREE.HemisphereLight('#b1c5da','#343a25',1.8);
 private sky:THREE.Mesh;
 private water:THREE.Mesh;
 private stars:THREE.Points;
 private rain:THREE.Points;
 private moon:THREE.Mesh;
 private pointer={x:0,y:0};
 private reduced=matchMedia('(prefers-reduced-motion: reduce)');
 private moonLight=new THREE.DirectionalLight('#95b2db',.5);
 private frames=0;
 private elapsed=0;
 private quality=1.5;
 private paused=false;
 private active=true;
 private disposed=false;
 private wetness=0;
 private lastFrame=0;
 private vegetationUniforms={time:{value:0},wind:{value:1}};
 constructor(private container:HTMLElement) {
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
  container.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-hidden','true');
  this.scene.fog=new THREE.FogExp2('#748f9d',.006);
  this.camera.position.set(2,15,48);this.camera.lookAt(-7,10,-28);
  this.scene.add(this.ambient,this.sun,this.moonLight);
  const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{top:{value:new THREE.Color('#779eac')},bottom:{value:new THREE.Color('#e5b791')}},vertexShader:'varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',fragmentShader:'varying vec3 vPos; uniform vec3 top; uniform vec3 bottom; void main(){float h=normalize(vPos).y; gl_FragColor=vec4(mix(bottom,top,smoothstep(-0.1,0.65,h)),1.0);}'});
  this.sky=new THREE.Mesh(new THREE.SphereGeometry(220,32,16),skyMaterial);this.scene.add(this.sky);
  const waterMaterial=new THREE.ShaderMaterial({transparent:true,uniforms:{time:{value:0},light:{value:1},wind:{value:1}},vertexShader:'varying vec3 p; uniform float time; uniform float wind; void main(){ p=position; vec3 q=position; q.z+=sin(q.x*0.35+time)*0.13+sin(q.y*0.22+time*0.7)*0.2; gl_Position=projectionMatrix*modelViewMatrix*vec4(q,1.0); }',fragmentShader:'varying vec3 p; uniform float time; uniform float light; uniform float wind; void main(){float wave=sin(p.x*.8+time*.7+sin(p.y*.5+time*.3))*sin(p.y*.4+time*.5); vec3 c=mix(vec3(.075,.18,.21),vec3(.38,.58,.58),smoothstep(.35,1.,wave)); float glow=pow(max(0.,sin(p.x*.15+time*.1)),20.)*.2;gl_FragColor=vec4(c*(.35+light*.65)+glow,.95);}'});
  this.water=new THREE.Mesh(new THREE.PlaneGeometry(400,400,60,60),waterMaterial);this.water.rotation.x=-Math.PI/2;this.water.position.y=-7;this.scene.add(this.water);
  const rng=this.random(414);
  for(let i=0;i<16;i++) {const x=(rng()-.5)*240,z=-70-rng()*110;const mountain=new THREE.Mesh(new THREE.ConeGeometry(12+rng()*15,20+rng()*35,5),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.48,.14,.26+rng()*.15),flatShading:true}));mountain.position.set(x,0,z);this.scene.add(mountain);}
  this.island(-25,5,-38,12,17,rng,true);
  this.island(7,13,-63,8,13,rng,true);
  this.island(-2,0,-17,11,14,rng,false);
  this.island(-46,0,-80,15,25,rng,true);
  this.island(32,2,-46,15,18,rng,false);
  this.batchVegetation();
  for(let i=0;i<24;i++){const group=new THREE.Group();const mat=new THREE.MeshStandardMaterial({color:'#d7d3c8',transparent:true,opacity:.48,roughness:1,depthWrite:false});for(let j=0;j<4;j++){const cloud=new THREE.Mesh(new THREE.SphereGeometry(3+rng()*4,8,6),mat);cloud.scale.set(1.8,.28,1);cloud.position.set(j*4,rng(),rng()*3);group.add(cloud);}group.position.set((rng()-.5)*200,29+rng()*25,-50-rng()*100);group.userData.speed=.3+rng()*.4;this.clouds.push(group);this.scene.add(group);}
  const starPositions=new Float32Array(1000*3);for(let i=0;i<1000;i++){const phi=rng()*Math.PI*2,theta=rng()*Math.PI*.48;starPositions[i*3]=Math.sin(theta)*Math.cos(phi)*190;starPositions[i*3+1]=Math.cos(theta)*190;starPositions[i*3+2]=Math.sin(theta)*Math.sin(phi)*190;}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));this.stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:'#fff5d8',size:.27,transparent:true,opacity:0,depthWrite:false}));this.scene.add(this.stars);
  const rainPositions=new Float32Array(700*3);for(let i=0;i<700;i++){rainPositions[i*3]=(rng()-.5)*90;rainPositions[i*3+1]=rng()*70;rainPositions[i*3+2]=-rng()*100;}const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));this.rain=new THREE.Points(rainGeometry,new THREE.PointsMaterial({color:'#c4dbe1',size:.09,transparent:true,opacity:0}));this.scene.add(this.rain);
  const moonMat=new THREE.ShaderMaterial({transparent:true,uniforms:{phase:{value:.5},alpha:{value:1}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float phase;uniform float alpha;void main(){vec2 p=vUv*2.-1.;float r=dot(p,p);if(r>1.)discard;vec3 n=vec3(p,sqrt(1.-r));float a=phase*6.2831853;vec3 light=vec3(sin(a),0.,-cos(a));float d=max(.025,dot(n,light));float grain=.93+.07*sin(p.x*64.)*sin(p.y*53.);gl_FragColor=vec4(vec3(.93,.9,.77)*d*grain,alpha);}'});
  this.moon=new THREE.Mesh(new THREE.PlaneGeometry(8,8),moonMat);this.scene.add(this.moon);
  for(let i=0;i<9;i++){const bird=new THREE.Group();const mat=new THREE.MeshBasicMaterial({color:'#262d28',side:THREE.DoubleSide});for(const side of [-1,1]){const wing=new THREE.Mesh(new THREE.PlaneGeometry(.75,.12),mat);wing.position.x=side*.34;bird.add(wing);}bird.position.set(rng()*100-50,20+rng()*12,-35-rng()*45);bird.userData.seed=rng()*10;this.birds.push(bird);this.scene.add(bird);}
  this.resize=new ResizeObserver(()=>{const {width,height}=container.getBoundingClientRect();this.renderer.setSize(width,height);this.camera.aspect=width/Math.max(height,1);this.camera.fov=width<600?60:47;this.camera.updateProjectionMatrix();});this.resize.observe(container);
  window.addEventListener('pointermove',this.onPointer);document.addEventListener('visibilitychange',this.onVisibility);this.renderer.domElement.addEventListener('webglcontextlost',this.onLost);this.renderer.domElement.addEventListener('webglcontextrestored',this.onRestored);this.animate();
 }
 private random(seed:number){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
 private island(x:number,y:number,z:number,r:number,h:number,rng:()=>number,castle:boolean){
  const group=new THREE.Group();group.position.set(x,y,z);
  const stone=new THREE.MeshStandardMaterial({color:'#4a5448',roughness:.98,flatShading:true});
  const base=new THREE.Mesh(new THREE.ConeGeometry(r,h,9,2),stone);base.rotation.z=Math.PI;base.position.y=-h/2;group.add(base);
  const ground=new THREE.Mesh(new THREE.CylinderGeometry(r*.96,r,.85,12),new THREE.MeshStandardMaterial({color:'#536c3c',roughness:1}));group.add(ground);
  for(let i=0;i<28;i++){const a=rng()*6.28,d=Math.sqrt(rng())*r*.85;const tree=this.tree(.6+rng()*1.2,rng);tree.position.set(Math.cos(a)*d,.4,Math.sin(a)*d);group.add(tree);}
  for(let i=0;i<3;i++){const material=new THREE.MeshBasicMaterial({color:'#aad7d1',transparent:true,opacity:.45,side:THREE.DoubleSide});const fall=new THREE.Mesh(new THREE.PlaneGeometry(.35+rng()*.8,h+8,1,12),material);fall.position.set((i-1)*r*.45,-h/2-3,r*.9);fall.userData.seed=rng()*6;this.falls.push(fall);group.add(fall);}
  if(castle){for(let i=0;i<5;i++){const tower=new THREE.Group();const height=3+rng()*5;const wall=new THREE.Mesh(new THREE.CylinderGeometry(.7,1,height,8),new THREE.MeshStandardMaterial({color:'#b5ad94',roughness:.9}));wall.position.y=height/2;tower.add(wall);const roof=new THREE.Mesh(new THREE.ConeGeometry(1.2,2,8),new THREE.MeshStandardMaterial({color:'#3a5149',metalness:.2,roughness:.6}));roof.position.y=height+1;tower.add(roof);const lightMat=new THREE.MeshStandardMaterial({color:'#e8bd72',emissive:'#e9a94a',emissiveIntensity:1.5});const window=new THREE.Mesh(new THREE.PlaneGeometry(.25,.6),lightMat);window.position.set(0,height*.7,.87);tower.add(window);this.windows.push(lightMat);tower.position.set((i-2)*1.8,0,(rng()-.5)*3);group.add(tower);}}
  this.scene.add(group);
 }
 private tree(scale:number,rng:()=>number){const tree=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.2,2.4,5),new THREE.MeshStandardMaterial({color:'#4e412d'}));trunk.position.y=1.2;tree.add(trunk);const foliage=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.23+rng()*.09,.33,.19+rng()*.1),flatShading:true});for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.9+i*.08,1),foliage);crown.position.set((rng()-.5)*.6,1.7+i*.5,(rng()-.5)*.4);crown.scale.y=.8;tree.add(crown);}tree.scale.setScalar(scale);tree.userData.seed=rng()*10;tree.userData.mass=scale;this.trees.push(tree);return tree;}
 private batchVegetation(){
  this.scene.updateMatrixWorld(true);
  const materials=[new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,flatShading:true}),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,flatShading:true})];
  for(const material of materials)material.onBeforeCompile=shader=>{shader.uniforms.uTime=this.vegetationUniforms.time;shader.uniforms.uWind=this.vegetationUniforms.wind;shader.vertexShader='uniform float uTime; uniform float uWind;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += sin(uTime * 0.7 + instanceMatrix[3].x * 0.43 + instanceMatrix[3].z * 0.2) * uWind * 0.055 * max(position.y + 0.5, 0.0);');};
  const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.1,.2,2.4,5),materials[0],this.trees.length);
  const crowns=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),materials[1],this.trees.length*3);
  this.trees.forEach((tree,index)=>{tree.children.forEach((child,i)=>{const mesh=child as THREE.Mesh;const target=i===0?trunks:crowns;const n=i===0?index:index*3+i-1;target.setMatrixAt(n,mesh.matrixWorld);target.setColorAt(n,(mesh.material as THREE.MeshStandardMaterial).color);mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();});tree.removeFromParent();});
  this.scene.add(trunks,crowns);this.trees=[];
 }
 setEnvironment(state:EnvironmentState){this.target={...state};}
 setActive(active:boolean){this.active=active;this.onVisibility();}
 private onPointer=(e:PointerEvent)=>{this.pointer={x:(e.clientX/innerWidth-.5),y:(e.clientY/innerHeight-.5)};};
 private onVisibility=()=>{cancelAnimationFrame(this.frame);this.paused=document.hidden||!this.active;if(!this.paused){this.clock.getDelta();this.animate();}};
 private onLost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(this.frame);this.container.dataset.status='lost';};
 private onRestored=()=>{delete this.container.dataset.status;this.animate();};
 private animate=()=>{
  if(this.paused||this.disposed)return;this.frame=requestAnimationFrame(this.animate);const now=performance.now();if(now-this.lastFrame<(this.reduced.matches?100:33))return;this.lastFrame=now;const dt=Math.min(this.clock.getDelta(),.1),t=this.clock.elapsedTime;
  const mix=1-Math.exp(-dt*.22);for(const key of ['wind','gust','direction','rain','clouds','temperature'] as const)this.current[key]=THREE.MathUtils.lerp(this.current[key],this.target[key],mix);
  this.wetness=THREE.MathUtils.lerp(this.wetness,Math.min(this.current.rain/2,1),1-Math.exp(-dt*(this.current.rain>0?.05:.008)));
  const sun=SunCalc.getPosition(new Date(),this.target.latitude,this.target.longitude);const day=THREE.MathUtils.smoothstep(sun.altitude,-.16,.35);const twilight=1-Math.min(1,Math.abs(sun.altitude)*3);const cloud=this.current.clouds/100;
  this.sun.position.set(-Math.sin(sun.azimuth)*100,Math.sin(sun.altitude)*100,Math.cos(sun.azimuth)*100);this.sun.intensity=day*(2.6-cloud*1.8);this.sun.color.setHSL(.1,.3+twilight*.35,.8);
  this.ambient.intensity=.5+day*1.3;this.moonLight.position.set(-40,30,-30);this.moonLight.intensity=(1-day)*.8;
  const skyMat=this.sky.material as THREE.ShaderMaterial;skyMat.uniforms.top.value.set('#111c31').lerp(new THREE.Color('#74a4b4'),day).lerp(new THREE.Color('#6c7d84'),cloud*.5);skyMat.uniforms.bottom.value.set('#39445c').lerp(new THREE.Color('#d5c7a1'),day).lerp(new THREE.Color('#c58e77'),twilight*.35);
  (this.scene.fog as THREE.FogExp2).color.copy(skyMat.uniforms.bottom.value);(this.scene.fog as THREE.FogExp2).density=.004+cloud*.002+Math.min(this.current.rain,.5)*.004;
  (this.stars.material as THREE.PointsMaterial).opacity=(1-day)*(1-cloud)*.75;
  const moon=SunCalc.getMoonPosition(new Date(),this.target.latitude,this.target.longitude),phase=SunCalc.getMoonIllumination(new Date());this.moon.position.set(-Math.sin(moon.azimuth)*150,Math.sin(moon.altitude)*150,Math.cos(moon.azimuth)*150);this.moon.lookAt(this.camera.position);const moonMat=this.moon.material as THREE.ShaderMaterial;moonMat.uniforms.phase.value=phase.phase;moonMat.uniforms.alpha.value=(1-day*.8)*(1-cloud*.85);
  const motion=this.reduced.matches?.12:1;const wind=.1+this.current.wind/35;const gust=Math.sin(t*.43)*Math.sin(t*.17)*this.current.gust/90;
  this.vegetationUniforms.time.value=t*motion;this.vegetationUniforms.wind.value=(wind+gust)*motion;
  for(const tree of this.trees){const seed=tree.userData.seed;tree.rotation.z=(Math.sin(t*.8+seed)+Math.sin(t*1.13+seed*2)*.25)*.035*(wind+gust)*motion/tree.userData.mass;tree.rotation.x=Math.sin(t*.59+seed)*.016*wind*motion;}
  for(const cloud of this.clouds){cloud.position.x+=dt*(.15+wind)*cloud.userData.speed*motion;if(cloud.position.x>130)cloud.position.x=-130;cloud.visible=this.clouds.indexOf(cloud)<4+this.current.clouds*.2;}
  for(const fall of this.falls){fall.scale.x=.9+Math.sin(t*3+fall.userData.seed)*.1*motion;(fall.material as THREE.MeshBasicMaterial).opacity=.2+day*.22+Math.sin(t*5+fall.userData.seed)*.05*motion;}
  for(const bird of this.birds){bird.position.x+=dt*1.5*motion;if(bird.position.x>70)bird.position.x=-70;bird.children.forEach((wing,i)=>wing.rotation.z=Math.sin(t*5+bird.userData.seed)*.65*(i?1:-1)*motion);bird.visible=day>.2;}
  const water=this.water.material as THREE.ShaderMaterial;water.uniforms.time.value=t*motion;water.uniforms.light.value=day;water.uniforms.wind.value=wind;
  (this.rain.material as THREE.PointsMaterial).opacity=Math.min(.65,this.current.rain*.2)*motion;const positions=this.rain.geometry.attributes.position;const angle=this.current.direction*Math.PI/180;for(let i=0;i<positions.count;i++){let y=positions.getY(i)-dt*(12+i%8)*motion;if(y< -8)y=60;positions.setY(i,y);positions.setX(i,((positions.getX(i)+dt*Math.sin(angle)*wind+45)%90)-45);}positions.needsUpdate=true;
  for(const material of this.windows)material.emissiveIntensity=(1-day)*2.5+.1;
  if(!this.reduced.matches){this.camera.position.x=THREE.MathUtils.lerp(this.camera.position.x,2+this.pointer.x*.6,.02);this.camera.position.y=THREE.MathUtils.lerp(this.camera.position.y,15-this.pointer.y*.3,.02);}
  this.container.style.setProperty('--daylight',String(day));this.container.dataset.weather=this.current.rain>.1?'rain':'clear';this.renderer.render(this.scene,this.camera);
  this.frames++;this.elapsed+=dt;if(this.elapsed>4){const fps=this.frames/this.elapsed;if(fps<34 && this.quality> .75){this.quality-=.25;this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.quality));}this.frames=0;this.elapsed=0;}
 }
 dispose(){this.disposed=true;cancelAnimationFrame(this.frame);this.resize.disconnect();window.removeEventListener('pointermove',this.onPointer);document.removeEventListener('visibilitychange',this.onVisibility);this.scene.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.Points){obj.geometry.dispose();for(const m of Array.isArray(obj.material)?obj.material:[obj.material])m.dispose();}});this.renderer.dispose();this.container.replaceChildren();}
}
