import React from "react";
import ReactMarkdown from "react-markdown";

const Markdown = ({ md }) => {
	return (
    <ReactMarkdown source={md} linkTarget='_blank' />
  )
};

export default Markdown;
