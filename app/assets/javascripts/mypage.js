$(function() {
    //最適化したあとにシミュレーションする関数
    function simulate(data){
      $(document).on('click','#simulation-button',function(){

        // 入力された値を取得する
        var day = $("#simulation-day")[0].innerHTML;
        var select = $("#simulation-select")[0].innerHTML;
        var price = $("#simulation-price")[0].innerHTML;

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
                sim_chart_mypage(data)
                scroll_to_sim();
            })
            .fail((data) => {
              console.log(data)
            })
            // Ajaxリクエストが成功・失敗どちらでも発動
            .always((data) => {
            });
      });

    }

  // 検索した際に実行されるコード
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
        // 検索結果を表示する
        create_table(data)
      })
      .fail( (data) => {
        console.log(data);
      })
      // Ajaxリクエストが成功・失敗どちらでも発動
      .always( (data) => {
      });
  });

  //検索ボタンを押したとき
  $(document).on('click','#search-table .search-result-btn',function(){

    var tr = $(this).closest("tr")[0];

    // 各セル内に入っている値を取得する
    var code = tr.cells[0].textContent;
    var name = tr.cells[1].textContent;

    // ポートフォリオテーブルにある行数を取得する
    var tbody = $("#portfolio-table")[0]

    //表にある株のコードを取得する
    var codes=collectCode(tbody);
    var num=codes.length;

    if(num==5){
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
          add_table_contents(data,num,code,name)
      })
      .fail((data) => {
          console.log(data)
      })
      // Ajaxリクエストが成功・失敗どちらでも発動
      .always((data) => {
      });

  });

  // ポートフォリオを削除するコード
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

      // tboyの１列目のセルに１〜５のindex番号を振る
      for(var i=1 ;i<6;i++){
          var c =tb.rows[i-1].cells[0];
          c.innerHTML=i;
      }

      // 検索エリアのボタン表示を変更する関数を実行
      changeButton(code);
  });

  // 最適化計算を行うコード
  $(document).on('click','#opt-btn',function(){

      var tbody = $('#portfolio-table')[0];
      //表にある株のコードを取得する
      var codes=collectCode(tbody);

      if(codes.length < 3){
          return alert('銘柄は最低３つ選んでください');
      };

      $.ajax({
          url: '/optimizations/calc',
          method: 'post',
          data: {'data': codes}
      })
      .done((data) => {
          opt_chart_mypage(data);
          scroll_to_opt();
          simulate(data);
      })
      .fail((data) => {
          console.log(data)
      })
      // Ajaxリクエストが成功・失敗どちらでも発動
      .always((data) => {
      });
  });

  //ポートフォリオを登録するコード
  $(document).on('click','#port-save',function(){
    //データベースに登録するための名前を入力
    var group_name=prompt("ポートフォリオ名を入力してください");

    if(group_name==""){
        return alert("ポートフォリオ名を入れてください");
    };

    var tbody = $("#portfolio-table")[0];

    //表にある株のコードを取得する
    var codes=collectCode(tbody);

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





