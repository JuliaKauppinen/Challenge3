mapboxgl.accessToken = 'pk.eyJ1IjoianVsaWFrYXVwcGluZW4iLCJhIjoiY2s4cjhhY3BmMDBucTNlcG02aWdyaWFmZiJ9.JuowzC4SPm6_rlMLPAj18Q';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/juliakauppinen/ck8u2mw5402bj1imox6ajg601',
  center: [5.121420, 52.090736],
  zoom: 6.2
});

map.addControl(new mapboxgl.NavigationControl());

var cities = [
  {
    name: 'Amsterdam',
    coordinates: [4.895168, 52.370216]
  },
  {
    name: 'Rotterdam',
    coordinates: [4.47917, 51.9225]
  },
  {
    name: 'Maastricht',
    coordinates: [5.68889, 50.84833]
  },
  {
    name: 'Groningen',
    coordinates: [6.56667, 53.21917]
  },
  {
    name: 'Utrecht',
    coordinates: [5.121420, 52.090736]
  },
  {
    name: 'Leeuwarden',
    coordinates: [5.796116, 53.197844]
  },
  {
    name: 'Assen',
    coordinates: [6.564228, 52.992752]
  },
  {
    name: 'Zwolle',
    coordinates: [6.083022, 52.516773]
  },
  {
    name: 'Lelystad',
    coordinates: [5.471422, 52.518536]
  },
  {
    name: 'Arnhem',
    coordinates: [5.898730, 51.985104]
  },
  {
    name: 'Haarlem',
    coordinates: [4.646219, 52.387386]
  },
  {
    name: 'Den Haag',
    coordinates: [4.312982, 52.077785]
  },
  {
    name: 'Middelburg',
    coordinates: [3.615987, 51.500105]
  },
  {
    name: '\'s-Hertogenbosch',
    coordinates: [5.307052, 51.693889]
  },
  {
    name: 'Maassluis',
    coordinates: [4.236217, 51.932538]
  },
];

var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = '6a719e3c4dfb752cbb9fe577d9c14591';

map.on('load', function () {
  cities.forEach(function(city) {
    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    // Get the current weather
    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1.3
        }
      });
    }
  );
}

//Find the other API
function getAPIdata() {

	var url = 'https://api.openweathermap.org/data/2.5/weather';
	var apiKey ='4f4e68489a2a1738d6de0e59ca8ba883';
	var city = document.getElementById('city').value;

	//Make a request to get the current weather
	var request = url + '?' + 'appid=' + apiKey + '&' + 'q=' + city;
	
	// get current weather
	fetch(request)

	.then(function(response) {
		if(!response.ok) throw Error(response.statusText);
		return response.json();
	})
	
	.then(function(response) {
		onAPISucces(response);	
	})
	
	.catch(function (error) {
		onAPIError(error);
	});
}

// Type in city yourself
function onAPISucces(response) {
	// Get type of weather in string format
	var type = response.weather[0].description;

	// Get temperature in Celcius
	var degC = Math.floor(response.main.temp - 273.15);

	var weatherBox = document.getElementById('weather');
	weatherBox.innerHTML = degC + '&#176;C <br>' + type;
}

//Information when it can't find the city
function onAPIError(error) {
	console.error('Fetch request failed', error);
	var weatherBox = document.getElementById('weather');
	weatherBox.innerHTML = 'There is no weather data available, <br /> are you sure you entered a valid city name?'; 
}

document.getElementById('getWeather').onclick = function(){
	getAPIdata();
};

//pop up notification
map.on('load', function () {
  map.addSource('places', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': locaties
    }
  });

  // Add a layer showing the places
  map.addLayer({
    'id': 'places',
    'type': 'symbol',
    'source': 'places',
    'layout': {
      'icon-image': '{icon}-15',
      'icon-allow-overlap': true,
      'icon-size': 0.2
    }
  });

  // Create a popup, but don't add it to the map yet
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mouseenter', 'places', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Populate the popup and set its coordinates based on the feature found.
    popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  map.on('mouseleave', 'places', function () {
    popup.remove();
  });
});
