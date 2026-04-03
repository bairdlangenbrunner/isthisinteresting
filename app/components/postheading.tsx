import React from "react";
import { formatDateNoWeekday } from "@/lib/formatDates";
import { PostMetadata } from "@/types";

const PostHeading = ({ metadata }: { metadata: PostMetadata }) => {
  return (
    <div className="paragraph-widths mx-auto my-[1.25rem] md:my-[1.75rem] font-monospace border-2 border-lime-700 rounded-lg p-[15px]">
      <h1 className="font-[900] text-3xl md:text-4xl leading-tight">{metadata.title}</h1>
      <h2 className="font-normal text-sm md:text-base text-stone-500 mt-3 leading-snug">
        {metadata.standfirst}
      </h2>
      <div className="flex justify-between text-xs text-stone-400 mt-4">
        <span>{formatDateNoWeekday(metadata.publishDate)}</span>
        <span>{metadata.author}</span>
      </div>
    </div>
  );
};

export default PostHeading;
