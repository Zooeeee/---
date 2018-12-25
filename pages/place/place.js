// pages/today/today.js
Page({
  data: {
    defaultCity: '',
    iconSrc: "/img/today/GPS.png",
    startDayIndex: 0,
    dayCountIndex: 0,
    dayCount: ""
  },

  onLoad: function (e) {
   /*  let defaultCity =  "武汉"
     wx.setStorage({
      key: 'defaultCity',
      data: defaultCity,
    });  */
   

  },
  onReady: function (e) {

  },
  onShow: function (e) {
    console.log("today.js中的onshow函数");
    //清除数据避免出错
    this.setData({
      startDayIndex: 0,
      dayCountIndex: 0,
      dayCount: ""
    })
    let that = this;
    //从缓存中获取defatultCity
    //获取缓存的数据后 请求api 并将返回的数据缓存到本地
    wx.getStorage({
      key: 'defaultCity',
      success: function (res) {
        //console.log("从缓存中提取默认城市：" + res.data)
        that.setData({
          defaultCity: res.data
        });
        //根据defaultCity的值 去 请求api 得到预测天气数据后存入缓存区
        wx.request({
          url: 'https://api.map.baidu.com/telematics/v3/weather?output=json&ak=1a3cde429f38434f1811a75e1a90310c&location='
            + res.data,
          success: function (e) {
            wx.setStorage({
              key: 'getData',
              data: e.data,
            });//设置缓存结束
            let obj = e.data.results[0].weather_data[0];
            //console.log(obj);
            that.setData({
              date: obj.date,
              temperature: obj.temperature,
              weather: obj.weather
            })
          }
        });//请求api结束
        //请求第二个api,关于行程的
        wx.request({
          url: "http://api.map.baidu.com/telematics/v3/travel_city?output=json&ak=w65uwmj5P2rqqpGv8iunSyyKgLke1bZo&location="
            + that.data.defaultCity + "&day=all",
          success: function (res) {
            let itineraries = res.data.result.itineraries;
            //console.log("得到的数据",itineraries);
            const getItineraries = require("../../utils/getItineraries");
            that.setData({
              itineraries: itineraries,
              title: itineraries[0].description,
              dayCount: getItineraries.getPickers(itineraries),
              plan: itineraries[0].itineraries,
            })
          }
        })
        //请求第二个api,关于行程的结束
      },
    });//请求缓存结束
  },


  //picker组件的触发事件
  pickDayCount: function (e) {
    console.log(e.detail.value);
    
    let title = this.data.itineraries[e.detail.value].description; //字符串
    let obj = this.data.itineraries[e.detail.value].itineraries; //数组
    this.setData({
      dayCountIndex: e.detail.value,
      title: title,
      plan: obj
    });
    console.log(this.data.plan);
  },
  //点击每一天的计划可以弹出一个消息框，其中有路程帮助信息
  routeHelp: function (e) {
    let dinning = this.data.plan[e.target.id].dinning
    //console.log(dinning);//餐饮信息
    wx.showModal({
      title: '餐饮帮助',
      content: dinning,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    });
  }



})