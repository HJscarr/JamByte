'use client';
import React, { useState, useEffect } from 'react';
import { getStockLevel } from '@/hooks/useStock';

interface StockCheckerProps {
    productId: string;
}

const StockChecker: React.FC<StockCheckerProps> = ({ productId }) => {
    const [stockLevel, setStockLevel] = useState<number | null>(null);
    const [totalSold, setTotalSold] = useState<number | null>(null);

    const checkStock = async () => {
        try {
            const data = await getStockLevel(productId);
            setStockLevel(Number(data.StockLevel));
            setTotalSold(Number(data.TotalSold)); // Assuming the API response includes TotalSold
        } catch (error) {
            console.error('Error fetching stock level:', error);
        }
    };

    useEffect(() => {
        if (productId) {
            checkStock();
        }
    }, [productId]);

    return (
        <div>
            {stockLevel !== null && (
                <div>
                    {stockLevel === 0 ? (
                        <>
                        <span className='text-secondary font-bold'>Sold out!</span>
                        <span> Pre-Order Available (2 Week Wait)</span>
                        </>
                        
                    ) : stockLevel < 10 ? (
                        <p>Only {stockLevel} left in stock!</p>
                    ) : (
                        <p>{totalSold} items sold already!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StockChecker;