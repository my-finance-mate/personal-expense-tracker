const PDFDocument = require('pdfkit');

exports.generateGroupReport = (group) => {
  const doc = new PDFDocument();
  
  doc.fontSize(20).text(`${group.name} - Expense Report`, { align: 'center' });
  doc.moveDown();
  
  // Add group details
  doc.fontSize(14).text(`Created by: ${group.createdBy.name}`);
  doc.text(`Created on: ${new Date(group.createdAt).toLocaleDateString()}`);
  doc.moveDown();
  
  // Add expenses table
  doc.fontSize(16).text('Expenses', { underline: true });
  group.expenses.forEach(expense => {
    doc.text(`${expense.description}: ₹${expense.amount} (Paid by ${expense.payer.name})`);
  });
  
  // Add balances
  doc.moveDown().fontSize(16).text('Balances', { underline: true });
  group.members.forEach(member => {
    const balanceText = member.balance > 0 
      ? `Owes ₹${member.balance.toFixed(2)}`
      : `Gets back ₹${Math.abs(member.balance).toFixed(2)}`;
    doc.text(`${member.user.name}: ${balanceText}`);
  });
  
  return doc;
};