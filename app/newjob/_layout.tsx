import { Stack, Tabs } from "expo-router";
import {createContext} from "react";
import {SQLiteProvider} from "expo-sqlite";
const dataContext = createContext(null)

export default function RootLayout() {
    return<SQLiteProvider databaseName={"jobs.db"}>
        <Stack>
            <Stack.Screen name={"index"} options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
            <Stack.Screen name={"dojob/index"} initialParams={{id: 0}} options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
            <Stack.Screen name={"addclient/index"} options={{headerShown: false, gestureEnabled: false}} ></Stack.Screen>
            <Stack.Screen name={"dojob/addtask/index"} options={{headerShown: false, gestureEnabled: false}}></Stack.Screen>
        </Stack>
    </SQLiteProvider>

}
