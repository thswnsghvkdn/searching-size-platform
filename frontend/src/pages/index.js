import React from "react"
import Post from "../components/Post"
import AppLayout from "../components/AppLayout";
function Root() {
  return (
    <div>
      <AppLayout>
        <Post></Post>
      </AppLayout>
    </div>
  );
}

export default Root;
