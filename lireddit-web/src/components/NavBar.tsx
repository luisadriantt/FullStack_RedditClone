import React from "react";

import NextLink from "next/link"; // server side routing
import { Box, Flex, Link, Spacer, Button } from "@chakra-ui/react";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();

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
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="green.500" p={4}>
      <Box ml="88%">{body}</Box>
      <Spacer />
      <DarkModeSwitch />
    </Flex>
  );
};
