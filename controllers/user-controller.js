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
        const { firstName, lastName, email, username, password, passwordVerify } = req.body;

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
            firstName, lastName, email, username, passwordHash
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
                passwordHash: savedUser.passwordHash
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

sendRecoveryCode = async (req, res) => {
    try {
        const { username } = req.body;
        const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString()

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const recoveryCodeHash = await bcrypt.hash(recoveryCode, salt);

        let existingUser = await User.findOneAndUpdate({ username: username }, {recoveryCodeHash: recoveryCodeHash});

        if (existingUser) {
            var postmark = require("postmark");
            POSTMARK_TOKEN = process.env.POSTMARK_TOKEN
            var client = new postmark.ServerClient(POSTMARK_TOKEN);

            client.sendEmailWithTemplate({
            "TemplateId": 29692064,
            "From": "danielpinyao.huang@stonybrook.edu",
            "To": `${existingUser.email}`,
            "TemplateModel": {
                            "email": username,
                            "recoveryCode": recoveryCode
                        }
            });

            return res.status(200).json({
                success: true,
                message: "Postmark sendEmail request sent success"
            });
        } else {
            return res.status(400).json({
                errorMessage: "Invalid username"
            });
        }
        
  
    } catch (err) {
        return res.status(400).json({
            errorMessage: `Could not send email: ${err}`
        });
    }
}

validateRecoveryCode = async (req, res) => {
    try {
        const { username, recoveryCode } = req.body;

        const existingUser = await User.findOne({ username: username });
        const correctCode = await bcrypt.compare(recoveryCode, existingUser.recoveryCodeHash);

        if (correctCode) {
            return res.status(200).json({
                success: true,
                user: existingUser
            });
        } else {
            return res.status(400).json({
                errorMessage: `Invalid code`
            });
        }
  
    } catch (err) {
        return res.status(400).json({
            errorMessage: `Could not send email: ${err}`
        });
    }
}

changePassword = async (req, res) => {
    try {
        const { username, password, passwordVerify } = req.body;

        if (password.length < 8) {
            return res.status(400).json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        
        if (password !== passwordVerify) {
            return res.status(400).json({
                    errorMessage: "Passwords don't match."
                });
        }

        let existingUser = await User.findOne({ username: username });

        let isSamePassword = await bcrypt.compare(password, existingUser.passwordHash);
        if (isSamePassword) {
            return res.status(400).json({
                errorMessage: "New password can not be same as old password"
            });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        existingUser.passwordHash = passwordHash
        existingUser.save()

        return res.status(200).json({
            success: true,
            message: "Password changed success"
        });
        
  
    } catch (err) {
        return res.status(400).json({
            errorMessage: `Could not change password: ${err}`
        });
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    sendRecoveryCode,
    validateRecoveryCode,
    changePassword
}