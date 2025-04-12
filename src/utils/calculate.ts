function calculateFinalPrice(basePrice: number, provinceCharges: any[]) {
  console.log('provinceCharges!@!#@#', provinceCharges)
  return Math.round(
    basePrice +
      provinceCharges.reduce((total, charge) => {
        // Skip non-numeric values
        if (typeof charge.value !== 'number' || isNaN(charge.value)) {
          return total;
        }
        
        // Handle percentage values (less than 1)
        const value = charge.value < 1 ? basePrice * charge.value : charge.value;
        return total + value;
      }, 0)
  );
}

export { calculateFinalPrice };