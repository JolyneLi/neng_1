// packageB/pages/accountInfo.js
const util = require('../../../utils/util.js')
var app = getApp();
var currentPage = 1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
a:'', //bbb
b:'', //bbb
    custID:"",
    productType:"30",
    seriesIndex:'0',
    treatDataList:[],
    valueCardList:[],
    countCardList:[],
    timeList:[],
    packCardList:[],
    couponCardList:[],
    total:0,
    navList: [
      {Name:'定金',PCategory:"30"},
      {Name:'品项',PCategory:"20"},
      {Name:'疗程卡',PCategory:"40"},
      {Name:'年卡',PCategory:"50"}, 
      {Name:'政策卡',PCategory:"80"},    
      {Name:'线上优惠券',PCategory:"60"},
    ],
  },
   //  系列切换
   seriesClick: function (e) {
    var that = this;
    var currentIndex = e.currentTarget.dataset.index
    var proType = that.data.navList[currentIndex]["PCategory"]
    currentPage = 1 
    that.setData({
      seriesIndex: currentIndex,
      productType:proType,
      treatDataList:[],
      valueCardList:[],
      countCardList:[],
      timeList:[],
      packCardList:[],
      couponCardList:[],
    })


    if (that.data.seriesIndex == 1 || that.data.seriesIndex == 2 || that.data.seriesIndex == 3  ) {
      that.treatData()
    }

    if (that.data.seriesIndex == 0 || that.data.seriesIndex == 5 ) {
      that.valueCardAndCouponData()
    }
    if (that.data.seriesIndex == 4 ) {
      that.packCardData()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var custID = options.custID;

    that.setData({
      custID:custID
    })
    that.valueCardAndCouponData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    currentPage = 1;

    if (that.data.seriesIndex == 1 || that.data.seriesIndex == 2 || that.data.seriesIndex == 3  ) {
      that.data.treatDataList = [];
      that.data.countCardList = [];
      that.data.timeList = [];
      that.treatData()
    }

    if (that.data.seriesIndex == 0 || that.data.seriesIndex == 5 ) {
      that.data.valueCardList = [],
      that.data.couponCardList = [],
      that.valueCardAndCouponData()
    }
    if (that.data.seriesIndex == 4 ) {
      that.data.packCardList = [];
      that.packCardData()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    currentPage += 1;

    if (that.data.seriesIndex == 1 && that.data.total > that.data.treatDataList.length) {
      that.treatData()  
    }
    if (that.data.seriesIndex == 0 && that.data.total > that.data.valueCardList.length) {
      that.valueCardAndCouponData()
    }

    if (that.data.seriesIndex == 2 && that.data.total > that.data.countCardList.length) {
      that.treatData()  
    }

    if ( that.data.seriesIndex == 3  && that.data.total > that.data.timeList.length) {
        that.treatData()  
    }

    
    if (that.data.seriesIndex == 4 && that.data.total > that.data.packCardList.length) {
      that.packCardData()
    }

    if (that.data.seriesIndex == 5 && that.data.total > that.data.couponCardList.length) {
      that.valueCardAndCouponData()
    }
   

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*** 政策卡查看更多 */

  packItemClick(e){
    console.log(e)
    var that = this
    var item = e.currentTarget.dataset.item;


    wx.navigateTo({
      url: './../accountInfoPackDetail/accountInfoPackDetail?AccountID=' + item.AccountID + "&" + "custId=" + that.data.custID,
    })

  },

  /**  品项，疗程卡，年卡，余量详情 */
  treatData: function () {
    wx.showLoading({
      title: '加载中。。。',
    })
    var that = this;
    var params = {
      custID:that.data.custID,
      currentPage: currentPage,
      pageSize:"10",
      productType: that.data.productType
    }
    util.Htpapi.post('account/getTbTreatAccountShow', params).then(res => {
      wx.hideLoading({
        complete: (res) => {},
      })
      if (res.data.stateCode == 100) {
        if (that.data.seriesIndex == 1) {
          // that.setData({
          //   // treatDataList: list,
          //   treatDataList: []
          //  })
          // var list = that.data.treatDataList
          // list.push.apply(list, res.data.data.list);
          that.data.treatDataList = that.data.treatDataList.concat(res.data.data.list);
           that.setData({
            // treatDataList: list,
            treatDataList:  that.data.treatDataList,
            total: res.data.data.total
           })
        }
        if (that.data.seriesIndex == 2) {
          // var list = that.data.countCardList
          // list.push.apply(list, res.data.data.list);
          that.data.countCardList = that.data.countCardList.concat(res.data.data.list);
           that.setData({
            // countCardList: list,
            countCardList: that.data.countCardList,
            total: res.data.data.total
           })
        }

        if (that.data.seriesIndex == 3) {
          // var list = that.data.timeList
          // list.push.apply(list, res.data.data.list);
          that.data.timeList = that.data.timeList.concat(res.data.data.list);
           that.setData({
            // timeList: list,
            timeList: that.data.timeList,
            total: res.data.data.total
           })
        }

       
      } else {
        wx.showToast({
          icon: "none",
          title: res.data.message,
        })
      }
    })
  },

  /**  定金，线上优惠券，余量详情 */
  valueCardAndCouponData: function () {
    wx.showLoading({
      title: '加载中。。。',
    })
    var that = this;
    var params = {
      custID:that.data.custID,
      currentPage: currentPage,
      pageSize:"10",
      productType: that.data.productType
    }
    util.Htpapi.post('account/getCardListShow', params).then(res => {
      wx.hideLoading({
        complete: (res) => {},
      })
      if (res.data.stateCode == 100) {
        if (that.data.seriesIndex == 0) {
          // var list = that.data.valueCardList
          // console
          // list.push.apply(list, res.data.data.list);
          that.data.valueCardList = that.data.valueCardList.concat(res.data.data.list);
           that.setData({
            // valueCardList: list,
            valueCardList: that.data.valueCardList,
            total: res.data.data.total
           })
        }

        if (that.data.seriesIndex == 5) {
          // var list = that.data.couponCardList
          // list.push.apply(list, res.data.data.list);
          that.data.couponCardList = that.data.couponCardList.concat(res.data.data.list);
           that.setData({
            // couponCardList: list,
            couponCardList: that.data.couponCardList,
            total: res.data.data.total
           })
        }
      } else {
        wx.showToast({
          icon: "none",
          title: res.data.message,
        })
      }
    })
  },

      /**  政策卡余量 */
  packCardData: function () {
    wx.showLoading({
      title: '加载中。。。',
    })
    var that = this;
    var params = {
      custID:that.data.custID,
      currentPage: currentPage,
      pageSize:"10",
      productType: that.data.productType
    }
    util.Htpapi.post('account/getPackageListShow', params).then(res => {
      wx.hideLoading({
        complete: (res) => {},
      })
      if (res.data.stateCode == 100) {
        if (that.data.seriesIndex == 4) {
          // var list = that.data.packCardList
          // list.push.apply(list, res.data.data.list);
          that.data.packCardList = that.data.packCardList.concat(res.data.data.list);
           that.setData({
            // packCardList: list,
            packCardList: that.data.packCardList,
            total: res.data.data.total
           })
        }
      } else {
        wx.showToast({
          icon: "none",
          title: res.data.message,
        })
      }
    })
  },



})