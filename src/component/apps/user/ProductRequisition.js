import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';

import {
    Container, Form, Item, Input, Button, Text, Content, Picker, Label, CardItem
} from 'native-base';
import SpinnerScreen from '../../base/SpinnerScreen';
import { callAxios, handleError, setLoading, showToast } from '../../../redux/actions/commonActions';
import globalStyles from '../../../styles/globalStyle';

export const ProductRequisition = ({
    userState,
    commonState,
    showToast,
    navigation
}) => {

    //state info for forms
    let [, setState] = useState();
    const [productCategory, setProductCategory] = useState(undefined);
    const [item, setItem] = useState(undefined);
    const [qty, setQty] = useState(undefined);
    const [uom, setUom] = useState(undefined);
    const [itemName, setItemName] = useState(undefined);
    const [postingDate, setPostingDate] = useState(undefined);

    const [allProductCategoryList, setAllProductCategoryList] = useState([]);
    const [allItemList, setAllItemList] = useState([]);

    useEffect(() => {
        if (!userState.logged_in) {
            navigation.navigate('Auth');
        } else if (!userState.profile_verified) {
            navigation.navigate('UserDetail');
        } else {
            setLoading(true);
            getProductCategoryList();
        }
    });

    const submitRequisitionInfo = async () => {
        if (productCategory == '' || productCategory == undefined) {
            showToast("Product is required.");
        } else if (item == '' || item == undefined) {
            showToast("Item is required.");
        } else if (qty == '' || qty == undefined) {
            showToast("Qty is required.");
        } else {

            const productRequsitionDetail = {
                customer_id: userState.login_id,
                product_category: productCategory,
                item: item.substring(0, item.indexOf(":")),
                item_name: itemName,
                uom: uom,
                qty: qty
            }

            try {
                const result = await callAxios(
                    'resource/CRM Product Requisition/',
                    'POST',
                    null,
                    productRequsitionDetail,
                );

                showToast('Your request submited successfully', 'success');
                setQty(undefined);
                setItem(undefined);
                setProductCategory(undefined);
                setLoading(false);
            } catch (error) {
                dispatch(handleError(error));
            }
        }
    }

    const getProductCategoryList = async () => {
        try {
            const all_product_list = await callAxios(
                `resource/Product Category`,
                'get',
            );
            setAllProductCategoryList(all_product_list.data.data);
            setLoading(false);
        } catch (error) {
            handleError(error);
        }
    };

    const getAllItemByProductCategoryId = async (productCategory) => {
        try {
            const all_itmes = await callAxios(
                `method/erpnext.crm_utils.get_pc_items`,
                'post',
                {
                    product_category: productCategory
                }
            );
            setAllItemList(all_itmes.data.message);
            setLoading(false);
        } catch (error) {
            handleError(error);
        }
    };

    const getItemUomByItemCode = async (itemCode) => {
        try {
            const item_detail = await callAxios(
                `method/erpnext.crm_utils.get_pc_items`,
                'post',
                {
                    item: itemCode.substring(0, itemCode.indexOf(":"))
                }
            );
            setUom(item_detail.data.message[0].stock_uom);
            setItemName(item_detail.data.message[0].item_name);
            setLoading(false);
        } catch (error) {
            handleError(error);
        }
    };

    return commonState.isLoading ? (
        <SpinnerScreen />
    ) : (
            <Container>
                <Content>
                    <CardItem>
                        <Form style={{ width: '100%' }}>
                            <View style={globalStyles.dropdown}>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={productCategory}
                                    onValueChange={val => {
                                        setItem(undefined);
                                        setQty(undefined);
                                        setProductCategory(val);
                                        getAllItemByProductCategoryId(val);
                                    }}>
                                    <Picker.Item
                                        label={'Select Product'}
                                        value={undefined}
                                        key={-1}
                                    />
                                    {allProductCategoryList &&
                                        allProductCategoryList.map((val, idx) => {
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
                                    selectedValue={item}
                                    onValueChange={(val, index) => {
                                        setItem(val);
                                        setQty(undefined);
                                        getItemUomByItemCode(val);
                                    }
                                    }>
                                    <Picker.Item
                                        label={'Select Item'}
                                        value={item}
                                        key={-1}
                                    />
                                    {allItemList &&
                                        allItemList.map((val, idx) => {
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

                            {item && item != undefined ? (
                                <Fragment>
                                    <View style={globalStyles.dropdown}>
                                        <Input disabled value={"Uom : " + uom} />
                                    </View>
                                </Fragment>
                            ) : (<Fragment />)}

                            <Item regular style={globalStyles.mb10}>
                                <Input
                                    value={qty}
                                    placeholder="Requisition Qty"
                                    keyboardType={'numeric'}
                                    onChangeText={
                                        val => {
                                            setQty(val);
                                        }
                                    }
                                />
                            </Item>
                            <Button success onPress={submitRequisitionInfo} style={globalStyles.mb50} >
                                <Text>Submit Requisition Detail</Text>
                            </Button>
                        </Form>
                    </CardItem>
                </Content>
            </Container >
        );
};

const mapStateToProps = state => ({
    userState: state.userState,
    commonState: state.commonState
});

const mapDispatchToProps = {
    handleError,
    showToast
};

export default connect(mapStateToProps, mapDispatchToProps,)(ProductRequisition);
