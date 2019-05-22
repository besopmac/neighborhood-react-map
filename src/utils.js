export function load_google_maps() {
    return new Promise(function(resolve, reject) {
      
        // define the global callback that will run when google maps is loaded
      window.resolveGoogleMapsPromise = function() {
        // resolve the google object
        resolve(window.google);
        // delete the global callback to tidy up since it is no longer needed
        delete window.resolveGoogleMapsPromise;
      }

      // Now, Load the Google Maps API
      const script = document.createElement("script");
      const API_KEY = 'AIzaSyDKsQCLpdCHJ_Bn5kCciYLOCohO8hAbrAc';
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
      script.async = true;
      document.body.appendChild(script);
    });
}

export function load_places() {
    let city = 'Rio de Janeiro, Brazil';
    let query = 'Food';
    var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=4HM5PCKWP1V1V55VI2K2MSWBXK2YV4NPTNVCDJULAEFUV2WV&client_secret=34JLM5UDZYKHSS3E04WLWJEFGIRYEWBPQJ5R2HHVBHNMPWUN&v=20190501%20&limit=50&near=' + city + '&query=' + query + '';

    return fetch(apiURL).then(resp => resp.json())
}