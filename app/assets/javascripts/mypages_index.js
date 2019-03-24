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

    // -----------------------------------------------------------
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
    //最適化したあとにシミュレーションする関数
    // --------------------------------------------------------------
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
              // 実施した結果をチャート表示する関数
                sim_chart_mypage(data)
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

      console.log(codes);

      $.ajax({
          url: '/optimizations/calc',
          method: 'post',
          data: {'data': codes}
      })
      .done((data) => {
          // グラフを描写するコード
          opt_chart_mypage(data);
          scroll_to_opt();
          //最適化結果をもとにシミュレーションするajax
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





