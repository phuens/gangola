import { StyleSheet, Dimensions } from 'react-native';
import Config from 'react-native-config';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  content: {
    padding: 15,
    paddingTop: 15,
    paddingBottom: 70,
  },

  listContent: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },

  ma15: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  mb10: {
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 5,

  },

  mb10BGGrayOut: {
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 5,
    backgroundColor: 'lightgray'
  },

  mb30: {
    borderRadius: 25,
    marginBottom: 30,
    marginTop: 5,
    paddingLeft: 5,
  },

  mb11: {
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 5,
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    maxHeight: 50,
  },

  icon: {
    color: Config.ICON_COLOR,
  },

  iconText: {
    fontWeight: 'bold',
    color: Config.ICON_COLOR,
    fontSize: 8
  },
  iconTextFooter: {
    fontWeight: 'bold',
    color: Config.ICON_COLOR,
    fontSize: 9,
  },

  mb50: {
    marginBottom: 51,
  },

  mapcontainer: {
    width: 400,
    height: 300,
    justifyContent: 'space-around',
    alignSelf: 'center',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  cidContainer: {
    width: 400,
    height: 200,
    marginBottom: 15,
  },

  homeButton: {
    justifyContent: 'space-evenly',
    borderWidth: 0.5,
    borderColor: Config.APP_HEADER_COLOR,
  },

  tableHeader: {
    backgroundColor: '#5cb85c',
  },

  card: {
    borderRadius: 5,

  },
  p8: {
    padding: 10,

  },

  listLabel: {
    fontSize: 14,
    color: 'darkgray',
  },
  listLabel: {
    fontSize: 14,
    color: 'darkgray',
  },

  listInnerLabel: {
    fontSize: 15,
    fontWeight: "bold"
  },

  cardHeader: {
    backgroundColor: '#5cb85c',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: 5
  },

  tableHeaderText: {
    color: '#ffffff',
    paddingLeft: 4,
    fontWeight: "bold",
    alignSelf: "center",
  },

  homeIcon: {
    color: "#4f9b22",
    fontSize: 20,
  },
  headingText: {
    color: Config.APP_HEADER_COLOR,
    fontSize: 27,
  },
  termsText: {
    color: Config.APP_HEADER_COLOR,
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'justify'
  },


  modeIcon: {
    color: Config.APP_HEADER_COLOR,
    fontSize: 90,
  },

  smallIcon: {
    color: Config.APP_HEADER_COLOR,
    fontSize: 20,
    paddingRight: 10,
  },

  homeIconText: {
    fontWeight: 'bold',
    color: Config.APP_HEADER_COLOR,
    textTransform: 'capitalize',
    textAlign: 'center'
  },

  siteCol: { borderRightWidth: 0.2, borderColor: 'white' },

  siteItem: {
    fontSize: 13,
    padding: 1,
  },

  emptyString: { alignSelf: 'center', color: 'red', fontSize: 25 },

  center: { alignSelf: 'center' },

  labelContainer: {
    marginBottom: 10,
  },

  labelBold: {
    fontWeight: 'bold',
  },

  lb: {
    fontWeight: 'bold',
  },

  tableContainer: {
    marginBottom: 10,
    borderWidth: 0.5,
    // paddingLeft:4
  },

  materialContainer: {
    marginBottom: 10,
  },

  tableHeaderContainer: {
    borderWidth: 0.2,
    backgroundColor: Config.TABLE_HEADER_COLOR,
    color: "white",
    fontWeight: "bold"
  },

  rowContainer: {
    borderWidth: 0.2,
    alignContent: 'center',
    backgroundColor: "rgb(255, 255, 230)"
  },

  colContainer: {
    borderRightWidth: 0.5,
    paddingLeft: 3,
  },

  modal: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: Dimensions.get('window').width * 0.9,
    marginHorizontal: Dimensions.get('window').width * 0.05,
    // marginTop: Dimensions.get('window').height * 0.1,
    // marginBottom: Dimensions.get('window').height * 0.1,
  },

  modalButtonContainer: {
    justifyContent: 'space-between',
  },

  // label:{
  //   color: 'white',
  // },

  itemButton: { width: '45%', justifyContent: 'center' },
  button: { justifyContent: 'center' },
  moneyFormat: {
    marginRight: -50,
  },

  fieldSet: {
    margin: 10,
    paddingBottom: 10,
    paddingTop: 15,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: 'grey',
  },

  legend: {
    position: 'absolute',
    top: -10,
    left: 10,
    color: 'grey',
    fontWeight: 'bold',
    backgroundColor: '#FFFFFF',
  },
  dialogueInput: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'grey',
    padding: 5,
  },

  errorMsg: {
    fontStyle: 'italic',
    color: 'red',
    paddingLeft: 10,
  },

  italicFont: {
    fontStyle: 'italic',
  },

  tapRegion: {
    paddingTop: 7,
    color: Config.APP_HEADER_COLOR,
  },

  dropdown: {
    marginBottom: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 6
  },

  dropdownDialog: {
    marginBottom: 0,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 0,
  },

  drawerIcon: {
    color: Config.APP_HEADER_COLOR,
    fontSize: 30,
  },
  paragraphAlignment: {
    color: "black",
    textAlign: 'justify',
  },

  modalView: {
    position: "relative",
    bottom: 2,
    width: "80%",
    height: "90%",
    alignSelf: "center"
  },
  // bMenu:{backgroundColor: "#fb6600", borderRadius: 30 }
  // bMenu: { backgroundColor: "#4f9b22", borderRadius: 30 },
  bMenu: { backgroundColor: "#008000", borderRadius: 30, height: 58, padding: 5 },
  iconLeft: { fontSize: 45, color: "#ffffff" },
  iconRight: { fontSize: 45, color: "#ffffff" },
  menuText: { color: "#ffffff", fontSize: 17, fontWeight: 'bold' }
});
