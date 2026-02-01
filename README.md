# Shortenit CLI

A command-line interface tool for the Shortenit URL shortener service. Create shortened URLs, expand them back to original URLs, and generate QR codes - all from your terminal.

## Features

- **Shorten URLs** - Create shortened links with optional custom aliases
- **Expand URLs** - Retrieve original URLs from shortened links
- **Delete URLs** - Delete shortened links
- **List URLs** - List shortened links
- **Expiration Control** - Set custom expiration periods for your links
- **QR Code Generation** - Generate QR codes in terminal or save as PNG files
- **Configuration Management** - Easy setup and configuration management
- **Beautiful CLI** - Colored output and loading indicators for better UX

## Installation

### From NPM

```bash
npm install -g shortenit-cli
```

### From Source

```bash
# Clone the repository
git clone https://github.com/shortenit/shortenit-cli
cd shortenit-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## Configuration

On first run, the CLI will prompt you to configure your backend URL and API Key:

```bash
shortenit
```

Or manually configure:

```bash
shortenit config
```

### Configuration Commands

- `shortenit config` - Setup or update configuration
- `shortenit config --show` - Display current configuration
- `shortenit config --reset` - Reset configuration

The configuration is stored locally using [conf](https://github.com/sindresorhus/conf) and persists between sessions.

## Usage

### Shorten a URL

Basic usage:

```bash
shortenit short https://example.com/very/long/url
```

With custom alias:

```bash
shortenit short https://example.com --custom-alias my-link
```

With expiration (in days):

```bash
shortenit short https://example.com --expiration-days 7
```

Generate QR code in terminal:

```bash
shortenit short https://example.com --print-qr
```

Save QR code to Downloads folder:

```bash
shortenit short https://example.com --save-qr
```

Combine multiple options:

```bash
shortenit short https://example.com \
  --custom-alias my-link \
  --expiration-days 30 \
  --print-qr \
  --save-qr
```

### Expand a URL

Retrieve the original URL from a shortened link:

```bash
shortenit expand abc123
```

Or with full URL:

```bash
shortenit expand https://short.link/abc123
```

### Delete a URL

Basic usage:

```bash
shortenit delete abc123
```

Or with full URL:

```bash
shortenit delete https://short.link/abc123
```

Delete without confirmation:

```bash
shortenit delete https://short.link/abc123 --force
```

### List recent links

Display the most 10 recent shortened links:

```bash
shortenit list
```

### List all links

Display all the shortened links:

```bash
shortenit list-all
```

### Help

View all available commands:

```bash
shortenit --help
```

View help for a specific command:

```bash
shortenit short --help
shortenit expand --help
```

## Commands Reference

### `short <url>`

Create a shortened link.

**Options:**
- `-c, --custom-alias <string>` - Custom alias for the short URL
- `-e, --expiration-days <number>` - Number of days until expiration
- `-p, --print-qr` - Print QR code to terminal
- `-s, --save-qr` - Save QR code to Downloads folder

### `expand <url>`

Get the original URL from a shortened link.

### `delete <url>`

Delete a shortened link.

**Options**
- `-f, --force` - Force deletion without confirmation

### `list`

List 10 recent shortened links.

### `list-all`

List all shortened links.

### `config`

Manage configuration settings.

**Options:**
- `--reset` - Reset configuration
- `--show` - Show current configuration

## Development

### Project Structure

```
shortenit-cli/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── commands/
│   │   ├── ShortCommand.ts      # URL shortening command
│   │   ├── ExpandCommand.ts     # URL expansion command
│   │   ├── DeleteCommand.ts     # URL deletion command
│   │   └── ListCommand.ts       # URL listing command
│   ├── config/
│   │   └── ConfigManager.ts     # Configuration management
│   └── services/
│       ├── ApiService.ts        # API communication
│       └── QRCodeService.ts     # QR code generation
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with ts-node
- `npm start` - Run the compiled JavaScript

### Dependencies

**Runtime:**
- `commander` - CLI framework
- `axios` - HTTP client for API calls
- `chalk` - Terminal string styling
- `inquirer` - Interactive command-line prompts
- `ora` - Terminal spinners
- `qrcode` - QR code generation
- `qrcode-terminal` - QR code display in terminal
- `conf` - Configuration management
- `table` - Table formatting for displaying URL lists

**Development:**
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `@types/qrcode` - QRCode type definitions
- `@types/qrcode-terminal` - QRCode Terminal type definitions

## License

MIT

## Contributors
<a href="https://github.com/shortenit/shortenit-cli/graphs/contributors">
  <img src="https://contrib.freaks.dev/shortenit/shortenit-cli" />
</a>

---

Made with ❤️ for the Shortenit project
