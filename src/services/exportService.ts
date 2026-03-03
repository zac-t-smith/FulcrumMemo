import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';

interface MemoSection {
  title: string;
  content: string;
}

interface MemoExportData {
  companyName: string;
  ticker: string;
  sections: MemoSection[];
  date?: string;
  analyst?: string;
}

// PDF Export - Investment Memo
export const exportToPDF = (data: MemoExportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add wrapped text
  const addWrappedText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' = 'normal', color: number[] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.4;

    for (let i = 0; i < lines.length; i++) {
      checkPageBreak(lineHeight + 5);
      doc.text(lines[i], margin, yPosition);
      yPosition += lineHeight;
    }
  };

  // Cover Page
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, pageHeight / 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('INVESTMENT MEMO', pageWidth / 2, 40, { align: 'center' });

  doc.setFontSize(24);
  doc.text(data.companyName, pageWidth / 2, 60, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(`(${data.ticker})`, pageWidth / 2, 75, { align: 'center' });

  // Date and Analyst
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  yPosition = pageHeight / 3 + 20;
  addWrappedText(`Date: ${data.date || new Date().toLocaleDateString()}`, 10, 'normal', [100, 100, 100]);
  yPosition += 5;
  addWrappedText(`Analyst: ${data.analyst || 'Zac Smith'}`, 10, 'normal', [100, 100, 100]);
  yPosition += 5;
  addWrappedText(`Generated with Fulcrum Memo`, 10, 'italic', [150, 150, 150]);

  // Disclaimer
  yPosition = pageHeight - 40;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const disclaimer = 'This document is for educational purposes only and does not constitute investment advice. All financial data and analyses are based on publicly available information and may contain errors or omissions.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  disclaimerLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 3;
  });

  // New page for content
  doc.addPage();
  yPosition = margin;

  // Table of Contents
  doc.setTextColor(0, 0, 0);
  addWrappedText('TABLE OF CONTENTS', 16, 'bold');
  yPosition += 10;

  data.sections.forEach((section, index) => {
    checkPageBreak(8);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${index + 1}. ${section.title}`, margin + 5, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Content Sections
  data.sections.forEach((section, index) => {
    checkPageBreak(30);

    // Section number and title
    doc.setFillColor(200, 180, 120);
    doc.rect(margin - 5, yPosition - 5, contentWidth + 10, 12, 'F');

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${section.title.toUpperCase()}`, margin, yPosition + 3);
    yPosition += 15;

    // Section content
    doc.setTextColor(0, 0, 0);
    addWrappedText(section.content, 10, 'normal');
    yPosition += 15;
  });

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${data.companyName} (${data.ticker}) | Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // Save the PDF
  doc.save(`${data.ticker}_Investment_Memo_${new Date().toISOString().split('T')[0]}.pdf`);
};

// PPTX Export - Pitch Deck
export const exportToPPTX = (data: MemoExportData) => {
  const pres = new pptxgen();

  // Set presentation properties
  pres.author = data.analyst || 'Zac Smith';
  pres.company = 'Fulcrum Memo';
  pres.subject = `${data.companyName} Investment Analysis`;
  pres.title = `${data.ticker} Pitch Deck`;

  // Define color scheme (dark gold/cream theme)
  const colors = {
    primary: 'C8B47C', // Gold
    dark: '1E1E1E',
    light: 'F5F5F0',
    accent: 'A0885F',
    text: '333333'
  };

  // Title Slide
  let slide = pres.addSlide();
  slide.background = { color: colors.dark };
  slide.addText('INVESTMENT MEMO', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1,
    fontSize: 48,
    bold: true,
    color: colors.light,
    align: 'center'
  });
  slide.addText(data.companyName, {
    x: 0.5,
    y: 2.8,
    w: 9,
    h: 0.8,
    fontSize: 36,
    color: colors.primary,
    align: 'center'
  });
  slide.addText(`(${data.ticker})`, {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: colors.light,
    align: 'center'
  });
  slide.addText(`${data.date || new Date().toLocaleDateString()} | ${data.analyst || 'Zac Smith'}`, {
    x: 0.5,
    y: 5,
    w: 9,
    h: 0.3,
    fontSize: 14,
    color: 'AAAAAA',
    align: 'center'
  });

  // Table of Contents
  slide = pres.addSlide();
  slide.background = { color: colors.light };
  slide.addText('AGENDA', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: colors.dark
  });

  const tocItems = data.sections.map((section, index) => ({
    text: `${index + 1}. ${section.title}`,
    options: { fontSize: 18, bullet: true, color: colors.text }
  }));

  slide.addText(tocItems, {
    x: 1,
    y: 1.5,
    w: 8,
    h: 4,
    fontSize: 18,
    color: colors.text
  });

  // Content Slides - One per section
  data.sections.forEach((section, index) => {
    slide = pres.addSlide();
    slide.background = { color: colors.light };

    // Section header with gold bar
    slide.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.8,
      fill: { color: colors.primary }
    });

    slide.addText(`${index + 1}. ${section.title.toUpperCase()}`, {
      x: 0.5,
      y: 0.15,
      w: 9,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: colors.dark
    });

    // Content - split into paragraphs
    const paragraphs = section.content.split('\n\n').filter(p => p.trim());
    const contentText = paragraphs.map(para => ({
      text: para.trim(),
      options: {
        fontSize: 14,
        bullet: para.startsWith('•') || para.startsWith('-'),
        color: colors.text,
        breakLine: true
      }
    }));

    slide.addText(contentText.slice(0, 8), { // Limit to prevent overflow
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 4.3,
      fontSize: 14,
      color: colors.text,
      valign: 'top'
    });

    // Footer
    slide.addText(`${data.companyName} (${data.ticker})`, {
      x: 0.5,
      y: 5.8,
      w: 7,
      h: 0.2,
      fontSize: 10,
      color: 'AAAAAA'
    });
    slide.addText(`${index + 1} / ${data.sections.length}`, {
      x: 8.5,
      y: 5.8,
      w: 1,
      h: 0.2,
      fontSize: 10,
      color: 'AAAAAA',
      align: 'right'
    });
  });

  // Closing Slide
  slide = pres.addSlide();
  slide.background = { color: colors.dark };
  slide.addText('THANK YOU', {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  slide.addText('Questions?', {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: colors.light,
    align: 'center'
  });
  slide.addText('🤖 Generated with Fulcrum Memo', {
    x: 0.5,
    y: 5,
    w: 9,
    h: 0.3,
    fontSize: 12,
    color: 'AAAAAA',
    align: 'center',
    italic: true
  });

  // Save the presentation
  pres.writeFile({ fileName: `${data.ticker}_Pitch_Deck_${new Date().toISOString().split('T')[0]}.pptx` });
};

// Export both formats
export const exportBoth = (data: MemoExportData) => {
  exportToPDF(data);
  // Small delay to prevent browser issues with multiple downloads
  setTimeout(() => exportToPPTX(data), 500);
};
