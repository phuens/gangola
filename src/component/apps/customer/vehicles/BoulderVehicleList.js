import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  Container,
  Content,
  Item,
  Input,
  Body,
  Right,
  Icon,
  Button,
  View,
  Text,
  Label,
  List,
  ListItem,
} from 'native-base';

import {Modal, ScrollView, RefreshControl, SafeAreaView} from 'react-native';

import SpinnerScreen from '../../../base/SpinnerScreen';
import {
  callAxios,
  setLoading,
  handleError,
} from '../../../../redux/actions/commonActions';
import globalStyles from '../../../../styles/globalStyle';
import {FlatList} from 'react-native-gesture-handler';
import Config from 'react-native-config';
import {startVehicleRegistrationBoulder} from '../../../../redux/actions/siteActions';

export const BoulderVehicleList = ({
  userState,
  commonState,
  navigation,
  setLoading,
  handleError,
  startVehicleRegistrationBoulder,
}) => {
  //state info for forms
  let [, setState] = useState();
  const [errorMsg, setErrorMsg] = useState('');
  const [vehicleList, setVehicleList] = useState([]);
  const [vehicle_no, setVehicle_no] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [drivers_name, setdrivers_name] = useState('');
  const [contact_no, setcontact_no] = useState('');
  const [reload, setReload] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getBoulderActiveVehciles();
    }
  }, [reload]);

  const _refresh = React.useCallback(() => {
    wait(20).then(() => setRefreshing(false));
    getBoulderActiveVehciles();
  }, [refreshing]);
  function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  // Submit Vehicle Detail
  const submitVehicleInfo = async () => {
    if (vehicle_no === undefined || vehicle_no === '') {
      setErrorMsg('Please enter vehicle number.');
    } else if (drivers_name === undefined || drivers_name === '') {
      setErrorMsg('Please enter driver name.');
    } else if (contact_no === undefined || contact_no === '') {
      setErrorMsg('Please enter driver contact number.');
    } else {
      setErrorMsg('');
      const vehicleInfo = {
        approval_status: 'Approved',
        user: userState.login_id,
        self_arranged: 0,
        vehicle_no: vehicle_no.toUpperCase(),
        drivers_name,
        contact_no,
        is_boulder: 1,
        docstatus: 1,
      };
      startVehicleRegistrationBoulder(vehicleInfo);
      setModalVisible(false);
      setVehicle_no(undefined);
      setdrivers_name(undefined);
      setcontact_no(undefined);
    }
  };

  // Get Registered Vehicle
  const getBoulderActiveVehciles = async () => {
    try {
      const response = await callAxios(
        `resource/Vehicle?order_by=creation desc&fields=["name","vehicle_no","drivers_name","contact_no","vehicle_status"]&filters=[["user","=",${
          userState.login_id
        }],["vehicle_status", "!=", "Deregistered"],["docstatus", "=", 1]]`,
      );
      setVehicleList(response.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <List>
        <ListItem
          thumbnail
          onPress={() =>
            navigation.navigate('VehicleDetail', {id: item.name, is_boulder: 1})
          }>
          <Icon
            style={globalStyles.homeIcon}
            name="check"
            type="SimpleLineIcons"
          />
          <Body>
            {item.approval_status === 'Pending' ? (
              <Text style={{color: 'red'}}>{item.name}</Text>
            ) : (
              <Text>{item.name}</Text>
            )}
            <Text note>Driver Name: {item.drivers_name} </Text>
            <Text note>Driver Mobile No: {item.contact_no} </Text>
          </Body>
          <Right>
            {item.approval_status === 'Pending' ? (
              <Label style={{color: 'red'}}>{item.vehicle_status}</Label>
            ) : (
              <Label style={{color: 'green'}}>{item.vehicle_status}</Label>
            )}
          </Right>
        </ListItem>
      </List>
    );
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container style={globalStyles.listContent}>
      <Button
        info
        style={globalStyles.mb10}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text>Register New Vehicle</Text>
        <Icon name="add-to-list" type="Entypo" />
      </Button>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <ScrollView
        contentContainerStyle={globalStyles.container}
        refreshControl={
          <RefreshControl
            colors={['#689F38', '#9Bd35A']}
            refreshing={refreshing}
            onRefresh={_refresh}
          />
        }>
        <Content>
          <Modal
            animationType="slide"
            presentationStyle="pageSheet"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <Content style={globalStyles.content}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginBottom: 10,
                  color: Config.APP_HEADER_COLOR,
                }}>
                {'Add Vehicle'}
              </Text>
              <Item regular style={globalStyles.mb10}>
                <Input
                  value={vehicle_no}
                  onChangeText={val => setVehicle_no(val)}
                  placeholder="Vehicle No"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>

              <Item regular style={globalStyles.mb10}>
                <Input
                  value={drivers_name}
                  onChangeText={val => setdrivers_name(val)}
                  placeholder="Driver Name"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>

              <Item regular style={globalStyles.mb10}>
                <Input
                  value={contact_no}
                  onChangeText={val => setcontact_no(val)}
                  placeholder="Driver Mobile No"
                  keyboardType="numeric"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>
              <View style={{marginBottom: 20}} />

              <Container
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  maxHeight: 50,
                }}>
                <Button success onPress={submitVehicleInfo}>
                  <Text>Submit</Text>
                </Button>
                <Button danger onPress={() => setModalVisible(false)}>
                  <Text>Cancel</Text>
                </Button>
              </Container>
              <Container>
                <View>
                  <Text style={globalStyles.errorMsg}>{errorMsg}</Text>
                </View>
              </Container>
            </Content>
          </Modal>

          {vehicleList.length > 0 ? (
            <FlatList
              data={vehicleList}
              renderItem={renderItem}
              keyExtractor={item => item.name}
            />
          ) : (
            <Text style={globalStyles.emptyString}>
              No registered Vehicle yet
            </Text>
          )}
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
  setLoading,
  handleError,
  startVehicleRegistrationBoulder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoulderVehicleList);
