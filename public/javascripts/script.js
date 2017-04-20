var product = '/catalogo/produto/';

// função geral para buscar os dados
function getData(handleData) {
	$.ajax({
		url:"/dados",  
		success:function(data) {
			handleData(data); 
		}
	});
}


/*************** STYLE ***************/

// funções de style ao carregar a página
function styles(){
	$("body").fadeIn(500);
	onScroll();
	carousel();
	filterController();
}
// Muda caracteristicas conforme a scrollbar
function onScroll(){
	var scrollY = 0;
	var pageScroll = window.pageYOffset;
	if(scrollY < pageScroll) {
		$('.navig').addClass('navig-top');
		$('.navbar-content').css({top: '15%'});
		$('#pg-title').fadeOut(200);
		$('#logoNav').fadeIn(200);
	}
	else if(pageScroll == scrollY){
		$('.navig').removeClass('navig-top');
		$('.navbar-content').css({top: '10%'});
		$('#pg-title').fadeIn(500);
		$('#logoNav').fadeOut(100);
	}
}
// caracteristicas do carrossel
function carousel(){
	var clickEvent = false;
	$('#myCarousel').on('click', '.nav a', function() {
			clickEvent = true;
			$('.nav li').removeClass('active');
			$(this).parent().addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.nav').children().length-1;
			var current = $('.nav li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.nav li').first().addClass('active');	
			}
		}
		clickEvent = false;
	});
}

/*************** SEARCH ***************/

// Abre a tela de pesquisa
function openSearch(){
	$(".search-modal").animate({width: '100%'});
	$('body, html').css({'overflow-y':'hidden'});
	$('.search-input').focus();
}
// Fecha a tela de pesquisa
function closeSearch(){
	$(".search-modal").animate({width: '0%'});
	$('.search-input').val(''); 
	$('body, html').css({'overflow-y':'auto'});
	$('.list-result, #box-result').html('');
}
// faz a busca dos dados
function searchJson(){
	$('#search-input').keyup(function(){//quando escrever na input, realiza a busca
		var searchField = $(this).val();
		if(searchField === '')  {//se não houver nada no campo de busca, limpa a div de resultados
			$(".list-result, #box-result").html('');
			return;
		}

		var results = '<table class="table"><thead><tr><th>Produto</th><th>Título</th><th>Autor</th><th>Preço(R$)</th><th>Categoria</th><th>Editora</th></tr></thead><tbody>';
		var regex = new RegExp(searchField, "i");//define a busca sem case sensitive
		getData(function(data){//procura os dados
			var cor = 1;
			for(i in data){
				var titulo = data[i].titulo;
				if (titulo.search(regex) != -1 || data[i].autor.search(regex) != -1 || data[i].editora.search(regex) != -1 || data[i].categoria.search(regex) != -1 || data[i].isbn.search(regex) != -1){//se houver dados correspondentes à busca
					//mostra a div de resultados e printa 
					results+='<tr id="livros" class="box-book" data-id="'+data[i].isbn+'" onmouseover="painelResult(this)">'
					+'<td class="cod">'+data[i].isbn+'</td>'
					+'<td class="colored">'+data[i].titulo+'</td>'
					+'<td class="autor">'+data[i].autor+'</td>'
					+'<td class="colored">'+parseFloat(data[i].valor).toFixed(2).toString().replace('.',',')+'</td>'
					+'<td>'+data[i].editora+'</td>'
					+'<td>'+data[i].categoria+'</td>'
					+'</tr>';

					cor++;
				}
			}
			results+='</tbody></table>';
			searchResult(results);
		});
	});
}
// define a lista dos resultados
function searchResult(results){
	$('.list-result').html(results);//define a div com os resultados
	$('.box-book').on('click', function(){
		$(".search-modal").animate({display: 'none'});
		productPage($(this).data('id'));
	}); 
	if($(".list-result td").length==0){
		$(".list-result").html("<h2>Nenhum resultado encontrado.</h2>");
		$("#box-result").html("");
	}		
}
// painel com informações de resultados da pesquisa
function painelResult(elem){
	getData(function(data){//procura os dados
		$(data).each(function (){//percorre um por um
			if($(elem).data('id') == this.isbn){
				var livro = '<img src="../../images/livros/'+this.capa+'.jpg" height="400px">';
				$("#box-result").html(livro);
			}
		});
	});
}


/*************** FILTER ***************/

// cria o filtro
function createFilter(){
	var editoras = ["Sextante","Arqueiro","Intrinseca"];

		for(i in editoras){
			editoras.sort();
			$("#select-categ").append('<option value="'+editoras[i]+'">'+editoras[i]+'</option>');
		}

}

// icone do filtro
function filterController(){
	var countEffect=0;
	$('.filter-icon').click(function(){
		countEffect++;
		filterEffect();
		$(this).css({bottom: '60px'});
		$('.navig-filter').css({display:'block'});
		if(	countEffect==2){
			countEffect=0;
			$(this).css({bottom: '5%'});
			$('.navig-filter').css({display:'none'});
			filterEffect();
		}
	});
}
// efeito do icone
function filterEffect(){
	$('.filter-icon > span').each(function(){
		$(this).rotate(180,{
			duration: 250
		});
	});
}



// vai para a página do produto clicado
function productPage(parameters){
	window.location=(product+parameters);
}
// actions style
function actionStyle(){
	window.onscroll = function() {
		onScroll();
	}
	$('#open-search').click(function(){
		openSearch();
	});
	$('#close-search').click(function(){
		closeSearch();
	});
}
// ações dos botoes/inputs
function actions(){
	actionStyle();
	$('.box-book').on('click', function(){
		productPage($(this).parents('.isbn').data('id'));
	});
	$(".selectpicker").change(function(){
		catalogo($(this).val());
	});
}

function catalogo(editora){
	var api='https://www.googleapis.com/books/v1/volumes?q=inpublisher:';
	// var editora2=["intrinseca","rocco","arqueiro"];
	var key = '&%20key%20=%20AIzaSyD0oBpbiiHTaxdpEjo79ReqLNZlry1CYcs';
	var quantidade = '&maxResults=20';
	$("#catalogo").html("");
		$.get(api+editora+quantidade+key, function(data){
			for(i in data.items){
				var valor=data.items[i].saleInfo.listPrice;
				if(valor==undefined){
					valor="Produto Esgotado"
				}else{
					valor="R$ "+data.items[i].saleInfo.listPrice.amount.toFixed(2).toString().replace('.',',');
				}
				$("#catalogo").append('<div class="grid col-md-4 col-lg-4 col-sm-6 isbn"><a href="catalogo/produto/'+data.items[i].id+'"><figure class="effect-terry"><img src="'
					+data.items[i].volumeInfo.imageLinks.thumbnail+'"><div class="infoCatalogo"><h2 class="tagsNome col-md-7">'
					+data.items[i].volumeInfo.title+'<br><span>'+data.items[i].volumeInfo.authors[0]
					+'</span></h2><h2 class="tagsPreco col-md-5">'+valor+
					'</div></figure></a></div>');
			}
		});

}


$(document).ready(function(){
	createFilter();
	catalogo($('.selectpicker').val());
	styles(); 
	actions();
	searchJson();
});
