import React, { useState } from "react";
import { View, StyleSheet,TouchableOpacity } from "react-native";
import CardView from "../Card/allCards";
import {back, heightCard, widthCard} from "../../utils/constants"
//import styles from "../card.style";
const CardDeck = (props) => {
    //console.log("items " + JSON.stringify(props.items))
   // console.log("items " + props.items.length)
    if (!!props.items) {
        return (
            <View style={styles.container}>
                {
                    props.items.length !== 0 ?
                        props.items.map((child, index) => {
                                return <TouchableOpacity style={styles.touch} key={index} onPress={props.onOpenCard}>
                                    <View key={index} style={styles.box}>
                                        <CardView key={index} id={back}></CardView>
                                    </View>
                                </TouchableOpacity>
                            }
                        )
                        : <TouchableOpacity style={styles.touch} onPress={props.returnCards}>
                        </TouchableOpacity>

                }
            </View>)
    }
    ;
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touch} onPress={props.returnCards}>
            </TouchableOpacity>
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
        width: widthCard,
        height: heightCard,
        textAlign: 'center',
        textAlignVertical: 'center',
      },
      touch: {
        position: 'absolute',
          width: widthCard,
          height: heightCard,
     },
    box: {
       // zIndex: 1,
        width: widthCard,
        height: heightCard,
        backgroundColor: "blue",
        borderRadius: 5,
        position: "absolute"
    },
  });