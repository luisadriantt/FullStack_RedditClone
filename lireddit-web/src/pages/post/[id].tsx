import React from "react";
import { Layout } from "../../components/Layout";
import { Heading, Box, Flex, Spacer } from "@chakra-ui/react";
import { usePostQuery } from "../../generated/graphql";
import { useGetIntId } from "../../utils/useGetIntId";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const intId = useGetIntId();
  const { data, error, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (loading) {
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
        <EditDeletePostButtons
          postId={data.post._id}
          creatorId={data.post.creator._id as number}
        />
      </Flex>
      {data.post.text}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
