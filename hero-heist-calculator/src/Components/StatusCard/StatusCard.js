import React from 'react';
import './StatusCard.css'; // Optional: Import CSS for styling

const StatusCard = ({ status }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'status', value: status })); // Set the data to be transferred
        console.log(`Dragging Status Card: ${status}`); // Log the status being dragged
    };

    const handleDragEnd = () => {
        console.log(`Drag ended for Status Card: ${status}`); // Log when the drag ends
    };

    return (
        <div 
            className="status-card"
            draggable 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
        >
            <h2>{status}</h2>
        </div>
    );
};

export default StatusCard;