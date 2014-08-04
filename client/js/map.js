module.exports.loadMap = function () {
    var map = L.mapbox.map('map', 'sigurdga.gemd0c1b')
    .setView([63.4315, 10.3992], 13);
    map.markerLayer.on('layeradd', function (e) {
        var marker = e.layer,
        feature = marker.feature;
        marker.setIcon(L.icon(feature.properties.icon));
    });
    var dates = {};
    var geoJson = [];

    var categories = {
        'Teater': 'theatre',
        'Utstillinger': 'art-gallery',
        'Forestillinger': 'place-of-worship',
        'Barn': 'school',
        'Konsert/klubb': 'music',
        'Festivaler/markeder': 'clothing-store',
        'Samfunn': 'town-hall'
    };
    $.each(categories, function (label, category) {
        $('#filters').append('<li><input type="radio" name="category" id="filter-' +
                             category + '" data-filter="' + category + '"><label for="filter-' + category +
                             '">' + label + '</label></li>');
    });
    function filter(f, date, category) {
        return f.properties.date === date.attr('data-filter-date') && (category.attr("id") === "filter-all" || f.properties.category === category.attr('data-filter'));
    }
    var filterwrapper = function (f) {
        var date = $('#dates :checked');
        var category = $('#filters :checked');
        return filter(f, date, category);
    };
    $('#filters').on("change", "input[type=radio]", function (event) {
        $('#filters li').removeClass("active");
        $(this).parents('li').addClass("active");
        map.markerLayer.setFilter(filterwrapper);
    });
    $('#dates').on("change", "input[type=radio]", function (event) {
        $('#dates li').removeClass("active");
        $(this).parents('li').addClass("active");
        map.markerLayer.setFilter(filterwrapper);
    });
    $.ajax('/api/data/', {
        success: function (data) {
            _.each(data, function (marker){
                if (marker.lat && marker.lon) {
                    if (marker.date) {
                        dates[marker.date] = true;
                    }
                    var icon = categories[marker.category];
                    if (!icon) {
                        console.log(marker.category, "not found");
                        icon = 'circle';
                    }

                    geoJson.push({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [marker.lon, marker.lat]
                        },
                        "properties": {
                            "title": marker.title,
                            "description": marker.location,
                            "date": moment(marker.date).format(),
                            "time": marker.time,
                            "category": icon,
                            "icon": {
                                "iconUrl": 'http://a.tiles.mapbox.com/v3/marker/pin-l-' + icon + '+1087bf.png',
                            }
                        }
                    });
                }
            });
            map.markerLayer.setGeoJSON(geoJson);
            $.each(dates, function (date, t) {
                var d = moment(date);
                $('#dates').append('<li><input type="radio" name="date" id="date-' + date + '" data-filter-date="' + date + '"><label for="date-' + date + '" id="' + date + '">' + d.format("Do MMMM") + '</label></li>');
            });
            $('#dates input').first().click();
        }
    });
};
