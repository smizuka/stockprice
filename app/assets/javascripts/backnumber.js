$(function() {

    // -----------------------------------------------------------
    //最適化したあとにシミュレーションする関数
    // --------------------------------------------------------------
    function simulate(data){
      $(document).on('click','#simulation-button-back',function(){

        // 入力された値を取得する
        var day = $("#simulation-day-back")[0].innerHTML;
        var select = $("#simulation-select-back")[0].innerHTML;
        var price = $("#simulation-price-back")[0].innerHTML;

        //100日という表示になっているので後ろの１文字を削除
        var day2=day.slice(0, -1);
        var day3=Number(day2);

        //選択１という表示なので最後の１文字だけ取得
        var select2=select.slice(-1);
        var select3=Number(select2);

        //価格は100万円表示なので0から３文字取得して整数化
        var price2=price.slice(0,3);
        var price3=Number(price2)*10000;

        // 価格が50万円以下であるとエラー
        if(price<500000){
          return alert("最低投資金額は５０万円です");
        }

        // １〜５以外の値を入力するとエラー
        if(select > 5 || select==0){
          return alert("選択は1~5の値から選んでください");
        }

        // 日数が入力されていないとエラー
        if(day==0){
          return alert("日数が入力されていません");
        }

        $.ajax({
                url: '/simulations/calc',
                type: 'POST',
                data:{
                    'day':day3,
                    'codes':data["labels"],
                    'weight':data["weights"],
                    'sigma':data["std"],
                    'select':select3,
                    'price':price3
                }
            })
            .done((data) => {
              // 実施した結果をチャート表示する関数
                sim_chart_backnumber(data)
            })
            .fail((data) => {
              console.log(data)
            })
            // Ajaxリクエストが成功・失敗どちらでも発動
            .always((data) => {
            });
      });
    }

    $(document).on('ready', function() {
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

      // --------------------------------------------------------------
      // グループを削除するコード
      // --------------------------------------------------------------
      $(document).on('click','.backnumber-delete',function(){

          // var tbody = $(this).closest(".card-body");
          var tbody = $(this).closest(".card-body").find(".group-title")[0];
          var name=tbody.textContent;

          $.ajax({
              url: '/portfolios/destroy',
              method: 'delete',
              data: {'data':name}
          })
          .done((data) => {

          })
          .fail((data) => {
              console.log(data);
          })
          // Ajaxリクエストが成功・失敗どちらでも発動
          .always((data) => {
          });
      });

    });
});
