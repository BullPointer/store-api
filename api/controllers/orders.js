const mongoose = require("mongoose");
const Order = require("../model/order");

exports.get_all_orders = (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate("_id product quantity")
    .exec()
    .then((products) => {
      res.status(200).json({
        count: Order.length,
        message: "Successful request for all Orders",
        products: products.map((orderObj) => {
          return {
            _id: orderObj._id,
            product: orderObj.product,
            quantity: orderObj.quantity,
            request: {
              type: "GET",
              description: "Make a get request by Id",
              url: `http://localhost:3000/api/orders/${orderObj._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_orders = (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.productId,
    quantity: req.body.quantity,
  });
  order
    .save()
    .then((order) => {
      res.status(201).json({
        message: "New order created",
        createdProduct: {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
        },
        request: {
          type: "GET",
          description: "Make a get request",
          url: "http://localhost:3000/api/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Bad request body",
        error: err,
      });
    });
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("_id product quantity")
    .populate("_id product quantity")
    .exec()
    .then((orderObj) => {
      res.status(200).json({
        message: "Successful request for Order by ID",
        order: {
          _id: orderObj._id,
          product: orderObj.product,
          quantity: orderObj.quantity,
          request: {
            type: "GET",
            description: "Make a get request by Id",
            url: `http://localhost:3000/api/orders/`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Order not found",
        error: err,
      });
    });
};

exports.edit_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      const newOrder = {};
      for (const obj of req.body) newOrder[obj.orderKey] = obj.orderValue;

      Order.findByIdAndUpdate({ _id: req.params.orderId }, { $set: newOrder })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Order Updated",
            request: {
              type: "GET",
              description: "Make a get request by Id",
              url: `http://localhost:3000/api/orders/${result._id}`,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Unexpected Error",
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_orders = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((products) => {
      if (!products) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      Order.findByIdAndRemove({ _id: req.params.orderId })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Order deleted successfully",
            request: {
              type: "GET",
              description: "Make a get request",
              url: "http://localhost:3000/api/orders/",
            },
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
