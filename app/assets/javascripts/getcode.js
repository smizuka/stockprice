//ポートフォリオ一覧に存在する銘柄を取得する
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

//表に存在するコードを集める
function collectCode(tbody){

    var codes=[];
    for (var i=0; i<5; i++) {
        var a =tbody.rows[i].cells[1].textContent;
        if(a!=""){
            codes.push(a);
        };
    };
    return codes
}

