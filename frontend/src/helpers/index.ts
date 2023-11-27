export function convertTimestampToFormattedDate(timestamp: string) {
  const date = new Date(timestamp);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
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

export const calculateTotalAmount = (products: any[]) => {
  const total = products?.reduce((total, product) => {
    const productTotal = product.unit_cost * product.quantity;
    return total + productTotal;
  }, 0);
  return total.toFixed(2);
};

export const calculateViewableTotalAmount = (products: any[]) => {
  const total = products?.reduce((total, product) => {
    const productTotal = product.unit_cost * product.quantity;
    return total + productTotal;
  }, 0);
  return total;
};

export function getOverdueInvoices(invoices: any[]) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return invoices.filter((invoice) => {
    // Check if the invoice is not paid and due date has passed
    if (invoice.status !== 'paid') {
      const dueDate = new Date(invoice.due_date.replace(/,/, ''));
      dueDate.setHours(0, 0, 0, 0);

      // Calculate the difference in days
      const daysDifference = Math.floor(
        (dueDate.valueOf() - currentDate.valueOf()) / (1000 * 60 * 60 * 24),
      );

      // Filter out overdue invoices
      return daysDifference < 0;
    }

    return false;
  });
}

export function getPendingInvoices(invoices: any[]) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return invoices.filter((invoice) => {
    // Check if the invoice is not paid and due date has not passed
    if (invoice.status !== 'paid' && invoice.status !== 'failed') {
      const dueDate = new Date(invoice.due_date.replace(/,/, ''));
      dueDate.setHours(0, 0, 0, 0);

      // Calculate the difference in days
      const daysDifference = Math.floor(
        (dueDate.valueOf() - currentDate.valueOf()) / (1000 * 60 * 60 * 24),
      );

      // Filter out pending invoices
      return daysDifference >= 0;
    }

    return false;
  });
}

export function getPaidInvoices(invoices: any[]) {
  return invoices.filter((invoice) => invoice.status === 'paid');
}

export function formatDateToShortForm(inputDateString: string): string {
  const inputDate = new Date(inputDateString);
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
  const day = inputDate.getDate().toString().padStart(2, '0');
  const year = inputDate.getFullYear();

  return `${day}/${month}/${year}`;
}

export function isOverdue(dueDateStr: string): boolean {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const dueDate = new Date(dueDateStr.replace(/,/, ''));
  dueDate.setHours(0, 0, 0, 0);

  const daysDifference = Math.floor(
    (dueDate.valueOf() - currentDate.valueOf()) / (1000 * 60 * 60 * 24),
  );

  return daysDifference < 0;
}
