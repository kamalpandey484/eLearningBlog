import Link from 'next/link';
import {Box, Heading, Text, Link as As, Divider, Tag, TagLabel, Badge } from '@chakra-ui/core';
import renderHtml from 'react-render-html';
import moment from 'moment';

const SmallCard = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Box as="a" pl={5} pr={5} style={{ cursor: "pointer" }}>
        <header>
          <Heading as="h3" size="lg">
            { blog.title.toUpperCase() }
          </Heading>
        </header>
        <section>
            {renderHtml(blog.excerpt)}
          </section>
        <section>
          <Box fontSize="sm" mt={5}>
            Written {moment(blog.updatedAt).fromNow()} by <Text float="right">{blog.postedBy.name}</Text>
          </Box>
        </section>
      </Box>
    </Link>
  )
}

export default SmallCard;
