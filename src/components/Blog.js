import React from 'react';
import { useEffect, useState } from 'react';
import {client} from "./lib/client";
import {format} from "date-fns";
import { Link } from 'react-router-dom';

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
    }, []);


    return(
        <>
        
        {stories.map((story) => (
            <Link to={`/blog/${story.slug.current}`} key={story.slug.current}>
                <h1>{story.title}</h1>
                <p>{story.name} &middot; {format(new Date(story.publishedAt), "dd MMMM yyyy")}</p>
                <p>{story.readtime}</p>
                
            </Link>
        ))}
        </>
    );

}

export default Blog;