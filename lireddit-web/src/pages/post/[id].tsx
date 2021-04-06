import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Heading, Box, Flex, IconButton, Spacer } from "@chakra-ui/react";
import { useDeletePostMutation, usePostQuery } from "../../generated/graphql";
import { DeleteIcon } from "@chakra-ui/icons";

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, deletePost] = useDeletePostMutation();

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex direction="row" align="center">
        <Heading mb={4}>{data.post.title}</Heading>
        <Spacer />
        <IconButton
          variant="ghost"
          colorScheme="green"
          size="sm"
          aria-label="Delete post"
          icon={<DeleteIcon />}
          onClick={async () => {
            await deletePost({ id: data.post?._id as number });
            router.push("/");
          }}
        />
      </Flex>
      {data.post.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
