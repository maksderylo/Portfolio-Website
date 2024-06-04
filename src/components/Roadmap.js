import React from 'react';
import { useEffect, useState , useRef} from 'react';
import {format} from "date-fns";
import { Link } from 'react-router-dom';
import Xarrow from 'react-xarrows';
import '../styles/roadmap.css'


const Roadmap = (props) => {

    const setColorLight = () =>{
        props.setColorLight();
    }
    useEffect(()=>{
        setColorLight();
    })
    

    const basicAlgorithm = useRef(null);
    const graphs = useRef(null);
    const advancedMath = useRef(null);


    return(
        <>
         <div className='roadmap'>
                <div className='level'>
                    <div className='level-item' ref={basicAlgorithm}>
                        <h1 className='title is-1'>Basic algorithms</h1>
                    </div>
                    

                </div>
                <div className='level'>
                    <div className='level-item' ref={graphs}>
                        <h1 className='title is-1'>Graphs</h1>
                    </div>
                    <div className='level-item' ref={advancedMath}>
                        <h1 className='title is-1'>advancedMath</h1>
                    </div>
                </div>
                <Xarrow start={basicAlgorithm} color={'#c84044'} end={advancedMath} startAnchor={'bottom'} endAnchor={'top'}/>
                <Xarrow start={basicAlgorithm} color={'#c84044'} end={graphs} startAnchor={'bottom'} endAnchor={'top'}/>

        </div>
        </>
    );

}

export default Roadmap;