const asycnHandler = require("../middleware/asyncHandle");
const {Profile} = require("../models");

const updateOrCreateProfile = asycnHandler(async(req, res) => {
    const idUser = req.User.id;
 
    const userData = await Profile.findOne({
        where: {user_id: idUser}
    })

    let messeage = ""

    if(userData){
        // Update User 
        await Profile.update({
            age: req.body.age || userData.age,
            bio: req.body.bio || userData.bio,
            address: req.body.address || userData.address,    
        }, {
            where: {user_id: idUser}
        })
        messeage = "Updated Profile Success"
    }else{
        // Create User
        await Profile.create({
            age: req.body.age,
            bio: req.body.bio,
            address: req.body.address,
            user_id: idUser
        })

        messeage = "Created New Profile Success"
    }

    return res.status(201).json({
        status: "Success",
        messeage: messeage
    })

})



module.exports = {
    updateOrCreateProfile
}