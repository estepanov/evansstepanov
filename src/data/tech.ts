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
    type?:TechType,
    proficiency: TechProficiency,
    proficiencyWeight: number,
    description?: string,
    url?: string,
    image?: string
}

export enum TechType {
    Runtime = 'Runtime',
    Language = 'Language',
    Library = 'Library',
    Framework = 'Framework',
    Database = 'Database',
    DevOps = 'DevOps'
}