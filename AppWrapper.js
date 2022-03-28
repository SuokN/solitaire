import App from "./App"
import {createStore} from "redux";
import {reducer} from "./reducers/reducerDeck";
import {Provider} from "react-redux";

const AppWrapper = () => {
    const store = createStore(reducer);

    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}
export default AppWrapper;