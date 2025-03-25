import {SafeAreaView, Text, View} from "react-native";
import {useRoute} from "@react-navigation/native";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";

export default function GetReport() {
    const route = useRoute();
    const clientID = route.params.clientID
    const jobID = route.params.jobID
    // console.log(clientID, jobID)
    // console.log(route)
    return <SafeAreaView>
        <SQLiteProvider databaseName={"jobs.db"}>
            <ReportGenerator clientID={clientID} jobID={jobID}></ReportGenerator>
        </SQLiteProvider>
    </SafeAreaView>
}

const reportHeader = (clientInfo, inside="") => {
    return "<div>" + inside + " " + clientInfo.firstName + " " + clientInfo.lastName + "</div>"
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
    generatePDFFromHTML()

    return <View>
        <Text>Get Report</Text>
    </View>
}



async function generatePDFFromHTML() {
    const { RNProcessor: Processor, PSPDFKit } = NativeModules;
    const configuration = {
        name: 'Sample',
        override: true,
    };

    let htmlString = `
  <html lang="en">
  <head>
  <style>
  body {
      font-family: sans-serif;
  }
  </style><title>Demo HTML Document</title>
  </head>
  <body>
  <h1>PDF generated from HTML</h1>
  <p>Hello HTML</p>
  <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
  </ul>
  <p><span style="color: #ff0000;"><strong>Add some style</strong></span></p>
  </body>
  </html>`;

    try {
        let { fileURL } = await Processor.generatePDFFromHtmlString(
            configuration,
            htmlString,
        );

        if (Platform.OS === 'android') {
            PSPDFKit.present(fileURL, { title: 'Generate PDF from HTML' });
            return;
        }

        // For iOS, we need to write to the main bundle
        await extractAsset(fileURL, 'sample.pdf', (mainpath) => {
            PSPDFKit.present(mainpath, {
                title: 'Generate PDF from HTML',
            });
        });
    } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
    }
}

// Helper function to extract asset for iOS
const extractAsset = async (fileURL, fileName, callBack) => {
    try {
        await RNFS.readFile(fileURL, 'base64').then((document) => {
            let mainPath = `${RNFS.MainBundlePath}/${documentName(
                fileName,
            )}`;
            RNFS.writeFile(mainPath, document, 'base64')
                .then((success) => {
                    callBack(mainPath);
                })
                .catch((e) => console.log(e));
        });
    } catch (error) {
        console.log('Error copying file', error);
    }
};

// Helper function to ensure proper file extension
const documentName = (fileName) => {
    if (
        fileName.toLowerCase().substring(fileName.length - 4) !== '.pdf'
    ) {
        return `${fileName}.pdf`;
    }
    return fileName;
};



