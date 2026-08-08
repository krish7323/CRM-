import PDFDocument from 'pdfkit';
export const generateReceiptPDF = (fee, installmentNo) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40 });
        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));
        const inst = fee.installments.find((i) => i.installmentNo === installmentNo) || fee.installments[0];
        // Top Saffron & Navy Header
        doc.fillColor('#0F172A').rect(0, 0, doc.page.width, 100).fill();
        doc.fillColor('#F59E0B').fontSize(18).font('Helvetica-Bold').text('THE EUROPEAN LANGUAGE ACADEMY', 40, 26);
        doc.fillColor('#38BDF8').fontSize(9).font('Helvetica').text('TELA — Kaithal • Reg. No: TELA-CEFR-2026/881', 40, 52);
        doc.fillColor('#FFFFFF').fontSize(9).text(`Receipt #: TELA-REC-${inst?.transactionRef || '9981'}`, doc.page.width - 200, 28, { align: 'right' });
        doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, doc.page.width - 200, 44, { align: 'right' });
        doc.text(`GSTIN: 06AAAAA0000A1Z5`, doc.page.width - 200, 60, { align: 'right' });
        doc.moveDown(4);
        // Student & Fee Details Box
        doc.fillColor('#1E293B').fontSize(13).font('Helvetica-Bold').text('Student & Payment Fee Summary', 40, 125);
        doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(40, 142).lineTo(doc.page.width - 40, 142).stroke();
        doc.fontSize(10).font('Helvetica').fillColor('#334155');
        doc.text(`Student Name: ${fee.studentName}`, 40, 155);
        doc.text(`Student ID: ${fee.studentCode}`, 40, 175);
        doc.text(`Course / Batch: ${fee.courseName}`, 40, 195);
        doc.text(`Payment Mode: ${inst?.mode || 'UPI (Google Pay / PhonePe)'}`, 300, 155);
        doc.text(`UPI / Txn Reference: ${inst?.transactionRef || 'UPI-994182'}`, 300, 175);
        doc.text(`Payment Status: Verified Paid`, 300, 195);
        // Financial Table
        doc.fillColor('#0F172A').rect(40, 235, doc.page.width - 80, 25).fill();
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').text('Description', 50, 242);
        doc.text('Amount Paid (INR)', doc.page.width - 150, 242, { align: 'right' });
        doc.fillColor('#334155').font('Helvetica').text(`Tuition Fee Installment #${installmentNo}`, 50, 270);
        doc.text(`Rs. ${(inst?.paidAmount || inst?.amount || 0).toLocaleString('en-IN')}`, doc.page.width - 150, 270, { align: 'right' });
        doc.strokeColor('#E2E8F0').moveTo(40, 290).lineTo(doc.page.width - 40, 290).stroke();
        doc.fillColor('#0F172A').font('Helvetica-Bold').text('Total Paid Today:', 50, 305);
        doc.fillColor('#059669').fontSize(13).text(`Rs. ${(inst?.paidAmount || inst?.amount || 0).toLocaleString('en-IN')}`, doc.page.width - 150, 303, { align: 'right' });
        // Official Stamp
        doc.fontSize(8).fillColor('#64748B').text('This is a computer-generated official payment receipt issued by The European Language Academy (TELA - Kaithal).', 40, 380, { align: 'center' });
        doc.end();
    });
};
