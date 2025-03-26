import {Button, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {Link, useNavigation} from "expo-router";
import * as SQLite from 'expo-sqlite';
import {useIsFocused} from "@react-navigation/core";

export default function Index() {
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

    const navigation = useNavigation()

    return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 5,
          width: "100%"
      }}
    >
        <Text style={styles.titleText}>Deepcuts</Text>
        <Pressable onPress={() => navigation.navigate("newjob")} style={styles.section}>
            <Text style={styles.headingText}>Start a new job</Text>
            <Text style={styles.baseText}></Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("myjobs/index")} style={styles.section}>
            <Text style={styles.headingText}>View Previous Jobs</Text>
            <Text style={styles.baseText}></Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("browsedb")} style={styles.section}>
            <Text style={styles.headingText}>Browse Database</Text>
            <Text style={styles.baseText}></Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("settings/index")} style={styles.section}>
            <Text style={styles.headingText}>Settings</Text>
            <Text style={styles.baseText}></Text>
        </Pressable>
        {/*<Button onPress={() => navigation.navigate("newjob")} title={"Start a new job"}></Button>*/}
        {/*<Button onPress={() => navigation.navigate("myjobs/index")} title={"View my past jobs"}></Button>*/}
        {/*<Button onPress={() => navigation.navigate("settings/index")} title={"View Settings"}></Button>*/}
        {/*<Link style={styles.titleText} href="/newjob">New Job</Link>*/}
        {/*<Link style={styles.titleText} href="/myjobs">My Jobs</Link>*/}
    </SafeAreaView>
  );
}
