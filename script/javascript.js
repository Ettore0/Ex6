//variáveis globais
var logoInformation;	//cria o vetor para controlar que a mesma imagem não seja sorteada mais de uma vez;
var data;
var score = 0;
var lives = 3;
var index = 0;
var isHintAlreadyShowed = 0;	//0 = não exibida
var isSubmitted = 0;//0 = resposta não enviada
var generalIndex = 0;//para percorrer o logoInformation
var scoreAux = 0;
var livesAux = 0;

function openEasyLevelPage() {
	window.open('facil.html', '_self', false);
}
function openMediumLevelPage(){
	window.open('medio.html', '_self', false);
}
function openHardLevelPage(){
	window.open('dificil.html', '_self', false);
}
function openScoreboard(){
	window.open('scoreboard.html', '_self', false);
}
function openHomepage(){
	window.open('index.html', '_self', false);
}
function openRulesPage(){
	window.open('regras.html', '_self', false);
}

function sorteio(logosInfoArray){

	//verificação se o usuário veio de outro nivel
	levelThatUserIsIn();
	//else -> lives = 3 e score = 0 (não alterado apos a inicializacao)

	logoInformation = new Array(logosInfoArray.length);
	data = logosInfoArray;	//possivelmente não sera necessário
    var verifica;
    var num_sorteado;
    
	for (var i = 0; i < logosInfoArray.length; i++) {	//for para preencher o logoInformation
		
		numero_sorteado = Math.floor((Math.random() * logosInfoArray.length));
		//alert(numero_sorteado);
		verifica = 0;
		for(var j = 0; j < logosInfoArray.length; j++){
			if(logoInformation[j] === numero_sorteado){
				verifica++;
			}
		}
		if(verifica === 0){	//o numero sorteado nao foi sorteado antes
			var menor_indice;
			for (j = logosInfoArray.length; j >= 0; j--) {
				if(!logoInformation[j] && logoInformation[j] != 0){
					menor_indice = j;	//pega a menor posição vazia
				}
			}
			//alert('menor index ='+menor_indice);	
			logoInformation[menor_indice] = numero_sorteado;
		}
		else{
			//alert('entrou no else');
			i--;	//sorteia novamente
		}
	}
	//apos sortear todo o vetor
	startGame(0);
}

function levelThatUserIsIn() {

	livesAux = localStorage.getItem("quantidade_vidas"); //salvo a quantidade de vidas
	scoreAux = localStorage.getItem("pontos"); //salvo a pontuação atual

	if(scoreAux != 0 && scoreAux != null && scoreAux != 'undefined'){	//dif de zero

		localStorage.setItem("quantidade_vidas", 0);	//zero as variaveis do navegador para evitar 
		localStorage.setItem("pontos", 0);
		score = scoreAux;
		lives = livesAux;
	}
}

function startGame(i){

	if(generalIndex < data.length){
	
		showLives(lives);
		showScore(score);
		updateHintStatus(false);
		index = logoInformation[i];	//para exibir a hint correspondente a imagem exibida
		loadImage(index);

	}else{	//acabou o nivel
	
		saveLivesAndScore();
		nextLevel();
	}
}

function saveLivesAndScore() {
	
	localStorage.setItem("quantidade_vidas", lives);
	localStorage.setItem("pontos", score);
}

function nextLevel() {
	
	if(parseInt(data[0].rightAnswerScoreValue) === 10){
	
		openMediumLevelPage();

	} else if (parseInt(data[0].rightAnswerScoreValue) === 15){

		openHardLevelPage();
	
	} else {

		alert('Parabens!!!');
		endGame();
	
	}
}

function assertRightAnswer(){
	
	if(document.form1.textoLogo.value.toLowerCase() ===  data[index].logoName){
	
		rightAnswer();	
	
	}
	
	else if(document.form1.textoLogo.value === ""){
	
		alert('Digite uma resposta válida');

	} else {
	
		wrongAnswer();
	}
}

function rightAnswer() {

	updateScore(parseInt(data[0].rightAnswerScoreValue));
	clearTextBox();
	clearHintBox();
	nextLogo();
	startGame(generalIndex);

}

function wrongAnswer() {
	
	verifyLivesAmount();
	showWrongAnswer();	
	clearTextBox();

}

function clearHintBox() {
	
	document.getElementById("dica1").innerHTML = null;

}

function clearTextBox() {
	
	document.form1.textoLogo.value = null;

}

function nextLogo() {
	generalIndex = parseInt(generalIndex) + 1;
}

function verifyHintDisplay() {
	isHintAlreadyShowed? alert("A dica já foi exibida") : showHint();
}

function showHint() {
	document.getElementById("dica1").innerHTML = data[index].hint;
	updateHintStatus(true);
	updateScore(parseInt(data[0].hintScoreValue));
}

function updateHintStatus(status) {
	isHintAlreadyShowed = status;
}

function updateScore(scoreValue) {
	score = parseInt(score) + scoreValue;
	showScore();
}

function showScore(){
	document.getElementById('score').innerHTML = "Pontos:  " +score;
}

function loadImage(i){
	document.getElementById('imagemLogoID').src = data[i].path;
}

function showWrongAnswer(){
	document.getElementById("erro").style.visibility = "visible";
	setTimeout(function(){document.getElementById("erro").style.visibility = "hidden"},2000);
}

function verifyLivesAmount() {
	if (lives === 0) endGame();
	losesLife();
}

function losesLife() {
	lives -= 1;
	showLives(lives);
}

function showLives(livesAmount){
	document.getElementById('lives').innerHTML = "Vidas:  " +parseInt(livesAmount);
}

function endGame(){
	alert('GAMEOVER. Sua pontuacao foi: ' +score);
	nomeUsuario();
	openHomepage();
}

function nomeUsuario() {
	var person = prompt("Please enter your name:", "");
	escreveScoreboard(person);
}