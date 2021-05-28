// miniprogram/pages/todolist/todolist.js
Page({
  data: {
    textAreaValue: "",
    newTaskContent: "",
    unfinishedList: [],
    finishedList: [],
    /*unfinishedList: [{_id: "_id1", _openid: "_openid1", finished: false, taskContent: "task1"}, 
    {_id: "_id2", _openid: "_openid2", finished: false, taskContent: "task2"}, 
    {_id: "_id3", _openid: "_openid3", finished: false, taskContent: "task3"}, 
    {_id: "_id4", _openid: "_openid4", finished: false, taskContent: "task4"}, 
  ],
    finishedList: [{_id: "_id5", _openid: "_openid5", finished: true, taskContent: "task5"}, 
    {_id: "_id6", _openid: "_openid6", finished: true, taskContent: "task6"}, 
    {_id: "_id7", _openid: "_openid7", finished: true, taskContent: "task7"}, 
    {_id: "_id8", _openid: "_openid8", finished: true, taskContent: "task8"},],
 */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateTaskList()
  },

  taskInput: function (e) {
    this.setData({
      newTaskContent: e.detail.value,
    })
  },

  addTaskTap: function (e) { // tap一次就同步一次
    if (this.data.newTaskContent == '') {
      wx.showToast({
        icon: 'none',
        title: '任务为空',
      })
      return
    }

    wx.cloud.init();
    const db = wx.cloud.database()

    db.collection('taskDB').add({
      data: {
        taskContent: this.data.newTaskContent,
        finished: false,
        date: db.serverDate()
      },
    }).then(res => {
      console.log('add tap, res:' + res)
      this.updateTaskList()

      this.setData({
        textAreaValue: ''
      })
      wx.showToast({
        title: '添加任务：' + this.data.newTaskContent,
      })
    })
  },

  unfinishedCheckboxChange: function (e) {

    const tasklist = this.data.unfinishedList // unfinished or finished
    const values = e.detail.value

    // check out index of changed task
    var changed_index = -1
    for (let i = 0, lenI = tasklist.length; i < lenI; i++) {
      if (tasklist[i].finished == false) {
        for (let j = 0, lenJ = values.length; j < lenJ; j++) {
          if (tasklist[i]._id == values[j]) { // 本来是false，values中出现true
            changed_index = i
            break
          }
        }
      } else {
        var existInValues = false
        for (let j = 0, lenJ = values.length; j < lenJ; j++) {
          if (tasklist[i]._id == values[j]) {
            existInValues = true
            break
          }
        }
        if (!existInValues) { // 本来是true，values中没出现
          changed_index = i
        }
      }
    }

    // update cloud database
    wx.cloud.init();
    const db = wx.cloud.database()

    db.collection('taskDB').where({
        _id: tasklist[changed_index]._id
      })
      .update({
        data: {
          finished: !tasklist[changed_index].finished
        }
      }).then(res => {
        console.log('(un)finished update, res:' + res)
        this.updateTaskList()
      })
  },

  finishedCheckboxChange: function (e) {

    const tasklist = this.data.finishedList // unfinished or finished
    const values = e.detail.value

    // check out index of changed task
    var changed_index = -1
    for (let i = 0, lenI = tasklist.length; i < lenI; i++) {
      if (tasklist[i].finished == false) {
        for (let j = 0, lenJ = values.length; j < lenJ; j++) {
          if (tasklist[i]._id == values[j]) { // 本来是false，values中出现true
            changed_index = i
            break
          }
        }
      } else {
        var existInValues = false
        for (let j = 0, lenJ = values.length; j < lenJ; j++) {
          if (tasklist[i]._id == values[j]) {
            existInValues = true
            break
          }
        }
        if (!existInValues) { // 本来是true，values中没出现
          changed_index = i
        }
      }
    }

    // update cloud database
    wx.cloud.init();
    const db = wx.cloud.database()

    db.collection('taskDB').where({
        _id: tasklist[changed_index]._id
      })
      .update({
        data: {
          finished: !tasklist[changed_index].finished
        }
      }).then(res => {
        console.log('(un)finished update, res:' + res)
        this.updateTaskList()
      })
  },

  updateTaskList: function () {
    var that = this;
    wx.cloud.init();
    const db = wx.cloud.database()

    wx.cloud.database().collection('taskDB').where({
      finished: false
    }).get().then(res => {
      console.log(res)
      that.setData({
        unfinishedList: res.data.reverse()
      })
    })

    wx.cloud.database().collection('taskDB').where({
      finished: true
    }).get().then(res => {
      console.log('false res:', res)
      that.setData({
        finishedList: res.data.reverse()
      })
    })
  },
  /*
    sort((a, b) => {
      if(a>b) {
        return 1;
      }
    })
  */

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

})