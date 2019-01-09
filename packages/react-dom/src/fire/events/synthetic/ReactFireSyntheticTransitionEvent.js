/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {extendSyntheticEvent, SyntheticEvent} from './ReactFireSyntheticEvent';

/**
 * @interface Event
 * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
 */
export const SyntheticTransitionEvent = extendSyntheticEvent(SyntheticEvent, {
  propertyName: null,
  elapsedTime: null,
  pseudoElement: null,
});
