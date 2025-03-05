// Fetch the stock level of a product
export const getStockLevel = async (productId: string) => {
    try {
        const response = await fetch(`https://u435o55eni.execute-api.eu-west-1.amazonaws.com/Prod/get-stock?productId=${productId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stock level:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Update the stock level of a product
export const updateStockLevel = async (productId: string, action: string, quantity: number = 1) => {
    const config = {
        productId,
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
        throw error; // Rethrow the error for handling in the calling function
    }
};
