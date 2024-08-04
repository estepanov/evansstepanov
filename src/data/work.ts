
export interface Work {
    isCurrent?: boolean,
    companyName: string,
    title: string,
    description: string,
    url: string,
    image?: string
    startDate?: Date,
    endDate?: Date,
}
