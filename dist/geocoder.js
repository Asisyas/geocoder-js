if (function() {
    "use strict";
    var e = {};
    e.version = "0.0.0", e.createGeocoder = function(o) {
        return new e.ProviderFactory().createProvider(o);
    }, ("object" == typeof window ? window : "object" == typeof exports ? exports : {}).GeocoderJS = e;
}(), "function" == typeof define && define.amd && define(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) var GeocoderJS = require("../GeocoderJS.js");

if (function(e) {
    "use strict";
    e.ProviderBase = function() {}, e.ProviderBase.prototype = {
        geocode: function(e, o) {},
        geodecode: function(e, o, t) {},
        mapToGeocoded: function(e) {},
        executeRequest: function(e, o) {}
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) var GeocoderJS = require("./GeocoderJS.js");

if (function(e) {
    "use strict";
    e.Geocoded = function() {
        this.other = {};
    }, e.Geocoded.prototype = {
        getCoordinates: function() {
            return [ this.latitude, this.longitude ];
        },
        getLatitude: function() {
            return this.latitude;
        },
        getLongitude: function() {
            return this.longitude;
        },
        getBounds: function() {
            return this.bounds;
        },
        getStreetNumber: function() {
            return this.streetNumber;
        },
        getStreetName: function() {
            return this.streetName;
        },
        getCity: function() {
            return this.city;
        },
        getZipcode: function() {
            return this.postal_code;
        },
        getCityDistrict: function() {},
        getCounty: function() {
            return this.countryName;
        },
        getCountyCode: function() {
            return this.country_code;
        },
        getRegion: function() {
            return this.region;
        },
        getOther: function() {
            return this.other;
        }
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) var GeocoderJS = require("./GeocoderJS.js");

if (function(e) {
    "use strict";
    var o = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Point",
            coordinates: []
        }
    };
    e.GeoJSONDumper = function() {
        return {
            dump: function(e) {
                var t = o;
                return t.geometry.coordinates = [ e.getLongitude(), e.getLatitude() ], t;
            }
        };
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) {
    var GeocoderJS = require("../GeocoderJS.js");
    require("../ExternalURILoader.js");
}

if (function(e) {
    "use strict";
    e.ProviderFactory = function() {}, e.ProviderFactory.prototype.createProvider = function(o) {
        "string" == typeof o && (o = {
            provider: o
        });
        var t, r = new e.ExternalURILoader();
        switch (o.provider) {
          case "google":
            t = new e.GoogleAPIProvider(r, o);
            break;

          case "mapquest":
            t = new e.MapquestProvider(r, o);
            break;

          case "openstreetmap":
            t = new e.OpenStreetMapProvider(r, o);
            break;

          case "bing":
            t = new e.BingProvider(r, o);
            break;

          case "yandex":
            t = new e.YandexProvider(r, o);
        }
        return t;
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) var GeocoderJS = require("../GeocoderJS.js");

if (function(e, o) {
    "use strict";
    function t(e) {
        var t = Date.now(), r = "jsonp" + Math.round(t + 1000001 * Math.random());
        return o[r] = function(t) {
            e(t), delete o[r];
        }, r;
    }
    e.ExternalURILoader = function(e) {
        this.options = {}, void 0 === e && (e = {}), this.setOptions(e);
    }, e.ExternalURILoader.prototype.setOptions = function(e) {
        var o = {
            protocol: null,
            host: null,
            pathname: null
        };
        for (var t in o) this.options[t] = void 0 !== e[t] ? e[t] : o[t];
    }, e.ExternalURILoader.prototype.executeRequest = function(o, r) {
        var n = this;
        if ("undefined" != typeof XMLHttpRequest) return function(e, o) {
            var r, i = new XMLHttpRequest(), a = n.options.protocol + "://" + n.options.host + "/" + n.options.pathname + "?", s = [];
            e.JSONPCallback && (r = e.JSONPCallback, delete e.JSONPCallback, e[r] = t(o));
            for (var d in e) e.hasOwnProperty(d) && s.push(d + "=" + e[d]);
            if (a += s.join("&"), r) {
                var c = document.createElement("script");
                c.src = a, document.getElementsByTagName("head")[0].appendChild(c);
            } else i.onload = function() {
                if (200 != this.status) return console.log("Received HTTP status code " + this.status + " when attempting geocoding request."), 
                o(null);
                if (!this.responseText || !this.responseText.length) return console.log("Received empty data when attempting geocoding request."), 
                o(null);
                var e = !1;
                try {
                    e = JSON.parse(this.responseText);
                } catch (e) {
                    return console.log("Received invalid JSON data when attempting geocoding request."), 
                    o(null);
                }
                return e ? o(e) : (console.log("Received unexpected JSON data when attempting geocoding request."), 
                o(null));
            }, i.open("GET", a), i.send();
        }(o, r);
        try {
            require("url");
            return function(o, t) {
                var r, i = require("url"), a = require(n.options.protocol), s = {
                    protocol: n.options.protocol,
                    host: n.options.host,
                    pathname: n.options.pathname,
                    query: o
                };
                r = i.format(s), a.get(r, function(o) {
                    if (200 != o.statusCode) throw "Received HTTP status code " + o.statusCode + " when attempting geocoding request.";
                    o.data = "", o.setEncoding("utf8"), o.on("data", function(e) {
                        o.data += e;
                    }), o.on("end", function() {
                        if (!o.data || !o.data.length) throw "Received empty data when attempting geocoding request.";
                        var r = !1, n = 0, i = [];
                        try {
                            r = JSON.parse(o.data);
                        } catch (e) {
                            throw "Received invalid JSON data when attempting geocoding request.";
                        }
                        if (r && r.status) {
                            if ("OVER_QUERY_LIMIT" === r.status) throw "Exceeded daily quota when attempting geocoding request.";
                            if ("OK" === r.status && r.results) {
                                for (;n < r.results.length; n++) i.push(e.GoogleAPIProvider.prototype.mapToGeocoded(r.results[n]));
                                return t(i);
                            }
                        }
                        throw "Received unexpected JSON data when attempting geocoding request.";
                    });
                }).on("error", function(e) {
                    throw e;
                });
            }(o, r);
        } catch (e) {}
        return r(null);
    };
}(GeocoderJS, window), void 0 === GeocoderJS && "function" == typeof require) {
    var GeocoderJS = require("../GeocoderJS.js");
    require("../Geocoded.js"), require("../providers/ProviderBase.js");
}

if (function(e) {
    "use strict";
    var o, t;
    e.BingProvider = function(e, r) {
        if (void 0 === e) throw "No external loader defined.";
        this.externalLoader = e, o = !!(r = r || {}).useSSL && r.useSSL, (t = r.apiKey ? r.apiKey : null) && (o = !0);
    }, e.BingProvider.prototype = new e.ProviderBase(), e.BingProvider.prototype.constructor = e.BingProvider, 
    e.BingProvider.prototype.geocode = function(e, r) {
        this.externalLoader.setOptions({
            protocol: !0 === o ? "https" : "http",
            host: "dev.virtualearth.net",
            pathname: "REST/v1/Locations/" + e
        });
        var n = {
            key: t,
            JSONPCallback: "jsonp"
        };
        this.executeRequest(n, r);
    }, e.BingProvider.prototype.geodecode = function(e, r, n) {
        this.externalLoader.setOptions({
            protocol: !0 === o ? "https" : "http",
            host: "dev.virtualearth.net",
            pathname: "REST/v1/Locations/" + e + "," + r
        });
        var i = {
            key: t,
            JSONPCallback: "jsonp"
        };
        this.executeRequest(i, n);
    }, e.BingProvider.prototype.executeRequest = function(e, o) {
        var t = this;
        this.externalLoader.executeRequest(e, function(e) {
            var r = [];
            for (var n in e.resourceSets[0].resources) r.push(t.mapToGeocoded(e.resourceSets[0].resources[n]));
            o(r);
        });
    }, e.BingProvider.prototype.mapToGeocoded = function(o) {
        var t = new e.Geocoded();
        return t.latitude = o.point.coordinates[0], t.longitude = o.point.coordinates[1], 
        t.streetName = o.address.addressLine, t.city = o.address.locality, t.region = o.address.adminDistrict, 
        t.postal_code = o.address.postalCode, t;
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) {
    var GeocoderJS = require("../GeocoderJS.js");
    require("../Geocoded.js"), require("../providers/ProviderBase.js");
}

if (function(e) {
    "use strict";
    function o(e) {
        var o, t;
        return o = e.southwest, t = e.northeast, [ [ o.lat, o.lng ], [ t.lat, t.lng ] ];
    }
    var t, r;
    e.GoogleAPIProvider = function(e, o) {
        if (void 0 === e) throw "No external loader defined.";
        this.externalLoader = e, t = !!(o = o || {}).useSSL && o.useSSL, (r = o.apiKey ? o.apiKey : null) && (t = !0);
    }, e.GoogleAPIProvider.prototype = new e.ProviderBase(), e.GoogleAPIProvider.prototype.constructor = e.GoogleAPIProvider, 
    e.GoogleAPIProvider.prototype.geocode = function(e, o) {
        this.externalLoader.setOptions({
            protocol: !0 === t ? "https" : "http",
            host: "maps.googleapis.com",
            pathname: "maps/api/geocode/json"
        });
        var n = {
            sensor: !1,
            address: e
        };
        r && (n.key = r), this.executeRequest(n, o);
    }, e.GoogleAPIProvider.prototype.geodecode = function(e, o, n) {
        this.externalLoader.setOptions({
            protocol: t ? "https" : "http",
            host: "maps.googleapis.com",
            pathname: "maps/api/geocode/json"
        });
        var i = {
            sensor: !1,
            latlng: e + "," + o
        };
        r && (i.key = r), this.executeRequest(i, n);
    }, e.GoogleAPIProvider.prototype.executeRequest = function(e, o) {
        var t = this;
        this.externalLoader.executeRequest(e, function(e) {
            var r = [];
            for (var n in e.results) r.push(t.mapToGeocoded(e.results[n]));
            o(r);
        });
    }, e.GoogleAPIProvider.prototype.mapToGeocoded = function(t) {
        var r = new e.Geocoded();
        r.latitude = t.geometry.location.lat, r.longitude = t.geometry.location.lng, t.geometry.bounds && (r.bounds = o(t.geometry.bounds));
        for (var n in t.address_components) for (var i in t.address_components[n].types) switch (t.address_components[n].types[i]) {
          case "street_number":
            r.streetNumber = t.address_components[n].long_name;
            break;

          case "route":
            r.streetName = t.address_components[n].long_name;
            break;

          case "locality":
            r.city = t.address_components[n].long_name;
            break;

          case "administrative_area_level_1":
            r.region = t.address_components[n].long_name;
            break;

          case "postal_code":
            r.postal_code = t.address_components[n].long_name;
        }
        return r;
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) var GeocoderJS = require("../GeocoderJS.js");

if (function(e) {
    "use strict";
    e.MapquestProvider = function(e, o) {
        if (void 0 === e) throw "No external loader defined.";
        this.externalLoader = e, "object" != typeof o && (o = {});
        var t = {
            apiKey: ""
        };
        for (var r in t) void 0 === o[r] && (o[r] = t[r]);
        this.apiKey = o.apiKey;
    }, e.MapquestProvider.prototype = new e.ProviderBase(), e.MapquestProvider.prototype.constructor = e.MapquestProvider, 
    e.MapquestProvider.prototype.geocode = function(e, o) {
        this.externalLoader.setOptions({
            protocol: "http",
            host: "www.mapquestapi.com",
            pathname: "geocoding/v1/address"
        });
        var t = {
            key: this.apiKey,
            outputFormat: "json",
            location: encodeURIComponent(e),
            JSONPCallback: "callback"
        };
        this.executeRequest(t, o);
    }, e.MapquestProvider.prototype.geodecode = function(e, o, t) {
        this.externalLoader.setOptions({
            protocol: "http",
            host: "www.mapquestapi.com",
            pathname: "geocoding/v1/reverse"
        });
        var r = {
            key: this.apiKey,
            outputFormat: "json",
            JSONPCallback: "callback",
            location: e + "," + o
        };
        this.executeRequest(r, t);
    }, e.MapquestProvider.prototype.mapToGeocoded = function(o) {
        var t = new e.Geocoded();
        return t.latitude = o.latLng.lat, t.longitude = o.latLng.lng, t.city = o.adminArea5, 
        t.region = o.adminArea4, t.streetName = o.street, t.postal_code = o.postalCode, 
        t;
    }, e.MapquestProvider.prototype.executeRequest = function(e, o) {
        var t = this;
        this.externalLoader.executeRequest(e, function(e) {
            var r = [];
            if (e.results[0].locations.length) for (var n in e.results[0].locations) r.push(t.mapToGeocoded(e.results[0].locations[n]));
            o(r);
        });
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) {
    var GeocoderJS = require("../GeocoderJS.js");
    require("../Geocoded.js"), require("../ExternalURILoader.js"), require("../providers/ProviderBase.js");
}

if (function(e) {
    "use strict";
    e.OpenStreetMapProvider = function(e) {
        if (void 0 === e) throw "No external loader defined.";
        this.externalLoader = e;
    }, e.OpenStreetMapProvider.prototype = new e.ProviderBase(), e.OpenStreetMapProvider.prototype.constructor = e.OpenStreetMapProvider, 
    e.OpenStreetMapProvider.prototype.geocode = function(e, o) {
        this.externalLoader.setOptions({
            protocol: "http",
            host: "nominatim.openstreetmap.org",
            pathname: "search"
        });
        var t = {
            format: "json",
            q: e,
            addressdetails: 1
        };
        this.executeRequest(t, o);
    }, e.OpenStreetMapProvider.prototype.geodecode = function(e, o, t) {
        this.externalLoader.setOptions({
            protocol: "http",
            host: "nominatim.openstreetmap.org",
            pathname: "reverse"
        });
        var r = {
            format: "json",
            lat: e,
            lon: o,
            addressdetails: 1,
            zoom: 18
        };
        this.executeRequest(r, t);
    }, e.OpenStreetMapProvider.prototype.executeRequest = function(e, o) {
        var t = this;
        this.externalLoader.executeRequest(e, function(e) {
            var r = [];
            if (e.length) for (var n in e) r.push(t.mapToGeocoded(e[n])); else r.push(t.mapToGeocoded(e));
            o(r);
        });
    }, e.OpenStreetMapProvider.prototype.mapToGeocoded = function(o) {
        var t = new e.Geocoded();
        return t.latitude = 1 * o.lat, t.longitude = 1 * o.lon, t.streetNumber = void 0 !== o.address.house_number ? o.address.house_number : void 0, 
        t.streetName = o.address.road, t.city = o.address.city, t.region = o.address.state, 
        t.postal_code = o.address.postcode, t;
    };
}(GeocoderJS), void 0 === GeocoderJS && "function" == typeof require) {
    var GeocoderJS = require("../GeocoderJS.js");
    require("../Geocoded.js"), require("../providers/ProviderBase.js");
}

!function(e) {
    "use strict";
    function o(e, o) {
        var t, r, n, i;
        for (t in o) if (o.hasOwnProperty(t)) switch (r = o[t], n = r.kind, i = r.name, 
        n) {
          case "country":
            e.countryName = i;
            break;

          case "locality":
            e.city = i;
            break;

          case "province":
            e.region = i;
            break;

          case "area":
            e.region_area = i;
            break;

          case "street":
            e.streetName = i;
            break;

          case "house":
            e.streetNumber = i;
            break;

          default:
            e.other[n] = i;
        }
    }
    function t(e) {
        var o, t, n, i = [ "Envelope" ];
        for (n in i) if (i.hasOwnProperty(n) && (o = i[n], e.hasOwnProperty(o))) {
            t = e[o];
            break;
        }
        switch (o) {
          case "Envelope":
            return r(t);
        }
    }
    function r(e) {
        var o, t, r, n, i, a, s;
        return t = e.upperCorner, o = e.lowerCorner, s = o.split(" "), n = 1 * s[0], r = 1 * s[1], 
        s = t.split(" "), a = 1 * s[0], i = 1 * s[1], [ [ r, n ], [ i, a ] ];
    }
    var n;
    e.YandexProvider = function(e, o) {
        if (void 0 === e) throw "No external loader defined.";
        this.externalLoader = e, n = !!(o = o || {}).useSSL && o.useSSL, this.lang = o.lang ? o.lang : "en-US";
    }, e.YandexProvider.prototype = new e.ProviderBase(), e.YandexProvider.prototype.constructor = e.YandexProvider, 
    e.YandexProvider.prototype.geocode = function(e, o) {
        this.externalLoader.setOptions({
            protocol: !0 === n ? "https" : "http",
            host: "geocode-maps.yandex.ru",
            pathname: "1.x"
        });
        var t = {
            format: "json",
            geocode: e,
            JSONPCallback: "callback",
            lang: this.lang
        };
        this.executeRequest(t, o);
    }, e.YandexProvider.prototype.geodecode = function(e, o, t) {
        this.externalLoader.setOptions({
            protocol: !0 === n ? "https" : "http",
            host: "geocode-maps.yandex.ru",
            pathname: "1.x"
        });
        var r = {
            format: "json",
            geocode: o + "," + e,
            JSONPCallback: "callback",
            lang: this.lang
        };
        this.executeRequest(r, t);
    }, e.YandexProvider.prototype.executeRequest = function(e, o) {
        var t = this;
        this.externalLoader.executeRequest(e, function(e) {
            var r = [];
            for (var n in e.response.GeoObjectCollection.featureMember) r.push(t.mapToGeocoded(e.response.GeoObjectCollection.featureMember[n].GeoObject));
            o(r);
        });
    }, e.YandexProvider.prototype.mapToGeocoded = function(r) {
        var n, i, a, s, d = new e.Geocoded();
        return n = r.Point.pos.split(" "), d.latitude = 1 * n[1], d.longitude = 1 * n[0], 
        (s = t(r.boundedBy)) && (d.bounds = s), r.metaDataProperty.GeocoderMetaData ? (i = r.metaDataProperty.GeocoderMetaData, 
        a = i.Address.Components, i.AddressDetails.Country && (d.country_code = i.AddressDetails.Country.CountryNameCode), 
        o(d, a), d) : d;
    };
}(GeocoderJS);