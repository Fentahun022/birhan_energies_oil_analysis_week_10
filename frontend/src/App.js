// frontend/src/App.js
import React from 'react';
import './styles/App.css'; // Your main styling
import PriceChart from './components/PriceChart'; // <--- THIS LINE IS CRUCIAL

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Birhan Energies - Brent Oil Price Insights</h1>
                <p>Analyzing the impact of global events on Brent Crude Oil prices.</p>
            </header>
            <main className="App-main">
                <PriceChart /> {/* <--- THIS USAGE IS CRUCIAL */}
                {/* You can add other components here, e.g., filters, more detailed tables */}
            </main>
            <footer className="App-footer">
                <p>© 2025 Birhan Energies. Data-driven insights for the energy sector.</p>
            </footer>
        </div>
    );
}

export default App;