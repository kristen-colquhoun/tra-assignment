/**
 * I call this file the engineer class
 * All my code should begin here, this file changes modules 
 * loads the required classes needed such as array class url
 * and other custom made scripts.
 * 
 */
var engr = (function () {

    // The current module is stored here, welcome is default
    var currentModule = 'welcome';

    // JS files already loaded
    var scriptsLoaded = [];

    return {

        /**
         * Begin the application
         */
        initiate: function () {
            // Load the scripts needed for all
            // TO DO: make this function accept arrays so we have:
            //this.loadScript(array('helpers', 'storage'));
            this.loadScript('helpers');
            this.loadScript('storage');

            // Send the current (default) module to loadModule
            this.loadModule(currentModule);
        },

        /**
         * Check the member is authenticated, if not we switch modules
         */
        loggedIn: function () {
            // Look for the users loggedIn key
            if (storage.get('loggedIn')) {
                // If we are logged in display the member box ( this will load asynchronous while the rest continues )
                this.loadMemberBox('memberBox', 'member');

                // Let the script to continue
                return true;
            }
            // Return false we are not logged in
            return false;
        },

        loadMemberBox: async function () {
            // If we are logged in display the member box
            await this.loadContent('memberBox', 'member');
            // Add title to the member box
            document.getElementById('mb-title').innerHTML = storage.get('title');
            // Add first name to the member box
            document.getElementById('mb-fname').innerHTML = storage.get('firstName');
            // Add last name to the member box
            document.getElementById('mb-lname').innerHTML = storage.get('lastName');
        },

        /**
         * Check if it needs loading then call the module controller
         * @param {string} module - The module we are loading 
         */
        loadModule: async function (module) {

            // Load the controller, this is in a function because it can be called two ways
            function loadController(module) {
                // Use window[] to reference the module
                window[module].controller();
            }

            // Load the script but await response before moving on
            await this.loadScript(module, 'modules');

            // Once loaded simply call the controller
            loadController(module);

            // Set the current module
            currentModule = module;

        },

        /**
         * Load the script needed, if already loaded just call the controller
         * @param {string} script 
         * @param {string}} location 
         */
        loadScript: function (script, location) {

            // Dont load it again if we already have it loaded
            if (scriptsLoaded.includes(script)) {
                // Already loaded call the controller
                return;
            }

            // We have not used this one yet so load it
            return this.createScript(script, location);

        },

        /**
         * Creat the script in the head of the page
         * @param {string} scriptName 
         * @param {string} location 
         */
        createScript: function (scriptName, location = 'core') {
            // The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.
            return new Promise(function (resolve, reject) {

                // Create the script element
                var script = document.createElement('script');
                // Set the scrips src
                script.src = 'assets/js/' + location + '/' + scriptName + '.js';
                script.onload = resolve;
                script.onerror = reject;
                // Add the script to the head
                document.head.appendChild(script);

                // Add to the scriptsLoaded array so we dont load twice
                scriptsLoaded.push(scriptName);
            });
        },

        /**
         * Load content on to the page replacing the old
         * @param {string} content 
         * @param {string} where 
         */
        loadContent: function (content, where = 'content') {

            // The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.
            return new Promise(function (resolve, reject) {
                // Initializes an XMLHttpRequest
                var xmr = new XMLHttpRequest();
                // Request the file we are loading
                xmr.open('GET', 'partials/' + content + '.html');

                xmr.onload = resolve;
                xmr.onerror = reject;

                xmr.onreadystatechange = function () {
                    document.getElementById(where).innerHTML = xmr.responseText;
                }
                xmr.send();
            });
        }

    }
})();

engr.initiate();