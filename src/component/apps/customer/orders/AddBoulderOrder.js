import React, {useEffect, useState, Fragment} from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, Modal, ScrollView} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Config from 'react-native-config';
import {default as commaNumber} from 'comma-number';
import {
  Container,
  Content,
  CardItem,
  Form,
  Picker,
  Item,
  Button,
  Text,
  Input,
  View,
  Row,
  Col,
  Grid,
  Icon,
} from 'native-base';
import {
  callAxios,
  handleError,
  getImages,
  setLoading,
  showToast,
} from '../../../../redux/actions/commonActions';
import {submitSalesOrder} from '../../../../redux/actions/siteActions';
import globalStyles from '../../../../styles/globalStyle';
import SpinnerScreen from '../../../base/SpinnerScreen';
import OrderQty from './OrderQty';

export const AddBoulderOrder = ({
  userState,
  commonState,
  navigation,
  submitSalesOrder,
  handleError,
  setLoading,
  showToast,
}) => {
  //state info for forms
  let [, setState] = useState();

  const [site, setSite] = useState(undefined);
  const [item, setItem] = useState(undefined);
  const [branch, setBranch] = useState(undefined);
  const [itemDetail, setItemDetail] = useState(undefined);
  const [transport_mode, setTransportMode] = useState(undefined);
  const [vehicle, setvehicle] = useState(undefined);
  const [vehicle_capacity, setcapacity] = useState(undefined);
  const [noof_truck_load, settruckload] = useState(undefined);
  const [totalCFT, setTotalCFT] = useState(0);

  const [vehicle_capacities, setVehicle_capacities] = useState(undefined);
  const [vehicleCapacityErrorMsg, setVehicleCapacityErrorMsg] = useState('');
  const [vehicleErrorMsg, setVehicleErrorMsg] = useState('');
  const [truckLoadErrorMsg, setTruckLoadErrorMsg] = useState('');
  //all values
  const [all_boulder_sites, setall_boulder_sites] = useState([]);
  const [all_items, setall_items] = useState([]);
  const [all_branches, setall_branches] = useState([]);
  const [allprivatevehicles, setallprivatevehicles] = useState([]);

  const [all_vehicle_capacities, setall_vehicle_capacities] = useState([]);
  const [totalOrderQty, settotalOrderQty] = useState(undefined);
  const [totalItemRate, settotalItemRate] = useState(undefined);
  const [totalTransportationRate, settotalTransportationRate] = useState(
    undefined,
  );
  const [totalPayableAmount, settotalPayableAmount] = useState(undefined);
  //modal
  const [showModal, setShowModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);

  const [items, setItems] = useState([]);
  const [branchWiseLocation, setBranchWiseLocation] = useState(undefined);
  const [allLocation, setAllLocation] = useState([]);
  const [locationItemRate, setLocationItemRate] = useState(undefined);
  const [otherBranchInfo, setOtherBranchInfo] = useState([]);

  const [allTransportMode, setAllTransportMode] = useState([]);

  var commonPoolLabel = 'Common Pool';
  var selfOwnedLabel = 'Self Owned Transport';
  var privatePool = 'Private Pool';
  var othersLabel = 'Others';

  //For proper navigation/auth settings
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      //get all capacities
      setLoading(true);
      getBoulderSites();
    }
  }, []);

  useEffect(() => {
    setItem(undefined);
    setall_items([]);
    setLoading(true);
    getSiteItems();
  }, [site]);

  useEffect(() => {
    setBranch(undefined);
    setall_branches([]);
    setLoading(true);
    getAllBranches();
  }, [item]);

  useEffect(() => {
    setLoading(true);
    getItemDetails();
    getBranchWiseLocation();
  }, [branch, item]);

  useEffect(() => {
    setLoading(true);
    getItemRateByLocation();
  }, [branch, item, branchWiseLocation]);

  const setVehDetails = veh => {
    setvehicle(veh);
    setVehQty(veh);
  };

  const setVehQty = item => {
    const actual_item = allprivatevehicles.find(val => val.vehicle === item);
    if (actual_item) {
      setcapacity(actual_item.vehicle_capacity);
    }
  };

  const getBoulderSites = async () => {
    try {
      const all_st = await callAxios(
        `resource/Site?fields=["name","purpose","construction_type","location"]&filters=[["user", "=",${
          userState.login_id
        }],["product_category", "=","` +
          Config.boulder_product_category +
          `"], ["enabled", "=", 1]]`,
        'GET',
      );
      setall_boulder_sites(all_st.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getSiteItems = async () => {
    if (site === undefined) {
      setLoading(false);
    } else {
      try {
        const all_it = await callAxios(
          'method/erpnext.crm_utils.get_site_items',
          'post',
          {
            filters: JSON.stringify({
              site: site,
              product_category: Config.boulder_product_category,
            }),
          },
        );
        setall_items(all_it.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getAllBranches = async () => {
    if (item === undefined) {
      setLoading(false);
    } else {
      try {
        const all_it = await callAxios(
          'method/erpnext.crm_utils.get_branch_rate',
          'post',
          {
            item,
            site,
          },
        );
        setall_branches(all_it.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getItemDetails = async () => {
    if (item === undefined || branch === undefined) {
      setLoading(false);
      setItemDetail(undefined);
    } else {
      try {
        const all_its = await callAxios(
          'method/erpnext.crm_utils.get_branch_rate',
          'post',
          {
            site: site,
            item: item,
            branch: branch,
          },
        );
        if (all_its.data.message !== undefined) {
          setItemDetail(all_its.data.message[0]);
        }
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  /**
   * to get location based on branch selection
   */
  const getBranchWiseLocation = async () => {
    if (branch === undefined || site === undefined || item === undefined) {
      setLoading(false);
    } else {
      try {
        const res = await callAxios(
          'method/erpnext.crm_utils.get_branch_location',
          'post',
          {
            site,
            branch,
            item,
          },
        );
        if (res.data.message !== undefined) {
          setAllLocation(res.data.message);
        }
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  /**
   * to get item Rate based on location selection
   */
  const getItemRateByLocation = async () => {
    if (branch === undefined || site === undefined || item === undefined) {
      setLoading(false);
    } else {
      if (branchWiseLocation) {
        try {
          const res = await callAxios(
            'method/erpnext.crm_utils.get_branch_location',
            'post',
            {
              site,
              branch,
              item,
              location: branchWiseLocation,
            },
          );
          if (res.data.message !== undefined) {
            setLocationItemRate(res.data.message[0].item_rate);
          }
          setLoading(false);
        } catch (error) {
          handleError(error);
        }
      }
    }
  };

  const resetModal = () => {
    setvehicle(undefined);
    setcapacity(undefined);
    settruckload(undefined);
    setVehicle_capacities(undefined);
  };

  const resetErrorMsg = () => {
    setVehicleErrorMsg('');
    setVehicleCapacityErrorMsg('');
    setTruckLoadErrorMsg('');
  };

  const submitOrder = async () => {
    const order_details = {
      user: userState.login_id,
      product_category: Config.boulder_product_category,
      site,
      item,
      branch,
      transport_mode,
      location: branchWiseLocation,
      vehicles: items, //for self owned
      pool_vehicles: items, // for common pool
      selection_based_on: '',
      total_quantity: totalCFT,
      quantity: totalCFT,
    };
    submitSalesOrder(
      order_details,
      allLocation,
      totalPayableAmount,
      Config.boulder_product_category,
    );
  };

  const resetDataGrid = val => {
    if (val != transport_mode) {
      setItems(items.filter((_, ind) => 0 > ind));
    }
  };

  const checkNumeric = val => {
    var isNum = isNaN(val);
    if (isNum) {
      settruckload('');
    }
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <NavigationEvents
            onWillFocus={_ => {
              setState({});
            }}
            onWillBlur={_ => {
              setState(undefined);
            }}
          />
          <Content>
            <CardItem>
              <Form style={{width: '100%'}}>
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={site}
                    onValueChange={val => setSite(val)}>
                    <Picker.Item
                      label={'Select Site'}
                      value={undefined}
                      key={-1}
                    />
                    {all_boulder_sites &&
                      all_boulder_sites.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={`${pur.name} \n(${
                              pur.construction_type
                            } at ${pur.location})`}
                            value={pur.name}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={item}
                    onValueChange={val => setItem(val)}>
                    <Picker.Item
                      label={'Select Item'}
                      value={undefined}
                      key={-1}
                    />
                    {all_items &&
                      all_items.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={`${pur[1]} \n(ID${pur[0]})`}
                            value={pur[0]}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>

                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={branch}
                    onValueChange={val => {
                      setBranch(val),
                        setBranchWiseLocation(undefined),
                        resetDataGrid(val);
                    }}>
                    <Picker.Item
                      label={'Select Material Source'}
                      value={undefined}
                      key={-1}
                    />
                    {all_branches &&
                      all_branches.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.branch}
                            value={pur.branch}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>

                {itemDetail !== undefined && branch !== undefined ? (
                  <Fragment>
                    {allLocation.length > 0 && (
                      <View style={globalStyles.dropdown}>
                        <Picker
                          mode="dropdown"
                          selectedValue={branchWiseLocation}
                          onValueChange={val => {
                            if (val !== undefined) {
                              setBranchWiseLocation(val), resetDataGrid(val);
                            }
                          }}>
                          <Picker.Item
                            label={'Select Location'}
                            value={undefined}
                            key={-1}
                          />
                          {allLocation &&
                            allLocation.map((pur, idx) => {
                              return (
                                <Picker.Item
                                  label={pur.location}
                                  value={pur.location}
                                  key={idx}
                                />
                              );
                            })}
                        </Picker>
                      </View>
                    )}
                    {branchWiseLocation && (
                      <Text style={{color: 'gray'}}>
                        <Icon
                          name="info-circle"
                          type="FontAwesome"
                          style={globalStyles.smallIcon}
                        />
                        Item Rate Nu. {locationItemRate}/{itemDetail.stock_uom}
                      </Text>
                    )}

                    {/* <View style={globalStyles.dropdown}>
                        <Picker
                          mode="dropdown"
                          selectedValue={transport_mode}
                          onValueChange={val => {
                            setTransportMode(val), resetDataGrid(val);
                          }}>
                          <Picker.Item
                            label={'Select Transport Mode'}
                            value={undefined}
                            key={-1}
                          />
                          {allTransportMode &&
                            allTransportMode.map((pur, idx) => {
                              return (
                                <Picker.Item label={pur} value={pur} key={idx} />
                              );
                            })}
                        </Picker>
                      </View> */}

                    <View style={globalStyles.dropdown}>
                      <Input
                        keyboardType={'numeric'}
                        value={totalCFT}
                        onChangeText={val => {
                          setTotalCFT(val);
                          settotalPayableAmount(
                            (val * locationItemRate).toFixed(2),
                          );
                        }}
                        placeholder="Enter total cft"
                      />
                    </View>
                  </Fragment>
                ) : (
                  <Fragment />
                )}

                {totalCFT > 0 && branch !== undefined ? (
                  <Fragment>
                    <Row style={globalStyles.labelContainer} />
                    <Row style={globalStyles.labelContainer}>
                      <Col size={3}>
                        <Text>Total Order Qty:</Text>
                      </Col>
                      <Col size={2}>
                        <Text style={{textAlign: 'right'}}>{totalCFT} cft</Text>
                      </Col>
                    </Row>
                    <Row style={globalStyles.labelContainer}>
                      <Col size={3}>
                        <Text style={{fontWeight: 'bold'}}>
                          Total Payable Amt:
                        </Text>
                      </Col>
                      <Col size={2}>
                        <Text style={{textAlign: 'right', fontWeight: 'bold'}}>
                          Nu.{commaNumber(totalPayableAmount)}
                        </Text>
                      </Col>
                    </Row>
                    <Item />
                  </Fragment>
                ) : (
                  <Fragment />
                )}
                <Button
                  block
                  success
                  iconLeft
                  style={globalStyles.mb30}
                  onPress={submitOrder}>
                  <Text>Place Order</Text>
                </Button>
              </Form>
            </CardItem>
          </Content>

          <Modal
            animationType="slide"
            transparent={false}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}>
            <Content style={globalStyles.content}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginBottom: 10,
                  color: Config.APP_HEADER_COLOR,
                }}>
                Add Qty
              </Text>

              {(transport_mode === commonPoolLabel ||
                transport_mode === othersLabel) && (
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={vehicle_capacities}
                    onValueChange={val => {
                      setVehicle_capacities(val), resetErrorMsg();
                    }}>
                    <Picker.Item
                      label={'Select Vehicle Capacity'}
                      value={undefined}
                      key={-1}
                    />
                    {all_vehicle_capacities &&
                      all_vehicle_capacities.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.name}
                            value={pur.name}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
              )}

              {(transport_mode === selfOwnedLabel ||
                transport_mode === privatePool) && (
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={vehicle}
                    onValueChange={val => {
                      setVehDetails(val), setVehicleErrorMsg('');
                    }}>
                    <Picker.Item
                      label={'Select Vehicle'}
                      value={undefined}
                      key={-1}
                    />
                    {allprivatevehicles &&
                      allprivatevehicles.map((val, idx) => {
                        return (
                          <Picker.Item
                            label={val.vehicle}
                            value={val.vehicle}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
              )}
              {(vehicle || vehicle_capacities) && (
                <Fragment>
                  {vehicle && (
                    <Item regular style={globalStyles.mb10}>
                      <Input
                        disabled
                        value={vehicle_capacity}
                        placeholder="Capacity"
                        placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                      />
                    </Item>
                  )}

                  <Item regular style={globalStyles.mb10}>
                    <Input
                      value={noof_truck_load}
                      onChangeText={val => {
                        settruckload(val),
                          checkNumeric(val),
                          setTruckLoadErrorMsg('');
                      }}
                      placeholder="No of Truck Load"
                      placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                      keyboardType={'numeric'}
                    />
                  </Item>
                </Fragment>
              )}
              <Container>
                <View>
                  <Text style={globalStyles.errorMsg}>
                    {vehicleCapacityErrorMsg}
                    {vehicleErrorMsg}
                    {truckLoadErrorMsg}
                  </Text>
                </View>
              </Container>
            </Content>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  submitSalesOrder,
  handleError,
  getImages,
  setLoading,
  showToast,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddBoulderOrder);
