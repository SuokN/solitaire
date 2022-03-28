import React, { Component } from "react";
import { StyleSheet, View, Text, PanResponder, Animated,  } from "react-native";
import CardView from "./allCards";
import {back, heightCard, shiftDelta, widthCard} from "../../utils/constants";
import {useSelector} from "react-redux";

const Card = ((props) => {
    const deckCard = useSelector(state => state.deck)
    const pan = new Animated.ValueXY();

    let _val = { x:0, y:0 }
    pan.addListener((value) => _val = value);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gesture) => true,
        onPanResponderGrant: (e, gesture) => {
            pan.setOffset({
                x: _val.x,
                y: _val.y
            })
            pan.setValue({x: 0, y: 0})
        },
        onPanResponderMove: (e, gestureState) => {
            // do whatever you need here
            // be sure to return the Animated.event as it returns a function
            if (props.canMove)
                return Animated.event([
                    null, {dx: pan.x, dy: pan.y}
                ], {useNativeDriver: false})(e, gestureState)
        },
        onPanResponderRelease: (e, gesture) => {
            if (props.canMove) {
                const res = props.isDropZone(gesture)
                console.log("DROPZONE " + res)
                if (res !== -1 && props.deckNum !== res) {
                    if (props.onAddCard(res, props.deckNum, props.id) === false)
                        Animated.spring(
                            pan, // Auto-multiplexed
                            {toValue: {x: 0, y: 0}, useNativeDriver: true}).start();
                } else Animated.spring(
                    pan, // Auto-multiplexed
                    {toValue: {x: 0, y: 0}, useNativeDriver: true}
                    // Back to zero
                ).start();
            } else Animated.spring(
                pan, // Auto-multiplexed
                {toValue: {x: 0, y: 0}, useNativeDriver: true}
                // Back to zero
            ).start();

        }
    })

    const renderDraggable = () => {
       const shift = props.shift ? shiftDelta * props.shift : 0;
       const panStyle = {
           transform: pan.getTranslateTransform()
        }
        return (
           <View style={{ position: "absolute", top: shift}}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[panStyle, styles.box]}>
              {props.isSuit ?
                  <CardView id={back}></CardView>
                  :
                  <CardView id={"_" + deckCard[props.id].value + deckCard[props.id].suit}></CardView>
              }
            </Animated.View>          
        </View>
      );
      }
  
    return (
      <View>
        {renderDraggable()}
      </View>
    );
 
    
});
export default Card;   

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  box: {
    backgroundColor: "skyblue",
    width: widthCard,
    height: heightCard,
    borderRadius: 2
  },
  row: {
    flexDirection: "row"
  }
});

