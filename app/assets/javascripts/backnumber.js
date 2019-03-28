$(function() {

    //最適化したあとにシミュレーションする関数
    function simulate(data){
      $(document).on('click','#simulation-button-back',function(){

        // 入力された値を取得する
        var day = $("#simulation-day-back")[0].innerHTML;
        var select = $("#simulation-select-back")[0].innerHTML;
        var price = $("#simulation-price-back")[0].innerHTML;

        var id = "back";

        simulate2(id,day,select,price,data);

      });
    }

    //最適化計算をする部分
    $(document).on('ready', function() {
      $(document).on('click','.backnumber-opt',function(){

          var tbody = $(this).closest(".card-body").find("table.table tbody")[0];

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
              opt_chart_backnumber(data);
              scroll_to_opt_b();
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

      // グループを削除するコード
      $(document).on('click','.backnumber-delete',function(){

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
