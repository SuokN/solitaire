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
import {shiftDelta, deckLength, baseLength} from "./utils/constants";


const App = () => {
  const dispatch = useDispatch()
  const dropContainerRef = useRef(null);
  const dropRefs = Array.from(Array(deckLength), () => useRef(null));
  const dropBases =  Array.from(Array(baseLength), () => useRef(null));
  const measureDrop = useRef([])
  const deckCard = useSelector(state => state.deck)
  const [indexesCard, setIndexesCard] = useState([])//ShuffleIndexes());
  const [openCard, setOpenCard] = useState([]);
  const [dropCard, setDropCard] = useState(Array.from(Array(deckLength), () => []));
  const [baseCard, setBaseCard] = useState(Array.from(Array(baseLength), () => []));
  const closedCards = useSelector(state => state.closed);

  const newGame = () => {
    //console.log("indexesCard " + indexesCard)
    //setIndexesCard(ShuffleIndexes())
    setOpenCard([])
    setBaseCard(Array.from(Array(baseLength), () => []))
    //setDropCard(Array.from(Array(deckLength), () => []))
    initDropCards();
  }

  function updateDropMeusere() {
    //console.log('updateDropMeusere')
    if (!!dropContainerRef.current) {
      dropRefs.forEach((item) => {
        if (item.current) {
          item.current.measureLayout(
              dropContainerRef.current,
              (left, top, width, height) => {
                measureDrop.current.push({left, top, width, height});
                isDropZone.bind(measureDrop.current);
              })
        }
      })
      dropBases.forEach((item) => {
        if (item.current) {
          item.current.measureLayout(
              dropContainerRef.current,
              (left, top, width, height) => {
                measureDrop.current.push({left, top, width, height});
                isDropZone.bind(measureDrop.current);
              });
        }
      })
    }
  }

  const isDropZone = gesture => {
    //console.log("isDropZone ")
    const res = measureDrop.current.findIndex((item, i) => {
      if (!!item)
        if (gesture.moveX > item.left &&
            gesture.moveX < item.left + item.width) {
          const drop = i > dropCard.length ? undefined : dropCard[i]
          const heightDelta = (drop === undefined) ? 0 : dropCard[i].length * shiftDelta;
          measureDrop.current[i].height += heightDelta
          //console.log("isDropZone " + i)
          if (gesture.moveY > item.top &&
              gesture.moveY < item.top + item.height)
            return true;
        }
    })
    return res;
  }

  function initDropCards() {

    const length = dropCard.length;
    const nums =  [...Array(length).keys()].map(i => i);
    const adds = Array.from(Array(length), (item, i) =>
      nums.slice(0, i+1).reduce( function(result, num) {
        return result + num;
      }, 0)
    );
    //console.log(adds)
    const shuffleCards = ShuffleIndexes();
    setDropCard(dropCard => dropCard.map((item, index) =>
        shuffleCards.slice(shuffleCards.length - (index + 1) - adds[index], shuffleCards.length - adds[index])));
    const res = dropCard.map((item, index) =>
        shuffleCards.slice(shuffleCards.length -(index + 1) - adds[index], shuffleCards.length - adds[index] - 1))
   // console.log(res)
    dispatch(updateClosed(res.flat()));
    //console.log(indexesCard)
    const cards = shuffleCards.slice(0, shuffleCards.length - res.flat().length - dropCard.length)
    setIndexesCard(cards);
    //console.log(res)
    //console.log(cards)
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
    //console.log("onAddCard ")
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
          <CardDeck items={indexesCard} onOpenCard={onOpenCard}
                    returnCards={returnCards}/>
          <OpenDeck items={openCard} isDropZone={isDropZone} onAddCard={onAddCard}/>
          <View style={{width: 50}}/>
          {dropBases.map((dropRef, index) =>
              <CardBase key={index} ref={dropRef} items={baseCard[index]}
                        isDropZone={isDropZone} onLayout={isDropZone.bind(this)}/>
          )}
          <Button  title="New game"
                   onPress={newGame} />
        </View>
        <View style={styles.deckContainer}>
          {dropRefs.map((dropRef, index) =>
              <DropDeck items={dropCard[index]} key={index} deckNum={index}
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
