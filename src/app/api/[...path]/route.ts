import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.INTERNAL_API_URL || "http://localhost:4000";

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathStr = resolvedParams.path ? resolvedParams.path.join("/") : "";
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${url.search}`;

  const headers = new Headers();
  // Copy relevant request headers
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  try {
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Proxy error connecting to backend server on port 4000",
        error: err.message,
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
export const OPTIONS = proxyRequest;
