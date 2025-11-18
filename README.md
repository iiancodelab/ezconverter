# File Converter App

A modern web application for converting files between different formats (PDF, Word, Excel, CSV, PowerPoint) using Next.js 14+ and CloudConvert API.

## 🚀 Features

- **Multi-format Support**: Convert between PDF, Word (.docx), Excel (.xlsx), CSV, and PowerPoint (.pptx)
- **Drag & Drop**: Intuitive file upload with drag and drop support
- **Secure**: Files are processed securely and deleted after conversion
- **Modern UI**: Built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui
- **Responsive**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **File Conversion**: CloudConvert API
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- CloudConvert account (free tier available)

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ezconverter
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
CLOUDCONVERT_API_KEY=your_cloudconvert_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 4. Get CloudConvert API Key
1. Sign up at [CloudConvert](https://cloudconvert.com/)
2. Free tier includes 25 conversions per day
3. Go to your dashboard and copy the API key
4. Paste it in your `.env.local` file

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables for Production
Make sure to add these in your deployment platform:
- `CLOUDCONVERT_API_KEY`: Your CloudConvert API key
- `NEXT_PUBLIC_MAX_FILE_SIZE`: Maximum file size (default: 10485760 = 10MB)

## 📁 Project Structure

```
ezconverter/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── convert/
│   │   │       └── route.ts          # Conversion API endpoint
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── file-uploader.tsx         # File upload component
│   │   ├── format-selector.tsx       # Format selection component
│   │   └── ui/                       # shadcn/ui components
│   └── lib/
│       ├── cloudconvert.ts           # CloudConvert client
│       ├── utils.ts                  # Utility functions
│       └── types.ts                  # TypeScript types
├── .env.local                        # Environment variables
├── package.json
└── README.md
```

## 🔒 Security & Privacy

- Files are processed securely via CloudConvert API
- No files are stored on our servers
- All uploads are automatically deleted after conversion
- HTTPS encryption for all data transfers

## 📝 Supported Formats

| From/To | PDF | DOCX | XLSX | CSV | PPTX |
|---------|-----|------|------|-----|------|
| PDF     | ✅  | ✅   | ✅   | ✅  | ✅   |
| DOCX    | ✅  | ✅   | ✅   | ✅  | ✅   |
| XLSX    | ✅  | ✅   | ✅   | ✅  | ✅   |
| CSV     | ✅  | ✅   | ✅   | ✅  | ✅   |
| PPTX    | ✅  | ✅   | ✅   | ✅  | ✅   |

## 🚫 Limitations

- Maximum file size: 10MB
- CloudConvert free tier: 25 conversions per day
- Supported formats only (PDF, DOCX, XLSX, CSV, PPTX)

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Formats
1. Update `FileFormat` type in `src/lib/types.ts`
2. Add format label in `FORMAT_LABELS`
3. Add MIME type in `MIME_TYPES`
4. Update file input accept attribute in `FileUploader`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📖 API Documentation

The application provides a REST API for programmatic file conversion:

- **Interactive Docs**: Visit `/docs` for Swagger UI documentation
- **OpenAPI Spec**: Available at `/api/docs` (YAML) or `/api/docs?format=json` (JSON)

### Quick API Example
```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@document.docx" \
  -F "outputFormat=pdf"
```

### Response
```json
{
  "success": true,
  "downloadUrl": "https://storage.cloudconvert.com/...",
  "originalFilename": "document.docx",
  "outputFormat": "pdf"
}
```

## ⚠️ Important Notes

- Always test with small files first
- Check CloudConvert pricing for production usage
- Keep your API key secure and never commit it to version control
- Monitor your CloudConvert usage to avoid unexpected charges

## 🔧 Troubleshooting

### Common Issues

**"CLOUDCONVERT_API_KEY is not set" Error**
- Make sure your `.env.local` file exists and contains the API key
- Restart your development server after adding environment variables

**File Upload Fails**
- Check if file size is under 10MB limit
- Ensure file format is supported
- Verify CloudConvert API key is valid

**Conversion Takes Too Long**
- Large files may take several minutes to convert
- Check CloudConvert status page for service issues
- Ensure stable internet connection

## 📧 Support

For support, email support@yourapp.com or open an issue in the GitHub repository.
