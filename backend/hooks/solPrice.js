import DatabaseService from "../services/db/index.js";
const staticSolPrice = 190;
async function getSolPriceInUSDT(initial) {
  try {
    const tokenPage = await DatabaseService.getPages({ name: "settings" });
    const defaultSolPrice = tokenPage[0].content.sol_price;

    try {
      if (initial) {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        if (data?.solana?.usd) {
          await DatabaseService.updatePage(
            { name: "settings" },
            { "content.sol_price": data.solana.usd }
          );
          return data.solana.usd;
        } else {
          return defaultSolPrice;
        }
      } else {
        return defaultSolPrice;
      }
    } catch (err) {
      console.error("Error fetching Sol price:", err);
      return defaultSolPrice;
    }
  } catch (err) {
    console.error("Error fetching Sol price:", err);
    return staticSolPrice;
  }
}

export default getSolPriceInUSDT;
