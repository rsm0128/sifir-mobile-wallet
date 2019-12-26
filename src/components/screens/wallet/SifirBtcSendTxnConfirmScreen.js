import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Images, AppStyle, C} from '@common/index';

import Overlay from 'react-native-modal-overlay';
import SifirSettingModal from '@elements/SifirSettingModal';

export default class SifirBtcSendTxnConfirmScreen extends Component {
  onClose = () => this.setState({modalVisible: false});

  state = {
    btnStatus: 0,
    modalVisible: false,
    txnInfo: this.props.navigation.getParam('txnInfo'),
  };

  render() {
    const {address, amount, feeSettingEnabled} = this.state.txnInfo;
    const amountFontSize = (C.vw * 100) / amount.length;
    const btcUnitFontSize = amountFontSize * 0.6;
    const recTxtFontSize = (C.vw * 250) / address.length;

    return (
      <View style={styles.mainView}>
        <View
          style={styles.setting}
          onTouchEnd={() => this.setState({modalVisible: true})}>
          <TouchableOpacity>
            <Image source={Images.icon_setting} style={styles.settingImg} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Text style={styles.recTxt}>{C.STR_PAYMENT_RECEIPIENT}</Text>
          <Text style={[styles.addrTxt, {fontSize: recTxtFontSize}]}>
            {address}
          </Text>
          <Text style={styles.amountLblTxt}>{C.STR_PAYMENT_AMOUNT}</Text>
        </View>
        <View style={styles.valueTxt}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text style={[styles.bigTxt, {fontSize: amountFontSize}]}>
              {amount}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: btcUnitFontSize,
                marginBottom: 5,
              }}>
              {C.STR_BTC}
            </Text>
          </View>
          <View style={styles.lineView} />
        </View>
        {feeSettingEnabled && (
          <View style={styles.setArea}>
            <Text style={styles.setTxt}>{C.STR_FEES}</Text>
            <Text
              style={{
                fontSize: 23,
                color: 'white',
                marginLeft: 10,
                marginRight: 10,
              }}>
              {amount} BTC
            </Text>
            <Text style={styles.waitTxt}>[4 Hour Wait]</Text>
          </View>
        )}
        <TouchableOpacity
          onLongPress={() =>
            this.props.navigation.navigate('BtcTxnConfirmed', {
              txnInfo: this.state.txnInfo,
              isSendTxn: true,
            })
          }
          style={{
            marginTop: 50,
            alignItems: 'center',
          }}>
          <View shadowColor="black" shadowOffset="30" style={styles.sendBtn}>
            <Text style={styles.sendBtnTxt}>{C.STR_SEND}</Text>
            <Image
              source={Images.icon_up_dark}
              style={{width: 20, height: 20}}
            />
          </View>
        </TouchableOpacity>
        <Overlay
          visible={this.state.modalVisible}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType="zoomIn"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 15,
          }}
          childrenWrapperStyle={styles.dlgChild}
          animationDuration={500}>
          {hideModal => (
            <SifirSettingModal
              hideModal={hideModal}
              feeEnabled={feeSettingEnabled}
            />
          )}
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
    display: 'flex',
  },
  setting: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15,
    marginTop: 15,
  },
  settingImg: {
    width: 35,
    height: 30,
  },
  sendBtn: {
    width: C.SCREEN_WIDTH * 0.7,
    flexDirection: 'row',
    height: 12 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 5 * C.vh,
  },
  sendBtnTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  valueTxt: {
    marginTop: 10,
    marginBottom: 20,
    marginRight: 40,
    marginLeft: 40,
  },
  lineView: {
    marginTop: -5,
    borderTopColor: AppStyle.mainColor,
    borderTopWidth: 2,
    marginHorizontal: 20,
  },
  bigTxt: {
    color: 'white',
    width: C.SCREEN_WIDTH * 0.55,
    textAlign: 'center',
  },
  recTxt: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontBold,
    fontSize: 16,
  },
  addrTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    marginTop: 10,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  waitTxt: {
    fontSize: 3 * C.vh,
    color: AppStyle.mainColor,
    marginLeft: 10,
  },
  setTxt: {
    fontSize: 23,
    color: AppStyle.mainColor,
    marginRight: 10,
  },
  setArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountLblTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 3 * C.vh,
    fontFamily: AppStyle.mainFontBold,
  },
  dlgChild: {
    marginTop: 12 * C.vh,
    backgroundColor: 'transparent',
  },
});