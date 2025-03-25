import { Stack, Tabs } from "expo-router";
import {createContext} from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import {SQLiteProvider} from "expo-sqlite";
// import {SvgUri} from "react-native-svg"
// import HOMESVG from "./icons/home.svg"
const dataContext = createContext(null)

const providerScreen = (Provider, Component) => (props) => (
    <Provider>
      <Component {...props} />
    </Provider>
)



export default function RootLayout() {
  return <Tabs>
          <Tabs.Screen name={"index"} options={{
              headerShown: false,
              tabBarLabel: "Home",
              tabBarIcon: ({color}) => {return <Ionicons name="home" size={24} color={color} />}
          }}></Tabs.Screen>
          <Tabs.Screen name={"newjob"} options={{
              headerShown: false,
              tabBarLabel: "New Job",
              tabBarIcon: ({color}) => {return <Ionicons name="add-circle" size={24} color={color} />}
          }}></Tabs.Screen>
          <Tabs.Screen name={"myjobs/index"} options={{
              headerShown: false,
              tabBarLabel: "My Jobs",
              tabBarIcon: ({color}) => {return <Ionicons name="clipboard" size={24} color={color} />}

          }}></Tabs.Screen>
          <Tabs.Screen name={"settings/index"} options={{headerShown: false, tabBarLabel: "Settings", href: null}}></Tabs.Screen>
      <Tabs.Screen name={"getreport"} options={{headerShown: false, tabBarLabel: "Settings", href: null}}></Tabs.Screen>

      <Tabs.Screen name={"browsedb"} options={{
          headerShown: false,
          tabBarLabel: "Database",
          tabBarIcon: ({color}) => {return <Ionicons name="book" size={24} color={color} />}

      }}></Tabs.Screen>
      </Tabs>


}
