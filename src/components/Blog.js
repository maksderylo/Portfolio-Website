import React from 'react';
import { useEffect, useState } from 'react';
import {client} from "./lib/client";
import {format} from "date-fns";
import { Link } from 'react-router-dom';
import '../styles/blog.css'
import countapi from 'countapi-js';


const Blog = () => {
    const [stories, setStories] = useState([]);

    useEffect(()=>{
        client.fetch(
        `*[_type =="post"] {
            title,
            readtime,
            slug,
            body,
            publishedAt,
            mainImage {
                asset -> {
                    _id,
                    url
                },
                alt,
            },
            "name": author -> name,
        } | order(publishedAt desc)`
        )
        .then((data) => {
            setStories(data);
            console.log(data);
        })
        .catch(console.error);

        countapi.visits().then((result) => {
            console.log(result.value);
            console.log("sasa");
          });

    }, []);

    


    return(
        <>
        <div id='introblog'>
            <h1>📄Blog by Maks Deryło</h1>
            <h2>Looking for a post to read? I continiously update tutorials and explenations related to Software Developlent!</h2>
        </div>
        <div className='smallspace'></div>

        <div className='posts'>
        {stories.map((story) => (
            <Link className='post' to={`/blog/${story.slug.current}`} key={story.slug.current}>
                <h1 className='blogtitle'>{story.title}</h1>
                <p className='views'>TODO views</p>
                <p className='postdate'>{format(new Date(story.publishedAt), "dd MMMM yyyy")}</p>
                <p className='readtime'>Read time: {story.readtime} minutes</p>
            </Link>
        ))}
        </div>
        </>
    );

}

export default Blog;