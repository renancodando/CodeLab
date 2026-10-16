import fs from 'node:fs';
function trocar(arquivo,antes,depois){const texto=fs.readFileSync(arquivo,'utf8');if(!texto.includes(antes))throw Error('Âncora ausente: '+arquivo);fs.writeFileSync(arquivo,texto.replace(antes,depois));}
trocar('src/learning/adaptive.ts','preparacaoAteBloco?:number};','preparacaoAteBloco?:number;ordem?:number};');
trocar('src/learning/adaptive.ts','if(activity.requiredConcepts!==undefined&&','if(activity.ordem!==undefined&&!count(activity.ordem,0,10000))return false;\n  if(activity.requiredConcepts!==undefined&&');
trocar('src/learning/adaptive.ts',"&&!used.has(activity.id))[0];\n if(concept)","&&!used.has(activity.id)).sort((a,b)=>(a.ordem??10001)-(b.ordem??10001)||compare(a.id,b.id))[0];\n if(concept)");
trocar('src/learning/hub-catalog.ts',"activities.push({id:lessonConceptId(id),title:l.title,kind:'concept'", "const ordem=lessons.findIndex(aula=>aula.id===id)*2;\n activities.push({ordem,id:lessonConceptId(id),title:l.title,kind:'concept'");
trocar('src/learning/hub-catalog.ts',"activities.push({id:idPreparacao(id),title:'Preparação: '","activities.push({ordem:ordem+1,id:idPreparacao(id),title:'Preparação: '");
fs.copyFileSync('../../outputs/ordem-diaria.test.ts','tests/unit/ordem-diaria.test.ts');
