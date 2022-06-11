const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateCreateUser(data) {

    let errors = [];
    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    const nameCheck = data.username.replace(/\s+/g, " ").trim();
    // Name checks
    if (Validator.isEmpty(nameCheck)) {
      errors.push("Name field is required");
    }
    // Email checks
    if (Validator.isEmpty(data.email)) {
      errors.push ( "Email field is required");
    } else if (!Validator.isEmail(data.email)) {
      errors.push("Email is invalid");
    }
    // Password checks
    if (Validator.isEmpty(data.password)) {
      errors.push("Password field is required");
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.push("Password must be at least 6 characters");
    }
    return {
      errors,
      isValid: isEmpty(errors),
    };
  };
  