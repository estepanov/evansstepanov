// input JS Date expect Month Year fromate
export const getFormattedDate = (date: Date): string => {
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    return `${month} ${year}`
}