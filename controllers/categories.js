
const { categories, Product } = require("../models");
const asyncHandler = require("../middleware/asyncHandle");

// GET Method
const getAllCategories = asyncHandler(async (req, res) => {
  const newCategories = await categories.findAll();
  res.status(200).json({
    status: "success",
    data: newCategories,
  });
});

// POST Method
const createCategory = asyncHandler(async (req, res) => {
  const newCategories = await categories.create({
    name: req.body.name,
    description: req.body.description,
  });

  res.status(201).json({
    status: "success",
    data: newCategories,
  });
});
// error: error.errors[0].message,

//  GET Detail Categories
const detailCategories = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const newCategories = await categories.findByPk(id, {
    include: [
      {
        model: Product,
        attributes: { exclude:  [
          "createdAt", "updatedAt", "categories_id"
        ]}
      }
    ],
  });
  // if (!newCategories) {
  //   return res.status(404).json({
  //     status: "fail",
  //     error: "Data not found",
  //   });
  // }
  if (!newCategories) {
    res.status(404);
    throw new Error("Data not found");
  }

  res.status(200).json({
    status: "success",
    data: newCategories,
  });
});

// PUT Method
const updateCategories = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await categories.update(req.body, {
    where: {
      id,
    },
  });
  const newCategories = await categories.findByPk(id);

  // if (!newCategories) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Data not found",
  //   });
  // }

  if (!newCategories) {
    res.status(404);
    throw new Error("Data not found");
  }

  return res.status(200).json({
    status: "success",
    data: newCategories,
  });
});

// DELETE Method
const deleteCategories = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const dataCategories = await categories.findByPk(id);
  if (!dataCategories) {
    res.status(404);
    throw new Error("Data not found");
  }

  await categories.destroy({
    where: {
      id,
    },
  });

  return res.status(200).json({
    status: "success",
    message: `Data categories ${dataCategories.name} has been deleted successfully`,
  });
});

module.exports = {
  getAllCategories, // GET Method
  createCategory,
  detailCategories,
  updateCategories,
  deleteCategories,
};
