import html2pdf from 'html2pdf.js';

interface PdfOptions {
  title: string;
  filename: string;
  headerText?: string;
  footerText?: string;
}

export const generateMemoPdf = async (
  contentRef: HTMLElement | null,
  options: PdfOptions
) => {
  if (!contentRef) {
    console.error('No content element provided');
    return;
  }

  // Clone the content to avoid modifying the original
  const clonedContent = contentRef.cloneNode(true) as HTMLElement;

  // Remove elements that shouldn't be in the PDF
  const elementsToRemove = clonedContent.querySelectorAll(
    '.no-print, [data-no-print], .share-buttons, .toc-sidebar, .reading-progress'
  );
  elementsToRemove.forEach((el) => el.remove());

  // Create a wrapper with print-friendly styles
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <style>
      * {
        font-family: 'Georgia', 'Times New Roman', serif !important;
        color: #1a1a1a !important;
        background: white !important;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Arial', 'Helvetica', sans-serif !important;
        color: #0a0a0a !important;
        page-break-after: avoid;
      }
      h1 { font-size: 24pt; margin-bottom: 12pt; }
      h2 { font-size: 18pt; margin-top: 24pt; margin-bottom: 10pt; border-bottom: 1px solid #ccc; padding-bottom: 4pt; }
      h3, h4 { font-size: 14pt; margin-top: 16pt; margin-bottom: 8pt; }
      p, li { font-size: 11pt; line-height: 1.6; margin-bottom: 8pt; }
      .tag-pill { display: none !important; }
      .surface-card, .surface-elevated {
        border: 1px solid #ddd !important;
        padding: 12pt !important;
        margin: 12pt 0 !important;
        border-radius: 4px !important;
      }
      table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 12pt 0 !important;
      }
      th, td {
        border: 1px solid #ccc !important;
        padding: 6pt 8pt !important;
        font-size: 10pt !important;
        text-align: left !important;
      }
      th {
        background: #f5f5f5 !important;
        font-weight: bold !important;
      }
      blockquote {
        border-left: 3px solid #c9a227 !important;
        padding-left: 12pt !important;
        margin: 16pt 0 !important;
        font-style: italic !important;
        color: #333 !important;
      }
      .chart-container, canvas, svg {
        max-width: 100% !important;
        height: auto !important;
      }
      img { max-width: 100%; height: auto; }
      a { color: #1a1a1a !important; text-decoration: underline !important; }
      .gold-line { display: none !important; }
      section { page-break-inside: avoid; }
    </style>
    <div style="padding: 20pt; max-width: 650pt; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 24pt; padding-bottom: 16pt; border-bottom: 2px solid #c9a227;">
        <div style="font-size: 10pt; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8pt;">
          The Fulcrum Memo
        </div>
        <h1 style="margin: 0; font-size: 22pt; line-height: 1.3;">${options.title}</h1>
        <div style="margin-top: 12pt; font-size: 10pt; color: #666;">
          ${options.headerText || 'Zachary Smith | March 2026'}
        </div>
      </div>
      ${clonedContent.innerHTML}
      <div style="margin-top: 32pt; padding-top: 16pt; border-top: 1px solid #ccc; text-align: center; font-size: 9pt; color: #666;">
        ${options.footerText || 'The Fulcrum Memo | thefulcrummemo.com | © 2026 Zachary Smith'}
      </div>
    </div>
  `;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: options.filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(wrapper).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
