import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateBookingConfirmationEmail, EMAIL_SUBJECTS } from '../../../lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'StayinUBUD <noreply@stayinubud.com>';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, data } = body;

        if (!to || !data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const html = generateBookingConfirmationEmail({
            guestName: data.guestName || 'Guest',
            villaName: data.villaName || 'StayinUBUD Villa',
            checkIn: data.checkIn || 'TBD',
            checkOut: data.checkOut || 'TBD',
            guests: data.guests,
            totalPrice: data.totalPrice
        });

        const { data: emailData, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: EMAIL_SUBJECTS.bookingConfirmation,
            html: html
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: emailData?.id });

    } catch (error: any) {
        console.error('Email API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
