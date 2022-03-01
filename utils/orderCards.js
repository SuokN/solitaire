import {suits, colors} from "./constants"

export class cardParams{
    constructor(suit, value){
        this.suit = suit;
        if(this.suit === suits[0] || this.suit === suits[1])
            this.color = colors[0];
        else this.color = colors[1];
       this.value = value;
    }
}

export const isCanDropCard = (cardDrop, cardInDeck) =>
{
    if (cardInDeck === null) return true;
    if (cardInDeck.color == cardDrop.color) return false;
    if (cardDrop.value === cardInDeck.value - 1) return true;
    return false;
}
const isCanDropCardColor = (cardDrop, cardInDeck) =>
{    
    if (cardInDeck === null && cardDrop.value === 13) return true;
    if (cardInDeck.color == cardDrop.color &&
        cardDrop.value === cardInDeck.value + 1) return true;
    return false;
}