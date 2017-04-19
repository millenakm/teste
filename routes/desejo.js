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
		res.render('./catalogo/desejos', {title: "Lista de desejos", dados: data.produtos});
		res.end();
	});	
	
});

module.exports = router;