import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {testSelector, setTest} from "../store/reducers/testSlice";

export default function App() {
  const dispatch = useDispatch()
  const test = useSelector(testSelector)
  dispatch(setTest('test'))
  return (
    <div>
      OpenSquare dotreasury site {test.test}
    </div>
  );
}

