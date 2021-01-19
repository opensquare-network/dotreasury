import React from "react";
import styled from "styled-components";
import ReactMde from "react-mde";
import 'react-mde/lib/styles/css/react-mde-all.css';

import Markdown from "./Markdown";
import { PRIMARY_THEME_COLOR } from "../constants";

export const StyledTextArea = styled.div`
  margin-top: 20px;
  
  & > section {
    margin-bottom: 8px;
  }
  
	textarea {
		border-radius: 0rem;
		border: none!important;
		color: #53595C !important;
		padding: 1rem 1.2rem!important;
		line-height: 1.4!important;
		
		&:focus {
		  outline-color: ${PRIMARY_THEME_COLOR} !important;
		}
	}
	
	/* .mde-tabs {
	  display: none;
	} */
	
  @media only screen and (max-width: 768px) {
		.react-mde {
			.mde-header {
				.mde-header-group {
					margin-left: 0!important;
					padding: 1rem 0.5rem;
					background-color: white;
					width: 100%;

					&.hidden {
						visibility: hidden;
						display: none;
					  }

					.mde-header-item {
						button {
							font-size: 1.3rem!important;
						}
					}
				}

			}
		}
	}
	
	.react-mde {
	  border-color: #EBF0F5;
    .grip {
			border-top: none;
			color: #A6ACB3;

			.icon {
				margin-bottom: 1rem;
			}
		}

	  
	  .mde-header {
	    display: flex;
	    justify-content: space-between;
      background-color: #F7F9FA;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: #EBF0F5;
			
			.mde-tabs {
			  margin: 0 0.5rem;
			  button { 
					font-weight: 500;
					padding: 0.8rem 1.6rem;
					color: #53595C;
					background: #F7F9FA;
					border-radius: 0.3em;
					border-bottom-color: #EBF0F5;
					margin-bottom: -1px;
					margin-top: 1rem;
					
          &.selected, &:focus {
						background: white;
						color: #2E2F30;
						border-style: solid;
						border-width: 1px;
						border-color: #EBF0F5;
						outline: none;
						border-bottom-color: white;
						margin-bottom: -1px;
						border-bottom-right-radius: 0;
						border-bottom-left-radius: 0;
						margin-top: 1rem;
					}
					
          &:hover {
						color: #2E2F30;
					}
			  }
			}

      .mde-header-group {
        .mde-header-item {
          display: inline-flex;
          align-items: center;
          
          button {
						color: #777B80;

						&:hover, &:active, &:focus {
							color: #2E2F30;
						}
					}
					
					.react-mde-dropdown {
            border-style: solid;
						border-width: 1px;
						border-color: #EBF0F5;
						border-radius: 0.5rem;
						
            .mde-header-item {
							button {
								p {
									color: #777B80;
								}

								p:hover {
									color: #2E2F30;
								}
							}
						}
					}
        }
      }
	  }
	}

	.mde-text {
		min-height: 100px;
	}

`;

const MarkdownEditor = (props) => {
  const [value, setValue] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState('write');

  const loadSuggestions = async (text) => {
		return new Promise((accept) => {
			const users = ["user1", "user2"];

			const suggestions = users.map(user => ({
				preview: user,
				value: `[@${user}](${global.window.location.origin}/user/${user})`
			})).filter(i => i.preview.toLowerCase().includes(text.toLowerCase()));

			accept(suggestions);
		});
	};

  return (
    <StyledTextArea className="container">
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
    </StyledTextArea>
  )
}

export default MarkdownEditor;
