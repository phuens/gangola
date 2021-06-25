import React, {useEffect, useState, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Config from 'react-native-config';
import AwesomeAlert from 'react-native-awesome-alerts';

import {default as commaNumber} from 'comma-number';
import {
  Container,
  Content,
  Card,
  CardItem,
  Form,
  Item,
  Button,
  Picker,
  Text,
  Input,
  View,
  Row,
  Col,
  Grid,
  Icon,
  Label,
  List,
  ListItem,
  Right,
  Left,
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
import TimberOrderQty from './TimberOrderQty';
import {
  Table,
  TableWrapper,
  Rows,
  Row as TableRow,
  Cell,
} from 'react-native-table-component';
//import {Picker} from '@react-native-picker/picker';

export const TimberOrderDetail = ({
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

  //Timber prime product
  const [site, setSite] = useState(undefined);
  const [item, setItem] = useState(undefined);
  const [all_allotment_number, setAll_allotment_number] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalVolumn, setTotalVolumn] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [addtionalCost, setAddtionalCost] = useState(0);
  const [challanCost, setChallanCost] = useState(0);
  const [data, setData] = useState([]);
  const [lotListDetail, setLotListDetail] = useState([]);
  const [lotNumber, setLotNumber] = useState(undefined);
  const [totalOrderQty, settotalOrderQty] = useState(undefined);
  const [totalItemRate, settotalItemRate] = useState(undefined);
  const [productGroup, setProductGroup] = useState(undefined);
  const [timberPrimeBranch, setTimberPrimeBranch] = useState(undefined);
  const [branchLotList, setBranchLotList] = useState([]);
  const [branchWiseLotDetail, setBranchWiseLotDetail] = useState([]);
  const [branchWiseLotNumber, setBranchWiseLotNumber] = useState(undefined);

  //sawn related
  const [branch, setBranch] = useState(undefined);
  const [itemDetail, setItemDetail] = useState(undefined);
  const [transport_mode, setTransportMode] = useState(undefined);
  const [sawnItem, setSawnItem] = useState(undefined);
  const [sawnItemName, setSawnItemName] = useState(undefined);
  const [sawnItemRate, setSawnItemRate] = useState(undefined);
  const [sawnLength, setSawnLength] = useState(undefined);
  const [sawnSize, setSawnSize] = useState(undefined);
  const [sawnItemAmount, setSawnItemAmount] = useState(0.0);
  const [showLotListDetailModal, setShowLotListDetailModal] = useState(false);
  const [advancePaymentModal, setAdvancePaymentModal] = useState(false);
  const [qty, setQty] = useState(undefined);
  const [uom, setUOM] = useState('cft');
  const [unitPerCft, setUnitPerCft] = useState('cft');
  const [balanceQty, setBalanceQty] = useState(undefined);
  const [errMessage, setErrMessage] = useState('');
  const [priceTemplate, setPriceTemplate] = useState('');
  const [totalSwanCFT, setTotalSwanCFT] = useState(0);

  //all values
  const [all_sites, setall_sites] = useState([]);
  const [all_items, setall_items] = useState([]);
  const [allSawnItems, setAllSawnItems] = useState([]);
  const [allStandardSize, setAllStandardSize] = useState([]);
  const [allSawnLength, setAllSawnLength] = useState([]);
  const [totalPayableAmount, settotalPayableAmount] = useState(0);
  const [minmunPayableAmount, setMinmunPayableAmount] = useState(0);
  const [allTimberPrimeSource, setAllTimberPrimeSource] = useState([]);

  //modal
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [lots, setLots] = useState([]);
  const [lot_allotment_no, setLot_allotment_no] = useState(undefined);
  const [allotment_type, setAllotment_type] = useState(undefined);
  const [allLocation, setAllLocation] = useState([]);
  const [branchWiseLotModal, setBranchWiseLotModal] = useState(false);
  const [branchWiseLotDetailModal, setBranchWiseLotDetailModal] = useState(
    false,
  );

  var selection_mode_lot = 'Lot';
  var selection_mode_item = 'Measurement';

  //For proper navigation/auth settings
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      getSites();
      getItemDetails();
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (item == selection_mode_item) {
      setLoading(true);
      calculateInvoice();
    }
  }, [items]);

  const resetModal = () => {
    setQty(undefined);
    setSawnItemRate(undefined);
    setUnitPerCft(undefined);
    setSawnItem(undefined);
    setSawnSize(undefined);
    setSawnLength(undefined);
    setSawnItemAmount(undefined);
  };

  const getSites = async () => {
    try {
      const all_st = await callAxios(
        `resource/Site?fields=["name","purpose","construction_type","location"]&filters=[["user", "=",${
          userState.login_id
        }],["product_category", "=","` +
          Config.timber_product_category +
          `"], ["enabled", "=", 1]]`,
        'GET',
      );
      setall_sites(all_st.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };
  /* Added to avoid  index - 1 */
  const get_product_group_name = async type => {
    try {
      const all_it = await callAxios(
        'method/erpnext.crm_utils.get_product_group_name',
        'post',
        {
          type,
        },
      );
      setProductGroup(all_it.data.message);

      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const get_item_name = async item_code => {
    try {
      const all_it = await callAxios(
        'method/erpnext.crm_utils.get_item_name',
        'post',
        {
          item_code,
        },
      );
      setSawnItemName(all_it.data.message);

      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getItemDetails = async () => {
    try {
      const all_its = await callAxios(
        'method/erpnext.crm_utils.get_product_groups',
        'post',
        {
          product_category: Config.timber_product_category,
        },
      );
      if (all_its.data.message !== undefined) {
        setall_items(all_its.data.message);
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * to get location based on branch selection
   */
  const getAllSourceByProductCategory = async () => {
    try {
      const all_branches = await callAxios(
        'method/erpnext.crm_utils.get_sawn_branch',
      );

      if (all_branches.data.message !== undefined) {
        setAllLocation(all_branches.data.message);
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getSawnTimberDetail = async val => {
    if (val === undefined) {
      setLoading(false);
    } else {
      try {
        const all_sawn_item_list = await callAxios(
          'method/erpnext.crm_utils.get_sawn_timber',
          'post',
          {
            branch: val,
          },
        );
        setAllSawnItems(all_sawn_item_list.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getSawnStandardSizelist = async val => {
    if (val === undefined || branch === undefined) {
      setLoading(false);
    } else {
      try {
        const all_standard_size_list = await callAxios(
          'method/erpnext.crm_utils.get_sawn_timber',
          'post',
          {
            branch: branch,
            item: val,
          },
        );
        setAllStandardSize(all_standard_size_list.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getSawnLengthList = async val => {
    if (sawnItem === undefined || val === undefined || branch == undefined) {
      setLoading(false);
    } else {
      const all_sawn_length_list = await callAxios(
        'method/erpnext.crm_utils.get_sawn_timber',
        'post',
        {
          branch: branch,
          item: sawnItem,
          size: val,
        },
      );
      setAllSawnLength(all_sawn_length_list.data.message);
      setLoading(false);
    }
  };

  const getSawnItemRateAndCft = async val => {
    if (
      val === undefined ||
      sawnItem === undefined ||
      branch == undefined ||
      sawnItem === undefined
    ) {
      setLoading(false);
    } else {
      const rate_and_cft = await callAxios(
        'method/erpnext.crm_utils.get_sawn_timber',
        'post',
        {
          branch: branch,
          item: sawnItem,
          size: sawnSize,
          length: val,
        },
      );
      setSawnItemRate(rate_and_cft.data.message[0].selling_price);
      setPriceTemplate(rate_and_cft.data.message[0].price_template);
      setBalanceQty(rate_and_cft.data.message[0].balance_qty);
      setUnitPerCft(rate_and_cft.data.message[0].unit_cft.toFixed(2));
      setLoading(false);
    }
  };

  const addItem = item => {
    setItems([...items, item]);
  };

  const removeItem = index => {
    setItems(items.filter((_, ind) => ind !== index));
  };

  const addItemToList = async () => {
    var itemExists = items.some(
      item =>
        item.item_name === sawnItemName &&
        item.size === sawnSize &&
        item.length === sawnLength,
    );

    if (itemExists) {
      setErrMessage('Selected item already exists.');
    } else if (branch == undefined) {
      setErrMessage('Select Material Source.');
    } else if (sawnItem == undefined) {
      setErrMessage('Sawn item is required.');
    } else if (sawnSize == undefined) {
      setErrMessage('Standard size is required.');
    } else if (sawnLength == undefined) {
      setErrMessage('Length is required.');
    } else if (qty == undefined || qty.trim() == '') {
      setErrMessage('Qty is required.');
    } else {
      setErrMessage('');
      const item = {
        item: sawnItem,
        item_name: sawnItemName,
        price_template: priceTemplate,
        rate: sawnItemRate,
        size: sawnSize,
        length: sawnLength,
        unit_cft: unitPerCft,
        qty,
        total_cft: qty * unitPerCft,
        amount: sawnItemAmount,
      };
      setTotalSwanCFT(totalSwanCFT + parseFloat(qty * unitPerCft));
      addItem(item);
      resetModal();
      setShowModal(false);
      settotalPayableAmount(totalPayableAmount + parseFloat(sawnItemAmount));
    }
  };
  const submitOrder = async () => {
    var lot_number =
      item == selection_mode_item
        ? ''
        : lot_allotment_no.substring(0, lot_allotment_no.indexOf('-'));
    const order_details = {
      user: userState.login_id,
      product_category: Config.timber_product_category,
      lot_allotment_no: lot_number, //lot allotment number
      product_group: productGroup,
      selection_based_on: item,
      site,
      quantity: totalOrderQty,
      total_quantity: totalOrderQty,
      sawns: items,
      lots: data,
      branch,
    };
    submitSalesOrder(
      order_details,
      allLocation,
      totalPayableAmount,
      Config.timber_product_category,
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
    settotalPayableAmount(
      items
        .reduce(function(prev, cur) {
          return prev + parseFloat(cur.amount.replace(/,/g, ''));
        }, 0)
        .toFixed(2),
    );
    setTotalSwanCFT(
      items.reduce(function(prev, cur) {
        return prev + parseFloat(cur.total_cft);
      }, 0),
    );

    setLoading(false);
  };
  const getAllotmentNumber = async selectedSite => {
    if (selectedSite != '' && selectedSite != undefined) {
      try {
        const allotmentNumber_list = await callAxios(
          'method/erpnext.crm_utils.get_lot_allotments',
          'GET',
          {
            site: selectedSite,
          },
        );
        setAll_allotment_number(allotmentNumber_list.data.message);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  var var_total_amt = 0;
  var var_total_qty = 0;
  const getLotListForTimber = async lot_allotment_no => {
    if (lot_allotment_no != '' && lot_allotment_no != undefined) {
      try {
        const lot_list = await callAxios(
          'method/erpnext.crm_utils.get_lots',
          'POST',
          {
            allotment_no: lot_allotment_no.substring(
              0,
              lot_allotment_no.indexOf('-'),
            ),
          },
        );

        if (
          lot_list.data.message[0].lots != '' &&
          lot_list.data.message[1].details != ''
        ) {
          setData(lot_list.data.message[0].lots);
          settotalPayableAmount(
            lot_list.data.message[1].details[0].total_payable,
          );
          setMinmunPayableAmount(
            lot_list.data.message[1].details[0].total_payable * 0.2,
          );
          setTotalVolumn(lot_list.data.message[1].details[0].total_volume);
          setTotalDiscountAmount(lot_list.data.message[1].details[0].discount);
          setAddtionalCost(lot_list.data.message[1].details[0].additional);
          setChallanCost(lot_list.data.message[1].details[0].challan_cost);
          setAllotment_type(lot_list.data.message[1].details[0].allotment_type);
          lot_list.data.message[0].lots.map((rowData, index) => {
            var_total_amt = var_total_amt + parseFloat(rowData.total_amount);
            var_total_qty = var_total_qty + parseFloat(rowData.total_volume);
          });
          setTotalAmount(var_total_amt);
          settotalOrderQty(var_total_qty);
        }
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    } else {
      setData([]);
      settotalPayableAmount(0);
      setTotalVolumn(0);
      setTotalDiscountAmount(0);
      setAddtionalCost(0);
      setChallanCost(0);
      setTotalAmount(0);
    }
  };

  const getLotListDetail = async lotNumber => {
    try {
      const lot_detail = await callAxios(
        'method/erpnext.crm_utils.get_lot_details',
        'POST',
        {
          lot_number: lotNumber,
        },
      );
      setLotNumber(lotNumber);
      setLotListDetail(lot_detail.data.message);
      setShowLotListDetailModal(true);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const makeAdvancePayment = async () => {
    if (
      parseFloat(minmunPayableAmount) < parseFloat(totalPayableAmount * 0.2)
    ) {
      showToast('Minimum advance payment must be 20%.');
    } else {
      var lot_number =
        item == selection_mode_item
          ? ''
          : lot_allotment_no.substring(0, lot_allotment_no.indexOf('-'));
      const order_details = {
        user: userState.login_id,
        product_category: Config.timber_product_category,
        lot_allotment_no: lot_number, //lot allotment number
        product_group: productGroup,
        selection_based_on: item,
        site,
        quantity: totalOrderQty,
        total_quantity: totalOrderQty,
        sawns: items,
        lots: data,
        branch,
      };
      submitSalesOrder(
        order_details,
        allLocation,
        minmunPayableAmount.toFixed(2),
        Config.timber_product_category,
      );
      setAdvancePaymentModal(false);
    }
  };

  const getTimberPrimeSource = async () => {
    try {
      const res = await callAxios('method/erpnext.crm_utils.lot_details');
      setAllTimberPrimeSource(res.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };
  const getTimberPrimeBranchWiseLotList = async selectedBranch => {
    try {
      const res = await callAxios(
        'method/erpnext.crm_utils.lot_details',
        'post',
        {
          branch: selectedBranch,
        },
      );
      setBranchLotList(res.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getBranchLotDetail = async lot_number => {
    try {
      const res = await callAxios(
        'method/erpnext.crm_utils.lot_details',
        'post',
        {
          lot_number,
        },
      );

      setBranchWiseLotDetail(res.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
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
                    selectedValue={item}
                    onValueChange={value => {
                      setItem(value);
                      settotalPayableAmount(0);
                      setSite(undefined);
                      setLot_allotment_no(undefined);

                      if (value == selection_mode_item) {
                        calculateInvoice();
                        getAllSourceByProductCategory();
                      }
                      // else {
                      //   getAllotmentNumber();
                      // }
                      if (value != '' && value != undefined) {
                        get_product_group_name(value);
                        //setProductGroup(all_items[index - 1].product_group);
                      }
                    }}>
                    <Picker.Item
                      label={'Select Item'}
                      value={undefined}
                      key={-1}
                    />
                    {all_items &&
                      all_items.map((data, idx) => {
                        return (
                          <Picker.Item
                            label={data.product_group}
                            value={data.selection_based_on}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
                {item == selection_mode_lot && (
                  <Fragment>
                    <View style={globalStyles.dropdown}>
                      <Picker
                        mode="dropdown"
                        selectedValue={site}
                        onValueChange={val => {
                          setSite(val);
                          settotalPayableAmount(0);
                          if (item == selection_mode_lot) {
                            getAllotmentNumber(val);
                          }
                        }}>
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
                  </Fragment>
                )}

                {item == selection_mode_lot && (
                  <Fragment>
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
                        For Timber Lot verification and confirmation please
                        visit our depot. For more information{' '}
                        <Label
                          style={{color: '#14a0f9', fontWeight: 'bold'}}
                          onPress={() => {
                            setBranchWiseLotModal(true);
                            getTimberPrimeSource();
                          }}>
                          click here.
                        </Label>{' '}
                      </Label>
                    </Item>

                    <View style={globalStyles.dropdown}>
                      <Picker
                        mode="dropdown"
                        selectedValue={lot_allotment_no}
                        onValueChange={val => {
                          setLot_allotment_no(val);
                          getLotListForTimber(val);
                        }}>
                        <Picker.Item
                          label={'Select Allotment Number'}
                          value={undefined}
                          key={-1}
                        />
                        {all_allotment_number &&
                          all_allotment_number.map((data, idx) => {
                            return (
                              <Picker.Item
                                label={data.data}
                                value={data.data}
                                key={idx}
                              />
                            );
                          })}
                      </Picker>
                    </View>
                  </Fragment>
                )}
                {item == selection_mode_item && (
                  <Fragment>
                    <View>
                      <Button
                        info
                        onPress={() => {
                          setShowModal(true);
                          setErrMessage('');
                          resetModal();
                        }}
                        style={globalStyles.mb10}>
                        {items.length > 0 ? (
                          <Text>Add More Item</Text>
                        ) : (
                          <Text>Add Item</Text>
                        )}
                      </Button>

                      <TimberOrderQty data={items} removeItem={removeItem} />
                    </View>
                  </Fragment>
                )}

                {site != undefined &&
                  item == selection_mode_lot &&
                  lot_allotment_no != undefined && (
                    <List>
                      <ListItem itemDivider>
                        <Row>
                          <Col size={2}>
                            <Label style={globalStyles.labelBold}>
                              Lot Number
                            </Label>
                          </Col>
                          <Col size={1.5}>
                            <Label style={globalStyles.labelBold}>
                              Vol. (cft)
                            </Label>
                          </Col>
                          <Col size={1.7}>
                            <Label style={globalStyles.labelBold}>Amount</Label>
                          </Col>
                          <Col size={0.5}>
                            <Label />
                          </Col>
                        </Row>
                      </ListItem>

                      {data.map((rowData, idx) => (
                        <ListItem key={idx}>
                          <Row
                            onPress={() =>
                              getLotListDetail(rowData.lot_number)
                            }>
                            <Col size={2}>
                              <Text>{rowData.lot_number}</Text>
                            </Col>
                            <Col size={1.7}>
                              <Text>{rowData.total_volume}</Text>
                            </Col>
                            <Col size={1.9}>
                              <Text
                                style={{
                                  alignSelf: 'flex-end',
                                  paddingRight: 5,
                                }}>
                                {commaNumber(rowData.total_amount.toFixed(2))}
                              </Text>
                            </Col>
                          </Row>
                          <Right style={{marginRight: -15}}>
                            <Icon
                              style={{color: '#14a0f9'}}
                              onPress={() =>
                                getLotListDetail(rowData.lot_number)
                              }
                              type="SimpleLineIcons"
                              name="info"
                            />
                          </Right>
                        </ListItem>
                      ))}
                    </List>
                  )}

                {site != undefined &&
                item == selection_mode_lot &&
                lot_allotment_no != undefined ? (
                  <Fragment>
                    <Row style={globalStyles.labelContainer} />
                    {item == selection_mode_lot && (
                      <Fragment>
                        <List style={{paddingBottom: 10}}>
                          <ListItem itemDivider>
                            <Left>
                              <Label>Challan Cost :</Label>
                            </Left>
                            <Right style={{marginLeft: -200}}>
                              <Text>
                                {'Nu. ' + commaNumber(challanCost.toFixed(2))}
                              </Text>
                            </Right>
                          </ListItem>
                          <ListItem itemDivider>
                            <Left>
                              <Label>Additional Cost :</Label>
                            </Left>
                            <Right style={{marginLeft: -200}}>
                              <Text>
                                {'Nu. ' + commaNumber(addtionalCost.toFixed(2))}
                              </Text>
                            </Right>
                          </ListItem>
                          <ListItem itemDivider>
                            <Left>
                              <Label>Total Discount Amt :</Label>
                            </Left>
                            <Right style={{marginLeft: -200}}>
                              <Text>
                                {'Nu. ' +
                                  commaNumber(totalDiscountAmount.toFixed(2))}
                              </Text>
                            </Right>
                          </ListItem>
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
                                {'Nu. ' +
                                  commaNumber(
                                    parseFloat(totalPayableAmount).toFixed(2),
                                  )}
                              </Text>
                            </Right>
                          </ListItem>
                        </List>
                      </Fragment>
                    )}
                  </Fragment>
                ) : (
                  <Fragment />
                )}

                {totalPayableAmount > 0 && item == selection_mode_item && (
                  <List style={{paddingBottom: 10, marginRight: '10%'}}>
                    <ListItem>
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
                          {'Nu. ' +
                            commaNumber(
                              parseFloat(totalPayableAmount).toFixed(2),
                            )}
                        </Text>
                      </Right>
                    </ListItem>
                  </List>
                )}

                {item == selection_mode_item && totalSwanCFT > 25 && (
                  <Fragment>
                    <Label
                        style={{
                          color: 'red',
                          fontWeight: '100',
                          fontSize: 15,
                        }}>
                        * Registered Site is mandatory if you are ordering Swan Timber more than 25 CFT{' '}
                    </Label>
                    <View style={globalStyles.dropdown}>
                      <Picker
                        mode="dropdown"
                        selectedValue={site}
                        onValueChange={val => {
                          setSite(val);
                        }}>
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
                  </Fragment>
                )}
                {totalPayableAmount > 0 && (
                  <View>
                    <Button
                      block
                      success
                      iconLeft
                      style={globalStyles.mb10}
                      onPress={submitOrder}>
                      <Text>Place Order</Text>
                    </Button>
                    {item == selection_mode_lot &&
                      allotment_type == 'Monthly Allotment' && (
                        <View>
                          <Button
                            block
                            success
                            iconLeft
                            style={globalStyles.mb11}
                            onPress={() => {
                              setAdvancePaymentModal(true);
                              setMinmunPayableAmount(totalPayableAmount * 0.2);
                            }}>
                            <Text>Make Advance Payment</Text>
                          </Button>
                          <Item inlineLabel style={{color: ''}}>
                            <Icon
                              name="infocirlceo"
                              type="AntDesign"
                              style={{color: '#14a0f9'}}
                            />
                            <Label
                              style={{
                                color: 'gray',
                                fontWeight: '100',
                                fontSize: 15,
                              }}>
                              In order to confirm booking you must do min. of
                              20% advance payment.
                            </Label>
                          </Item>
                        </View>
                      )}
                  </View>
                )}
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
                Item Detail
              </Text>

              <View style={globalStyles.dropdown}>
                <Picker
                  mode="dropdown"
                  selectedValue={branch}
                  onValueChange={val => {
                    setBranch(val);
                    setItems([]);
                    setSawnItem(undefined);
                    setQty(undefined);
                    setSawnItemRate(undefined);
                    setUnitPerCft(undefined);
                    setSawnSize(undefined);
                    setSawnLength(undefined);
                    getSawnTimberDetail(val);
                  }}>
                  <Picker.Item
                    label={'Select Material Source'}
                    value={undefined}
                    key={-1}
                  />
                  {allLocation &&
                    allLocation.map((val, idx) => {
                      return (
                        <Picker.Item
                          label={val.branch}
                          value={val.branch}
                          key={idx}
                        />
                      );
                    })}
                </Picker>
              </View>

              {branch != undefined && (
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={sawnItem}
                    onValueChange={(value, index) => {
                      setSawnItem(value);
                      getSawnStandardSizelist(value);
                      setQty(undefined);
                      setSawnSize(undefined);
                      setSawnItemRate(undefined);
                      setUnitPerCft(undefined);
                      setSawnLength(undefined);
                      if (value != '' && value != undefined) {
                        get_item_name(value);
                        //setSawnItemName(allSawnItems[index - 1].item_name);
                      }
                    }}>
                    <Picker.Item
                      label={'Select Sawn Items'}
                      value={undefined}
                      key={-1}
                    />
                    {allSawnItems &&
                      allSawnItems.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.item_name}
                            value={pur.item}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
              )}
              {sawnItem != undefined && (
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={sawnSize}
                    onValueChange={val => {
                      setSawnSize(val);
                      setQty(undefined);
                      setSawnItemRate(undefined);
                      setUnitPerCft(undefined);
                      setSawnLength(undefined);
                      getSawnLengthList(val);
                    }}>
                    <Picker.Item
                      label={'Select Standard Size'}
                      value={undefined}
                      key={-1}
                    />
                    {allStandardSize &&
                      allStandardSize.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.size}
                            value={pur.size}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
              )}
              {sawnSize != undefined && (
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={sawnLength}
                    onValueChange={val => {
                      setSawnLength(val);
                      getSawnItemRateAndCft(val);
                    }}>
                    <Picker.Item
                      label={'Select length'}
                      value={undefined}
                      key={-1}
                    />
                    {allSawnLength &&
                      allSawnLength.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.length}
                            value={pur.length}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
              )}

              {sawnLength != undefined && (
                <Fragment>
                  <ListItem itemDivider>
                    <Row>
                      <Col size={3}>
                        <Label style={globalStyles.labelBold}>
                          Per Piece (cft)
                        </Label>
                      </Col>
                      <Col size={2}>
                        <Label style={globalStyles.labelBold}>Rate/{uom}</Label>
                      </Col>
                      <Col size={3} style={{alignItems: 'flex-end'}}>
                        <Label style={globalStyles.labelBold}>
                          Available Qty
                        </Label>
                      </Col>
                    </Row>
                  </ListItem>

                  <ListItem>
                    <Row>
                      <Col size={3}>
                        <Label>
                          <Icon
                            name="info-circle"
                            type="FontAwesome"
                            style={globalStyles.smallIcon}
                          />{' '}
                          {unitPerCft}
                        </Label>
                      </Col>
                      <Col size={3}>
                        <Label> Nu. {sawnItemRate}</Label>
                      </Col>
                      <Col size={3} style={{alignItems: 'flex-end'}}>
                        <Label> {balanceQty}</Label>
                      </Col>
                    </Row>
                  </ListItem>

                  <Item regular style={globalStyles.mb10}>
                    <Input
                      value={qty}
                      keyboardType={'numeric'}
                      placeholder="Quantity"
                      onChangeText={val => {
                        setQty(val);
                        if (parseInt(val) > parseInt(balanceQty)) {
                          Alert.alert(
                            'Warning',
                            'Entered qty exceeded the available qty.',
                            [
                              {
                                text: 'OK',
                                onPress: () => {
                                  setQty('');
                                  setSawnItemAmount(0);
                                },
                              },
                            ],
                            {cancelable: false},
                          );
                        } else {
                          setSawnItemAmount(
                            (val * sawnItemRate * unitPerCft).toFixed(2),
                          );
                        }
                      }}
                      placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                    />
                  </Item>
                  <Row style={globalStyles.labelContainer}>
                    <Col size={1}>
                      <Label style={{fontWeight: 'bold'}}>Amount:</Label>
                    </Col>
                    <Col size={2}>
                      <Label style={{textAlign: 'right', fontWeight: 'bold'}}>
                        Nu.{commaNumber(sawnItemAmount)}{' '}
                      </Label>
                    </Col>
                  </Row>
                </Fragment>
              )}

              <View regular style={globalStyles.mb10}>
                <Container
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    maxHeight: 50,
                  }}>
                  <Button success onPress={addItemToList}>
                    <Text>Add</Text>
                  </Button>
                  <Button
                    danger
                    onPress={() => {
                      setShowModal(false);
                    }}>
                    <Text>Cancel</Text>
                  </Button>
                </Container>
                <Container>
                  <View>
                    <Text style={globalStyles.errorMsg}>{errMessage}</Text>
                  </View>
                </Container>
              </View>
            </Content>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showLotListDetailModal}
            onRequestClose={() => {
              setShowLotListDetailModal(false);
            }}>
            <View style={{backgroundColor: '#000000aa', flex: 1}}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  margin: 15,
                  padding: 10,
                  borderRadius: 10,
                  flex: 1,
                }}>
                <Label style={globalStyles.termsText}>
                  Lot detail for {lotNumber}
                </Label>
                <ScrollView>
                  <Content>
                    <Row style={{paddingBottom: 10}} />
                    {lotListDetail.length > 0 ? (
                      lotListDetail.map((item, idx) => (
                        <Card style={globalStyles.p8}>
                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Item Name :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.item_name}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>
                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Item Sub Group :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.item_sub_group}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>
                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Additional Cost/cft :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {'Nu. ' + commaNumber(item.additional_cost)}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Discount Amt/cft :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {'Nu. ' + commaNumber(item.discount_amount)}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Rate :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {'Nu. ' + commaNumber(item.rate)}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Volume :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.total_volume}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Pieces :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.total_pieces}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Amount :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {'Nu. ' + commaNumber(item.amount.toFixed(2))}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>
                        </Card>
                      ))
                    ) : (
                      <Fragment />
                    )}
                  </Content>
                </ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    padding: 10,
                  }}>
                  <Form>
                    <Button
                      block
                      danger
                      iconLeft
                      style={globalStyles.mb10}
                      onPress={() => setShowLotListDetailModal(false)}>
                      <Text>Close</Text>
                    </Button>
                  </Form>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal for confirm payment */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={advancePaymentModal}
            onRequestClose={() => {
              setAdvancePaymentModal(false);
            }}>
            <View style={{backgroundColor: '#000000aa', flex: 1}}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  marginTop: 100,
                  marginBottom: 200,
                  marginRight: 25,
                  marginLeft: 25,
                  padding: 5,
                  borderRadius: 10,
                  flex: 1,
                  float: 'center',
                  position: 'absolute',
                }}>
                <Label style={globalStyles.termsText}>Advance Payment</Label>
                <ScrollView>
                  <Content>
                    <Form>
                      <Item stackedLabel>
                        <Label>Total Payable Amount Nu.</Label>
                        <Input
                          value={totalPayableAmount.toString()}
                          // keyboardType={'numeric'}
                          disabled
                          onChangeText={val => {
                            setMinmunPayableAmount(val);
                          }}
                          placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                        />
                      </Item>
                      <Item stackedLabel last>
                        <Label>Advance Amount Nu.(Min 20%)</Label>
                        <Input
                          value={minmunPayableAmount.toFixed(2).toString()}
                          keyboardType={'numeric'}
                          placeholder="Please enter advance amount"
                          onChangeText={val => {
                            setMinmunPayableAmount(val);
                          }}
                          placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                        />
                      </Item>
                    </Form>
                  </Content>
                </ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    padding: 10,
                  }}>
                  <Form>
                    <Button
                      block
                      danger
                      iconLeft
                      style={globalStyles.mb10}
                      onPress={() => setAdvancePaymentModal(false)}>
                      <Text>Close</Text>
                    </Button>
                  </Form>
                  <Form>
                    <Button
                      block
                      info
                      iconLeft
                      style={globalStyles.mb10}
                      onPress={makeAdvancePayment}>
                      <Text>Proceed Payment</Text>
                    </Button>
                  </Form>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal to view branch wise lot details for customer information  */}
          <Modal
            animationType="fade"
            transparent={false}
            visible={branchWiseLotModal}
            onRequestClose={() => setBranchWiseLotModal(false)}>
            <Content style={globalStyles.content}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginBottom: 10,
                  color: Config.APP_HEADER_COLOR,
                }}>
                Lot Information
              </Text>
              <Label>
                Please select source to view available lot information.
              </Label>
              <View style={globalStyles.dropdown}>
                <Picker
                  mode="dropdown"
                  selectedValue={timberPrimeBranch}
                  onValueChange={val => {
                    setTimberPrimeBranch(val);
                    getTimberPrimeBranchWiseLotList(val);
                  }}>
                  <Picker.Item
                    label={'Select Source'}
                    value={undefined}
                    key={-1}
                  />
                  {allTimberPrimeSource &&
                    allTimberPrimeSource.map((pur, idx) => {
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
              {timberPrimeBranch != undefined && (
                <List>
                  <ListItem itemDivider>
                    <Row>
                      <Col size={2}>
                        <Label style={globalStyles.labelBold}>Lot Number</Label>
                      </Col>
                      <Col size={1.5}>
                        <Label style={globalStyles.labelBold}>Vol. (cft)</Label>
                      </Col>
                      <Col size={0.5}>
                        <Label />
                      </Col>
                    </Row>
                  </ListItem>

                  {branchLotList.map((rowData, idx) => (
                    <ListItem key={idx}>
                      <Row
                        onPress={() => {
                          getBranchLotDetail(rowData.name);
                          setBranchWiseLotDetailModal(true);
                          setBranchWiseLotNumber(rowData.name);
                        }}>
                        <Col size={2}>
                          <Text>{rowData.name}</Text>
                        </Col>
                        <Col size={3}>
                          <Text>{rowData.total_volume}</Text>
                        </Col>
                      </Row>
                      <Right style={{marginRight: -15}}>
                        <Icon
                          style={{color: '#14a0f9'}}
                          onPress={() => {
                            getBranchLotDetail(rowData.name);
                            setBranchWiseLotDetailModal(true);
                            setBranchWiseLotNumber(rowData.name);
                          }}
                          type="SimpleLineIcons"
                          name="info"
                        />
                      </Right>
                    </ListItem>
                  ))}
                </List>
              )}
              <Container
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  maxHeight: 'auto',
                }}>
                <Button
                  block
                  info
                  iconLeft
                  style={([globalStyles.mb10], {marginTop: 6})}
                  onPress={() => {
                    setBranchWiseLotModal(false);
                    setTimberPrimeBranch(undefined);
                  }}>
                  <Icon name="arrow-round-back" />
                  <Text>Back</Text>
                </Button>
              </Container>
            </Content>
          </Modal>

          {/* modal to show branch wise lot details to customers for information */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={branchWiseLotDetailModal}
            onRequestClose={() => {
              setBranchWiseLotDetailModal(false);
            }}>
            <View style={{backgroundColor: '#000000aa', flex: 1}}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  margin: 15,
                  padding: 10,
                  borderRadius: 10,
                  flex: 1,
                }}>
                <Label style={globalStyles.termsText}>
                  Lot detail for {branchWiseLotNumber}
                </Label>
                <ScrollView>
                  <Content>
                    <Row style={{paddingBottom: 10}} />
                    {branchWiseLotDetail.length > 0 ? (
                      branchWiseLotDetail.map((item, idx) => (
                        <Card style={globalStyles.p8}>
                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Item Name :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.item_name}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>
                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Item Sub Group :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.item_sub_group}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>
                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Timber Class :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.timber_class}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          {/* <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Discount Amt/cft :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {'Nu. ' + commaNumber(item.discount_amount)}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem> */}

                          {/* <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Rate :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {'Nu. ' + commaNumber(item.rate)}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem> */}

                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Volume :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.total_volume}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Pieces :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {item.total_pieces}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem>

                          {/* <ListItem last>
                            <Row>
                              <Col size={3.3}>
                                <Label>Amount :</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{alignSelf: 'flex-start'}}>
                                  {'Nu. ' + commaNumber(item.amount.toFixed(2))}
                                </Text>
                              </Col>
                            </Row>
                          </ListItem> */}
                        </Card>
                      ))
                    ) : (
                      <Fragment />
                    )}
                  </Content>
                </ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    padding: 10,
                  }}>
                  <Form>
                    <Button
                      block
                      danger
                      iconLeft
                      style={globalStyles.mb10}
                      onPress={() => setBranchWiseLotDetailModal(false)}>
                      <Text>Close</Text>
                    </Button>
                  </Form>
                </View>
              </View>
            </View>
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
)(TimberOrderDetail);
