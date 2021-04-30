import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Item from "./Item";
import FoldableItem from "./FoldableItem";
import Card from "../../components/Card";

const Wrapper = styled(Card)`
  max-width: 100%;
  padding: 20px 24px;
`;

const Header = styled.div`
  padding-bottom: 24px;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
`;

const LoadingWrapper = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Timeline = ({ data, loading }) => {
  return (
    <div>
      <Wrapper>
        <Header>Timeline</Header>
        {(loading && (
          <LoadingWrapper>
            <Image src="/imgs/loading.svg" />
          </LoadingWrapper>
        )) || (
          <>
            {(data || []).map((item, index) =>
              item.subTimeline ? (
                <FoldableItem
                  key={item.index}
                  data={item.subTimeline}
                  polkassembly={item.index}
                  defaultUnfold={item.defaultUnfold}
                  expired={item.expired}
                  end={item.end}
                />
              ) : (
                <Item key={index} data={item} />
              )
            )}
          </>
        )}
      </Wrapper>
    </div>
  );
};

export default Timeline;
