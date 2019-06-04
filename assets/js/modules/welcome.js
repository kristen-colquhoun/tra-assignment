/**
 * The welcome module is default and displays a welcome message
 * it requires you to be authorised or you get thrown back to 
 * the login module.
 */
var welcome = (function () {

    return {

        controller: async function () {

            // If logged in return to welcome
            if (!engr.loggedIn()) {
                // Load the authenticate module
                engr.loadModule('auth');
                // Shouldnt be needed but just incase
                return;
            }

            // Load the login form
            await engr.loadContent('welcome', 'content');

            // Add first name to the welcome message
            document.getElementById('w-fname').innerHTML = storage.get('firstName');

            // Add gender to the are we correct message
            document.getElementById('w-category').innerHTML = this._ageCategory();

            // Show the age of the member
            document.getElementById('w-age').innerHTML = helpers.calculateAge(storage.get('dob'));

            // Add gender to the are we correct message
            document.getElementById('w-tra').innerHTML = storage.get('traNumber');
        },

        /**
         * Display the age category on the welcome screen
         */
        _ageCategory: function () {

            fetch('https://u0012604.scm.tees.ac.uk/CIS1003/UKAthletics/api/age_categories.json?gender=' + storage.get('gender').charAt(0) + '&age=' + helpers.calculateAge(storage.get('dob')) + '&race_id=1').then(
                function (response) {
                    return response.json();
                }
            ).then(function (jsonData) {
                document.getElementById('w-category').innerHTML = jsonData.age_cat_code;
            });

        }
    }

})();