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
import { PostVotes } from "../components/PostVotes";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <>
        <Heading> Something went wrong </Heading> <div>{error?.message}</div>
      </>
    );
  }

  // At delete (not cascade way), post get to a null value, so thats why !post ? null :
  return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post._id} p={5} shadow="md" borderWidth="1px">
                <PostVotes post={post} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${post._id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text color="gray.500" fontSize="xs" fontFamily="unset">
                    posted by {post.creator.username}
                  </Text>
                  <Flex align="center">
                    <Text mt={5} alignContent="center">
                      {post.textSnippet.slice(0, 50)}...
                    </Text>
                    <Box ml="auto">
                      <EditDeletePostButtons
                        postId={post._id}
                        creatorId={post.creator._id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt, // las element of the list
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
