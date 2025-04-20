import React from 'react';
import './HpCard.css'; // Optional: Import CSS for styling

const HpCard = ({hp}) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'hp', value: hp })); // Set the data to be transferred
        console.log(`Dragging HP Card: ${hp}`); // Log the HP value being dragged
    };

    const handleDragEnd = () => {
        console.log(`Drag ended for HP Card: ${hp}`); // Log when the drag ends
    };

    return (
        <div 
            className="hp-card"
            draggable 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
        >
            <h2>{hp}</h2>
        </div>
    );
};

export default HpCard;