import React from "react";
import ReactMde from "react-mde";
import 'react-mde/lib/styles/css/react-mde-all.css';

import Markdown from "./Markdown";

const MarkdownEditor = (props) => {
  const [value, setValue] = React.useState("**Hello world!!!**");
  const [selectedTab, setSelectedTab] = React.useState('write');

  const loadSuggestions = async (text) => {
		return new Promise((accept) => {
			const users = ["qiyisi"]

			const suggestions = users.map(user => ({
				preview: user,
				value: `[@${user}](${global.window.location.origin}/user/${user})`
			})).filter(i => i.preview.toLowerCase().includes(text.toLowerCase()));

			accept(suggestions);
		});
	};

  return (
    <ReactMde 
      value={value}
      onChange={setValue}
      generateMarkdownPreview={markdown => Promise.resolve(<Markdown isPreview={true} md={markdown} />) }
      onTabChange={setSelectedTab}
      selectedTab={selectedTab}
      loadSuggestions={loadSuggestions}
      toolbarCommands={[['bold', 'header', 'link', 'quote', 'strikethrough', 'code', 'image', 'ordered-list', 'unordered-list']]}
      {...props}
    />
  )
}

export default MarkdownEditor;
