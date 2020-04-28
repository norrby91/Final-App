import { StyleSheet, PixelRatio } from 'react-native';
export const styles = StyleSheet.create({
  Headings: {
    fontSize: 45 / PixelRatio.getFontScale(),
    fontFamily: "Signatra",
    color:"#fff",
    textAlign:"center",
    marginTop: 0,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: '#333'
  },

  pageTitle: {
    fontSize: 30 / PixelRatio.getFontScale(),
    fontFamily: "Signatra",
    color:"#fff",
    textAlign:"center",
    marginTop: 0
  },

  InputArea: {
    padding: 10
  },

  Input: {
    marginBottom: 15,
  },

  Container: {
    flex: 1,
    backgroundColor:'#271033'
  },

  Header: {
    height: 200,
    borderBottomWidth: 60,
    borderBottomColor: 'transparent', 
    borderLeftWidth: 800, 
    borderLeftColor: '#4B338B'
  },

  HeaderItems:{
    position:"absolute",
    top:20,
    zIndex:5,
    alignItems:"center",
    width:"100%" 
  },
 
  Logo: {
    marginTop:25,
    height: 110,
    width: 110,
    borderWidth:3,
    borderColor:"#fff",
    borderRadius:60,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  textItem:{
    marginTop:20,
    flex:1,
    borderColor:"transparent"
  },

  inputText:{
    flex:1,
    height:40,
    fontSize:12 / PixelRatio.getFontScale(),
    fontWeight:"bold"

  },

  inputWrapper:{
    overflow:'hidden',
    borderRadius:5,
    height:40,
    flexDirection:"row",
    backgroundColor:'rgba(255,255,255,0.9)'
  },

  checklabel:{
    flex: 1,
    flexWrap: 'wrap',
    fontSize:12 / PixelRatio.getFontScale(),
    fontWeight:"bold",
    color:"#fff",
  },

  authActionButtonStyle: {
    fontSize:12 / PixelRatio.getFontScale(),
    fontWeight: "bold",
    color:"#212121"
  },

  authOptionsTextStyle:{
    fontSize:12 / PixelRatio.getFontScale(),
    fontWeight: "bold",
    color:"#F1F1F1"
  }

});