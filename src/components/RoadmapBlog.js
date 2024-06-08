import React from 'react';
import { useEffect, useState } from 'react';
import Roadmap from './Roadmap';
import Blog from './Blog';
import '../styles/roadmapblog.css'

const RoadmapBlog = (props) => {
    useEffect(() => {
        const setColorLight = () => {
            props.setColorLight();
        }
        setColorLight();
    }, [])

    const [roadmapBlog, setRoadmapBlog] = useState('roadmap');
    const [isOn, setIsOn] = useState(false);   

    const handleToggle = () => { 
        setIsOn(!isOn);
        if (roadmapBlog === 'roadmap') {
            setRoadmapBlog('blog');
        } else {
            setRoadmapBlog('roadmap');
        }
    }

    return (
        <div className='roadmapblog'>
            <div className='switch'>
                <input
                    checked={isOn}
                    onChange={handleToggle}
                    className="switch-checkbox"
                    id={`switch`}
                    type="checkbox"
                />
                <label
                    className="switch-label"
                    htmlFor={`switch`}
                >
                    <p className={`switch-button-label-roadmap`}>Roadmap</p>
                    <p className={`switch-button-label-blog`}>Blog</p>
                    <span className={`switch-button`}></span>
                </label>
            </div>
            {roadmapBlog === 'roadmap' ? 
                <Roadmap />
                :
                <Blog />
            }
        </div>
    );
}

export default RoadmapBlog;