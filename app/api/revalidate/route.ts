import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    // Verify the request comes from our admin panel
    const authHeader = req.headers.get('x-revalidate-token');
    const token = process.env.REVALIDATE_SECRET || 'stayinubud-revalidate-2024';

    if (authHeader !== token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { paths } = body as { paths?: string[] };

        if (!paths || paths.length === 0) {
            // Revalidate all main pages
            revalidatePath('/', 'layout');
            return NextResponse.json({ revalidated: true, paths: ['all'] });
        }

        // Revalidate specific paths
        for (const path of paths) {
            revalidatePath(path);
        }

        return NextResponse.json({ revalidated: true, paths });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
