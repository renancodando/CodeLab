import {validProjectPath} from './projects';
const encoder=new TextEncoder();
export function crc32(bytes:Uint8Array):number{let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let n=0;n<8;n++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return(crc^0xffffffff)>>>0;}
/** ZIP stored entries, UTF-8 names, fixed DOS epoch; no execution or filesystem access. */
export function createProjectArchive(files:Record<string,string>):ArrayBuffer{
 if(Object.keys(files).some(path=>!validProjectPath(path)))throw new Error('Nome de arquivo inválido para exportação.');
 const entries=Object.entries(files).map(([path,text])=>({name:encoder.encode(path),data:encoder.encode(text)}));
 if(entries.length>64)throw new Error('Arquivos demais para exportar.');
 const total=entries.reduce((sum,e)=>sum+30+e.name.length+e.data.length+46+e.name.length,22);
 if(total>8_000_000)throw new Error('O projeto é grande demais para exportar neste formato.');
 const buffer=new ArrayBuffer(total),bytes=new Uint8Array(buffer),view=new DataView(buffer);let offset=0;
 const u16=(v:number)=>{view.setUint16(offset,v,true);offset+=2;},u32=(v:number)=>{view.setUint32(offset,v,true);offset+=4;};
 const append=(v:Uint8Array)=>{bytes.set(v,offset);offset+=v.length;};
 const records:{name:Uint8Array;size:number;crc:number;at:number}[]=[];
 for(const entry of entries){
  const at=offset,size=entry.data.length,crc=crc32(entry.data);records.push({name:entry.name,size,crc,at});
  u32(0x04034b50);u16(20);u16(0x800);u16(0);u16(0);u16(0x21);u32(crc);u32(size);u32(size);u16(entry.name.length);u16(0);append(entry.name);append(entry.data);
 }
 const directory=offset;
 for(const record of records){
  u32(0x02014b50);u16(20);u16(20);u16(0x800);u16(0);u16(0);u16(0x21);u32(record.crc);u32(record.size);u32(record.size);u16(record.name.length);u16(0);u16(0);u16(0);u16(0);u32(0);u32(record.at);append(record.name);
 }
 const length=offset-directory;
 u32(0x06054b50);u16(0);u16(0);u16(records.length);u16(records.length);u32(length);u32(directory);u16(0);
 return buffer;
}
