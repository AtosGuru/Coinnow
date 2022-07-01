export const ispassword = value => {
  if (!value || value.length === 0) {
    return { success: false, message: 'Password is required!' };
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
  let regEx = /^(\+\d{1,3}[- ]?)?\d{8}$/;
  if (!value.match(regEx)) {
    return { success: false, message: 'Invalid mobile number!' };
  }
  return { success: true, message: '' };
};

export const numberWithComma = x => {
  var parts = x.toString().split('.');
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (parts[1] ? '.' + parts[1] : '')
  );
};
