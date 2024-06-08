import React from 'react';
import { useEffect, useState } from 'react';
import {client} from "./lib/client";
import {format} from "date-fns";
import { Link } from 'react-router-dom';
import '../styles/blog.css'



const Blog = () => {

    const [stories, setStories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dataByCategory, setDataByCategory] = useState({});
    const [selected, setSelected] = useState('Roadmap');

    

    useEffect(()=>{
        client.fetch(
            `*[_type =="post"] {
                title,
                readtime,
                slug,
                body,
                publishedAt,
                category,
                mainImage {
                    asset -> {
                        _id,
                        url
                    },
                    alt,
                },
                "name": postauthor -> name,
            } | order(publishedAt desc)`
        ).then((data) => {
            setStories(data);
        })
        .catch(console.error);

    }, []);



    return(
        <>
            <div className='blogPosts'>
                <div id='introblog'>
                    <h1>📄Recent Posts by Maks Deryło</h1>
                    <h2>Looking for a post to read? I continiously update tutorials and explenations related to Software Developlent!</h2>
                </div>
                <div className='smallspace'></div>

                <div className='posts'>
                {stories.map((story) => (
                    <Link className='post' to={`/blog/${story.slug.current}`} key={story.slug.current}>
                        <h1 className='blogtitle'>{story.title}</h1>
                        <p className='postbody'>{`${story.body[0].children[0].text.substring(0, 200)}...`}</p>
                        <p className='postdate'>{format(new Date(story.publishedAt), "dd MMMM yyyy")} - {story.name}</p>
                        <p className='readtime'>Read time: {story.readtime} minutes</p>
                        <p></p>
                    </Link>
                ))}
                </div> 
            </div>
        </>
    );

}

export default Blog;