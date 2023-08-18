import React from 'react';
import {client} from "./lib/client";
import {format} from "date-fns";
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';

const serializers = {
    types: {
      code: props => <pre><code>{props.value.code}</code></pre>
    }
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
            myCodeField,
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
            <PortableText value={blogpost.body} components={serializers}/>
            </div>
            </section>}
        </>
    );

}

export default Blogpost;