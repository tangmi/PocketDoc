/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.engine('html', require('hogan-express'));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/stylesheets/style.css', function(req, res) {
	var sass = require('node-sass');
	res.setHeader('Content-Type', 'text/css');
	sass.render({
		file: __dirname + '/public/stylesheets/style.scss',
		includePaths: [__dirname + '/public/stylesheets'],
		outputStyle: 'compressed',
		success: function(css) {
			res.send(css);
		}
	});
});

app.get('/', function(req, res) {
	render('login', res);
});

app.get('/:page', function(req, res) {
	var page = req.params.page;
	render(page, res);
});

function render(page, res) {	

	res.locals = {
		title: require('./config')[page],
		page: page
	};

	if(!require('fs').existsSync(__dirname + '/views/' + page + '.html')) {
		res.setHeader('Content-Type', 'text/plain');
		return res.send('views/' + page + '.html not found');
	}

	return res.render(
		'index', {
			partials: {
				part: page,
			}
		}
	);
}



http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});