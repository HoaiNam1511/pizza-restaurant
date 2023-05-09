export function convertToUSD(num: number): string {
    const result = num.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
    return result;
}
