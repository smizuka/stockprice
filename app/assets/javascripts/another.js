// サインアップ、ログイン画面
hsize = $(window).height()/3;
$(".top-col").css("height", hsize + "px");


//ドロップダウン表示をするコード
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
