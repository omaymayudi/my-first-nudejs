const asyncHandler = require("../middleware/asyncHandle")
const { Review } = require("../models")

const createReview = asyncHandler(async(req, res) => {
    const idUser = req.User.id
    const idProduct = req.params.productId

    await Review.create({
        product_id: idProduct,
        user_id: idUser,
        point: req.body.point,
        content: req.body.content
    })
})

module.exports = {
    createReview
}