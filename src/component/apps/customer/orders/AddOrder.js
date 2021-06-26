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
  Label,
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

export const AddOrder = ({
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

  const [vehicle_capacities, setVehicle_capacities] = useState(undefined);
  const [vehicleCapacityErrorMsg, setVehicleCapacityErrorMsg] = useState('');
  const [vehicleErrorMsg, setVehicleErrorMsg] = useState('');
  const [truckLoadErrorMsg, setTruckLoadErrorMsg] = useState('');
  //all values
  const [all_sites, setall_sites] = useState([]);
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
      getSites();
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
    setTransportMode(undefined);
    setAllTransportMode([]);
    setLoading(true);
    getAllTransportMode();
  }, [site, branch]);

  useEffect(() => {
    setLoading(true);
    getItemDetails();
    getBranchWiseLocation();
  }, [branch, item]);

  useEffect(() => {
    setLoading(true);
    getItemRateByLocation();
  }, [branch, item, branchWiseLocation]);

  useEffect(() => {
    setLoading(true);
    getPrivateVehicles();
    getVehicleCapacity();
  }, [transport_mode]);

  useEffect(() => {
    setLoading(true);
    calculateInvoice();
  }, [items]);

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

  const getSites = async () => {
    try {
      /*const params = {
        fields: JSON.stringify([
          'name',
          'purpose',
          'construction_type',
          'location',
        ]),
        filters: JSON.stringify([
          ['user', '=', userState.login_id],
          ['enabled', '=', 1],
        ]),
      };*/

      const all_st = await callAxios(
        `resource/Site?fields=["name","purpose","construction_type","location"]&filters=[["user", "=",${
          userState.login_id
        }],["product_category", "=","Sand"], ["enabled", "=", 1]]`,
        'GET',
      );
      setall_sites(all_st.data.data);
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
              product_category: Config.sand_product_category,
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

  const getAllTransportMode = async () => {
    if (site === undefined || branch === undefined) {
      setLoading(false);
    } else {
      try {
        const res = await callAxios(
          'method/erpnext.crm_utils.get_transport_mode',
          'post',
          {
            site,
            branch,
            product_category: Config.sand_product_category,
          },
        );
        console.log(res.data.message);
        setAllTransportMode(res.data.message);
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
   * to get other branch info
   */
  const getOtherBranchInfo = async () => {
    try {
      const res = await callAxios(
        'method/erpnext.crm_utils.get_branch_location',
        'post',
        {
          site,
          item,
        },
      );
      setOtherBranchInfo(res.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
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

  const getPrivateVehicles = async () => {
    if (transport_mode === selfOwnedLabel || transport_mode === privatePool) {
      try {
        const all_its = await callAxios(
          'method/erpnext.crm_utils.get_vehicles',
          'post',
          {
            user: userState.login_id,
            site,
            transport_mode,
            is_boulder: 0,
          },
        );
        setallprivatevehicles(all_its.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    } else {
      //common pool capcities
      setLoading(false);
    }
  };

  const getVehicleCapacity = async () => {
    if (transport_mode === commonPoolLabel || transport_mode === othersLabel) {
      try {
        const all_st = await callAxios(
          'resource/Vehicle Capacity?filters=[["is_crm_item","=",1]]',
        );
        setall_vehicle_capacities(all_st.data.data);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    } else {
      //self owned capcities
      setLoading(false);
    }
  };

  const resetModal = () => {
    setvehicle(undefined);
    setcapacity(undefined);
    settruckload(undefined);
    setVehicle_capacities(undefined);
  };

  const checkLocation = () => {
    if (allLocation.length > 0 && branchWiseLocation === undefined) {
      setShowModal(false);
      showToast('Please select location');
    }
  };

  const resetErrorMsg = () => {
    setVehicleErrorMsg('');
    setVehicleCapacityErrorMsg('');
    setTruckLoadErrorMsg('');
  };

  const addItem = item => {
    setItems([...items, item]);
  };

  const removeItem = index => {
    setItems(items.filter((_, ind) => ind !== index));
  };

  const addItemToList = () => {
    if (
      (transport_mode == commonPoolLabel || transport_mode === othersLabel) &&
      vehicle_capacities == undefined
    ) {
      setVehicleCapacityErrorMsg('Vehicle capacity is required.');
    } else if (transport_mode == selfOwnedLabel && vehicle == undefined) {
      setVehicleErrorMsg('Vehicle is required.');
    } else if (noof_truck_load == undefined || noof_truck_load.trim() == '') {
      setTruckLoadErrorMsg('No of truck load is required.');
    } else if (noof_truck_load < 1) {
      setTruckLoadErrorMsg('No of truck load should be greater than 0');
      settruckload('');
    } else {
      resetErrorMsg();
      var load_capacity;
      if (transport_mode === selfOwnedLabel) {
        load_capacity = vehicle_capacity;
      } else if (transport_mode === privatePool) {
        load_capacity = vehicle_capacity;
      } else {
        load_capacity = vehicle_capacities;
      }
      const item = {
        vehicle,
        vehicle_capacity: load_capacity,
        noof_truck_load,
      };
      addItem(item);
      resetModal();
      setShowModal(false);
    }
  };

  const submitOrder = async () => {
    const order_details = {
      user: userState.login_id,
      product_category: Config.sand_product_category,
      site,
      item,
      branch,
      transport_mode,
      location: branchWiseLocation,
      vehicles: items, //for self owned
      pool_vehicles: items, // for common pool
    };
    submitSalesOrder(
      order_details,
      allLocation,
      totalPayableAmount,
      Config.sand_product_category,
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

  /**
   *
   * @param {to select transportation mode by defualt if there is only one value} val
   */
  const selectTransportMode = () => {
    setTransportMode(undefined);
  };

  const calculateInvoice = async () => {
    if (items.length > 0) {
      var totalOrderQty = items.reduce(function(prev, cur) {
        return prev + cur.noof_truck_load * cur.vehicle_capacity;
      }, 0);

      settotalOrderQty(totalOrderQty);

      var totalItemRate = totalOrderQty * locationItemRate;
      settotalItemRate(totalItemRate.toFixed(2));
      var totalTransportationRate =
        transport_mode == commonPoolLabel
          ? totalOrderQty * itemDetail.tr_rate * itemDetail.distance
          : 0.0;
      settotalTransportationRate(totalTransportationRate.toFixed(2));
      var totalPayableAmount = totalTransportationRate + totalItemRate;
      settotalPayableAmount(totalPayableAmount.toFixed(2));
      setLoading(false);
    }
    setLoading(false);
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
                    {all_sites &&
                      all_sites.map((pur, idx) => {
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
                        selectTransportMode(),
                        getOtherBranchInfo(val),
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

                <Modal
                  animationType="fade"
                  transparent={false}
                  visible={regionModal}
                  onRequestClose={() => setRegionModal(false)}>
                  <Content style={globalStyles.content}>
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                        marginBottom: 10,
                        color: Config.APP_HEADER_COLOR,
                      }}>
                      Other Region Information
                    </Text>
                    {branch && (
                      <Row style={[globalStyles.tableContainer]}>
                        <Grid>
                          <Row style={globalStyles.tableHeaderContainer}>
                            <Col size={2} style={globalStyles.colContainer}>
                              <Text>Region</Text>
                            </Col>
                            <Col size={1.5} style={globalStyles.colContainer}>
                              <Text>Location</Text>
                            </Col>
                            <Col size={1.5} style={globalStyles.colContainer}>
                              <Text>Lead Time</Text>
                            </Col>
                            <Col size={1.5} style={globalStyles.colContainer}>
                              <Text>Item Rate/m3</Text>
                            </Col>
                          </Row>
                          {otherBranchInfo.map((item, idx) => (
                            <Row
                              key={idx}
                              style={globalStyles.rowContainer}
                              onPress={() => {
                                setBranch(item.branch),
                                  setRegionModal(false),
                                  setBranchWiseLocation(item.location);
                              }}>
                              <Col size={2} style={globalStyles.colContainer}>
                                <Text>{item.branch}</Text>
                              </Col>
                              <Col size={1.5} style={globalStyles.colContainer}>
                                <Text
                                  style={{
                                    color: 'blue',
                                    textDecorationLine: 'underline',
                                  }}>
                                  {item.location}
                                </Text>
                              </Col>
                              <Col size={1.5} style={globalStyles.colContainer}>
                                <Text> {item.lead_time} Day(s)</Text>
                              </Col>
                              <Col size={1.5} style={globalStyles.colContainer}>
                                <Text>Nu.{item.item_rate} </Text>
                              </Col>
                            </Row>
                          ))}
                        </Grid>
                      </Row>
                    )}
                    <Container
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        maxHeight: 'auto',
                      }}>
                      <Text style={globalStyles.tapRegion}>
                        Tap on the location to select
                      </Text>
                      <Button
                        danger
                        onPress={() => {
                          setRegionModal(false);
                        }}>
                        <Text>Cancel</Text>
                      </Button>
                    </Container>
                  </Content>
                </Modal>

                {itemDetail !== undefined && branch !== undefined ? (
                  <Fragment>
                    <Item style={{borderColor: '#fff'}}>
                      <Icon
                        name="infocirlceo"
                        type="AntDesign"
                        style={globalStyles.smallIcon}
                      />
                      <Label
                        style={{
                          color: 'gray',
                          fontWeight: '100',
                          fontSize: 15,
                        }}>
                        Will take approximately {itemDetail.lead_time} working
                        days to deliver.{' '}
                      </Label>
                    </Item>
                    {itemDetail.has_common_pool === 1 ? (
                      <Item inlineLabel style={{borderColor: '#fff'}}>
                        <Label> </Label>
                        {/* <Icon name="infocirlceo" type="AntDesign" style={globalStyles.smallIcon} /> */}
                        <Label
                          style={{
                            color: 'gray',
                            fontWeight: '100',
                            fontSize: 15,
                          }}>
                          <Label
                            style={{color: '#14a0f9'}}
                            onPress={() => {
                              setRegionModal(true);
                            }}>
                            Click here
                          </Label>{' '}
                          to see information on sand available from other areas.
                        </Label>
                      </Item>
                    ) : (
                      <Fragment />
                    )}

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
                      <Item style={{borderColor: '#fff'}}>
                        <Icon
                          name="infocirlceo"
                          type="AntDesign"
                          style={globalStyles.smallIcon}
                        />
                        <Label
                          style={{
                            color: 'gray',
                            fontWeight: '100',
                            fontSize: 15,
                          }}>
                          Item Rate Nu. {locationItemRate}/
                          {itemDetail.stock_uom}
                        </Label>
                      </Item>
                    )}

                    <View style={globalStyles.dropdown}>
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
                    </View>

                    {transport_mode && (
                      <Fragment>
                        <Button
                          info
                          onPress={() => {
                            setShowModal(true),
                              resetErrorMsg(),
                              resetModal(),
                              checkLocation();
                          }}
                          style={globalStyles.mb10}>
                          {items.length > 0 ? (
                            <Text>Add More Qty</Text>
                          ) : (
                            <Text>Add Qty</Text>
                          )}
                        </Button>

                        <OrderQty
                          data={items}
                          removeItem={removeItem}
                          transport_mode={transport_mode}
                        />
                      </Fragment>
                    )}
                  </Fragment>
                ) : (
                  <Fragment />
                )}

                {items.length > 0 &&
                branch !== undefined &&
                transport_mode !== undefined ? (
                  <Fragment>
                    <Row style={globalStyles.labelContainer} />
                    <Row style={globalStyles.labelContainer}>
                      <Col size={3}>
                        <Text>Total Order Qty:</Text>
                      </Col>
                      <Col size={2}>
                        <Text style={{textAlign: 'right'}}>
                          {totalOrderQty} m3
                        </Text>
                      </Col>
                    </Row>
                    <Row style={globalStyles.labelContainer}>
                      <Col size={3}>
                        <Text>Total Item Amt:</Text>
                      </Col>
                      <Col size={2}>
                        <Text style={{textAlign: 'right'}}>
                          Nu.{commaNumber(totalItemRate)}
                        </Text>
                      </Col>
                    </Row>
                    <Row style={globalStyles.labelContainer}>
                      {transport_mode === commonPoolLabel && (
                        <Col size={4}>
                          <Text>Total Transportation Amt:</Text>
                        </Col>
                      )}
                      {transport_mode === commonPoolLabel && (
                        <Col size={2}>
                          <Text style={{textAlign: 'right'}}>
                            Nu.{commaNumber(totalTransportationRate)}
                          </Text>
                        </Col>
                      )}
                    </Row>
                    <Item />
                    <Row style={globalStyles.labelContainer}>
                      <Col size={3}>
                        <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                          Total Payable Amt:
                        </Text>
                      </Col>
                      <Col size={2}>
                        <Text style={{textAlign: 'right', fontWeight: 'bold'}}>
                          Nu.{commaNumber(totalPayableAmount)}
                        </Text>
                      </Col>
                    </Row>
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
              <Container
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  maxHeight: 50,
                }}>
                <Button success onPress={addItemToList}>
                  <Text>Add Qty</Text>
                </Button>
                <Button
                  danger
                  onPress={() => {
                    setShowModal(false), setvehicle(undefined);
                  }}>
                  <Text>Cancel</Text>
                </Button>
              </Container>

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
)(AddOrder);
