import {DECK_CARDS, UPDATE_CLOSED_CARDS} from "../utils/constants";

export const  getDeck = () => (
    {
        type: DECK_CARDS,
        payload: null,
    }
);

export const  updateClosed = (closed) => (
    {
        type: UPDATE_CLOSED_CARDS,
        closed
    }
);