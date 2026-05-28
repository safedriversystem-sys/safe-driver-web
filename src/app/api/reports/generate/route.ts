import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  try {
    const { title, dateRange, data, type } = await req.json();

    // Create the HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-after: always; }
        </style>
      </head>
      <body class="bg-gray-50 text-gray-800 p-12">
        <div class="max-w-4xl mx-auto bg-white p-10 shadow-xl rounded-2xl border border-gray-100">
          
          <!-- Header -->
          <div class="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="bg-blue-600 p-2 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">SafeDriver Authority</h1>
              </div>
              <h2 class="text-xl font-bold text-gray-700 mt-4">${title}</h2>
            </div>
            <div class="text-right text-sm text-gray-500 space-y-1">
              <p class="font-semibold text-gray-700">Generated On</p>
              <p>${new Date().toLocaleString()}</p>
              <p class="font-semibold text-gray-700 mt-2">Report Period</p>
              <p>${dateRange}</p>
            </div>
          </div>

          <!-- Executive Summary -->
          <div class="mb-10">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="bg-blue-100 text-blue-700 p-1.5 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></span>
              Executive Summary
            </h3>
            <div class="grid grid-cols-3 gap-6">
              <div class="bg-red-50 rounded-xl p-5 border border-red-100">
                <p class="text-red-600 text-sm font-semibold uppercase tracking-wider mb-1">Total Alerts</p>
                <p class="text-3xl font-black text-red-700">${data?.summary?.totalAlerts || 0}</p>
              </div>
              <div class="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <p class="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Active Drivers</p>
                <p class="text-3xl font-black text-blue-700">${data?.summary?.activeDrivers || 0}</p>
              </div>
              <div class="bg-green-50 rounded-xl p-5 border border-green-100">
                <p class="text-green-600 text-sm font-semibold uppercase tracking-wider mb-1">System Uptime</p>
                <p class="text-3xl font-black text-green-700">${data?.summary?.systemUptime || 100}%</p>
              </div>
            </div>
          </div>

          ${
            type === 'custom-dynamic' ? `
            <!-- Dynamic Custom Section -->
            <div class="mb-10">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="bg-purple-100 text-purple-700 p-1.5 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></span>
                Dynamic Metrics
              </h3>
              
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wider font-semibold">Target Entity</p>
                  <p class="text-xl font-bold text-gray-900">${data?.entityName || 'Entire Fleet'}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500 uppercase tracking-wider font-semibold">AI Safety Score</p>
                  <p class="text-3xl font-black ${data?.safetyScore > 80 ? 'text-green-600' : data?.safetyScore > 50 ? 'text-amber-600' : 'text-red-600'}">${data?.safetyScore?.toFixed(1) || 0}%</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <!-- Infraction Breakdown -->
                <div>
                  <h4 class="text-md font-bold text-gray-800 mb-3">Infraction Breakdown</h4>
                  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table class="w-full text-left text-sm">
                      <thead class="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                          <th class="px-4 py-3 border-b border-gray-200">Type</th>
                          <th class="px-4 py-3 text-right border-b border-gray-200">Count</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        <tr>
                          <td class="px-4 py-3 text-red-600 font-medium">Drowsiness (Critical)</td>
                          <td class="px-4 py-3 text-right font-bold">${data?.counts?.drowsiness || 0}</td>
                        </tr>
                        <tr>
                          <td class="px-4 py-3 text-amber-600 font-medium">Yawning (Warning)</td>
                          <td class="px-4 py-3 text-right font-bold">${data?.counts?.yawn || 0}</td>
                        </tr>
                        <tr>
                          <td class="px-4 py-3 text-red-500 font-medium">Phone Usage (High)</td>
                          <td class="px-4 py-3 text-right font-bold">${data?.counts?.phone || 0}</td>
                        </tr>
                        <tr>
                          <td class="px-4 py-3 text-gray-600 font-medium">Distraction</td>
                          <td class="px-4 py-3 text-right font-bold">${data?.counts?.distraction || 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Feedbacks Summary -->
                <div>
                  <h4 class="text-md font-bold text-gray-800 mb-3">Customer Feedback Summary</h4>
                  <div class="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-center items-center h-full shadow-sm">
                    <p class="text-5xl font-black text-blue-600 mb-2">${data?.feedbacks?.averageRating || 'N/A'}<span class="text-xl text-gray-400">/5</span></p>
                    <p class="text-gray-500 font-medium">Average Rating from ${data?.feedbacks?.total || 0} feedbacks</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Feedbacks -->
            ${data?.feedbacks?.recent?.length > 0 ? `
              <div class="mt-8">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Recent Passenger Comments</h3>
                <div class="space-y-4">
                  ${data.feedbacks.recent.map((f: any) => `
                    <div class="bg-white shadow-sm rounded-xl p-4 border border-gray-200 mb-4">
                      <div class="flex justify-between items-start mb-2">
                        <div>
                          <h4 class="font-bold text-gray-900">${f.title || 'Passenger Feedback'}</h4>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full shadow-sm">${f.rating} Stars</span>
                            ${f.busNumber && f.busNumber !== "Unknown Bus" ? `<span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Bus: ${f.busNumber}</span>` : ''}
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-xs text-gray-500 font-medium">${f.date}</p>
                          <p class="text-xs font-semibold text-gray-600 mt-1">${f.userName || 'Anonymous'}</p>
                        </div>
                      </div>
                      <p class="text-gray-700 italic mt-3">"${f.comment}"</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            ` : `
            <!-- Fallback Default Content -->
            <div class="mb-10">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="bg-amber-100 text-amber-700 p-1.5 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></span>
                Alert Distribution
              </h3>
              <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table class="w-full text-left text-sm">
                  <thead class="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                    <tr>
                      <th class="px-4 py-3 border-b border-gray-200">Type</th>
                      <th class="px-4 py-3 text-right border-b border-gray-200">Count</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    ${data?.alerts?.map((a: any) => `
                      <tr>
                        <td class="px-4 py-3 font-medium text-gray-800">${a.type}</td>
                        <td class="px-4 py-3 text-right font-bold text-gray-600">${a.count}</td>
                      </tr>
                    `).join('') || `<tr><td colspan="2" class="px-4 py-3 text-center text-gray-500">No alerts found.</td></tr>`}
                  </tbody>
                </table>
              </div>
            </div>
            `}

        </div>
      </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for network to be idle to ensure fonts/css load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' } 
    });
    
    await browser.close();

    // Return the PDF buffer
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SafeDriver-Report.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
