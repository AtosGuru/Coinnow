import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtirxBackButton,
  OtrixDivider,
  OtrixAlert,
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authData } from '@actions';
import getApi from '@apis/getApi';
import { logfunction } from '@helpers/FunctionHelper';
import { GlobalStyles, Colors, isValidMobile } from '@helpers';
import AsyncStorage from '@react-native-community/async-storage';

function EditProfileScreen(props) {
  const [formData, setData] = React.useState({
    first_name: null,
    last_name: null,
    email: null,
    mobileNumber: null,
    submited: false,
    loading: false,
    message: null,
    type: 'error',
  });
  const [errors, setErrors] = React.useState({});
  const [showMessage, setShowLoading] = React.useState(false);
  const {
    first_name,
    last_name,
    email,
    mobileNumber,
    submited,
    loading,
    message,
    type,
  } = formData;

  const validate = () => {
    logfunction('Name ', first_name);
    logfunction('Errors ', errors);
    setData({ ...formData, submited: true });

    if (first_name == null || first_name == '') {
      logfunction('FIeld ', 'First name is required');
      setErrors({
        ...errors,
        first_name: 'First Name is required',
      });
      return false;
    } else if (mobileNumber == null) {
      logfunction('FIeld ', 'Mobile number is required');
      setErrors({
        ...errors,
        mobileNumber: 'Mobile number is required',
      });
      return false;
    } else if (!isValidMobile(mobileNumber).success) {
      logfunction('FIeld ', isValidMobile(mobileNumber).message);
      setErrors({
        ...errors,
        invalidmobileNumber: isValidMobile(mobileNumber).message,
      });
      return false;
    }
    return true;
  };

  const update = () => {
    if (validate()) {
      setData({
        ...formData,
        loading: true,
      });
      let sendData = new FormData();
      sendData.append('firstname', first_name);
      sendData.append('lastname', last_name);
      sendData.append('telephone', mobileNumber);
      try {
        getApi.postData('user/updateProfile', sendData).then(async response => {
          logfunction('RESPONSE ', response);
          if (response.status == 1) {
            props.authData(response.data);
            await AsyncStorage.setItem(
              'CUSTOMER_DATA',
              JSON.stringify(response.data),
            );
            setData({
              ...formData,
              type: 'success',
              message: response.message,
              loading: false,
            });
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
            }, 3000);
          } else {
            setData({
              ...formData,
              type: 'error',
              message: response.message,
              loading: false,
            });
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
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

  useEffect(() => {
    logfunction('USER DATA ', props.customerData);
    const { customerData } = props;
    setData({
      ...formData,
      first_name: customerData.firstname,
      last_name: customerData.lastname,
      email: customerData.email,
      mobileNumber: customerData.telephone,
    });
  }, []);

  return (
    <OtrixContainer>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Edit Profile</Text>
        </View>
      </OtrixHeader>
      <OtrixDivider size={'md'} />

      {/* Content Start from here */}
      <OtrixContent>
        {/* Profile  Start from here */}
        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired
          isInvalid={submited && 'first_name' in errors}>
          <Input
            variant="outline"
            value={first_name}
            placeholder="First Name"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => {
              setData({ ...formData, submited: false, first_name: value }),
                delete errors.first_name;
            }}
          />
          <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
            {errors.first_name}
          </FormControl.ErrorMessage>
        </FormControl>

        <OtrixDivider size={'md'} />
        <FormControl style={{ backgroundColor: Colors.white }}>
          <Input
            variant="outline"
            value={last_name}
            placeholder="Last Name"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => setData({ ...formData, last_name: value })}
          />
        </FormControl>
        <OtrixDivider size={'md'} />

        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired
          isInvalid={submited && email == '' ? true : false}>
          <Input
            variant="outline"
            value={email}
            keyboardType="email-address"
            isDisabled={true}
            placeholder="Email Address"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => setData({ ...formData, email: value })}
          />
          <FormControl.ErrorMessage leftIcon={<InfoOutlineIcon size="xs" />}>
            Email is required
          </FormControl.ErrorMessage>
        </FormControl>
        <OtrixDivider size={'md'} />

        <FormControl
          style={{ backgroundColor: Colors.white }}
          isRequired
          isInvalid={
            (submited && 'mobileNumber' in errors) ||
            'invalidmobileNumber' in errors
          }>
          <Input
            variant="outline"
            value={mobileNumber}
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
        <OtrixDivider size={'md'} />
        <Button
          isLoading={loading}
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={GlobalStyles.button}
          onPress={() => update()}>
          <Text style={GlobalStyles.buttonText}>Update</Text>
        </Button>
        <OtrixDivider size={'md'} />
      </OtrixContent>
      {showMessage == true && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    customerData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      authData,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);

const styles = StyleSheet.create({});
