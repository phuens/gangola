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
  Icon,
  Textarea,
  List,
  ListItem,
  Left,
  Right,
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

export const TimberByFinishProductOrder = ({
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
  const [uom, setUom] = useState(undefined);
  const [qty, setQty] = useState(undefined);
  const [detail, setDetail] = useState(undefined);
  const [branch, setBranch] = useState(undefined);
  const [customerContactNo, setCustomerContactNo] = useState(undefined);
  const [item, setItem] = useState(undefined);
  const [itemRate, setItemRate] = useState(undefined);
  const [locationItemRate, setLocationItemRate] = useState(undefined);
  const [allLocation, setAllLocation] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [branchWiseLocation, setBranchWiseLocation] = useState(undefined);
  const [totalPayableAmount, setTotalPayableAmount] = useState(0.0);
  const [allItems, setAllItems] = useState([]);
  const [allItemType, setAllItemType] = useState([]);
  const [allDzongkhag, setAllDzongkhag] = useState([]);
  const [item_type, setItem_type] = useState(undefined);
  const [destination_dzongkhag, setDestination_dzongkhag] = useState(undefined);
  const [allTransportMode, setAllTransportMode] = useState([]);

  //For proper navigation/auth settings
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      getAllItemType();
    }
  }, []);

  const submitOrder = async () => {
    if (item == '' || item == undefined) {
      showToast('Item is required.');
    } else if (branch == '' || branch == undefined) {
      showToast('Material source is required.');
    } else if (branchWiseLocation == '' || branchWiseLocation == undefined) {
      showToast('Location is required.');
    } else if (qty == '' || qty == undefined) {
      showToast('Qty is required.');
    } else {
      const order_details = {
        user: userState.login_id,
        product_category: Config.timber_by_product_category,
        item_type,
        item,
        destination_dzongkhag,
        branch,
        quantity: qty,
        location: branchWiseLocation,
        contact_info: customerContactNo,
        destination: detail,
      };
      submitSalesOrder(
        order_details,
        allLocation,
        totalPayableAmount,
        Config.timber_by_product_category,
      );
    }
  };

  const getItems = async item_type => {
    if (item_type) {
      try {
        const all_items = await callAxios(
          'method/erpnext.crm_utils.get_site_items',
          'post',
          {
            filters: JSON.stringify({
              product_category: Config.timber_by_product_category,
              item_type,
            }),
          },
        );
        setUom(all_items.data.message[0][3]);
        setAllItems(all_items.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getAllItemType = async () => {
    try {
      const res = await callAxios(
        'method/erpnext.crm_utils.get_item_types',
        'get',
        {
          product_category: Config.timber_by_product_category,
        },
      );
      setAllItemType(res.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };
  const getAllDzongkhag = async item => {
    if (item) {
      try {
        const dz_all = await callAxios(
          'method/erpnext.crm_utils.get_crm_dzongkhags',
          'get',
          {
            product_category: Config.timber_by_product_category,
            item_type,
            item,
          },
        );
        setAllDzongkhag(dz_all.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getAllBranches = async destination_dzongkhag => {
    setLoading(false);
    try {
      const all_branches = await callAxios(
        'method/erpnext.crm_utils.get_branch_rate',
        'post',
        {
          item,
          product_category: Config.timber_by_product_category,
          destination_dzongkhag,
        },
      );
      setAllBranches(all_branches.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getBranchWiseLocation = async selectedBranch => {
    if (selectedBranch === undefined || item === undefined) {
      setLoading(false);
    } else {
      try {
        const res = await callAxios(
          'method/erpnext.crm_utils.get_branch_location',
          'post',
          {
            site: '',
            item,
            branch: selectedBranch,
          },
        );
        if (res.data.message !== undefined) {
          setItemRate(res.data.message[0].item_rate);
          setAllLocation(res.data.message);
        }
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getAllTransportMode = async () => {
    if (branch === undefined) {
      setLoading(false);
    } else {
      try {
        const res = await callAxios(
          'method/erpnext.crm_utils.get_transport_mode',
          'post',
          {
            site: '',
            branch,
            product_category: Config.timber_by_product_category,
          },
        );
        setAllTransportMode(res.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };
  /**
   * calculate invoice
   * @param {qty} enteredQty
   */
  const calculateInvoice = async enteredQty => {
    if (itemRate > 0 && parseFloat(enteredQty) > 0) {
      var netPayableAmount = enteredQty * itemRate;
      setTotalPayableAmount(netPayableAmount.toFixed(2));
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
                    selectedValue={item_type}
                    onValueChange={val => {
                      setItem_type(val);
                      getItems(val);
                      setItem(undefined);
                      setDestination_dzongkhag(undefined);
                      setBranch(undefined);
                      setBranchWiseLocation(undefined);
                      setQty(undefined);
                    }}>
                    <Picker.Item
                      label={'Select Item Type'}
                      value={undefined}
                      key={-1}
                    />
                    {allItemType &&
                      allItemType.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur[0]}
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
                    selectedValue={item}
                    onValueChange={val => {
                      setItem(val);
                      getAllDzongkhag(val);
                      setDestination_dzongkhag(undefined);
                      setBranch(undefined);
                      setBranchWiseLocation(undefined);
                      setQty(undefined);
                      setAllDzongkhag([]);
                    }}>
                    <Picker.Item
                      label={'Select Item'}
                      value={undefined}
                      key={-1}
                    />
                    {allItems &&
                      allItems.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={`${pur[1]}\n(ID${pur[0]})`}
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
                    selectedValue={destination_dzongkhag}
                    onValueChange={val => {
                      setDestination_dzongkhag(val);
                      getAllBranches(val);
                      setBranch(undefined);
                      setBranchWiseLocation(undefined);
                      setQty(undefined);
                    }}>
                    <Picker.Item
                      label={'Select Destination'}
                      value={undefined}
                      key={-1}
                    />
                    {allDzongkhag &&
                      allDzongkhag.map((val, idx) => {
                        return (
                          <Picker.Item
                            label={val.name}
                            value={val.name}
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
                      setBranch(val);
                      getBranchWiseLocation(val);
                      setBranchWiseLocation(undefined);
                      setQty(undefined);
                    }}>
                    <Picker.Item
                      label={'Select Material Source'}
                      value={undefined}
                      key={-1}
                    />
                    {allBranches &&
                      allBranches.map((pur, idx) => {
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

                {allItems !== undefined && branch !== undefined ? (
                  <Fragment>
                    {allLocation.length > 0 && (
                      <View style={globalStyles.dropdown}>
                        <Picker
                          mode="dropdown"
                          selectedValue={branchWiseLocation}
                          onValueChange={val => {
                            setBranchWiseLocation(val);
                            setQty(undefined);
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
                      <Item style={{borderColor: 'white'}}>
                        <Icon
                          name="infocirlceo"
                          type="AntDesign"
                          style={{color: '#14a0f9', fontSize: 15}}
                        />
                        <Label
                          style={{
                            color: 'gray',
                            fontWeight: '100',
                            fontSize: 15,
                          }}>
                          Item Rate Nu. {itemRate}/{uom}
                        </Label>
                      </Item>
                    )}
                  </Fragment>
                ) : (
                  <Fragment />
                )}

                <Item regular style={globalStyles.mb10}>
                  <Input
                    value={qty}
                    keyboardType={'numeric'}
                    onChangeText={val => {
                      setQty(val);
                      calculateInvoice(val);
                    }}
                    placeholder="Enter Qty"
                    placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                  />
                </Item>

                <Item regular style={globalStyles.mb10}>
                  <Input
                    value={customerContactNo}
                    keyboardType={'numeric'}
                    maxLength={8}
                    onChangeText={val => setCustomerContactNo(val)}
                    placeholder="Customer Contact No."
                    placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                  />
                </Item>

                <Item regular style={globalStyles.mb10}>
                  <Textarea
                    value={detail}
                    onChangeText={val => setDetail(val)}
                    placeholder="Enter destination/specific location"
                    placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                  />
                </Item>
                {qty > 0 && branchWiseLocation !== undefined ? (
                  <Fragment>
                    <List>
                      <ListItem itemDivider>
                        <Left>
                          <Label
                            style={{
                              fontWeight: 'bold',
                            }}>
                            Total Order Qty :
                          </Label>
                        </Left>
                        <Right style={{marginLeft: -200}}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}>
                            {' '}
                            {qty} {uom}
                          </Text>
                        </Right>
                      </ListItem>
                    </List>

                    <List style={{paddingBottom: 10}}>
                      <ListItem itemDivider>
                        <Left>
                          <Label
                            style={{
                              fontWeight: 'bold',
                            }}>
                            Total Payable Amt :
                          </Label>
                        </Left>
                        <Right style={{marginLeft: -200}}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}>
                            {' '}
                            Nu.{commaNumber(totalPayableAmount)}
                          </Text>
                        </Right>
                      </ListItem>
                    </List>
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
)(TimberByFinishProductOrder);
