import * as THREE from 'three';
import type { AmbientFrame } from './simulation';
export class Clouds {
 readonly group=new THREE.Group();
 private material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{storm:{value:0},day:{value:1},cover:{value:.2}},vertexShader:'varying vec2 uvp;void main(){uvp=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 uvp;uniform float storm;uniform float day;uniform float cover;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
 void main(){vec2 p=uvp*2.-1.;float n=noise(uvp*6.)*.55+noise(uvp*15.)*.3+noise(uvp*33.)*.15;float a=smoothstep(.0,.55,1.-dot(p,p))*smoothstep(.18,.7,n)*(.25+cover*.7);vec3 c=mix(vec3(.85,.86,.85),vec3(.22,.27,.33),storm);c*=.35+day*.65;c*=.65+n*.35;gl_FragColor=vec4(c,a);}`});
 constructor(random:()=>number){const geometry=new THREE.PlaneGeometry(1,1);for(let i=0;i<22;i++){const cloud=new THREE.Mesh(geometry,this.material);cloud.position.set((random()-.5)*240,25+random()*28,-30-random()*135);cloud.scale.set(24+random()*32,7+random()*12,1);cloud.rotation.z=(random()-.5)*.12;cloud.userData.speed=.35+random()*.55;this.group.add(cloud);}}
 step(state:AmbientFrame,dt:number,motion:number){this.material.uniforms.storm.value=state.storm*.7+state.clouds*.3;this.material.uniforms.day.value=state.daylight;this.material.uniforms.cover.value=state.clouds;const a=state.direction*Math.PI/180;for(let i=0;i<this.group.children.length;i++){const cloud=this.group.children[i];cloud.visible=i<3+state.clouds*19;cloud.position.x-=Math.sin(a)*dt*(.2+state.wind/30)*cloud.userData.speed*motion;cloud.position.z-=Math.cos(a)*dt*(.2+state.wind/30)*cloud.userData.speed*motion;if(cloud.position.x>125)cloud.position.x=-125;if(cloud.position.x< -125)cloud.position.x=125;if(cloud.position.z> -25)cloud.position.z=-160;if(cloud.position.z< -165)cloud.position.z=-30;}}
}
