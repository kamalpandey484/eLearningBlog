import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listAllBlogsWithCategoriesAndTags } from '../../actions/blog';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import { Box, Heading, Stack, Tag, TagLabel, Divider, Link as As, Button} from '@chakra-ui/core';
import Card from '../../components/Blog/Card'
import Category from '../../components/CRUD/Category';

const Blogs = ({blogs, categories, tags, totalBlogs, blogsLimit, blogsSkip, router}) => {

  const head = () => (
    <Head>
      <title>CBSE Coaching Blogs | {APP_NAME}</title>
      <meta name="description" content="CSBE Study materials Syllabus, NCERT Solutions, sample papers, pre board papers, and more for CBSE students." />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`CBSE tutorials and study material | ${APP_NAME}`} />
      <meta
          property="og:description"
          content="CSBE Study materials Syllabus, NCERT Solutions, sample papers, pre board papers, and more for CBSE students."
      />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/static/images/cbse.jpeg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/cbse.jpeg`} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMoreBlogs = () => {
    const toSkip = skip + limit;
    listAllBlogsWithCategoriesAndTags(toSkip, limit)
      .then(data => {
        if(data.error) {
          console.log(data.error);
        } else {
          setLoadedBlogs([...loadedBlogs, ...data.blogs]);
          setSize(data.size);
          setSkip(toSkip);
        }
      })
  };

  const loadMoreButton = () => {
    return (
      size > 0 && size >= limit && (
        <Button variantColor="blue" variant="outline" onClick={loadMoreBlogs}>
          Load More
        </Button>
      )
    )
  }
  
  const showAllBlogs = () => {
    return(
      blogs.map((blog, index) =>
        <Stack key={index} mb={2}>
          <Card blog={ blog } />
        </Stack>
      )
    )
  }

  const showAllCategories = () => {
    return(
      categories.map((category, index) => 
      <Tag
        rounded="full"
        variant="solid"
        variantColor="pink"
        key={index}
        ml={1}
        mb={1}
      >
        <TagLabel>
          <Link href={`/categories/${category.slug}`}>
            <As>
              {category.name}
            </As>
          </Link>
        </TagLabel>
      </Tag>
      )
    )
  }

  const showAllTags = () => {
    return(
      tags.map((tag, index) => 
      <Tag
        rounded="full"
        variant="solid"
        variantColor="green"
        key={index}
        ml={1}
        mb={1}
      >
        <TagLabel>
          <Link href={`/tags/${tag.slug}`}>
            <As>
              {tag.name}
            </As>
          </Link>
        </TagLabel>
      </Tag>
      )
    )
  }

  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, index) => (
      <Stack key={index} mb={2}>
        <Card blog={ blog } />
      </Stack>
    ))
  }

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
        <Box ml={[3, 3, 3, 20]} mr={[3, 3, 3, 20]}>
          <Box>
            <header>
              <Heading as="h1" size="2xl" textAlign="center" mt={5}>Latest Blogs</Heading>
            </header>
          </Box>
          <Box p={5} display={{ md: "flex" }}>
            <Box flexShrink="0" maxWidth={["100%", "100%", "100%", "70%"]} border="1px" borderRadius="md" borderColor="gray.200" p={5}>
              { showAllBlogs() }
              { showLoadedBlogs() }
              <Box textAlign="center">{ loadMoreButton() }</Box>
            </Box>
            <Box flexShrink="0" maxWidth={["100%", "100%", "100%", "30%"]} border="1px" borderRadius="md" borderColor="gray.200" p={5}>
              <Heading as="h3" size="lg" textAlign="center">
                All categories
              </Heading>
              <Box mt={3}>
                {showAllCategories()}
              </Box>
              <Divider />
              <Heading as="h3" size="lg" textAlign="center" mt={5}>
                All Tags
              </Heading>
              <Box mt={3} >
                {showAllTags()}
              </Box>
            </Box>
          </Box>
        </Box>
      </main>
      </Layout>
    </React.Fragment>
  )
}

Blogs.getInitialProps = () => {
  const skip = 0; 
  const limit = 5;
  return (
    listAllBlogsWithCategoriesAndTags(skip, limit)
      .then(data => {
        if(data.error) {
          console.log(data.error);
        } else {
          return {
            blogs: data.blogs,
            categories: data.categories,
            tags: data.tags,
            totalBlogs: data.size,
            blogsLimit: limit,
            blogsSkip: skip,
          }
        }
      })
  )
}

export default withRouter(Blogs);
