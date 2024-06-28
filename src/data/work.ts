
export interface Work {
    isCurrent?: boolean,
    companyName: string,
    companyGroup?: string,
    title: string,
    description: string,
    url: string,
    image?: string
}

export const work: Work[] = [
    {
        isCurrent: true,
        companyName: 'CLEAR',
        companyGroup: 'Web Platform',
        title: 'Senior Software Engineer',
        description: 'On web platform team, working on the next generation of web experience for CLEAR members. ',
        url: 'https://www.clearme.com/',
    },
    {
        companyName: 'Amazon',
        companyGroup: 'AWS Secrets Manager',
        title: 'Frontend Engineer II',
        description: 'Worked on the AWS Secrets Manager team, building out the AWS Secrets Manager console.',
        url: 'https://aws.amazon.com/secrets-manager/',
    },
    {
        companyName: 'Hired',
        companyGroup: 'Candidate Experience',
        title: 'Senior Software Engineer',
        description: 'Primarily worked on the candidate experience team, building out the candidate experience side on Hired marketplace.',
        url: 'https://hired.com/',
    },
    {
        companyName: 'WinIt',
        title: 'Software Engineer',
        description: 'Focused on rebuilding the web app and backend that helps users fight their tickets.',
        url: 'https://www.appwinit.com',
    }
]
