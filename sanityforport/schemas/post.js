import { type } from "@testing-library/user-event/dist/type"
import { validateBasePaths } from "sanity"
import author from "./author"
import category from "./category"

const post = {
  title: 'Post',
  name: 'post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'readtime',
      title: 'Readtime',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image'
    },
    {
      name: 'postauthor',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
        type: 'block',
        title: 'Block',
        styles: [
          {title: 'Normal', value: 'normal'},
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
        ],
        lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Numbered', value: 'numbered'}],

        marks: {

        }
        },
        {
          type: 'code',
          title: 'Code'
        },
        {
          type: 'image',
          title: 'Image'
        }
      ]
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}

export default post
