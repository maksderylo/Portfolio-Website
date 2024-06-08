import React from 'react';
import { useEffect, useState , useRef} from 'react';
import Xarrow from 'react-xarrows';
import '../styles/roadmap.css'
import RoadmapItem from './RoadmapItem';
import {client} from "./lib/client";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Roadmap = (props) => {
    let newDataByCategory = {};
    const [activeCategory, setActiveCategory] = useState({});
    const [category, setCategory] = useState([]);
    const [dataByCategory, setDataByCategory] = useState({});
    const [selected, setSelected] = useState('Roadmap');
    const [navigation, setNavigation] = useState(false);

    useEffect(()=>{
        client.fetch(
            `*[_type =="post"] {
                title,
                readtime,
                slug,
                body,
                publishedAt,
                "category": category->Name,
                mainImage {
                    asset -> {
                        _id,
                        url
                    },
                    alt,
                },
                "name": postauthor -> name,
            } | order(title asc)`
        ).then((data) => {
            data.forEach((item) => {
                if (!newDataByCategory[item.category]) {
                    newDataByCategory[item.category] = [];
                }
                newDataByCategory[item.category].push(item);
            });
            setDataByCategory(newDataByCategory);
        })
        .catch(console.error);

        client.fetch(
            `*[_type =="category"] {
                Name
            } | order(Name asc)`
        ).then((data) => {
            setCategory(data);
            category.forEach((item) => {
                setActiveCategory(prevState => ({...prevState, [item.Name] : false
                }));
            });
        })
        .catch(console.error);
    }, []);

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(prevState => ({
          ...prevState,
          [categoryName]: !prevState[categoryName]
        }));
      };
    


    function handleNavigation(name){
        handleCategoryClick(name);
        setNavigation(!navigation);
    }
    

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);


    return(
        <>
         <div className='roadmap' >
                <div id='introblog'>
                    <h1>🎯Competetetive Programming Roadmap</h1>
                    <h2>Click on the nodes for topics explained with tasks examples</h2>
                </div>
                <div className='level'>
                    <RoadmapItem name='1. Basics' ref={ref1} onClick={handleNavigation} data={dataByCategory["1. Basics"]}/>
                </div>
                <div className='level'>
                    <RoadmapItem name='2. Sorting' ref={ref2} onClick={handleNavigation} data={dataByCategory["2. Sorting"]}/>
                    <RoadmapItem name='3. Simple Algorithms' ref={ref3} onClick={handleNavigation} data={dataByCategory["3. Simple Algorithms"]}/>
                </div>
                <Xarrow start={ref1} color={'#c84044'} end={ref2} startAnchor={'bottom'} endAnchor={'top'}/>
                <Xarrow start={ref1} color={'#c84044'} end={ref3} startAnchor={'bottom'} endAnchor={'top'}/>

            <motion.div className={`roadmap-navigation nav-${navigation}`} 
            initial={{
                x: "-100%"
            }}
            animate={{
                x: navigation ? "0px" : "-100%",
                transition: { duration: 0.5, ease: "easeInOut" }
            }}>
                <div className='roadmap-navigation-title'><h1>Roadmap breakdown</h1></div>
                {category.map((categoryItem) => (
                <div key={categoryItem.Name}>
                    <div onClick={() => handleCategoryClick(categoryItem.Name)} className='categoryButton'>
                        <p className={`categoryName categoryName-${activeCategory[categoryItem.Name]}`}>{categoryItem.Name}</p>
                    </div>
                    <ul className='categoryList'
                    style={activeCategory[categoryItem.Name] == true ? { maxHeight: `${32 * (dataByCategory[categoryItem.Name] ? dataByCategory[categoryItem.Name].length : 0)}px` } 
                    : {maxHeight: "0px"}}>
            
                        {dataByCategory[categoryItem.Name] ? dataByCategory[categoryItem.Name].map((post) => (
                            <li key={post.slug.current}>
                                <Link to={`/blog/${post.slug.current}`} className='categoryPost'>
                                    {post.title}
                                </Link>
                            </li>
                        )) : null}
                    </ul>

                </div>
                ))}
            
            </motion.div>
            <motion.div className='blur' onClick={() => handleNavigation()}
            animate={{
                display: navigation ? "block" : "none",
                transition: {
                    time: 2,
                    type: "spring",
                    stiffness: 20,
                    damping: 20}
            }}></motion.div>
        </div>
        </>
    );

}

export default Roadmap;