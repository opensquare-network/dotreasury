import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sleep } from ".";
import useApi from "../hooks/useApi";
import { getBlockHeightFromHash } from "../services/chainApi";
import { scanHeightSelector } from "../store/reducers/chainSlice";
import { newPendingToast, newSuccessToast, newToastId, removeToast } from "../store/reducers/toastSlice";

export default function useWaitSyncBlock(toastMessage, callback) {
  const scanHeight = useSelector(scanHeightSelector);
  const dispatch = useDispatch();
  const api = useApi();

  const refScanHeight = useRef();
  useEffect(() => {
    refScanHeight.current = scanHeight;
  }, [scanHeight]);

  const fnWaitSync = useCallback(async (blockHash) => {
    dispatch(newSuccessToast(toastMessage, 1000));

    if (!api) {
      return;
    }

    const toastId = newToastId();
    setTimeout(async () => {
      dispatch(newPendingToast(toastId, "Syncing on-chain data..."));
      try {
        const targetHeight = await getBlockHeightFromHash(api, blockHash);

        let times = 6;
        while (times-- > 0) {
          await sleep(10000);
          if (refScanHeight.current >= targetHeight) {
            break;
          }
        }

        const reachingFinalizedBlock = times >= 0;
        callback(reachingFinalizedBlock);
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(removeToast(toastId));
      }
    }, 1000);
  }, [dispatch, api, refScanHeight, callback, toastMessage]);

  return fnWaitSync;
}
