$(function() {
    // サインアップ、ログイン画面
    hsize = $(window).height()/3;
    $(".top-col").css("height", hsize + "px");

    $(document).on('click','.dropdown-menu .dropdown-item',function(){
        var visibleItem = $('.dropdown-toggle', $(this).closest('.dropdown'));
        visibleItem.text($(this).attr('value'));
    });

    //サイドバーを表示させるコード
    $(document).ready(function () {
        // 向き
        var sides = ["left", "top", "right", "bottom"];
        // サイドバーの初期化
        for (var i = 0; i < sides.length; ++i) {
            var cSide = sides[i];
            $(".sidebar." + cSide).sidebar({side: cSide});
        }

        // ボタンのクリックにより...
        $(document).on('click','.btn[data-action]', function () {
            var $this = $(this);
            var action = $this.attr("data-action");
            var side = $this.attr("data-side");
            $(".sidebar." + side).toggle("sidebar:" + action);
            return false;
        });
    });


    //chart.jsの際にchartインスタンスが入っていたらオブジェクト
    var chart_sim = null;

    // --------------------------------------------------------------
    //ポートフォリオの削除が行われた際に検索欄にあるbuttonの表示を
    //追加済から追加に変更する関数
    // --------------------------------------------------------------
    function changeButton(code){
        //検索一覧の中から削除したコードに一致するものを探し出す
        var tbody = $("#search-table").children().children()[1];
        //行数を取得する
        var num = tbody.rows.length;
        //行数分だけfor文を回して各行のコードを取得していく
        codes=[];
        for (var i=0; i<num; i++) {
            codes.push(tbody.rows[i].cells[0].textContent);
        }
        // 該当するコードがある位置を取得する
        var i=codes.indexOf(code,0);
        // 検索した位置からbuttonのある行に代わりの登録のbuttonを入れる
        var cell = tbody.rows[i].cells[2];

        cell.innerHTML ='<td><button class="search-result-btn btn btn-warning table-string">追　加</button></td>';
    }

    // --------------------------------------------------------------
    //シミュレーション結果を表示するコード
    // --------------------------------------------------------------
    function sim_chart(data) {

        var datas=data["return"];
        var index=[];
        datas.length;

        // console.log(data["start"])
        // console.log("開始"+data["start"])
        // console.log("終了"+data["end"])

        // 収益率を算出する
        var r_rate = (data["end"]-data["start"])/data["start"]*100;

        var r_rate2 = Math.round(r_rate * 10) / 10;

        var p = $("#return-result").children()[0];
        p.innerHTML=r_rate2+" %";
        if(r_rate2<0){
            p.className="text-primary text-center";
        }else{
            p.className="text-danger text-center";
        }

        var p2 = $("#risk-result").children()[0];
        p2.innerHTML=data["drowdown"]+"%";
        if(r_rate2<0){
            p2.className="text-primary text-center";
        }else{
            p2.className="text-danger text-center";
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

        var ctx3 = $('#port-chart3')[0].getContext("2d");

        //chart_simの中にインスタンスが入っていたら更新、入っていなければ新規作成
        if(chart_sim){
            chart_sim.data.labels=index;
            chart_sim.data.datasets=result_datas;
            chart_sim.update();
        }else{
            chart_sim= new Chart(ctx3,lineDatas);
        };
    }

    // --------------------------------------------------------------
    //ポートフォリオの削除が行われた際に検索欄にあるbuttonの表示を
    //追加済から追加に変更する関数
    // --------------------------------------------------------------
    function opt_chart_mypage(data) {

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

        var ctx = $('#port-chart1')[0].getContext("2d");
        var chart = new Chart(ctx,BarDatas);

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

        var ctx2 = $('#port-chart2')[0].getContext("2d");
        var chart2 = new Chart(ctx2,BarDatas);

    }

    // --------------------------------------------------------------
    //計算した期待リターンやリスクをテーブルに入れていく関数
    // --------------------------------------------------------------
    function opt_table(data){
      //空のテーブル要素を取得する
      var tbody = $("#opt-result-table")[0];
      // tbodyの行数を取得する
      // var num = tbody.rows.length;

      for (var i=0; i<5; i++) {
          var Cell1 = tbody.rows[i].cells[1];
          var Cell2 = tbody.rows[i].cells[2];
          Cell1.innerHTML=data["risk"][i][0];
          Cell2.innerHTML=data["risk"][i][1];
      };
    }

    // --------------------------------------------------------------
    //最適化したあとにシミュレーションする関数
    // --------------------------------------------------------------
    function simulate(data){
      $(document).on('click','#simulation-button',function(){

        // 入力された値を取得する
        var day = $("#simulation-day")[0].innerHTML;
        var select = $("#simulation-select")[0].innerHTML;
        var price = $("#simulation-price")[0].innerHTML;

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
                scroll_to_sim()
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
    //ポートフォリオ一覧に存在する銘柄を取得する
    // --------------------------------------------------------------
    function getCode(){
        // ポートフォリオに登録されている銘柄一覧を取得する
        var tbody = $("#portfolio-table")[0]
        // tbodyの行数を取得する
        var num = tbody.rows.length;

        var codes=[];
        //for文を回してtbodyの中のコードを取得する
        //コードの中身は文字列になっているので整数にする
        for (var i=0; i<num; i++) {
            codes.push(parseInt(tbody.rows[i].cells[1].textContent));
        };
        return codes
    }

    // --------------------------------------------------------------
    //最適化されたあとのグラフの場所に飛ぶ
    // --------------------------------------------------------------
    function scroll_to_opt(){
        var position = $(".mychart").offset().top;
        $("html,body").animate({
            scrollTop : position
        }, {
            queue : false
        });
    }

    // --------------------------------------------------------------
    //シミュレーション結果にとぶ
    // --------------------------------------------------------------
    function scroll_to_sim(){
        var position = $(".mysim").offset().top;
        $("html,body").animate({
            scrollTop : position
        }, {
            queue : false
        });
    }

    // --------------------------------------------------------------
  // 検索した際に実行されるコード
  // --------------------------------------------------------------
  $(document).on('click','#search-button',function(){

    // 入力された値を取得する
    var words = $("#search-form")[0].value;

    // 要素の中味を削除する(前回検索の結果を消去)
    $("#search-table").empty();

    $.ajax({
        url: '/searches/index',
        type: 'GET',
        data:{'value': words}
      })
      .done( (data) => {

        // 検索結果の総数を取得する
        num=data["code"].length

        if(num==0){
            //pタグを生成する
            var p = document.createElement('p');
            $("#search-table").append(p);
            p.className='text-center search-alert';
            p.innerHTML = '該当するものはありません';

        }else{
            //テーブル要素を生成する
            var table = document.createElement('table');
            $("#search-table").append(table);
            table.className='table table-hover';
            var table_h = table.createTHead();
            var table_h_r=table_h.insertRow(0);
            var Cell1 = table_h_r.insertCell(0);
            var Cell2 = table_h_r.insertCell(1);
            var Cell3 = table_h_r.insertCell(2);

            // tbody要素を生成
            var tbody1 = document.createElement('tbody');

            // theadの下にtbodyを追加する
            $("#search-table").children().append(tbody1);

            //tbody要素を取得する
            var tbody2 =$("#search-table").children().find("tbody")[0];

            //ポートフォリオ一覧にある銘柄を取得する関数
            var codes=getCode();

            // jsonファイルをテーブルに入れていく
            for (var i=0; i<num; i++) {

                var tbody_r = $('<tr></tr>').appendTo(tbody2);
                $('<td></td>').appendTo(tbody_r);
                $('<td></td>').appendTo(tbody_r);
                $('<td></td>').appendTo(tbody_r);
                // var tbody_r = tbody2.insertRow(0);
                var Cell1 = tbody_r[0].cells[0];
                var Cell2 = tbody_r[0].cells[1];
                var Cell3 = tbody_r[0].cells[2];

                Cell1.innerHTML = data["code"][i];
                Cell1.className = "table-string";
                //substrで0文字目から8文字切り抜く
                Cell2.innerHTML = data["name"][i].substr(0,12);
                Cell2.className = "table-string";

                // もしポートフォリオ欄に同じコードがする場合、追加済みボタンにする
                if(codes.indexOf(data["code"][i])>=0){
                    Cell3.innerHTML = '<td><button class="btn btn-default table-string" disabled>追加済</button></td>';
                    // Cell3.innerHTML = '<td><button class="btn btn-default" style="font-size: 12px; padding:0px" disabled>追加済</button></td>';
                }else{
                    Cell3.innerHTML = '<td><button class="search-result-btn btn btn-warning table-string">追　加</button></td>';
                };
                Cell3.className = "table-string text-right";
                // Cell3.style="padding: 0.75rem 0px";

            };
        };
      })
      .fail( (data) => {
        console.log(data);
      })
      // Ajaxリクエストが成功・失敗どちらでも発動
      .always( (data) => {
      });
  });

  // --------------------------------------------------------------
  //$('#search-button').on('click', function()の書き方をすると、
  //ページが読み込まれた時点で実行されるので、ページを開いた時点でセレクタで指定した要素が
  //存在しないとイベントハンドラーとして機能しない
  //$(document).on('click','#search-table .btn-sm',function()の書き方をすると
  //document=HTML全体を探索範囲としてどこがクリックされてもイベントハンドラーが実行される。
  //そのため、第２引数で範囲を指定することによって特定の要素だけを対象として
  // イベントハンドラーとして対象とすることができる
  // --------------------------------------------------------------
  $(document).on('click','#search-table .search-result-btn',function(){

    // buttonの入っているtr要素を取得する
    // var tr = $(this).parent().parent()[0];
    var tr = $(this).closest("tr")[0];

    // 押したbuttonの行の位置を取得する
    // var r = tr.sectionRowIndex;
    // 各セル内に入っている値を取得する
    var code = tr.cells[0].textContent;
    var name = tr.cells[1].textContent;

    // ポートフォリオテーブルにある行数を取得する
    var tbody = $("#portfolio-table")[0]

    var codes=[];
    for (var i=0; i<5; i++) {
        var a =tbody.rows[i].cells[1].textContent;
        if(a!=""){
            codes.push(a);
        };
    };

    if(codes.length==5){
      return alert('ポートフォリオは最大５つまでです');
    };
    //もし取得したコード群の中に追加しようとしたコードがあればアラート
    if(codes.indexOf(code)>=0){
        return alert('すでにそのコードは存在します');
    };

    //検索一覧の中でbuttonを押した要素のbuttonを追加->追加済に変更する
    var btnCell = tr.cells[2];
    btnCell.innerHTML ='<td><button class="btn btn-default table-string" disabled>追加済</button></td>';


      $.ajax({
          url: '/analyses/stat',
          method: 'post',
          data: {'data': code}
      })
      .done((data) => {

            var num=codes.length;
            var cell1 = tbody.rows[num].cells[1];//コード
            var cell2 = tbody.rows[num].cells[2];//銘柄名
            var cell3 = tbody.rows[num].cells[3];//現在株価
            var cell4 = tbody.rows[num].cells[4];//増減率
            var cell5 = tbody.rows[num].cells[5];//リターン
            var cell6 = tbody.rows[num].cells[6];//リスク
            var cell7 = tbody.rows[num].cells[7];//リスク

            cell1.innerHTML = code;
            cell2.innerHTML = name;
            cell3.innerHTML = data["adjust"];
            cell4.innerHTML = data["change"];
            if(data["change"]<=0){
                cell4.className="text-primary text-right";
            }else{
                cell4.className="text-danger text-right";
            }
            cell5.innerHTML = data["mean"];
            if(data["change"]<=0){
                cell5.className="text-primary text-right";
            }else{
                cell5.className="text-danger text-right";
            }
            cell6.innerHTML = data["std"];
            cell7.innerHTML = '<button class="btn btn-warning remove">削　除</button>';

      })
      .fail((data) => {
          console.log(data)
      })
      // Ajaxリクエストが成功・失敗どちらでも発動
      .always((data) => {
      });

    // tbodyにtrを追加していく
    // var rows = tbody.insertRow(-1);
    // trの中にcellを入れていく、-1にすると下に追加していく
    // var cell1 = tbody.rows[num].insertCell(-1);
    // cell1.className= "col-xs-2 table-string";

    // btnCell.innerHTML ='<td><button class="btn btn-default" style="padding:0px; font-size:12px;" disabled>追加済</button></td>';
  });

  // --------------------------------------------------------------
  // ポートフォリオを削除するコード
  // --------------------------------------------------------------
  $(document).on('click','#portfolio-table .remove',function(){
      // buttonを押した行を取得する
      var row = $(this).parents('tr')[0];
      var tb=$(this).closest('tbody')[0];

      //削除した行のコードを取得する
      var code = row.cells[1].textContent;
      // ボタンを押した行を削除する
      row.remove();

      // テーブルの中の行数を取得する
      var num = tb.rows.length;
      //最終行に行のみを挿入して変数に入れる
      var new_row = tb.insertRow(num);

      //新規作成した行に列を加えて空欄を追加
      for(var i=0 ;i<8;i++){
          var c =new_row.insertCell(i)
          c.innerHTML="";
      }
      // var col =tb.rows[0];
      // var col =tb.rows[0].Cells;

      // console.log(col)

      // tboyの１列目のセルに１〜５のindex番号を振る
      for(var i=1 ;i<6;i++){
          var c =tb.rows[i-1].cells[0];
          c.innerHTML=i;
      }

      // 検索エリアのボタン表示を変更する関数を実行
      changeButton(code);
  });

  // --------------------------------------------------------------
  // 最適化計算を行うコード
  // --------------------------------------------------------------
  $(document).on('click','#opt-btn',function(){

      var tbody = $('#portfolio-table')[0];
      // var num = tbody.rows.length; // 行数を取得する,header=1とする

      var codes=[];
      for (var i=0; i<5; i++) {
          var a =tbody.rows[i].cells[1].textContent;
          if(a!=""){
              codes.push(a);
          };
      };

      if(codes.length < 3){
          return alert('銘柄は最低３つ選んでください');
      };

      $.ajax({
          url: '/optimizations/calc',
          method: 'post',
          data: {'data': codes}
      })
      .done((data) => {
          // グラフを描写するコード
          opt_chart_mypage(data);
          //平均値とリスクを描写するコード
          // opt_table(data);

          scroll_to_opt();

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
  //--------------------------------------------------------------
  //ポートフォリオを登録するコード
  //--------------------------------------------------------------
  $(document).on('click','#port-save',function(){
    //データベースに登録するための名前を入力
    var group_name=prompt("ポートフォリオ名を入力してください");

    if(group_name==""){
        return alert("ポートフォリオ名を入れてください");
    };

    var tbody = $("#portfolio-table")[0];
    // var num = tbody.rows.length;

    //行数分だけfor文を回してコードを取得していく
    // codes=[];
    // for (var i=0; i<num; i++) {
    //     codes.push(tbody.rows[i].cells[1].textContent);
    // }

    var codes=[];
    for (var i=0; i<5; i++) {
        var a =tbody.rows[i].cells[1].textContent;
        if(a!=""){
          codes.push(a);
        };
    };

    $.ajax({
            url: '/portfolios/create',
            type: 'POST',
            data:{'code':codes,'name':group_name}
        })
        .done((data) => {
        })
        .fail((data) => {
          console.log(data)
        })
        // Ajaxリクエストが成功・失敗どちらでも発動
        .always((data) => {
        });
  });

});





