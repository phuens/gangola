import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, ToastAndroid, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import Dialog from 'react-native-dialog';
import Config from 'react-native-config';
import {
  Container,
  Text,
  Icon,
  Form,
  Item,
  Input,
  Button,
  Content,
  Spinner,
  View,
} from 'native-base';

import { startLogin, startResetPin } from '../../redux/actions/userActions';
import { setLoading, showToast, callAxios, handleError } from '../../redux/actions/commonActions';
import globalStyles from '../../styles/globalStyle';
import Logo from '../base/header/Logo';
import NavigationService from '../base/navigation/NavigationService';
const Login = ({
  navigation,
  userState,
  commonState,
  setLoading,
  startLogin,
  startResetPin,
  showToast,
  handleError
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reload, setReload] = useState(0);

  //Reset Pin attributes
  const [showDialog, setshowDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [loginid, setLoginid] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [userTor, setUserTor] = useState([]);

  useEffect(() => {
    if (userState.logged_in) {
      navigation.navigate('Auth');
    } else {
      fetchUsername();
    }
  }, [reload]);

  useEffect(() => {
    setLoading(true);
    getUserTor();
  }, []);

  const getUserTor = async () => {
    try {
      const response = await callAxios(
        'method/erpnext.crm_utils.get_tor?tor_type=Customer',
      );
      setUserTor(response.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  //Fill preverious filled username by default
  const fetchUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('nrdcl_username');
      if (storedUsername) {
        setUsername(storedUsername.slice(5));
      }
    } catch (error) { }
  };

  const performLogin = () => {
    setLoading(true);
    startLogin(username, password);
  };

  //Reset PIN function
  const showRequestPINDialog = async () => {
    setshowDialog(true);
  };

  const showRequestTermsDialog = async () => {
    setShowTermsDialog(true);
  };

  const requestPin = async () => {
    setLoading(true);
    const res = await startResetPin(loginid, mobileno);
    if (res && res.status == 200) {
      showToast(`New PIN sent to ${mobileno}`, 'success');
    }
    setshowDialog(false);
  };

  return commonState.isLoading ? (
    <Container style={globalStyles.container}>
      <Spinner color="green" />
    </Container>
  ) : (
      <Container>
        <NavigationEvents
          onWillFocus={_ => {
            setReload(1);
          }}
          onWillBlur={_ => {
            setReload(0);
          }}
        />
        <Content style={styles.content}>
          <Logo />
          <Form>
            <Item regular style={globalStyles.mb10}>
              <Icon name="person" />
              <Input
                value={username}
                onChangeText={usr => setUsername(usr)}
                placeholder="CID Number"
                placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                keyboardType={'numeric'}
              />
            </Item>

            <Item regular style={globalStyles.mb10}>
              <Icon name="unlock" />
              <Input
                secureTextEntry={true}
                value={password}
                onChangeText={pwd => setPassword(pwd)}
                placeholder="PIN"
                placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                keyboardType={'numeric'}
              />
            </Item>
            <Button
              block
              success
              iconRight
              style={globalStyles.mb10}
              onPress={performLogin}>
              <Text>Login</Text>
              <Icon name="log-in" />
            </Button>
          </Form>

          <Form style={styles.reset}>
            <Text>Forgot your PIN? </Text>
            <Text
              onPress={() => showRequestPINDialog()}
              style={{ textDecorationLine: 'underline', color: '#1E90FF' }}>
              Reset PIN
          </Text>
          </Form>
          <Form style={globalStyles.mb10}>
            <Button
              block
              info
              iconLeft
              style={globalStyles.mb10}
              onPress={() => showRequestTermsDialog()}>
              <Text>Register</Text>
              <Icon name="person-add" />
            </Button>
          </Form>
          <View>
            <Dialog.Container visible={showDialog}>
              <Dialog.Title>Reset PIN</Dialog.Title>
              <Dialog.Input
                placeholder="CID Number"
                placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                wrapperStyle={globalStyles.dialogueInput}
                onChangeText={cid => setLoginid(cid)}
                keyboardType={'number-pad'}></Dialog.Input>
              <Dialog.Input
                placeholder="Mobile Number"
                placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                wrapperStyle={globalStyles.dialogueInput}
                onChangeText={mobile_no => setMobileno(mobile_no)}
                keyboardType={'number-pad'}></Dialog.Input>
              <Dialog.Button
                label="Cancel"
                color="red"
                onPress={() => setshowDialog(false)}
              />
              <Dialog.Button label="Send my new PIN" onPress={requestPin} />
            </Dialog.Container>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showTermsDialog}
            onRequestClose={() => {
              setShowTermsDialog(false)
            }}
          >
            <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
              <View style={{ backgroundColor: "#ffffff", margin: 25, padding: 10, borderRadius: 10, flex: 1 }}>
                {userTor.map((tac, idx) => (
                  <Text style={globalStyles.termsText}>
                    {tac.title}
                  </Text>
                ))}
                <ScrollView>
                  <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                    {userTor.map((tac, idx) => (
                      <Text style={globalStyles.paragraphAlignment}>
                        {tac.content}
                      </Text>
                    ))}
                  </View>
                </ScrollView>
                <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                  <Form>
                    <Button
                      block
                      danger
                      iconLeft
                      style={globalStyles.mb10}
                      onPress={() => setShowTermsDialog(false)}>
                      <Text>DECLINE</Text>
                    </Button>
                  </Form>
                  <Form>
                    <Button
                      block
                      info
                      iconLeft
                      style={globalStyles.mb10}
                      onPress={() => {
                        setShowTermsDialog(false);
                        NavigationService.navigate('Signup');
                      }}>
                      <Text>AGREE</Text>
                    </Button>
                  </Form>

                </View>
              </View>
            </View>
          </Modal>
        </Content>
      </Container >
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },

  reset: {
    flexDirection: 'row',
    marginVertical: 20,
    alignContent: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = state => {
  return {
    userState: state.userState,
    commonState: state.commonState,
  };
};

export default connect(mapStateToProps, {
  startLogin,
  setLoading,
  startResetPin,
  showToast,
  handleError
})(Login);
