import React from "react";

import NextLink from "next/link"; // server side routing
import {
  Box,
  Flex,
  Link,
  Spacer,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(), // dont run the request in the server
  });

  let body = null;

  if (fetching) {
    // if its fetching
    body;
  } else if (!data?.me) {
    // if user not loged in
    body = (
      <Box>
        <NextLink href="/login">
          <Link mr={3}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </Box>
    );
  } else {
    body = (
      <Flex>
        <NextLink href="/create-post">
          <Button color="white" variant="link">
            create post
          </Button>
        </NextLink>
        <Box mr={2} ml={2}>
          <Text color="twitter.300">{data.me.username}</Text>
        </Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          color="white"
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="green.500"
      p={4}
      align="center"
    >
      <NextLink href="/">
        <Link>
          <Heading color="white">lireddit</Heading>
        </Link>
      </NextLink>
      <Box ml="79%" mt="25px">
        {body}
      </Box>
      <Spacer />
      <DarkModeSwitch />
    </Flex>
  );
};
