/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { escape, isPresent } from '../facade/lang';
/**
 * A message extracted from a template.
 *
 * The identity of a message is comprised of `content` and `meaning`.
 *
 * `description` is additional information provided to the translator.
 */
export class Message {
    constructor(content, meaning, description = null) {
        this.content = content;
        this.meaning = meaning;
        this.description = description;
    }
}
/**
 * Computes the id of a message
 */
export function id(m) {
    let meaning = isPresent(m.meaning) ? m.meaning : '';
    let content = isPresent(m.content) ? m.content : '';
    return escape(`$ng|${meaning}|${content}`);
}
//# sourceMappingURL=message.js.map