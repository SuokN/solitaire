import { StyleSheet } from "react-native";
import {heightCard, widthCard} from "../utils/constants";

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#E8E6E8",
        backgroundColor: "white",
        width: widthCard,
        height: heightCard,
        textAlign: 'center',
        textAlignVertical: 'center',
        flexWrap: 'nowrap',
        zIndex: 3, // works on ios
        elevation: 3
    },
    deckContainer: {
        flexDirection: "row"
    },
});

export default styles;