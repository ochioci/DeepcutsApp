import {Button, SafeAreaView, Text, View} from "react-native";
import {useRoute} from "@react-navigation/native";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing'
export default function Index() {
    const route = useRoute();
    const clientID = route.params.clientID
    const jobID = route.params.jobID
    // console.log(clientID, jobID)
    // console.log(route)
    return <SafeAreaView>
        <Text>"Generate Report Menu"</Text>
        <SQLiteProvider databaseName={"jobs.db"}>
            <ReportGenerator clientID={clientID} jobID={jobID}></ReportGenerator>
        </SQLiteProvider>
    </SafeAreaView>
}


function ReportGenerator({clientID, jobID}) {
    const db = useSQLiteContext();
    const jobInfo = db.getAllSync(`SELECT * FROM Jobs WHERE jobID = ? AND clientID = ?`, [jobID, clientID])
    const clientInfo = db.getAllSync(`SELECT * FROM Clients WHERE id = ?`, [clientID])
    const knifeInfo = db.getAllSync(`SELECT * FROM Tasks WHERE jobID = ?`, [jobID])
    console.log("Fetched info:")
    console.log(jobInfo)
    console.log(clientInfo)
    console.log(knifeInfo)

    // let htmlString = reportHeader(clientInfo[0])
    const getReport = () => {
        console.log("generating report")
        let p = Print.printToFileAsync({html:` <div>
        Hello, World!
    </div>`}).then((result) => {
            Sharing.shareAsync(result.uri)
        })
    }

    return <View>
        <Text>"HELLO WORLD"!!!</Text>
        <Button
            onPress={getReport}
            title={"Get Report"}
        />
    </View>
}

