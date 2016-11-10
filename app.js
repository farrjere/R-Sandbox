/*
Data comes from https://stat.ethz.ch/R-manual/R-devel/library/MASS/html/biopsy.html
*/
var biopsyViewModel = function (data) {
    var _self = this;
    _self.SampleNumber = ko.observable(data.ID);
    _self.ClumpThickness = ko.observable(data.V1);
    _self.CellSizeUniformity = ko.observable(data.V2);
    _self.CellShapeUniformity = ko.observable(data.V3);
    _self.MarginalAdhesion = ko.observable(data.V4);
    _self.EpithelialCellSize = ko.observable(data.V5);
    _self.BareNuclei = ko.observable(data.V6);
    _self.BlandChromatin = ko.observable(data.V7);
    _self.NormalNucleoli = ko.observable(data.V8);
    _self.Mitoses = ko.observable(data.V9);
    _self.Class = ko.observable(data.class);
};

var ViewModel = function () {
    var self = this;
    self.biopsyData = ko.observableArray();
    self.valueCounts = ko.observableArray();
    self.error = ko.observable('');
    var opencpu_root = '/ocpu/library/appdemo/';
    var data_uri = opencpu_root+'data/biopsy/json';
    ocpu.seturl(opencpu_root+"/R");
    self.availableClasses = ko.observableArray();
    self.selectedClass = ko.observable();
    self.selectedClass.subscribe(function(){
        var classValues =  ko.utils.arrayMap(self.biopsyData(), function(item){return item[self.selectedClass()]();});
        var distinctValues = ko.utils.arrayGetDistinctValues(classValues);
        self.valueCounts([]);
        for(var i =0; i < distinctValues.length; i++){
            var distinctValue = distinctValues[i];
            var valueCount = ko.utils.arrayFilter(self.biopsyData(), function(item){return item[self.selectedClass()] == distinctValue;}).length;
            self.valueCounts.push({name : distinctValue, count: valueCount});
        }
        d3.select("svg").remove();
        var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

        svg.selectAll("*").remove();
        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        x.domain(['benign', 'malignant']);
        y.domain([0, 500]);
        g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          g.append("g")
              .attr("class", "axis axis--y")
              .call(d3.axisLeft(y).ticks(10))
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("Frequency");

          g.selectAll(".bar")
            .data(self.classCounts())
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.distinctValue); })
            .attr("y", function(d) { return y(d.count); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.count); });
    });

    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    self.getAllData = function() {
        ajaxHelper(data_uri, 'GET').done(function (json) {
            for (var i = 0; i < json.length; i++) {
                var item = new biopsyViewModel(json[i]);
                self.biopsyData.push(item);
            }
            ko.utils.arrayPushAll(self.availableClasses, self.Object.keys(json[0]));
            
            printsummary(json);
        });
    };


    function addD3Chart(){
        
    }

    function printsummary(mydata){
        //perform the request
        var req = ocpu.call("printsummary", {
          mydata : mydata
        }, function(session){
          session.getConsole(function(output){
            $("#output code").text(output);
          });
        }).fail(function(){
          alert("Server error: " + req.responseText);
        });        
  }
};



var vm = new ViewModel();
ko.applyBindings(vm);
vm.getAllData();


