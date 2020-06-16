import { Heading, Box, Text } from "@chakra-ui/core";
import Layout from '../../../components/Layout';
import Admin from '../../../components/Auth/Admin'
import CreateBlog from '../../../components/CRUD/CreateBlog'; 

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <Heading as="h2" size="xl" m={5}>
          Create and publish blog
        </Heading>
        <Box p={5} border="1px" borderRadius="md" borderColor="gray.200">
          <CreateBlog />
        </Box>
      </Admin>
    </Layout>
  )
}

export default AdminIndex;
