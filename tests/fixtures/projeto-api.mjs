import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {strict as assert} from 'node:assert';

export async function verificarProjetoApi(raiz,atividades,obterSolucao){
 const previsao=atividades.find(a=>a.id==='api-prever-transacao'),diagnostico=atividades.find(a=>a.id==='api-vincular-parametro');
 assert(previsao&&diagnostico);
 const pasta=join(raiz,'projeto-api-sqlite');await mkdir(pasta);
 await writeFile(join(pasta,'Referencias.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><ImplicitUsings>enable</ImplicitUsings><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup><ItemGroup><PackageReference Include="Microsoft.Data.Sqlite" Version="10.0.10" /><PackageReference Include="SQLitePCLRaw.lib.e_sqlite3" Version="3.53.3" /></ItemGroup></Project>');
 const linha='comando.Parameters.AddWithValue("$nome", "");';assert(diagnostico.code.includes(linha));
 const opcoes=diagnostico.options;assert.equal(opcoes.find(o=>o.id==='vincular').text,obterSolucao(diagnostico.id));
 const funcoes=opcoes.map((opcao,indice)=>`static string[] Buscar${indice}(SqliteConnection conexao,string entrada){
${diagnostico.code.replace(linha,opcao.text)}
 var encontrados=new List<string>();while(leitor.Read())encontrados.Add(leitor.GetString(0));return encontrados.ToArray();
}`).join('\n');
 const entradas=['Lápis','Caderno',"D'Água","x' OR 1=1 --",'', 'caderno'];
 const codigo=`using Microsoft.Data.Sqlite;
using System.Text.Json;
var arquivo=args[0];var modo=args[1];
using var conexao=new SqliteConnection(new SqliteConnectionStringBuilder {DataSource=arquivo,Pooling=false}.ToString());
conexao.Open();
if(conexao.ServerVersion!="3.53.3")throw new InvalidOperationException("Biblioteca SQLite divergente da referência fixada");
using(var esquema=conexao.CreateCommand()){esquema.CommandText="CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);";esquema.ExecuteNonQuery();}
if(modo=="transacao"){
${previsao.code}
}else if(modo=="ler"){
 using var contar=conexao.CreateCommand();contar.CommandText="SELECT COUNT(*) FROM produtos;";Console.WriteLine(contar.ExecuteScalar());
}else if(modo=="consultas"){
 foreach(var nome in new[]{"Lápis","Caderno","D'Água"}){using var inserir=conexao.CreateCommand();inserir.CommandText="INSERT INTO produtos (nome) VALUES ($nome);";inserir.Parameters.AddWithValue("$nome",nome);inserir.ExecuteNonQuery();}
 var entradas=${JSON.stringify(entradas).replace(/^\[/,'new string[]{').replace(/\]$/,'}')};
 var buscas=new Func<SqliteConnection,string,string[]>[]{${opcoes.map((_,i)=>'Buscar'+i).join(',')}};
 var resultados=new List<bool>();
 foreach(var buscar in buscas){var correto=true;foreach(var entrada in entradas){var esperado=entrada is "Lápis" or "Caderno" or "D'Água"?new[]{entrada}:Array.Empty<string>();try{if(!buscar(conexao,entrada).SequenceEqual(esperado))correto=false;}catch(SqliteException){correto=false;}}resultados.Add(correto);}
 Console.WriteLine(JsonSerializer.Serialize(resultados));
}else throw new InvalidOperationException("Modo desconhecido");
${funcoes}
`;
 await writeFile(join(pasta,'Program.cs'),codigo);
 const ambiente={...process.env,DOTNET_NOLOGO:'1',DOTNET_CLI_TELEMETRY_OPTOUT:'1'};
 const executar=argumentos=>{const resultado=spawnSync('dotnet',argumentos,{encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024,env:ambiente});assert(!resultado.error,resultado.error?.message);assert.equal(resultado.status,0,resultado.stderr||resultado.stdout);return resultado.stdout.trim();};
 executar(['build',join(pasta,'Referencias.csproj'),'--configuration','Release','--nologo','--verbosity','quiet']);
 const programa=join(pasta,'bin','Release','net10.0','Referencias.dll'),banco=join(pasta,'transacao.db');
 assert.deepEqual(executar([programa,banco,'transacao']).split(/\r?\n/),obterSolucao(previsao.id).split('\n'));
 assert.equal(executar([programa,banco,'ler']),'1');
 assert.deepEqual(JSON.parse(executar([programa,join(pasta,'consultas.db'),'consultas'])),opcoes.map(o=>o.id==='vincular'));
 return 2+opcoes.length*entradas.length;
}
