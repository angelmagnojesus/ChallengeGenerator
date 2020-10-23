//pasta onde fica as figuras:
var src_b = 'blocos/';

//irá multimplicar pelos valores conforme posição da seta
const POS_DENTRO = 0.6;
const POS_BAIXO = 1;
const POS_OPERACAO = 0.15;
const POS_DENTRO_SE = 0.7;//somente para caso especial do se senão
const POS_DENTRO_SENAO = 0.4;//somente para caso especial do se senão

//tipos de encaixe
const E_ABAIXO = "abaixo";
const E_DENTRO = "dentro";
const E_PARAMETRO = "parametro";
const E_DENTRO_SE = "dentro_se";//somente para caso especial do se senão
const E_DENTRO_SENAO = "dentro_senao";//caso especial do se senão

class Bloco {
  //id: n. na ordem da string formato; nome_bloco -> repita, se_entao,  etc
  //encaixe-> dentro, baixo, X; id_destino: id do bloco onde este vai se encaixar
  //img_s->caminho completo para a imagem do boco
  constructor(id, nome_bloco, encaixe, id_destino, img_s, x, y) {
    this.id = id;
    this.nome_bloco = nome_bloco;
    this.img_s = img_s;
    this.x = x;
    this.y = y;
    this.encaixe = encaixe;
    this.id_destino = id_destino;
  }
}

//vetor de blocos de comadno
 var blocos = new Array();

 /*montar GRID no modelo [[0,id_bloco,0]...] os blocos serão primeiramente 
 colocados no meio, caso haja "conexão" teremos a ordem baixo, 
 esquerdo, direita*/
 var grid = new Array();
 var ix = 400;//x initial position to draw
 var iy = 10;//y initial position to draw
 var space = 200;//130//espaço de separação entre blocos
 
//configura o inicio do desenho no eixo X conforme largura da janela 
function configDimension(){
    var wWidth = document.body.clientWidth;
    var figureWidth = space*5;
    ix = (wWidth - figureWidth)/2;
    if(ix < 0 || figureWidth > wWidth){
        ix = 5;
    } 
}

//configura altura do canvas conforme o número de blocos
function setCanvasHeight(nBlocos){
    var cHeight = (nBlocos/2) * space;
    document.getElementById("canvas").height = cHeight;
}

//esta função busca encaixes em que se b3 -baixo-> b2 -dentro-> b1
//então b3 -dentro-> b1 ou o contrário considerando a ordem
function buscarEncaixesIndiretos(bloco, blocos){
 //A FAZER...
}

function sortearCor(){
   var cores = ['red', 'blue','green'];
   var sorteio = parseInt(Math.random() * cores.length);
   return cores[sorteio];
}

function escreverSeta(ctx, x_origem, y_origem, x_destino, y_destino, texto){
  var d = Math.sqrt(Math.pow(x_destino - x_origem,2) + Math.pow(y_destino - y_origem,2));//calcular tamanho da reta
  ctx.moveTo(x_origem, y_origem);
  var x1,x2,y1,y2;
  if(x_destino > x_origem){ 
     x1 = x_origem; 
     x2 = x_destino; 
     y1 = y_origem; 
     y2 = y_destino; 
  }
  else{ 
     x2 = x_origem; 
     x1 = x_destino; 
     y2 = y_origem; 
     y1 = y_destino;
  }
  var m = (y2 - y1)/(x2 - x1);//inversao por causa das coordenadas invertidas
  //marca:
  var cx = (x1 + 10);
  var y = 0;
  var contd = 0;
  while(contd <= d/2){//talvez exista forma mais eficiente
  	y = (m*(cx - x1)+y1);
        //y = y < 0 ? -1*y : y; 
        contd = Math.sqrt(Math.pow(cx - x1,2) + Math.pow(y - y1,2));
        cx+=15;//20;
  }
  ctx.font = "15px Arial";
  ctx.fillStyle = "white";
  ctx.fillRect(cx - 3, y, 10*texto.length, 15 + 6);//x,y,largura, altura
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.rect(cx - 3, y, 10*texto.length, 15 + 6);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fillText(texto, cx+2, y + 15);
}

