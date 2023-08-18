import React from 'react';
import {client} from "./lib/client";
import {format} from "date-fns";
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
// RichTextComponents.tsx
import Refractor from "react-refractor";
// Load any languages you want to use from `refractor`
import js from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import tsx from "refractor/lang/tsx";

// Barebones lazy-loaded image component
Refractor.registerLanguage(js);
Refractor.registerLanguage(typescript);
Refractor.registerLanguage(tsx);

const RichTextComponents = {
    types: {
      myCodeField: ({ value }) => {
          return (
            <Refractor language={value.language} value={value.code} />
          );
      },
    },
  }

const Blogpost = (props) => {
    const setColorLight = () =>{
        props.setColorLight();
    }
    

    const [blogpost, setBlogpost] = useState([]);
    const {slug} =useParams();


    useEffect(()=>{
        setColorLight();
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
            console.log(blogpost.body);
        })
        .catch(console.error);
    }, []);

    useEffect(() =>{
        document.title = `${blogpost.title}`

    }, [slug])

    return(
        <>
        {blogpost && <section>
            <h1>{blogpost.title}</h1>
            <div className='blogpostbody'>
            <PortableText value={blogpost.body} components={RichTextComponents}/>
            </div>
            </section>}
        </>
    );

}

export default Blogpost;