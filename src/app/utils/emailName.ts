export default function getNameFromEmail(email:string): string {
    const [prefix] = email.split('@');
    const parts = prefix.split('.');
    if (parts.length >= 2) {
        const [first, last] = parts;
        return `${capitalize(first)} ${capitalize(last)}`;
    }
    return capitalize(prefix);
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}