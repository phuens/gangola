import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    Container, Content, Form, Item, Input, Body, Card, CardItem,
    Right, Icon, H3, Col, Row, Picker, Button, View, Text, Left, Label
} from 'native-base';

import {
    Modal, StyleSheet, TouchableHighlight, RefreshControl, SafeAreaView, ScrollView
} from 'react-native';

import SpinnerScreen from '../../../base/SpinnerScreen';
import { callAxios, setLoading, handleError } from '../../../../redux/actions/commonActions';
import globalStyles from '../../../../styles/globalStyle';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import Config from 'react-native-config';


export const TimberVehicleRegistration = ({
    userState, commonState, navigation, setLoading, handleError,
}) => {
    //state info for forms
    let [, setState] = useState();
    const [errorMsg, setErrorMsg] = useState('');
    const [vehicleList, setVehicleList] = useState([]);
    const [vehicle_no, setVehicle_no] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [vehicle_owner, setvehicle_owner] = useState(undefined);
    const [vehicle_capacity, setVehicle_capacity] = useState(undefined);
    const [drivers_name, setdrivers_name] = useState('');
    const [contact_no, setcontact_no] = useState('');
    const [driver_cid, setdriver_cid] = useState('');

    //all values
    const [all_capacities, setall_capacities] = useState([]);

    useEffect(() => {
        if (!userState.logged_in) {
            navigation.navigate('Auth');
        } else if (!userState.profile_verified) {
            navigation.navigate('UserDetail');
        } else {
            // setLoading(true);
            getActiveVehciles();
        }
    });

    //show modal function
    const showVehicleRegistrationModal = async () => {
        setModalVisible(true);
    };

    // Submit Vehicle Detail
    const submitVehicleInfo = async () => {
        const site_info = {
            approval_status: 'Pending',
            user: userState.login_id,
            self_arranged: 1,
            vehicle_no: vehicle_no.toUpperCase(),
            vehicle_capacity,
            owner: vehicle_owner,
            owner_cid: vehicle_owner == 'Self' ? userState.login_id : driver_cid,
            drivers_name,
            contact_no,
        };
        setModalVisible(!modalVisible);
    };
    // Get Registered Vehicle

    const getActiveVehciles = async () => {
        const params = {
            fields: JSON.stringify([
                'name',
                'vehicle_capacity',
                'vehicle_no',
                'drivers_name',
                'contact_no',
                'approval_status',
            ]),
            filters: JSON.stringify([
                ['user', '=', userState.login_id],
                ['self_arranged', '=', 1],
                ['approval_status', '!=', 'Deregistered'],
            ]),
        };

        try {
            const response = await callAxios(
                `resource/Transport Request?order_by=creation desc,approval_status asc&fields=["name", "vehicle_capacity","vehicle_no","drivers_name","contact_no","approval_status"]&filters=[["user","=",${userState.login_id
                }], ["self_arranged", "=", 1],["approval_status", "!=", "Deregistered"],["docstatus", "=", 1]]`,
            );
            setVehicleList(response.data.data);
            // setLoading(false);
        } catch (error) {
            handleError(error);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <Card style={globalStyles.card}>
                <CardItem
                    header
                    bordered
                    button
                    onPress={() => navigation.navigate('VehicleDetail', { id: item.name })}
                    style={globalStyles.cardHeader}>
                    <Left>
                        <Icon name="file-document-edit" type="MaterialCommunityIcons" style={{ color: 'white' }} />

                        {item.approval_status === 'Pending' ? (
                            <Label style={{ color: 'red', fontWeight: "bold" }}> {item.vehicle_no}</Label>
                        ) : (
                                <Label style={{ color: 'white', fontWeight: "bold" }}> {item.vehicle_no}</Label>
                            )}
                    </Left>

                    <Right>
                        <Icon name="ios-arrow-dropright" style={globalStyles.icon} />
                    </Right>
                </CardItem>
                <CardItem>
                    <View>
                        <Label >Vehicle Capacity:
                        <Label style={globalStyles.listInnerLabel}> {item.vehicle_capacity} m3</Label>
                        </Label>
                        <Label >Status:
                        <Label style={globalStyles.listInnerLabel}> {item.approval_status}</Label>
                        </Label>
                    </View>
                </CardItem>
                <CardItem>

                </CardItem>
            </Card>
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
                    <Icon
                        name="add-to-list"
                        type="Entypo"
                    />
                </Button>
                <ScrollView>
                    <Content>
                        <Modal
                            animationType="slide"
                            presentationStyle="pageSheet"
                            transparent={false}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        ><Content style={globalStyles.content}>
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

                                <View style={globalStyles.dropdown}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={vehicle_owner}
                                        onValueChange={val => setvehicle_owner(val)}>
                                        <Picker.Item
                                            label={'Select Vehicle Owner'}
                                            value={undefined}
                                            key={0}
                                        />
                                        <Picker.Item label={'Self'} value={'Self'} key={1} />
                                        <Picker.Item label={'Other'} value={'Other'} key={2} />
                                    </Picker>
                                </View>

                                <View style={globalStyles.dropdown}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={vehicle_capacity}
                                        onValueChange={val => setVehicle_capacity(val)}>
                                        <Picker.Item
                                            label={'Select Vehicle Capacity'}
                                            value={undefined}
                                            key={-1}
                                        />
                                        {all_capacities &&
                                            all_capacities.map((pur, idx) => {
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
                                <View style={{ marginBottom: 20 }} />

                                <Container
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        maxHeight: 50,
                                    }}>
                                    <Button success onPress={submitVehicleInfo}>
                                        <Text>Submit</Text>
                                    </Button>
                                    <Button danger onPress={() => setModalVisible(!modalVisible)}>
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
                        <View style={{ marginBottom: 10 }} />

                        {vehicleList.length > 0 ? (
                            <FlatList
                                data={vehicleList}
                                renderItem={renderItem}
                                keyExtractor={item => item.name}
                            />
                        ) : (
                                <Text style={globalStyles.emptyString}>No registered Vehicle</Text>
                            )}
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
    setLoading,
    handleError,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TimberVehicleRegistration);
