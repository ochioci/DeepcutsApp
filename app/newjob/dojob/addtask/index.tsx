import {View, Text, StyleSheet, TextInput, Button, FlatList, Pressable, SafeAreaView} from "react-native";
import {useRoute} from "@react-navigation/native";
import React, {useEffect, useRef, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";
import Slider from '@react-native-community/slider';
import { RadialSlider } from 'react-native-radial-slider';
import {useNavigation} from "expo-router";
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
        fontWeight: "600",
        textAlign: "center"
    },
    subheadingText: {
        fontSize: 20,
        fontWeight: "400"
    }
});

const brandStyle = {
    display: "flex",
    alignItems: "left",
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: "auto"
}

export default function Index() {
    const route = useRoute()
    const db = useSQLiteContext()
    const navigator = useNavigation();
    // Fields: jobID, length, brand, angle, beforeScore, afterScore
    //We already have job id, so the user will need to input 5 things
    const [inputState, setInputState] = useState(0)
    const inputArray = useRef(["0", "0", 20, "400", "400", "", route.params.jobID])
    const [sliderVal, setSliderVal] = useState(400)
    const cycleForwards = () => {
        if (inputState != 5) {
            setInputState(inputState+1)
            if (inputState == 2 || inputState == 4) {
                setSliderVal(400)
            } else {
                setSliderVal("--")
            }
        }
    }
    const cycleBackwards = () => {
        if (inputState != 0) {
            setInputState(inputState - 1)
            if (inputState == 2 || inputState == 4) {
                setSliderVal(400)
            } else {
                setSliderVal("--")
            }
        }
    }
    const submit = () => {
        // @ts-ignore
        // console.log(inputArray.current)
        db.getAllSync(`UPDATE Jobs SET status = ? WHERE jobID = ?`, ["started", route.params.jobID])
        db.getAllSync(`INSERT INTO Tasks (brand, length, angle, beforeScore, afterScore, note, jobID) VALUES (?,?,?,?,?,?,?)`, inputArray.current)
        alert("Added knife")
        navigator.navigate("dojob/index", {
            clientID: route.params["clientID"]
        })
    }

    // console.log(route)
    return <SafeAreaView style={{display: "flex", alignItems: "center", width: "100%"}}>
        <Text style={styles.titleText}>Add a Knife</Text>
        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
            <Button color={inputState==0 ? "grey": "#007AFF"} title="Previous Field" onPress={cycleBackwards}/>
            <Button color={inputState==5 ? "grey" : "#007AFF"}title="Next Field" onPress={cycleForwards}/>
        </View>
        <InputMenu inputArray={inputArray} inputState={inputState} submit={submit} sliderVal={sliderVal} setSliderVal={setSliderVal}></InputMenu>
    </SafeAreaView>
}

