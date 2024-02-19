import mongoose from "mongoose";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "User's first name required"],
      minLength: [5, "Name should be atleast 5 Characters"],
      maxLength: [50, "Name should be atmost 5 Characters"],
      lowercase: true,
      trim: true,
    },
    middleName: {
      type: String,
      minLength: [5, "Name should be atleast 5 Characters"],
      maxLength: [50, "Name should be atmost 5 Characters"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "User's last  name required"],
      minLength: [5, "Name should be atleast 5 Characters"],
      maxLength: [50, "Name should be atmost 5 Characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
    },

    avatar: {
      public_id: {
        type: "string",
      },
      secure_url: {
        type: "string",
      },
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already used"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    dob: {
      type: Date,
      required: [true, "date of birth is required"],
    },
    homeAdress: {
      type: String,
    },
    workAdress: {
      type: String,
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderPlace",
      },
    ],
    refreshToken: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
      validate: {
        validator: function (v) {
          return /^(\+91\)?[6,7,8,9]\d{9}$/.test(v);
        },
        message: (props) => `${props.value} is not valid number`,
      },
    },
  },
  { timestamps: true }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userModel.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userModel.methods.generateAccessToken = function () {
  const token = jwt.sign(
    {
      username: this.username,
      email: this.email,
      _id: this._id,
      firstName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  return token;
};
userModel.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      username: this.username,
      email: this.email,
      _id: this._id,
      firstName: this.firstName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return token;
};

export const User = mongoose.model("User", userModel);


export default User;

