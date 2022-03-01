
import React, { ReactElement, useState } from "react";
import { View, Text, StyleSheet, Dimensions,TouchableOpacity } from "react-native";
import Card from "../Card/card"
const OpenDeck = (props) => {

    if (props.children !== undefined){
        return (
            <View style={styles.container} >
              {props.children.map((child, index) => {
                    return <Card key={index} isDropZone={props.isDropZone}
                    onAddCard={props.onAddCard} id={child.value} suit={child.suit}>
                    </Card>} 
                )}
            </View>)
    };
    return (
        <View>
            
        </View>
    )
} 
export default OpenDeck;
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#E8E6E8",
        backgroundColor: "white",
        height: 150,
        width: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
        flexWrap: 'nowrap'
      },
      touch: {
        position: 'absolute',
        height: 150,
        width: 100
     },
    box: {
        zIndex: 1,
        height: 80,
        width: 100,
        backgroundColor: "blue",
        borderRadius: 5,
        position: "absolute"
    },
  });