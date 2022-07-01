import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
  AddAdressComponent,
  EditAddressComponent,
  OtrixLoader,
  OtrixAlert,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { bindActionCreators } from 'redux';
import { proceedCheckout } from '@actions';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from '@helpers/Fonts';
import { Button } from 'native-base';
import getApi from '@apis/getApi';
import { logfunction } from '@helpers/FunctionHelper';
import AwesomeAlert from 'react-native-awesome-alerts';

function ManageAddressScreen(props) {
  const [state, setState] = React.useState({
    addresses: [],
    showAdd: false,
    message: null,
    type: null,
    countries: [],
    sumAmount: 0,
    selectedAddress: null,
    showEdit: false,
    editAddressData: [],
    step: 1,
    selectedPaymentMethod: 4,
    paymentSuccessModal: false,
    loading: true,
    showAlert: false,
  });
  const [showMessage, setShowLoading] = React.useState(false);
  const {
    showAdd,
    addresses,
    selectedAddress,
    showEdit,
    editAddressData,
    step,
    countries,
    loading,
    message,
    type,
    showAlert,
  } = state;

  const storeAddress = addressData => {
    setState({
      ...state,
      showAdd: false,
      loading: true,
    });
    try {
      getApi.postData('user/addAddress', addressData).then(response => {
        logfunction('RESPONSE ', response);
        if (response.status == 1) {
          fetchData();
          setState({
            ...state,
            addresses: response.addresses,
            selectedAddress:
              response.addresses.length > 0 ? response.addresses[0].id : 0,
            loading: false,
            showAdd: false,
            message: response.message,
            type: 'success',
          });
          setShowLoading(true);
          setTimeout(() => {
            setShowLoading(false);
          }, 3000);
        } else {
          setState({
            ...state,
            type: 'error',
            message: response.message,
            loading: false,
            showAdd: false,
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
        ...state,
        loading: false,
      });
    }
  };

  const updateAddress = addressData => {
    setState({
      ...state,
      showEdit: false,
      loading: true,
    });
    logfunction('addressData ', addressData);

    try {
      getApi
        .postData('user/editAddress/' + selectedAddress, addressData)
        .then(response => {
          logfunction('RESPONSE ', response);
          if (response.status == 1) {
            fetchData();
            setState({
              ...state,
              addresses: response.addresses,
              loading: false,
              showEdit: false,
              message: response.message,
              type: 'success',
            });
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
            }, 1500);
          } else {
            setState({
              ...state,
              showEdit: false,
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
        ...state,
        loading: false,
      });
    }
  };

  const editAddress = data => {
    setState({ ...state, editAddressData: data, selectedAddress: data.id });
  };

  const closeAddressModel = () => {
    setState({
      ...state,
      showAdd: false,
    });
  };

  const closeAddressEditModel = () => {
    setState({
      ...state,
      showEdit: false,
    });
  };

  const fetchData = () => {
    try {
      getApi.getData('user/getAdress', []).then(response => {
        logfunction('RESPONSE ', response);
        if (response.status == 1) {
          setState({
            ...state,
            addresses: response.data,
            selectedAddress: response.data.length > 0 ? response.data[0].id : 0,
            countries: response.countries,
            loading: false,
            showEdit: false,
            showAdd: false,
          });
        } else {
          setState({
            ...state,
            type: 'error',
            message: response.message,
            loading: false,
            showEdit: false,
            showAdd: false,
          });
          setShowLoading(true);
          setTimeout(() => {
            setShowLoading(false);
          }, 3000);
        }
      });
    } catch (error) {
      logfunction('erorr ', 'get error');
    }
  };

  const deleteAddressAlert = id => {
    setState({
      ...state,
      showAlert: true,
      selectedAddress: id,
      showEdit: false,
    });
  };

  const deleteAddress = () => {
    logfunction('URL ', 'user/deleteAddress/' + selectedAddress);
    getApi
      .postData('user/deleteAddress/' + selectedAddress, [])
      .then(response => {
        logfunction('Delete response', response);
        if (response.status == 1) {
          setState({
            ...state,
            addresses: response.addresses,
            loading: false,
            showEdit: false,
            showAlert: false,
            showAdd: false,
          });
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Manage Address</Text>
        </View>
      </OtrixHeader>

      {loading && <OtrixLoader />}

      {/* Address Content start from here */}
      {!loading && step == 1 && (
        <>
          <OtrixDivider size={'md'} />
          <Text style={styles.deliveryTitle}>Your Address</Text>
          <OtrixDivider size={'sm'} />
          <View style={styles.addressContent}>
            {/*horizontal address* */}
            <ScrollView
              style={styles.addressBox}
              showsHorizontalScrollIndicator={false}
              vertical={true}>
              {addresses.length > 0 &&
                addresses.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.deliveryBox,
                      {
                        borderWidth: 1,
                        borderColor: Colors.light_gray,
                      },
                    ]}
                    onPress={() =>
                      setState({ ...state, selectedAddress: item.id })
                    }>
                    <Text style={styles.addressTxt} numberOfLines={1}>
                      {item.name}{' '}
                    </Text>
                    <Text style={styles.addressTxt} numberOfLines={2}>
                      {item.address_1}{' '}
                    </Text>
                    <Text style={styles.addressTxt} numberOfLines={2}>
                      {item.address_2}, {item.city}
                    </Text>
                    <Text style={styles.addressTxt} numberOfLines={1}>
                      {item.postcode}, {item.country}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.editView,
                        {
                          bottom:
                            selectedAddress == item.id ? hp('10%') : hp('10%'),
                          marginVertical: hp('0.5%'),
                        },
                      ]}
                      onPress={() => deleteAddressAlert(item.id)}>
                      <Text style={styles.edit}>
                        {' '}
                        <MatIcon
                          name="delete"
                          color={Colors.red}
                          size={wp('5%')}
                        />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.editView,
                        {
                          bottom:
                            selectedAddress == item.id ? hp('10%') : hp('10%'),
                        },
                      ]}
                      onPress={() => editAddress(item)}>
                      <Text style={styles.edit}>
                        {' '}
                        <MatIcon
                          name="pencil"
                          color={Colors.text_color}
                          size={wp('5%')}
                        />
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
          <Button
            size="md"
            variant="solid"
            bg={Colors.themeColor}
            style={[
              GlobalStyles.button,
              { marginHorizontal: wp('5%'), marginBottom: hp('1%') },
            ]}
            onPress={() => setState({ ...state, showAdd: true })}>
            <Text style={GlobalStyles.buttonText}>
              {' '}
              <MatIcon name="plus" color={Colors.white} size={wp('4%')} /> Add
            </Text>
          </Button>
        </>
      )}

      {/* Add Address Screen */}
      <Modal visible={showAdd} transparent={true}>
        <AddAdressComponent
          closeAdd={closeAddressModel}
          addAdress={storeAddress}
          countries={countries}
        />
      </Modal>

      {/* Edit Address Screen */}
      <Modal visible={showEdit} transparent={true}>
        <EditAddressComponent
          closeEdit={closeAddressEditModel}
          editAddress={updateAddress}
          editData={editAddressData}
          countries={countries}
        />
      </Modal>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Confirm"
        message="Are you sure you want to delete?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setState({
            ...state,
            showAlert: false,
          });
        }}
        onConfirmPressed={() => {
          setState({
            ...state,
            showAlert: false,
          });
          deleteAddress();
        }}
      />

      {showMessage == true && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      proceedCheckout,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageAddressScreen);

const styles = StyleSheet.create({
  deliveryTitle: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.8%'),
    color: Colors.text_color,
    marginLeft: wp('5%'),
  },
  addressBox: {
    marginLeft: wp('5%'),
    marginRight: wp('2.5%'),
    flex: 1,
    height: 'auto',
    borderRadius: wp('2%'),
  },
  deliveryBox: {
    marginHorizontal: wp('1.5%'),
    width: wp('88%'),
    marginVertical: hp('0.5%'),
    height: hp('13.5%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    padding: wp('2.5%'),
  },
  addressTxt: {
    fontSize: wp('3.6%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.text_color,
    textAlign: 'left',
  },
  deliveryAddressTxt: {
    textAlign: 'right',
    fontSize: wp('3.4%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.link_color,
  },
  edit: {
    textAlign: 'right',
  },
  editView: { justifyContent: 'flex-start' },
  addressContent: {
    flexDirection: 'row',
    height: hp('70%'),
  },
});
