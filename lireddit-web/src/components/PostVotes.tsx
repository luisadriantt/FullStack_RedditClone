import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";
import gql from "graphql-tag";

interface PostVotesProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    _id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        _id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    console.log("data.points ", data.points);
    console.log("data.voteStatus ", data.voteStatus);
    console.log("value ", value);
    const newPoints = (data.points as number) + 1 * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const PostVotes: React.FC<PostVotesProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upVote-loading" | "downVote-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        variant={post.voteStatus === 1 ? "outline" : "ghost"}
        colorScheme="green"
        size="sm"
        aria-label="up vote"
        icon={<ChevronUpIcon />}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("upVote-loading");
          await vote({
            variables: {
              postId: post._id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post._id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "upVote-loading"}
      />
      <Text fontSize="sm">{post.points}</Text>
      <IconButton
        variant={post.voteStatus === -1 ? "outline" : "ghost"}
        colorScheme="red"
        size="sm"
        aria-label="down vote"
        icon={<ChevronDownIcon />}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downVote-loading");
          await vote({
            variables: {
              postId: post._id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post._id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downVote-loading"}
      />
    </Flex>
  );
};
