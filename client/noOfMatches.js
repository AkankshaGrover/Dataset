
$(document).ready(function () {
    //debugger;

    fetch("http://localhost:3000")
        .then((res) => res.json())

        .then(function (info) {
            //debugger;
            $('#container').highcharts({
                chart: {
                    type: 'line'
                },

                title: {
                    text: 'Number of matches played per year'
                },

                xAxis: {
                    type: 'category',
                    title: { test: "" },
                    //categories: [JSON.parse(info.Object.keys(info))],
                    categories: Object.keys(info).map((key) => Number(key))
                },
                yAxis: {
                    title: { test: "" },
                    categories: Object.values(info)
                },
                series: [{
                    name: 'year',
                    data: Object.values(info),
                }]
            })

        })

})


