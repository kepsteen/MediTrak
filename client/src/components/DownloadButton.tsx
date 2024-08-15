import { pdf } from '@react-pdf/renderer';
import { MedInfoDocument } from './MedInfoDocument';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';
import { File } from 'lucide-react';
import { Medication } from '@/lib/data';

type Props = {
  medications: Medication[];
};

export function DownloadButton({ medications }: Props) {
  async function downloadPdf() {
    const fileName = 'MedicationList.pdf';
    const blob = await pdf(
      <MedInfoDocument medications={medications} />
    ).toBlob();
    saveAs(blob, fileName);
  }
  return (
    <>
      <Button
        size="md"
        variant="secondary"
        onClick={downloadPdf}
        className="hover:bg-pink hover:text-redblack">
        <span className="flex items-center gap-2">
          Download pdf <File size={24} />
        </span>
      </Button>
    </>
  );
}
