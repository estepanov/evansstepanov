import { Client } from "@notionhq/client"

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })

const projects = await notion.databases.query({
    database_id: process.env.PROJECTS_NOTION_DB_ID
})

const images = []

projects.results.forEach(project => {
     project.properties.Media.files.forEach(file => {
        images.push(file.file.url)
    })
})



console.log(images)