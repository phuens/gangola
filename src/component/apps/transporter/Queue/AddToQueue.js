import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { callAxios } from '../../../../redux/actions/commonActions';
import { submitApplyForQueue } from '../../../../redux/actions/siteActions';
import { submitCancelFromQueue } from '../../../../redux/actions/siteActions';
import globalStyle from '../../../../styles/globalStyle';
import Dialog from 'react-native-dialog';
import {
  Container,
  Content,
  Text,
  Button,
  List,
  ListItem,
  Body,
  Right,
  Left,
  View,
  Badge,
  Row,
  Label,
} from 'native-base';
import { Alert, Image, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import {
  handleError,
  getImages,
  setLoading,
  showToast
} from '../../../../redux/actions/commonActions';
import SpinnerScreen from '../../../base/SpinnerScreen';
import { Fragment } from 'react';

export const AddToQueue = ({
  userState,
  commonState,
  navigation,
  setLoading,
  submitApplyForQueue,
  submitCancelFromQueue,
  showToast
}) => {
  //state info for forms
  const [transporterVehicleList, setTransporterVehicleList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [showDialog, setshowDialog] = useState(false);
  const [remarks, setRemarks] = useState(undefined);
  const [vechicleNo, setVechicleNo] = useState(undefined);

  const _refresh = React.useCallback(() => {
    wait(20).then(() => setRefreshing(false));
    getTransporterVehicleList();
  }, [refreshing]);

  function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  //For proper navigation/auth settings
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      // setLoading(true);
      getTransporterVehicleList();
    }
  }, []);

  const getTransporterVehicleList = async () => {
    let params = {
      user: userState.login_id,
    };
    try {
      const res = await callAxios(
        'method/erpnext.crm_utils.get_vehicle_list',
        'get',
        params,
      );
      setTransporterVehicleList(res.data.message);
      // setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getReasonForCancellation = async (vechicle_no) => {
    setVechicleNo(vechicle_no);
    setshowDialog(true)
  }

  const cancelFromQueue = async (vechicleNo, remarks) => {
    if (remarks === undefined || remarks === '') {
      showToast('Please enter reason for cancellation.', 'danger');
    } else {
      submitCancelFromQueue(userState.login_id, vechicleNo, remarks);
      getTransporterVehicleList();
      setshowDialog(false);
      setRemarks(undefined);
    }

  }


  const applyForQueue = async vechicle_no => {
    const queueDetail = {
      user: userState.login_id,
      vehicle: vechicle_no,
    };
    Alert.alert(
      'Confirmation',
      'Are you sure you want to apply vehicle ' +
      vechicle_no +
      ' to the queue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            submitApplyForQueue(queueDetail);
            getTransporterVehicleList();
          },
        },
      ],
      { cancelable: false },
    );
  };

  const showCustomerDetail = async (
    location,
    customer_name,
    contact_mobile,
    delivery_note,
  ) => {
    Alert.alert(
      'Customer Detail',
      'Customer Name: ' +
      customer_name +
      '\nMobile No: ' +
      contact_mobile +
      '\nLocation: ' +
      location +
      '\nDN No: ' +
      delivery_note,
      [
        {
          text: 'OK',
        },
      ],
      { cancelable: false },
    );
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container>
        {/* <SafeAreaView> */}
        <ScrollView
          contentContainerStyle={globalStyle.container}
          refreshControl={
            <RefreshControl
              colors={['#689F38', '#9Bd35A']}
              refreshing={refreshing}
              onRefresh={_refresh}
            />
          }>
          <Content>
            {transporterVehicleList.length > 0 ?
              transporterVehicleList.map((vehicleDetail, idx) => (
                <List>
                  <ListItem avatar style={{ flex: 1 }}>
                    <Left>
                      <Image
                        source={require('../../../../assets/images/construction-truck.jpg')}
                        style={{
                          alignSelf: 'center',
                          width: 40,
                          height: 30,
                          marginBottom: 20,
                        }}
                      />
                    </Left>
                    <Body>
                      <Row>
                        <Label>
                          {vehicleDetail.name} ({vehicleDetail.vehicle_capacity} M3)
                    </Label>
                      </Row>
                      <Row>
                        {vehicleDetail.vehicle_status === 'Queued' && (
                          <Badge info warning style={{ justifyContent: "center" }}>
                            <Text >{vehicleDetail.vehicle_status}</Text>
                          </Badge>
                        )}
                        {vehicleDetail.vehicle_status === 'In Transit' && (
                          <Badge info primary style={{ justifyContent: "center" }}>
                            <Text>{vehicleDetail.vehicle_status}</Text>
                          </Badge>
                        )}
                        {vehicleDetail.vehicle_status === 'Available' && (
                          <Badge info success style={{ justifyContent: "center" }}>
                            <Text>{vehicleDetail.vehicle_status}</Text>
                          </Badge>
                        )}

                        {vehicleDetail.vehicle_status === 'Queued' && (
                          <Row>
                            <Text style={{ color: 'green', alignSelf: "center" }}>{'   '}Token</Text>
                            <Badge info style={{ justifyContent: "center" }}>
                              <Text>{vehicleDetail.queue_count}</Text>
                            </Badge>
                          </Row>
                        )}
                      </Row>
                    </Body>
                    <Right>
                      {vehicleDetail.vehicle_status === 'Available' && (
                        <Button
                          iconLeft
                          success
                          small
                          onPress={() => applyForQueue(vehicleDetail.name)}>
                          <Text>Apply</Text>
                        </Button>
                      )}
                      {vehicleDetail.vehicle_status === 'Queued' && (
                        <Button
                          iconLeft
                          danger
                          small
                          onPress={() => getReasonForCancellation(vehicleDetail.name)}>
                          <Text>Cancel</Text>
                        </Button>
                      )}
                      {vehicleDetail.vehicle_status === 'In Transit' && (
                        <Button iconLeft info small>
                          <Text
                            onPress={() =>
                              showCustomerDetail(
                                vehicleDetail.location,
                                vehicleDetail.customer_name,
                                vehicleDetail.contact_mobile,
                                vehicleDetail.delivery_note,
                              )
                            }>
                            View
                      </Text>
                        </Button>
                      )}
                    </Right>
                  </ListItem>
                </List>
              ))
              : (
                <Fragment>
                  <Text style={globalStyle.emptyString}>No common pool transport yet</Text>
                </Fragment>
              )}

            <View>
              <Dialog.Container visible={showDialog}>
                <Dialog.Title><Text>Confirmation</Text></Dialog.Title>
                <Dialog.Description>
                  Are you sure you want to cancel {vechicleNo}  from the queue?
                  </Dialog.Description>
                <Dialog.Input
                  placeholder="Please enter reason for cancellation"
                  style={{ color: 'black' }}
                  wrapperStyle={globalStyle.dialogueInput}
                  onChangeText={reason => setRemarks(reason)}
                />
                <Dialog.Button
                  label="Cancel"
                  color="red"
                  onPress={() => setshowDialog(false)}
                />
                <Dialog.Button label="Confirm" onPress={() => cancelFromQueue(vechicleNo, remarks)} />
              </Dialog.Container>
            </View>
          </Content>
        </ScrollView>
        {/* </SafeAreaView> */}
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
  submitApplyForQueue,
  submitCancelFromQueue,
  showToast
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddToQueue);
