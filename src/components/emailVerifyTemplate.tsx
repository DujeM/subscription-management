import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  clientName: string;
  subscription: string;
  emailToken: string;
}

const EmailVerifyTemplate = ({
  fullName,
  clientName,
  subscription,
  emailToken
}: EmailTemplateProps) => (
  <div>
    <h1>Welcome, {fullName}!</h1>
    <p>You have been invited to {clientName} - {subscription} subscription. Click below to activate your account and start the subscription.</p>
    <a href={`http://localhost:3000/auth/activate/${emailToken}`}>Activate</a>
  </div>
);

export default EmailVerifyTemplate;