/**
 * The storage class handles cookies, sessions and local storage
 */
var storage = (function () {

    return {

        /**
         * Set to local storage
         * @param {string} name 
         * @param {string} set 
         */
        set: function (name, set) {
            // If its an array we need to make it a string
            if (Array.isArray(set)) {
                // Change the set value to a string
                set = JSON.stringify(set);
            }

            // Set the item into storage
            localStorage.setItem(name, set);
        },

        /**
         * Get from local storage
         * @param {string} name 
         */
        get: function (name) {
            // If the item exists
            if (localStorage.getItem(name)) {
                // Return it
                return localStorage.getItem(name);
            }
        },

        /**
         * Remove item from storage
         * @param {string} name 
         */
        delete: function (name) {
            // Remove an item by name
            localStorage.removeItem(name);
        },

        /**
         * Clear all local storage, used for logout
         */
        clear: function () {
            // Clear everything in the local storage
            localStorage.clear();

            // Reload the page to start fresh
            location.reload(); 
        }
    }
})();
