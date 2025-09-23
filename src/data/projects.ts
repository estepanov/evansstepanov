export interface Project {
    name: string,
    description: string,
    url: string,
    source: string
    tags?: string[]
    techTags?: string[]
    isActive?: boolean
    startDate?: Date,
    endDate?: Date,
    media: string[]
}
