import React from "react";

import NextLink from "next/link"; // server side routing
import { Box, Flex, Link, Spacer, Button } from "@chakra-ui/react";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
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
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          color="green.700"
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="green.500" p={4}>
      <Box ml="87%">{body}</Box>
      <Spacer />
      <DarkModeSwitch />
    </Flex>
  );
};
