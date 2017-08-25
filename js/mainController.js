var app = angular.module('myApp', ['nvd3']);

app.controller('MainCtrl', function($http,$rootScope,$scope) {
    var vm=this;
    vm.load = false
    console.log(vm.load)
    vm.dashboard = dashboard;
    vm.getData = getData;
    initController();

    function initController() {
      dashboard();
    }   
    function getData(data){
        dashboard(data)
    }
    
    function dashboard(data){
        var year = data
        $http.get('csv/matches.csv').success(function(allText) {
            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');
            vm.matches = [];
            for ( var i = 0; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                 vm.matches.push(data);
            }
        
            $http.get('csv/deliveries.csv').success(function(Text) {
                var dataTextLines = Text.split(/\r\n|\n/);
                var header = dataTextLines[0].split(',');
                vm.deliveries = [];
                for ( var i = 0; i < dataTextLines.length; i++) {
                    // split content based on comma
                    var data1 = dataTextLines[i].split(',');
                        vm.deliveries.push(data1);
                }
                var matches = vm.matches;
                var deliveries= vm.deliveries
                var season_matches = { };
                for (var i = 1, j = matches.length-1; i < j; i++) {
                    if (season_matches[matches[i][1]]) {
                        season_matches[matches[i][1]]++;
                    }
                    else {
                        season_matches[matches[i][1]] = 1;
                    } 
                }
                
                var season_total = []
                for(var i in season_matches){
                    if(i!=""){
                        season_total.push({"key":i,"times":season_matches[i]})
                    }
                }
                var i=1;
                while(matches[i][1]!=year){
                    i++
                }
                var teams_y = [];
                var winners = []
                var j=i
                var totalMatches = 0;
                var match_id = [];
                toss_win = [];
                vm.match_data=[]

                if(!year){
                    for (var i = 1, j = matches.length-1; i < j; i++) {
                        vm.match_data.push({"team1":matches[i][4],"team2":matches[i][5],"winner":matches[i][10],"player":matches[i][13],"run":matches[i][11],"wkt":matches[i][12]})
                        teams_y.push(matches[i][4],matches[i][5]);
                        match_id.push({"id":matches[i][0]})
                        if(matches[i][10]!="")
                        winners.push(matches[i][10])
                        if((matches[i][6]==matches[i][10]) && (matches[i][10]!=null ||matches[i][10]!="")){
                            toss_win.push(matches[i][10])
                        }
                        totalMatches++
                    }
                 
                }
                else{
                    while(matches[i][1]==year) {
                        teams_y.push(matches[i][4],matches[i][5]);
                        vm.match_data.push({"team1":matches[i][4],"team2":matches[i][5],"winner":matches[i][10],"player":matches[i][13],"run":matches[i][11],"wkt":matches[i][12]})
                        match_id.push({"id":matches[i][0]});
                        if(matches[i][10]!="")
                        winners.push(matches[i][10])
                        if((matches[i][6]==matches[i][10]) && (matches[i][10]!=null ||matches[i][10]!="")){
                                toss_win.push(matches[i][10])
                            }
                        totalMatches++
                        i++;
                    }
                }
                vm.load = true
                var toss_arr = {};
                for (var i = 0, j = toss_win.length; i < j; i++) {
                    if (toss_arr[toss_win[i]]) {
                        toss_arr[toss_win[i]]++; 
                    }
                    else {
                      toss_arr[toss_win[i]] = 1;
                    } 
                }
                var toss_winner = [];
                for(var i in toss_arr){
                    if(i!=""){
                        toss_winner.push({"key":i,"times":toss_arr[i]})
                    }
                }
                var matchesPlayed = {};
                for (var i = 0, j = teams_y.length; i < j; i++) {
                    if (matchesPlayed[teams_y[i]]) {
                        matchesPlayed[teams_y[i]]++; 
                    }
                    else {
                        matchesPlayed[teams_y[i]] = 1;
                    } 
                }
                var totalMatchesPlayed = [];
                for(var i in matchesPlayed){
                    if(i!=""){
                        totalMatchesPlayed.push({"key":i,"times":matchesPlayed[i]})
                    }
                }
                var matchesWonArr = {};
                for (var i = 0, j = winners.length; i < j; i++) {
                    if (matchesWonArr[winners[i]]) {
                    matchesWonArr[winners[i]]++; 
                    }
                    else {
                      matchesWonArr[winners[i]] = 1;
                    } 
                }
                var matchesWon = []
                for(var i in matchesWonArr){
                    if(i!=""){
                        matchesWon.push({"key":i,"times":matchesWonArr[i]})
                    }
                }
                var i = 1;
                var batsman=[];
                var bowlers = []
                var total_score = 0;
                while(deliveries[i][0]!=match_id[0].id){
                    i++
                }
                for(k=0;k<match_id.length;k++){
                    while(deliveries[i][0]==match_id[k].id){
                        total_score = +total_score + +deliveries[i][17]
                        batsman.push([deliveries[i][6],deliveries[i][17]]);
                        bowlers.push([deliveries[i][8],deliveries[i][16]]);
                        i++;
                    }
                }

                vm.total_Matches=totalMatches;
                vm.totalScore = total_score

                var sum = {},result;
                for (var i=0,c;c=batsman[i];++i) {
                    if ( undefined === sum[c[0]] ) {        
                       sum[c[0]] = c;
                    }
                    else {
                        sum[c[0]][1] = +sum[c[0]][1]+ +c[1];
                    }
                }
                result = Object.keys(sum).map(function(val) { return sum[val]});
                result.sort(function(a,b){
                    return a[1] - b[1];
                });
                var sum1 = {},result1;

                for (var i=0,c;c=bowlers[i];++i) {
                    if ( undefined === sum1[c[0]] ) {        
                       sum1[c[0]] = c;
                    }
                    else {
                        sum1[c[0]][1] = +sum1[c[0]][1]+ +c[1];
                    }
                }
                result1 = Object.keys(sum1).map(function(val) { return sum1[val]});
                result1.sort(function(a,b){
                    return a[1] - b[1];
                });

                //Horizontal Bar for Top 10 Batsman

                vm.options = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 450,
                        paddingleft: 20,
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        valueFormat: function(d){
                            return d3.format('d')(d);
                        },
                        showControls: true,
                        showValues: true,
                        duration: 500,
                        yAxis: {
                            tickFormat: function(d){
                                return d3.format('.f')(d);
                            }
                        }
                    }
                };

                vm.data2 = [];
                var value = []
                for(i=result.length-1;i>result.length-12;i--){
                    if(result[i][0]==undefined || result[i][1]==undefined){
                    }
                    else{
                        value.push({"label":result[i][0],"value":result[i][1]}) 
                    }
                }
                vm.data=[]
                vm.data.push({"color": "#1f77b4","values":value})
                vm.options2 = vm.options;
                vm.data2= vm.data

                //Line Chart for Season Wise matches

                vm.options = {
                    chart: {
                    type: 'lineChart',
                    height: 450,
                    width:950,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function(d){ return d.x; },
                    y: function(d){ return d.y; },
                    useInteractiveGuideline: true,
                    
                    yAxis: {
                        tickFormat: function(d){
                            return d3.format('.f')(d);
                        },
                    },
                }                
            };

            vm.data = line();
            vm.data5=vm.data;
            vm.options5 = vm.options
              
            /* Data Generator */
            function line() {
               cos = [];
                //Data is represented as an array of {x,y} pairs.
                for(i=0;i<season_total.length;i++){
                        cos.push({x:season_total[i].key,y:season_total[i].times})
                }
                //Line chart data should be sent as an array of series objects.
                return [
                    
                    {
                        values: cos,
                        key: 'Total Matches',
                        color: '#2ca02c',
                        area:true
                    },
                   
                ];
            };

                        //Pie Chart for Winning %

                vm.options = {
                    chart: {
                        type: 'pieChart',
                        height: 450,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: true,
                        valueFormat: function(d){
                            return d3.format(".02f")(d)+'%';
                        },
                        duration: 500,
                        labelThreshold: 0.01,
                        labelType: 'value',
                        labelSunbeamLayout: true,
                        showLegend: true,
                    }
                };
                vm.data1 = []
                for(i=0;i<totalMatchesPlayed.length;i++){
                    if(matchesWon[i].key==totalMatchesPlayed[i].key){
                        vm.percentage=(matchesWon[i].times*100)/totalMatchesPlayed[i].times;
                        vm.data1.push({"key":matchesWon[i].key,"y":vm.percentage});
                    }
                    else{
                        var j=0;
                        while(matchesWon[i].key!=totalMatchesPlayed[j].key){
                            j++
                        }
                    vm.percentage=(matchesWon[i].times*100)/totalMatchesPlayed[j].times;
                    vm.data1.push({"key":matchesWon[i].key,"y":vm.percentage});
                    }
                }
                vm.data = vm.data1
                vm.data1 = vm.data;
                vm.options1 = vm.options

                //Vertical Bar Chart for extra runs by bowler

                vm.options = {
                    chart: {
                        type: 'discreteBarChart',
                        height: 300,
                        margin : {
                            top: 20,
                            right: 20,
                            bottom: 50,
                            left: 55
                        },
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        showValues: true,
                        valueFormat: function(d){
                            return d3.format('d')(d);
                        },
                        duration: 500,
                        yAxis: {
                            tickFormat: function(d){
                                    return d3.format('.f')(d);
                                },
                        }
                    }
                };
                var value1 = []
                for(i=result1.length-1;i>result1.length-12;i--){
                    if(result1[i][0]==undefined || result1[i][1]==undefined){
                        console.log("skip")
                    }
                    else{
                    value1.push({"label":result1[i][0],"value":result1[i][1]})
                    }
                }
                vm.data=[]
                vm.data.push({"values":value1})
                vm.data3 = vm.data;
                vm.options3 = vm.options

                        //Horizontal Bar chart for Toss Winner

                vm.options = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 450,
                        margin : {
                            top: 20,
                            right: 20,
                            bottom: 50,
                        },
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        showControls: true,
                        valueFormat: function(d){
                            return d3.format('d')(d);
                        },
                        showValues: true,
                        showControl: true,
                        duration: 500,
                        yAxis: {
                            tickFormat: function(d){
                                return d3.format('d')(d);
                            }
                        }
                    }
                };
                var value1 = []
                for(i=0;i<toss_winner.length;i++){
                    
                    value1.push({"label":toss_winner[i].key,"value":toss_winner[i].times})
                }
                vm.data=[]
                vm.data.push({"color": "#A3E4D7","values":value1})
                vm.data4=vm.data
                vm.options4=vm.options
            });
        });
    }
});