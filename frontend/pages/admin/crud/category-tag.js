import { Heading, Box, Text } from "@chakra-ui/core";
import Layout from '../../../components/Layout';
import Admin from '../../../components/Auth/Admin'
import Category from '../../../components/CRUD/Category';
import Tag from '../../../components/CRUD/Tag';

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <Heading as="h2" size="xl" m={5}>
          Manage Categories and Tags
        </Heading>
        <Box p={5} display={{ md: "flex" }}>
          <Box flexShrink="0" minWidth="50%" border="1px" borderRadius="md" borderColor="gray.200" p={5}>
            <Text textAlign="center" fontSize="xl">Categories</Text>
            <Category />
          </Box>
          <Box mt={{ base: 4, md: 0 }} minWidth="50%" border="1px" borderRadius="md" borderColor="gray.200" p={5}>
          <Text textAlign="center" fontSize="xl">Tags</Text>
            <Tag />
          </Box>
        </Box>
      </Admin>
    </Layout>
  )
}

export default AdminIndex;
