export function generateExpirationDate(minuts: number = 5) {
    const expiration = new Date()
    expiration.setMinutes(expiration.getMinutes() + minuts);
    return expiration
}