import React, { forwardRef, ReactElement, useState } from "react";
import { View, Text, StyleSheet, Dimensions,TouchableOpacity, Animated } from "react-native";
import Card from "../Card/card";
const DropDeck = forwardRef((props, ref) => {
    
    if (props.children !== undefined){
        return (
            <View style={styles.container} ref={ref}>
              {props.children.map((child, index) => {
                    return <Card key={index} isDropZone={props.isDropZone}
                    onAddCard={props.onAddCard}  deckNum={props.deckNum}
                                 id={child.value} suit={child.suit} >
                    </Card>} 
                )}

            </View>)
    };
    return (
        <View style={styles.container} ref={ref}>
            
        </View>
    )
} );
export default DropDeck;

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
        height: 80,
        width: 100,
        backgroundColor: "blue",
        borderRadius: 5,
        position: "absolute"
    },
  });