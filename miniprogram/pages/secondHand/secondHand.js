//用于调用全局变量
const app = getApp()
const { $Toast } = require('../../dist/base/index');

Page({
  data: {
    currentSubPage: "recommend",
    classes: [{
      i_class: "cards",
      i_class_header: "cards-header",
      i_class_content: "cards-content",
      i_class_content: "cards-content"
    }],
    currentGoods: [
      // {
      //   goodName: "《浪潮之巅》",
      //   goodPrice: 20,
      //   goodReleaseTime: "2020/3/20",
      //   goodSeller:"谢子飏",
      //   goodIntroduction: "《浪潮之巅》吴军力作，推荐各位阅读！",
      //   goodId: 1,
      //   goodImg: "https://pic3.zhimg.com/478c568755d930fe8a2f15065b494fe8_1200x500.jpg",
      //   browseNum: 24,
      //   praiseNum: 10,
      // },
      // {
      //   goodName: "创意手表",
      //   goodPrice: 50,
      //   goodReleaseTime: "2020/3/25",
      //   goodSeller: "张三",
      //   goodIntroduction: "一款创意手表，喜欢的可以看一看啊",
      //   goodId: 2,
      //   goodImg: "https://cdn03.pinkoi.com/pinkoi.magz/tvzvjB9F/14650149183643.jpg",
      //   browseNum: 76,
      //   praiseNum: 22,
      // },
      // {
      //   goodName: "数学分析复习资料",
      //   goodPrice: 3,
      //   goodReleaseTime: "2020/3/25",
      //   goodSeller: "学霸",
      //   goodIntroduction: "GPA4.0学霸一手复习资料，快来看",
      //   goodId: 3,
      //   goodImg: "https://img14.360buyimg.com/n1/jfs/t1768/29/753478133/66834/53fbb764/55da6ff1N1ec81617.jpg",
      //   browseNum: 76,
      //   praiseNum: 22,
      // }
    ],
  },

  changeSubPage({detail}) {
    var currentSubPage = detail.key;
    this.setData({
      currentSubPage: currentSubPage,
    });
    console.log(currentSubPage)
    var that = this;
    wx.request({
      //将当前页面是推荐还是热榜发给后端
      url: app.globalData.baseUrl+'/api/secondHand_view',
      data: {
        currentSubPage: currentSubPage,
        userOpenId: app.globalData.openId,
      },
      method:"POST",
      success(res) {
        //得到返回的数据
        that.setData({
          currentGoods: res.data.data.currentGoods
        })
        console.log(res.data)
      }
    });
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        current: 'secondHand'
      })
    }
    var that = this;
    wx.request({
      url: app.globalData.baseUrl+'/api/secondHand_view',
      data: {
        userOpenId: app.globalData.openId,
        currentSubPage: "recommend"
      },
      method:"POST",
      success(res) {
        console.log(res.data)
        that.setData({
          currentGoods: res.data.data.currentGoods
        })
      }
    });
  },

  formSubmit: function (e) {
    var that = this;
    var searchValue = e.detail.value.searchValue;
    wx.request({
      //将搜索内容发给后端
      url: app.globalData.baseUrl+'/api/secondHand_search',
      data: {
        searchValue: searchValue,
      },
      method:"POST",
      success(res) {
        //得到返回的数据
        that.setData({
          currentGoods: res.data.data.currentGoods,
        })
        console.log(res.data)
      }
    });
  },

  gotoDetail: function (e) {
    app.globalData.currentDetailGood = e.currentTarget.dataset.good_id;
    console.log(app.globalData.currentDetailGood);
    wx.navigateTo({
      url: 'goodDetail/goodDetail',
    })
  },

  praiseHandle: function (e) {
    var targetGoodId = e.currentTarget.dataset.good_id;
    console.log(targetGoodId)
    wx.request({
      url: app.globalData.baseUrl+'/api/secondHand_praise',
      data: {
       currentGoodId:targetGoodId,
      },
      method:"POST",
      success(res) {
        console.log("hhh")
      }
    });
    var length = this.data.currentGoods.length;
    var that = this;
    for(var i = 0; i<length;i++){
      if(that.data.currentGoods[i].goodId === targetGoodId){
        var currentGoods = that.data.currentGoods;
        currentGoods[i].praiseNum +=1;
        that.setData({
          currentGoods : currentGoods
        })
        return;
      }
    }
  }

})