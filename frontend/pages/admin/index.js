import { Heading, Box, List, ListItem, Link as As, Divider } from "@chakra-ui/core";
import Link from 'next/link';
import Layout from '../../components/Layout';
import Admin from '../../components/Auth/Admin'

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <Heading as="h2" size="xl"m={5}>
         Admin Dashboard
        </Heading>
        <Box p={5} display={{ md: "flex" }}>
          <Box flexShrink="0" minWidth="20%" border="1px" borderRadius="md" borderColor="gray.200">
          <List spacing={3} m={3}>
            <ListItem>
              <Link href="/admin/crud/category-tag">
                <As>
                  Create Category
                </As>
              </Link>
            </ListItem>
            <Divider />
            <ListItem>
              <Link href="/admin/crud/category-tag">
                <As>
                  Create Tag
                </As>
              </Link>
            </ListItem>
            <Divider />
            <ListItem>
              <Link href="/admin/crud/blog">
                <As>
                  Create Blog
                </As>
              </Link>
            </ListItem>
          </List>
          </Box>
          <Box mt={{ base: 4, md: 0 }} p={5} minWidth="80%" border="1px" borderRadius="md" borderColor="gray.200">
            test
          </Box>
        </Box>
      </Admin>
    </Layout>
  )
}

export default AdminIndex;
