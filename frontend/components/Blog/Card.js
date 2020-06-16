import Link from 'next/link';
import {Box, Heading, Text, Link as As, Divider, Tag, TagLabel, Badge } from '@chakra-ui/core';
import renderHtml from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';
import Category from '../CRUD/Category';

const Card = ({ blog }) => {

  const showBlogCategories = blog =>
    blog.categories.map((category, index) => (
      <Link key={index} href = {`/categories/${category.slug}`}>
       <Badge as="a" variantColor="pink" mr={2}>
          {category.name}
        </Badge>
      </Link>
    ))

  const showBlogTags = blog =>
    blog.tags.map((tag, index) => (
      <Link key={index} href = {`/tags/${tag.slug}`}>
        <Badge as="a" variantColor="green" mr={2}>
          {tag.name}
        </Badge>
      </Link>
    ))

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Box as="a" pl={5} pr={5} style={{ cursor: "pointer" }}>
        <header>
          <Heading as="h3" size="lg">
            { blog.title.toUpperCase() }
          </Heading>
        </header>
        <section>
          <Text fontSize="sm">
            Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
          </Text>
        </section>
        <section>
          {showBlogCategories(blog)}
          {showBlogTags(blog)}
        </section>
        <Box>
          <section>
            {renderHtml(blog.excerpt)}
          </section>
        </Box>
        <Divider />
      </Box>
    </Link>
  )
}

export default Card;
