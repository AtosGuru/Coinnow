import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixContent,
  OtrixDivider,
  OtrixAlert,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { doLogout, authData } from '@actions';
import { avatarImg } from '@common';
import Fonts from '@helpers/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { bindActionCreators } from 'redux';
import Toast from 'react-native-root-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import getApi from '@apis/getApi';
import { ASSETS_DIR } from '@env';
import { logfunction } from '@helpers/FunctionHelper';
import AsyncStorage from '@react-native-community/async-storage';

function ProfileScreen(props) {
  const [state, setState] = React.useState({
    profileImage: null,
    profileImageURL: null,
    type: 'error',
    message: null,
  });
  const [specialItems, setSpecialItems] = useState([]);
  const [showMessage, setShowLoading] = React.useState(false);

  const mode = props.customerData?.mode;
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getProfile();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let image = null;
    if (props.customerData && props.customerData.image != null) {
      if (
        props.customerData.creation == null ||
        props.customerData.creation == 'D'
      ) {
        image = ASSETS_DIR + 'user/' + props.customerData.image;
      } else {
        image = props.customerData.image;
      }
    }
    setState({
      ...state,
      profileImageURL: image,
    });
  }, [profileImage]);

  const getProfile = () => {
    getApi.getData('seller/getSeller', []).then(response => {
      if (response.status === 1) {
        props.authData(response.data);
        console.log(response.specials);
        setSpecialItems(response.specials || []);
      }
    });
  };
  const openImagePicker = async res => {
    let mainImage = {
      uri: res.assets[0].uri,
      type: res.assets[0].type,
      name: res.assets[0].fileName,
    };

    let sendData = new FormData();

    sendData.append('image', mainImage);
    getApi
      .postData('seller/changeProfilePicture', sendData)
      .then(async response => {
        logfunction('RESPONSE ', response);
        if (response.status == 1) {
          setState({
            ...state,
            type: 'success',
            profileImage: res.assets[0].uri,
            profileImageURL: null,
            message: response.message,
          });
          setShowLoading(true);
          setTimeout(async () => {
            setShowLoading(false);
            props.authData(response.data);
            await AsyncStorage.setItem(
              'CUSTOMER_DATA',
              JSON.stringify(response.data),
            );
          }, 3000);
        } else {
          setState({
            ...state,
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
  };

  const onLogout = () => {
    props.doLogout();
    getApi.getData('seller/logout', []).then(response => {
      console.log('LOGOUT RRES ', response);
    });
    Toast.show('Successfully Logout', {
      duration: 2000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  const { profileImage, profileImageURL, type, message } = state;

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      <OtrixContent>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.imageView}
            /*onPress={() =>
            launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 400,
                maxWidth: 400,
              },
              response => {
                openImagePicker(response);
              },
            )
          }*/
          >
            {profileImage == null && profileImageURL != null && (
              <Image source={{ uri: profileImageURL }} style={styles.image} />
            )}

            {profileImage != null && profileImageURL == null && (
              <Image source={{ uri: profileImage }} style={styles.image} />
            )}

            {profileImage == null && profileImageURL == null && (
              <Image source={avatarImg} style={styles.image} />
            )}
          </TouchableOpacity>
          <OtrixDivider size={'sm'} />
          <Text style={styles.username}>
            {props.customerData && props.customerData.firstname}
          </Text>
          <Text style={styles.email}>
            {props.customerData && props.customerData.email}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Text style={styles.email}>
              Balance ${props.customerData?.balance || 0}
            </Text>
            <Text style={styles.email}>
              Power {props.customerData?.power || 0}
            </Text>
            <Text style={styles.email}>
              Profit ${props.customerData?.profit || 0}
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {specialItems.map(item => {
              const image = item.product?.image;
              return (
                <View style={styles.specialItem} key={item.product_id}>
                  <Image
                    source={{
                      uri: image
                        ? ASSETS_DIR + 'product/' + image
                        : ASSETS_DIR + '/assets/img/default.png',
                    }}
                    style={styles.specialImage}
                  />
                  <Text
                    style={{
                      position: 'absolute',
                      left: 4,
                      bottom: 4,
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}>
                    X {item.quantity}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Header */}

        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            marginTop: hp('2%'),
          }}>
          <TouchableOpacity
            style={[
              GlobalStyles.headerLeft,
              { zIndex: 999999999, flex: 0.9, alignItems: 'flex-start' },
            ]}
            onPress={() => props.navigation.goBack()}>
            <Text style={GlobalStyles.headingTxt}> My Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentView}>
          {/* Content Start from here */}
          <OtrixDivider size={'lg'} />

          <TouchableOpacity
            style={styles.listView}
            onPress={() => props.navigation.navigate('EditProfileScreen')}>
            <View style={[styles.leftSide, { left: wp('1%') }]}>
              <Icon name="user-edit" style={styles.icon} />
            </View>
            <View style={styles.center}>
              <Text style={styles.listTitle}>Edit Profile</Text>
            </View>
            <View style={styles.rightSide}>
              <MatIcon name="arrow-forward-ios" style={styles.rightIcon} />
            </View>
          </TouchableOpacity>
          {/*<TouchableOpacity
          style={styles.listView}
          onPress={() => props.navigation.navigate('WishlistScreen')}>
          <View style={styles.leftSide}>
            <Fontisto name="heart" style={styles.icon} />
          </View>
          <View style={styles.center}>
            <Text style={styles.listTitle}>Wishlist</Text>
          </View>
          <View style={styles.rightSide}>
            <MatIcon name="arrow-forward-ios" style={styles.rightIcon} />
          </View>
        </TouchableOpacity>*/}
          {/*<TouchableOpacity
          style={styles.listView}
          onPress={() => props.navigation.navigate('ManageAddressScreen')}>
          <View style={styles.leftSide}>
            <Icon
              name="address-book"
              style={[styles.icon, { fontSize: wp('5.4%') }]}
            />
          </View>
          <View style={styles.center}>
            <Text style={styles.listTitle}>Manage Address</Text>
          </View>
          <View style={styles.rightSide}>
            <MatIcon name="arrow-forward-ios" style={styles.rightIcon} />
          </View>
        </TouchableOpacity>*/}
          {mode === 'customer' && (
            <TouchableOpacity
              style={styles.listView}
              onPress={() => props.navigation.navigate('OrderScreen')}>
              <View style={styles.leftSide}>
                <Fontisto
                  name="shopping-bag-1"
                  style={[styles.icon, { fontSize: wp('5.4%') }]}
                />
              </View>
              <View style={styles.center}>
                <Text style={styles.listTitle}>My Orders</Text>
              </View>
              <View style={styles.rightSide}>
                <MatIcon name="arrow-forward-ios" style={styles.rightIcon} />
              </View>
            </TouchableOpacity>
          )}
          {/*<TouchableOpacity
            style={styles.listView}
            onPress={() => props.navigation.navigate('History')}>
            <View style={styles.leftSide}>
              <Fontisto
                name="shopping-bag-1"
                style={[styles.icon, { fontSize: wp('5.4%') }]}
              />
            </View>
            <View style={styles.center}>
              <Text style={styles.listTitle}>History</Text>
            </View>
            <View style={styles.rightSide}>
              <MatIcon name="arrow-forward-ios" style={styles.rightIcon} />
            </View>
          </TouchableOpacity>*/}

          <TouchableOpacity
            style={styles.listView}
            onPress={() => props.navigation.navigate('ChangePasswordScreen')}>
            <View style={styles.leftSide}>
              <Fontisto name="locked" style={styles.icon} />
            </View>
            <View style={styles.center}>
              <Text style={styles.listTitle}>Change Password</Text>
            </View>
            <View style={styles.rightSide}>
              <MatIcon name="arrow-forward-ios" style={styles.rightIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listView} onPress={onLogout}>
            <View style={styles.leftSide}>
              <AntDesign name="logout" style={styles.icon} />
            </View>
            <View style={styles.center}>
              <Text style={styles.listTitle}>Logout</Text>
            </View>
            <View style={styles.rightSide}>
              <MatIcon name="arrow-forward-ios" style={styles.rightIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </OtrixContent>
      {showMessage == true && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      doLogout,
      authData,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    //height: hp('25%'),
    backgroundColor: Colors.light_white,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  imageView: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: wp('0.8%'),
    elevation: 2,
    height: hp('11%'),
    width: wp('23%'),
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
    width: wp('20%'),
    alignSelf: 'center',
  },
  specialImage: {
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
    width: 48,
  },
  specialItem: {
    backgroundColor: '#bbb',
    marginHorizontal: 4,
    marginBottom: 4,
  },
  username: {
    color: Colors.text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4%'),
  },
  email: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Regular,
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
  contentView: {
    flex: 1,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: Colors.white,
    marginHorizontal: 0,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  listView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  leftSide: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
    flex: 0.1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 0.8,
    padding: 10,
    marginHorizontal: wp('3%'),
  },
  rightSide: {
    flex: 0.1,
  },
  listTitle: {
    color: Colors.text_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.8%'),
  },
  icon: {
    fontSize: wp('5.5%'),
    color: Colors.secondry_text_color,
  },
  rightIcon: {
    fontSize: wp('3.5%'),
    color: Colors.secondry_text_color,
  },
});
