import { emptyFunction } from ".";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
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
  dispatch(newPendingToast(toastId, "Waiting for signing..."));

  try {
    setLoading(true);

    const unsub = await tx.signAndSend(
      signerAddress,
      { signer },
      ({ events = [], status }) => {
        if (status.isFinalized) {
          onFinalized(signerAddress);
          unsub();
        }

        if (status.isInBlock) {
          // Transaction went through
          dispatch(removeToast(toastId));

          for (const event of events) {
            const { section, method, data } = event.event;
            if (section === "system" && method === "ExtrinsicFailed") {
              const [dispatchError] = data;
              const message = getDispatchError(dispatchError);
              dispatch(newErrorToast(`Extrinsic failed: ${message}`));
              return;
            }
          }

          dispatch(newSuccessToast("InBlock"));

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

    dispatch(updatePendingToast(toastId, "Broadcasting"));

    onSubmitted(signerAddress);
    onClose();
  } catch (e) {
    dispatch(removeToast(toastId));
    dispatch(newErrorToast(e.message));
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}
