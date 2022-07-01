import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixDivider,
  OtrixAlert,
  OtrixLoader,
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from 'native-base';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  GlobalStyles,
  Colors,
  isValidEmail,
  isValidMobile,
  isValidpassword,
  isValidConfirmPassword,
} from '@helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import { logfunction } from '@helpers/FunctionHelper';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';

function RegisterScreen(props) {
  const [formData, setData] = React.useState({
    firstName: null,
    lastName: null,
    email: null,
    mobileNumber: null,
    password: null,
    cpassword: null,
    submited: false,
    type: null,
    message: null,
    loading: false,
  });
  const [mode, setMode] = React.useState('seller');

  const [state, setDatapassword] = React.useState({ secureEntry: true });
  const [errors, setErrors] = React.useState({});
  const {
    firstName,
    lastName,
    mobileNumber,
    email,
    password,
    cpassword,
    submited,
    type,
    message,
    loading,
  } = formData;

  useEffect(() => {}, []);

  const validate = () => {
    logfunction('Name ', firstName);
    logfunction('Errors ', errors);
    setData({ ...formData, submited: true });

    if (firstName == null || firstName == '') {
      logfunction('FIeld ', 'First name is required');
      setErrors({
        ...errors,
        name: 'First Name is required',
      });
      return false;
    } else if (email == null) {
      logfunction('FIeld ', 'Email is required');
      setErrors({
        ...errors,
        email: 'Email is required',
      });
      return false;
    } else if (!isValidEmail(email).success) {
      logfunction('FIeld ', isValidEmail(email).message);
      setErrors({
        ...errors,
        invalidEmail: isValidEmail(email).message,
      });
      return false;
    } else if (mobileNumber == null) {
      logfunction('FIeld ', 'Mobile number is required');
      setErrors({
        ...errors,
        mobileNumber: 'Mobile number is required',
      });
      return false;
    } /*else if (!isValidMobile(mobileNumber).success) {
      logfunction('FIeld ', isValidMobile(mobileNumber).message);
      setErrors({
        ...errors,
        invalidmobileNumber: isValidMobile(mobileNumber).message,
      });
      return false;
    } */ else if (!isValidpassword(password).success) {
      logfunction('FIeld ', isValidpassword(password).message);
      setErrors({
        ...errors,
        password: isValidpassword(password).message,
      });
      return false;
    } else if (!isValidConfirmPassword(password, cpassword).success) {
      setErrors({
        ...errors,
        cpassword: isValidConfirmPassword(password, cpassword).message,
      });
      return false;
    }
    return true;
  };

  const register = () => {
    if (validate()) {
      setData({
        ...formData,
        loading: true,
      });
      let sendData = new FormData();
      sendData.append('firstname', firstName);
      sendData.append('lastname', lastName);
      sendData.append('email', email);
      sendData.append('telephone', mobileNumber);
      sendData.append('store_name', 'store');
      sendData.append('status', 1);
      sendData.append('password', password);
      sendData.append('creation', 'D');

      try {
        const route = mode === 'seller' ? 'seller/register' : 'user/register';
        getApi.postData(route, sendData).then(response => {
          logfunction('RESPONSE ', response);
          if (response.status == 1) {
            props.navigation.navigate('RegisterSuccessScreen');
          } else {
            setData({
              ...formData,
              type: 'error',
              message: response.message,
              loading: false,
            });
            setTimeout(() => {
              setData({
                ...formData,
                message: null,
                loading: false,
              });
            }, 3000);
          }
        });
      } catch (error) {
        logfunction('Error', error);
        setData({
          ...formData,
          loading: false,
        });
      }
    }
  };

  return (
    <OtrixContainer>
      {/* Header */}
      <OtrixHeader customStyles={GlobalStyles.authHeader}>
        <Text style={[GlobalStyles.authtabbarText]}>Register Account</Text>
        <Text style={GlobalStyles.authSubText}>
          Create account to continue shopping with Weird App
        </Text>
      </OtrixHeader>
      <OtrixDivider size={'md'} />

      {/* Content Start from here */}
      <OtrixContent>
        {/* Registration Form Start from here */}
        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired
          isInvalid={submited && 'name' in errors}>
          <Input
            variant="outline"
            placeholder="First Name"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => {
              setData({ ...formData, submited: false, firstName: value }),
                delete errors.name;
            }}
          />
          <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
            {errors.name}
          </FormControl.ErrorMessage>
        </FormControl>
        <OtrixDivider size={'sm'} />
        <FormControl style={{ backgroundColor: Colors.white }} isRequired>
          <Input
            variant="outline"
            placeholder="Last Name"
            style={GlobalStyles.textInputStyle}
            onChangeText={value =>
              setData({ ...formData, submited: false, lastName: value })
            }
          />
        </FormControl>
        <OtrixDivider size={'sm'} />
        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired
          isInvalid={
            (submited && 'email' in errors) || 'invalidEmail' in errors
          }>
          <Input
            variant="outline"
            placeholder="Email Address"
            style={GlobalStyles.textInputStyle}
            keyboardType="email-address"
            onChangeText={value => {
              setData({ ...formData, email: value }),
                delete errors.email,
                delete errors.invalidEmail;
            }}
          />
          {'invalidEmail' in errors == false && 'email' in errors && (
            <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
              {errors.email}
            </FormControl.ErrorMessage>
          )}
          {'invalidEmail' in errors && (
            <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
              {errors.invalidEmail}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
        <OtrixDivider size={'sm'} />
        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired
          isInvalid={
            (submited && 'mobileNumber' in errors) ||
            'invalidmobileNumber' in errors
          }>
          <Input
            variant="outline"
            keyboardType="number-pad"
            placeholder="Mobile Number"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => {
              setData({ ...formData, submited: false, mobileNumber: value }),
                delete errors.mobileNumber,
                delete errors.invalidmobileNumber;
            }}
          />

          {'invalidmobileNumber' in errors == false &&
            'mobileNumber' in errors && (
              <FormControl.ErrorMessage
                leftIcon={<InfoOutlineIcon size="xs" />}>
                {errors.mobileNumber}
              </FormControl.ErrorMessage>
            )}
          {'invalidmobileNumber' in errors && (
            <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
              {errors.invalidmobileNumber}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
        <OtrixDivider size={'sm'} />
        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired={true}
          isInvalid={submited && 'password' in errors}>
          <Input
            variant="outline"
            placeholder="Password"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => {
              setData({ ...formData, submited: false, password: value }),
                delete errors.password;
            }}
            secureTextEntry={state.secureEntry}
            InputRightElement={
              <TouchableOpacity
                onPress={() =>
                  setDatapassword({ ...state, secureEntry: !state.secureEntry })
                }
                style={{ marginRight: wp('3%') }}>
                <Icon
                  name={state.secureEntry == true ? 'eye' : 'eye-off'}
                  size={18}
                  color={Colors.secondry_text_color}
                />
              </TouchableOpacity>
            }
          />
          <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
            {errors.password}
          </FormControl.ErrorMessage>
        </FormControl>
        <OtrixDivider size={'sm'} />
        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired
          isInvalid={submited && 'cpassword' in errors}>
          <Input
            variant="outline"
            placeholder="Confirm Password"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => {
              setData({ ...formData, submited: false, cpassword: value }),
                delete errors.cpassword;
            }}
            secureTextEntry={state.secureEntry}
            InputRightElement={
              <TouchableOpacity
                onPress={() =>
                  setDatapassword({ ...state, secureEntry: !state.secureEntry })
                }
                style={{ marginRight: wp('3%') }}>
                <Icon
                  name={state.secureEntry == true ? 'eye' : 'eye-off'}
                  size={18}
                  color={Colors.secondry_text_color}
                />
              </TouchableOpacity>
            }
          />
          <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
            {errors.cpassword}
          </FormControl.ErrorMessage>
        </FormControl>
        <OtrixDivider size={'md'} />
        <Button
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={GlobalStyles.button}
          onPress={() => register()}>
          <Text style={GlobalStyles.buttonText}>Register Now</Text>
        </Button>
        <OtrixDivider size={'md'} />
        {loading && <OtrixLoader />}
        {loading && <OtrixDivider size={'md'} />}
        <View style={styles.registerView}>
          <Text style={styles.registerTxt}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('LoginScreen')}>
            <Text style={styles.signupTxt}> Sign In </Text>
          </TouchableOpacity>
        </View>
        <OtrixDivider size={'md'} />
      </OtrixContent>
      {message != null && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps({ params }) {
  return {};
}

export default connect(mapStateToProps)(RegisterScreen);

const styles = StyleSheet.create({
  registerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerTxt: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    fontFamily: Fonts.Font_Reguler,
    color: Colors.secondry_text_color,
  },
  signupTxt: {
    fontSize: wp('3.5%'),
    textAlign: 'right',
    fontFamily: Fonts.Font_Semibold,
    color: Colors.link_color,
  },
});
