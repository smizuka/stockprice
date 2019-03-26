var chart_sim2 = null;

//銘柄比率を表示する
function bucknumber_chart1(datas){

    var BarDatas={
        type: "horizontalBar",
        data: {
            labels: ["選択１","選択２","選択３","選択４","選択５"],
            datasets:datas
        },
        options: {
            responsive: true,
            title: {
                display: true,
                // fontSize: 50,
                text: "各銘柄の比率"
            },
            legend: {
                position: 'bottom'
            },
            scales: {
                xAxes: [
                    {
                        stacked: true,
                        ticks: {
                            max: 1,
                            min: 0,
                            stepSize:0.2
                        },
                        gridLines: {
                          display: false,
                          drawBorder: true
                        }
                    }
                ],
                yAxes: [
                    {
                        stacked: true,
                        scaleLabel: {
                            fontSize: 100,
                        },
                        gridLines: {
                          display: false,
                          drawBorder: true
                        }
                    }
                ]
            }
        }
    };

    var ctx5 = $('#port-chart5')[0].getContext("2d");
    var chart5 = new Chart(ctx5,BarDatas);
};

//リスクとリターンを表示する
function bucknumber_chart2(data1,data2){
    var datas = [
    {
        label: 'リターン',
        data: data1,
        borderColor : "rgba(254,97,132,0.8)",
        backgroundColor : "rgba(254,97,132,0.5)",
    },
    {
        label: 'リスク',
        data: data2,
        borderColor : "rgba(54,164,235,0.8)",
        backgroundColor : "rgba(54,164,235,0.5)",
    },
    ]

    var BarDatas={
        type: "horizontalBar",
        data: {
            labels: ["選択１","選択２","選択３","選択４","選択５"],
            datasets:datas
        },
        options: {
            responsive: true,
            title: {
                display: true,
                // fontSize: 50,
                text: "リターンとリスク"
            },
            legend: {
                position: 'bottom'
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            max: 10,
                            min: -5,
                            stepSize:3
                        },
                        gridLines: {
                          display: false,
                          drawBorder: true
                        }
                    }
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            fontSize: 100,
                        },
                        gridLines: {
                          display: false,
                          drawBorder: true
                        }
                    }
                ]
            }
        }
    };

    var ctx6 = $('#port-chart6')[0].getContext("2d");
    var chart6 = new Chart(ctx6,BarDatas);
};

//シミュレーション結果を表示する
function bucknumber_chart3(index,datas){

    var lineDatas={
        type: "line",
        data: {
            labels:index,
            datasets:datas
        },
        options:{
            responsive: true,
            legend:{
                display: false
            },
            scales:{
                xAxes:[
                    {
                        ticks: {
                            max: index,
                            min: 0,
                            stepSize:10
                        },
                        gridLines: {
                          display: false,
                          drawBorder: true
                        }
                    }
                ],
                yAxes: [
                    {
                        gridLines: {
                          display: false,
                          drawBorder: true
                        }
                    }
                ]
            }
        }
    };

    var ctx7 = $('#port-chart7')[0].getContext("2d");

    //chart_simの中にインスタンスが入っていたら更新、入っていなければ新規作成
    if(chart_sim2){
        chart_sim2.data.labels=index;
        chart_sim2.data.datasets=result_datas;
        chart_sim2.update();
    }else{
        chart_sim2 = new Chart(ctx7,lineDatas);
    };
};
