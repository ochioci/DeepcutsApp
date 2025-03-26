import {useSQLiteContext} from "expo-sqlite";
import {Modal, View, Text, SafeAreaView, StyleSheet, FlatList, Button} from "react-native";
import {ClientView} from "../../newjob"
import {useState} from "react";
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    baseText: {
        fontSize: 20,
    },
    titleText: {
        fontSize: 35,
        fontWeight: '800',
    },
    listEntry: {
        fontSize: 20,
        borderBottomWidth: 1,
    },
    subtitleText: {
        fontSize: 25,
        fontWeight: '600'
    }
});
export default function ClientSelect() {
    const db = useSQLiteContext(useSQLiteContext);
    const clients = db.getAllSync(`SELECT * FROM Clients`)
    return <SafeAreaView>
            <View style={{display: "flex", alignItems: "center", width: "100%"}}>
                {/*<Text style={styles.titleText}>Select a Client</Text>*/}
                <FlatList style={{width: "100%"}} data={clients} renderItem={({item}) => {return <ClientView onPress={() => {}} item={item} deleteClient={() => {}} isDelete={false}></ClientView>}}/>
            </View>
    </SafeAreaView>
}

