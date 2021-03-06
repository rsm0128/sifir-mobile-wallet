import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';

const SifirAccountActions = ({
  type,
  sendActionButtonLabel,
  handleReceiveButton,
  handleSendBtn,
  isDisabled = false,
}) => {
  const [btnStatus, setButtonStatus] = useState(0);
  return (
    <View style={styles.btnAreaView}>
      {!!handleSendBtn && (
        <TouchableWithoutFeedback
          disabled={isDisabled}
          style={{flex: 1}}
          onPressIn={() => setButtonStatus(1)}
          onPressOut={() => {
            setButtonStatus(0);
            handleSendBtn();
          }}>
          <View
            style={[
              styles.txnBtnView,
              btnStatus === 1 || isDisabled
                ? {backgroundColor: 'black', opacity: 0.7}
                : {},
            ]}>
            <Text style={{color: 'white', fontSize: 15}}>
              {sendActionButtonLabel}
            </Text>
            <Image
              source={Images.icon_up_arrow}
              style={{width: 11, height: 11, marginLeft: 10}}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      {!!handleReceiveButton && (
        <TouchableWithoutFeedback
          disabled={isDisabled}
          style={{flex: 1}}
          onPressIn={() => setButtonStatus(2)}
          onPressOut={() => {
            setButtonStatus(0);
            handleReceiveButton();
          }}>
          <View
            style={[
              styles.txnBtnView,
              styles.leftTxnBtnView,
              btnStatus === 2 || isDisabled
                ? {backgroundColor: 'black', opacity: 0.7}
                : {},
            ]}>
            <Text style={[{color: 'white', fontSize: 15}]}>
              {C.STR_RECEIVE}
            </Text>
            <Image
              source={Images.icon_down_arrow}
              style={{width: 11, height: 11, marginLeft: 10}}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  btnAreaView: {
    flexDirection: 'row',
    borderColor: AppStyle.mainColor,
    borderWidth: 1,
    borderRadius: 7,
    height: 55,
    marginLeft: 26,
    marginRight: 26,
    marginTop: 10,
  },
  txnBtnView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightColor: AppStyle.mainColor,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    height: '100%',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
  leftTxnBtnView: {
    borderRightColor: 'transparent',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
});
export default SifirAccountActions;
