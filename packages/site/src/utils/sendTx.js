import { emptyFunction } from ".";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  newWarningToast,
  removeToast,
  updatePendingToast,
} from "../store/reducers/toastSlice";

export function getDispatchError(dispatchError) {
  let message = dispatchError.type;

  if (dispatchError.isModule) {
    try {
      const mod = dispatchError.asModule;
      const error = dispatchError.registry.findMetaError(mod);

      message = `${error.section}.${error.name}`;
    } catch (error) {
      // swallow
    }
  } else if (dispatchError.isToken) {
    message = `${dispatchError.type}.${dispatchError.asToken.type}`;
  }

  return message;
}

export async function sendTx({
  txName = "Pending",
  tx,
  signer,
  dispatch,
  setLoading = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
  signerAddress,
  isMounted,
  section: sectionName,
  method: methodName,
}) {
  const toastId = newToastId();
  dispatch(newPendingToast(toastId, "Waiting for signing...", `${txName} (1/3)`));

  try {
    setLoading(true);

    let blockHash = null;

    const unsub = await tx.signAndSend(
      signerAddress,
      { signer },
      ({ events = [], status }) => {
        if (status.isFinalized) {
          dispatch(removeToast(toastId));
          unsub();
          onFinalized(blockHash);
        }

        if (status.isInBlock) {
          blockHash = status.asInBlock.toString();

          // Transaction went through
          for (const event of events) {
            const { section, method, data } = event.event;
            if (section === "system" && method === "ExtrinsicFailed") {
              const [dispatchError] = data;
              const message = getDispatchError(dispatchError);
              dispatch(removeToast(toastId));
              dispatch(newErrorToast(`Extrinsic failed: ${message}`));
              return;
            }
          }

          dispatch(updatePendingToast(toastId, "Inblock, waiting for finalization...", `${txName} (3/3)`));

          for (const event of events) {
            const { section, method, data } = event.event;
            if (section !== sectionName || method !== methodName) {
              continue;
            }
            const eventData = data.toJSON();
            onInBlock(eventData);
            break;
          }

          if (!sectionName || !methodName) {
            onInBlock();
          }
        }
      }
    );

    dispatch(updatePendingToast(toastId, "Submitted, waiting for wrapping...", `${txName} (2/3)`));
    onSubmitted(signerAddress);
    onClose();
  } catch (e) {
    dispatch(removeToast(toastId));

    if (e.message === "Cancelled") {
      dispatch(newWarningToast(e.message));
    } else {
      dispatch(newErrorToast(e.message));
    }

  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}
