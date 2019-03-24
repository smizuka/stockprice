var chart_sim = null;
// --------------------------------------------------------------
//最適な配分比率のチャート
// --------------------------------------------------------------
function mypage_chart1(datas){
    var BarDatas={
      type: "horizontalBar",
      data: {
          labels: ["選択１","選択２","選択３","選択４","選択５"],
          datasets:result_datas
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

  var ctx = $('#port-chart1')[0].getContext("2d");
  var chart = new Chart(ctx,BarDatas);
}

// --------------------------------------------------------------
//リスクとリターンのチャート
// --------------------------------------------------------------
function mypage_chart2(data1,data2){
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
                        // stacked: true,
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
                        // stacked: true,
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

    var ctx2 = $('#port-chart2')[0].getContext("2d");
    var chart2 = new Chart(ctx2,BarDatas);
}

// --------------------------------------------------------------
//シミュレーション結果のチャート
// --------------------------------------------------------------
function mypage_chart3(index,datas){

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
            title: {
                display: true,
                text: 'シミュレーション結果'
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

    var ctx3 = $('#port-chart3')[0].getContext("2d");

    //chart_simの中にインスタンスが入っていたら更新、入っていなければ新規作成
    if(chart_sim){
        chart_sim.data.labels=index;
        chart_sim.data.datasets=result_datas;
        chart_sim.update();
    }else{
        chart_sim= new Chart(ctx3,lineDatas);
    };
};

