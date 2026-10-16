using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
Conferir("igualdade-definida", Cenario0, "2\nTrue\nFalse\n");
Conferir("igualdade-sensivel", Cenario1, "3\nFalse\nTrue\n");
Conferir("chave-repetida", Cenario2, "chave repetida\n");
Conferir("grupos-ordenados-independentes", Cenario3, "grupos preservados\n");
Conferir("deduplicacao-perde-palavra", Cenario4, "a\n1\n");
Conferir("lista-reutilizada-mistura-grupos", Cenario5, "True\n4\n");
Conferir("copia-interna", Cenario6, "1\n9\n");
Conferir("copia-apenas-externa", Cenario7, "9\n9\n");
Conferir("linhas-irregulares-e-alias", Cenario8, "cópia isolada\n");
Conferir("exemplo-preservado", Cenario9, "2,3,3\n2,3,9\n");
Conferir("solucao-preservada", Cenario10, "");
static void Conferir(string nome, Action executar, string esperada) {
    var original = Console.Out;
    using var captura = new StringWriter();
    try { Console.SetOut(captura); executar(); }
    finally { Console.SetOut(original); }
    var obtida = captura.ToString().Replace("\r\n", "\n");
    if (obtida != esperada) throw new Exception(nome + ": saída divergente: " + obtida);
    Console.WriteLine("OK LINQ C# " + nome);
}
static void Cenario0() {
var linguagens = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "sql", "SQL", "js" };
Console.WriteLine(linguagens.Count);
Console.WriteLine(linguagens.Contains("Sql"));
Console.WriteLine(linguagens.Add("sQl"));
}
static void Cenario1() {
var linguagens = new HashSet<string>(StringComparer.Ordinal) { "sql", "SQL", "js" };
Console.WriteLine(linguagens.Count);
Console.WriteLine(linguagens.Contains("Sql"));
Console.WriteLine(linguagens.Add("sQl"));
}
static void Cenario2() {
static Dictionary<int, List<string>> Agrupar(IEnumerable<string> palavras)
{
    return palavras.ToDictionary(palavra => palavra.Length, palavra => new List<string> { palavra });
}
try { Agrupar(new[] { "a", "bb", "c" }); throw new Exception("chave repetida aceita"); } catch (ArgumentException) { Console.WriteLine("chave repetida"); }
}
static void Cenario3() {
static Dictionary<int, List<string>> Agrupar(IEnumerable<string> palavras)
{
    return palavras.GroupBy(palavra => palavra.Length)
    .ToDictionary(grupo => grupo.Key, grupo => grupo.ToList());
}
var entrada = new[] { "a", "bb", "c", "bb", "" };
var antes = entrada.ToArray();
var grupos = Agrupar(entrada);
if (string.Join(",", grupos[1]) != "a,c" || string.Join(",", grupos[2]) != "bb,bb" || grupos[0].Count != 1 || grupos[0][0] != "") throw new Exception("partição ou ordem");
if (Agrupar(Array.Empty<string>()).Count != 0) throw new Exception("vazio");
if (ReferenceEquals(grupos[1], grupos[2])) throw new Exception("listas compartilhadas");
grupos[1].Add("d");
if (grupos[2].Count != 2 || !entrada.SequenceEqual(antes)) throw new Exception("mutação atravessou grupo");
var outro = Agrupar(entrada);
if (outro[1].Count != 2 || ReferenceEquals(outro[1], grupos[1])) throw new Exception("chamadas compartilhadas");
Console.WriteLine("grupos preservados");
}
static void Cenario4() {
static Dictionary<int, List<string>> Agrupar(IEnumerable<string> palavras)
{
    return palavras.DistinctBy(palavra => palavra.Length)
    .ToDictionary(palavra => palavra.Length, palavra => new List<string> { palavra });
}
var grupos = Agrupar(new[] { "a", "bb", "c", "bb" });
Console.WriteLine(string.Join(",", grupos[1]));
Console.WriteLine(grupos[2].Count);
}
static void Cenario5() {
static Dictionary<int, List<string>> Agrupar(IEnumerable<string> palavras)
{
    var lista = new List<string>();
return palavras.GroupBy(palavra => palavra.Length)
    .ToDictionary(grupo => grupo.Key, grupo => { lista.AddRange(grupo); return lista; });
}
var grupos = Agrupar(new[] { "a", "bb", "c", "bb" });
Console.WriteLine(ReferenceEquals(grupos[1], grupos[2]));
Console.WriteLine(grupos[1].Count);
}
static void Cenario6() {
int[][] origem = { new[] { 1, 2 }, new[] { 3 } };
var copia = origem.Select(linha => linha.ToArray()).ToArray();
copia[0][0] = 9;
Console.WriteLine(origem[0][0]);
Console.WriteLine(copia[0][0]);
}
static void Cenario7() {
int[][] origem = { new[] { 1, 2 }, new[] { 3 } };
var copia = origem.Select(linha => linha).ToArray();
copia[0][0] = 9;
Console.WriteLine(origem[0][0]);
Console.WriteLine(copia[0][0]);
}
static void Cenario8() {

static int[][] Copiar(int[][] origem) => origem.Select(linha => linha.ToArray()).ToArray();
var compartilhada = new[] { 1, 2 };
var origem = new[] { compartilhada, Array.Empty<int>(), compartilhada, new[] { -3 } };
var copia = Copiar(origem);
if (Copiar(Array.Empty<int[]>()).Length != 0 || copia.Length != 4 || copia[1].Length != 0 || copia[3][0] != -3) throw new Exception("forma ou vazio");
copia[0][0] = 9;
if (origem[0][0] != 1 || copia[2][0] != 1 || ReferenceEquals(copia, origem)) throw new Exception("alias preservado");
var outra = Copiar(origem);
outra[3][0] = 7;
if (copia[3][0] != -3 || origem[3][0] != -3) throw new Exception("chamadas compartilhadas");
Console.WriteLine("cópia isolada");
}
static void Cenario9() {
var valores = new[] { 3, 1, 3, 2 };
var consulta = valores.Where(x => x >= 2).OrderBy(x => x);
var snapshot = consulta.ToArray();
valores[0] = 9;
Console.WriteLine(string.Join(",", snapshot));
Console.WriteLine(string.Join(",", consulta));
}
static void Cenario10() {
static Dictionary<int,List<string>> Agrupar(IEnumerable<string> palavras) =>
    palavras.GroupBy(x=>x.Length).ToDictionary(g=>g.Key,g=>g.ToList());
var grupos=Agrupar(new[]{"a","bb","c"});
if(string.Join(",",grupos[1])!="a,c")throw new Exception("Ordem incorreta");
if(Agrupar(Array.Empty<string>()).Count!=0)throw new Exception("Vazio incorreto");
}