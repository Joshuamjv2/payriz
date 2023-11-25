export function convertTimestampToFormattedDate(timestamp: string) {
  const date = new Date(timestamp);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return formattedDate;
}

export function createNewLabelValueArray(dataArray: any[]) {
  const newArray = dataArray.map((item) => {
    return {
      label: item.name,
      value: item.name,
      customerId: item.id,
    };
  });

  return newArray;
}

export const calculateTotal = (products: any[]) => {
  const total = products.reduce((total, product) => {
    const productTotal = product.productAmount * product.productQuantity;
    return total + productTotal;
  }, 0);
  return total.toFixed(2);
};

export function formatShortDate(inputDate: string) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [year, month, day] = inputDate.split('-');
  const monthName = months[parseInt(month, 10) - 1];

  return `${monthName}, ${parseInt(day, 10)} ${year}`;
}

export function transformProducts(
  originalArray: {
    productName: any;
    productAmount: any;
    productQuantity: any;
  }[],
) {
  return originalArray.map(
    ({ productName, productAmount, productQuantity }) => ({
      name: productName,
      unit_cost: productAmount,
      quantity: productQuantity,
    }),
  );
}
