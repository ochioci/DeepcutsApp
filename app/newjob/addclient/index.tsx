import {Button, SafeAreaView, Text, TextInput, View} from "react-native";
import {Link, useNavigation} from "expo-router";
import * as SQLite from 'expo-sqlite';
import {useRef, useState} from "react"
export default function Index() {
    const db = SQLite.openDatabaseSync('jobs.db');
    db.execSync(`
CREATE TABLE IF NOT EXISTS Clients (id INTEGER PRIMARY KEY NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, isDeleted INTEGER DEFAULT 0);
`);

    // @ts-ignore
    const firstName = useRef("")
    const lastName = useRef("")
    const address = useRef("")
    const phone = useRef("")
    const [reqState, reqStateHook] = useState("")
    const addClientToDB = () => {
        db.getAllSync(` INSERT INTO Clients (firstName, lastName, phone, address) VALUES (?, ?, ?, ?)  `, [firstName.current, lastName.current, phone.current, address.current])
        navigation.navigate("index")
    }
    const navigation = useNavigation()
    const inputStyle = {
        borderWidth: 1,
        borderStyle: "solid",
        fontSize: 25,
        fontWeight: 400,
        margin: 2,
        padding: 4,
        borderRadius: 3,
        width: "90%",
    }
    return (
        <SafeAreaView
            style={{
                alignItems: "center",
                width: "max-content",
                justifyContent: "space-between",
            }}
        >
            <Text
                style={{
                    fontSize: 35,
                    fontWeight: 800,
                }}
            >Add a Client
            </Text>
            <View style={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "65%"
            }}>
                <Text style={{fontWeight: "600", fontSize: 20}}>First Name</Text>
                <TextInput
                    onChangeText={(txt) => {
                        firstName.current = txt;
                        reqStateHook("")
                    }}
                    placeholder=""
                    style={inputStyle}
                />
                <Text style={{fontWeight: "600", fontSize: 20}}>Last Name</Text>
                <TextInput
                    onChangeText={(txt) => {
                        lastName.current = txt;
                        reqStateHook("")
                    }} placeholder=""
                    style={inputStyle}
                />
                <Text style={{fontWeight: "600", fontSize: 20}}>Address</Text>
                <TextInput
                    onChangeText={(txt) => {
                        address.current = txt;
                        reqStateHook("")
                    }} placeholder=""
                    style={inputStyle}

                />
                <Text style={{fontWeight: "600", fontSize: 20}}>Phone</Text>
                <TextInput
                    onChangeText={(txt) => {
                        phone.current = txt;
                        reqStateHook("")
                    }} placeholder=""
                    style={inputStyle}

                />
            </View>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%"}}>
                <Button onPress={addClientToDB}
                        title={"Add client"}
                />
                <Button onPress={() => {navigation.navigate("index")}}
                        title={"Cancel"}
                />
            </View>



        </SafeAreaView>
    );
}
