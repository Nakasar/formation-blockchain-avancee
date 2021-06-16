import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div style={{ margin: '8px', fontFamily: 'sans-serif' }}>
        <header style={{ borderBottom: '1px solid black'}}>
          <h1>🎉 Ethereum Advanced {new Date().getFullYear()}</h1>
        </header>
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
      </div>
    </Router>
  );
}

export default App;
