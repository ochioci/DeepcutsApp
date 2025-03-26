import {Button, FlatList, Text, View, StyleSheet, Pressable, SafeAreaView} from "react-native";
import {Link, useFocusEffect, useNavigation} from "expo-router";
import React, {Suspense, useEffect, useRef, useState} from "react";
import * as SQLite from 'expo-sqlite';
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import {useIsFocused} from "@react-navigation/core";
export default function Index() {

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

    const db = SQLite.openDatabaseSync('jobs');
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const [isDeleteMode, setDeleteMode] = useState(false)
    const toggleDeleteMode = () => {
        setDeleteMode(!isDeleteMode)
    }


    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={styles.titleText}>New Job</Text>
            <Text style={styles.subtitleText}>Select a Client</Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <Button
                    title={"Edit Client List"}
                    onPress={toggleDeleteMode}
                />
                <Button
                    title={"Add new client"}
                    onPress={() => {
                        navigation.navigate("addclient/index")
                    }}
                />
            </View>
            {/*<Text style={styles.titleText}>{clients}</Text>*/}
            <ClientList isDelete ={isDeleteMode}></ClientList>


        </SafeAreaView>
    );
}


// @ts-ignore
function ClientList({isDelete}) {
    const db = useSQLiteContext();
    db.execSync(`
CREATE TABLE IF NOT EXISTS Clients (id INTEGER PRIMARY KEY NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, isDeleted INTEGER DEFAULT 0);
`);
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    console.log('getting clients')
    let clients = db.getAllSync(`SELECT * FROM Clients WHERE isDeleted=0`,[]);
    const [s,sset] = useState(false)
    const deleteClient = (id) => {
        // db.getAllSync(`DELETE FROM Clients WHERE id=?`, [id]);
        db.getAllSync(`UPDATE Clients SET isDeleted=1 WHERE id=?`, [id])
        sset(!s)
    }

    return <FlatList
        style={{
            width: "100%",
            borderTopWidth: 1,
            borderBottomWidth: 1,
        }}
        data={clients}
        ItemSeparatorComponent={() => <View style={{height: 0,borderBottomWidth: 1,
        }} />}

        renderItem={({item}) => <ClientView item={item} isDelete={isDelete} deleteClient={deleteClient} onPress={() => {
            navigation.push("dojob/index", {
                screen: "dojob/index",
                clientID: item.id,
            })
        }}></ClientView>}

        keyExtractor={(item) => item.id}
    />
}


export function ClientView({item, isDelete, deleteClient, onPress}) {
    const navigation = useNavigation()
    if (!item) return null
    const style = {
        display: "flex",
        alignItems: "left",
        borderColor: "black",
        borderWidth: 2,
        padding: 10,
        margin: 10,
        borderRadius: 5,
        width: "auto"
    }

    return <View style={style}>
        <Pressable onPress={
            onPress
        }>
            <Text style={{
                fontSize: 25,
                fontWeight: 600
            }}>{item.firstName} {item.lastName}</Text>
            <View style={{display: "flex", flexDirection: "row"}}>
                <Text style={{marginRight: 15}}>{item.phone}</Text>
                <Text style={{marginRight: 15}}>{item.address}</Text>
                <Text style={{marginRight: 15}}>#{item.id}</Text>
                {item.isDeleted ? <Text style={{marginRight: 15}}>DELETED</Text> : null}
                {/*<Text style={{marginRight: 15}}>{(item.beforeScore.toFixed(2) )+ "→" + item.afterScore.toFixed(2)}</Text>*/}
                {/*<Text style={{marginRight: 15}}>{item.angle}°</Text>*/}
                {/*<Text style={{marginRight: 15}}>{item.length.toFixed(2)} in</Text>*/}
                {/*<Text style={{marginRight: 15 }}>#{item.taskID}</Text>*/}
            </View>
        </Pressable>

        {isDelete ? <Button title={"Delete"} onPress={() => {deleteClient(item.id)}}/> : null}


    </View>
}
