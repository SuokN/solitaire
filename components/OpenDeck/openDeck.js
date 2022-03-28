import { View } from "react-native";
import Card from "../Card/card"
import  styles from "../card.style"

const OpenDeck = (props) => {
    if (!!props.children) {
        return (
            <View style={styles.container}>
                {props.children.map((child, index) => {
                        return <Card key={index} isDropZone={props.isDropZone}
                                     onAddCard={props.onAddCard} id={child}
                                     canMove={true}>
                        </Card>
                    }
                )}
            </View>)
    }
    return (
        <View>

        </View>
    )
}
export default OpenDeck;
