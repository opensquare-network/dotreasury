import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import { PRIMARY_THEME_COLOR } from "../constants";

const Wrapper = styled.div`

  &, &.mde-preview-content {
    margin-bottom: 8px;
    overflow-wrap: break-word;

    p, blockquote, ul, ol, dl, table {
      line-height: 150%;
      /* margin: 0 0 1.5rem 0; */
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 3rem;
    }

    h2 {
      font-size: 2.4rem;
      margin: 3rem 0 2rem 0;
    }

    h3, h4 {
      /* font-size: lg; */
      margin-bottom: 0.8rem;
    }

    ul, ol {
      padding-left: 2rem;

      li {
        padding-left: 0.8rem;
        margin-bottom: 1.2rem;
      }

      li > input {
        display: none;
      }
    }

    a {
      color: ${PRIMARY_THEME_COLOR};
    }

    /* blockquote {
      margin-left: 0;
      padding: 0 1em;
      color: grey_primary;
      border-left-style: solid;
      border-left-width: 0.25rem;
      border-left-color: grey_primary;
      font-size: 1.6rem;
        & > :first-child {
          margin-top: 0;
        }
        & > :last-child {
          margin-bottom: 0;
        }
    } */

    img {
      max-width: 100%;
      margin: 2rem 0;
    }

    pre {
      /* background-color: grey_light; */
      padding: 1.6rem;
      overflow: auto;
      border-radius: 0.3rem;
    }

    /* code {
      margin: 0;
      font-size: sm;
      border-radius: 3px;
      color: black_text;
      white-space: pre;
      &::before, &::after {
        letter-spacing: -0.2em;
      }
    } */

    /* ul > li {
      list-style: disc !important;
    }
    ol > li {
      list-style: disc !important;
    } */
    /* ul, ol, li {
      list-style: initial !important;
    } */
  }

  /* &.mde-preview-content {

    h1, h2, h3, h4 {
      border-bottom: none;
    }

    h1, h2 {
      font-size: lg;
      font-weight: 400;
    }

    h3, h4 {
      font-size: md;
      font-weight: 500;
    }

    h3 {
      font-family: font_default !important;
    }
  } */
`

const Markdown = ({ md }) => {
	return (
    <Wrapper>
      <ReactMarkdown className="mde-preview-content" source={md} linkTarget='_blank' />
    </Wrapper>
  )
};

export default Markdown;
