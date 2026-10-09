import * as THREE from 'three';
import type {AmbientFrame} from './simulation';
import {CampoNuvens} from './meteorologia/campo-nuvens';
export class Clouds {
 readonly group=new THREE.Group();
 readonly campo=new CampoNuvens();
 private malhas:THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>[]=[];
 private tempo=0;
 constructor(_random:()=>number){
  const geometria=new THREE.PlaneGeometry(1,1);
  for(const massa of this.campo.massas){
   const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{semente:{value:massa.semente},densidade:{value:0},dia:{value:1},camada:{value:massa.camada},tempo:{value:0},chuva:{value:0},qualidade:{value:1}},
    vertexShader:'varying vec2 ponto;void main(){ponto=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec2 ponto;uniform float semente;uniform float densidade;uniform float dia;uniform float camada;uniform float tempo;uniform float chuva;uniform float qualidade;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+semente)*43758.5453);}
float ruido(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
void main(){vec2 p=ponto*2.-1.;vec2 deriva=vec2(tempo*.002,semente*.03);float n=ruido(ponto*5.+deriva)*.57+ruido(ponto*12.+deriva)*.3;n+=qualidade>.45?ruido(ponto*27.)*.13:.065;
float borda=smoothstep(0.,.65,1.-dot(p,p)+.22*(n-.5));float a=borda*smoothstep(.13,.7,n)*densidade*(camada>1.5?.43:.94);
vec3 cor=mix(vec3(.85,.87,.86),vec3(.31,.35,.38),densidade*(camada<.5?.65:.25)+chuva*.2);cor*=.35+dia*.65;gl_FragColor=vec4(cor*(.8+n*.2),a);}`});
   const malha=new THREE.Mesh(geometria,material);this.malhas.push(malha);this.group.add(malha);
  }
 }
 step(estado:AmbientFrame,dt:number,movimento:number,qualidade=1){
  this.tempo+=dt*movimento;this.campo.avancar(estado,dt,movimento);
  for(let i=0;i<this.malhas.length;i++){
   const massa=this.campo.massas[i],malha=this.malhas[i],uniformes=malha.material.uniforms;
   const nascimento=Math.min(1,massa.idade/90);malha.position.set(massa.x,massa.y,massa.z);malha.scale.set(massa.largura*(.65+nascimento*.35),massa.altura,1);
   uniformes.semente.value=massa.semente;uniformes.densidade.value=massa.densidade;uniformes.dia.value=estado.daylight;uniformes.tempo.value=this.tempo;uniformes.chuva.value=estado.rain;uniformes.qualidade.value=qualidade;
   malha.visible=massa.densidade>.006;
   uniformes.camada.value=massa.camada;
  }
 }
}
