$(document).on('ready', function(){
  $(document).on('click','#analyses-button',function(){

    // 入力された値を取得する
    var stocks=[];

    for(var i=1;i<6;i++){
        var code = $("#analyses-"+i)[0].value;
        if(code!=""){
            stocks.push(code);
        }
    };

    if(stocks.length < 3){
      return alert("銘柄は３つ以上選んでください。");
    };

    $.ajax({
            url: '/analyses/calc',
            type: 'POST',
            data:{
                'code':stocks,
            }
        })
        .done((data) => {
          // 実施した結果をチャート表示する関数

        })
        .fail((data) => {
          console.log(data)
        })
        // Ajaxリクエストが成功・失敗どちらでも発動
        .always((data) => {
        });
  });

});
