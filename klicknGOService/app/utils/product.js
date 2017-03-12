var Product = require('../models/product');
var conversationUtil = require('../utils/conversation');

var productUtil = {
  insertProduct: function (product, callback) {
    /** Save product */
    product.save(function (err, result) {
      if (err) throw err;
      console.log('conversation created!' + product._id);
      callback(result._id);
    });
  },
  saveProduct: function (data, callback) {
    data.type = "PRODUCT";
    conversationUtil.saveMsgs(data, function (result) {
      console.log('Conversion Data :' + JSON.stringify(result));
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
        var product = new Product();
        product.name = items[i].item;
        product.conversationId = result.conversationId;
        productUtil.insertProduct(product, function(res) {
          tasksfinished++;
          check();
        });
        
      }
    });
  }
};

module.exports = productUtil;
