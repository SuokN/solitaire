import {suits, colors} from "./constants"

//card class
export class cardParams{
    constructor(suit, value, isSuit){
        this.suit = suit;
        if(this.suit === suits[0] || this.suit === suits[1])
            this.color = colors[0];
        else this.color = colors[1];
       this.value = value;
       this.isSuit = isSuit;
    }
}
//can drop card from open deck to drop or from drop to drop
export const isCanDropCard = (cardDrop, cardInDeck) =>
{
    if (cardInDeck === null) return true;
    if (cardInDeck.color === cardDrop.color) return false;
    if (cardDrop.value === cardInDeck.value - 1) return true;
    return false;
}
//can drop card from open to base or from drop to base
export const isCanDropCardBase = (cardDrop, cardInDeck) => {
    //console.log("isCanDropCardBase " + cardDrop + " " + cardInDeck)
    if (cardInDeck === undefined && cardDrop.value === 14) return true;
    if (cardInDeck === undefined && cardDrop.value !== 14) return false;
    const val = cardInDeck.value === 14 ? 1 : cardInDeck.value;
    if (cardInDeck.suit === cardDrop.suit &&
        cardDrop.value === val + 1) {
        //console.log("isCanDropCardBase true")
        return true;
    }
    //console.log("isCanDropCardBase false")
    return false;
}