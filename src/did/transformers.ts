import * as uint8arrays from "uint8arrays"
import * as utils from "keystore-idb/lib/utils.js"

import { BASE58_DID_PREFIX, magicBytes, parseMagicBytes } from "./util.js"
import { KeyType } from "./types.js"


/**
 * Convert a base64 public key to a DID (did:key).
 */
export function publicKeyToDid(
  publicKey: string,
  type: KeyType
): string {
  const pubKeyBuf = uint8arrays.fromString(publicKey, "base64")

  // Prefix public-write key
  const prefix = magicBytes(type)
  if (prefix === null) {
    throw new Error(`Key type '${type}' not supported`)
  }

  const prefixedBuf = uint8arrays.concat([prefix, pubKeyBuf])

  // Encode prefixed
  return BASE58_DID_PREFIX + uint8arrays.toString(prefixedBuf, "base58btc")
}

/**
 * Convert a DID (did:key) to a base64 public key.
 */
export function didToPublicKey(did: string): {
  publicKey: string
  type: KeyType
} {
  if (!did.startsWith(BASE58_DID_PREFIX)) {
    throw new Error("Please use a base58-encoded DID formatted `did:key:z...`")
  }

  const didWithoutPrefix = did.substr(BASE58_DID_PREFIX.length)
  const magicalBuf = uint8arrays.fromString(didWithoutPrefix, "base58btc")
  const { keyBuffer, type } = parseMagicBytes(magicalBuf)

  return {
    publicKey: uint8arrays.toString(keyBuffer, "base64pad"),
    type
  }
}
