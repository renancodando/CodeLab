import * as THREE from 'three';
import type {AmbientFrame} from './simulation';
export class Neblina {
 readonly grupo=new THREE.Group();
 private faixas:THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>[]=[];
 private deriva=new THREE.Vector2();
 constructor(){
  const geometria=new THREE.PlaneGeometry(1,1);
  for(let i=0;i<4;i++){
   const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{deriva:{value:this.deriva},forca:{value:0},semente:{value:i*19.31},dia:{value:1}},
    vertexShader:'varying vec2 ponto;void main(){ponto=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 ponto;uniform vec2 deriva;uniform float forca;uniform float semente;uniform float dia;void main(){vec2 p=ponto*2.-1.;float borda=pow(max(0.,1.-dot(p,p)),2.);float ondas=.65+.2*sin(p.x*8.+deriva.x+semente)*sin(p.y*5.+deriva.y)+.15*sin(p.x*17.+p.y*6.+semente);gl_FragColor=vec4(mix(vec3(.15,.2,.26),vec3(.65,.72,.72),dia),borda*ondas*forca);}'});
   const faixa=new THREE.Mesh(geometria,material);faixa.position.set((i%2?1:-1)*18,3+i*2,-15-i*28);faixa.scale.set(130+i*25,13+i*4,1);this.grupo.add(faixa);this.faixas.push(faixa);
  }
 }
 avancar(estado:AmbientFrame,dt:number,movimento:number,qualidade:number){
  const angulo=estado.direction*Math.PI/180;this.deriva.x-=Math.sin(angulo)*estado.ventoEfetivo*dt*.002*movimento;this.deriva.y-=Math.cos(angulo)*estado.ventoEfetivo*dt*.001*movimento;
  const forca=Math.max(0,Math.min(.35,(estado.fog-.002)*24));
  for(let i=0;i<this.faixas.length;i++){const faixa=this.faixas[i];faixa.visible=forca>.002&&i<(qualidade>.8?4:qualidade>.4?3:2);faixa.material.uniforms.forca.value=forca;faixa.material.uniforms.dia.value=estado.daylight;}
 }
}
