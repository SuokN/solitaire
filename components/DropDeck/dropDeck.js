import React, { forwardRef, ReactElement, useState } from "react";
import { View, Text, StyleSheet, Dimensions,TouchableOpacity, Animated } from "react-native";
import Card from "../Card/card";
import {useSelector} from "react-redux";
import {heightCard, widthCard} from "../../utils/constants";

const DropDeck = forwardRef((props, ref) => {
    //console.log("CHILDREN DROP " + JSON.stringify(props.children))
    const closedCards = useSelector(state => state.closed)
    const deckCards = useSelector(state => state.deck)

    function isSuit(id) {
        //console.log("ISSUIT")
        //console.log("CARDS "+ + id + " "+ deckCards[id].suit + deckCards[id].value  + " "+ (closedCards.indexOf(id)))
        //console.log(closedCards)
        return  (closedCards.indexOf(id) === -1);
    }

    if (!!props.children) {
        return (
            <View style={styles.container} ref={ref}>
                {props.children.map((child, index) => {
                        return <Card key={index} isDropZone={props.isDropZone}
                                     onAddCard={props.onAddCard} deckNum={props.deckNum}
                                     id={child} shift={index} canMove={isSuit(child)}
                                     isSuit={!isSuit(child)}>
                        </Card>
                    }
                )}
            </View>)};
    return (
        <View style={styles.container} ref={ref}>
        </View>
    )
});
export default DropDeck;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#E8E6E8",
        backgroundColor: "white",
        height: 300,
        width: widthCard,
        textAlign: 'center',
        textAlignVertical: 'center',
        flexWrap: 'nowrap',
        //zIndex: 3, // works on ios
        //elevation: 3
    },
    touch: {
        position: 'absolute',
        width: widthCard,
        height: heightCard,
        padding: 13,

    },
    box: {
        width: widthCard,
        height: heightCard,
        backgroundColor: "blue",
        borderRadius: 5,
        position: "absolute"
    },
});