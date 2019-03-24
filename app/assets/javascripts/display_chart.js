function opt_chart_mypage(data) {
    //辞書型のデータセットを追加していく空配列
    result_datas=[];
    //凡例を入れたリスト
    datas=data["datas"];
    labels=data["labels"];
    colors=["#6CB9D8","#ECA184","#EBF182","#8BA7D5","#DB7BB1"];
    num=labels.length-1;

    for (var i=0; i<=num; i++) {
        dic={
            label:labels[i],
            data: datas[i],
            backgroundColor:colors[i],
            borderColor: "white",
            borderWidth: 0
        };
        //グラフに表示するデータ
        result_datas.push(dic);
    };
    mypage_chart1(result_datas)
    mypage_chart2(data["risk"][0],data["risk"][1])
};

function sim_chart_mypage(data) {

    var datas=data["return"];
    var index=[];
    datas.length;

    // 収益率を算出する
    var r_rate = (data["end"]-data["start"])/data["start"]*100;

    var r_rate2 = Math.round(r_rate * 10) / 10;

    var p = $("#return-result").children()[0];
    p.innerHTML=r_rate2+" %";
    if(r_rate2<0){
        p.className="text-primary text-center";
    }else{
        p.className="text-danger text-center";
    }

    var p2 = $("#risk-result").children()[0];
    p2.innerHTML=data["drowdown"]+"%";
    p2.className="text-primary text-center";

    for (var i=0; i<datas.length; i++) {
        index.push(i+1);
    }
    // colors=["#6CB9D8","#ECA184","#EBF182","#8BA7D5","#DB7BB1"];

    result_datas=[{
        // label:"選択1",
        borderColor: "#ECA184",
        data: datas,
        backgroundColor: "rgba(0,0,0,0)"
    }];
    mypage_chart3(index,result_datas)
};

function opt_chart_backnumber(data) {

    //辞書型のデータセットを追加していく空配列
    result_datas=[];
    //凡例を入れたリスト
    datas=data["datas"];
    labels=data["labels"];
    colors=["#6CB9D8","#ECA184","#EBF182","#8BA7D5","#DB7BB1"];
    num=labels.length-1;

    for (var i=0; i<=num; i++) {
        dic={
            label:labels[i],
            data: datas[i],
            backgroundColor:colors[i],
            borderColor: "white",
            borderWidth: 0
        };
        //グラフに表示するデータ
        result_datas.push(dic);
    };

    bucknumber_chart1(result_datas)
    bucknumber_chart2(data["risk"][0],data["risk"][1])
}

function sim_chart_backnumber(data) {

    datas=data["return"];
    datas.length;

    // 収益率を算出する
    r_rate = (data["end"]-data["start"])/data["start"]*100
    r_rate2 = Math.round(r_rate * 10) / 10

    // var p = $("#return-result")[0].children();
    var p = $("#return-result-back").children()[0];
    p.innerHTML=r_rate2+" %";
    if(r_rate2<0){
        p.className="text-primary text-center";
    }else{
        p.className="text-danger text-center";
    }

    var p2 = $("#risk-result-back").children()[0];
    p2.innerHTML=data["drowdown"]+" %";
    p2.className="text-primary text-center";

    index=[];
    for (var i=0; i<datas.length; i++) {
        index.push(i+1);
    }

    result_datas=[{
        borderColor: "#ECA184",
        data: datas,
        backgroundColor: "rgba(0,0,0,0)"
    }];

    bucknumber_chart3(index,result_datas)
}






