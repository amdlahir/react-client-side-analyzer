import fs from 'fs';

const generateMockData = (numRecords = 1000000) => {
  // Reference data
  const productCategories = [
      'Electronics', 'Clothing', 'Books', 'Home & Garden', 
      'Sports', 'Food & Beverage', 'Toys', 'Beauty', 
      'Automotive', 'Office'
  ];
  const locations = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 
      'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 
      'Dallas', 'San Jose'
  ];
  const paymentMethods = [
      'Credit Card', 'PayPal', 'Cash', 'Debit Card', 
      'Apple Pay', 'Google Pay', 'Bank Transfer'
  ];
  const shippingMethods = [
      'Standard', 'Express', 'Next Day', 'Pickup'
  ];

  // Generate mock data
  const data = [];
  
  for (let i = 0; i < numRecords; i++) {
      // Create category-dependent price ranges
      const category = productCategories[Math.floor(Math.random() * productCategories.length)];
      const basePrice = {
          'Electronics': 500,
          'Clothing': 50,
          'Books': 20,
          'Home & Garden': 150,
          'Sports': 80,
          'Food & Beverage': 30,
          'Toys': 40,
          'Beauty': 45,
          'Automotive': 200,
          'Office': 100
      }[category] || 100;

      // Generate a random date in 2024
      const date = new Date(2024, 
          Math.floor(Math.random() * 12),    // Random month
          Math.floor(Math.random() * 28) + 1  // Random day (1-28 to avoid invalid dates)
      );

      const row = {
          // Generate formatted order ID
          order_id: `ORD${String(i + 10000).padStart(5, '0')}`,
          
          // Format date as YYYY-MM-DD
          transaction_date: date.toISOString().split('T')[0],
          
          // Generate price with variation based on category
          purchase_amount: Math.round((basePrice + Math.random() * basePrice) * 100) / 100,
          
          // Categorical fields
          product_category: category,
          location: locations[Math.floor(Math.random() * locations.length)],
          payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          shipping_method: shippingMethods[Math.floor(Math.random() * shippingMethods.length)],
          
          // Generate quantity (1-5 items)
          items_quantity: Math.floor(Math.random() * 5) + 1,
          
          // Rating with 10% null values
          customer_rating: Math.random() > 0.9 ? null : Math.floor(Math.random() * 5) + 1,
          
          // Discount with 30% chance
          discount_applied: Math.random() > 0.7 ? Math.round(Math.random() * 25) : 0
      };
      
      data.push(row);
  }
  
  return data;
};

// Generate data
const mockData = generateMockData(1000000);

// Convert to CSV using PapaParse
import Papa from 'papaparse';
const csv = Papa.unparse(mockData, {
  quotes: true,    // Quote all fields
  header: true     // Include header row
});

// Output statistics
console.log(`Generated ${mockData.length} records`);
console.log(`CSV size: ${csv.length} bytes`);

// Sample the first few records
console.log('\nSample records:');
console.log(mockData.slice(0, 3));

// Print some distribution stats
const getColumnStats = (data, column) => {
  const counts = {};
  data.forEach(row => {
      const value = row[column];
      counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
};

console.log('\nCategory distribution:');
console.log(getColumnStats(mockData, 'product_category'));

fs.writeFileSync('./public/mock_data.csv', csv);