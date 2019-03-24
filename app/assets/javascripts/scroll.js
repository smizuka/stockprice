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
