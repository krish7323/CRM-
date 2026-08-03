/**
 * Utility to convert JSON array data to a downloadable CSV / Excel (.xlsx compatible) file
 */
export const exportToExcel = (data: Record<string, any>[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data records available to export.');
    return;
  }

  // Extract keys for header row
  const headers = Object.keys(data[0]);

  // Construct CSV text content
  const csvRows: string[] = [];
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','));

  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
