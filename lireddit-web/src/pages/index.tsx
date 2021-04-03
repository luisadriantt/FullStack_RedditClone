import React, { useState } from "react";
import { withUrqlClient } from "next-urql";

import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <Heading> Something went wrong </Heading>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading color="green">LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto" color="teal.500" href="#">
            create post
          </Link>
        </NextLink>
      </Flex>
      <br></br>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((post) => (
            <Box key={post._id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4} alignContent="center">
                {post.text.slice(0, 50)}...
              </Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts[data.posts.length - 1].createdAt, // las element of the list
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
