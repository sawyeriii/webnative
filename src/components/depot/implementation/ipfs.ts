import * as uint8arrays from "uint8arrays"
import { CID } from "multiformats/cid"
import { IPFS } from "ipfs-core-types"
import { sha256 } from "multiformats/hashes/sha2"

import * as Codecs from "../../../dag/codecs.js"
import { CodecIdentifier } from "../../../dag/codecs.js"
import { DirectoryItem, Implementation, PutResult } from "../implementation.js"
import { Repo } from "ipfs-core/components/network.js"


// 🛳


export async function implementation(ipfs: IPFS, repo: Repo): Promise<Implementation> {
  return {

    // GET

    getBlock: async (cid: CID): Promise<Uint8Array> => {
      return ipfs.block.get(cid)
    },
    getUnixDirectory: async (cid: CID): Promise<DirectoryItem[]> => {
      const entries = []

      for await (const entry of ipfs.ls(cid)) {
        const { name = "", cid, size, type } = entry

        entries.push({
          name,
          cid: cid,
          size,
          isFile: type !== "dir"
        })
      }

      return entries
    },
    getUnixFile: async (cid: CID): Promise<Uint8Array> => {
      const chunks = []

      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk)
      }

      return uint8arrays.concat(chunks)
    },

    // PUT

    putBlock: async (data: Uint8Array, codecId: CodecIdentifier): Promise<CID> => {
      const codec = Codecs.getByIdentifier(codecId)
      const multihash = await sha256.digest(data)
      const cid = CID.createV1(codec.code, multihash)

      await repo.blocks.put(
        cid,
        data
      )

      return cid
    },
    putChunked: async (data: Uint8Array): Promise<PutResult> => {
      const addResult = await ipfs.add(data, {
        cidVersion: 1,
        hashAlg: "sha2-256",
        rawLeaves: true,
        wrapWithDirectory: false,
        preload: false,
        pin: false,
      })

      return { ...addResult, isFile: true }
    },

    // STATS

    size: async (cid: CID) => {
      const stat = await ipfs.files.stat(`/ipfs/${cid}`)
      return stat.cumulativeSize
    }
  }
}