import React from 'react';
import { Platform, StyleSheet, Image, Text, View } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { connect } from 'react-redux';
import {
  SplashScreen,
  HomeScreen,
  SupplierPage,
  Inventory,
  SellerStore,
  SettingScreen,
  LoginScreen,
  RegisterScreen,
  RegisterSuccessScreen,
  ForgotPasswordScreen,
  CategoryScreen,
  SellerCartScreen,
  CustomerCartScreen,
  ProfileScreen,
  ProductListScreen,
  ProductDetailScreen,
  InventoryProductDetailScreen,
  CheckoutScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  ManageAddressScreen,
  WishlistScreen,
  OrderScreen,
  History,
  OrderDetailScreen,
  LanguageScreen,
  TermsandconditionScreen,
  PrivacyPolicyScreen,
  NotificationScreen,
  SearchScreen,
  UnauthorizeScreen,
  MenufecturerScreen,
  SocialRegisterScreen,
  RefundScreen,
  ShippingDeliveryScreen,
} from './screens/index';
import {
  bottomHome,
  bottomHomeFill,
  bottomCategory,
  bottomCategoryFill,
  bottomCart,
  bottomProfile,
  bottomProfileFill,
  bottomSetting,
  bottomSettingFill,
} from '@common';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors, GlobalStyles } from '@helpers';
import { Badge } from 'native-base';
import Fonts from './helpers/Fonts';
import { _roundDimensions } from './helpers/util';
const SettingStack = createStackNavigator();
export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

function SettingStackNavigation() {
  return (
    <SettingStack.Navigator initialRouteName="SettingScreen">
      <SettingStack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
    </SettingStack.Navigator>
  );
}

//Auth Stack
const AuthStack = createStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="LoginScreen">
      <AuthStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <AuthStack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <AuthStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </AuthStack.Navigator>
  );
}

const BottomTab = createMaterialBottomTabNavigator();
function MyTabs(props) {
  let { cartCount, authStatus, userData = {} } = props;
  const mode = userData?.mode;
  console.log(userData, '----');
  return (
    <BottomTab.Navigator
      initialRouteName="HomeScreen"
      backBehavior={'order'}
      //labeled={false}
      barStyle={styles.tabbarStyle}
      screenOptions={{
        // tabBarStyle: { position: 'absolute' },
        unmountOnBlur: true,
        tabBarShowLabel: false,
        lazy: false,
        // tabBarStyle: styles.tabbarStyle,
      }}>
      {mode !== 'customer' && (
        <BottomTab.Screen
          name="HomeScreen"
          component={SupplierPage}
          options={{
            headerShown: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,
            tabBarIcon: ({ focused, tintColor }) => (
              <Image
                square
                source={focused ? bottomHomeFill : bottomHome}
                style={[styles.bottomTabIcon]}
              />
            ),
            tabBarLabel: 'Home',
          }}
        />
      )}
      <BottomTab.Screen
        name="SellerStore"
        component={SellerStore}
        options={{
          headerShown: false,
          cardStyleInterpolator:
            CardStyleInterpolators.forScaleFromCenterAndroid,
          tabBarIcon: ({ focused, tintColor }) => (
            <Fontisto
              name="shopping-bag"
              style={[styles.icon, { fontSize: wp('5.4%') }]}
            />
          ),
          tabBarLabel: 'Sellers Store',
        }}
      />
      {authStatus && (
        <BottomTab.Screen
          name="Store"
          component={Inventory}
          options={{
            headerShown: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,
            tabBarIcon: ({ focused, tintColor }) => (
              <Image
                square
                source={focused ? bottomCategoryFill : bottomCategory}
                style={[styles.bottomTabIcon]}
              />
            ),
            tabBarLabel: 'My Store',
          }}
        />
      )}
      {/*<BottomTab.Screen*/}
      {/*  name="Categories"*/}
      {/*  component={CategoryScreen}*/}
      {/*  options={{*/}
      {/*    headerShown: false,*/}
      {/*    tabBarIcon: ({ focused, tintColor }) => (*/}
      {/*      <Image*/}
      {/*        square*/}
      {/*        source={focused ? bottomCategoryFill : bottomCategory}*/}
      {/*        style={[styles.bottomTabIcon]}*/}
      {/*      />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*
      <BottomTab.Screen
        name="CartScreen"
        component={authStatus ? SellerCartScreen : AuthNavigator}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          tabBarIcon: ({ focused, tintColor }) => (
            <View style={styles.cartIconView}>
              <Image
                square
                source={focused ? bottomCart : bottomCart}
                style={[
                  styles.bottomTabIcon,
                  {
                    top: cartCount > 9 ? hp('0.8%') : hp('0.2%'),
                    right: wp('1%'),
                    height: wp('7%'),
                    width: wp('7%'),
                  },
                ]}
              />
              {cartCount > 0 && (
                <Badge
                  style={[
                    GlobalStyles.badge,
                    styles.count,
                    {
                      height:
                        cartCount > 9
                          ? _roundDimensions()._height * 0.039
                          : _roundDimensions()._height * 0.032,
                      width:
                        cartCount > 9
                          ? _roundDimensions()._height * 0.039
                          : _roundDimensions()._height * 0.032,
                      borderRadius: _roundDimensions()._borderRadius,
                      right: cartCount > 9 ? wp('0.3') : wp('1.2%'),
                      top: cartCount > 9 ? hp('0.1%') : hp('0.6%'),
                    },
                  ]}>
                  <Text
                    style={[
                      GlobalStyles.badgeText,
                      styles.countText,
                      { fontSize: cartCount > 9 ? wp('2.4%') : wp('3%') },
                    ]}>
                    {cartCount}
                  </Text>
                </Badge>
              )}
            </View>
          ),
          tabBarLabel: 'Cart',
        }}
      />
*/}

      <BottomTab.Screen
        name="History"
        component={authStatus == true ? History : AuthNavigator}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          tabBarLabel: 'History',
          tabBarIcon: ({ focused, tintColor }) => (
            <Fontisto
              name="shopping-bag-1"
              style={[styles.icon, { fontSize: wp('5.4%') }]}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="ProfileScreen"
        component={authStatus == true ? ProfileScreen : AuthNavigator}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          tabBarLabel: 'History',
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              square
              source={focused ? bottomProfileFill : bottomProfile}
              style={[styles.bottomTabIcon]}
            />
          ),
        }}
      />
      {/*<BottomTab.Screen
        name="SettingScreen"
        component={SettingStackNavigation}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              square
              source={focused ? bottomSettingFill : bottomSetting}
              style={[styles.bottomTabIcon]}
            />
          ),
        }}
      />*/}
    </BottomTab.Navigator>
  );
}

