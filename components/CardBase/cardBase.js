import React, {forwardRef, ReactElement, useState} from "react";
import { View, Dimensions } from "react-native";
import styles from "../card.style";
import Card from "../Card/card";

const CardBase = forwardRef( (props, ref)=> {
    //console.log("CardBase " + props.items)
    if (!!props.items) {
      //  console.log("CardBase " + props.items)
        return (
            <View style={styles.container} ref={ref}>
                {props.items.map((child, index) =>
                    <Card key={index} isDropZone={props.isDropZone} onAddCard={props.onAddCard} id={child} canMove={false}/>
                )}
            </View>)
    }
    return (<View/>)
});

export default CardBase;