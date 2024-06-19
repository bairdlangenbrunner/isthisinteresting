import React from "react";
import { getPosts } from "../posts";

export default async function Page() {

  const posts = await getPosts();
  console.log(posts)

  return (
    <>
      <div>archive</div>


    </>
  );
};