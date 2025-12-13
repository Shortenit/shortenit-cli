import qrCodeTerminal from 'qrcode-terminal';
import chalk from 'chalk';

class QRCodeService {
  async printToTerminal(url: string): Promise<void> {
    console.log(chalk.bold('\nQR Code:\n'));
    qrCodeTerminal.generate(url, { small: true });
    console.log('');
  }
}

export default QRCodeService;
