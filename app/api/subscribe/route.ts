
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { generateWelcomeEmail, EMAIL_SUBJECTS } from '../../../lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'StayinUBUD <noreply@stayinubud.com>';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // 1. Store subscriber in Supabase for admin panel visibility
        try {
            const { error: dbError } = await supabase
                .from('subscribers')
                .upsert(
                    { email, subscribed_at: new Date().toISOString() },
                    { onConflict: 'email' }
                );
            if (dbError) {
                console.error('Failed to store subscriber in DB:', dbError);
            }
        } catch (dbErr) {
            console.error('Subscriber DB insert error (non-blocking):', dbErr);
        }

        // 2. Send Welcome Email
        const { error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: EMAIL_SUBJECTS.welcome,
            html: generateWelcomeEmail()
        });

        if (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // We continue even if email fails, to try adding to audience
        }

        // 3. Add to Resend Audience (if configured)
        if (AUDIENCE_ID) {
            try {
                await resend.contacts.create({
                    email: email,
                    audienceId: AUDIENCE_ID,
                    unsubscribed: false
                });
            } catch (contactError) {
                console.error('Failed to add contact to audience:', contactError);
            }
        }

        // 4. Trigger admin push notification for new subscriber
        const adminUrl = process.env.ADMIN_URL;
        if (adminUrl) {
            try {
                await fetch(`${adminUrl}/api/push/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: 'New Subscriber',
                        body: `${email} just subscribed to the newsletter`,
                        url: '/dashboard/subscribers'
                    }),
                });
            } catch (pushError) {
                console.error('Failed to send push notification:', pushError);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

