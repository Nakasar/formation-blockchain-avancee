import {BrowserRouter as Router, NavLink, Switch, Redirect, Route} from "react-router-dom";
import Verify from "./pages/Verify/Verify";
import Issue from "./pages/Issue/Issue";
import Manage from "./pages/Manage/Manage";

function App() {
  return (
    <Router>
      <div style={{ margin: '8px', fontFamily: 'sans-serif' }}>
        <header style={{ borderBottom: '1px solid black'}}>
          <h1>🎉 Ethereum Advanced {new Date().getFullYear()}</h1>
          <nav>
            <NavLink to="/issue">Issuance</NavLink>
            <NavLink to="/verify">Verification</NavLink>
            <NavLink to="/manage">Management</NavLink>
          </nav>
        </header>

        <Switch>
          <Route path="/verify" component={Verify} />
          <Route path="/issue" component={Issue} />
          <Route path="/manage" component={Manage} />
          <Route path="/" exact>
            <main>
              <p>
                Pour afficher ce site, vous avez normalement lancé la commande <code>npm run start</code>.
                <br/>
                Pour construire un build de production, utilisez plutôt <code>npm run build</code>.
              </p>

              <p>
                Sur cette interface, vous allez implémenter différentes vues pour l'ensemble des fonctionnalités.
                <br/>
                Pour vous simplifier la tâche (et parce que nous sommes là pour la blockhain et non React), cette application web
                est déjà configurée avec un routeur et les vues dont vous aurez besoin. Il n'y a <em>plus qu'à</em> installer
                les dépendances pour le monde décentralisé et à plonger dans cet univers merveilleux !
                <br/>
                Si vous êtes allergique à React ou à la librairie X ou Y, vous pouvez tout à fait recommencer selon vos propres règles.
              </p>

              <p>
                Ce qui est inclus dans l'application par défaut :
                <ul>
                  <li>React (et ses dépendances)</li>
                  <li>React Router</li>
                </ul>
              </p>
            </main>
          </Route>
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
