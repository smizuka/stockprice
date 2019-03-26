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
