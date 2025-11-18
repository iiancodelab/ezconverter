'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export default function APIDocsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState('http://localhost:3000');
  const loadedRef = useRef(false);
  const swaggerUIRef = useRef<any>(null);

  // Memoize the reload function
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    // Prevent multiple loads
    if (loadedRef.current) return;
    loadedRef.current = true;

    const loadSwaggerUI = async () => {
      try {
        // Check if already loaded
        if (swaggerUIRef.current) {
          setIsLoading(false);
          return;
        }

        // Use dynamic import for better code splitting
        const [cssLoaded, jsLoaded] = await Promise.allSettled([
          new Promise<void>((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css';
            link.onload = () => resolve();
            link.onerror = () => reject(new Error('Failed to load CSS'));
            document.head.appendChild(link);
          }),
          new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load JS'));
            document.head.appendChild(script);
          })
        ]);

        if (cssLoaded.status === 'rejected' || jsLoaded.status === 'rejected') {
          throw new Error('Failed to load Swagger UI resources');
        }

        // Wait for SwaggerUIBundle to be available
        let attempts = 0;
        while (!(window as any).SwaggerUIBundle && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!(window as any).SwaggerUIBundle) {
          throw new Error('SwaggerUIBundle not available');
        }

        initializeSwaggerUI();

      } catch (err) {
        console.error('Error loading Swagger UI:', err);
        setError('Failed to load API documentation');
        setIsLoading(false);
      }
    };

    const initializeSwaggerUI = () => {
      try {
        const container = document.getElementById('swagger-ui');
        if (container) {
          container.innerHTML = '';
        }

        swaggerUIRef.current = (window as any).SwaggerUIBundle({
          url: '/api/docs?format=json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            (window as any).SwaggerUIBundle.presets.apis,
            (window as any).SwaggerUIBundle.presets.standalone
          ],
          plugins: [
            (window as any).SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: 'StandaloneLayout',
          tryItOutEnabled: true,
          supportedSubmitMethods: ['get', 'post'],
          docExpansion: 'list',
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
          displayOperationId: false,
          displayRequestDuration: true,
          validatorUrl: null,
          onComplete: () => {
            setIsLoading(false);
            setError(null);
          },
          onFailure: (error: any) => {
            console.error('Swagger UI failed:', error);
            setError('Failed to load API specification');
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('Error initializing Swagger UI:', err);
        setError('Failed to initialize API documentation');
        setIsLoading(false);
      }
    };

    // Only load if not in production or if explicitly requested
    if (process.env.NODE_ENV !== 'production' || window.location.pathname.includes('/docs')) {
      loadSwaggerUI();
    } else {
      // Defer loading in production
      const timer = setTimeout(loadSwaggerUI, 1000);
      return () => clearTimeout(timer);
    }

    // Cleanup
    return () => {
      if (swaggerUIRef.current) {
        swaggerUIRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              API Documentation
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Documentation
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={handleReload}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Alternative Options
              </h3>
              <div className="space-y-2">
                <a 
                  href="/api/docs?format=json" 
                  className="block text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View JSON Specification
                </a>
                <a 
                  href="/api/docs" 
                  className="block text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download YAML Specification
                </a>
                <a 
                  href="/" 
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Try the File Converter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            File Converter API Documentation
          </h1>
          <p className="text-gray-600 mb-4">
            Interactive API documentation for the File Converter service. 
            Convert files between PDF, DOCX, XLSX, CSV, and PPTX formats.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <a 
              href="/api/docs?format=yaml" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              download="file-converter-api-spec.yaml"
            >
              📄 Download YAML
            </a>
            <a 
              href="/api/docs?format=json" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              download="file-converter-api-spec.json"
            >
              📋 Download JSON
            </a>
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              🚀 Try the App
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick API Usage
            </h3>
            <div className="bg-gray-900 rounded p-4 text-green-400 text-sm font-mono overflow-x-auto">
              <div className="mb-2"># Convert a file to PDF</div>
              <div>{`curl -X POST ${origin}/api/convert \\`}</div>
              <div className="ml-4">-F "file=@document.docx" \</div>
              <div className="ml-4">-F "outputFormat=pdf"</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              📡 Available Endpoints
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-3">POST</span>
                <code className="text-blue-600">/api/convert</code>
                <span className="text-gray-600 ml-2">- Convert files between formats</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-3">GET</span>
                <code className="text-blue-600">/api/docs</code>
                <span className="text-gray-600 ml-2">- API specification (YAML/JSON)</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading API documentation...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds on first load</p>
            </div>
          </div>
        )}
        
        <div 
          id="swagger-ui" 
          className={isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}
          style={{ minHeight: isLoading ? '400px' : 'auto' }}
        />
      </div>
    </div>
  );
}