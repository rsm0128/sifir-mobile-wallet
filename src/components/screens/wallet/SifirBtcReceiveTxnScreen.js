import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import Overlay from 'react-native-modal-overlay';
import SifirQRCode from '@elements/SifirQRCode';
import Share from 'react-native-share';

import {getWalletAddress} from '@actions/btcwallet';
import {getNewAddress as getNewLnAddress} from '@actions/lnWallet';
import {getNewAddress as getNewWasabiAddress} from '@actions/wasabiWallet';
import {Images, AppStyle, C} from '@common/index';
import {log} from '@io/events/';
import {ErrorScreen} from '@screens/error';
const SifirBtcReceiveTxnScreen = props => {
  const {label, type, meta: cfg} = props.route.params.walletInfo;
  const spendingAddressTypes = [
    {title: C.STR_LEGACY, value: 'legacy'},
    {title: C.STR_Segwit_Compatible, value: 'p2sh-segwit'},
    {title: C.STR_Bech32, value: 'bech32'},
  ];
  // const [getBtnStatus, setBtnStatus] = useState(0);
  const [enableLabelInput, setEnableLabelInput] = useState(
    cfg?.enableAddressLabelInput || false,
  );
  const [enableAddressTypeSelection, setEnableAddressTypeSelection] = useState(
    cfg?.enableAddressTypeSelection || false,
  );
  const [enableAddressWatchSelection, setAddressWatchSelection] = useState(
    false,
  );
  const [showAddressTypeSelector, setShowAddressTypeSelector] = useState(
    cfg?.showAddressTypeSelector || false,
  );
  const [showQRCode, setShowQRCode] = useState(true);
  const [addAddressToWatch, setAddAddressToWatch] = useState(false);
  const [showShareSelector, setShowShareSelector] = useState(false);
  const [addrType, setAddrType] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [labelInputDone, setLabelInputDone] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [qrCodeURI, setQrCodeURI] = useState(null);
  useEffect(() => {
    loadWalletAddress();
  }, [labelInputDone, addrType]);

  const onClose = () => {
    setShowAddressTypeSelector(false);
    setShowShareSelector(false);
  };

  const onShare = (sharedAddress, isQRCode) => {
    setShowShareSelector(false);
    if (qrCodeURI) {
      let shareOptions;
      if (isQRCode) {
        shareOptions = {
          type: 'image/png',
          title: C.STR_ADDR_QR_SHARE,
          url: qrCodeURI,
        };
      } else {
        shareOptions = {
          title: C.STR_ADDR_SHARE,
          message: sharedAddress,
        };
      }
      Share.open(shareOptions).catch(err => log(err));
    }
  };

  const handleBackBtn = () => {
    props.navigation.goBack();
  };
  const inputLabel = input => {
    setLabelInput(input);
    setLabelInputDone(false);
  };
  const loadWalletAddress = async ({loadNew = false} = {}) => {
    let hasAllReqs = true;
    // Check if we're ready based on reqs
    if (enableAddressTypeSelection) {
      hasAllReqs =
        hasAllReqs &&
        addrType &&
        addrType?.value?.length &&
        addrType.value !== C.STR_SELECT_ADDRTYPE;
    }
    if (enableLabelInput) {
      hasAllReqs = hasAllReqs && labelInput?.length && labelInputDone;
    }
    if (hasAllReqs !== true) {
      return;
    }
    // FIXME add gesture to swipe left to load new
    if (!!address?.length && !loadNew) {
      console.log('already have one', address, typeof address);
      return;
    }
    let walletAddress;
    setLoading(true);
    console.log('----------', addrType, label, type, hasAllReqs);
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        walletAddress = await props.getNewLnAddress();
        break;
      case C.STR_WASABI_WALLET_TYPE:
        ({address: walletAddress} = await props.getNewWasabiAddress({
          label: labelInput,
        }));
        break;
      default:
        walletAddress = await props.getWalletAddress({
          label,
          type,
          addrType: addrType.value,
        });
        break;
    }
    console.log('----------', walletAddress, addrType, label, type);
    if (walletAddress?.length) {
      setAddress(walletAddress);
      setLoaded(true);
    }
    setLoading(false);
  };
  if (error) {
    return (
      <ErrorScreen
        title={C.STR_ERROR_btc_action}
        desc={C.STR_ERROR_generating_address}
        actions={[
          {
            text: C.STR_TRY_AGAIN,
            onPress: () => _bootStrap(),
          },
          {
            text: C.GO_BACK,
            onPress: () => props.navigation.navigate('Account', {label, type}),
          },
        ]}
      />
    );
  }
  return (
    <View style={styles.mainView}>
      <View style={styles.settingView}>
        <TouchableOpacity onPress={() => handleBackBtn()}>
          <View style={styles.backNavStyle}>
            <Image source={Images.icon_back} style={styles.backImg} />
            <Image source={Images.icon_btc_cir} style={styles.btcImg} />
            <Text style={styles.backTxt}>{label} Wallet</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={Images.icon_setting}
            style={{width: 30, height: 30, marginRight: 20}}
          />
        </TouchableOpacity>
      </View>
      {enableLabelInput === true && (
        <>
          <View style={styles.inputView}>
            <TextInput
              placeholder="Enter a label"
              placeholderTextColor="white"
              style={styles.inputTxtStyle}
              value={labelInput}
              onChangeText={input => inputLabel(input)}
            />
          </View>
          <TouchableOpacity
            onPressOut={() => {
              setLabelInputDone(true);
            }}
            style={styles.shareBtnOpa}>
            <View
              shadowColor="black"
              shadowOffset="30"
              style={styles.shareBtnView}>
              <Text style={styles.shareBtnTxt}>{'Save'}</Text>
              <Image
                source={Images.icon_network}
                style={{width: 28, height: 30}}
              />
            </View>
          </TouchableOpacity>
        </>
      )}
      {enableAddressTypeSelection === true && (
        <View
          style={[
            styles.selectAddrView,
            showQRCode === false || !address ? {marginBottom: 50 * C.vh} : {},
          ]}>
          <TouchableOpacity onPressOut={() => setShowAddressTypeSelector(true)}>
            <Text placeholderTextColor="white" style={styles.selectAddrTxt}>
              {addrType?.title || C.STR_SELECT_ADDRTYPE}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPressOut={() => {
              setShowAddressTypeSelector(!showAddressTypeSelector);
            }}>
            <View style={styles.selectBtnView}>
              <Image
                source={Images.icon_vertical_line}
                style={styles.selectLineImg}
              />
              <Image
                source={Images.icon_check_blue}
                style={{height: 20, width: 20}}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
      {loading === true && (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={AppStyle.mainColor} />
        </View>
      )}

      {!!address && showQRCode && (
        <>
          <View style={styles.qrCodeView}>
            <SifirQRCode
              setQrCodeURI={setQrCodeURI}
              value={address}
              size={C.SCREEN_HEIGHT * 0.25}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </View>
          <Text style={styles.addrTxt}>{address}</Text>
        </>
      )}
      {!!address && (
        <>
          {enableAddressWatchSelection === true && (
            <View style={styles.watchAddrView}>
              <Text style={styles.watchTxt}>{C.STR_WATCH_ADDR}</Text>
              <TouchableOpacity
                onPressOut={() => setAddAddressToWatch(!addAddressToWatch)}>
                <View style={{position: 'relative'}}>
                  <Image
                    source={Images.icon_rectangle}
                    style={styles.watchRectImg}
                  />
                  {addAddressToWatch === true && (
                    <Image
                      source={Images.icon_check_white}
                      style={styles.chkIconImg}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPressOut={() => {
              setShowShareSelector(true);
            }}
            style={styles.shareBtnOpa}>
            <View
              shadowColor="black"
              shadowOffset="30"
              style={styles.shareBtnView}>
              <Text style={styles.shareBtnTxt}>{C.STR_SHARE}</Text>
              <Image
                source={Images.icon_network}
                style={{width: 28, height: 30}}
              />
            </View>
          </TouchableOpacity>
        </>
      )}
      {/* Select share type */}
      <Overlay
        visible={showShareSelector}
        onClose={onClose}
        closeOnTouchOutside
        animationType="zoomIn"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 15,
        }}
        childrenWrapperStyle={styles.dlgChild}
        animationDuration={300}>
        {() => (
          <View>
            <View style={styles.shareModal}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPressOut={() => {
                    onShare(address, true);
                  }}>
                  <View style={styles.shareRow}>
                    <Text style={styles.shareTxt}>{C.STR_ADDR_QR_SHARE}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPressOut={() => {
                    onShare(address, false);
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.shareTxt}>{C.STR_ADDR_SHARE}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.shareModalBottom}>
              <TouchableOpacity>
                <Image
                  source={Images.icon_dialog_arrow}
                  style={{height: 40, width: 40, marginRight: 10}}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Overlay>

      {/* Select the Address type in the Spending Wallet */}
      <Overlay
        visible={showAddressTypeSelector}
        onClose={onClose}
        closeOnTouchOutside
        animationType="zoomIn"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        childrenWrapperStyle={{
          marginTop: 110,
          backgroundColor: 'transparent',
        }}
        animationDuration={500}>
        {hideModal => (
          <FlatList
            style={styles.addList}
            data={spendingAddressTypes}
            keyExtractor={item => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  width: C.SCREEN_WIDTH,
                  marginLeft: 15,
                }}
                onPressOut={() => {
                  setAddrType(item);
                  hideModal();
                }}>
                <Text style={styles.item}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </Overlay>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
    lnWallet: state.lnWallet,
    wasabiWallet: state.wasabiWallet,
  };
};

const mapDispatchToProps = {
  getWalletAddress,
  getNewLnAddress,
  getNewWasabiAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirBtcReceiveTxnScreen);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  loadingView: {justifyContent: 'center', position: 'absolute', top: 40 * C.vh},
  settingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: C.SCREEN_WIDTH,
  },
  backNavStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginLeft: 13,
  },
  backTxt: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  backImg: {
    width: 15,
    height: 15,
    marginLeft: 10,
    marginTop: 2,
  },
  btcImg: {
    width: 23,
    height: 23,
    marginLeft: 5,
  },
  selectAddrView: {
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: AppStyle.mainColor,
    borderWidth: 1,
    width: C.SCREEN_WIDTH - 50,
    height: 10 * C.vh,
    alignItems: 'center',
    marginTop: 4 * C.vh,
    justifyContent: 'space-between',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    width: C.SCREEN_WIDTH * 0.8,
    height: 70,
    borderRadius: 10,
    borderColor: AppStyle.mainColor,
    borderWidth: 2,
  },
  inputTxtStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  selectBtnView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  shareBtnView: {
    width: C.SCREEN_WIDTH * 0.7,
    flexDirection: 'row',
    height: 10.5 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  shareBtnTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  shareTxt: {
    fontFamily: AppStyle.mainFont,
    fontSize: 17,
    marginLeft: 10,
  },
  shareModal: {
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    height: 120,
    width: C.SCREEN_WIDTH * 0.6,
  },
  shareRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  shareModalBottom: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
    marginTop: -21,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    flex: 1,
  },
  watchAddrView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: C.SCREEN_WIDTH,
    marginTop: 20,
  },
  addList: {
    color: 'white',
    height: 140,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  qrCodeView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5 * C.vh,
    height: 27 * C.vh,
    width: 27 * C.vh,
    backgroundColor: 'white',
  },
  shareBtnOpa: {
    marginTop: 2 * C.vh,
    alignItems: 'center',
    marginBottom: 3 * C.vh,
  },
  watchTxt: {fontSize: 3.4 * C.vh, color: AppStyle.mainColor, marginLeft: 30},
  selectAddrTxt: {fontSize: 3.3 * C.vh, marginLeft: 10, color: 'white'},
  selectLineImg: {height: 5.2 * C.vh, width: 2, marginRight: 20},
  watchRectImg: {width: 5.5 * C.vh, height: 5.5 * C.vh, marginRight: 30},
  chkIconImg: {
    width: 5.5 * C.vh,
    height: 5.5 * C.vh,
    marginRight: 30,
    position: 'absolute',
    zIndex: 100,
    top: -2 * C.vh,
    left: 8,
  },
  dlgChild: {
    marginTop: 40 * C.vh,
    backgroundColor: 'transparent',
  },
  addrTxt: {
    fontSize: 16,
    color: 'white',
  },
});
