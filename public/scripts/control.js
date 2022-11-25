dayjs.extend(window.dayjs_plugin_quarterOfYear)
const chartporcentaje = () => {
    //función que manda la petición asíncrona
    fetch('/control/porcentajesecobra', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(result => {
        return result.json(); //Regresa otra promesa
    }).then(data => {
        var options = {
                series: [data.porcentaje],
                chart: {
                type: 'radialBar',
                offsetY: 0,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 2, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                        show: false
                    },
                    value: {
                        offsetY: -1,
                        fontSize: '22px'
                    }
                    }
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                },
            },
            labels: ['Average Results'],
        };
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    }).catch(err => {console.log(err);});
};

chartporcentaje();

const chartfallacomun = () => {
    //función que manda la petición asíncrona
    fetch('/control/fallascomunes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(result => {
        return result.json(); //Regresa otra promesa
    }).then(data => {
        var options2 = {
            series: data[0].nf,
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: data[0].f,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
        chart2.render();
    }).catch(err => {console.log(err);});
};

chartfallacomun();

const charthist = () => {
    //función que manda la petición asíncrona
    fetch('/control/fallascomunes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(result => {
        return result.json(); //Regresa otra promesa
    }).then(data => {
        
        var options3 = {
            series: [{
                name: "sales",
                data: [{
                    x: '2019/01/01',
                    y: 400
                }, {
                    x: '2019/04/01',
                    y: 430
                }, {
                    x: '2019/07/01',
                    y: 448
                }, {
                    x: '2019/10/01',
                    y: 470
                }, {
                    x: '2020/01/01',
                    y: 540
                }, {
                    x: '2020/04/01',
                    y: 580
                }, {
                    x: '2020/07/01',
                    y: 690
                }, {
                    x: '2020/10/01',
                    y: 690
                }]
            }],
            chart: {
                type: 'bar',
                height: 500
            },
            xaxis: {
                type: 'category',
                labels: {
                    formatter: function(val) {
                        return "Q" + dayjs(val).quarter() + " " + dayjs(val).format("YYYY")
                    }
                },
                group: {
                    style: {
                        fontSize: '10px',
                        fontWeight: 700
                    },
                }
            },
            title: {
                text: 'Grouped Labels on the X-axis',
            },
            tooltip: {
                x: {
                    formatter: function(val) {
                        return "Q" + dayjs(val).quarter() + " " + dayjs(val).format("YYYY")
                    }  
                }
            },
        };
        var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
        chart3.render();
    }).catch(err => {console.log(err);});
};

charthist();
