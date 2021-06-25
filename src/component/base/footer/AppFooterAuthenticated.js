import React from 'react';
import {
  Container,
  Text,
  Footer,
  FooterTab,
  Button,
  Icon,
  Form,
  Item,
  Input,
  Content,
  Spinner,
  View,
  Row,
  Col,
} from 'native-base';
import Config from 'react-native-config';
import globalStyle from '../../../styles/globalStyle';
import NavigationService from '../navigation/NavigationService';
import { AsyncStorage } from 'react-native';

export default () => {
  //Check transporter aggreed tearms and condition before. If yes then navigate to transporter deshboard
  const checkLocalStorageTransporter = async () => {
    try {
      const value = await AsyncStorage.getItem('transporterTermsAgreed');
      if (value == null) {
        NavigationService.navigate('TransporterTerms');
      } else {
        NavigationService.navigate('TransporterDashboard');
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  return (
    <Container style={globalStyle.bottom}>
      <Footer>
        <FooterTab style={{ backgroundColor: Config.APP_HEADER_COLOR }}>
          <Row>
            <Col style={{ justifyContent: 'space-evenly' }}>
              <Button
                vertical
                onPress={() => NavigationService.navigate('ModeSelector')}>
                <Icon name="home" style={globalStyle.icon} />
                <Text style={globalStyle.iconText}>Home</Text>
              </Button>
            </Col>
            <Col style={{ justifyContent: 'space-evenly' }}>
              <Button vertical onPress={() => NavigationService.navigate('DeliveryList')}>
                <Icon name="truck-loading" type="FontAwesome5" style={globalStyle.icon} />
                <Text style={globalStyle.iconTextFooter}>Delivery</Text>
              </Button>
            </Col>
            <Col style={{ justifyContent: 'space-evenly' }}>
              <Button vertical onPress={() => NavigationService.navigate('ProductRequisition')}>
                <Icon name="tasks" type="FontAwesome5" style={globalStyle.icon} />
                <Text style={globalStyle.iconTextFooter}> Requisition</Text>
              </Button>
            </Col>
            {/* <Col style={{ justifyContent: 'space-evenly' }}>
              <Button
                vertical
                onPress={checkLocalStorageTransporter}>
                <Icon name="dump-truck" type="MaterialCommunityIcons" style={globalStyle.icon} />
                <Text style={globalStyle.iconTextFooter}>Pool Transporter</Text>
              </Button>
            </Col> */}
          </Row>
        </FooterTab>
      </Footer>
    </Container>
  );
};
