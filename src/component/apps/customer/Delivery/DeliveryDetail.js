import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import { ScrollView } from 'react-native';
import Config from 'react-native-config';
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Body,
  View,
  Button,
  Textarea,
  Input,
  Item,
  Label,
  Row,
  Col,
  List,
  ListItem,
  Icon,
} from 'native-base';
import SpinnerScreen from '../../../base/SpinnerScreen';
import globalStyle from '../../../../styles/globalStyle';
import {
  setLoading,
  callAxios,
  handleError,
} from '../../../../redux/actions/commonActions';
import {
  startVehicleDeregistration,
  confirmRecived,
} from '../../../../redux/actions/siteActions';
import Moment from 'moment';

export const OrderDetail = ({
  userState,
  commonState,
  navigation,
  handleError,
  setLoading,
  confirmRecived,
}) => {
  const [remarks, setremarks] = useState(null);
  const [deliver, setDeliver] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const toggleAlert = () => {
    setShowAlert(!showAlert);
  };
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getDeliverDetails(navigation.state.params.id);
    }
  }, []);

  //Get all the delivery list under login user
  const getDeliverDetails = async id => {
    try {
      const response = await callAxios(`resource/Delivery Confirmation/${id}`);
      setDeliver(response.data.data);

      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  // Confirm delivery from customer.
  const confirmDelivery = async () => {
    toggleAlert();
    const data = {
      delivery_note: deliver.delivery_note,
      user: userState.login_id,
      remarks,
    };
    confirmRecived(data);
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container>
        {showAlert && (
          <View style={{ width: '100%', height: '100%' }}>
            <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title="Acknowledge Receipt"
              message="Are you sure you want to acknowledge receipt?"
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelText="No"
              confirmText="Yes"
              confirmButtonColor="#DD6B55"
              onCancelPressed={() => {
                toggleAlert();
              }}
              onConfirmPressed={confirmDelivery}
            />
          </View>
        )}
        <ScrollView>
          <Content style={globalStyle.content}>
            <Card>
              <CardItem header bordered style={globalStyle.tableHeader}>
                <Body>
                  <Label style={(globalStyle.label, { color: 'white' })}>
                    Delivery Status
                </Label>
                </Body>
              </CardItem>
              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Delivery Note No :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{deliver.delivery_note}</Text>
                  </Col>
                </Row>
              </ListItem>
              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Status :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{deliver.confirmation_status}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Branch :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{deliver.branch}</Text>
                  </Col>
                </Row>
              </ListItem>
              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Vehicle No :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{deliver.vehicle}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Driver Name :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{deliver.drivers_name}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Driver Mobile No :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{deliver.contact_no}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Processing Date :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{Moment(deliver.exit_date_time).format('DD MMM YYYY, hh:mma')}</Text>
                  </Col>
                </Row>
              </ListItem>
              <ListItem >
                <Row >
                  <Col size={2.5} >
                    <Label >Receive Time :</Label>
                  </Col>
                  <Col size={2.5}>
                    {deliver.received_date_time != undefined ? (
                      <Text style={{ alignSelf: "flex-start" }}> {Moment(deliver.received_date_time).format(
                        'DD MMM YYYY, hh:mma',
                      )}</Text>
                    ) : (
                        <Text style={{ alignSelf: "flex-start" }}>{' '}</Text>
                      )}
                  </Col>
                </Row>
              </ListItem>
              {deliver.confirmation_status === 'In Transit' ? (
                <View>
                  <ListItem>
                    <Row >
                      <Col size={2.5}>
                        <Input
                          value={remarks}
                          onChangeText={val => setremarks(val)}
                          placeholder="Please enter remarks if any."
                          placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                        />
                      </Col>
                    </Row>
                  </ListItem>
                  < Item style={{ paddingRight: 30 }}>
                    <Icon name="infocirlceo" type="AntDesign" style={globalStyle.smallIcon} />
                    <Label style={{ color: 'gray', fontWeight: '100', fontSize: 12 }}>
                      {"Please contact above driver for detail." + '\n' + "Please click below button to acknowledge the receipt."}
                    </Label>
                  </Item >
                  <Row style={{ padding: 20 }}>
                    <Col size={5}>
                      <Button
                        block
                        success
                        style={[globalStyle.mb10, globalStyle.button]}
                        onPress={() => toggleAlert()}>
                        <Text>Acknowledge Receipt</Text>
                      </Button>
                    </Col>
                  </Row>
                </View>
              ) : (
                  <Fragment />
                )}
            </Card>
          </Content>
        </ScrollView>
      </Container >
    );
};
const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});
const mapDispatchToProps = {
  handleError,
  setLoading,
  startVehicleDeregistration,
  confirmRecived,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderDetail);
