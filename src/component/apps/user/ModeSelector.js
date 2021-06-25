import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Text, Button, Icon, Grid, Row, Col, View, Label, Form, Thumbnail } from 'native-base';
import Banner from '../../base/header/Banner';
import globalStyle from '../../../styles/globalStyle';
import { AsyncStorage, Modal, ScrollView } from 'react-native';

import {
  callAxios,
  handleError,
  setLoading,
} from '../../../redux/actions/commonActions';

export const ModeSelector = ({ userState, navigation, handleError, setLoading }) => {
  const [showCommonPoolTermsModal, setShowCommonPoolTermsModal] = useState(false);
  const [tor, setTor] = useState([]);
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    }
    if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getTransporterTor();
  }, []);

  const getTransporterTor = async () => {
    try {
      const response = await callAxios(
        'method/erpnext.crm_utils.get_tor?tor_type=Transporter',
      );
      setTor(response.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  //Check customer aggreed tearms and condition before. If yes then navigate to customer deshboard
  const checkLocalStorageForCustomer = async () => {
    navigation.navigate('CustomerDashboard');
  };
  const navigateToByFinishProduct = async () => {
    navigation.navigate('TimberByFinishProductOrderList');
  };

  const navigateToBoulderAndAggregateDashboard = async () => {
    navigation.navigate('BoulderAggreDashboard');
  };

  //Check transporter aggreed tearms and condition before. If yes then navigate to transporter deshboard
  const checkLocalStorageTransporter = async () => {
    try {
      const value = await AsyncStorage.getItem('transporterTermsAgreed');
      if (value == null) {
        setShowCommonPoolTermsModal(true);
        // navigation.navigate('TransporterTerms');
      } else {
        navigation.navigate('TransporterDashboard');
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  //To do :Terms and condition for timber customer
  const checkLocalStorageForTimberCustomer = async () => {
    navigation.navigate('TimberDashboard');
  };

  const transporterTearmsAgreed = async () => {

    try {
      await AsyncStorage.setItem('transporterTermsAgreed', 'yes');
    } catch (error) {
      // Error saving data
    }
    setShowCommonPoolTermsModal(false);
    navigation.navigate('TransporterDashboard');
  };

  return (
    <Grid>
      <Row size={1}>
        <Col style={{ justifyContent: 'center' }}>
          <Banner />
        </Col>
      </Row>
      <Row size={0.6}>
        <Col style={globalStyle.homeButton}>
          <Button
            vertical
            transparent
            style={{ alignSelf: 'center' }}
            onPress={checkLocalStorageForCustomer}>
            <Thumbnail square source={require('../../../assets/images/sandicon.png')} />

            <Text style={globalStyle.homeIconText}>Sand</Text>
          </Button>
        </Col>
        <Col style={globalStyle.homeButton}>
          <Button
            vertical
            transparent
            style={{ alignSelf: 'center' }}
            onPress={checkLocalStorageForTimberCustomer}>
            <Thumbnail square source={require('../../../assets/images/timber.png')} />

            <Text style={globalStyle.homeIconText}>Timber</Text>
          </Button>
        </Col>

      </Row>
      <Row size={0.6}>
        <Col style={globalStyle.homeButton}>
          <Button
            vertical
            transparent
            style={{ alignSelf: 'center' }}
            onPress={navigateToBoulderAndAggregateDashboard}>
            <Thumbnail square source={require('../../../assets/images/boulderIcon.png')} />

            <Text style={globalStyle.homeIconText}>Boulders & {'\n'}Aggregates</Text>
          </Button>
        </Col>
        <Col style={globalStyle.homeButton}>
          <Button
            vertical
            transparent
            style={{ alignSelf: 'center' }}
            onPress={navigateToByFinishProduct}>
            <Thumbnail square source={require('../../../assets/images/otherTimbericon.png')} />

            <Text style={globalStyle.homeIconText}>Other Timber {'\n'}Products</Text>
          </Button>
        </Col>
      </Row>

      <Row size={0.7}>
        <Col style={globalStyle.homeButton}>
          <Button
            vertical
            transparent
            style={{ alignSelf: 'center' }}
            onPress={checkLocalStorageTransporter}>
            <Thumbnail square source={require('../../../assets/images/commonpoolicon.png')} />

            <Text style={globalStyle.homeIconText}>Common Pool{'\n'}Transporter(Sand)</Text>
          </Button>
        </Col>
        <Col style={globalStyle.homeButton}>
          <Button
            vertical
            transparent
            style={{ alignSelf: 'center' }}
            onPress={() => navigation.navigate('DeliveryList')}>
            <Thumbnail square source={require('../../../assets/images/deliveryicon.png')} />

            <Text style={globalStyle.homeIconText}>Delivery</Text>
          </Button>
        </Col>
      </Row>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCommonPoolTermsModal}
        onRequestClose={() => {
          setShowTermsDialog(false)
        }}
      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View style={{ backgroundColor: "#ffffff", margin: 15, padding: 10, borderRadius: 10, flex: 1 }}>
            {tor.map((tac, idx) => (
              <Text style={globalStyle.termsText}>
                {tac.title}
              </Text>
            ))}
            <ScrollView>
              <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                {tor.map((tac, idx) => (
                  <Text style={{ textAlign: 'justify' }}>
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
                  style={globalStyle.mb10}
                  onPress={() => setShowCommonPoolTermsModal(false)}>
                  <Icon name="thumbs-down" />
                  <Text>DECLINE</Text>
                </Button>
              </Form>
              <Form>
                <Button
                  block
                  info
                  iconLeft
                  style={globalStyle.mb10}
                  onPress={transporterTearmsAgreed}>
                  <Icon name="thumbs-up" />
                  <Text>AGREE</Text>
                </Button>
              </Form>

            </View>
          </View>
        </View>
      </Modal>
    </Grid >
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
});

const mapDispatchToProps = {
  handleError,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModeSelector);
