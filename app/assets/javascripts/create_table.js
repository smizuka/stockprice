function create_table(data){
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
        };
    };
};

function add_table_contents(data,num,code,name){

    var tbody = $("#portfolio-table")[0]

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

};

