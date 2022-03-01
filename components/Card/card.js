import React, { Component } from "react";
import { StyleSheet, View, Text, PanResponder, Animated,  } from "react-native";
import CardView from "./allCards";

const Card = ((props) => {

    let showDraggable = true;
    const pan = new Animated.ValueXY();
    

    let _val = { x:0, y:0 }
    pan.addListener((value) => _val = value);
    
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gesture) => true,
        onPanResponderGrant: (e, gesture) => {
          pan.setOffset({
            x: _val.x,
            y:_val.y
          })
          pan.setValue({ x:0, y:0})
        },
        onPanResponderMove: Animated.event([ 
          null, { dx: pan.x, dy: pan.y }
        ], {useNativeDriver: false}),
        onPanResponderRelease: (e, gesture) => {
          res = props.isDropZone(gesture)
          if (res !== -1 && props.deckNum !== res) {
              if (props.onAddCard(res, props.deckNum) === false)
                  Animated.spring(
                      pan, // Auto-multiplexed
                      { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
          } 
          else Animated.spring(
            pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 }, useNativeDriver: true }
  
          // Back to zero
        ).start();
  
        }
   })

  
   const renderDraggable = () => {
    const panStyle = {
      transform: pan.getTranslateTransform()
    }
      return (
        <View style={{ position: "absolute" }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[panStyle, styles.box]}>
              <CardView id={"_" + props.id + props.suit}></CardView>
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
  ballContainer: {
    height:200
  },
  box: {
    backgroundColor: "skyblue",
    width: 100,
    height: 100,
    borderRadius: 2
  },
  row: {
    flexDirection: "row"
  },  
  dropZone: {
    height: 200,
    backgroundColor: "#00334d"
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold"
  }
});

