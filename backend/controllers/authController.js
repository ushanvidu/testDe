const User  = require('../models/user');

exports.register = async (req, res) => {
    try {
        const {fullname, username, email, password} = req.body;

        const exitingUser = await User.findOne({$or:[{email}, {username}]});
        if (exitingUser) {
            return res.status(400).json({msg: 'User already exists'});
        }

        const user = await User.create({fullname, username, email, password});


        res.status(201).json
        ({
            msg: 'User registered successfully',
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullname: user.fullname,
                    username: user.username,
                    password: user.password,
                    email: user.email,

                }
            }

        });
    }
        catch (error){
            res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
    });
}
};

//login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        if(user.password !== password){
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    fullname: user.fullname,
                    username: user.username,
                    password: user.password,
                    email: user.email,
                }
            }
        })
    }catch (error){
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

