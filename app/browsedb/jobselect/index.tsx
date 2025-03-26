import {View, Text, FlatList} from "react-native";
import {JobsInfo} from "@/app/newjob/dojob";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";

export default function CompiledTasksView() {
    return <View style={{width: "100%"}}>
        <ClientsMapper></ClientsMapper>
    </View>
}

function ClientsMapper() {
    const db = useSQLiteContext();
    const clients = db.getAllSync(`SELECT * FROM Clients`)
    const clientLookup = (id) => {
        console.log(id, clients)
        return clients.filter((c) => {
            return c.id == id
        })[0]
    }
    const jobs = db.getAllSync(`SELECT * FROM Jobs WHERE NOT status='init'`)
    console.log(jobs)
    return <View style={{width: "100%"}}>
        <FlatList style={{width: "100%"}} data={jobs} renderItem={
            ({item}) => <JobsInfo jobID={item.jobID} clientName={"Job #" + item.jobID + " - " + (clientLookup(item.clientID).firstName + " " + clientLookup(item.clientID).lastName)} simplified={true} clientID={item.id} db={db}></JobsInfo>
        }></FlatList>
    </View>
}