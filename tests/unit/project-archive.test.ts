import {it,expect} from 'vitest';
import {createProjectArchive,crc32} from '../../src/learning/project-archive';
it('exporta arquivos UTF-8 e diretório central com checksum consistente',()=>{
 expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
 const buffer=createProjectArchive({'src/main.py':'print("ação")\n','README.md':'Projeto original'}),view=new DataView(buffer),bytes=new Uint8Array(buffer),decoder=new TextDecoder();
 const end=buffer.byteLength-22;expect(view.getUint32(end,true)).toBe(0x06054b50);expect(view.getUint16(end+10,true)).toBe(2);
 let directory=view.getUint32(end+16,true);const extracted:Record<string,string>={};
 for(let n=0;n<2;n++){
  expect(view.getUint32(directory,true)).toBe(0x02014b50);const local=view.getUint32(directory+42,true),nameSize=view.getUint16(local+26,true),size=view.getUint32(local+18,true);
  expect(view.getUint32(local,true)).toBe(0x04034b50);expect(view.getUint16(local+6,true)).toBe(0x800);
  const name=decoder.decode(bytes.slice(local+30,local+30+nameSize)),data=bytes.slice(local+30+nameSize,local+30+nameSize+size);
  expect(crc32(data)).toBe(view.getUint32(local+14,true));extracted[name]=decoder.decode(data);directory+=46+view.getUint16(directory+28,true);
 }
 expect(extracted).toEqual({'src/main.py':'print("ação")\n','README.md':'Projeto original'});
});
