//variáveis globais
var vetor_sorteado;	//cria o vetor para controlar que a mesma imagem não seja sorteada mais de uma vez;
var data;
var pontuacao = 0;
var vidas = 3;
var indice = 0;
var estadoDica = 0;	//0 = não exibida
var estadoEnvio = 0;//0 = resposta não enviada
var indiceGeral = 0;//para percorrer o vetor_sorteado
var pontuacao_aux = 0;
var vidas_aux = 0;

function openFacil() {
	window.open('facil.html', '_self', false);
}
function openMedio(){
	window.open('medio.html', '_self', false);
}
function openDificil(){
	window.open('dificil.html', '_self', false);
}
function openScoreboard(){
	window.open('scoreboard.html', '_self', false);
}
function openHomepage(){
	window.open('index.html', '_self', false);
}
function openRegras(){
	window.open('regras.html', '_self', false);
}

function sorteio(dados){

	vetor_sorteado = new Array(dados.length);
	data = dados;	//possivelmente não sera necessário
    var verifica;
    var num_sorteado;
	for (var i = 0; i < dados.length; i++) {	//for para preencher o vetor_sorteado
		
		numero_sorteado = Math.floor((Math.random() * dados.length));
		//alert(numero_sorteado);
		verifica = 0;
		for(var j = 0; j < dados.length; j++){
			if(vetor_sorteado[j] === numero_sorteado){
				verifica++;
			}
		}
		if(verifica === 0){	//o numero sorteado nao foi sorteado antes
			var menor_indice;
			for (j = dados.length; j >= 0; j--) {
				if(!vetor_sorteado[j] && vetor_sorteado[j] != 0){
					menor_indice = j;	//pega a menor posição vazia
				}
			}
			//alert('menor indice ='+menor_indice);	
			vetor_sorteado[menor_indice] = numero_sorteado;
		}
		else{
			//alert('entrou no else');
			i--;	//sorteia novamente
		}
	}
	//apos sortear todo o vetor
	inicia_jogo(0);
}

function inicia_jogo(i){

	
	//verificação se o usuário veio de outro nivel
	localStorage.getItem("quantidade_vidas", vidas_aux); //salvo a quantidade de vidas
	localStorage.getItem("pontos", pontuacao_aux); //salvo a pontuação atual
	if(!pontuacao_aux){	//dif de zero
		localStorage.setItem("quantidade_vidas", 0);	//zero as variaveis do navegador para evitar 
		localStorage.setItem("pontos", 0);
		pontuacao = pontuacao_aux;
		vidas = vidas_aux;
	}//else -> vidas = 3 e pontuacao = 0 (não alterado apos a inicializacao)


	if(indiceGeral < data.length){
		atualizaVidas(vidas);
		atualizaPontuacao(pontuacao);

		estadoDica = 0;
	
		//percorrer o vetor chamando a loadImage
		indice = vetor_sorteado[i];	//para exibir a dica correspondente a imagem exibida
		loadImage(indice);

	}else{	//acabou o nivel
		//salva as variaveis do navegador para o proximo nivel
		localStorage.setItem("quantidade_vidas", vidas);
		localStorage.setItem("pontos", pontuacao);

		//chama proximo nivel
		if(parseInt(data[0].valorAcerto) === 10){
			window.open('medio.html', '_self', false);
		} else if (parseInt(data[0].valorAcerto) === 15){
			window.open('dificil.html', '_self', false);
		} else {
			alert('Parabens!!!');
			finalizaJogo();
		}
	}
}

function validaResposta(){
	if(document.form1.textoLogo.value.toLowerCase() ===  data[indice].nome){
		//resposta certa -> aumenta pontuação
		pontuacao = parseInt(pontuacao) + parseInt(data[0].valorAcerto);
		//alert(pontuacao);
		atualizaPontuacao();
		estadoEnvio = 1;
		document.form1.textoLogo.value = null;
		document.getElementById("dica1").innerHTML = null;	//apaga a dica exibida
		//vai para a próxima imagem
		indiceGeral = parseInt(indiceGeral) + 1;
		//alert('indice:' +indiceGeral);
		inicia_jogo(indiceGeral);	
	}
	else if(document.form1.textoLogo.value === ""){
		//caso o campo esteja vazio
		alert('Digite uma resposta válida');
	}
	else{
		//resposta errada -> perde vida 
		vidas = parseInt(vidas) - 1;
		document.getElementById("erro").style.visibility = "visible";
		setTimeout(function(){document.getElementById("erro").style.visibility = "hidden"},2000);
		if (vidas === 0) {
			finalizaJogo();
		}
		atualizaVidas(parseInt(vidas));
		document.form1.textoLogo.value = null;
	}
}

function finalizaJogo(){
	alert('GAMEOVER. Sua pontuacao foi: ' +pontuacao);
	nomeUsuario();
	openHomepage();
}

function nomeUsuario() {
	var person = prompt("Please enter your name:", "");
	escreveScoreboard(person);
}

function escreveScoreboard(person){
	//data.nomes.push
	//var obj = {};
	//obj.name = person;
	//obj.score = pontuacao;
	//var jsonString = JSON.stringify(obj);
}

function exibeDica(){	//ok
	if(estadoDica === 0){
		document.getElementById("dica1").innerHTML = data[indice].dica;
		pontuacao = parseInt(pontuacao) + parseInt(data[0].custoDica);
		atualizaPontuacao();
		estadoDica = 1;
	}
	else{
		alert("A dica já foi exibida");
	}
}

function loadImage(i){	//ok
	document.getElementById('imagemLogoID').src = data[i].path;
}

function atualizaVidas(valor){
	valor = parseInt(valor);
	document.getElementById('vidas').innerHTML = "Vidas:  " +valor;
}

function atualizaPontuacao(){	//ok
	//document.getElementById('pontuacao').innerHTML = null;
	document.getElementById('pontuacao').innerHTML = "Pontos:  " +parseInt(pontuacao);
}