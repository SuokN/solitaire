import React, { useState } from "react";
import { View, StyleSheet,TouchableOpacity } from "react-native";
import CardView from "../Card/allCards";
import {back} from "../../utils/constants"
const CardDeck = (props) => {
    //console.log(props.children)
    if (props.children !== undefined){
        return (
            <View style={styles.container} >
              {props.children.map((child, index) => {
                    return <TouchableOpacity style={styles.touch} key={index} onPress={props.onOpenCard}>
                        <View key={index} style={styles.box}>
                            <CardView key={index} id={back}></CardView>
                        </View>
                    </TouchableOpacity> }
                )}

            </View>)
    };
    return (
        <View>
            
        </View>
    )
} 
export default CardDeck;

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderWidth: 1,
        borderColor: "#E8E6E8",
        backgroundColor: "white",
        height: 150,
        width: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
      },
      touch: {
        position: 'absolute',
        height: 150,
        width: 100
     },
    box: {
        zIndex: 1,
        height: 150,
        width: 100,
        backgroundColor: "blue",
        borderRadius: 5,
        position: "absolute"
    },
  });