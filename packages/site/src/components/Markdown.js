import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import ReactMarkdown from "react-markdown";


const Wrapper = styled.div`

  &, &.mde-preview-content {
    font-family: "Inter";

    word-break: break-word;

    margin-bottom: 8px;
    overflow-wrap: break-word;

    p, blockquote, ul, ol, dl, table {
      line-height: 24px;
      color: var(--textPrimary);
      ${p => p.minor && css`
        color: var(--textSecondary);
      `}
    }

    h1 {
      font-size: 3rem;
      font-family: "Montserrat";
      margin-bottom: 3rem;
      color: var(--textPrimary);
    }

    h2 {
      font-size: 2.4rem;
      font-family: "Montserrat";
      margin-bottom: 1rem;
      color: var(--textPrimary);
    }

    h3, h4 {
      margin-bottom: 0.5rem;
      font-family: "Inter";
      color: var(--textPrimary);
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
      color: var(--primary);
      :hover {
        color: var(--primary);
      }
    }

    img {
      max-width: 100%;
      margin: 2rem 0;
    }

    pre {
      padding: 1.6rem;
      overflow: auto;
      border-radius: 0.3rem;
    }

    hr{
        height: 1px;
        background-color: #EEE;
        border: none;
    }
  }
`;

const Markdown = ({ md, replyEvent, minor }) => {
  const mdRef = useRef(null);

  useEffect(() => {
    if (mdRef && mdRef.current) {
      const links = mdRef.current.querySelectorAll("a");
      links.forEach(item => {
        const reMetion = /https:\/\/dotreasury.com\/user\/(\w+)/g;
        let match;
        match = reMetion.exec(item.href);
        if (match) {
          const [, username] = match;
          item.onclick = (e) => {
            e.preventDefault();
            if (replyEvent) {
              replyEvent(username);
            }
          };
        }
      });
    }
  }, [replyEvent]);

	return (
    <Wrapper ref={mdRef} minor>
      <ReactMarkdown className="mde-preview-content" source={md} linkTarget='_blank' />
    </Wrapper>
  );
};

export default Markdown;
