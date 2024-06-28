// import getFormattedDate from "@/lib/getFormattedDate";
// // import { getSortedPostsData, getPostData } from "@/lib/posts"
// import { getPosts, getPostById } from "@/lib/posts";
// // import { notFound } from "next/navigation";
// // import Link from "next/link";

// export function generateStaticParams() {
//   const posts = getPosts();
//   return posts.map((post) => {
//     postId: post.id;
//   });
// }

// export function generateMetadata({ params }: { params: { postId: string } }) {
//   const posts = getPosts();
//   const { postId } = params;

//   const post = posts.find((post) => post.id === postId);

//   if (!post) {
//     return {
//       title: "post not found",
//     };
//   }

//   return {
//     title: post.title,
//   };
// }

// export default async function Post({ params }: { params: { postId: string } }) {
//   const posts = getPosts();
//   const { postId } = params;

//   if (!(await posts).find((post) => post.id === postId)) {
//     throw new Error("error, no post");
//   }

//   const { title, publishDate, author, standfirst, content } = await getPostById(
//     postId
//   );
// }