function InputMenu({inputState, inputArray, submit, sliderVal, setSliderVal}) {
    const db = useSQLiteContext();
    db.execSync(`CREATE TABLE IF NOT EXISTS Brands (brandID INTEGER PRIMARY KEY NOT NULL, brandName TEXT NOT NULL, isVisible BOOLEAN NOT NULL DEFAULT 1)`)
    // console.log(brands)
    const route = useRoute()
    const [isEditMode, setEditMode] = useState(false)
    const [isAddMode, setAddMode] = useState(false)
    const [brands, setBrands] = useState((db.getAllSync(`SELECT * FROM Brands WHERE isVisible`)))
    const [brandSelected, setBrandSelected] = useState(-1)
    const navigator = useNavigation()
    const brandInput = useRef("");
    const majorvalBefore = useRef(0)
    const minorvalBefore = useRef(0)
    const majorvalAfter = useRef(0)
    const minorvalAfter = useRef(0)
    const submitBrand = () => {
        db.getAllSync(`INSERT INTO Brands (brandName, isVisible) VALUES (?, ?)`, [brandInput.current, true])
        setBrands(db.getAllSync(`SELECT * from Brands WHERE isVisible`))
        // console.log(brands)
    }

    const StepMarker = ({currentValue, index, max, min}) => {
        if (max-min>10 && index%2 != 0) {return null}
        return <Text style={{marginTop: 15, color: ("rgb(" + (((((index-currentValue)**2)) * ((max-min)) )) + "," + (((((index-currentValue)**2)) * ((max-min)) )) +  "," + (((((index-currentValue)**2)) * ((max-min)) )) + ")")}
        }>{index}</Text>
    }

    if (inputState == 0) {// enter brand
        return <SafeAreaView style={{width: "100%", display: "flex", alignItems: "center"}}>
            <Text style={styles.headingText}>
                Select a brand
            </Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent:"center", width: "100%"}}>
                <Button title={"Add a Brand"} onPress={() => {setAddMode(!isAddMode)}}></Button>

                <Button title={"Edit Brands"} onPress={() => {setEditMode(!isEditMode)}}/>
                <Button title={"Cancel"} onPress={() => {
                    // @ts-ignore
                    navigator.navigate("dojob/index", {
                        clientID: route.params["clientID"]
                    })
                }}/>
            </View>
            {isAddMode ? <View style={{display: "flex", flexDirection: "row", justifyContent:"space-evenly", width: "100%"}}>
                <TextInput style={{fontSize: 18, fontWeight: "400", borderWidth: 2, borderStyle: "solid", borderRadius: 2, padding: 3, margin: 3, width: "30%"}} placeholder={"Brand name"} onChangeText={(txt) => {brandInput.current=txt}}/>
                <Button title={"Add"} onPress={submitBrand}/>
            </View>: null}

            <FlatList
                style={{
                    width: "100%",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                }}
                // ItemSeparatorComponent={() => <View style={{height: 20, borderBottomWidth: 1,}} />}
                data={brands}
                renderItem = {
                    ({item}) => {
                        // console.log("item:", item)
                        return <Pressable
                            onPress={() => {
                                setBrandSelected(item.brandID)
                                inputArray.current[0] = item.brandID
                            }}
                            style={brandSelected == item.brandID ? {
                                display: "flex",
                                alignItems: "left",
                                borderColor: "black",
                                borderWidth: 2,
                                padding: 10,
                                margin: 10,
                                borderRadius: 5,
                                width: "auto",
                                backgroundColor: "lightblue"
                            } : {
                                display: "flex",
                                alignItems: "left",
                                borderColor: "black",
                                borderWidth: 2,
                                padding: 10,
                                margin: 10,
                                borderRadius: 5,
                                width: "auto",
                            }}
                        >
                            <Text style={styles.subheadingText}>{item.brandName}</Text>
                            {isEditMode ? <Button title={"Delete"} onPress={
                                () => {
                                    db.getAllSync(`DELETE FROM Brands WHERE brandID=?`, [item.brandID])
                                    setBrands(db.getAllSync(`SELECT * from Brands WHERE isVisible`))
                                    alert("This brand will no longer be available for selection. Past selections of this brand will be unaffected.")
                                }
                            }/> : null}
                        </Pressable>
                    }
                }
                keyExtractor={(item) => item.brandID}
            >
            </FlatList>
        </SafeAreaView>
    } else if (inputState == 1) {
        return <SafeAreaView style={{display: "flex", alignItems: "center"}}>
            <Text style={styles.headingText}>Enter Blade Length</Text>
            <Slider
                style={{width: 300}}
                minimumValue={3}
                maximumValue={16}
                value={0}
                vertical={true}
                onSlidingComplete={(val) => {
                    inputArray.current[1] = val.toFixed(2)
                    setSliderVal(val.toFixed(2))
                }
            }
                // renderStepNumber={true}
            ></Slider>
            <Text style={styles.subheadingText}>{sliderVal} in</Text>
        </SafeAreaView>
    } else if (inputState == 3) {
        return <SafeAreaView style={{display: "flex", alignItems: "center"}}>
            <Text style={styles.headingText}>Enter Angle of Sharpening</Text>
            <RadialSlider
                value={inputArray.current[2]}
                min={12}
                max={45}
                radius={170}
                title={"Angle of Sharpening"}
                subTitle={""}
                unit={"degrees"}
                onChange={(val) => {inputArray.current[2] = val}}
            />
        </SafeAreaView>
    } else if (inputState == 2) {

        return <SafeAreaView style={{display: "flex", alignItems: "center", justifyContent: "space-around", height: "60%"}}>
            <Text style={styles.headingText}>Enter Sharpness Score Before Sharpening</Text>
            <View style={{borderStyle: "solid", borderWidth: 2, borderRadius: 3, display: "flex", alignItems: "center", padding: 3, margin: 5}}>
                <Text style={styles.subheadingText}>Coarse (0-1900)</Text>
                <Slider
                    style={{width: 300, height: 100}}
                    minimumValue={0}
                    maximumValue={19}
                    StepMarker={StepMarker}
                    value={4}
                    vertical={true}
                    step = {1}
                    onSlidingComplete={(val) => {
                        majorvalBefore.current = val
                        inputArray.current[3] = (majorvalBefore.current * 100) + (minorvalBefore.current*10)
                        setSliderVal(inputArray.current[3].toFixed(2))
                    }
                    }
                    // renderStepNumber={true}
                ></Slider>

            </View>

            <View style={{borderStyle: "solid", borderWidth: 2, borderRadius: 3, display: "flex", alignItems: "center", padding: 3, margin: 5}}>
                <Text style={styles.subheadingText}>Fine (0-100)</Text>
                <Slider
                    style={{width: 300}}
                    minimumValue={0}
                    maximumValue={10}
                    value={0}
                    step = {1}
                    vertical={true}
                    onSlidingComplete={(val) => {
                        minorvalBefore.current = val
                        inputArray.current[3] =( majorvalBefore.current * 100) + (minorvalBefore.current * 10)
                        setSliderVal(inputArray.current[3].toFixed(2))

                    }
                    }
                    StepMarker={StepMarker}
                    // renderStepNumber={true}
                ></Slider>
            </View>
            <Text style={styles.subheadingText}>Score: {sliderVal}</Text>

        </SafeAreaView>
    } else if (inputState == 4) {
        return <SafeAreaView style={{display: "flex", alignItems: "center", justifyContent: "space-around", height: "60%"}}>
            <Text style={styles.headingText}>Enter Sharpness Score After Sharpening</Text>
            <View style={{borderStyle: "solid", borderWidth: 2, borderRadius: 3, display: "flex", alignItems: "center", padding: 3, margin: 5}}>
                <Text style={styles.subheadingText}>Coarse (0-1900)</Text>
                <Slider
                    style={{width: 300, height: 100}}
                    minimumValue={0}
                    maximumValue={19}
                    StepMarker={StepMarker}
                    value={4}
                    vertical={true}
                    step = {1}
                    onSlidingComplete={(val) => {
                        majorvalBefore.current = val
                        inputArray.current[4] = (majorvalBefore.current * 100) + (minorvalBefore.current*10)
                        setSliderVal(inputArray.current[4].toFixed(2))
                    }
                    }
                    // renderStepNumber={true}
                ></Slider>

            </View>

            <View style={{borderStyle: "solid", borderWidth: 2, borderRadius: 3, display: "flex", alignItems: "center", padding: 3, margin: 5}}>
                <Text style={styles.subheadingText}>Fine (0-100)</Text>
                <Slider
                    style={{width: 300}}
                    minimumValue={0}
                    maximumValue={10}
                    value={0}
                    step = {1}
                    vertical={true}
                    onSlidingComplete={(val) => {
                        minorvalBefore.current = val
                        inputArray.current[4] =( majorvalBefore.current * 100) + (minorvalBefore.current * 10)
                        setSliderVal(inputArray.current[4].toFixed(2))

                    }
                    }
                    StepMarker={StepMarker}
                    // renderStepNumber={true}
                ></Slider>
            </View>
            <Text style={styles.subheadingText}>Score: {sliderVal}</Text>

        </SafeAreaView>
    } else {
        return <View
        style={{width: "100%", display: "flex", alignItems: "center"}}>
            <TextInput
                placeholder={"Notes"}
                multiline={true}
                onChangeText={(txt) => {
                    inputArray.current[5] = txt
                }}
                style={{
                    width: "75%",
                    height: "50%",
                    borderStyle: "solid",
                    borderWidth: 2,
                    fontSize: 20,
                    textAlign: "center",
                    margin: 3,
                    borderRadius: 5,

                }}
            />
            <Button
                title={"Submit"}
                onPress={submit}
            />
        </View>
    }
}