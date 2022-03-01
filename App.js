import React, { useRef, useState, useEffect } from "react";
import { Animated, PanResponder, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Card from "./components/Card/card"
import CardDeck from "./components/CardDeck/cardDeck"
import OpenDeck from "./components/OpenDeck/openDeck"
import DropDeck from "./components/DropDeck/dropDeck"
import {InitCards, ShuffleIndexes} from "./utils/cardsUtil"
import {isCanDropCard} from "./utils/orderCards"

const App = () => {

  const dropContainerRef = useRef(null);
  const dropRefs = [useRef(null), useRef(null),
    useRef(null), useRef(null)];
  const measureDrop = useRef([])
  const [deckCard, setDeckCard] = useState(InitCards());
  const [indexesCard, setIndexesCard] = useState(ShuffleIndexes());
  const [openCard, setOpenCard] = useState([]);
  const [dropCard, setDropCard] = useState(Array([],[],[],[]));

  function updateDropMeusere () {
    //console.log('updateDropMeusere')
    //console.log(dropCard)
    if (dropContainerRef.current) {
      for (i = 0; i < dropRefs.length; ++i)
      {
        if (dropRefs[i].current)
        {
          dropRefs[i].current.measureLayout(
          dropContainerRef.current,
          (left, top, width, height) => {
            measureDrop.current.push({ left, top, width, height });
            isDropZone.bind(measureDrop.current);
            //console.log(measureDrop.current)
            //return { left, top, width, height };              
          });
        }
      }
      }
    }         
  
  const isDropZone = (gesture) =>
  { 
    for (i = 0; i < measureDrop.current.length; ++i)
    {
      if (measureDrop.current[i] == null) continue;
      if (gesture.moveY > measureDrop.current[i].top  && 
        gesture.moveY < measureDrop.current[i].top + measureDrop.current[i].height 
        &&
        gesture.moveX > measureDrop.current[i].left  && 
        gesture.moveX < measureDrop.current[i].left + measureDrop.current[i].width)
        return i;
    }
    return -1;
  }

  const onOpenCard = () => {
    let indexes = [...indexesCard]
    const index = indexes.slice(indexes.length-1);
    /*if (index === null)
    {
      setDeckCard(openCard)
      setOpenCard([])
    }   */
    setIndexesCard(indexes.slice(0, indexes.length-1));
    
    setOpenCard([...openCard,  deckCard[index]])
  }
  
  const onAddCard = (deckNum) => {
    let opens = [...openCard]
    const child = opens.slice(opens.length-1);
    let drops = [...dropCard]
    const childIn = drops[deckNum].slice(drops[deckNum].length-1);
    console.log("CHILDIN " + childIn[0] + " " + drops[deckNum].length)
    if (childIn.length === 0 || isCanDropCard(child[0], childIn[0])) {
      setOpenCard(opens.slice(0, opens.length-1));
      drops[deckNum].push(child[0])
      setDropCard(drops);
      console.log("TRUE")
      return true;
    }
    console.log(dropCard)
    return false;
  }
   const onAddCardFromDrop = (deckTo, deckFrom) => {
    let drops = [...dropCard]
    const child = drops[deckFrom].pop();
    drops[deckTo].push(child)
    setDropCard(drops);
    //console.log(dropCard)
   }

  return(
      <View style={styles.container} ref={dropContainerRef} 
        onLayout={() => updateDropMeusere()}>
          <View style={styles.deckContainer}>
            <CardDeck children={deckCard} onOpenCard={onOpenCard} ></CardDeck>
            <OpenDeck children={openCard} isDropZone={isDropZone} onAddCard={onAddCard}></OpenDeck>        
         </View>
         <View style={styles.deckContainer}>
           {dropRefs.map((dropRef, index) => 
            <DropDeck children={dropCard[index]} key={index} deckNum={index}
              isDropZone={isDropZone} onAddCard={onAddCardFromDrop} ref={dropRef} 
              onLayout={isDropZone.bind(this)}></DropDeck>        
           )}
        </View>
       </View>
  )
  
}

/*
    {children.map((child) => 
      <Text style={styles.measure}>
        {child}
      </Text>
      )}
*/
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  deckContainer: {
    flexDirection: "row"
  },
  colars: {
    height: 170,
    width: 170,
    backgroundColor: "green"
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: "red",
    borderRadius: 5
  }
});

export default App;
