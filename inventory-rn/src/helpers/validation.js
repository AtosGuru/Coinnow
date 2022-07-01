export const isValidpassword = value => {
  if (!value || value.length === 0) {
    return { success: false, message: 'Password is required!' };
  }
  return { success: true, message: '' };
};

export const isValidConfirmPassword = (password, confirmPassword) => {
  if (password != confirmPassword) {
    return { success: false, message: 'Confirm password does not match' };
  }
  return { success: true, message: '' };
};

export const isValidEmail = emailField => {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if (!emailField || (emailField && emailField.trim().length === 0)) {
    return { success: false, message: 'Email address is required!' };
  }
  if (reg.test(emailField) == false) {
    return { success: false, message: 'Invalid email address!' };
  }
  return { success: true, message: '' };
};

export const isValidMobile = value => {
  if (!value || value.length === 0) {
    return { success: false, message: 'Please enter valid mobile number!' };
  }
  let regEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  if (!value.match(regEx)) {
    return { success: false, message: 'Invalid mobile number!' };
  }
  return { success: true, message: '' };
};
