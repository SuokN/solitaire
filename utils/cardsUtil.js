import {numberCards, suits, colors} from "./constants"
import {cardParams} from "./orderCards"

export const InitCards = () =>{
    //console.log("INIT CARD");
    const numCount = numberCards.length;
    const count = numCount * suits.length;
    const cards = Array.from(Array(count), (item, j) => {
            const index = Math.floor(j / numCount)
            return new cardParams(
                suits[index],
                numberCards[j - index * numCount]
            )
        }
    )
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