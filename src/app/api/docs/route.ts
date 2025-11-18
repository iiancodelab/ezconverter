import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'yaml';

    const specPath = path.join(process.cwd(), 'docs', 'api-spec.yaml');
    const specContent = fs.readFileSync(specPath, 'utf8');

    if (format === 'json') {
      const jsonSpec = yaml.load(specContent);
      return NextResponse.json(jsonSpec);
    }

    return new NextResponse(specContent, {
      headers: {
        'Content-Type': 'application/x-yaml',
        'Content-Disposition': 'inline; filename="api-spec.yaml"',
      },
    });
  } catch (error) {
    console.error('Error serving API spec:', error);
    return NextResponse.json(
      { error: 'API specification not found' },
      { status: 404 }
    );
  }
}