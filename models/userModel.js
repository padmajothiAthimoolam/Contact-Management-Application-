const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required:[true, "Please add the User name"],
    },
    email: {
        type: String,
        required:[true,"please add the Email id"],
        unique: [true, "Email is already taken"]
    },
    password:{
        type: String,
        required: [true, "Please enter password"],
    },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("user", userSchema);