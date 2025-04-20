import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './IndexPage.css';
import HeroCard from '../HeroCard/HeroCard';
import HpCard from '../HpCard/HpCard';
import StatusCard from '../StatusCard/StatusCard';

function IndexPage() {
    const [heroes, setHeroes] = useState([]);
    const [heroData, setHeroData] = useState([]); // State to hold detailed hero data
    const [selectedHeroes, setSelectedHeroes] = useState(Array(6).fill('')); // State to hold selected heroes for dropdowns

    const [team1Energy, setTeam1Energy] = useState(1);
    const [team2Energy, setTeam2Energy] = useState(0);
    const [turn, setTurn] = useState([1, 1]);

    useEffect(() => {
        // Fetch and parse the CSV file
        Papa.parse('/HHC.csv', {
            download: true,
            header: true,
            complete: (results) => {
                if (results.errors.length) {
                    console.error('Errors while parsing CSV:', results.errors);
                } else {
                    const parsedHeroes = results.data.map(hero => ({
                        name: hero['Hero Name'],
                        hp: parseInt(hero['HP'], 10),
                        maxHp: parseInt(hero['HP'], 10), // Store max HP
                        speed: parseInt(hero['Speed'], 10),
                        dmg: parseInt(hero['Dmg'], 10),
                        heal: parseInt(hero['Heals'], 10),
                        range: parseInt(hero['Range'], 10),
                        energyCost: parseInt(hero['Energy Cost'], 10),
                    }));
                    console.log('Parsed Hero Data:', parsedHeroes); // Print parsed hero data to the console
                    setHeroes(parsedHeroes.map(hero => hero.name)); // Set only hero names for dropdowns
                    setHeroData(parsedHeroes); // Set detailed hero data
                }
            },
            error: (error) => {
                console.error('Error fetching CSV:', error);
            }
        });
    }, []);

    const handleSelectChange = (index, event) => {
        const newSelectedHeroes = [...selectedHeroes];
        newSelectedHeroes[index] = event.target.value; // Update the selected hero for the specific dropdown
        setSelectedHeroes(newSelectedHeroes);
    };

    const handleEndTurn = () => {
        // Logic to handle end turn
        console.log('End Turn button clicked'); // Placeholder for actual logic
        // You can add logic here to update the turn or reset states as needed
        if (turn[0] === 1) {
            setTurn([2, turn[1]]);
            setTeam2Energy(team2Energy + 1);
        } else {
            setTurn([1, turn[1] + 1]);
            setTeam1Energy(team1Energy + 1);
        }
    };

    const handleSuperClick = (energyCost) => {
        if (turn[0] === 1 && team1Energy >= energyCost) {
            setTeam1Energy(prevEnergy => Math.max(prevEnergy - energyCost, 0)); // Subtract energy cost for Team 1
        } else if (turn[0] === 2 && team2Energy >= energyCost) {
            setTeam2Energy(prevEnergy => Math.max(prevEnergy - energyCost, 0)); // Subtract energy cost for Team 2
        }
    };

    return (
        <div className="index-page">
            <div className="title-wrapper">
                <h1 className="title">Hero Heist Calculator</h1>
            </div>
            <div className="turn-wrapper">
                <h3 className="turn">Team: {turn[0]}, Turn: {turn[1]}</h3>
            </div>
            <div className="dropdown-wrapper">
                {/* First group of 3 dropdowns */}
                <div className="dropdown-group">
                    {Array.from({ length: 3 }, (_, index) => (
                        <select key={index} onChange={(e) => handleSelectChange(index, e)}>
                            <option value="">Select a hero</option>
                            {heroes.map((hero, heroIndex) => (
                                <option key={heroIndex} value={hero}>{hero}</option>
                            ))}
                        </select>
                    ))}
                </div>
                {/* Second group of 3 dropdowns */}
                <div className="dropdown-group">
                    {Array.from({ length: 3 }, (_, index) => (
                        <select key={index + 3} onChange={(e) => handleSelectChange(index + 3, e)}>
                            <option value="">Select a hero</option>
                            {heroes.map((hero, heroIndex) => (
                                <option key={heroIndex} value={hero}>{hero}</option>
                            ))}
                        </select>
                    ))}
                </div>
            </div>
            <div className="calculator-area">
                <div className="team1-area">
                    <h3 className="t1-energy">Team 1 Energy: {team1Energy}</h3>
                    {selectedHeroes.slice(0, 3).map((selectedHero, index) => {
                        const hero = heroData.find(h => h.name === selectedHero);
                        return hero ? (
                            <HeroCard 
                                key={index} 
                                name={hero.name} 
                                initialHp={hero.hp} 
                                maxHp={hero.maxHp} // Use maxHp from hero data
                                dmg={hero.dmg} 
                                heal={hero.heal} 
                                speed={hero.speed} 
                                range={hero.range} 
                                energy={hero.energyCost} 
                                initialStatus={"Normal"}
                                team={1}
                                watchTurn={turn[0] === 1 ? turn[1] : null}
                                onSuperClick={() => handleSuperClick(hero.energyCost)}
                            />
                        ) : null;
                    })}
                </div>
                <div className="hp-area">
                    <h3 className="hp-title">Hp Cards</h3>
                    {[50, 30, 10, -10, -30, -50].map((hpValue, index) => (
                        <HpCard 
                            key={index} 
                            hp={hpValue} 
                        />
                    ))}
                </div>
                <div className="status-area">
                    <h3 className="status-title">Status Cards</h3>
                    {['Normal', 'Dead', 'Slowed', 'Speed', 'Stunned', 'Blinded', 'Blinking'].map((status, index) => (
                        <StatusCard 
                            key={index} 
                            status={status} 
                        />
                    ))}
                </div>
                <div className="team2-area">
                    <h3 className="t2-energy">Team 2 Energy: {team2Energy}</h3>
                    {selectedHeroes.slice(3, 6).map((selectedHero, index) => {
                        const hero = heroData.find(h => h.name === selectedHero);
                        return hero ? (
                            <HeroCard 
                                key={index + 3} 
                                name={hero.name} 
                                initialHp={hero.hp} 
                                maxHp={hero.maxHp} // Use maxHp from hero data
                                dmg={hero.dmg} 
                                heal={hero.heal} 
                                speed={hero.speed} 
                                range={hero.range} 
                                energy={hero.energyCost} 
                                initialStatus={"Normal"}
                                team={2}
                                watchTurn={turn[0] === 2 ? turn[1] : null}
                                onSuperClick={() => handleSuperClick(hero.energyCost)}
                            />
                        ) : null;
                    })}
                </div>
            </div>
            <button className="end-turn-button" onClick={handleEndTurn}>End Turn</button>
        </div>
    );
}

export default IndexPage;