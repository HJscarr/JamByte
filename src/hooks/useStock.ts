// Fetch the stock level of a product
export const getStockLevel = async (title: string) => {
    try {
        const lowercaseTitle = title.toLowerCase().replace(/\s+/g, '-');
        console.log('Fetching stock for:', lowercaseTitle);  // Log the product ID being requested
        const response = await fetch(`https://u435o55eni.execute-api.eu-west-1.amazonaws.com/Prod/get-stock?productId=${lowercaseTitle}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        // Return null for 404s instead of throwing
        if (response.status === 404) {
            console.log('Stock API returned 404:', lowercaseTitle);
            return null;
        }

        if (!response.ok) {
            console.error('Stock API error:', response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // If there's an error in the response, return null
        if (data.error) {
            console.log('API returned error:', data.error);
            return null;
        }

        return {
            StockLevel: Number(data.StockLevel),
            TotalSold: Number(data.TotalSold)
        };
    } catch (error) {
        console.error('Error fetching stock level:', error);
        return null;
    }
};

// Update the stock level of a product
export const updateStockLevel = async (title: string, action: string, quantity: number = 1) => {
    const lowercaseTitle = title.toLowerCase().replace(/\s+/g, '-');
    const config = {
        productId: lowercaseTitle,
        action,
        quantity
    };

    try {
        const response = await fetch('https://<your-api-gateway-endpoint>/stock', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(config),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating stock level:', error);
        return null; // Return null instead of throwing
    }
};
