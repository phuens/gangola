import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';
import Config from 'react-native-config';
import NavigationService from '../../../../components/base/navigation/NavigationService';
import {
  Container,
  Content,
  Form,
  Picker,
  Item,
  Button,
  Text,
  Input,
  Icon,
  Card,
  CardItem,
  DeckSwiper,
  Row,
  Col,
  Body,
  Label
} from 'native-base';
import {
  callAxios,
  handleError,
  getImages,
  setLoading,
  showToast,
} from '../../../../redux/actions/commonActions';
import {
  submitMakePayment,
  submitCreditPayment,
} from '../../../../redux/actions/siteActions';
import globalStyles from '../../../../styles/globalStyle';
import SpinnerScreen from '../../../base/SpinnerScreen';
import { default as commaNumber } from 'comma-number';
import OTPInputView from '@twotalltotems/react-native-otp-input'

import Modal, { ModalContent, ModalButton, ModalFooter, ModalTitle } from 'react-native-modals';
export const Payment = ({
  userState,
  commonState,
  navigation,
  handleError,
  setLoading,
  submitMakePayment,
  submitCreditPayment,
  getImages,
  showToast,
}) => {
  //state info for forms
  const [order_no, setorder_no] = useState([undefined]);
  const [remitter_bank, setremitter_bank] = useState(undefined);
  const [remitter_acc_no, setremitter_acc_no] = useState(undefined);
  const [all_financial_inst, setall_financial_inst] = useState([]);
  const [showDialog, setshowDialog] = useState(false);
  const [otp, setOTP] = useState(undefined);
  const [creditAllowed, setCreditAllowed] = useState(undefined);
  const [modeOfPayment, setModeOfPayment] = useState(undefined);

  const [approvalDoc, setApprovalDoc] = useState([]);
  const [approvalDocmage, setApprovalDocmage] = useState([]);
  const [isSiteRequired, setSiteRequired] = useState();
  const [product_category, setProduct_category] = useState();
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);
  const [transaction_id, setTransaction_id] = useState(undefined);
  const [transaction_time, setTransaction_time] = useState(undefined);
  const [paymentAmount, setPaymentAmount] = useState(undefined);

  useEffect(() => {
    if (approvalDoc) {
      setApprovalDoc([]);
      setTimeout(() => {
        setApprovalDoc(approvalDocmage);
      }, 600);
    }
  }, [approvalDocmage]);

  //For proper navigation/auth settings
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getFinancialInstList();
      checkIsSiteRequiredForSelectedProduct(navigation.getParam('productCategory'));
    }
  }, []);

  useEffect(() => {
    if (isSiteRequired == 1) {
      checkPaymentOption(navigation.getParam('site_type'));
    }
  }, [isSiteRequired]);

  //To get the approval document during pay later
  useEffect(() => {
    if (approvalDocmage) {
      setApprovalDoc([]);
      setTimeout(() => {
        setApprovalDoc(approvalDocmage);
      }, 600);
    }
  }, [approvalDocmage]);

  //Approval Document
  const getApprovalDoc = async () => {
    const image = await getImages('Front');
    setApprovalDocmage(image);
  };

  //Remove attachment
  const removeAttachment = () => {
    setApprovalDocmage(approvalDoc.filter((_, ind) => ind > 0));
  };

  //check site required for product type, mainly for the by/finished product
  const checkIsSiteRequiredForSelectedProduct = async (productCategory) => {
    try {
      const response = await callAxios(`resource/Product Category/${productCategory}`);
      setSiteRequired(response.data.data.site_required);
      setProduct_category(productCategory);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  //Check payment option based on site type for display pay later option
  const checkPaymentOption = async id => {
    try {
      const response = await callAxios(`resource/Site Type/${id}`);
      setCreditAllowed(response.data.data.credit_allowed);
      setModeOfPayment(response.data.data.mode_of_payment);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  //This methode is to get all the financial bank list for dropdown
  const getFinancialInstList = async () => {
    try {
      const params = {
        fields: JSON.stringify(['name', 'bank_name', 'bank_code']),
        filters: JSON.stringify([['bank_code', '!=', null]]),
      };
      const bankList = await callAxios(
        `resource/Financial Institution?fields=["name", "bank_name", "bank_code"]&filters=[["bank_code", "!=", null]]`,
        'get',
      );
      setall_financial_inst(bankList.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  //Confirming the remitter bank and account number with getting OTP SMS
  const paymentRequest = async () => {
    if (remitter_bank === undefined || remitter_bank === '') {
      showToast('Remitter bank is mandatory.', 'danger');
    } else if (remitter_acc_no === '' || remitter_acc_no === undefined) {
      showToast('Remitter account number is mandatory.', 'danger');
    } else {
      try {
        setLoading(true);
        const paymentData = {
          customer_order: navigation.getParam('orderNumber'),
          bank_code: remitter_bank,
          bank_account: remitter_acc_no,
          amount: navigation.getParam('totalPayableAmount'),
        };
        const res = await callAxios(
          'method/erpnext.crm_api.init_payment',
          'post',
          paymentData,
        );
        if (res && res.status === 200) {
          // navigation.navigate('OTP', { orderNumber: navigation.getParam('orderNumber') });
          setshowDialog(true);
        }
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };
  //Crdite payment
  const paymentLater = async () => {
    if (approvalDoc.length < 1) {
      showToast('Approval document is mandatory.');
    } else {
      const creditPaymentInfo = {
        user: userState.login_id,
        customer_order: navigation.getParam('orderNumber'),
        mode_of_payment: modeOfPayment,
        paid_amount: navigation.getParam('totalPayableAmount'),
      };
      submitCreditPayment(creditPaymentInfo, approvalDocmage);
    }
  };
  //Payment confrimation
  const makePayment = async () => {
    setLoading(true);
    const res = await submitMakePayment({
      customer_order: navigation.getParam('orderNumber'),
      otp: otp
    });

    if (res && res.status == 200) {
      setTransaction_id(res.data.message.transaction_id);
      setTransaction_time(res.data.message.transaction_time);
      setPaymentAmount((res.data.message.amount).toFixed(2));
      setPaymentSuccessModal(true);
      setshowDialog(false);
      setLoading(false);
    }
  };
  const checkNumeric = val => {
    var isNum = isNaN(val);
    if (isNum) {
      setremitter_acc_no('');
    }
  };

  const styles = StyleSheet.create({
    borderStyleBase: {
      width: 30,
      height: 45
    },

    borderStyleHighLighted: {
      borderColor: "#03DAC6",
    },

    underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      color: 'green',
      borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
      borderColor: "#03DAC6",
    },
  });


  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container>
        <Content style={globalStyles.content}>

          <Form>
            <Item inlineLabel>
              <Label>Order Number :</Label>
              <Input
                value={navigation.getParam('orderNumber')}
                disabled
              />
            </Item>
            <Item inlineLabel>
              <Label>Amount Payable :</Label>
              <Input
                value={"Nu. " + commaNumber(navigation.getParam('totalPayableAmount'))}
                disabled
              />
            </Item>
          </Form>


          <Form>
            {/* <Row style={globalStyles.labelContainer}>
              <Col size={2}>
                <Text style={{ textAlign: 'right' }}>Your Order Number is: </Text>
              </Col>
              <Col size={2}>
                <Text style={globalStyles.label}>
                  {navigation.getParam('orderNumber')}
                </Text>
              </Col>
            </Row> */}
            {/* <Row style={globalStyles.labelContainer}>
              <Col size={2}>
                <Text style={{ textAlign: 'right' }}>Amount Payable: </Text>
              </Col>
              <Col size={2}>
                <Text style={globalStyles.label}>
                  Nu.{commaNumber(navigation.getParam('totalPayableAmount'))}/-
              </Text>
              </Col>
            </Row> */}
            <View style={globalStyles.dropdown}>
              <Picker
                mode="dropdown"
                selectedValue={remitter_bank}
                onValueChange={val => setremitter_bank(val)}>
                <Picker.Item
                  label={'Select Remitter Bank'}
                  value={undefined}
                  key={-1}
                />
                {all_financial_inst &&
                  all_financial_inst.map((val, idx) => {
                    return (
                      <Picker.Item
                        label={val.bank_name}
                        value={val.bank_code}
                        key={idx}
                      />
                    );
                  })}
              </Picker>
            </View>
            {remitter_bank && (
              <Item regular style={globalStyles.mb10}>
                <Input
                  value={remitter_acc_no}
                  keyboardType="number-pad"
                  onChangeText={val => {
                    setremitter_acc_no(val), checkNumeric(val);
                  }}
                  placeholder="Remitter Account No"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>
            )}
            {remitter_acc_no !== undefined && (
              <Button
                block
                success
                iconLeft
                style={globalStyles.mb10}
                onPress={paymentRequest}>
                <Text>Pay Now</Text>
              </Button>
            )}
            {(creditAllowed == 1 &&
              navigation.getParam('approval_status') === '') ||
              (creditAllowed == 1 &&
                navigation.getParam('approval_status') === 'Rejected') ? (
                <Button
                  block
                  info
                  style={globalStyles.mb10}
                  onPress={getApprovalDoc}>
                  <Text>Upload Approval Documents</Text>
                </Button>
              ) : (
                <Fragment />
              )}

            {approvalDoc.length === 0 ? null : (
              <View style={{ height: 300, width: '100%', marginBottom: 20 }}>
                <Text style={{ alignSelf: 'center', color: 'red' }}>
                  Swipe to review all images
              </Text>
                <DeckSwiper
                  dataSource={approvalDocmage}
                  renderItem={image => (
                    <Card style={{ elevation: 3 }}>
                      <CardItem cardBody>
                        <Image
                          source={{
                            uri: image.path,
                          }}
                          style={{ height: 250, width: '100%' }}
                        />
                      </CardItem>
                      <CardItem>
                        <Button
                          transparent
                          small
                          onPress={val => removeAttachment(val)}>
                          <Icon
                            name="delete"
                            type="AntDesign"
                            style={{ color: 'red' }}
                          />
                        </Button>
                        <Text>
                          {image.path.substring(image.path.lastIndexOf('/') + 1)}
                        </Text>
                      </CardItem>
                    </Card>
                  )}
                />
              </View>
            )}
            {(creditAllowed == 1 &&
              navigation.getParam('approval_status') === '') ||
              (creditAllowed == 1 &&
                navigation.getParam('approval_status') === 'Rejected') ? (
                <Button
                  block
                  success
                  iconLeft
                  style={globalStyles.mb10}
                  onPress={paymentLater}>
                  <Text>Pay Later</Text>
                </Button>
              ) : (
                <Fragment />
              )}
            <Fragment />
          </Form>

          <Modal
            visible={paymentSuccessModal}
            swipeThreshold={200}
            width={.9}
            footer={
              <ModalFooter>
                <ModalButton
                  text="OK"
                  onPress={() => {
                    if (product_category == Config.sand_product_category) {
                      navigation.navigate('ListOrder');
                    } else if (product_category == Config.timber_product_category) {
                      navigation.navigate('TimberOrder');
                    } else if (product_category == Config.boulder_product_category) {
                      navigation.navigate('BoulderOrderList');
                    } else {
                      navigation.navigate('TimberByFinishProductOrderList');
                    }
                    setPaymentSuccessModal(false);
                  }}
                />
              </ModalFooter>
            } >
            <ModalContent>
              <Card>
                <CardItem
                  header
                  bordered
                  style={globalStyles.tableHeader}>
                  <Body>
                    <Text style={{ color: 'white', alignSelf: 'center' }}>Successful Payment</Text>
                  </Body>
                </CardItem>
                <CardItem style={{ alignSelf: 'center' }}>
                  <View >
                    <Text style={{ alignSelf: 'center' }}>Transaction successfull with </Text>
                    <Text style={{ alignSelf: 'center' }}>payment of Nu:{paymentAmount} </Text>
                    <Text style={{ alignSelf: 'center' }}>Tran Ref No:{transaction_id}</Text>
                    <Text style={{ alignSelf: 'center' }}>Date: {transaction_time} </Text>
                    <Text style={{ alignSelf: 'center' }}>Thank you</Text>
                  </View>
                </CardItem>
              </Card>
            </ModalContent>
          </Modal>

          <View>
            <Dialog.Container visible={showDialog}>
              <Dialog.Title>Please enter your OTP</Dialog.Title>
              <OTPInputView
                style={{ width: '80%', height: 50 }}
                pinCount={6}
                theme={{ color: "black" }}
                autoFocusOnLoad={false}
                editable={true}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={(code) => {
                  setOTP(code);
                }}
              />
              <Dialog.Button
                label="Cancel"
                color="red"
                onPress={() => setshowDialog(false)}
              />
              <Dialog.Button label="Make Payment" onPress={makePayment} />
            </Dialog.Container>
          </View>
        </Content>
      </Container>
    );
};
const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  handleError,
  getImages,
  setLoading,
  submitMakePayment,
  submitCreditPayment,
  showToast,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment);
