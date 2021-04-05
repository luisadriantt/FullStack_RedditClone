import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface PostVotesProps {
  post: PostSnippetFragment;
}

export const PostVotes: React.FC<PostVotesProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upVote-loading" | "downVote-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        variant="ghost"
        colorScheme="green"
        size="sm"
        aria-label="up vote"
        icon={<ChevronUpIcon />}
        onClick={async () => {
          await vote({
            postId: post._id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "upVote-loading"}
      />
      <Text fontSize="sm">{post.points}</Text>
      <IconButton
        variant="ghost"
        colorScheme="green"
        size="sm"
        aria-label="down vote"
        icon={<ChevronDownIcon />}
        onClick={async () => {
          await vote({
            postId: post._id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downVote-loading"}
      />
    </Flex>
  );
};
