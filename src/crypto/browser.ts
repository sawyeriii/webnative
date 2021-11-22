import tweetnacl from "tweetnacl"
import * as uint8arrays from "uint8arrays"
import rsaOperations from "keystore-idb/lib/rsa/index.js"

import { assertBrowser } from "../common/browser.js"
import * as keystore from "../keystore.js"


export const rsaVerify = (message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> => {
  assertBrowser("rsa.verify")
  const keyStr = uint8arrays.toString(publicKey, "base64pad")
  return rsaOperations.verify(message, signature, keyStr)
}

export const ed25519Verify = async (message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> => {
  return tweetnacl.sign.detached.verify(message, signature, publicKey)
}

export const ksPublicExchangeKey = async (): Promise<string> => {
  assertBrowser("keystore.publicExchangeKey")
  const ks = await keystore.get()
  return ks.publicExchangeKey()
}

export const ksPublicWriteKey = async (): Promise<string> => {
  assertBrowser("keystore.publicWriteKey")
  const ks = await keystore.get()
  return ks.publicWriteKey()
}

export const ksDecrypt = async (encrypted: string): Promise<string> => {
  assertBrowser("keystore.decrypt")
  const ks = await keystore.get()
  return ks.decrypt(encrypted)
}

export const ksSign = async (message: string): Promise<string> => {
  assertBrowser("keystore.sign")
  const ks = await keystore.get()
  return ks.sign(message)
}

export const ksImportSymmKey = async (key: string, name: string): Promise<void> => {
  assertBrowser("keystore.importSymmKey")
  const ks = await keystore.get()
  return ks.importSymmKey(key, name)
}

export const ksExportSymmKey = async (name: string): Promise<string> => {
  assertBrowser("keystore.exportSymmKey")
  const ks = await keystore.get()
  return ks.exportSymmKey(name)
}

export const ksKeyExists = async (name:string): Promise<boolean> => {
  assertBrowser("keystore.keyExists")
  const ks = await keystore.get()
  return ks.keyExists(name)
}

export const ksGetAlg = async (): Promise<string> => {
  assertBrowser("keystore.getAlg")
  const ks = await keystore.get()
  return ks.cfg.type
}

export const ksClear = async (): Promise<void> => {
  assertBrowser("keystore.clear")
  return keystore.clear()
}
