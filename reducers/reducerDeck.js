import {CLOSED_CARDS, DECK_CARDS, UPDATE_CLOSED_CARDS} from "../utils/constants";
import {InitCards} from "../utils/cardsUtil";

const defaultState = {
    deck: InitCards(),
    closed: []
}

const redFunctions = {
    [DECK_CARDS]: s => s,
    [CLOSED_CARDS]: s => s,
    [UPDATE_CLOSED_CARDS]: (state, {closed}) => ({ ...state, closed })
}

export const reducer = (state = defaultState, action) => {
    const f = redFunctions[action.type];
    return !!f ? f(state, action) : state;
}
