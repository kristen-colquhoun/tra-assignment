/**
 * Helper class has functions I can use throughout to help
 */
var helpers = (function () {

    return {

        /**
         * Delete an item from an array
         * @param {array} arr 
         * @param {string} del 
         */
        deleteFromArray: function (arr, del) {

            // Find the key of the item
            let index = arr.indexOf(del);

            // If we fund the item
            if (index > -1) {
                // Splice it out
                arr.splice(index, 1);
            }

            // Return the new array
            return arr;
        },

        /**
         * Calculate the age from dob
         * 
         * @param {date} dob 
         */
        calculateAge: function (dob) {
            var today = new Date();
            var birthDate = new Date(dob);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },


        /** TABLE HELPERS */

        /**
         * Insert a heading into the table
         * @param {string} table - The table id
         * @param {array} headings 
         */
        createTHEAD: function (tableID, headings) {
            // Locate the table we are using
            var table = document.getElementById(tableID);

            // Create a <thead> element and add it to the table
            var header = table.createTHead();

            // Create an empty <tr> element
            var row = header.insertRow(0);


            for (var i = 0; i < headings.length; i++) {
                var cell = row.insertCell(i);
                cell.innerHTML = headings[i];
            }
        },

        /**
         * Insert a heading into the table
         * @param {string} table - The table id
         * @param {array} headings 
         */
        tableCreateNewRow: function (tableID, data) {
            // Locate the table we are using
            var table = document.getElementById(tableID);

            // Create a <thead> element and add it to the table
            var body = table.createTBody();

            // Create an empty <tr> element
            var row = body.insertRow(0);

            for (var i = 0; i < data.length; i++) {
                var cell = row.insertCell(i);
                cell.innerHTML = data[i];
            }
        },

        tableClearContents: function (tableID) {
            // First thing we do is clear the current table
            var table = document.getElementById(tableID);

            // remove every element from the table
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
        },
        requestHttpXML: function (url, done) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    done(JSON.parse(xhttp.responseText));
                }
            }
            xhttp.open("GET", url, true);
            xhttp.send();
        },


    }
})();