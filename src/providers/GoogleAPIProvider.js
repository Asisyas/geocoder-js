if (typeof GeocoderJS === "undefined" && typeof require === "function") {
  var GeocoderJS = require("../GeocoderJS.js");
  require("../Geocoded.js");
  require("../providers/ProviderBase.js");
}

;(function (GeocoderJS) {
  "use strict";

  var useSSL;
  var apiKey;
  var user_region;
  var language;

  GeocoderJS.GoogleAPIProvider = function(_externalLoader, options) {
    if (_externalLoader === undefined) {
      throw "No external loader defined.";
    }
    this.externalLoader = _externalLoader;

    options = (options) ? options : {};

    useSSL = (options.useSSL) ? options.useSSL : false;
    apiKey = (options.apiKey) ? options.apiKey : null;
    user_region = options.region ? options.region : null;
    language = options.lang ? options.lang : (user_region ? user_region : '');

    if (apiKey) {
      useSSL = true;
    }
  };

  GeocoderJS.GoogleAPIProvider.prototype = new GeocoderJS.ProviderBase();
  GeocoderJS.GoogleAPIProvider.prototype.constructor = GeocoderJS.GoogleAPIProvider;

  GeocoderJS.GoogleAPIProvider.prototype.geocode = function(searchString, callback) {
    this.externalLoader.setOptions({
      protocol: (useSSL === true) ? 'https' : 'http',
      host: 'maps.googleapis.com',
      pathname: 'maps/api/geocode/json'
    });

    var options = {
      sensor: false,
      address: searchString
    };

    if (apiKey) {
      options["key"] = apiKey;
    }

    if(language) {
        options['lang'] = language;
    }

    if(user_region) {
        options['region'] = user_region;
    }

    this.executeRequest(options, callback);
  };

  GeocoderJS.GoogleAPIProvider.prototype.geodecode = function(latitude, longitude, callback) {
    this.externalLoader.setOptions({
      protocol: (useSSL) ? 'https' : 'http',
      host: 'maps.googleapis.com',
      pathname: 'maps/api/geocode/json'
    });

    var options = {
      "sensor": false,
      "latlng": latitude + "," + longitude
    };

    if(language) {
        options['language'] = language;
    }

    if(user_region) {
      options['region'] = user_region;
    }

    if (apiKey) {
      options["key"] = apiKey;
    }

    this.executeRequest(options, callback);
  };

  GeocoderJS.GoogleAPIProvider.prototype.executeRequest = function(params, callback) {
    var _this = this;

    this.externalLoader.executeRequest(params, function(data) {
      var results = [];
      for (var i in data.results) {
        results.push(_this.mapToGeocoded(data.results[i]));
      }
      callback(results);
    });
  };

  GeocoderJS.GoogleAPIProvider.prototype.mapToGeocoded = function(result) {
    var geocoded = new GeocoderJS.Geocoded();
    geocoded.latitude = result.geometry.location.lat;
    geocoded.longitude = result.geometry.location.lng;

    if(result.geometry.bounds) {
      geocoded.bounds = parseBounds(result.geometry.bounds);
    }

    for (var i in result.address_components) {
      for (var j in result.address_components[i].types) {
        switch (result.address_components[i].types[j]) {
          case "street_number":
            geocoded.streetNumber = result.address_components[i].long_name;
            break;
          case "route":
            geocoded.streetName = result.address_components[i].long_name;
            break;
          case "locality":
            geocoded.city = result.address_components[i].long_name;
            break;
          case "administrative_area_level_1":
            geocoded.region = result.address_components[i].long_name;
            break;
          case "postal_code":
            geocoded.postal_code = result.address_components[i].long_name;
            break;
          case 'country':
            geocoded.country_code = result.address_components[i].short_name;
            geocoded.countryName = result.address_components[i].long_name;
            break;
        }
      }
    }

    return geocoded;
  };

  function parseBounds(boundsData) {
    var sw, ne;

    sw = boundsData.southwest;
    ne = boundsData.northeast;

    return [
        [sw.lat, sw.lng],
        [ne.lat, ne.lng]
    ];
  }

})(GeocoderJS);
