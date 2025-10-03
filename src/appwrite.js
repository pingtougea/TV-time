import { Client, Databases, ID, Query } from "appwrite"

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const databases = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // 使用 listDocuments 而不是 listRows
    const result = await databases.listDocuments(
      DATABASE_ID,
      TABLE_ID,
      [Query.equal('searchTerm', searchTerm)]
    )

    if (result.documents.length > 0) {
      const doc = result.documents[0]
      // 使用 updateDocument 而不是 updateRow
      await databases.updateDocument(
        DATABASE_ID,
        TABLE_ID,
        doc.$id,
        {
          count: doc.count + 1,
        }
      )
    } else {
      // 使用 createDocument 而不是 createRow
      await databases.createDocument(
        DATABASE_ID,
        TABLE_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      )
    }
  } catch (error) {
    console.error('Error updating search count:', error)
  }
}

export const getTrendingMovies = async () => {
  try {
    // 使用 listDocuments 而不是 listRows
    const result = await databases.listDocuments(
      DATABASE_ID,
      TABLE_ID,
      [
        Query.limit(5),
        Query.orderDesc("count")
      ]
    )
    return result.documents // 使用 documents 而不是 rows
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return [] // 确保返回空数组而不是 undefined
  }
}