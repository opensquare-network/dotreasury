import React from "react";
import styled from "styled-components";
import ReactMde from "react-mde";
import { Image } from "semantic-ui-react";
import "react-mde/lib/styles/css/react-mde-all.css";

import { PRIMARY_THEME_COLOR } from "../constants";

export const StyledTextArea = styled.div`
  & > section {
    margin-bottom: 8px;
  }

  textarea {
    border-radius: 0rem;
    border: none !important;
    color: #53595c !important;
    padding: 1rem 1.2rem !important;
    line-height: 1.4 !important;

    &:focus {
      outline-color: ${PRIMARY_THEME_COLOR} !important;
    }
  }

  .mde-tabs {
    display: none !important;
  }

  .react-mde > .mde-header {
    background: white !important;
  }

  .react-mde {
    border-color: #ebf0f5;
    .grip {
      border-top: none;
      color: #a6acb3;
      .icon {
        margin-bottom: 1rem;
      }
    }

    .mde-header {
      display: flex;
      justify-content: space-between;
      background-color: #f7f9fa;
      border-bottom-style: solid;
      border-bottom-width: 1px;
      border-bottom-color: #ebf0f5;

      .mde-tabs {
        margin: 0 0.5rem;
        button {
          font-weight: 500;
          padding: 0.8rem 1.6rem;
          color: #53595c;
          background: #f7f9fa;
          border-radius: 0.3em;
          border-bottom-color: #ebf0f5;
          margin-bottom: -1px;
          margin-top: 1rem;

          &.selected,
          &:focus {
            background: white;
            color: #2e2f30;
            border-style: solid;
            border-width: 1px;
            border-color: #ebf0f5;
            outline: none;
            border-bottom-color: white;
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            margin-top: 1rem;
          }

          &:hover {
            color: #2e2f30;
          }
        }
      }

      .mde-header-group {
        .mde-header-item {
          display: inline-flex;
          align-items: center;

          button {
            color: #777b80;

            &:hover,
            &:active,
            &:focus {
              color: #2e2f30;
            }
          }

          .react-mde-dropdown {
            border-style: solid;
            border-width: 1px;
            border-color: #ebf0f5;
            border-radius: 0.5rem;

            .mde-header-item {
              button {
                p {
                  color: #777b80;
                }

                p:hover {
                  color: #2e2f30;
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

const MarkdownEditor = ({ md, authors, onChange }) => {
  const loadSuggestions = async (text) => {
    return new Promise((accept) => {
      const suggestions = (authors || [])
        .map((user) => ({
          preview: user,
          value: `[@${user}](https://dotreasury.com/user/${user})`,
        }))
        .filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
      accept(suggestions);
    });
  };

  return (
    <StyledTextArea className="container">
      <ReactMde
        value={md}
        onChange={onChange}
        loadSuggestions={loadSuggestions}
        toolbarCommands={[
          [
            "header",
            "bold",
            "italic",
            "quote",
            "ordered-list",
            "unordered-list",
            "link",
            "image",
            "code",
          ],
        ]}
        getIcon={(commandName) => {
          return <Image src={`/imgs/md-icons/${commandName}.svg`} />;
        }}
      />
    </StyledTextArea>
  );
};

export default MarkdownEditor;
