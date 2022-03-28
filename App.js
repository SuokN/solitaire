import React, { useRef, useState, useEffect } from "react";
import {View, StyleSheet, Button} from "react-native";
import CardDeck from "./components/CardDeck/cardDeck"
import OpenDeck from "./components/OpenDeck/openDeck"
import DropDeck from "./components/DropDeck/dropDeck"
import CardBase from "./components/CardBase/cardBase"
import { ShuffleIndexes } from "./utils/cardsUtil"
import { isCanDropCard, isCanDropCardBase } from "./utils/orderCards"

import { useDispatch, useSelector } from "react-redux";
import {updateClosed} from "./actions/deck";
import {shiftDelta, UPDATE_CLOSED_CARDS} from "./utils/constants";


const App = () => {
  const dispatch = useDispatch()
  const dropContainerRef = useRef(null);
  const dropRefs = [useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null)];
  const dropBases = [useRef(null), useRef(null),
    useRef(null), useRef(null)];
  const measureDrop = useRef([])
  const deckCard = useSelector(state => state.deck)
  const [indexesCard, setIndexesCard] = useState(ShuffleIndexes());
  const [openCard, setOpenCard] = useState([]);
  const [dropCard, setDropCard] = useState(Array([], [], [], [], [], [], []));
  const [baseCard, setBaseCard] = useState(Array([], [], [], []));
  const closedCards = useSelector(state => state.closed);

  function newGame(){
    setOpenCard([])
    setBaseCard(Array([], [], [], []))
    setIndexesCard(ShuffleIndexes())
    setDropCard(Array([], [], [], [], [], [], []))
    initDropCards();
  }

  function updateDropMeusere() {
    //console.log('updateDropMeusere')
    //console.log(dropCard)
    if (!!dropContainerRef.current) {
      for (let i = 0; i < dropRefs.length; ++i) { // dropRefs.foreach
        if (dropRefs[i].current) {
          dropRefs[i].current.measureLayout(
              dropContainerRef.current,
              (left, top, width, height) => {
                measureDrop.current.push({left, top, width, height});
                isDropZone.bind(measureDrop.current);
                //console.log(measureDrop.current)
                //return { left, top, width, height };
              });
        }
      }
      for (let i = 0; i < dropBases.length; ++i) { // dropBases.foreach
        if (dropBases[i].current) {
          dropBases[i].current.measureLayout(
              dropContainerRef.current,
              (left, top, width, height) => {
                measureDrop.current.push({left, top, width, height});
                isDropZone.bind(measureDrop.current);
                //console.log(measureDrop.current)
                //return { left, top, width, height };
              });
        }
      }
    }
  }

  const isDropZone = gesture => {
    console.log("isDropZone ")
    for (i = 0; i < measureDrop.current.length; ++i) { // measureDrop.find
      if (measureDrop.current[i] == null) continue;
      if (gesture.moveX > measureDrop.current[i].left &&
          gesture.moveX < measureDrop.current[i].left + measureDrop.current[i].width) {
        const drop = i > dropCard.length ? undefined : dropCard[i]
        const heightDelta = (drop === undefined) ? 0 : dropCard[i].length * shiftDelta;
        //console.log("isDropZone " +  measureDrop.current[i].height)
        measureDrop.current[i].height += heightDelta
        //console.log("isDropZone " +  measureDrop.current[i].height)
        if (gesture.moveY > measureDrop.current[i].top &&
            gesture.moveY < measureDrop.current[i].top + measureDrop.current[i].height)
          return i;
      }
    }
    return -1;
  }

  function initDropCards() {
    let adds = new Array(dropCard.length)  // Make const. Use transformation. Not mutations!!!
    for(let i = 0; i < adds.length; ++i) {
      i === 0 ? adds[i] = i : adds[i] = i + adds[i-1];
     }
    //console.log(adds)
    setDropCard(dropCard => dropCard.map((item, index) =>
        indexesCard.slice(indexesCard.length - (index + 1) - adds[index], indexesCard.length - adds[index])));
    const res = dropCard.map((item, index) =>
        indexesCard.slice(indexesCard.length -(index + 1) - adds[index], indexesCard.length - adds[index] - 1))
   // console.log(res)
    dispatch(updateClosed(res.flat()));
    const cards = indexesCard.slice(0, indexesCard.length - adds[adds.length-1] - adds[adds.length-2] - 1)
    setIndexesCard(cards);
  }

  useEffect(() => initDropCards(), []);

  const onOpenCard = () => {
    //console.log("OPEN CARD")
    const indexes = [...indexesCard]
    if (indexes.length === 0) return;  // if(!!indexes.length) {
    const index = indexes.slice(indexes.length - 1);
    setIndexesCard(indexes.slice(0, indexes.length - 1));
    setOpenCard([...openCard, index[0]]) // }
  }

  const onAddCard = (deckNum) => {
    console.log("onAddCard ")
    const opens = [...openCard]
    //console.log(opens)
    const child = opens.slice(opens.length - 1);
    if (deckNum >= dropCard.length)
      return onAddCardBaseFromOpen(deckNum, child[0])
    const deckToCopy = [...dropCard[deckNum]]
    const childIn = deckToCopy.slice(deckToCopy.length - 1);
    //console.log(dropCard)
    //console.log("CHILDIN " + JSON.stringify(childIn[0]) + " " + JSON.stringify(child[0]))
    if (childIn.length === 0 || isCanDropCard(deckCard[child[0]], deckCard[childIn[0]])) {
      setOpenCard(opens.slice(0, opens.length - 1));
      setDropCard(dropCard =>
          dropCard.map((item, index) =>
              index === deckNum
                  ? [...deckToCopy, ...child]
                  : item
          )
      )
      //console.log("TRUE")
      return true;
    }
    //console.log("FALSE")
    //console.log(dropCard)
    return false;
  }
  const onAddCardBaseFromOpen = (deckTo, child) => {
    //console.log("onAddCardBaseFromOpen ")
    const baseIndex = deckTo - dropCard.length;
    //console.log(baseIndex)
    const baseToCopy = [...baseCard[baseIndex]]
    const opens = [...openCard]
    //console.log(baseToCopy)

    const childIn = baseToCopy.slice(baseToCopy.length - 1);
    //console.log(child)
    //console.log(childIn[0])
    //console.log(isCanDropCardBase(deckCard[child], deckCard[childIn[0]]))
    if (isCanDropCardBase(deckCard[child], deckCard[childIn[0]])) {
      setOpenCard(opens.slice(0, opens.length - 1));
      setBaseCard(baseCard =>
          baseCard.map((item, index) =>
              index === baseIndex
                  ? [...baseToCopy, child]
                  : item
          )
      )
      //console.log("TRUE")
      //console.log("onAddCardBase END " + JSON.stringify(baseCard))
      return true;
    }
    return false;
  }

  const onAddCardFromDrop = (deckTo, deckFrom, cardID) => {
    //console.log("onAddCardFromDrop ")
    //console.log(deckFrom)
    //console.log(deckTo)
    if (deckTo >= dropCard.length)
      return onAddCardBaseFromDrop(deckTo, deckFrom, cardID)
    const drops = [...dropCard]
    const deckFromCopy = [...drops[deckFrom]]
    const deckToCopy = [...drops[deckTo]]
    const indexCard = deckFromCopy.indexOf(deckFromCopy.filter(cur => cur === cardID)[0]) // filter is not guarded
    const child = deckFromCopy.slice(indexCard);
    const childLeft = deckFromCopy.slice(0, indexCard);
    //console.log("INDEX " + JSON.stringify(child[0]) + " " + JSON.stringify(childLeft))
    const childTo = deckToCopy.slice(deckToCopy.length-1);

    if (deckToCopy.length === 0 || isCanDropCard(deckCard[child[0]], deckCard[childTo[0]])) {
      setDropCard(dropCard =>
          dropCard.map((item, index) =>
              index === deckFrom
                  ? childLeft
                  :
                  (index === deckTo)
                      ? [...deckToCopy, ...child]
                      : item
          )
      )
      const closeCard = deckFromCopy.slice(indexCard - 1);
      if (closeCard[0] != null)
        dispatch(updateClosed(closedCards.filter((item => item !== closeCard[0]))));
      return true;
    }
    return false;
    //console.log("onAddCardFromDrop END " + JSON.stringify(dropCard))
  }
  const onAddCardBaseFromDrop = (deckTo, deckFrom, cardID) => {
    //console.log("onAddCardBase ")
    const deckFromCopy = [...dropCard[deckFrom]]
    const baseIndex = deckTo - dropCard.length;
    const baseToCopy = [...baseCard[baseIndex]]
    const indexCard = deckFromCopy.indexOf(deckFromCopy.filter(cur => cur === cardID)[0]) // unguarded filter
    //console.log("INDEX " + indexCard)
    //console.log("INDEX cardID " + cardID)
    //console.log("INDEX deckFromCopy " + deckFromCopy)
    const child = deckFromCopy.slice(indexCard);
    const childLeft = deckFromCopy.slice(0, indexCard);
    const baseLeft = baseToCopy.slice(baseToCopy.length-1);

    //console.log("INDEX " + JSON.stringify(child[0]) + " " + JSON.stringify(childLeft))
    //console.log("dropCard " + JSON.stringify(dropCard))
    if (isCanDropCardBase(deckCard[child[0]], deckCard[baseLeft[0]])) {
      setDropCard(dropCard =>
          dropCard.map((item, index) =>
              index === deckFrom
                  ? childLeft
                  : item
          )
      )
      setBaseCard(baseCard =>
          baseCard.map((item, index) =>
              index === baseIndex
                  ? [...baseToCopy, ...child]
                  : item
          )
      )
      const closeCard = deckFromCopy.slice(indexCard-1);
      if(closeCard[0] != null)
        dispatch(updateClosed(closedCards.filter((item => item !== closeCard[0]))));
      return true;
    }
    //console.log("onAddCardBase END " + JSON.stringify(dropCard))
    //console.log("onAddCardBase END " + JSON.stringify(baseCard))
    return false;
  }

  const returnCards = () => {
    //console.log("RETURN CARDS")
    const opens = [...openCard]
    if (opens.length === 0) return;
    setIndexesCard(opens.reverse());
    setOpenCard([]);
  }
  return (
      <View style={styles.container} ref={dropContainerRef}
            onLayout={() => updateDropMeusere()}>
        <View style={styles.deckContainer}>
          <CardDeck children={indexesCard} onOpenCard={onOpenCard}
                    returnCards={returnCards}/>
          <OpenDeck children={openCard} isDropZone={isDropZone} onAddCard={onAddCard}/>
          <View style={{width: 50}}/>
          {dropBases.map((dropRef, index) =>
              <CardBase key={index} ref={dropRef} children={baseCard[index]}
                        isDropZone={isDropZone} onLayout={isDropZone.bind(this)}/>
          )}
          <Button  title="New game"
                   onPress={newGame} />
        </View>
        <View style={styles.deckContainer}>
          {dropRefs.map((dropRef, index) =>
              <DropDeck children={dropCard[index]} key={index} deckNum={index}
                        isDropZone={isDropZone} onAddCard={onAddCardFromDrop} ref={dropRef}
                        onLayout={isDropZone.bind(this)}/>
          )}
        </View>

      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  deckContainer: {
    flexDirection: "row"
  }
});

export default App;
