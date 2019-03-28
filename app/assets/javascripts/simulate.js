function simulate2(id,day,select,price,data){
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

                //どの部分テンプレートで作動したか判断する関数
                if(id=="mypage"){
                    sim_chart_mypage(data);
                    scroll_to_sim();
                  }else{
                    sim_chart_backnumber(data)
                    scroll_to_sim_b()
                  };
            })
            .fail((data) => {
              console.log(data)
            })
            // Ajaxリクエストが成功・失敗どちらでも発動
            .always((data) => {
            });
};


