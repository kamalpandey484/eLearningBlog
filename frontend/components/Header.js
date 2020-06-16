import { Box, Heading, Flex, Text, Button, ButtonGroup, Link as As, useColorMode, Icon, List } from "@chakra-ui/core";
import { APP_NAME } from "../config"
import Link from 'next/link';
import { signout, isAuth } from '../actions/auth';
import Router from 'next/router';
import NProgress from 'nprogress';
import '.././node_modules/nprogress/nprogress.css';
import '../static/css/styles.css'

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

const signOut = () => {
  signout(() => {
    Router.push('/signin');
  });
}

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = props => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="#3182CE"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
          <Link href="/"><As>{APP_NAME}</As></Link>
        </Heading>
      </Flex>

      <Box display={{ sm: "block", md: "none" }} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
      >
          {/* <MenuItems>Docs</MenuItems>
          <MenuItems>Examples</MenuItems>
          <MenuItems>Blog</MenuItems> */}
          <MenuItems>
            <Link href="/blogs">
              <As>Blogs</As>
            </Link>
          </MenuItems>
      </Box>

      <Box
        display={{ sm: show ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        {isAuth() && isAuth().role === 1 && (
          <Button variantColor="pink" variant="solid" mr={4}>
            <Link href="/admin">
              <As>{`${isAuth().name}'s Dashboard`}</As>
            </Link>
          </Button>
        )}
      </Box>

      <Box
        display={{ sm: show ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        {isAuth() ?
          (<Button bg="transparent" border="1px" >
            <As onClick={() => signOut()}>signout</As>
          </Button>) :
          (<ButtonGroup spacing={4}>
            <Button bg="transparent" border="1px">
              <Link href="/signin">
                <As>Signin</As>
              </Link>
            </Button>
            <Button bg="transparent" border="1px" >
              <Link href="/signup">
                <As>Signup</As>
              </Link>
            </Button>
          </ButtonGroup>)
        }
      </Box>
      <Box
        display={{ sm: show ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Button onClick={toggleColorMode} ml={4}>
          {colorMode === "light" ?
            <Icon name="moon" size="25px" color="black" /> :
            <Icon name="sun" size="25px" />}
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
