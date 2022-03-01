import {numberCards, suits, colors} from "./constants"
import {cardParams} from "./orderCards"

export const InitCards = () =>{
    const cards = [];
    const numCount = numberCards.length;
    const count = numCount * suits.length;
    for (j = 0; j < count; ++j)
    {
        const index = Math.floor(j / numCount)
        const card = new cardParams(
            suits[index],
            numberCards[j - index * numCount]
        )
        cards.push(card)
    }
    return cards;
}
export const ShuffleIndexes = () =>
{
    const numCount = numberCards.length;
    const count = numCount * suits.length;
    const indexes = [...Array(count).keys()].map(i => i)
    for (let i = 0; i < count; ++i)
    {
        let index = Math.floor(Math.random() * count)
        let tmp = indexes[index]
        indexes[index] = indexes[i]
        indexes[i] = tmp;
    }
    return indexes;
}