const Stack = createStackNavigator();
function AppNavigator(props) {
  const { cartCount, authStatus, userData } = props;
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        {/*<Stack.Screen*/}
        {/*  {...props}*/}
        {/*  name="MainScreen"*/}
        {/*  component={() => (*/}
        {/*    <MyTabs cartCounts={cartCount} auth={authStatus}></MyTabs>*/}
        {/*  )}*/}
        {/*  options={{*/}
        {/*    headerShown: false,*/}
        {/*    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,*/}
        {/*  }}*/}
        {/*  countProp={cartCount}*/}
        {/*  initialParams={{ count: cartCount }}*/}
        {/*/>*/}

        <Stack.Screen
          {...props}
          name="MainScreen"
          options={{ headerShown: false }}>
          {props => (
            <MyTabs
              cartCounts={cartCount}
              authStatus={authStatus}
              userData={userData}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="LoginScreen"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductListScreen"
          component={ProductListScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="Categories"
          component={CategoryScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="InventoryProductDetailScreen"
          component={InventoryProductDetailScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="CheckoutScreen"
          component={CheckoutScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="RegisterSuccessScreen"
          component={RegisterSuccessScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="SocialRegisterScreen"
          component={SocialRegisterScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="ManageAddressScreen"
          component={ManageAddressScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="WishlistScreen"
          component={WishlistScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

        <Stack.Screen
          name="History"
          component={History}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

        <Stack.Screen
          name="OrderDetailScreen"
          component={OrderDetailScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="LanguageScreen"
          component={LanguageScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="TermsandconditionScreen"
          component={TermsandconditionScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
          }}
        />
        <Stack.Screen
          name="UnauthorizeScreen"
          component={UnauthorizeScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
          }}
        />
        <Stack.Screen
          name="MenufecturerScreen"
          component={MenufecturerScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="RefundScreen"
          component={RefundScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="ShippingDeliveryScreen"
          component={ShippingDeliveryScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartCount: state.cart.cartCount ? state.cart.cartCount : null,
    authStatus: state.auth.USER_AUTH,
    userData: state.auth.USER_DATA,
  };
}

export default connect(mapStateToProps, {})(AppNavigator);

const styles = StyleSheet.create({
  bottomTabIcon: {
    height: wp('6%'),
    width: wp('6%'),
  },
  tabbarStyle: {
    backgroundColor: Colors.white,
  },
  cartIconView: {
    backgroundColor: Colors.light_white,
    height: _roundDimensions()._height * 0.068,
    width: _roundDimensions()._height * 0.068,
    borderRadius: _roundDimensions()._borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp('2%'),
    position: 'relative',
    zIndex: 9999999999,
  },
  count: {
    backgroundColor: Colors.white,
  },
  countText: {
    color: Colors.link_color,
    fontFamily: Fonts.Font_Bold,
  },
});
