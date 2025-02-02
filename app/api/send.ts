'use server'

import { EmailTemplate } from '@/components/emailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (titel: string, description: string) => {
  const { error } = await resend.emails.send({
    from: 'Feedback <onboarding@resend.dev>',
    to: ['studentfiketdev@gmail.com'],
    subject: 'Feedback: ' + titel,
    react: EmailTemplate({ content: description }),
  });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }
};

export default sendEmail;