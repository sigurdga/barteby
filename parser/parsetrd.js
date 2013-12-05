var fs = require('fs'),
    cheerio = require('cheerio'),
    markers = [];

var locations = {
    'Ringve Museum': {lat: 63.444616, lon: 10.451050},
    'Trøndelag Teater': {lat: 63.428342, lon: 10.391312}
};

fs.readFile('examples/trdevents.html', 'utf-8', function (err, data) {
    var $ = cheerio.load(data);
    $('div.event h1 a').each(function (i, event) {
        var title = $(this).text().trim();
        var location_raw = $(this).parent().next().children('span a').first();
        var location = location_raw.text().trim();
        var category = $(location_raw).next().next().text().trim();
        var hit = locations[location]
        //console.log(title);
        //console.log(location);
        //console.log(category);
        if (hit) {
            markers.push({title: title, location: location, lat: hit.lat, lon: hit.lon});
        }
    });
    console.log(markers);
});
