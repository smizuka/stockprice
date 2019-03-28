//最適化されたあとのグラフの場所に飛ぶ
function scroll_to_opt(){
    var position = $(".mychart").offset().top;
    var height= $(".myport").outerHeight(true);
    $("html,body").animate({
        scrollTop : position-(position-height)-24
    }, {
        queue : false
    });
}

//シミュレーション結果にとぶ
function scroll_to_sim(){
    var position = $(".mysim").offset().top;
    var height1= $(".myport").outerHeight(true);
    var height2= $(".mychart").outerHeight(true);

    $("html,body").animate({
        scrollTop : position-(position-(height1+height2))
    }, {
        queue : false
    });
}

// 最適化されたあとのグラフの場所に飛ぶ(バッナンバーページ用)
function scroll_to_opt_b(){
    var position = $(".mychart-b").offset().top;
    var height= $(".myport-b").outerHeight(true);
    $("html,body").animate({
        scrollTop : position-(position-height)
    }, {
        queue : false
    });
}

//シミュレーション結果にとぶ(バッナンバーページ用)
function scroll_to_sim_b(){
    var position = $(".mysim-b").offset().top;
    var height1= $(".myport-b").outerHeight(true);
    var height2= $(".mychart-b").outerHeight(true);

    $("html,body").animate({
        scrollTop : position-(position-(height1+height2))
    }, {
        queue : false
    });
}
