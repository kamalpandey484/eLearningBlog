import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { singleBlog } from '../../actions/blog';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import { Box, Heading, Stack, Tag, TagLabel, Divider, Link as As, Button, Text, Badge} from '@chakra-ui/core';
import renderHtml from 'react-render-html';
import moment from 'moment';

const SingleBlog = ({ blog, query }) => {

  const head = () => (
    <Head>
      <title>{blog.title} | {APP_NAME}</title>
      <meta name="description" content={blog.metaDesc} />
      <link rel="canonical" href={`${DOMAIN}/${query.slug}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta
          property="og:description"
          content={blog.metaDesc}
      />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
      <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

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
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <Stack>
            <Box pl={[3, 3, 3, 20]} pr={[3, 3, 3, 20]} mt={[3, 3, 3, 10]}>
              <header>
                <Heading as="h3" size="lg">
                  { blog.title.toUpperCase() }
                </Heading>
              </header>
              <section>
                <Text fontSize="sm" pt={2}>
                  Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                </Text>
              </section>
              <section>
                <Box pt={2}>
                  {showBlogCategories(blog)}
                  {showBlogTags(blog)}
                </Box>
              </section>
              <Divider />
              <Box mt={[3, 3, 3, 5]}>
                <section>
                  {renderHtml(blog.body)}
                </section>
              </Box>
              <Divider />
              <Box pb={[3, 3, 3, 5]} pt={[3, 3, 3, 5]}>
                <Heading as="h3" size="lg" textAlign="center">
                  Related Blogs
                </Heading>
              </Box>
              <Divider />
              <Box pb={[3, 3, 3, 5]} pt={[3, 3, 3, 5]}>
                <Heading as="h3" size="lg">
                  Comments
                </Heading>
              </Box>
            </Box>
          </Stack>
        </main>
      </Layout>
    </React.Fragment>
  )
}

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug)
    .then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        return { blog: data, query };
      }
    })
}

export default SingleBlog;
