import React from 'react';
import {client} from "./lib/client";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Link } from 'react-router-dom';
import {format} from 'date-fns';

const serializers = {
    types: {
      code: ({value = {}}) => (
        <SyntaxHighlighter language={value.language}>
        {value.code}
      </SyntaxHighlighter>
        ),
        image: props => {
            return (
                <pre>{JSON.stringify(props,null, 2)}</pre>
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
            publishedAt,
            readtime,
            slug,
            body,
            myCodeField,
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
            console.log(blogpost.readtime);
        })
        .catch(console.error);
    }, []);

    useEffect(() =>{
        document.title = `${blogpost.title}`

    }, [slug])

    return(
        <>
        
        {blogpost && <section className='spostbody'>
        <div className='allpost'><Link to="/blog"><p >See all posts!</p></Link></div>
            <h1>{blogpost.title}</h1>
            {blogpost.mainImage && <img className='mainimg' src={blogpost.mainImage.asset.url} alt='img'></img>}
            <div className='blogpostbody'>
            <PortableText value={blogpost.body} components={serializers}/>
            </div>
            
            </section>}
        </>
    );

}

export default Blogpost;