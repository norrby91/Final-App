// this page contains all routes for the application 
//add new screens to stacks to see them in the application 


import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'


//screen imports
import HomeScreen from '../Screens/HomeScreen'
import RegisterScreen from '../Screens/RegisterScreen';
import MyAccount from '../Screens/MyAccount'
import LoginScreen from '../Screens/LoginScreen';


import Menus from '../Screens/Menus';
import OrderMenu from '../Screens/OrderMenu';


import LoadingScreen from '../Components/Loading'
import AddMenuItem from '../Screens/AddMenuItem';
import ViewMenuItems from '../Screens/ViewMenuItems'

import AddDriver from '../Screens/AddDriver';
import ViewDriver from '../Screens/ViewDriver';
import DriverDetails from '../Screens/DriverDetails';

import OrderDetails from '../Screens/OrderDetails';
import CheckOut from '../Screens/CheckOutScreen';

import { createDrawerNavigator } from 'react-navigation-drawer';



import Icon from 'react-native-vector-icons/Ionicons';

import AuthLoadingScreen from '../Screens/authLoadingScreen';
import PublicSideBar from '../Components/public/sidebarComponent';
import OrderScreen from '../Screens/OrderScreen';
import PublicOrderSuccess from '../Screens/publicOrderSuccess'

import CafeLatestOrder from '../Screens/cafeLatestOrderScreen';
import CafeOrder from '../Screens/cafeOrderScreen';

import CafeSideBar from '../Components/public/cafeSidebarComponent';

import DriverSideBar from '../Components/public/driverSidebarComponent';
import OrderDetailScreen from '../Screens/OrderDetailScreen';


// disable yellow warning box 
console.disableYellowBox = true

/*********************************PUBLIC SCREEN****************************/
const menuStackNavigator = createStackNavigator({
  Home: { screen: Menus },
  OrderMenu: { screen: OrderMenu },
  OrderDetails: { screen: OrderDetails },
  CheckOut: { screen: CheckOut },
  OrderSuccess: { screen: PublicOrderSuccess }
},
  {
    header: null,
    headerMode: 'none'
  }
)

const publicOrderStackNavigator = createStackNavigator({
  Orders: { screen: OrderScreen },
  OrderDetail: { screen: OrderDetailScreen }
},
  {
    header: null,
    headerMode: 'none'
  }
)

const publicAccountStackNavigator = createStackNavigator({
  MyAccount: { screen: MyAccount },
},
  {
    header: null,
    headerMode: 'none'
  }
)

const PublicDrawerNavigation = createDrawerNavigator({
  Menus: { screen: menuStackNavigator },
  Orders: { screen: publicOrderStackNavigator },
  MyAccount: { screen: publicAccountStackNavigator }
},
  {
    contentComponent: PublicSideBar,
  });

/*********************************PUBLIC SCREEN****************************/

/*********************************CAFE SCREEN****************************/


const cafeLatestOrderStackNavigator = createStackNavigator({
  Orders: { screen: CafeLatestOrder },
  OrderDetail: { screen: OrderDetailScreen }
},
  {
    header: null,
    headerMode: 'none'
  }
)

const cafeOrderStackNavigator = createStackNavigator({
  Orders: { screen: CafeOrder },
  OrderDetail: { screen: OrderDetailScreen }
},
  {
    header: null,
    headerMode: 'none'
  }
)


const CafeMenuStackNavigator = createStackNavigator({
  Menus: { screen: ViewMenuItems },
  MenuForm: { screen: AddMenuItem }
},
  {
    header: null,
    headerMode: 'none'
  }
)

const CafeDriverStackNavigator = createStackNavigator({
  Drivers: { screen: ViewDriver },
  DriverForm: { screen: AddDriver },
  DriverDetails: { screen: DriverDetails }
},
  {
    header: null,
    headerMode: 'none'
  }
)

const CafeDrawerNavigation = createDrawerNavigator({
  // Home: { screen: menuStackNavigator },
  Home: { screen: cafeLatestOrderStackNavigator },
  CafeOrders: { screen: cafeOrderStackNavigator },
  Menus: { screen: CafeMenuStackNavigator },
  Drivers: { screen: CafeDriverStackNavigator },
  MyAccount: { screen: publicAccountStackNavigator }
},
  {
    contentComponent: CafeSideBar,
    // drawerType: 'back',
    // edgeWidth: 0
  });

/*********************************CAFE SCREEN****************************/



/*********************************DRIVER SCREEN****************************/


const driverLatestOrderStackNavigator = createStackNavigator({
  Orders: { screen: CafeLatestOrder },
  OrderDetail: { screen: OrderDetailScreen }
},
  {
    header: null,
    headerMode: 'none'
  }
)

const driverOrderStackNavigator = createStackNavigator({
  Orders: { screen: CafeOrder },
  OrderDetail: { screen: OrderDetailScreen }
},
  {
    header: null,
    headerMode: 'none'
  }
)

const DriverDrawerNavigation = createDrawerNavigator({
  // Home: { screen: menuStackNavigator },
  Home: { screen: driverLatestOrderStackNavigator },
  DriverOrders: { screen: driverOrderStackNavigator },
  MyAccount: { screen: publicAccountStackNavigator }
},
  {
    contentComponent: DriverSideBar,
    // drawerType: 'back',
    // edgeWidth: 0
  });

/*********************************DRIVER SCREEN****************************/


const authStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },

},
  {
    header: null,
    headerMode: 'none'
  })

const navigator = createStackNavigator({
  Home: HomeScreen,
  
  AddMenuItem: AddMenuItem,
  LoadingScreen: LoadingScreen,

  AddDriver: AddDriver,
  ViewDriver: ViewDriver,
  ViewMenuItems: ViewMenuItems,
 


});

// EXPORT APP CONTAINNER AND SWITCH NAVIGATOR
export default createAppContainer(
  (
    createSwitchNavigator({
      AuthLoading: AuthLoadingScreen,
      Auth: authStackNavigator,
      Public: PublicDrawerNavigation,
      Cafe: CafeDrawerNavigation,
      Driver: DriverDrawerNavigation
    },
      {
        // initalRouteName: "AuthLoading",
      }
    )
  )
);
