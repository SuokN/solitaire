import React, { ReactElement, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const CardList = ({children}) => {
    const[ready, setReady] = useState(false);
    const offset =  children.map(() => ({
        order: -1,
        width: (0),
        height: (0),
        x: (0),
        y: (0),
        originX: (0),
        originY: (0)
    }));
    if (!ready){
        return (
            <View >
                {children.map((child) => {
                    return <View key={child.ID}>{child}</View>}
                )}
            </View>)
    };
    return (
        <View>
            <CardDeck></CardDeck>
        </View>
    )
} 