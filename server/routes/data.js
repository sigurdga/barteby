module.exports.index = function(req, res) {
    var fs = require('fs'),
    cheerio = require('cheerio'),
    markers = [];

    var locations = {
        'Ringve Museum': {lat: 63.447417, lon: 10.454397},
        'Hospitalskirka': {lat: 63.430415, lon: 10.384338},
        'Ilen kirke': {lat: 63.429902, lon: 10.376173},
        'Modern Art Gallery': {lat: 63.433160, lon: 10.396279},
        'Leangen Idrettsanlegg': {lat: 63.426614, lon: 10.465094},
        'Voll gård': {lat: 63.410358, lon: 10.448298},
        'Trondheim Kunstmuseum, TKM Gråmølna': {lat: 63.435119, lon: 10.415345},
        'Nordenfjeldske Kunstindustrimuseum': {lat: 63.428663, lon: 10.396323},
        'Rica Nidelven': {lat: 63.435688, lon: 10.406365},
        'Galleri SG': {lat: 63.431089, lon: 10.402674},
        'verkstedhallen': {lat: 63.438353, lon: 10.422437},
        'Lademoen Kirke': {lat: 63.437077, lon: 10.430312},
        'Moskus': {lat: 63.433219, lon: 10.401193},
        'Trønderkjellern': {lat: 63.434457, lon: 10.401816},
        'Olavshallen': {lat: 63.433800, lon: 10.403286},
        'No 13': {lat: 63.431900, lon: 10.393050},
        'Nidarosdomen': {lat: 63.427029, lon: 10.395851},
        'Ila Brainnstasjon': {lat: 63.429577, lon: 10.369286},
        'Torvet': {lat: 63.430499, lon: 10.395100},
        'Vitensenteret i Trondheim': {lat: 63.430163, lon: 10.400807},
        'Byscenen': {lat: 63.430112, lon: 10.391656},
        'Vår Frue kirke': {lat: 63.430251, lon: 10.397562},
        'Dokkhuset Scene': {lat: 63.434337, lon: 10.411118},
        'Erkebispegården': {lat: 63.431334, lon: 10.395196},
        'Ravnkloa': {lat: 63.433882, lon: 10.392943},
        'Rockheim': {lat: 63.438751, lon: 10.401993},
        'Sverresborg Trøndelag Folkemuseum': {lat: 63.421408, lon: 10.356803},
        'Vitenskapsmuseet': {lat: 63.429107, lon: 10.386844},
        'Kulturbunker Dora': {lat: 63.439433,  lon: 10.421433},
        'Trondheim folkebibliotek': {lat: 63.439433, lon: 10.421433},
        'Trøndelag Teater': {lat: 63.429316, lon: 10.391333}
    };

    var months = {
        'januar': 1,
        'februar': 2,
        'mars': 3,
        'april': 4,
        'mai': 5,
        'juni': 6,
        'juli': 7,
        'august': 8,
        'september': 9,
        'oktober': 10,
        'november': 11,
        'desember': 12
    };

    function get_date(date_string) {
        var date_elements = date_string.split(" ");
        var day = date_elements[0];
        var month = months[date_elements[1]];
        var year = 2013;
        return year + '-' + month + '-' + day;
    };

    fs.readFile('./parser/examples/thismonth.html', 'utf-8', function (err, data) {
        var $ = cheerio.load(data);
        $('div.event').each(function (i, event) {
            var event_date = $(event).children('.event_date');
            var date = $(event_date).find('.eventDay').text();
            var time = $(event_date).find('.eventTime').text();
            var title = $(event).find('.event_text h1 a').text().trim();
            var location_raw = $(event).find('span a').first();
            var location = location_raw.text().trim();
            var category = $(location_raw).next().next().text().trim();
            var hit = locations[location];
            if (hit) {
                markers.push({
                    title: title,
                    location: location,
                    category: category,
                    date: get_date(date),
                    time: time,
                    lat: hit.lat,
                    lon: hit.lon
                });
            } else {
                console.log(location, "not found");
            }
        });
        return res.json(200, markers);
    });
};
