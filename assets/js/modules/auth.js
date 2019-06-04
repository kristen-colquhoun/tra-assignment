/**
 * The auth module requests data from the member and deals with
 * authentication process.
 */
var auth = (function () {

    // The validation rules
    const validationRules = [
        // Required and must be mr, miss, mrs or dr
        ['title', 'required|is_match=mr.miss.mrs.dr'],
        // Required and must be a valid TRA number DDDD(gender)
        ['traNumber', 'required|traNum'],
        // Required and a valid name
        ['firstName', 'required|name'],
        // Required and a valid name
        ['lastName', 'required|name'],
        // Required and a valid date of birth
        ['dob', 'required|date'],
        // Required and must match either m or f
        ['gender', 'required|is_match=male.female']
    ];

    // Declare the validation icons
    const validationIcons = {
        'default': '<i class="fas fa-exclamation"></i>',
        'success': '<i class="fas fa-check"></i>',
        'error': '<i class="fas fa-exclamation-triangle"></i>',
    };

    return {

        controller: async function () {

            // If logged in return to welcome
            if (engr.loggedIn()) {
                // Load the authenticate module
                engr.loadModule('welcome');
                // Shouldnt be needed but just incase
                return;
            }

            // Load the validation script
            await engr.loadScript('validation');

            // Load the login form
            engr.loadContent('login');
        },

        login: function () {
            // Validate the data
            this._validation();
        },

        /**
         * Validate the form inputs
         * @param {array} arr
         */
        _validation: function () {

            // We need to use this. inside the foreach
            var self = this;

            // count how many errors we have
            var errors = 0;

            // Foreach validation rules
            validationRules.forEach(function (element) {

                // Request the current value
                var val = document.getElementsByName(element[0])[0].value

                // Split the second level into segments
                var validate = element[1].split('|');

                // For each rule ie required 
                for (i = 0; i < 2; i++) {
                    // Check if the validate needs extra brackets
                    var extra = validate[i].split('=');

                    // If the extra[1] exists we have extra data to send to validation ie is_match=m.f (m.f being extra[1])
                    if (extra[1]) {
                        // if the validation contains an extra value for example is_match needs to know what its matching, that happens here.
                        if (!validation[extra[0]](val, extra[1])) {
                            // Update the forms so the member knows its wrong
                            self._formChangeIcon(element[0], 'error');
                            errors++;
                        } else {
                            // Remove the error incase its been corrected
                            self._formChangeIcon(element[0], 'success');

                            // Add to the storage as we go along, the final data will be the one that matters so this does not harm
                            storage.set(element[0], val);
                        }
                        // If not extra[1] then its a single rule ie dob
                    } else {
                        if (!validation[validate[i]](val)) {
                            // Update the forms so the member knows its wrong
                            self._formChangeIcon(element[0], 'error');
                            errors++;
                        } else {
                            // Remove the error incase its been corrected
                            self._formChangeIcon(element[0], 'success');

                            storage.set(element[0], val);
                        }
                    }
                }


            });
            // if we have no errors return true so we can move on
            if (errors < 1) {
                // No errors to report, we are now ready to be authenticated
                this._loginUser();
            }
        },

        _formChangeIcon: function (inputID, newIcon) {
            // Get the element by the ID which is the whole div
            let element = document.getElementById(inputID)

            // Change the border on the form
            if(newIcon === 'success') {
                // Remove the old first
                element.classList.remove("error");
                // Add the new
                element.classList.add("success");
            } else {
                // Remove the old first
                element.classList.remove("success");
                // Add the new
                element.classList.add("error");
            }
            
            // Gender has no icon
            if (inputID === 'gender') {
                return;
            }
            // Replace the icon with the new one
            element.getElementsByClassName("validateIcon")[0].innerHTML = validationIcons[newIcon];
        },

       /**
         * This will be called once everything has been validated
         */
        _loginUser: function () {
             // set the user as logged in
            storage.set('loggedIn', true);
             // set the users favorite races
            storage.set('user_fav', []);

            // Leave here and move back to welcome
            engr.loadModule('welcome');
        },
    }

})();