/**
 * The validation class validates any form based on the conditions
 * and rules supplied to this function. All returns are boolean.
 */

var validation = (function () {

    return {

        /**
         * Check the value is alpha numeric
         * @param {string} value
         */
        alphanum: function (value) {
            // Check we have numbers and letters only /i means case-insensitive
            return /^[a-z0-9]+$/i.test(value);
        },

        /**
         * Input cannot be blank
         * @param {string} value
         */
        required: function (value) {
            // Remove spaces first
            value = value.replace(/\s/g, '');

            // If the value is more than blank we have something
            if (value.length > 0) {
                return true;
            }

            // the length is 0
            return false;
        },

        /**
         * Check we have a tra number match 4 letters followed by either m or f
         * @param {string} value
         */
        traNum: function (value) {
            // does the value contain 4 numbers followed by the gender
            return /^\d{4}[m|f|M|F]{1}$/.test(value);
        },

        /**
         * Check a correct name format is supplied
         * https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
         * @param {string} value
         */
        name: function (value) {
            // Any alpha characters but also include special characters
            return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,'-]+$/u.test(value);
        },

        /**
         * Returns true or false if the format is a valid date
         * @param {string} value 
         */
        date: function (value) {
            return /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/.test(value);
        },

        /**
         * Check the value matches something in the brackets
         * @param {string} need
         * @param {string} within
         */
        is_match: function (need, within) {
            // First split the matches into an array
            var tokens = within.split('.');
            // Loop through each item inside within
            for (var i = 0; i < tokens.length; ++i) {
                // If the item matches what we `need` then we are done
                if (tokens[i] === need.toLowerCase()) {
                    return true;
                }
            }
            // Once the loop is done we do not have a match
            return false;
        },
    }
})();