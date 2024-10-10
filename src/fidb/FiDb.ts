export type FiDbConfig = {
  directory: string
}

// export class FiDb implements Db {
//   constructor(public config: FiDbConfig) {}

//   private resolveIdPath(id: Id): string {
//     const [datasetName, dataId] = id.split("/")
//     return resolvePath(
//       this.config.directory,
//       join(datasetName, "datasets", dataId),
//     )
//   }

//   async create(id: Id, data: Data): Promise<void> {
//     const [datasetName, dataId] = id.split("/")
//     join(this.resolveIdPath(id), "data.json")
//     throw new Error()
//   }

//   async delete(id: Id, options: { revision: string }): Promise<void> {
//     throw new Error()
//   }

//   async metadata(id: Id): Promise<Metadata> {
//     throw new Error()
//   }

//   async getOrFail(id: Id): Promise<Data> {
//     throw new Error()
//   }

//   async get(id: Id): Promise<Data | undefined> {
//     throw new Error()
//   }

//   async has(id: Id): Promise<boolean> {
//     throw new Error()
//   }

//   async patch(id: Id, data: Data): Promise<Data> {
//     throw new Error()
//   }

//   async put(id: Id, data: Data): Promise<Data> {
//     throw new Error()
//   }
// }
