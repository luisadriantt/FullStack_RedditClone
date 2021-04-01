import { withUrqlClient } from "next-urql";

import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <h1>home</h1>
      <br></br>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <div key={post._id}>{post.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
