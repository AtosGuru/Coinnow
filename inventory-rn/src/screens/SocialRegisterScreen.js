import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
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
import { GlobalStyles, Colors, isValidEmail, isValidMobile } from '@helpers';
import { doLogin } from '@actions';
import { logfunction } from '@helpers/FunctionHelper';
import { bindActionCreators } from 'redux';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';

function SocialRegisterScreen(props) {
  const [formData, setData] = React.useState({
    firstName: null,
    lastName: null,
    email: null,
    mobileNumber: null,
    submited: false,
    type: null,
    message: null,
    loading: false,
    socialID: null,
    image: '',
    creation: '',
  });
  const [errors, setErrors] = React.useState({});
  const {
    firstName,
    lastName,
    mobileNumber,
    email,
    submited,
    type,
    creation,
    image,
    socialID,
    message,
    loading,
  } = formData;

  useEffect(() => {
    const {
      s_email,
      s_socialID,
      s_image,
      s_firstName,
      s_lastName,
      s_creation,
    } = props.route.params;
    setData({
      ...formData,
      email: s_email,
      firstName: s_firstName,
      lastName: s_lastName,
      socialID: s_socialID,
      image: s_image,
      creation: s_creation,
    });
  }, []);

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
    }/* else if (!isValidMobile(mobileNumber).success) {
      logfunction('FIeld ', isValidMobile(mobileNumber).message);
      setErrors({
        ...errors,
        invalidmobileNumber: isValidMobile(mobileNumber).message,
      });
      return false;
    }*/

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
      sendData.append('password', socialID);
      sendData.append('creation', creation);
      sendData.append('social_id', socialID);
      sendData.append('image', image);
      logfunction('SEND  DATA ', sendData);
      try {
        getApi.postData('user/socialRegister', sendData).then(response => {
          logfunction('SOCIAL Register Response ', response);
          if (response.status == 1) {
            setData({
              ...formData,
              email: null,
              password: null,
              loading: false,
            });
            props.doLogin(response, 'HomeScreen');
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
            value={firstName}
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
            value={lastName}
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
            value={email}
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
            value={mobileNumber}
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
      </OtrixContent>
      {message != null && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps({ params }) {
  return {};
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      doLogin,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SocialRegisterScreen);

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
