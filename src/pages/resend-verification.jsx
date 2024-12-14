import { Helmet } from 'react-helmet-async';

import { ResendVerificationView } from 'src/sections/verify-email';

export default function ResendVerificationPage() {
  return (
    <>
      <Helmet>
        <title> Resend Verification | CommitStreams </title>
      </Helmet>

      <ResendVerificationView />
    </>
  );
} 
