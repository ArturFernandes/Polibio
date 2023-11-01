// Importa os módulos necessários
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

polibio(...process.argv.slice(2))

// Define a função principal
async function polibio(arquivo, chave, operacao) {
  // Verifica se os parâmetros obrigatórios foram fornecidos
  if (!arquivo || !chave || !operacao) {
    console.log("Parâmetros obrigatórios: arquivo, chave e operacao");
    return;
  }
  const tabelaPolibio = gerarTabelaPolibio(chave);
  const texto = await readFile(path.join(__dirname, arquivo));

  switch (operacao) {
    case "criptografar": 
      const textoEncriptado = encriptar(texto, tabelaPolibio);
      await writeFile('criptografado.txt', textoEncriptado);

      break;
    case "decriptografar":
      const textoDecriptado = decriptar(texto, tabelaPolibio);
      await writeFile('decriptografado.txt', textoDecriptado);

      break;
    default:
      console.log("Operação inválida")
      break;
  }

}

// Define a função `readFile()`, usado para ler o arquivo a ser criptografado/decriptografado
async function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) reject(err);
      resolve(data.toString());
    });
  });
}

// Define a função `writeFile()`, usada para criar o arquivo de resultados
async function writeFile(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

// Define a função `encriptar()`
function encriptar(texto, tabelaPolibio) {
  // Cria o texto criptografado, ignorando caracteres especiais e acentos
  const textoNormalizado = texto.normalize('NFD').replace(/\p{Diacritic}/gu,"").toLowerCase();

  let textoEncriptado = "";

  for (let caractere of textoNormalizado) {
    if (caractere == "\n" || caractere == " ") {
      textoEncriptado += caractere
    } else
      for (let i = 0; i <6 ; i++) {
        for (let j = 0; j <6 ; j++) {
          if (tabelaPolibio[i][j] == caractere) {
            textoEncriptado += `${i}${j} `;
          }
        }
      }
  }

  return textoEncriptado;

}

// Define a função `decriptar()`
function decriptar(texto, tabelaPolibio) {
  // Formata o texto criptografado separando as quebras de linha e espaços em branco
  const posicoesTexto = texto.replace("\n", " br ").replace("\r", "").split(' ')

  let textoDecriptado = "";

  for (let posicaoTexto of posicoesTexto) {
    switch (posicaoTexto) {
      case "":
        textoDecriptado += " ";
        break;
      case "br":
        textoDecriptado += "\n";
        break;
      default:
        const [linha, coluna] = posicaoTexto.split('');
        if (linha && coluna)
          textoDecriptado += tabelaPolibio[linha][coluna];
        break;
    }   
  }

  return textoDecriptado;
}

// Gera a tabela polibiana com a chave
function gerarTabelaPolibio(chave) {
  const alfabeto = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  const chaveSemDuplicatas = _.uniq(chave.split(''));
  const alfabetoComChave = _.uniq([...chaveSemDuplicatas,...alfabeto]);

  let matrizPolibio = [];
  let indiceAlfabeto = 0;

  for (let i = 0; i <6 ; i++) {
    matrizPolibio[i] = [];
    for (let j = 0; j <6 ; j++) {
      matrizPolibio[i][j] = alfabetoComChave[indiceAlfabeto++];
    }
  }

  return matrizPolibio
}