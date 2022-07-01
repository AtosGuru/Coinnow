import React from 'react';
import { requestInit } from '@actions';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixDivider,
} from '@component';
import { Input, Text, FormControl, Button } from 'native-base';
import { connect } from 'react-redux';
import { GlobalStyles, Colors } from '@helpers';

function ForgotPasswordScreen(props) {
  const [formData, setData] = React.useState({});

  return (
    <OtrixContainer>
      {/* Header */}
      <OtrixHeader customStyles={GlobalStyles.authHeader}>
        <Text style={[GlobalStyles.authtabbarText]}>Forgot Password</Text>
        <Text style={GlobalStyles.authSubText}>
          Submit the email you signed up with to reset your password
        </Text>
      </OtrixHeader>
      <OtrixDivider size={'md'} />

      {/* Content Start from here */}
      <OtrixContent>
        {/* Forgot password form Start from here */}
        <FormControl isRequired>
          <Input
            variant="outline"
            placeholder="Email Address"
            style={GlobalStyles.textInputStyle}
            onChangeText={value => setData({ ...formData, email: value })}
          />
          <FormControl.ErrorMessage _text={{ fontSize: 'xs' }}>
            Error Name
          </FormControl.ErrorMessage>
        </FormControl>
        <OtrixDivider size={'md'} />
        <Button
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={GlobalStyles.button}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={GlobalStyles.buttonText}>Submit</Text>
        </Button>
        <OtrixDivider size={'md'} />
        <Button
          size="md"
          variant="outline"
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={[GlobalStyles.buttonText, { color: Colors.black }]}>
            Back to login
          </Text>
        </Button>
      </OtrixContent>
    </OtrixContainer>
  );
}

function mapStateToProps({ params }) {
  return {};
}

export default connect(mapStateToProps)(ForgotPasswordScreen);
