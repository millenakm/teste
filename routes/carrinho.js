var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

router.get('/', function(req, res, next) {
	file.read(function(data){
		res.render('./carrinho/index', {title: "Carrinho de compras", dados: data.produtos});
		res.end();
	});	
});

router.get('/compra', function(req, res, next) {
	res.render('./carrinho/comprar', {title: "Finalizar compra", dados: data.produtos});
	res.end();	
});

module.exports = router;