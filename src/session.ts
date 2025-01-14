import * as Crypto from "./components/crypto/implementation.js"
import * as Storage from "./components/storage/implementation.js"
import * as TypeChecks from "./common/type-checks.js"

import { Maybe } from "./common/types.js"
import FileSystem from "./fs/index.js"


// ✨


export class Session {

  #crypto: Crypto.Implementation
  #storage: Storage.Implementation

  fs?: FileSystem
  type: string
  username: string

  constructor(props: {
    crypto: Crypto.Implementation
    storage: Storage.Implementation

    fs?: FileSystem
    type: string
    username: string
  }) {
    this.#crypto = props.crypto
    this.#storage = props.storage

    this.fs = props.fs
    this.type = props.type
    this.username = props.username
  }


  async destroy() {
    await this.#storage.removeItem(this.#storage.KEYS.ACCOUNT_UCAN)
    await this.#storage.removeItem(this.#storage.KEYS.CID_LOG)
    await this.#storage.removeItem(this.#storage.KEYS.SESSION)
    await this.#storage.removeItem(this.#storage.KEYS.UCANS)

    await this.#crypto.keystore.clearStore()

    if (this.fs) this.fs.deactivate()
  }

}



// INFO


type SessionInfo = {
  type: string
  username: string
}


export function isSessionInfo(a: unknown): a is SessionInfo {
  return TypeChecks.isObject(a)
    && TypeChecks.hasProp(a, "username")
    && TypeChecks.hasProp(a, "type")
}

/**
 * Begin to restore a `Session` by looking up the `SessionInfo` in the storage.
 */
export async function restore(storage: Storage.Implementation): Promise<Maybe<SessionInfo>> {
  return storage
    .getItem(storage.KEYS.SESSION)
    .then((a: unknown) => a ? a as string : null)
    .then(a => a ? JSON.parse(a) : null)
    .then(a => isSessionInfo(a) ? a : null)
}

/**
 * Prepare the system for the creation of a `Session`
 * by adding the necessary info to the storage.
 */
export function provide(storage: Storage.Implementation, info: SessionInfo): Promise<string> {
  return storage.setItem(
    storage.KEYS.SESSION,
    JSON.stringify({ type: info.type, username: info.username })
  )
}
