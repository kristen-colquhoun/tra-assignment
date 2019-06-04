/**
 * The races module will handle all races and also handle
 * members favorite races.
 */
var races = (function () {

    // Get the url parameters so we can see race details much easier
    var urlParams = new URLSearchParams(location.search);

    return {

        /**
         * Race Controller, check member is logged in, if not load the auth module
         * if logged in continue and load the content.
         * Asynchronous function so we can await for the content to be loaded
         * before continuing.
         */
        controller: async function () {
            // If logged in return to welcome
            if (!engr.loggedIn()) {
                // Load the authenticate module
                engr.loadModule('auth');
                // If the auth module did not load, return to stop the rest of this script loading
                return;
            }

            // Load the race list
            await engr.loadContent('races', 'content');

            // Get the races from external source
            this.outputRaces();
        },

        outputRaces: function (favoritesOnly = false) {
            // Always clear the table first
            // TO DO: Remove a selected rows rather than rebuilding the table
            helpers.tableClearContents('viewRaces');

            // Declare this so we can use it inside the useData function
            var self = this;

            // After we get the data it will call this function
            function useData(data) {

                // Order the data by date
                data.sort(function (b, a) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                });

                // Retrieve my favorite races
                var myFav = storage.get('user_fav');

                // Output the data into a table
                data.forEach(function (e) {

                    // If we are filtering for favorites check if we show it
                    if (favoritesOnly && myFav.includes(e.id) || !favoritesOnly) {

                        if (myFav.includes(e.id)) {
                            var fav_icon = 'fas fa-star gold';
                            var fav_onclick = 'races.removeFavorite(' + e.id + ')';
                        } else {
                            var fav_icon = 'far fa-star';
                            var fav_onclick = 'races.addFavorite(' + e.id + ')';
                        }

                        // generate the options
                        let options = '<a onclick="' + fav_onclick + '"><i class="' + fav_icon + '"></i></a> <a onclick="races.details(' + e.id + ')"><i class="fas fa-info-circle"></i></a>';

                        // Use the helpers create row function
                        helpers.tableCreateNewRow('viewRaces', [e.race_name, self._kmToMarathon(e.distance), e.date, options]);
                    }
                });
            }

            // Create a table head
            helpers.createTHEAD('viewRaces', ['Name', 'Distance', 'Date', 'Options']);

            // Get all the races then use a callback function useData()
            helpers.requestHttpXML('https://u0012604.scm.tees.ac.uk/CIS1003/TRARaces/api/races/upcoming.json', useData);
        },

        // Convert km to marathons, as seen on barry's screenshot
        _kmToMarathon: function (distance) {
            // Convert the distance into km
            km = distance / 1000;

            // Anything over 42.2 is classed as an ultra marathon
            if (km > 42.2) {
                return 'Ultramarathon';
            }
            // Over 21.1 but less than 42.2 is a marathon
            if (km > 21.1) {
                return 'Marathon';
            }
            // Over 10 but less than 21.1 is a half marathon
            if (km > 10) {
                return 'Half Marathon';
            }
            // 10 km run
            if (km == 10) {
                return '10km';
            }
            // Any less just return the km
            return km + 'km';
        },

        /**
         * Add a favorite id to the storage and table
         * @param {int} id 
         */
        addFavorite: function (id) {
            // Get current favorites and parse it
            var favorites = JSON.parse(storage.get('user_fav'));

            // Check if the id is already included, if so just return
            if (favorites.includes(id)) {
                return;
            }
            // Add the id to our new array
            favorites.push('' + id + '');

            // Set the new favorites storage
            storage.set('user_fav', favorites);

            // we will need to reload the table
            this.outputRaces();
        },

        /**
         * Remove a favorite from the storage and the table
         * @param {int} id 
         */
        removeFavorite: function (id) {
            // Get current favorites and parse it
            var favorites = JSON.parse(storage.get('user_fav'));

            // Check if the id is already included, if so just return
            if (favorites.includes(id)) {
                return;
            }
            // Add the id to our new array
            favorites = helpers.deleteFromArray(favorites, id.toString());

            // Set the new favorites storage
            storage.set('user_fav', favorites);

            // we will need to reload the table
            this.outputRaces();
        },

        /* --- --- --- --- Race Details Section --- --- --- --- 
         * Because race details dont need to use the storage we make this
         * available to use without the controller, simply loads the details
         * and map and displays them, a fallback if statement is needed to remove
         * category and add favorites if the member is not logged in.
         */

        /**
         * Starts with opening a new window
         * Pass the ID using a query string
         * @param {int} raceId 
         */
        details: function (raceId) {

            // Define the width of the window
            let dWidth = 700;
            // Define the height of the window
            let dHeight = 500;

            // Calculate the center of the screen
            var x = screen.width / 2 - dWidth / 2;
            var y = screen.height / 2 - dHeight / 2;

            // Open the window adding the query strings and options
            window.open('partials/race-details.html?race=' + raceId, 'Race Details', 'height=' + dHeight + ',width=' + dWidth + ',left=' + x + ',top=' + y);
        },

        /**
         * Once the map is loaded from google this callback function is called
         * and now we know the map is ready we can move on.
         */
        mapApiLoaded: function () {
            // Call the details controller
            this._detailsWindow();
        },

        /**
         * Show the race details
         */
        _detailsWindow: function () {
            // Declare this so we can use it inside the displayData function
            var self = this;

            // Callback function to output the map (view)
            function displayData(data) {
                // Display the race name
                document.getElementById('raceName').innerHTML = data.race_name;
                // Display the distance but first calculate what marathon it is
                document.getElementById('raceDistance').innerHTML = self._kmToMarathon(data.distance);
                // Get and display the race category
                self._ageCategory('raceCategory', data.id);
                // Display the venue/location name
                document.getElementById('raceVenue').innerHTML = data.venue_name;

                // Begin the loading of the map and pass the geo codes through
                self._googleMap(data.geoloc_start, data.geoloc_end, data.venue_name);
            }

            // Get the current selected race from the data (model)
            function sortData(data) {
                // Loop through the data until we find the ID from the query string
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === urlParams.get('race')) {
                        // Send the data to display data function
                        displayData(data[i]);
                    }
                }
            }

            // Get all the races then use a callback function useData()
            helpers.requestHttpXML('https://u0012604.scm.tees.ac.uk/CIS1003/TRARaces/api/races/upcoming.json', sortData);
        },



        _ageCategory: function (elementId, raceId = 1) {
            function returnData(data) {
                document.getElementById(elementId).innerHTML = data.age_cat_code;
            }

            // Get all the races then use a callback function useData()
            helpers.requestHttpXML('https://u0012604.scm.tees.ac.uk/CIS1003/UKAthletics/api/age_categories.json?gender=' + storage.get('gender').charAt(0) + '&age=' + helpers.calculateAge(storage.get('dob')) + '&race_id=' + raceId, returnData);
        },

        /**
         * 
         * @param {string} start 
         * @param {string} end 
         * @param {string} raceVenue 
         */
        _googleMap: function (start, end, raceVenue) {

            // Split the geocodes into two
            start = start.split(",");
            end = end.split(",");

            // Set the start and end latitude and longitude
            var startLat = Number(start[0]),
                startLng = Number(start[1]),
                endLat = Number(end[0]),
                endLng = Number(end[1]);

            // Declare the map variable
            var map;

            // Initialize the map
            function initMap() {

                // Set the start geocodes
                var myLatLng = {
                    lat: startLat,
                    lng: startLng
                };
                // Set the end geocodes
                var myLatLng2 = {
                    lat: endLat,
                    lng: endLng
                };
                // Build the map 
                map = new google.maps.Map(document.getElementById('race-map'), {
                    center: myLatLng,
                    zoom: 8
                });

                // Add the starting marker
                var marker1 = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: raceVenue
                });

                // Add the end marker
                var marker2 = new google.maps.Marker({
                    map: map,
                    position: myLatLng2,
                });

                // Draw a line between the two markers
                var pathBetween = new google.maps.Polyline({
                    path: [myLatLng, myLatLng2],
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                // Set the line to the map
                pathBetween.setMap(map);
            }

            // Call the initialize function
            initMap();
        }
    }
})();