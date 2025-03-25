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
        <div style="font-size: 30pt; font-weight: bolder">Deepcuts</div>
        <div style="font-size: 20pt; font-weight: bold">Sharpening Report </div>
        <div>
                <div style="font-size: 15pt; font-weight: bold">Bill to: </div>
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
                        <th style="border: 1px solid black;">${lookupBrand(brand).brandName || "unknown"}</th>
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

    return <View>
        <Text>"HELLO WORLD"!!!</Text>
        <Button
            onPress={getReport}
            title={"Get Report"}
        />
    </View>
}

