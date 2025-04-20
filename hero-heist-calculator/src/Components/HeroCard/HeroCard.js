import React, { useState, useEffect } from 'react';
import './HeroCard.css'; // Optional: Import CSS for styling

const HeroCard = ({ name, initialHp, maxHp, dmg, heal, speed, range, energy, team, initialStatus, watchTurn, onSuperClick }) => {
    // Ensure initialHp is treated as an integer, with a fallback to 0 if invalid
    const [hp, setHp] = useState(initialHp);
    const [status, setStatus] = useState(initialStatus || 'Normal');
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (watchTurn) {
            console.log(name + " is watching turn " + watchTurn);

            // If it is the team's turn, the hero's statuses are decremented
            // If the duration reaches 0, the status is set to normal
            if (duration <= 1) {
                if (status === 'Dead') {
                    setHp(maxHp);
                }
                setStatus('Normal');
                setDuration(0);
            } else {
                setDuration(duration - 1);
            }
        }
    }, [watchTurn]);

    useEffect(() => {
        setHp(initialHp); // Update HP when initialHp changes
        setStatus(initialStatus); // Update status when initialStatus changes
    }, [initialHp, initialStatus]);

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'hero', name: name, team: team, dmg: dmg, heal: heal })); // Set the data to be transferred
        console.log(`Dragging Hero: ${name}`); // Log the hero being dragged
    };

    const handleDragEnd = () => {
        console.log(`Drag ended for Hero: ${name}`); // Log when the drag ends
    };

    const handleDrop = (e) => {
        e.preventDefault(); // Prevent default behavior
        const data = e.dataTransfer.getData('text/plain'); // Get the transferred data
        const draggedItem = JSON.parse(data); // Parse the data
        console.log(`Dropped on Hero: ${name}`); // Log the hero card that was dropped on

        // Handle logic based on the dragged item type
        if (draggedItem.type === 'hp') {
            // Handle HP card drop logic here
            const newHp = Math.min(hp + draggedItem.value, maxHp); // Ensure HP does not exceed maxHp
            setHp(newHp); // Update HP state
            // If the hero reaches 0 HP, they are set to dead
            if (newHp <= 0) {
                setHp(0);
                setStatus('Dead');
                setDuration(3);
            }
            console.log(`HP value: ${draggedItem.value} dropped on ${name}. New HP: ${newHp}`);
        } else if (draggedItem.type === 'status') {
            // Handle Status card drop logic here
            console.log(`Status: ${draggedItem.value} dropped on ${name}`);
            if (draggedItem.value === 'Normal') {
                // If the dragged status is "normal" remove any existing status
                // Set the hero's HP to maxHp if they were previously dead
                if (status === 'Dead') {
                    setHp(maxHp);
                }
                setStatus('Normal');
                setDuration(0);
            } else if (draggedItem.value === 'Dead') {
                // If the dragged status is "dead" set the hero's HP to 0
                // Heroes stay dead for 3 turns
                setHp(0);
                setStatus('Dead');
                setDuration(3);
            } else {
                // Any other status is applied and incremented by 1 turn if the same as the existing status
                if (status === draggedItem.value) {
                    setDuration(duration + 1);
                } else {
                    setStatus(draggedItem.value);
                    setDuration(1);
                }
            }
        } else if (draggedItem.type === 'hero') {
            // Handle logic for dropping another hero card
            console.log(`Hero ${draggedItem.name} dropped on ${name}`);
            // If the hero is on the same team, add the dragged hero's heal to the dropped hero's hp
            if (team === draggedItem.team) {
                setHp(Math.min(hp + draggedItem.heal, maxHp));
            }
            // If the hero is on the opposite team, subtract the dragged hero's damage from the dropped hero's hp
            else {
                const newHp = hp - draggedItem.dmg;
                setHp(newHp);
                // If the hero reaches 0 HP, they are set to dead
                if (newHp <= 0) {
                    console.log(draggedItem.name + " killed " + name);
                    setHp(0);
                    setStatus('Dead');
                    setDuration(3);
                }
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow drop
    };

    return (
        <div 
            className="hero-card" 
            draggable 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver} // Keep onDragOver to allow dropping
            onDrop={handleDrop} // Drop logic is handled within the component
        >
            <h2>
                {name}
                <button className="super-button" onClick={onSuperClick}>Super</button>
            </h2>
            {status && status !== 'Normal' ? (
                <h4 className="hero-status">{status} - {duration}</h4> // Display status on a new line
            ) : null}
            <div className="stats-row">
                <div className="stat-pair">
                    <p>HP: {hp}</p>
                    <p>Energy: {energy}</p>
                </div>
                <div className="stat-pair">
                    <p>Speed: {speed}</p>
                    <p>Range: {range}</p>
                </div>
                <div className="stat-pair">
                    <p>Damage: {dmg}</p>
                    <p>Heal: {heal}</p>
                </div>
            </div>
        </div>
    );
};

export default HeroCard;