function desenharPontaSeta(ctx, x_ponta, y_ponta, largura_linha){
  var   lado = 10;
  var altura = 8;
  
  var xf1 = x_ponta + lado;
  var yf1 = y_ponta + altura;
  var xf2 = x_ponta - lado;//esqurda
  var yf2 = y_ponta + altura;
  
  ctx.lineTo(xf1, yf1);
  //desenha a outra aste:
  //ctx.moveTo(x_ponta-largura_linha/2, y_ponta-largura_linha);//para compensar a largura da linha //-2 -5
  ctx.moveTo(x_ponta-largura_linha/3, y_ponta);
  ctx.lineTo(xf2, yf2);
}

function desenharSeta(ctx, id_img_destino, x_origem, y_origem, width_origem, space, imgs, posicao, conexao){
   var tam_vertical = 20; //parte horizontal na ponta da reta
   var largura_linha = 5;
   var cor = sortearCor();
   //encotra posições 
   var ld, cd = 0;
   for(i = 0; i < grid.length; i++){
     if(grid[i] == id_img_destino){
    	ld = parseInt(i / 2); //linha: indice / n. colunas  (obs. arredondar para baixo)  
    	cd = i % 2; //coluana: indice % n. de colunas
    	break;
     }
   }

   var yd = iy + ld*space;//alteracao recente iy + ld*space
   var xd = ix + cd*space*4;
   ctx.beginPath();
   //definir origem da seta no lado direito ou esquedo da imagem
   if(cd == 0) x_origem -= width_origem;
   //------
   //------PREENCHE CIRCULO------
   ctx.moveTo(x_origem, y_origem);
   ctx.fillStyle = cor;
   ctx.ellipse(x_origem, y_origem, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
   ctx.fill();
   //----------------------------
   ctx.moveTo(x_origem, y_origem);
   //Obs.: imgs[id_img_destino - 1] --> (-1) pq o id inicia com 1
   var x_destino = xd + imgs[id_img_destino - 1].width/2;
   var y_destino = yd + imgs[id_img_destino - 1].height*posicao;//x0.6 para ir para o meio
   ctx.lineTo(x_destino, y_destino + tam_vertical);
   y_destino -= tam_vertical;
   y_destino += largura_linha*4;//compensar largura da linha
   ctx.lineTo(x_destino, y_destino);//yd + imgs[id_img_destino - 1].height/1.8);
   desenharPontaSeta(ctx, x_destino, y_destino, largura_linha);
   ctx.lineWidth = largura_linha;
   ctx.strokeStyle = cor;
   ctx.stroke(); 
   escreverSeta(ctx, x_origem, y_origem, x_destino, y_destino, conexao);
}

function callDraw(ctx, imgs, cx, cy, ri, space){
  var sx = 0;//para desenhar seta
  
  if(ri == imgs.length) 
  	  return;
  
  if(ri < 1){
  	alert("erro: r deve ser maior que 1");
  	return;
  }

  if(ri % 2 != 0){
     //cx += imgs[ri - 1].width + space; distancia variável
     cx += space*4;
     sx = cx;
     ctx.drawImage(imgs[ri], cx, cy);
     cx -= space*4;//(imgs[ri - 1].width + space);
  }else{
     sx = cx;
     cy += space; //imgs[ri - 1].height + space; //distancia variavel
     ctx.drawImage(imgs[ri], cx, cy);
  }
  
  if(blocos[ri].encaixe === RELATION_INSIDE){
     desenharSeta(ctx, blocos[ri].id_destino, sx + imgs[ri].width, cy, imgs[ri].width, space, imgs, POS_DENTRO, RELATION_INSIDE);
  }
  else if(blocos[ri].encaixe === RELATION_BELOW){
     desenharSeta(ctx, blocos[ri].id_destino, sx + imgs[ri].width, cy, imgs[ri].width, space, imgs, POS_BAIXO, RELATION_BELOW);
  }
  else if(blocos[ri].encaixe === RELATION_CONDITION){
     desenharSeta(ctx, blocos[ri].id_destino, sx + imgs[ri].width, cy, imgs[ri].width, space, imgs, POS_OPERACAO, RELATION_CONDITION);
  }
  else if(blocos[ri].encaixe === RELATION_OPERAND){
     desenharSeta(ctx, blocos[ri].id_destino, sx + imgs[ri].width, cy, imgs[ri].width, space, imgs, POS_OPERACAO, RELATION_OPERAND);
  }
  else if(blocos[ri].encaixe === RELATION_INSIDE_IF){//somente para o SE SENÃO
     desenharSeta(ctx, blocos[ri].id_destino, sx + imgs[ri].width, cy, imgs[ri].width, space, imgs, POS_DENTRO_SE, RELATION_INSIDE_IF);
  }
  else if(blocos[ri].encaixe === RELATION_INSIDE_ELSE){//somente para o SE SENÃO
     desenharSeta(ctx, blocos[ri].id_destino, sx + imgs[ri].width, cy, imgs[ri].width, space, imgs, POS_DENTRO_SENAO, RELATION_INSIDE_ELSE);
  }
  grid.push(blocos[ri].id);
  ri++;
  callDraw(ctx, imgs, cx, cy, ri, space);
}

function alterarBlocosPorNivel(blocos, pBlocosOcultos, pConexoesOcultas){

   //eliminar X% das ligações
   var total_eliminar = blocos.length * pConexoesOcultas;
   var eliminados = new Array(blocos.length).fill(0);//marcar com 1 quem já foi sorteado
   for(cont = 0; cont < total_eliminar;){
      var sorteio = parseInt(Math.random() * blocos.length);
      if(eliminados[sorteio] == 0){
         eliminados[sorteio] =  1;
         blocos[sorteio].encaixe = "x";//marca para não ser reconhecido
         cont++;
      }
   }
   //deixa X% ocultos
   total_eliminar = blocos.length * pBlocosOcultos;
   eliminados = new Array(blocos.length).fill(0);//marcar com 1 quem já foi sorteado
   for(cont = 0; cont < total_eliminar;){
      var sorteio = parseInt(Math.random() * blocos.length);
      if(eliminados[sorteio] == 0){
         eliminados[sorteio] =  1;
         blocos[sorteio].nome_bloco = "hidden";
         blocos[sorteio].img_s = src_b.concat("hidden.png");
         cont++;
      }
   }
}

function draw(format_text, pBlocosOcultos, pConexoesOcultas) {

  //quebrando string do tipo ID; NOME DO BLOCO; ENCAIXE, ID_DESTINO; ID; ETC...
  var separador = ";";
  var itens = format_text.split(separador);
  
  //monta vetor de objetos:
  var cont = 0;
  for(i = 0; i < itens.length; i+=4){
   img_s = src_b.concat(itens[i+1]).concat(".png");
   blocos[cont] = new Bloco(itens[i], itens[i+1], itens[i+2], itens[i+3], img_s, 0, 0);
   cont++;
  }
  
  alterarBlocosPorNivel(blocos, pBlocosOcultos, pConexoesOcultas);
  var ctx = document.getElementById('canvas').getContext('2d');
  //var img = new Image();
  
  setCanvasHeight(blocos.length);
  configDimension();
  
  var cx = ix;//x initial position to draw
  var cy = iy;//y initial position to draw
  var imgs = new Array();//não confundir com blocos
  for(i = 0; i < blocos.length; i++){
  	imgs[i] = new Image();
  	imgs[i].src = blocos[i].img_s;
  }
  var ri = 1;
  imgs[0].onload = function(){
     grid[0] = blocos[0].id;  
     ctx.drawImage(imgs[0], cx, cy);
     //cy += imgs[0].height + space;
     callDraw(ctx, imgs, cx, cy, ri, space);
  }
}