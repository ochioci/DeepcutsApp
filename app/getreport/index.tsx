import {Button, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {useRoute} from "@react-navigation/native";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing'
import {ClientView} from "@/app/newjob";
import {JobsInfo, KnifeView} from "@/app/newjob/dojob";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    baseText: {
        fontSize: 20,
        fontWeight: 400
    },
    titleText: {
        fontSize: 35,
        fontWeight: 800,
    },
    headingText: {
        fontSize: 25,
        fontWeight: 600
    },
    section: {
        width: "90%",
        display: "flex",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 5,
        margin: 5,
        padding: 5,
    }
});


export default function Index() {
    const route = useRoute();
    const clientID = route.params.clientID
    const jobID = route.params.jobID
    // console.log(clientID, jobID)
    // console.log(route)
    return <SafeAreaView style={{
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
    }}>
        <Text style={styles.titleText}>Generate Job Report</Text>
        <SQLiteProvider databaseName={"jobs.db"}>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap"}}>
                <Text style={{ fontSize: 25, fontWeight: 600}}>Client: </Text>
                <ClientViewContainer clientID={clientID}></ClientViewContainer>
            </View>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap"}}>
                <Text style={{ fontSize: 25, fontWeight: 600}}>Knives: </Text>
                <TasksViewContainer clientID={clientID} jobID={jobID}></TasksViewContainer>
            </View>
            <ReportGenerator clientID={clientID} jobID={jobID}></ReportGenerator>


        </SQLiteProvider>
    </SafeAreaView>
}

function TasksViewContainer({jobID}){
    const db = useSQLiteContext();
    const taskInfo = db.getAllSync(`SELECT * FROM Tasks WHERE jobID=?`,[jobID])
    const brandInfo = db.getAllSync(`SELECT * FROM Brands`)
    const lookupBrand = (brandID) => {return brandInfo.filter((item) => item.brandID == brandID)[0]}
    return taskInfo.map((item) => {
        return <KnifeView item={item} brandInfo={lookupBrand(item.brand)} isDeleteMode={false} setDeleteMode={()=>{}}> </KnifeView>
    })
}


function ClientViewContainer({clientID}) {
    const db = useSQLiteContext();
    const clientInfo = db.getAllSync(`SELECT * FROM Clients WHERE id = ?`, [clientID])[0]
    return <ClientView onPress={() => {}} item={clientInfo} deleteClient={() => {}} isDelete={false}></ClientView>
}





function ReportGenerator({clientID, jobID}) {
    const db = useSQLiteContext();
    const jobInfo = db.getAllSync(`SELECT * FROM Jobs WHERE jobID = ? AND clientID = ?`, [jobID, clientID])
    const clientInfo = db.getAllSync(`SELECT * FROM Clients WHERE id = ?`, [clientID])
    const knifeInfo = db.getAllSync(`SELECT * FROM Tasks WHERE jobID = ?`, [jobID])
    const brandInfo = db.getAllSync(`SELECT * FROM Brands`)
    const lookupBrand = (brandID) => {
        return brandInfo.filter((item) => item.brandID == brandID)[0]
    }
    const clientName = clientInfo[0].firstName + " " +  clientInfo[0].lastName
    const clientAddress = clientInfo[0].address
    console.log("Fetched info:")
    console.log(jobInfo)
    console.log(clientInfo)
    console.log(knifeInfo)
    // let htmlString = reportHeader(clientInfo[0])
    const getReport = () => {
        console.log("generating report")
        // @ts-ignore
        let p = Print.printToFileAsync({html:` 
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Sharpening Report</title>
        </head>
        <body style="display: flex; align-items: flex-start; flex-direction: column;">
        <div style="font-size: 30pt; font-weight: bolder">Deepcuts </div>
        <div style="font-size: 20pt; font-weight: bold">Sharpening Report </div>
        <div>${new Date(Date.now()).toLocaleString("en-US", {timeZone: "EST"})}</div>
        <div>
                <div style="font-weight: bold">Bill to: </div>
                <div>${clientName}</div>
                <div>${clientAddress}</div>
        </div>
        <table style="width: 100%">
            <tr>
                <th style="border: 1px solid black;">Brand</th>
                <th style="border: 1px solid black;">Blade Length</th>
                <th style="border: 1px solid black;">Angle of Sharpening</th>
                <th style="border: 1px solid black;">Score Before</th>
                <th style="border: 1px solid black;">Score After</th>
                <th style="border: 1px solid black;">Notes</th>
            </tr>
            ` +
            knifeInfo.map( ({length, beforeScore, afterScore, brand, angle, note}) => {
                return `
                    <tr>
                        <th style="border: 1px solid black;">${lookupBrand(brand).brandName || "Unknown"}</th>
                        <th style="border: 1px solid black;">${length} in</th>
                        <th style="border: 1px solid black;">${angle}</th>
                        <th style="border: 1px solid black;">${beforeScore}</th>
                        <th style="border: 1px solid black;">${afterScore}</th>
                        <th style="border: 1px solid black;">${note}</th>        
                    </tr>
                `
            }).join('')
             + `
        </table>
    </body>
    </html>
`}).then((result) => {
            Sharing.shareAsync(result.uri)
        })
    }

    return <Button
            onPress={getReport}
            title={"Get Report"}
        />
}

