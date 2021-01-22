import React from 'react';
import renderer from 'react-test-renderer';
import CommentItem from '../CommentItem';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <CommentItem comment={{authorId: "600920dc78f01c6de39a9d5c",
    commentId: "600920f278f01c6de39a9d5e",
    content: "test string",
    createdAt: "2021-01-21T06:36:34.229Z",
    updatedAt: "2021-01-21T06:36:34.229Z"}} index={1} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
