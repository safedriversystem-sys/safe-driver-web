export interface ReportData {
  type: string;
  title: string;
  dateRange: string;
  data: any;
  format?: string;
}

export const generatePDFReport = async (reportData: ReportData) => {
  try {
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF on backend');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Format filename
    const dateStr = new Date().toISOString().replace(/T/, '-').replace(/:/g, '').split('.')[0];
    const fileName = `SafeDriver-${reportData.type}-Report-${dateStr}.pdf`;
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
};
