var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
// jquery
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

var isbn;

router.get('/:cod', function(req, res, next) {
	var cod = req.params.cod;
	var api='https://www.googleapis.com/books/v1/volumes/'+cod;
	var key = '&%20key%20=%20AIzaSyD0oBpbiiHTaxdpEjo79ReqLNZlry1CYcs';
		$.get(api+key, function(data){
			res.json(data);
  			// res.render('./catalogo/produto', {title: "Bookstore - "+this.titulo, dados: this});
  			// res.end();
	  	});
		
});


module.exports = router;