import qrCodeTerminal from 'qrcode-terminal';
import chalk from 'chalk';
import QRCode from 'qrcode';
import { promises as fs } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

class QRCodeService {
  async printToTerminal(url: string): Promise<void> {
    console.log(chalk.bold('QR Code:\n'));
    qrCodeTerminal.generate(url, { small: true });
    console.log('');
  }

  async saveToDownloads(url: string, shortCode: string): Promise<string> {
    const downloadsPath = join(homedir(), 'Downloads');
    const filename = `qr-${shortCode}-${Date.now()}.png`;
    const filepath = join(downloadsPath, filename);

    await QRCode.toFile(filepath, url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 500,
      margin: 2,
    });

    return filepath;
  }
}

export default QRCodeService;
