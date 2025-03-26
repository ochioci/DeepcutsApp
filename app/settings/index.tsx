import {View, Text, Button, SafeAreaView} from "react-native";
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import {Suspense} from "react";

export default function Index() {

    return <SafeAreaView>
        <Text>Settings Page</Text>
            <SQLiteProvider databaseName={"jobs.db"} useSuspense>
                <Suspense fallback={<Text>Connecting to DB</Text>}>
                    <ClearDBButton></ClearDBButton>
                </Suspense>
            </SQLiteProvider>

    </SafeAreaView>
}

function ClearDBButton() {
    const db = useSQLiteContext()
    const clearDB = () => {
        db.runSync(`DROP TABLE Brands`)
        db.runSync(`DROP TABLE Tasks`)
        db.runSync(`DROP TABLE Clients`)
        db.runSync(`DROP TABLE Jobs`)
        alert("Databases Cleared")
    }
    return <Button
        title={"Clear All Databases"}
        onPress={clearDB}
    />
}