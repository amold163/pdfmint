import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function validatePDF(file: File): Promise<ArrayBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength === 0) {
    throw new Error(`File "${file.name}" is empty (0 bytes). Please upload a valid PDF document.`);
  }
  
  const header = new Uint8Array(arrayBuffer.slice(0, 5));
  const headerString = Array.from(header).map(b => String.fromCharCode(b)).join('');
  if (headerString !== '%PDF-') {
    throw new Error(`File "${file.name}" is not a valid PDF document (missing PDF header).`);
  }
  
  return arrayBuffer;
}

async function safeLoadPDF(arrayBuffer: ArrayBuffer, password?: string): Promise<PDFDocument> {
  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);
    return pdfDoc;
  } catch (error: any) {
    if (error.message.includes('encrypted') || error.message.includes('password')) {
      if (password) {
        throw new Error("Invalid password. Please check and try again.");
      }
      throw new Error("This PDF is password-protected. Please enter the password or use the 'Unlock PDF' tool first to remove the password before processing.");
    }
    throw error;
  }
}

export async function mergePDFs(files: File[], password?: string): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await validatePDF(file);
    const pdf = await safeLoadPDF(arrayBuffer, password);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
}

export async function splitPDF(file: File, ranges: { start: number; end: number }[], password?: string): Promise<Uint8Array[]> {
  const arrayBuffer = await validatePDF(file);
  const sourcePdf = await safeLoadPDF(arrayBuffer, password);
  const results: Uint8Array[] = [];

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    // Ranges are 1-indexed for users, convert to 0-indexed
    const indices = [];
    for (let i = range.start - 1; i < range.end; i++) {
      if (i >= 0 && i < sourcePdf.getPageCount()) {
        indices.push(i);
      }
    }
    
    const copiedPages = await newPdf.copyPages(sourcePdf, indices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    results.push(await newPdf.save());
  }

  return results;
}

export async function imageToPDF(images: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  for (const imageFile of images) {
    const arrayBuffer = await imageFile.arrayBuffer();
    let image;
    
    if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (imageFile.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue;
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  return await pdfDoc.save();
}

export async function addWatermark(file: File, text: string, password?: string): Promise<Uint8Array> {
  const arrayBuffer = await validatePDF(file);
  const pdfDoc = await safeLoadPDF(arrayBuffer, password);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 4,
      y: height / 2,
      size: 50,
      font: font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.3,
      rotate: { type: 'degrees', angle: 45 } as any,
    });
  }
  
  return await pdfDoc.save();
}

export async function pdfToImages(file: File, password?: string): Promise<string[]> {
  const arrayBuffer = await validatePDF(file);
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer, password }).promise;
  } catch (error: any) {
    if (error.name === 'PasswordException') {
      throw new Error("This PDF is password-protected. Please enter the password or use the 'Unlock PDF' tool first.");
    }
    throw error;
  }
  const images: string[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({ canvasContext: context, viewport, canvas: canvas as any }).promise;
    images.push(canvas.toDataURL('image/jpeg', 0.8));
  }
  
  return images;
}

export async function compressPDF(file: File, password?: string): Promise<Uint8Array> {
  const arrayBuffer = await validatePDF(file);
  const pdfDoc = await safeLoadPDF(arrayBuffer, password);
  // Re-saving with compression enabled (pdf-lib does some basic optimization on save)
  return await pdfDoc.save({ useObjectStreams: true });
}

export async function pdfToWord(file: File, password?: string): Promise<Blob> {
  const arrayBuffer = await validatePDF(file);
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer, password }).promise;
  } catch (error: any) {
    if (error.name === 'PasswordException') {
      throw new Error("This PDF is password-protected. Please enter the password or use the 'Unlock PDF' tool first.");
    }
    throw error;
  }
  const paragraphs: Paragraph[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Page ${i}`,
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: text,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export async function wordToPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });
  
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Basic text wrapping for PDF
  const lines = text.split('\n');
  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let y = height - 50;
  const margin = 50;
  const fontSize = 12;

  for (const line of lines) {
    if (y < margin) {
      page = pdfDoc.addPage();
      y = height - 50;
    }
    
    page.drawText(line.trim() || ' ', {
      x: margin,
      y: y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    y -= fontSize * 1.5;
  }

  return await pdfDoc.save();
}

export async function addPassword(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await validatePDF(file);
  const pdfDoc = await safeLoadPDF(arrayBuffer);
  
  // Encrypt the PDF with the provided password
  // Using any to bypass potential type definition issues in this environment
  (pdfDoc as any).encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'highResolution',
      modifying: true,
      copying: true,
      annotating: true,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: true,
    },
  });
  
  return await pdfDoc.save();
}

export async function removePassword(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await validatePDF(file);

  // First, use pdfjs-dist to verify the password (it supports modern AES encryption)
  let pdf;
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password });
    pdf = await loadingTask.promise;
  } catch (error: any) {
    if (error.name === 'PasswordException') {
      throw new Error("Invalid password. Please check and try again.");
    }
    throw error;
  }

  // Now try to load with pdf-lib to actually remove the protection (lossless)
  try {
    // pdf-lib only supports RC4 40/128-bit encryption, not modern AES
    const pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);
    // Saving it without encryption
    return await pdfDoc.save();
  } catch (error: any) {
    console.warn("PDF-Lib lossless decryption failed, falling back to flattening:", error);
    
    // Fallback: Flattening Unlock (Lossy)
    // We use pdfjs (which we already opened with the password) to render pages
    const pdfDoc = await PDFDocument.create();
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // High quality
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context, viewport, canvas: canvas as any }).promise;
      
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      if (!blob) continue;
      const imgBuffer = await blob.arrayBuffer();
      const embeddedImage = await pdfDoc.embedJpg(imgBuffer);
      
      const pdfPage = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
      pdfPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });
    }
    
    return await pdfDoc.save();
  }
}
