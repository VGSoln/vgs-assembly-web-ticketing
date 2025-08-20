// Export utility functions for data export functionality

export interface ExportDataItem {
  [key: string]: any;
}

// Dynamic import for SheetJS (xlsx library)
const getXLSX = async () => {
  if (typeof window === 'undefined') return null;
  
  // Load XLSX library dynamically
  if (!(window as any).XLSX) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => resolve((window as any).XLSX);
    });
  }
  
  return (window as any).XLSX;
};

// Dynamic import for jsPDF
const getJsPDF = async () => {
  if (typeof window === 'undefined') return null;
  
  if (!(window as any).jsPDF) {
    // Load jsPDF
    const jsPDFScript = document.createElement('script');
    jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(jsPDFScript);
    
    // Load jsPDF AutoTable plugin
    const autoTableScript = document.createElement('script');
    autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
    document.head.appendChild(autoTableScript);
    
    return new Promise((resolve) => {
      let scriptsLoaded = 0;
      const onLoad = () => {
        scriptsLoaded++;
        if (scriptsLoaded === 2) {
          resolve((window as any).jsPDF);
        }
      };
      jsPDFScript.onload = onLoad;
      autoTableScript.onload = onLoad;
    });
  }
  
  return (window as any).jsPDF;
};

// Copy data to clipboard (optimized for Excel paste)
export const copyToClipboard = async (data: ExportDataItem[], headers: string[]) => {
  const tsvContent = convertToTSV(data, headers);
  try {
    await navigator.clipboard.writeText(tsvContent);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

// Print data
export const printData = (data: ExportDataItem[], headers: string[], title: string = 'Data Export') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const tableHTML = generateTableHTML(data, headers);
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .print-date { color: #666; font-size: 14px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
      ${tableHTML}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// Export to Excel (proper .xlsx format)
export const exportToExcel = async (data: ExportDataItem[], headers: string[], filename: string = 'export') => {
  try {
    const XLSX = await getXLSX();
    if (!XLSX) {
      // Fallback to CSV if XLSX library fails to load
      const csvContent = convertToCSV(data, headers);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `${filename}.csv`);
      return;
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet format
    const wsData = [headers, ...data.map(item => headers.map(header => item[header] || ''))];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const colWidths = headers.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Visits');
    
    // Generate Excel file and download
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error('Excel export failed:', error);
    // Fallback to CSV
    const csvContent = convertToCSV(data, headers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
  }
};

// Export to CSV
export const exportToCSV = (data: ExportDataItem[], headers: string[], filename: string = 'export') => {
  const csvContent = convertToCSV(data, headers);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
};

// Export to PDF (proper PDF generation)
export const exportToPDF = async (data: ExportDataItem[], headers: string[], filename: string = 'export') => {
  try {
    const jsPDF = await getJsPDF();
    if (!jsPDF) {
      // Fallback to print dialog
      exportToPDFPrint(data, headers, filename);
      return;
    }

    const { jsPDF: PDF } = (window as any);
    const doc = new PDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Customer Visits Report', 14, 22);
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
    
    // Prepare table data
    const tableData = data.map(item => headers.map(header => String(item[header] || '')));
    
    // Generate table
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [71, 85, 105], // slate-600
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // gray-50
      },
      columnStyles: {
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 25 }, // Customer #
        2: { cellWidth: 30 }, // Customer Name
        3: { cellWidth: 25 }, // Phone
        4: { cellWidth: 15 }, // Zone
        5: { cellWidth: 25 }, // Staff Name
        6: { cellWidth: 20 }, // Visit Date
        7: { cellWidth: 20 }, // Visit Time
        8: { cellWidth: 25 }, // Visit Outcome
        9: { cellWidth: 30 }, // Customer Comments
        10: { cellWidth: 30 }, // Staff Comments
        11: { cellWidth: 20 }, // Created
        12: { cellWidth: 10 }, // GPS
        13: { cellWidth: 10 }, // Photo
      },
      margin: { top: 40 },
    });
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    // Fallback to print dialog
    exportToPDFPrint(data, headers, filename);
  }
};

// Fallback PDF export using print dialog
const exportToPDFPrint = (data: ExportDataItem[], headers: string[], filename: string = 'export') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const tableHTML = generateTableHTML(data, headers);
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PDF Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .export-info { color: #666; font-size: 12px; margin-bottom: 20px; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Customer Visits Report</h1>
      <div class="export-info">Generated on: ${new Date().toLocaleString()}</div>
      <button class="no-print" onclick="window.print()" style="margin-bottom: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Save as PDF</button>
      ${tableHTML}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
};

// Helper function to convert data to CSV format
const convertToCSV = (data: ExportDataItem[], headers: string[]): string => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(item => 
    headers.map(header => {
      const value = item[header] || '';
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Helper function to convert data to TSV format (optimized for Excel paste)
const convertToTSV = (data: ExportDataItem[], headers: string[]): string => {
  const tsvHeaders = headers.join('\t');
  const tsvRows = data.map(item => 
    headers.map(header => {
      const value = item[header] || '';
      const stringValue = String(value);
      // Replace tabs and newlines with spaces for TSV format
      return stringValue.replace(/[\t\n\r]/g, ' ').trim();
    }).join('\t')
  );
  
  return [tsvHeaders, ...tsvRows].join('\n');
};

// Helper function to generate HTML table
const generateTableHTML = (data: ExportDataItem[], headers: string[]): string => {
  const headerRow = headers.map(header => `<th>${header}</th>`).join('');
  const dataRows = data.map(item => 
    headers.map(header => `<td>${item[header] || ''}</td>`).join('')
  ).map(row => `<tr>${row}</tr>`).join('');
  
  return `
    <table>
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${dataRows}
      </tbody>
    </table>
  `;
};

// Helper function to download blob
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Helper function to format data for export
export const formatDataForExport = (data: any[]): ExportDataItem[] => {
  return data.map(item => ({
    'ID': item.id,
    'Customer Number': item.customerNumber,
    'Customer Name': item.customerName,
    'Phone Number': item.phone,
    'Zone': item.zone,
    'Staff Name': item.staffName,
    'Visit Date': item.visitDate,
    'Visit Time': item.visitTime,
    'Visit Outcome': item.visitOutcome,
    'Customer Comments': item.customerComments || '',
    'Staff Comments': item.staffComments || '',
    'Created': item.created,
    'GPS': item.gps ? 'Yes' : 'No',
    'Photo': item.photo ? 'Yes' : 'No'
  }));
};

export const exportHeaders = [
  'ID',
  'Customer Number',
  'Customer Name', 
  'Phone Number',
  'Zone',
  'Staff Name',
  'Visit Date',
  'Visit Time',
  'Visit Outcome',
  'Customer Comments',
  'Staff Comments',
  'Created',
  'GPS',
  'Photo'
];