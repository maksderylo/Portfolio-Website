import React from 'react';
import '../styles/roadmapitem.css'


const RoadmapItem = React.forwardRef(({ name, onClick }, ref) => {
    return (
        <div ref={ref} onClick={() => onClick(name)} className="level-item">
            <h1>{name}</h1> 
        </div>
    );
});

export default RoadmapItem;