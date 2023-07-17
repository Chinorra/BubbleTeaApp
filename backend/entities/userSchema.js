const mongoose = require("mongoose");
const { Schema } = mongoose;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

var validatePassword = function (password) {
  var re = /^(?=.*[A-Z])(?=.*\d).+$/;
  return re.test(password)
}

const addressSchema = new Schema({
  street: {
    type: String,
    required: true
  },
  city : {
    type: String,
    required: true
  }
})

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate: [validatePassword, 'The password must contain at least one uppercase character and one number.'],
    match: [
      /^(?=.*[A-Z])(?=.*\d).+$/,
      'The password must contain at least one uppercase character and one number.'
    ]
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // The regular expression to validate Vietnamese phone numbers
        return /^(?:\+84|0)(?:\d){9,10}$/.test(value);
      },
      message: 'The phone number must be a valid Vietnamese phone number.'
    }
  },
  address: {
    type: addressSchema,
    required: true
  },
  role: {
    type: String,
    default: "member",
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        productname: {
          type: String,
          required: true
        },
        price: {
          type: String,
          required: true
        },
        quantity: {
          type: Number
        },
        sumPrice: {
          type: Number
        }
      },
    ],
    total: {
      type: Number,
    },
    time: {
      type: Date,
      
    }
  },
});

// UserSchema.pre("save", function (next) {
//   // Your validation or middleware logic goes here
//   // For example, you can check if the password meets certain criteria before saving
//   // or perform any other required validations or modifications.

//   // Call next() to proceed with saving the user
//   next();
// });

//mongo config
const User = mongoose.model("users", UserSchema);

module.exports = User;
