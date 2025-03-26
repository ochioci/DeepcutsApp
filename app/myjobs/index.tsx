import {Button, FlatList, Pressable, SafeAreaView, Text, View} from "react-native";
import {Link, useNavigation} from "expo-router";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import {useIsFocused} from "@react-navigation/core";
import {StyleSheet } from "react-native";
import {useState} from "react";


const styles = StyleSheet.create({
    bigText: {
        fontSize: 35,
        fontWeight: "800",
        textAlign: "center"
    },
    headText: {
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center"

    },
    regText: {
        fontSize: 20,
        fontWeight: "400",
        textAlign: "center"

    }
})

export default function Index() {
    const navigation = useNavigation()
    const [filter, setFilter] = useState(0)
    return (
        <SafeAreaView
            style={{
                display: "flex",
                alignItems: "center",
                width: "100%"
            }}
        >
            <Text style={styles.bigText}>My Jobs</Text>
            <View style={{display: "flex", flexDirection: "row"}}>
                <Button
                    color = {filter == 0 ? "green": "#007AFF"}
                    title={"Active jobs"}
                    onPress={() => {setFilter(0)}}
                />
                <Button
                    color = {filter == 1 ? "green": "#007AFF"}
                    title={"Finished jobs"}
                    onPress={() => {setFilter(1)}}
                />
                <Button
                    color = {filter == 2 ? "green": "#007AFF"}
                    title={"All jobs"}
                    onPress={() => {setFilter(2)}}
                />

            </View>

            <SQLiteProvider databaseName={"jobs.db"}>
                <ActiveJobsView filter={filter}></ActiveJobsView>
            </SQLiteProvider>
        </SafeAreaView>
    );
}

export function ActiveJobsView({filter}) {
    const db = useSQLiteContext();
    db.execSync(`
CREATE TABLE IF NOT EXISTS Clients (id INTEGER PRIMARY KEY NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, isDeleted INTEGER DEFAULT 0);
`);
    db.execSync(`
CREATE TABLE IF NOT EXISTS Jobs (jobID INTEGER PRIMARY KEY NOT NULL, clientID INTEGER NOT NULL, taskIDs TEXT NOT NULL, status TEXT NOT NULL, startedAt INTEGER NOT NULL DEFAULT current_timestamp, finishedAt INTEGER);
`);
    const isFocused = useIsFocused();
    let jobs;
    if (filter == 0) {
        jobs = db.getAllSync("SELECT * FROM Jobs WHERE status='started'");
    } else if (filter == 1) {
        jobs = db.getAllSync("SELECT * FROM Jobs WHERE status='finished'");
    } else if (filter == 2) {
        jobs = db.getAllSync("SELECT * FROM Jobs WHERE NOT status='init'");
    }
    const map = db.getAllSync("SELECT * FROM Clients")
    const lookupClient = (id) => {
        return map.filter( (item) => item.id == id)[0]
    }
    console.log(jobs, map)
    return <FlatList
        style={{width: "100%", marginBottom: 100}}
    data = {jobs}
    keyExtractor={(item) => item.jobID}
    renderItem={({item}) => <JobView jobInfo={item} clientInfo={lookupClient(item.clientID)}></JobView>}
    />
}

function JobView({jobInfo, clientInfo}) {
    const navigation = useNavigation()
    if (!clientInfo) {
        return null
    }
    return <View style={{
        display: "flex",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 2,
        padding: 10,
        margin: 10,
        borderRadius: 5,
        width: "auto"
    }}>

        <Text style={styles.headText}>{clientInfo.firstName + " " + clientInfo.lastName} - {jobInfo.status == "started" ? "In Progress" : "Complete"}</Text>
        <Text style={styles.regText}>{String(new Date(jobInfo.startedAt).toDateString())}</Text>
        <Text style={styles.regText}>{clientInfo.address}</Text>
        <Text style={styles.regText}>#{jobInfo.jobID}</Text>
        {jobInfo.status == "started" ?
            <Button
                title={"Continue Job"}
                onPress={() => { // @ts-ignore
                    navigation.navigate("newjob", {
                        screen: "dojob/index",
                        params: {
                            clientID: clientInfo.id
                        }
                    })
                }}
            /> : <Button
                title={"View Report"}
                onPress={() => {
                    navigation.navigate("getreport", {
                        screen: "getreport/index",
                        params: {jobID: jobInfo.jobID, clientID:clientInfo.id}
                    })
                }}
            />
        }
    </View>
}