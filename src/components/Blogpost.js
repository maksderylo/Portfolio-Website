import React from 'react';
import {client} from "./lib/client";
import {format} from "date-fns";
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import urlBuilder from '@sanity/image-url'
import {getImageDimensions} from '@sanity/asset-utils'

const serializers = {
    types: {
      code: ({value = {}}) => (
        <SyntaxHighlighter language={value.language}>
        {value.code}
      </SyntaxHighlighter>
        ),
        image: ({value, isInline}) => {
            const {width, height} = getImageDimensions(value)
            return (
              <img
                src={urlBuilder()
                  .image(value)
                  .width(isInline ? 100 : 800)
                  .fit('max')
                  .auto('format')
                  .url()}
                alt={value.alt || ' '}
                style={{
                  // Display alongside text if image appears inside a block text span
                  display: isInline ? 'inline-block' : 'block',
          
                  // Avoid jumping around with aspect-ratio CSS property
                  aspectRatio: width / height,
                }}
              />
            )
          }
    
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