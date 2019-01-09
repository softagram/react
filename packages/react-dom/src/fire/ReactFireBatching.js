/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  needsStateRestore,
  restoreStateIfNeeded,
} from './controlled/ReactFireControlledState';

// Used as a way to call batchedUpdates when we don't have a reference to
// the renderer. Such as when we're dispatching events or if third party
// libraries need to call batchedUpdates. Eventually, this API will go away when
// everything is batched by default. We'll then have a similar API to opt-out of
// scheduled work and instead do synchronous work.

// Defaults
let batchedUpdatesImpl = (fn, bookkeeping) => fn(bookkeeping);
let interactiveUpdatesImpl = (fn, a, b, c) => fn(a, b, c);
let flushInteractiveUpdatesImpl = () => {};

let isBatching = false;
export function batchedUpdates(fn, bookkeeping) {
  if (isBatching) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state.
    return fn(bookkeeping);
  }
  isBatching = true;
  try {
    return batchedUpdatesImpl(fn, bookkeeping);
  } finally {
    // Here we wait until all updates have propagated, which is important
    // when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    // Then we restore state of any controlled component.
    isBatching = false;
    const controlledComponentsHavePendingUpdates = needsStateRestore();
    if (controlledComponentsHavePendingUpdates) {
      // If a controlled event was fired, we may need to restore the state of
      // the DOM node back to the controlled value. This is necessary when React
      // bails out of the update without touching the DOM.
      flushInteractiveUpdatesImpl();
      restoreStateIfNeeded();
    }
  }
}

export function interactiveUpdates(fn, a, b, c) {
  return interactiveUpdatesImpl(fn, a, b, c);
}

export function flushInteractiveUpdates() {
  return flushInteractiveUpdatesImpl();
}

export function setBatchingImplementation(
  _batchedUpdatesImpl,
  _interactiveUpdatesImpl,
  _flushInteractiveUpdatesImpl,
) {
  batchedUpdatesImpl = _batchedUpdatesImpl;
  interactiveUpdatesImpl = _interactiveUpdatesImpl;
  flushInteractiveUpdatesImpl = _flushInteractiveUpdatesImpl;
}
