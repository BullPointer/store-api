const mongoose = require("mongoose");
const Product = require("../model/product");

exports.get_all_products = (req, res, next) => {
  Product.find()
    .select("_id title price description category available rating productImage")
    .exec()
    .then((products) => {
      res.status(200).json({
        count: Product.length,
        message: "Successful request for all Product",
        products: products.map((productObj) => {
          return {
            _id: productObj._id,
            title: productObj.title,
            price: productObj.price,
            description: productObj.description,
            category: productObj.category,
            available: productObj.available,
            rating: productObj.rating,
            productImage: productObj.productImage,
            request: {
              type: "GET",
              description: "Make a get request by Id",
              url: `http://localhost:3000/api/products/${productObj._id}`,
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

exports.create_products = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    available: req.body.available,
    rating: req.body.rating,
    productImage: req.file.path,
  });
  product
    .save()
    .then((product) => {
      res.status(201).json({
        message: "New product added",
        createdProduct: {
          _id: product._id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          available: product.available,
          rating: product.rating,
          productImage: product.productImage
        },
        request: {
          type: "GET",
          description: "Make a get request",
          url: "http://localhost:3000/api/products/",
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

exports.get_product = (req, res, next) => {
  Product.findById(req.params.productId)
    .select("_id title price description category available rating productImage")
    .exec()
    .then((product) => {
      res.status(200).json({
        message: "Successful request for Product by ID",
        products: {
          _id: product._id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          available: product.available,
          rating: product.rating,
          productImage: product.productImage,
          request: {
            type: "GET",
            description: "Make a get request by Id",
            url: `http://localhost:3000/api/products/`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Product not found",
        error: err,
      });
    });
};

exports.edit_product = (req, res, next) => {
  Product.findById(req.params.productId)
    .exec()
    .then((products) => {
      if (!products) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const product = {};
      for (const obj of req.body) product[obj.productKey] = obj.productValue;

      Product.findByIdAndUpdate(
        { _id: req.params.productId },
        { $set: product }
      )
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Product Updated",
            request: {
              type: "GET",
              description: "Make a get request by Id",
              url: `http://localhost:3000/api/products/${result._id}`,
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

exports.delete_products = (req, res, next) => {
  Product.findById(req.params.productId)
    .exec()
    .then((products) => {
      if (!products) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      Product.findByIdAndRemove({ _id: req.params.productId })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Product deleted successfully",
            request: {
              type: "GET",
              description: "Make a get request",
              url: "http://localhost:3000/api/products/",
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
