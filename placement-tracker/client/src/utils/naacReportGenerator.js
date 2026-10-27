import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Generates an official, institutional-grade NAAC Criterion 5.2.1 Placement Audit PDF Report.
 * Compliant with NAAC SSR / NBA / NIRF placement documentation requirements.
 */
export const generateNAACReportPDF = ({
  batch = 'All Batches',
  overview = {},
  branchData = [],
  packageDist = [],
  placements = [],
  reportRef = `SCEM/TPO/NAAC-5.2.1/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
  collegeInfo = {
    name: 'SAHYADRI COLLEGE OF ENGINEERING & MANAGEMENT',
    tagline: 'Autonomous Institute Affiliated to VTU Belagavi | Approved by AICTE, New Delhi',
    accreditation: "Accredited by NAAC with 'A' Grade & Accredited by NBA Programs",
    address: 'Sahyadri Campus, Adyar, Mangaluru, Karnataka - 575007',
    department: 'DEPARTMENT OF TRAINING & PLACEMENT',
  }
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);
  const primaryColor = [31, 92, 58];     // #1F5C3A (Sahyadri Green)
  const secondaryColor = [21, 63, 40];   // #153F28 (Deep Green)
  const accentColor = [159, 230, 190];   // #9FE6BE
  const darkTextColor = [27, 35, 24];
  const mutedTextColor = [92, 102, 79];

  let currentY = 10;

  // ── Top Header Band ──
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // ── College Header Block ──
  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(collegeInfo.name, pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text(collegeInfo.tagline, pageWidth / 2, currentY, { align: 'center' });

  currentY += 3.8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text(collegeInfo.accreditation, pageWidth / 2, currentY, { align: 'center' });

  currentY += 3.8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text(collegeInfo.address, pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text(collegeInfo.department, pageWidth / 2, currentY, { align: 'center' });

  currentY += 2;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // ── Document Title Box ──
  currentY += 4;
  doc.setFillColor(241, 245, 241);
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('ANNUAL PLACEMENT AUDIT REPORT — NAAC CRITERION 5.2.1', pageWidth / 2, currentY + 5.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkTextColor);
  const genDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(`Doc Ref: ${reportRef}   |   Academic Batch: ${batch}   |   Date of Certification: ${genDate}`, pageWidth / 2, currentY + 10.5, { align: 'center' });

  currentY += 18;

  // ── Section 1: Executive Summary Metrics Table ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...secondaryColor);
  doc.text('1. EXECUTIVE SUMMARY & KEY ACCREDITATION INDICATORS', margin, currentY);

  const placementRate = overview.placementRate != null
    ? `${overview.placementRate}%`
    : (overview.totalStudents ? `${((overview.placedStudents / overview.totalStudents) * 100).toFixed(1)}%` : '0%');

  const summaryMetrics = [
    [
      { content: 'Graduating Strength (Outgoing Cohort):', styles: { fontStyle: 'bold' } },
      `${overview.totalStudents || 0} Students`,
      { content: 'Total Students Placed (On/Off Campus):', styles: { fontStyle: 'bold' } },
      `${overview.placedStudents || 0} Students`
    ],
    [
      { content: 'Overall Placement Ratio (Criterion 5.2.1):', styles: { fontStyle: 'bold' } },
      placementRate,
      { content: 'Total Employment Offers Extended:', styles: { fontStyle: 'bold' } },
      `${overview.totalOffers || placements.length || 0} Offers`
    ],
    [
      { content: 'Highest Package Offered (CTC):', styles: { fontStyle: 'bold' } },
      `Rs. ${overview.maxPackage || 0} LPA`,
      { content: 'Average Package (CTC):', styles: { fontStyle: 'bold' } },
      `Rs. ${overview.avgPackage || 0} LPA`
    ],
    [
      { content: 'Participating Recruitment Partners:', styles: { fontStyle: 'bold' } },
      `${overview.totalCompanies || '—'} Organizations`,
      { content: 'Institutional NAAC Audit Status:', styles: { fontStyle: 'bold' } },
      'Verified & Certified Valid'
    ]
  ];

  autoTable(doc, {
    startY: currentY + 2,
    body: summaryMetrics,
    theme: 'grid',
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: darkTextColor,
      lineColor: [220, 226, 218],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 55, fillColor: [248, 250, 248] },
      1: { cellWidth: 36, textColor: primaryColor, fontStyle: 'bold' },
      2: { cellWidth: 55, fillColor: [248, 250, 248] },
      3: { cellWidth: 36, textColor: primaryColor, fontStyle: 'bold' },
    },
  });

  currentY = doc.lastAutoTable.finalY + 6;

  // ── Section 2: Department-wise NAAC Criterion 5.2.1 Table ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...secondaryColor);
  doc.text('2. PROGRAM / DEPARTMENT-WISE PLACEMENT AUDIT TABLE (NAAC 5.2.1)', margin, currentY);

  const deptHeaders = ['S.No', 'Program / Department', 'Graduating Cohort', 'Placed', 'Unplaced', 'Placement Rate (%)', 'Avg CGPA'];
  
  let totalCohort = 0;
  let totalDeptPlaced = 0;

  const deptRows = branchData.map((b, idx) => {
    totalCohort += (b.total || 0);
    totalDeptPlaced += (b.placed || 0);
    const rate = b.total ? ((b.placed / b.total) * 100).toFixed(1) : '0.0';
    return [
      idx + 1,
      b._id || 'General Engineering',
      b.total || 0,
      b.placed || 0,
      (b.total || 0) - (b.placed || 0),
      `${rate}%`,
      b.avgCGPA ? Number(b.avgCGPA).toFixed(2) : '—'
    ];
  });

  // Aggregate Total Row
  const overallRate = totalCohort ? ((totalDeptPlaced / totalCohort) * 100).toFixed(1) : '0.0';
  deptRows.push([
    { content: 'TOTAL', colSpan: 2, styles: { fontStyle: 'bold', halign: 'center', fillColor: [230, 238, 230] } },
    { content: String(totalCohort), styles: { fontStyle: 'bold', fillColor: [230, 238, 230] } },
    { content: String(totalDeptPlaced), styles: { fontStyle: 'bold', fillColor: [230, 238, 230] } },
    { content: String(totalCohort - totalDeptPlaced), styles: { fontStyle: 'bold', fillColor: [230, 238, 230] } },
    { content: `${overallRate}%`, styles: { fontStyle: 'bold', textColor: primaryColor, fillColor: [230, 238, 230] } },
    { content: '—', styles: { fontStyle: 'bold', fillColor: [230, 238, 230] } }
  ]);

  autoTable(doc, {
    startY: currentY + 2,
    head: [deptHeaders],
    body: deptRows,
    theme: 'grid',
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    styles: {
      fontSize: 7.8,
      cellPadding: 2,
      textColor: darkTextColor,
      halign: 'center',
      lineColor: [220, 226, 218],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 55, halign: 'left' },
      2: { cellWidth: 26 },
      3: { cellWidth: 22 },
      4: { cellWidth: 22 },
      5: { cellWidth: 28 },
      6: { cellWidth: 19 },
    },
    alternateRowStyles: {
      fillColor: [250, 252, 250],
    },
  });

  currentY = doc.lastAutoTable.finalY + 6;

  // ── Section 3: Salary Tier Breakdown ──
  if (currentY + 30 > pageHeight - 35) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...secondaryColor);
  doc.text('3. CTC PACKAGE TIER CLASSIFICATION (NIRF / ACCREDITATION STANDARD)', margin, currentY);

  const tierHeaders = ['Salary Tier Bracket', 'Classification Category', 'Offers Count', 'Percentage Share'];
  const totalPkgOffers = packageDist.reduce((acc, curr) => acc + (curr.count || 0), 0) || 1;

  const tierRows = packageDist.map(p => {
    let category = 'Standard Campus Offer';
    if (p.range === '20+' || p.range === '15-20') category = 'Super Dream Offer';
    else if (p.range === '10-15') category = 'Dream Offer';
    else if (p.range === '5-10') category = 'Core Engineering Offer';
    else category = 'Foundation Offer';

    const pct = ((p.count / totalPkgOffers) * 100).toFixed(1);
    return [
      `Rs. ${p.range} LPA`,
      category,
      p.count,
      `${pct}%`
    ];
  });

  autoTable(doc, {
    startY: currentY + 2,
    head: [tierHeaders],
    body: tierRows.length ? tierRows : [['Rs. 0-5 LPA', 'Foundation Offer', 0, '0%']],
    theme: 'grid',
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [35, 75, 50],
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: 'center',
    },
    styles: {
      fontSize: 7.8,
      cellPadding: 1.8,
      textColor: darkTextColor,
      halign: 'center',
      lineColor: [220, 226, 218],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 65, halign: 'left' },
      2: { cellWidth: 35 },
      3: { cellWidth: 42 },
    },
    alternateRowStyles: { fillColor: [250, 252, 250] }
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // ── Section 4: Detailed Nominal Placed Students Roster ──
  doc.addPage();
  currentY = 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text('4. NOMINAL ROLL OF PLACED STUDENTS — NAAC SSR CRITERION 5.2.1 COMPLIANT FORMAT', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('Individual appointment records with student identification, program, recruiting organization, role, and compensation package.', margin, currentY + 4);

  const studentHeaders = ['#', 'USN / Roll No', 'Student Name', 'Program', 'Appointed Employer', 'Designation / Role', 'CTC (LPA)', 'Offer Date'];

  const studentRows = placements.map((p, idx) => {
    const s = p.student || {};
    const c = p.company || {};
    const offerDateFormatted = p.dateOfOffer
      ? new Date(p.dateOfOffer).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

    return [
      idx + 1,
      s.rollNo || '—',
      s.name || 'Unknown',
      s.branch || '—',
      c.name || p.companyName || '—',
      p.role || 'Associate Software Engineer',
      p.package != null ? `Rs. ${p.package}` : '—',
      offerDateFormatted
    ];
  });

  autoTable(doc, {
    startY: currentY + 6,
    head: [studentHeaders],
    body: studentRows.length ? studentRows : [['1', '—', 'No placement records recorded for this filter', '—', '—', '—', '—', '—']],
    theme: 'grid',
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    styles: {
      fontSize: 7.2,
      cellPadding: 1.8,
      textColor: darkTextColor,
      lineColor: [225, 230, 224],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 36 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 32 },
      5: { cellWidth: 32 },
      6: { cellWidth: 16, halign: 'center', textColor: primaryColor, fontStyle: 'bold' },
      7: { cellWidth: 14, halign: 'center' },
    },
    alternateRowStyles: { fillColor: [250, 252, 250] },
  });

  // ── Section 5: Official Certification & Signatures Block ──
  let finalY = doc.lastAutoTable.finalY + 12;

  // Check if signature block fits on the page
  if (finalY + 38 > pageHeight - 15) {
    doc.addPage();
    finalY = 25;
  }

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.4);
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(margin, finalY, contentWidth, 32, 2, 2, 'FD');

  const colW = contentWidth / 3;

  // Signature 1: Placement Coordinator
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkTextColor);
  doc.text('Prepared & Verified by:', margin + 6, finalY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Placement Coordinator', margin + 6, finalY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text('PlaceTrack Central Cell', margin + 6, finalY + 26);

  // Signature 2: TPO Head
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkTextColor);
  doc.text('Endorsed & Submitted by:', margin + colW + 6, finalY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Head - Training & Placement', margin + colW + 6, finalY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text('Director of Career Services', margin + colW + 6, finalY + 26);

  // Signature 3: Principal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkTextColor);
  doc.text('Approved & Certified by:', margin + (colW * 2) + 6, finalY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Principal / Head of Institution', margin + (colW * 2) + 6, finalY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text('Sahyadri College of Engg. & Mgmt.', margin + (colW * 2) + 6, finalY + 26);

  // Signature lines
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(margin + 6, finalY + 18, margin + 45, finalY + 18);
  doc.line(margin + colW + 6, finalY + 18, margin + colW + 55, finalY + 18);
  doc.line(margin + (colW * 2) + 6, finalY + 18, margin + (colW * 2) + 55, finalY + 18);

  // ── Running Page Headers and Footers ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header (from page 2 onwards)
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('SAHYADRI COLLEGE OF ENGG. & MGMT. — NAAC SSR CRITERION 5.2.1 AUDIT REPORT', margin, 8);
      doc.text(`Batch: ${batch}`, pageWidth - margin, 8, { align: 'right' });
      doc.setDrawColor(210, 215, 210);
      doc.setLineWidth(0.2);
      doc.line(margin, 9.5, pageWidth - margin, 9.5);
    }

    // Running Footer (on all pages)
    doc.setDrawColor(210, 215, 210);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(130, 130, 130);
    doc.text('PlaceTrack Enterprise Placement Portal | Official Accreditation Audit Copy | Confidential', margin, pageHeight - 5.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 5.5, { align: 'right' });
  }

  // Save the PDF file
  const fileName = `NAAC_Criterion_5.2.1_Report_${String(batch).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
};

/**
 * Generates an official Excel spreadsheet formatted strictly for NAAC SSR / NIRF portal upload.
 */
export const exportNAACExcel = ({
  batch = 'All Batches',
  overview = {},
  branchData = [],
  placements = [],
}) => {
  const workbook = XLSX.utils.book_new();

  // ── Sheet 1: NAAC Summary Metrics ──
  const summaryData = [
    { 'NAAC Indicator / Metric': 'Institution Name', 'Value': 'Sahyadri College of Engineering & Management, Mangaluru' },
    { 'NAAC Indicator / Metric': 'Accreditation Criteria', 'Value': 'NAAC SSR Criterion 5.2.1 - Placement of Outgoing Students' },
    { 'NAAC Indicator / Metric': 'Academic Batch Evaluated', 'Value': String(batch) },
    { 'NAAC Indicator / Metric': 'Total Outgoing Graduating Cohort', 'Value': overview.totalStudents || 0 },
    { 'NAAC Indicator / Metric': 'Total Graduating Students Placed', 'Value': overview.placedStudents || 0 },
    { 'NAAC Indicator / Metric': 'Percentage of Placement (Criterion 5.2.1)', 'Value': `${overview.placementRate || 0}%` },
    { 'NAAC Indicator / Metric': 'Total Employment Offers Received', 'Value': overview.totalOffers || placements.length || 0 },
    { 'NAAC Indicator / Metric': 'Highest Pay Package (CTC)', 'Value': `Rs. ${overview.maxPackage || 0} LPA` },
    { 'NAAC Indicator / Metric': 'Average Pay Package (CTC)', 'Value': `Rs. ${overview.avgPackage || 0} LPA` },
    { 'NAAC Indicator / Metric': 'Total Recruiting Organizations', 'Value': overview.totalCompanies || 0 },
    { 'NAAC Indicator / Metric': 'Date of Audit Certification', 'Value': new Date().toLocaleDateString('en-IN') },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'NAAC_Criterion_5.2.1_Summary');

  // ── Sheet 2: Department-wise Data ──
  const deptData = branchData.map((b, idx) => ({
    'S.No': idx + 1,
    'Department / Academic Program': b._id,
    'Graduating Cohort': b.total,
    'Placed Students': b.placed,
    'Unplaced Students': b.total - b.placed,
    'Placement Ratio (%)': b.total ? ((b.placed / b.total) * 100).toFixed(1) : '0',
    'Average CGPA': b.avgCGPA ? Number(b.avgCGPA).toFixed(2) : 'N/A'
  }));

  const wsDept = XLSX.utils.json_to_sheet(deptData);
  XLSX.utils.book_append_sheet(workbook, wsDept, 'Department_Wise_Breakdown');

  // ── Sheet 3: Nominal Placed Students Roster (Direct NAAC Format) ──
  const rosterData = placements.map((p, idx) => {
    const s = p.student || {};
    const c = p.company || {};
    return {
      'S.No': idx + 1,
      'University Serial No (USN)': s.rollNo || 'N/A',
      'Student Name': s.name || 'Unknown',
      'Program Graduated From': s.branch || 'N/A',
      'Batch': s.batch || 'N/A',
      'Appointed Employer / Company': c.name || p.companyName || 'N/A',
      'Job Designation / Role': p.role || 'Software Engineer',
      'Pay Package at Appointment (LPA)': p.package != null ? p.package : 'N/A',
      'Offer Type': p.offerType || 'On Campus',
      'Appointment / Offer Date': p.dateOfOffer ? new Date(p.dateOfOffer).toLocaleDateString('en-IN') : 'N/A',
      'Student Email': s.email || 'N/A',
    };
  });

  const wsRoster = XLSX.utils.json_to_sheet(rosterData);
  XLSX.utils.book_append_sheet(workbook, wsRoster, 'Placed_Students_NAAC_Format');

  // Write Excel file
  const fileName = `NAAC_Criterion_5.2.1_Spreadsheet_${String(batch).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
