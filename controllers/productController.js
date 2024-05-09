const asycnHandler = require("../middleware/asyncHandle");
const { Product, categories } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

// Get All Products
const getAllProducts = asycnHandler(async (req, res) => {
  const { search, limit , page } = req.query;
  

  let dataProduct = "";

  if (search || limit || page) {
    const pageData = page * 1 || 1
    const limitData = limit * 1 || 100
    const offsetData = (pageData - 1) * limitData
    const searchData = search || ""
    const products = await Product.findAndCountAll({
      limit: limitData,
      offset: offsetData,
      where: {
        name: {
          [Op.like]: "%" + searchData + "%",
        },
      },
      include: [
        {
          model: categories,
          attributes: { exclude:  [
            "createdAt", "updatedAt", "id"
          ]}
        }
      ],
    });

    dataProduct = products;
  } else {
    const products = await Product.findAndCountAll({
      include: [
        {
          model: categories,
          attributes: { exclude:  [
            "createdAt", "updatedAt", "id"
          ]}
        }
      ],
    }
      
    );
    dataProduct = products;
  }
  return res.status(200).json({
    status: "success",
    data: dataProduct,
  });
});

// Create Product
const createProduct = asycnHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  const fileName = file.filename;

  const pathFile = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/products/${fileName}`;

  const newProduct = await Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    categories_id: req.body.categories_id,
    stock: req.body.stock,
    image: pathFile,
  });
  res.status(201).json({
    status: "success",
    data: newProduct,
  });
});

const detailProduct = asycnHandler(async (req, res) => {
  const id = req.params.id;
  const dataProduct = await Product.findByPk(id, 
    {
      include: [
        {
          model: categories,
          attributes: { exclude:  [
            "createdAt", "updatedAt", "id"
          ]}
        }
      ],
    });




  if (!dataProduct) {
    res.status(404);
    throw new Error("Data not found");
  }
  res.status(200).json({
    status: "success",
    data: {
      dataProduct,

    },
  });
});

const updateProduct = asycnHandler(async (req, res) => {
  const id = req.params.id;

  const dataProduct = await Product.findByPk(id);

  if (!dataProduct) {
    res.status(404);
    throw new Error("Data not found");
  }

  //   Req File
  const file = req.file;

  // raplice image
  if (file) {
    // get image lama
    const nameImage = dataProduct.image.replace(
      `${req.protocol}://${req.get("host")}/public/uploads/products/`,
      ""
    );
    // path image lama
    const pathImage = `./public/uploads/products/${nameImage}`;
    // deleted image lama
    fs.unlink(pathImage, (err) => {
      if (err) {
        res.status(400);
        throw new Error("Failed to delete image");
      }
    });
    // update image
    const fileName = file.filename;

    const pathFile = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/products/${fileName}`;

    dataProduct.image = pathFile;
  }

  dataProduct.name = req.body.name || dataProduct.name;
  dataProduct.price = req.body.price || dataProduct.price;
  dataProduct.categories = req.body.categories || dataProduct.categories;
  dataProduct.stock = req.body.stock || dataProduct.stock;
  dataProduct.description = req.body.description || dataProduct.description;
  dataProduct.save();
  return res.status(200).json({
    status: "success",
    data: dataProduct,
  });
});

const deleteProduct = asycnHandler(async (req, res) => {
  const id = req.params.id;
  const dataProduct = await Product.findByPk(id);
  if (dataProduct) {
    // get image lama
    const nameImage = dataProduct.image.replace(
      `${req.protocol}://${req.get("host")}/public/uploads/products/`,
      ""
    );
    // path image lama
    const pathImage = `./public/uploads/products/${nameImage}`;
    // deleted image lama
    fs.unlink(pathImage, (err) => {
      if (err) {
        res.status(400);
        throw new Error("Failed to delete image");
      }
    });
    dataProduct.destroy();
    return res.status(200).json({
      status: "success",
      message: `Data product ${dataProduct.name} has been deleted successfully`,
    });
  }
  res.status(404);
  throw new Error("Data not found");
});

module.exports = {
  getAllProducts,
  createProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
};
