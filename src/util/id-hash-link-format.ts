// create a function that makes a url safe hash from a string
export const idHash = (str: string): string => {
    return str.replace(/\s/g, '-').toLowerCase()
}
