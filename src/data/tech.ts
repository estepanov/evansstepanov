export enum TechProficiency {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
    Expert = 'Expert'
}

export const TechProficiencyWeight = {
    [TechProficiency.Beginner]: 0,
    [TechProficiency.Intermediate]: 1,
    [TechProficiency.Advanced]: 2,
    [TechProficiency.Expert]: 3
}

export interface Tech {
    name: string,
    proficiency: TechProficiency,
    proficiencyWeight: number,
    description?: string,
    url?: string,
    image?: string
}
