const Users = require('../models/users-model');

export default class UserController {

    createNewUser = async (req, res, next) => {
        try {
            const newUser = {
                'username': req.body.username,
                'password': req.body.password,
                'name': req.body.name,
                'role': req.body.role,
                'address': req.body.address
            };
            await Users.create(newUser, function (err, data) {
                if (err) { console.log('ERROR:', err);
                }
                console.log('Created success!', data);
                return res.status(200).json({
                    success: true,
                    data: newUser
                });
            });

        } catch (e) {
            console.log(e);
            return res.status(400).json({
                success: false,
                error: e.message
            })
        }
    };
    getUserById = async (req, res, next) => {
        try {
            const user = req.params.id;
            await Users.findById(user, function(err, data) {
                if(err) {
                    console.log('ERROR:', err);
                }
                return res.status(200).json({
                    success: true,
                    data: data
                });
            });
        } catch(e) {
            console.log(e);
            return res.status(400).json({
                success: false,
                error: e.message
            })
        }
    };
    getAllUser = async (req,res, next) => {
        try {
            await Users.find({}, function(err, data) {
                if(err) {
                    console.log('ERROR:', err);
                }
                return res.status(200).json({
                    success: true,
                    data: data
                });
            });
        } catch(e) {
            console.log(e);
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    };
    deleteUser = async (req, res, next) => {
        try {
            const user = req.params.id;
            await Users.deleteOne({_id: user}, function(err) {
                if(!err) {
                    return res.status(200).json({
                        success: true,
                        data: "Delete successful!"
                    });
                }
                console.log('ERROR:', err);
            });
        } catch(e){
            console.log(e);
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    }
    updateUser = async (req, res, next) => {
        try {
            const user = req.params.id;
            await Users.findOneAndUpdate(
                user,
                req.body,
                {new: true},
                (err, data) => {
                    // Handle any possible database errors
                    if (err) return res.status(400).json({
                        success: false,
                        error: err.message
                    });
                    return res.status(200).json({
                        success: true,
                        data: data
                    });
                })
        } catch(e){
            console.log(e);
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    }


}