/**
 * Utility function to calculate the total amount from order items
 * This is kept for backward compatibility with existing code
 */
export const calculateTotalAmount = (orderItems = []) => {
  if (!Array.isArray(orderItems)) return 0;
  return orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};
