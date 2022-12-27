// Check length by characters
export const countChars = (str: string) => {
    return str.replace(/[\u0080-\u10FFFF]/g, "x").length;
}