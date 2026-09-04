'use client';

import { MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

export type PrintSize = '9cm' | 'a6' | 'a5';

export const PRINT_SIZES: { id: PrintSize; label: string; hint: string }[] = [
  { id: '9cm', label: '9 × 9 cm', hint: 'Label kecil' },
  { id: 'a6', label: 'A6', hint: 'Kartu gantung' },
  { id: 'a5', label: 'A5', hint: 'Poster mini' },
];

type QrPrintLabelProps = {
  qrValue: string;
  title: string;
  subtitle: string;
  location?: string | null;
  size: PrintSize;
  className?: string;
};

export function QrPrintLabel({
  qrValue,
  title,
  subtitle,
  location,
  size,
  className,
}: QrPrintLabelProps) {
  const qrSize = size === '9cm' ? 168 : size === 'a6' ? 200 : 240;

  return (
    <article
      className={cn('qr-print-label', `qr-size-${size}`, className)}
      data-print-size={size}
    >
      <div className="qr-print-label-inner">
        <header className="qr-print-header">
          <div className="qr-print-logo">
            <img src="/Logo.png" alt="" className="qr-print-logo-img" />
          </div>
          <div>
            <p className="qr-print-brand">Kebun Seroja</p>
            <p className="qr-print-tagline">Knowledge Hub</p>
          </div>
        </header>

        <div className="qr-print-body">
          <p className="qr-print-scan">Pindai QR untuk info tanaman</p>

          <div className="qr-print-code">
            <QRCodeSVG
              value={qrValue || ' '}
              size={qrSize}
              level="H"
              includeMargin={false}
              fgColor="#14532d"
              bgColor="#ffffff"
            />
          </div>

          <h2 className="qr-print-title">{title}</h2>
          <p className="qr-print-subtitle">{subtitle}</p>

          {location ? (
            <p className="qr-print-location">
              <MapPin className="qr-print-pin" aria-hidden />
              {location}
            </p>
          ) : null}
        </div>

        <footer className="qr-print-footer">
          <span className="qr-print-url">{qrValue}</span>
        </footer>
      </div>
    </article>
  );
}

function wrapCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    shown[maxLines - 1] = `${shown[maxLines - 1].replace(/\s+\S*$/, '')}…`;
  }

  shown.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight);
  });

  return shown.length * lineHeight;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function downloadQrLabelPng(options: {
  svg: SVGElement;
  title: string;
  subtitle: string;
  location?: string | null;
  url: string;
  filename: string;
  size: PrintSize;
}) {
  const { svg, title, subtitle, location, url, filename, size } = options;

  const dims =
    size === '9cm'
      ? { w: 900, h: 980 }
      : size === 'a5'
        ? { w: 1240, h: 1754 }
        : { w: 1050, h: 1480 };

  const canvas = document.createElement('canvas');
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = dims.w;
  const H = dims.h;
  const pad = Math.round(W * 0.055);

  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#fffef9';
  roundRect(ctx, pad * 0.35, pad * 0.35, W - pad * 0.7, H - pad * 0.7, 28);
  ctx.fill();

  ctx.strokeStyle = '#166534';
  ctx.lineWidth = 10;
  roundRect(ctx, pad * 0.35, pad * 0.35, W - pad * 0.7, H - pad * 0.7, 28);
  ctx.stroke();

  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 3;
  roundRect(ctx, pad * 0.55, pad * 0.55, W - pad * 1.1, H - pad * 1.1, 22);
  ctx.stroke();

  const headerH = Math.round(H * 0.16);
  ctx.save();
  roundRect(ctx, pad * 0.55, pad * 0.55, W - pad * 1.1, headerH, 18);
  ctx.clip();
  ctx.fillStyle = '#166534';
  ctx.fillRect(pad * 0.55, pad * 0.55, W - pad * 1.1, headerH + 20);
  ctx.restore();

  const logo = await loadImage('/Logo.png');
  const logoSize = Math.round(headerH * 0.42);
  const headerCy = pad * 0.55 + headerH / 2;
  const logoX = W / 2 - logoSize * 2.1;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, logoX, headerCy - logoSize / 2, logoSize, logoSize, 12);
  ctx.fill();
  if (logo) {
    ctx.drawImage(logo, logoX + 4, headerCy - logoSize / 2 + 4, logoSize - 8, logoSize - 8);
  }

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = `bold ${Math.round(W * 0.048)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('KEBUN SEROJA', logoX + logoSize + 16, headerCy - 4);
  ctx.font = `${Math.round(W * 0.026)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = '#bbf7d0';
  ctx.fillText('Knowledge Hub', logoX + logoSize + 16, headerCy + Math.round(W * 0.032));

  ctx.textAlign = 'center';
  ctx.fillStyle = '#78716c';
  ctx.font = `${Math.round(W * 0.028)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('Pindai QR untuk info tanaman', W / 2, headerH + pad * 1.35);

  const svgClone = svg.cloneNode(true) as SVGElement;
  if (!svgClone.getAttribute('xmlns')) {
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  const qrBox = Math.round(Math.min(W, H) * (size === '9cm' ? 0.46 : 0.42));
  svgClone.setAttribute('width', String(qrBox));
  svgClone.setAttribute('height', String(qrBox));
  const svgData = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const qrImg = await loadImage(svgUrl);
  URL.revokeObjectURL(svgUrl);

  const qrY = headerH + pad * 1.7;
  const qrX = (W - qrBox) / 2;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, qrX - 18, qrY - 18, qrBox + 36, qrBox + 36, 20);
  ctx.fill();
  ctx.strokeStyle = '#e7e5e4';
  ctx.lineWidth = 3;
  roundRect(ctx, qrX - 18, qrY - 18, qrBox + 36, qrBox + 36, 20);
  ctx.stroke();
  if (qrImg) ctx.drawImage(qrImg, qrX, qrY, qrBox, qrBox);

  let y = qrY + qrBox + pad * 0.85;
  ctx.fillStyle = '#14532d';
  ctx.font = `bold ${Math.round(W * 0.058)}px "Plus Jakarta Sans", sans-serif`;
  y += wrapCentered(ctx, title.toUpperCase(), W / 2, y, W - pad * 2.4, Math.round(W * 0.068));

  ctx.fillStyle = '#166534';
  ctx.font = `600 ${Math.round(W * 0.032)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(subtitle, W / 2, y + Math.round(W * 0.02));
  y += Math.round(W * 0.07);

  if (location) {
    ctx.fillStyle = '#44403c';
    ctx.font = `${Math.round(W * 0.03)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(location, W / 2, y);
  }

  ctx.fillStyle = '#a8a29e';
  ctx.font = `${Math.round(W * 0.022)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(url, W / 2, H - pad * 1.15);

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Gagal membuat PNG'));
        return;
      }
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      resolve();
    }, 'image/png');
  });
}
