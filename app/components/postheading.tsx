import React from "react";
import { formatDateNoWeekday } from "@/lib/formatDates";
import { PostMetadata } from "@/types";

const PostHeading = ({ metadata }: { metadata: PostMetadata }) => {
  return (
    <div className="flex flex-col p-[15px] gap-[15px] my-[1.25rem] md:my-[1.75rem] bg-[rgb(255,0,255,0.05)] rounded-lg paragraph-widths mx-auto">
      <div className="">
        <h1 className="font-[900] text-3xl md:text-4xl">{metadata.title}</h1>
      </div>

      <div className="">
        <h2 className="font-[650] md:text-[1.125rem] text-base font-serif leading-[1.25rem] md:leading-[1.5rem] text-stone-600">
          {metadata.standfirst}
        </h2>
      </div>

      <div className="flex justify-between">
        <div className="text-xs text-stone-600">{formatDateNoWeekday(metadata.publishDate)}</div>
        <div className="text-xs text-stone-600">by {metadata.author}</div>
      </div>
    </div>
  );
};

export default PostHeading;
