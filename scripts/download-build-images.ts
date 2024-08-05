import { Client } from "@notionhq/client"
import { downloadImages } from '../src/util/motion-files'
import { hashFileName } from '../src/util/file-names'
const notion = new Client({
    auth: process.env.NOTION_TOKEN as string,
  })

const projects = await notion.databases.query({
    database_id: process.env.PROJECTS_NOTION_DB_ID as string
})

const images = []

projects.results.forEach(project => {
     project.properties.Media.files.forEach(file => {
        images.push(file.file.url)
    })
})

console.log(images)

await downloadImages(images, 'static/_dld/static', hashFileName)
