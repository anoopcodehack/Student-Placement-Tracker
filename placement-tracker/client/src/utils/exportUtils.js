import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to Excel
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Name of the file
 */
export const exportToExcel = (data, fileName = 'report') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
};

/**
 * Export data to PDF Table
 * @param {Array} columns - Table column headers
 * @param {Array} data - Table data rows
 * @param {String} title - PDF Title
 * @param {String} fileName - Name of the file
 */
export const exportToPDF = (columns, data, title = 'Placement Report', fileName = 'report') => {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Add table
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [26, 86, 219], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 35 },
    styles: { font: 'helvetica', fontSize: 9 },
  });
  
  doc.save(`${fileName}_${new Date().getTime()}.pdf`);
};
