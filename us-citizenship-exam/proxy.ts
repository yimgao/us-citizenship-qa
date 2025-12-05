import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import routing from './next-intl.config';

const middleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
	return middleware(request);
}

export const config = {
	matcher: ['/((?!api|_next|.*\\..*).*)']
};

