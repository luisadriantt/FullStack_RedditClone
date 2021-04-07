import React from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import router from "next/router";

interface EditDeletePostButtonsProps {
  postId: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  postId,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?._id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <IconButton
        variant="ghost"
        colorScheme="green"
        size="sm"
        aria-label="Delete post"
        icon={<DeleteIcon />}
        onClick={async () => {
          await deletePost({ variables: { id: postId } });
          router.push("/");
        }}
      />
      <IconButton
        variant="ghost"
        colorScheme="green"
        size="sm"
        aria-label="Update post"
        icon={<EditIcon />}
        onClick={async () => {
          router.push(`/post/edit/${postId}`);
        }}
      />
    </Box>
  );
};
