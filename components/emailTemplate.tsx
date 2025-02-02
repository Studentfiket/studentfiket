interface EmailTemplateProps {
  content: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  content,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
    <h2 style={{ color: '#4CAF50' }}>Feedback från användare</h2>
    <p>{content}</p>
    <p>Med vänliga hälsningar,</p>
    <p>Studentfiket Team</p>
  </div>
);