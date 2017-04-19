var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

var fs = require('fs');

module.exports = {
	read: function(callback){//callback é executado depois que a função terminar
		fs.readFile(__dirname + '/../'+'db/data.json', 'utf8', function(err, data){
			data = JSON.parse(data);//transforma o json em um objeto js manipulável
			
			callback(data);
		});
	},
	write: function(dataJson, res){
		fs.writeFile(__dirname + '/../'+'db/data.json', dataJson, function(err){
			if(err)
				return console.log(err);
			res.end();
		});
	}
}