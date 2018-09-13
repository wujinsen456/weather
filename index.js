
let citys;
$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/city/",
    type:"get",
    dataType:"jsonp",
    success:function(e){
        citys=e.data;
        let str="";
        for(key in citys){
            str+=`<h2>${key}</h2>`;
            str+=`<div class="con">`;
            for(key2 in citys[key]){
                str+=`<div class="city">${key2}</div>`
            }
            str+=`</div>`;
        }
        $(str).appendTo($(".cityBox"))
    }
});

$(function(){
    ///////语音播报
    $(".audioBtn").click(function(event){
        event.stopPropagation();
        let speech=window.speechSynthesis;
        let speechset=new SpeechSynthesisUtterance();
        let text=$("header span").text()+"当前温度"+$(".screen h3 span").text()+"摄氏度"
            +$(".screen h4 span").text()+$(".screen h5 span").text();
        speechset.text=text;
        speech.speak(speechset);
    });

    let cityBox=$(".cityBox");
    $("header").click(function(){
        cityBox.slideDown()
    });
    $(".search button").click(function(){
        cityBox.slideUp()
    });
    cityBox.on("touchstart",function(event){
        if(event.target.className=="city"){
            let city=event.target.innerText;
            $.ajax({
                url:"https://www.toutiao.com/stream/widget/local_weather/data/",
                data:{'city':city},
                type:"get",
                dataType:"jsonp",
                success:function(e){
                    console.log(e);
                    updata(e.data);
                }
            });
            cityBox.slideUp();
        }
    });
});

function updata(data){
    $("header span").text(data.city);
    $("#aqi").text(data.weather.aqi);
    $("#quality_level").text(data.weather.quality_level);
    $(".screen h3 span").text(data.weather.current_temperature);
    $(".screen h4 span").text(data.weather.current_condition);
    $(".screen h5 span").text(`${data.weather.wind_direction}${data.weather.wind_level}`+"级");

    $("#temperature").text(`${data.weather.dat_low_temperature}`+"/"+`${data.weather.dat_high_temperature}`);
    $("#dat_condition").text(data.weather.dat_condition);
    $(".today span img").attr("src",`img/${data.weather.dat_weather_icon_id}.png`);
    $("#temperatureT").text(`${data.weather.dat_low_temperature}`+"/"+`${data.weather.dat_high_temperature}`);
    $(".tomorrow span img").attr("src",`img/${data.weather.weather_icon_id}.png`);

    $(".box").each(function(i){
        console.log(i);
        $(".box div .hourly").eq(i).text(data.weather.hourly_forecast[`${i}`].hour);
        $(".box div .hourlyT").eq(i).text(data.weather.hourly_forecast[`${i}`].temperature);
        $(".box img").attr("src",`img/${data.weather.hourly_forecast[`${i}`].weather_icon_id}.png`);
    });
    let str1="";
    let x=[];
    let high=[];
    let low=[];
    let weeknum=["日","一","二","三","四","五","六"];

    for(obj of data.weather.forecast_list){
        let date=new Date(obj.date);
        console.log(date);
        let day=date.getDay();
        console.log(day);

        x.push(obj.date);
        high.push(obj.high_temperature);
        low.push(obj.low_temperature);

        str1+=`
        <div class="weekBox">
        <div><span>星期${weeknum[day]}</span></div>
        <div><span>${obj.date}</span></div>
        <div class="cloud"><span>${obj.condition}</span></div>
        <img src="img/${obj.weather_icon_id}.png" alt="">
        <div class="null"></div>
        <img src="img/${obj.weather_icon_id}.png" alt="">
        <div class="cloud"><span>${obj.condition}</span></div>
        <div><span>${obj.wind_direction}</span></div>
        <div><span>${obj.wind_level}级</span></div>
        </div>`;
    }
    $(".weekCon").html(str1);
    // 基于准备好的dom，初始化echarts实例
    console.log($(".zheXian")[0]);

    var myChart = echarts.init($(".zheXian")[0]);

// 指定图表的配置项和数据
    var option = {
        tooltip:{},
        xAxis: {
            show:false,
            data:x,
        },
        yAxis: {
            show:false,
        },
        series:[{
            name: '销量',
            type: 'line',
            data:high,
        },{
            name: '销量',
            type: 'line',
            data:low,
        }],
        grid:{
            top:0,
            left:0,
            right:0,
            bottom:0,
        }
    };

// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/data/",
    data:{'city':"太原"},
    type:"get",
    dataType:"jsonp",
    success:function(e){
        console.log(e);
        updata(e.data);
    }
});




