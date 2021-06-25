import {BrowserRouter as Router} from "react-router-dom";
import {Web3ContextProvider} from "./contexts/web3.context";
import Layout from "./pages/Layout";
import {DocumentContextProvider} from "./contexts/document.context";

function App() {
    return (
        <Web3ContextProvider>
            <DocumentContextProvider>
                <Router>
                    <Layout/>
                </Router>
            </DocumentContextProvider>
        </Web3ContextProvider>
    );
}

export default App;
