import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixDivider,
  OtrixSocialContainer,
  OtrixAlert,
  OtrixLoader,
} from '@component';
import {
  Input,
  Text,
  FormControl,
  Button,
  InfoOutlineIcon,
  Radio,
  Stack,
} from 'native-base';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidEmail, isValidpassword } from '@helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import { logfunction } from '@helpers/FunctionHelper';
import Fonts from '../helpers/Fonts';
import { bindActionCreators } from 'redux';
import { doLogin } from '@actions';
import getApi from '@apis/getApi';
import Toast from 'react-native-root-toast';
import FBSDK, { LoginManager } from 'react-native-fbsdk';
const { AccessToken, GraphRequest, GraphRequestManager } = FBSDK;
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes, //
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  scopes: ['https://www.google.com/m8/feeds/'],
  webClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});

function LoginScreen(props) {
  const [formData, setData] = React.useState({
    email: null,
    password: null,
    submited: false,
    loading: false,
    type: null,
    message: null,
    navTo: 'Store',
  });
  const [mode, setMode] = React.useState('seller');
  const [state, setDatapassword] = React.useState({ secureEntry: true });
  const [errors, setErrors] = React.useState({});
  const { email, password, submited, loading, message, type, navTo } = formData;

  useEffect(
    () => {},
    [
      //   props.navigation.navigate('ProfileScreen')
    ],
  );

  const validate = () => {
    setData({ ...formData, submited: true });

    if (email == null) {
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
    } else if (!isValidpassword(password).success) {
      logfunction('FIeld ', isValidpassword(password).message);
      setErrors({
        ...errors,
        password: isValidpassword(password).message,
      });
      return false;
    }
    return true;
  };

  const login = () => {
    if (validate()) {
      setData({
        ...formData,
        loading: true,
      });

      let sendData = new FormData();
      sendData.append('email', email);
      sendData.append('password', password);
      try {
        const route = mode === 'seller' ? 'seller/login' : 'user/login';
        getApi.postData(route, sendData).then(response => {
          logfunction('RESPONSE ', response);
          console.log(response)
          if (response.status == 1) {
            logfunction('RESPONSE ', 'Success');
            setData({
              ...formData,
              email: null,
              password: null,
              loading: false,
            });
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
          props.doLogin(response, navTo, mode);
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

  //facebook login 🧔🏻
  const _fbAuth = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions and email.
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
        } else {
          const responseInfoCallback = async (error, result) => {
            if (error) {
              Toast.show('Error fetching data: ' + error.toString(), {
                duration: 3000,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              });
            } else {
              logfunction('Facebook response ', result);
              let email = result.email ? result.email : result.id;
              let image = result.picture ? result.picture.data.url : '';
              let sendData = new FormData();
              sendData.append('email', email);
              sendData.append('password', result.id);
              sendData.append('creation', 'F');
              setData({
                ...formData,
                loading: true,
              });

              //login to our server 🧛🏻‍♀️
              try {
                getApi.postData('user/socialLogin', sendData).then(response => {
                  logfunction('Social RESPONSE ', response);
                  if (response.status == 1) {
                    logfunction('RESPONSE ', 'Success');
                    setData({
                      ...formData,
                      email: null,
                      password: null,
                      loading: false,
                    });
                    props.doLogin(response, navTo);
                  } else {
                    //navigation part  😎
                    if (response.new == 1) {
                      props.navigation.navigate('SocialRegisterScreen', {
                        s_email: email,
                        s_socialID: result.id,
                        s_image: image,
                        s_firstName: result.first_name ? result.first_name : '',
                        s_lastName: result.last_name ? result.last_name : '',
                        s_creation: 'F',
                      });
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
          // Create a graph request asking for user email and names with a callback to handle the response.
          const infoRequest = new GraphRequest(
            '/me',
            {
              parameters: {
                fields: {
                  string: 'email,name,first_name,last_name,picture,gender',
                },
              },
            },
            responseInfoCallback,
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        alert('Login fail with error: ' + error);
      },
    );
  };

  //google sigin
  const _googleAuth = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      logfunction('Google response ', userInfo);

      if (userInfo.idToken != '') {
        let email = userInfo.user.email;
        let image = userInfo.user.photo ? userInfo.user.photo : '';
        let sendData = new FormData();
        sendData.append('email', email);
        sendData.append('password', userInfo.user.id);
        sendData.append('creation', 'G');
        setData({
          ...formData,
          loading: true,
        });

        //login to our server 🧛🏻‍♀️
        try {
          getApi.postData('user/socialLogin', sendData).then(response => {
            logfunction('Social RESPONSE ', response);
            if (response.status == 1) {
              logfunction('RESPONSE ', 'Success');
              setData({
                ...formData,
                email: null,
                password: null,
                loading: false,
              });
              props.doLogin(response, navTo);
            } else {
              //navigation part  😎
              if (response.new == 1) {
                props.navigation.navigate('SocialRegisterScreen', {
                  s_email: email,
                  s_socialID: userInfo.user.id,
                  s_image: image,
                  s_firstName: userInfo.user.name,
                  s_lastName: '',
                  s_creation: 'G',
                });
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
            }
          });
        } catch (error) {
          logfunction('Error', error);
          setData({
            ...formData,
            loading: false,
          });
        }

        //  this.setState({
        // socialName: userInfo.user.name,
        // socialEmail: userInfo.user.email,
        // creation_mode: 'G',
        // social_link: userInfo.user.photo,
        //  });
        // const data = new FormData()
        // data.append("email", userInfo.user.name)
        // data.append("name", userInfo.user.email)
        // data.append("fcm_key", this.state.fcmToken)
        // this.props.socialLogin(data, this.state.returnTo, this.state.stringReturn);
      }
    } catch (error) {
      logfunction('Errors ', error);
    }
  };

  return (
    <OtrixContainer>
      {/* Header */}
      <OtrixHeader customStyles={GlobalStyles.authHeader}>
        <Text style={[GlobalStyles.authtabbarText]}>Login Account</Text>
        <Text style={GlobalStyles.authSubText}>
          Enter your email and password to login
        </Text>
      </OtrixHeader>
      <OtrixDivider size={'md'} />

      {/* Content Start from here */}
      <OtrixContent>
        {/* Login Form Start from here */}
        <FormControl
          isRequired
          style={{ backgroundColor: Colors.white }}
          isInvalid={
            (submited && 'email' in errors) || 'invalidEmail' in errors
          }>
          <Input
            variant="outline"
            placeholder="Email Address"
            style={[GlobalStyles.textInputStyle]}
            value={email}
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
          isRequired
          style={{ backgroundColor: Colors.white }}
          isInvalid={submited && 'password' in errors}>
          <Input
            variant="outline"
            placeholder="Password"
            style={[GlobalStyles.textInputStyle]}
            onChangeText={value => {
              setData({ ...formData, submited: false, password: value }),
                delete errors.password;
            }}
            secureTextEntry={state.secureEntry}
            value={password}
            InputRightElement={
              <TouchableOpacity
                onPress={() =>
                  setDatapassword({ ...state, secureEntry: !state.secureEntry })
                }
                style={[{ marginRight: wp('3%'), padding: 3 }]}>
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
        {/* <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPasswordScreen')}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity> */}
        <OtrixDivider size={'md'} />

        <Button
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={GlobalStyles.button}
          onPress={() => login()}>
          <Text style={GlobalStyles.buttonText}>Login Now</Text>
        </Button>

        <OtrixDivider size={'md'} />
        {loading && <OtrixLoader />}
        {loading && <OtrixDivider size={'md'} />}
        <View style={styles.registerView}>
          <Text style={styles.registerTxt}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('RegisterScreen')}>
            <Text style={styles.signupTxt}> Sign Up </Text>
          </TouchableOpacity>
        </View>
        <OtrixDivider size={'md'} />

        {/* Social Container Component
        <OtrixSocialContainer
          facebookLogin={_fbAuth}
          googleLogin={_googleAuth}
        />*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  forgotPassword: {
    fontSize: wp('3%'),
    textAlign: 'right',
    fontFamily: Fonts.Font_Reguler,
    color: Colors.link_color,
    padding: 5,
  },
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
