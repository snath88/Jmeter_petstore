/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "T02_Enter_the_Store"], "isController": true}, {"data": [1.0, 500, 1500, "T11_Sign_Out"], "isController": true}, {"data": [1.0, 500, 1500, "launch-1"], "isController": false}, {"data": [1.0, 500, 1500, "T01_Launch"], "isController": true}, {"data": [1.0, 500, 1500, "T11_Return_to_Main_Menu"], "isController": true}, {"data": [1.0, 500, 1500, "Click Fish-33"], "isController": false}, {"data": [1.0, 500, 1500, "Confirm-43"], "isController": false}, {"data": [1.0, 500, 1500, "T03_Click_Sign_In"], "isController": true}, {"data": [1.0, 500, 1500, "Click Sign In-24"], "isController": false}, {"data": [1.0, 500, 1500, "T04_Login"], "isController": true}, {"data": [1.0, 500, 1500, "Add to cart-37"], "isController": false}, {"data": [1.0, 500, 1500, "Return to Main Menu-44"], "isController": false}, {"data": [1.0, 500, 1500, "T07_Add_to_cart"], "isController": true}, {"data": [1.0, 500, 1500, "Proceed to Checkout-39"], "isController": false}, {"data": [1.0, 500, 1500, "T09_Continue"], "isController": true}, {"data": [1.0, 500, 1500, "Login-28"], "isController": false}, {"data": [1.0, 500, 1500, "Enter the Store-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-29"], "isController": false}, {"data": [1.0, 500, 1500, "Continue-42"], "isController": false}, {"data": [1.0, 500, 1500, "T05_Click Fish"], "isController": true}, {"data": [1.0, 500, 1500, "Sign Out-45"], "isController": false}, {"data": [1.0, 500, 1500, "Login-28-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-28-0"], "isController": false}, {"data": [1.0, 500, 1500, "Choose a Product-35"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out-46"], "isController": false}, {"data": [1.0, 500, 1500, "T10_Confirm"], "isController": true}, {"data": [1.0, 500, 1500, "Sign Out-45-0"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "T08_Proceed_to_Checkout"], "isController": true}, {"data": [1.0, 500, 1500, "Sign Out-45-1"], "isController": false}, {"data": [1.0, 500, 1500, "T06_Choose_Product"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 57, 0, 0.0, 52.84210526315789, 0, 437, 40.0, 79.40000000000002, 129.19999999999976, 437.0, 2.0802160505091054, 7.980647946242838, 1.9524478463377248], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["T02_Enter_the_Store", 3, 0, 0.0, 41.666666666666664, 40, 43, 42.0, 43.0, 43.0, 43.0, 9.09090909090909, 48.10901988636363, 6.516335227272727], "isController": true}, {"data": ["T11_Sign_Out", 3, 0, 0.0, 117.33333333333333, 114, 119, 119.0, 119.0, 119.0, 119.0, 8.064516129032258, 76.77828881048387, 19.184727822580644], "isController": true}, {"data": ["launch-1", 3, 0, 0.0, 243.0, 125, 437, 167.0, 437.0, 437.0, 437.0, 4.126547455295736, 5.8110170220082535, 2.8853593535075652], "isController": false}, {"data": ["T01_Launch", 3, 0, 0.0, 243.0, 125, 437, 167.0, 437.0, 437.0, 437.0, 3.8809831824062098, 5.4652126455368695, 2.7136562095730916], "isController": true}, {"data": ["T11_Return_to_Main_Menu", 3, 0, 0.0, 42.666666666666664, 40, 44, 44.0, 44.0, 44.0, 44.0, 9.900990099009901, 47.35844678217822, 8.044554455445544], "isController": true}, {"data": ["Click Fish-33", 3, 0, 0.0, 38.666666666666664, 38, 39, 39.0, 39.0, 39.0, 39.0, 9.868421052631579, 36.80419921875, 8.085552014802632], "isController": false}, {"data": ["Confirm-43", 3, 0, 0.0, 41.333333333333336, 40, 42, 42.0, 42.0, 42.0, 42.0, 9.836065573770492, 49.334016393442624, 7.972592213114754], "isController": false}, {"data": ["T03_Click_Sign_In", 3, 0, 0.0, 40.333333333333336, 38, 43, 40.0, 43.0, 43.0, 43.0, 9.230769230769232, 34.70853365384615, 7.797475961538462], "isController": true}, {"data": ["Click Sign In-24", 3, 0, 0.0, 40.333333333333336, 38, 43, 40.0, 43.0, 43.0, 43.0, 9.09090909090909, 34.18264678030303, 7.679332386363636], "isController": false}, {"data": ["T04_Login", 3, 0, 0.0, 120.0, 111, 125, 124.0, 125.0, 125.0, 125.0, 7.5, 73.3447265625, 22.822265625], "isController": true}, {"data": ["Add to cart-37", 3, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 9.933774834437086, 44.22664010761589, 8.468931084437086], "isController": false}, {"data": ["Return to Main Menu-44", 3, 0, 0.0, 42.666666666666664, 40, 44, 44.0, 44.0, 44.0, 44.0, 9.868421052631579, 47.20266241776316, 8.018092105263158], "isController": false}, {"data": ["T07_Add_to_cart", 3, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 9.933774834437086, 44.22664010761589, 8.468931084437086], "isController": true}, {"data": ["Proceed to Checkout-39", 3, 0, 0.0, 39.333333333333336, 38, 40, 40.0, 40.0, 40.0, 40.0, 9.900990099009901, 51.36138613861386, 8.247602103960396], "isController": false}, {"data": ["T09_Continue", 3, 0, 0.0, 43.333333333333336, 40, 45, 45.0, 45.0, 45.0, 45.0, 9.933774834437086, 43.09162872516556, 14.008174668874172], "isController": true}, {"data": ["Login-28", 3, 0, 0.0, 81.0, 73, 85, 85.0, 85.0, 85.0, 85.0, 8.547008547008549, 42.70165598290598, 18.57138087606838], "isController": false}, {"data": ["Enter the Store-7", 3, 0, 0.0, 41.666666666666664, 40, 43, 42.0, 43.0, 43.0, 43.0, 9.00900900900901, 47.67560529279279, 6.457629504504504], "isController": false}, {"data": ["Login-29", 3, 0, 0.0, 39.0, 38, 40, 39.0, 40.0, 40.0, 40.0, 9.900990099009901, 47.35844678217822, 8.615021658415841], "isController": false}, {"data": ["Continue-42", 3, 0, 0.0, 43.333333333333336, 40, 45, 45.0, 45.0, 45.0, 45.0, 9.868421052631579, 42.80813116776316, 13.916015625], "isController": false}, {"data": ["T05_Click Fish", 3, 0, 0.0, 38.666666666666664, 38, 39, 39.0, 39.0, 39.0, 39.0, 9.900990099009901, 36.92566522277228, 8.112237004950495], "isController": true}, {"data": ["Sign Out-45", 3, 0, 0.0, 76.66666666666667, 74, 78, 78.0, 78.0, 78.0, 78.0, 9.345794392523365, 45.82542348130841, 14.84922605140187], "isController": false}, {"data": ["Login-28-1", 3, 0, 0.0, 38.333333333333336, 36, 40, 39.0, 40.0, 40.0, 40.0, 9.803921568627452, 46.89414828431373, 9.373085171568627], "isController": false}, {"data": ["Login-28-0", 3, 0, 0.0, 40.666666666666664, 36, 43, 43.0, 43.0, 43.0, 43.0, 9.554140127388534, 2.033986863057325, 11.625447850318471], "isController": false}, {"data": ["Choose a Product-35", 3, 0, 0.0, 39.0, 38, 40, 39.0, 40.0, 40.0, 40.0, 9.933774834437086, 38.7747050910596, 8.449529180463577], "isController": false}, {"data": ["Sign Out-46", 3, 0, 0.0, 40.666666666666664, 40, 41, 41.0, 41.0, 41.0, 41.0, 10.380622837370241, 47.92928200692042, 8.201097534602077], "isController": false}, {"data": ["T10_Confirm", 3, 0, 0.0, 41.333333333333336, 40, 42, 42.0, 42.0, 42.0, 42.0, 10.06711409395973, 50.492869127516784, 8.159867869127517], "isController": true}, {"data": ["Sign Out-45-0", 3, 0, 0.0, 36.666666666666664, 36, 37, 37.0, 37.0, 37.0, 37.0, 10.60070671378092, 2.2567910777385163, 8.468142667844523], "isController": false}, {"data": ["Debug Sampler", 3, 0, 0.0, 2.0, 0, 3, 3.0, 3.0, 3.0, 3.0, 12.711864406779663, 23.18508342161017, 0.0], "isController": false}, {"data": ["T08_Proceed_to_Checkout", 3, 0, 0.0, 39.333333333333336, 38, 40, 40.0, 40.0, 40.0, 40.0, 10.033444816053512, 52.04849498327759, 8.357937918060202], "isController": true}, {"data": ["Sign Out-45-1", 3, 0, 0.0, 39.666666666666664, 37, 41, 41.0, 41.0, 41.0, 41.0, 10.56338028169014, 49.54679247359155, 8.345483054577466], "isController": false}, {"data": ["T06_Choose_Product", 3, 0, 0.0, 39.0, 38, 40, 39.0, 40.0, 40.0, 40.0, 9.868421052631579, 38.51960834703947, 8.393940172697368], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 57, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
