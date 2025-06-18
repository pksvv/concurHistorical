# Concur Historical Data Portal

<!-- Made with 🤖 by Claude Code -->

A static prototype for accessing Concur historical data and receipts. Built with vanilla HTML, CSS, and JavaScript for easy deployment to GitHub Pages.

## Features

- **Authentication**: Simple password protection (default: `concur2025`)
- **Search Reports**: Filter by market and year to find relevant reports
- **Search Receipts**: Fetch receipts by Report ID
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support

## Quick Start

1. **Local Development**:
   ```bash
   # Serve locally (Python 3)
   python -m http.server 8000
   
   # Or with Node.js
   npx serve .
   
   # Or with PHP
   php -S localhost:8000
   ```

2. **Open in browser**: `http://localhost:8000`

3. **Login**: Use password `concur2025` to access the portal

## File Structure

```
concur-historical-prototype/
├── index.html          # Main HTML structure
├── style.css           # Responsive CSS styling
├── app.js             # JavaScript functionality
├── data.js            # Mock data (markets, reports, receipts)
├── receipts/          # Sample PDF files
│   ├── RPT-12345.pdf
│   └── RPT-98765.pdf
└── README.md          # This file
```

## GitHub Pages Deployment

1. **Create Repository**: Push this code to a GitHub repository

2. **Enable Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / root

3. **Access**: Your site will be available at `https://username.github.io/repository-name`

## Usage

### Search Reports Tab
1. Select a market from the dropdown
2. Select a year from the dropdown  
3. Click "Search Reports"
4. View Global reports (always shown) and market-specific reports

### Search Receipts Tab
1. Enter a Report ID (e.g., `RPT-12345` or `RPT-98765`)
2. Click "Fetch Receipt"
3. Download the receipt PDF if found

## Customization

### Adding New Data
Edit `data.js` to add:
- New markets to `MARKETS` array
- New years to `YEARS` array
- New global reports to `GLOBAL_REPORTS` array
- Market-specific reports to `MARKET_REPORTS` object
- Receipt mappings to `RECEIPTS` object

### Changing Authentication
Update the password hash in `app.js`:
```javascript
// Generate new hash with: echo -n "newpassword" | sha256sum
const CORRECT_PASSWORD_HASH = 'your-new-sha256-hash';
```

### Styling
Modify `style.css` to customize:
- Colors (search for `#4f46e5` for primary color)
- Spacing and layout
- Typography
- Responsive breakpoints

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+

## Security Note

This is a prototype with client-side authentication only. For production use, implement proper server-side authentication and authorization.