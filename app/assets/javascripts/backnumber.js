$(function() {
    //chart.jsの際にchartインスタンスが入っていたらオブジェクト
    var chart_sim = null;

    // --------------------------------------------------------------
    //最適化したあとにシミュレーションする関数
    // --------------------------------------------------------------
    function simulate(data){
      $(document).on('click','#simulation-button-back',function(){

        // 入力された値を取得する
        var day = $("#simulation-day-back")[0].innerHTML;
        var select = $("#simulation-select-back")[0].innerHTML;
        var price = $("#simulation-price-back")[0].innerHTML;

        var price2=price.slice(0,3);
        var price3=Number(price2)*10000;

        //価格が50万円以下であるとエラー
        // if(price<500000){
        //   return alert("最低投資金額は５０万円です");
        // }

        //１〜５以外の値を入力するとエラー
        if(select > 5 || select==0){
          return alert("選択は1~5の値から選んでください");
        }

        //日数が入力されていないとエラー
        if(day==0){
          return alert("日数が入力されていません");
        }

        $.ajax({
                url: '/simulations/calc',
                type: 'POST',
                data:{
                    'day':day,
                    'codes':data["labels"],
                    'weight':data["weights"],
                    'sigma':data["std"],
                    'select':select,
                    'price':price3
                }
            })
            .done((data) => {
              // 実施した結果をチャート表示する関数
                sim_chart(data)
            })
            .fail((data) => {
              console.log(data)
            })
            // Ajaxリクエストが成功・失敗どちらでも発動
            .always((data) => {
            });
      });

    }
    // --------------------------------------------------------------
    //シミュレーション結果を表示するコード
    // --------------------------------------------------------------
    function sim_chart(data) {

        datas=data["return"];
        index=[];
        datas.length;

        // console.log(data["start"])
        // console.log("開始"+data["start"])
        // console.log("終了"+data["end"])

        // 収益率を算出する
        r_rate = (data["end"]-data["start"])/data["start"]*100
        r_rate2 = Math.round(r_rate * 10) / 10

        // var p = $("#return-result")[0].children();
        var p = $("#return-result-back").children()[0];
        p.innerHTML=r_rate2+" %";
        if(r_rate2<0){
            p.className="text-primary text-center";
        }else{
            p.className="text-danger text-center";
        }

        for (var i=0; i<datas.length; i++) {
            index.push(i+1);
        }
        // colors=["#6CB9D8","#ECA184","#EBF182","#8BA7D5","#DB7BB1"];

        result_datas=[{
            // label:"選択1",
            borderColor: "#ECA184",
            data: datas,
            backgroundColor: "rgba(0,0,0,0)"
        }];

        // --------------------------------------------------------------
        //シミュレーション結果を表示するコード
        // --------------------------------------------------------------
        var lineDatas={
            type: "line",
            data: {
                labels:index,
                datasets:result_datas
            },
            options:{
                responsive: true,
                legend:{
                    display: false

                    // position: 'bottom'
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
                            ticks: {
                                // max: 10,
                                // min: -10,
                                // stepSize:2
                            },
                            scaleLabel: {
                                // fontSize: 100,
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

        var ctx7 = $('#port-chart7')[0].getContext("2d");

        //chart_simの中にインスタンスが入っていたら更新、入っていなければ新規作成
        if(chart_sim){
            chart_sim.data.labels=index;
            chart_sim.data.datasets=result_datas;
            chart_sim.update();
        }else{
            chart_sim= new Chart(ctx7,lineDatas);
        };
    }

    // --------------------------------------------------------------
    //ポートフォリオの削除が行われた際に検索欄にあるbuttonの表示を
    //追加済から追加に変更する関数
    // --------------------------------------------------------------
    function opt_chart_backnumber(data) {

        //辞書型のデータセットを追加していく空配列
        result_datas=[];
        //凡例を入れたリスト
        datas=data["datas"];
        labels=data["labels"];
        colors=["#6CB9D8","#ECA184","#EBF182","#8BA7D5","#DB7BB1"];
        num=labels.length-1;

        for (var i=0; i<=num; i++) {
            dic={
                label:labels[i],
                data: datas[i],
                backgroundColor:colors[i],
                borderColor: "white",
                borderWidth: 0
            };
            //グラフに表示するデータ
            result_datas.push(dic);
        };

        // --------------------------------------------------------------
        //銘柄比率を表示するチャート
        // --------------------------------------------------------------
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

        var ctx5 = $('#port-chart5')[0].getContext("2d");
        var chart5 = new Chart(ctx5,BarDatas);

        // --------------------------------------------------------------
        //リスクとリターンを表示するチャート
        // --------------------------------------------------------------
        var datas = [
        {
            label: 'リターン',
            data: data["risk"][0],
            borderColor : "rgba(254,97,132,0.8)",
            backgroundColor : "rgba(254,97,132,0.5)",
        },
        {
            label: 'リスク',
            data: data["risk"][1],
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

        var ctx6 = $('#port-chart6')[0].getContext("2d");
        var chart6 = new Chart(ctx6,BarDatas);
    }

    $(document).on('ready', function() {
      // --------------------------------------------------------------
      // 最適化計算を行うコード
      // --------------------------------------------------------------
      $(document).on('click','.backnumber-opt',function(){

          var tbody = $(this).closest(".card-body").find("table.table tbody")[0];
          // .parent().parent().find("")


          var num = tbody.rows.length; // 行数を取得する,header=1とする

          var codes=[];
          for (var i=0; i<num; i++) {
              codes.push(tbody.rows[i].cells[0].textContent);
          };

          $.ajax({
              url: '/optimizations/calc',
              method: 'post',
              data: {'data': codes}
          })
          .done((data) => {
              // グラフを描写するコード
              opt_chart_backnumber(data);
              //平均値とリスクを描写するコード
              // opt_table(data);

              // scroll_to_opt();

              //最適化結果をもとにシミュレーションするコード
              simulate(data);
          })
          .fail((data) => {
              console.log(data)
          })
          // Ajaxリクエストが成功・失敗どちらでも発動
          .always((data) => {
          });
      });
    });
});
