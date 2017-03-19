var Order = require('../models/order');
var OrderDetail = require('../models/orderDetail');
var conversationUtil = require('../utils/conversation');

var orderUtil = {
  insertOrderDetail: function (orderDetail, callback) {
    /** Save product */
    orderDetail.save(function (err, result) {
      if (err) throw err;
      console.log('conversation created!' + orderDetail._id);
      callback(result);
    });
  },
  insertOrder: function (order, callback) {
    /** Save product */
    order.save(function (err, result) {
      if (err) throw err;
      console.log('conversation created!' + Order._id);
      callback(result);
    });
  },
  saveOrder: function (data, callback) {
    conversationUtil.saveMsgs(data, function (result) {
      console.log('Conversion Data :' + JSON.stringify(result));
      /** Save order */
      var orderData = new Order();
      orderData.customerId = data.to_id;
      orderData.total = data.total;
      orderData.conversationId = result.conversationId;
      orderUtil.insertOrder(orderData, function(order) {
        var items = data.product;
        var totaltasks = items.length;
        var tasksfinished = 0;
        // helper function
        var check = function() {
            if (totaltasks == tasksfinished) {
                callback(result);
            }
        };
        for (let i = 0; i < items.length; i++) {
            var orderDetail = new OrderDetail();
            orderDetail.productId = items[i]._id;
            orderDetail.availability = items[i].availability;
            orderDetail.orderId = order._id;
            orderUtil.insertOrderDetail(orderDetail, function(res) {
              tasksfinished++;
              check();
            });
        }
      });
    });
  }
};

module.exports = orderUtil;
