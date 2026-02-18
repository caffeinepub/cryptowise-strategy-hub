import { useState, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Loader2 } from 'lucide-react';

interface ShareTradePlanButtonProps {
  cardRef: RefObject<HTMLDivElement | null>;
  filename?: string;
}

export function ShareTradePlanButton({ cardRef, filename = 'trade-plan.png' }: ShareTradePlanButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      // Use html2canvas-like approach with native browser APIs
      const element = cardRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas size to match element
      const rect = element.getBoundingClientRect();
      canvas.width = rect.width * 2; // 2x for better quality
      canvas.height = rect.height * 2;
      
      ctx.scale(2, 2);

      // Draw background
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Get computed styles and draw text content
      const drawElement = (el: Element, offsetX = 0, offsetY = 0) => {
        const elRect = el.getBoundingClientRect();
        const x = elRect.left - rect.left + offsetX;
        const y = elRect.top - rect.top + offsetY;
        
        const styles = window.getComputedStyle(el);
        
        // Draw background if present
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          ctx.fillStyle = styles.backgroundColor;
          ctx.fillRect(x, y, elRect.width, elRect.height);
        }

        // Draw text content
        if (el.textContent && el.children.length === 0) {
          ctx.fillStyle = styles.color;
          ctx.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
          ctx.textBaseline = 'top';
          ctx.fillText(el.textContent.trim(), x + parseFloat(styles.paddingLeft), y + parseFloat(styles.paddingTop));
        }

        // Recursively draw children
        Array.from(el.children).forEach(child => drawElement(child, offsetX, offsetY));
      };

      drawElement(element);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
        setIsExporting(false);
      }, 'image/png');
    } catch (error) {
      console.error('Failed to export trade plan:', error);
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting} className="w-full gap-2">
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share Trade Plan
        </>
      )}
    </Button>
  );
}
