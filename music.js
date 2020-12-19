const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
let date = '';

const url = 'https://www.billboard.com/charts/hot-100/';

async function getTitles(date) {
	html = await axios.get(url + date).then((response) => response.data);
	const $ = cheerio.load(html);

	const musicInformation = $('.chart-element__information')
		.map((index, element) => {
			nameOfSong = $(element).find('.chart-element__information__song').text();
			nameOfArtist = $(element).find('.chart-element__information__artist').text();
			return {
				nameOfArtist,
				nameOfSong
			};
		})
		.get();
	return musicInformation;
}

app.get('/tracks', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/date', function(req, res) {
	date = req.body.date;
	res.redirect('/');
});

app.get('/', async (req, res) => {
	try {
		console.log(date);
		const musicTitles = await getTitles(date);
		return res.status(200).json({
			result: musicTitles
		});
	} catch (err) {
		return res.status(500).json({
			err: err.toString()
		});
	}
});

app.listen(3000, () => {
	console.log('running on port 3000');
});
