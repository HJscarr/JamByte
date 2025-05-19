// Fetch the stock level of a product
export const getStockLevel = async (title: string) => {
    try {
        const lowercaseTitle = title.toLowerCase().replace(/\s+/g, '-');
        console.log('Fetching stock for:', lowercaseTitle);
        const response = await fetch(`https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/get-stock-level?productId=${lowercaseTitle}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        const data = await response.json();

        // Handle error responses
        if (!data.success) {
            console.log('API returned error:', data.error);
            return null;
        }

        // Extract the product data from the response
        const productData = data.data;
        return {
            StockLevel: Number(productData.StockLevel),
            TotalSold: Number(productData.TotalSold)
        };
    } catch (error) {
        console.error('Error fetching stock level:', error);
        return null;
    }
};