// サインアップ、ログイン画面
$(document).on('ready', function(){
  hsize = $(window).height()/3;
  $(".top-col").css("height", hsize + "px");
});

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
    cell.innerHTML ='<td><button class="search-result-btn btn btn-warning ">追　加</button></td>';
}

$(document).on('ready', function() {
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
            Cell1.className='col-xs-2';

            var Cell2 = table_h_r.insertCell(1);
            Cell2.className='col-xs-8';

            var Cell3 = table_h_r.insertCell(2);
            Cell3.className='col-xs-2';

            Cell1.innerHTML = 'コード';
            Cell2.innerHTML = '銘柄名';
            Cell3.innerHTML = '';

            // tbody要素を生成
            var tbody1 = document.createElement('tbody');

            // theadの下にtbodyを追加する
            $("#search-table").children().append(tbody1);

            //tbody要素を取得する
            var tbody2 =$("#search-table").children().find("tbody")[0];

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
                Cell2.innerHTML = data["name"][i];
                Cell2.className = "table-string";
                Cell3.innerHTML = '<td><button class="search-result-btn btn btn-warning">追　加</button></td>';
                Cell3.className = "table-string";
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
    var tr = $(this).parent().parent()[0];
    // 押したbuttonの行の位置を取得する
    // var r = tr.sectionRowIndex;
    // 各セル内に入っている値を取得する
    var code = tr.cells[0].textContent;
    var name = tr.cells[1].textContent;
    // buttonを押した要素のbuttonを追加->追加済に変更する
    var btnCell = tr.cells[2];
    btnCell.innerHTML ='<td><button class="btn btn-default" disabled>追加済</button></td>';
    // ポートフォリオテーブルにある行数を取得する
    var tbody = $("#portfolio-table")[0]
    // tbodyの行数を取得する
    var num = tbody.rows.length;
    // すでに行が存在する場合、コードだけを取得していく
    if(num != 0){
        var codes=[];
        for (var i=0; i<num; i++) {
            codes.push(tbody.rows[i].cells[0].textContent);
        }
        //もし取得したコード群の中に追加しようとしたコードがあればアラート
        if(codes.indexOf(code)>=0){
            return alert('すでにそのコードは存在します');
        }
    }
    // tbodyにtrを追加していく
    var rows = tbody.insertRow(-1);
    // trの中にcellを入れていく、-1にすると下に追加していく
    var cell1 = tbody.rows[num].insertCell(-1);
    cell1.className= "col-xs-2 table-string";
    var cell2 = tbody.rows[num].insertCell(-1);
    cell2.className= "col-xs-8 table-string";
    var cell3 = tbody.rows[num].insertCell(-1);
    cell3.className= "col-xs-2 table-string";
    // 作成したセルを取得して値を入れる
    cell1.innerHTML = code;
    cell2.innerHTML = name;
    cell3.innerHTML = '<button class="btn btn-warning remove">削　除</button>';
  });

  // --------------------------------------------------------------
  // ポートフォリオを削除するコード
  // --------------------------------------------------------------
  $(document).on('click','#portfolio-table .remove',function(){
      // buttonを押した行を取得する
      var row = $(this).parents('tr')[0];
      //削除した行のコードを取得する
      var code = row.cells[0].textContent;
      //ボタンを押した行を削除する
      row.remove();
      //検索エリアのボタン表示を変更する関数を実行
      changeButton(code);
  });

  // --------------------------------------------------------------
  // 最適化計算を行うコード
  // --------------------------------------------------------------
  // $(document).on('click','#opt-btn',function(){

  //     var tbody = $('#portfolio-table')[0];
  //     var num = tbody.rows.length; // 行数を取得する,header=1とする

  //     var codes=[];
  //     for (var i=0; i<num; i++) {
  //         codes.push(tbody.rows[i].cells[0].textContent);
  //     }

  //     if(codes.length < 3){
  //         return alert('銘柄は最低３つ選んでください');
  //     }

  //     // console.log(codes);

  //     $.ajax({
  //         url: '/optimizations/calc',
  //         method: 'post',
  //         data: {'data': codes}
  //     })
  //     .done((data) => {
  //         // グラフを描写するコード
  //         opt_chart(data)
  //     })
  //     .fail((data) => {
  //         console.log(data)
  //     })
  //     // Ajaxリクエストが成功・失敗どちらでも発動
  //     .always((data) => {
  //     });
  // });

  //--------------------------------------------------------------
  //ポートフォリオを登録するコード
  //--------------------------------------------------------------
  $('#port-resist').on('click', function(){
    //データベースに登録するための名前を入力
    var group_name=prompt("ポートフォリオ名を入力してください");

    var tbody = $("portfolio-table")[0];
    var num = tbody.rows.length;

    //行数分だけfor文を回してコードを取得していく
    codes=[];
    for (var i=0; i<num; i++) {
        codes.push(tbody.rows[i].cells[0].textContent);
    }

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

//$(document).on('ready', function()の末端
});






