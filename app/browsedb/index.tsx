import {Button, SafeAreaView, StyleSheet, Text, View} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import {useState} from "react";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import ClientSelect  from "./clientselect";
import {ActiveJobsView} from "@/app/myjobs";
import CompiledTasksView from "@/app/browsedb/jobselect";
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

export default function Index() {
    const [dataTypeState, setDataTypeState] = useState(0)
    return <SafeAreaView style={{display: "flex", alignItems: "center", width: "100%"}}>
        <Text style={styles.titleText}>Browse Database</Text>
        <DataSelection state={dataTypeState} setState={setDataTypeState}></DataSelection>
        <DataView state={dataTypeState} setState={setDataTypeState}></DataView>
    </SafeAreaView>
}

function DataView ({state, setState}) {
    if (state == 0) {
        return <ActiveJobsView filter={2}></ActiveJobsView>
    } else if (state == 1) {
        return <CompiledTasksView></CompiledTasksView>
    } else if (state == 2) {
        return <View style={{width: "100%"}}><ClientSelect></ClientSelect></View>
    }
    return null
}

function DataSelection ({state, setState}) {
    return <View style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
        <Button color={(state==0) ? "green" : "#007AFF"} onPress={() => {setState(0)}} title={"Jobs"}/>
        <Button color={(state==1) ? "green" : "#007AFF"} onPress={() => {setState(1)}} title={"Knives"}/>
        <Button color={(state==2) ? "green" : "#007AFF"} onPress={() => {setState(2)}} title={"Clients"}/>
    </View>
}

function JobsOptions() {
    //filter by: Client
    return <SafeAreaView style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
        {/*<SQLiteProvider databaseName={"jobs.db"}>*/}
            <ClientSelect></ClientSelect>
        {/*</SQLiteProvider>*/}
    </SafeAreaView>
}

