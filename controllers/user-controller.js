const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email,
                username: loggedInUser.username
            }
        });
    });
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, passwordVerify, securityQuestions} = req.body;

        if (!firstName || !lastName || !email || !username || !password || !passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter all required fields."
                });
        }
        if (!email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            ) {
                return res
                .status(400)
                .json({
                    errorMessage: "Please enter a valid email address."
                });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Passwords don't match."
                });
        }
        
        const existingUser = await User.findOne({ 
            $or: [
                { 'email': email },
                { 'username': username }
              ]
        });
        
        
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username or email already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            firstName, lastName, email, username, passwordHash, securityQuestions 
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                username: savedUser.username,
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                passwordHash: savedUser.passwordHash,
                securityQuestions: savedUser.securityQuestions
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter all required fields."
                });
        }

        const existingUser = await User.findOne({ username: username });

        console.log(existingUser);

        const correctPass = await bcrypt.compare(password, existingUser.passwordHash);

        if (correctPass) {
            const token = auth.signToken(existingUser);

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: existingUser
            });

            return;
        }

        return res.status(400).json({
            errorMessage: "Invalid username or password"
        });
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Invalid username or password"
        });
    }
}

logoutUser = async (req, res) => {
    return res.clearCookie("token").status(200).json({
        success: true
    });
}

getUser = async (req, res) => {
    try {
        const { username } = req.params;

        let existingUser = await User.findOne({ username: username });
    
        if (existingUser) {
            return res.status(200).json({
                success: true,
                user: existingUser
            });
        }

        return res.status(400).json({
            errorMessage: "User not found"
        });
    } catch (err) {
        return res.status(400).json({
            errorMessage: "User not found"
        });
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUser
}