import {Alert, Button, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {Link, useNavigation} from "expo-router";
import * as SQLite from 'expo-sqlite';
import { useRoute } from "@react-navigation/native";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import React, {useState} from "react";
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        fontSize: 35,
        fontWeight: '800',
    },
    headingText: {
        fontSize: 25,
        fontWeight: "600"
    }
});
export default function DoJob() {


    const navigation = useNavigation()

    //this is necessary to access the params given to this page
    const route = useRoute();
    // console.log(route.params)
    let clientID = route.params["clientID"]
    // console.log(clientID)
    const db = useSQLiteContext()
    // db.execSync(`DROP TABLE Jobs`)
    // db.execSync(`DROP TABLE Tasks`)
    db.execSync(`
CREATE TABLE IF NOT EXISTS Jobs (jobID INTEGER PRIMARY KEY NOT NULL, clientID INTEGER NOT NULL, taskIDs TEXT NOT NULL, status TEXT NOT NULL, startedAt INTEGER NOT NULL DEFAULT current_timestamp, finishedAt INTEGER);
`);
    db.execSync(
        `CREATE TABLE IF NOT EXISTS Tasks (taskID INTEGER PRIMARY KEY NOT NULL, jobID INTEGER NOT NULL, length INTEGER, brand TEXT, angle TEXT, beforeScore INTEGER, afterScore INTEGER, note TEXT)`
    )

    let hasAlreadyStartedJob = db.getAllSync(`SELECT * FROM Jobs WHERE clientID = ? AND (status = ? OR status = ?)`, [clientID, "started", "init"])
    if (hasAlreadyStartedJob.length == 0) {
        // console.log("starting new job")
        db.getAllSync(`INSERT INTO Jobs (clientID, taskIDs, status) VALUES (?,?,?)`, [clientID, "", "init"])
        console.log("init new job")
    } else {
        // console.log("Client already has job in progress with this client")
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%"
            }}
        >
            <Text style={styles.titleText}>Sharpening</Text>

                <ClientInfo clientID={route.params["clientID"]} db={db}></ClientInfo>
                <JobsInfo clientID={route.params["clientID"]} db={db}></JobsInfo>

        </SafeAreaView>
    );
}

function ClientInfo({clientID, db}) {

    let c = db.getFirstSync(`SELECT * FROM Clients WHERE id=${clientID}`);
    if (!c) {return null}
    return <View>
        <Text style={styles.headingText}>On behalf of {c.firstName} {c.lastName}</Text>
    </View>
}

export function JobsInfo({clientID, db, simplified=false, clientName="", jobID =-1}) {
    db.execSync(`CREATE TABLE IF NOT EXISTS Brands (brandID INTEGER PRIMARY KEY NOT NULL, brandName TEXT NOT NULL, isVisible BOOLEAN NOT NULL DEFAULT 1)`)
    if (jobID == -1) {
        jobID = db.getFirstSync(`SELECT jobID FROM Jobs WHERE clientID=? AND (status="started" OR status="init")`,[clientID]).jobID
    }
    let knives = db.getAllSync(`SELECT * FROM Tasks WHERE jobID = ?`, [jobID])
    let brands = db.getAllSync(`SELECT * FROM Brands`)
    // console.log("Knives in job: ", knives)
    console.log("Brands: ", brands)
    const navigator = useNavigation()
    const route = useRoute()
    const [isDeleteMode, setDeleteMode] = useState(false)
    const toggleDeleteMode = () => {
        setDeleteMode(!isDeleteMode)
    }
    const getBrand = (id) => {
        let b = brands.filter((item) => {
            return item.brandID == id
        })[0]
        console.log("id: ", id, "found brand: ", b)
        return b
    }
    const finalize = () => {
        console.log("finalizing job")
        db.getAllSync(`UPDATE Jobs SET status = ? WHERE jobID = ? AND clientID = ?`, ["finished", jobID, clientID])
        navigator.navigate("getreport", {screen:"index", params: {jobID: jobID, clientID:clientID}})
    }

    const confirmFinalize = () => {
        Alert.alert(
            "Confirm Finalization",
            "Are you sure you want to finalize this job?",
            [
                {text: "Yes", onPress: finalize},
                {text: "No"}
            ]
            )
    }
    // console.log("job id: ", jobID)
    return <SafeAreaView
    style={{width: "100%", display: "flex", alignItems: "center"}}>
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {!simplified ? <>
                <Button
                    title={"Add Knife"}
                    onPress={() => {navigator.navigate("dojob/addtask/index", {jobID: jobID, clientID: route.params["clientID"]})}}
                />
                <Button
                    title={"Change Client"}
                    onPress={() => {
                        navigator.navigate("index")
                    }}
                />
                <Button
                    title={"Remove a Knife"}
                    onPress={() => {
                        toggleDeleteMode()
                    }}
                />
                <Button
                    title={"Finalize Job"}
                    onPress={confirmFinalize}
                />
            </> : <Text style={styles.headingText}>{clientName}</Text>}

        </View>
        {/*<Text style={styles.headingText}>Activity</Text>*/}
        {knives.length == 0 ? <Text style={{fontSize: 20, fontWeight: 500}}>No knives yet</Text> : <FlatList
            style={{
                width: "100%",
                borderTopWidth: 1,
                borderBottomWidth: 1,
            }}
            data={knives}
            ItemSeparatorComponent={() => <View style={{height: 0, borderBottomWidth: 1,}} />}
            renderItem={({item}) => {
                return <KnifeView
                    item = {item}
                    brandInfo = {getBrand((item.brand))}
                    isDeleteMode={isDeleteMode}
                    setDeleteMode={setDeleteMode}
                ></KnifeView>
            }}
            keyExtractor={(item) => item.taskID}
        />}

    </SafeAreaView>
}

export function KnifeView({item, brandInfo, isDeleteMode, setDeleteMode}) {
    const db = useSQLiteContext()
    const deleteKnife = () => {
        db.getAllSync(`DELETE FROM Tasks WHERE taskID=?`, [item.taskID])
        setDeleteMode(false)
    }
    if (!brandInfo) {
        brandInfo = {
            brandName: "Unknown"
        }
    }
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
    console.log("brandinfo", brandInfo)
    console.log("b", item)
    return <View style={style}>
        <Text style={{
            fontSize: 25,
            fontWeight: 600
        }}>{brandInfo.brandName} Brand</Text>
        <View style={{display: "flex", flexDirection: "row"}}>
            <Text style={{marginRight: 15}}>{(item.beforeScore.toFixed(2) )+ "→" + item.afterScore.toFixed(2)}</Text>
            <Text style={{marginRight: 15}}>{item.angle}°</Text>
            <Text style={{marginRight: 15}}>{item.length.toFixed(2)} in</Text>
            <Text style={{marginRight: 15 }}>#{item.taskID}</Text>
        </View>
        <Text>
            {item.note}
        </Text>
        {isDeleteMode ? <Button
        title={"Delete"} onPress={deleteKnife}/> : null}
    </View>
}

