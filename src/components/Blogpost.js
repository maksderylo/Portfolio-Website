import React from 'react';
import {client} from "./lib/client";
import {format} from "date-fns";
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


const Blogpost = (props) => {
    const setColorLight = () =>{
        props.setColorLight();
    }
    setColorLight();

    const [blogpost, setBlogpost] = useState([]);
    const {slug} =useParams();


    useEffect(()=>{
        client.fetch(
        `*[slug.current =="${slug}"] {
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
        }`
        )
        .then((data) => {
            setBlogpost(data[0]);
        })
        .catch(console.error);
    }, []);

    useEffect(() =>{
        document.title = `${blogpost.title}`

    }, [slug])

    return(
        <>
        <h1>{blogpost.title}</h1>
        </>
    );

}

export default Blogpost;