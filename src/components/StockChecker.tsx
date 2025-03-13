'use client';
import React, { useState, useEffect } from 'react';
import { getStockLevel } from '@/hooks/useStock';

interface StockCheckerProps {
    title: string;
}

const StockChecker: React.FC<StockCheckerProps> = ({ title }) => {
    const [stockLevel, setStockLevel] = useState<number | null>(null);
    const [totalSold, setTotalSold] = useState<number | null>(null);

    title = title.toLowerCase().replace(/\s+/g, '-');

    const checkStock = async () => {
        try {
            const data = await getStockLevel(title);
            if (data) {  // Check if data exists before trying to use it
                setStockLevel(Number(data.StockLevel));
                setTotalSold(Number(data.TotalSold));
                console.log('Stock data:', data);  // Add logging to help debug
            }
        } catch (error) {
            console.error('Error fetching stock level:', error);
        }
    };

    useEffect(() => {
        if (title) {
            checkStock();
        }
    }, [title]);

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