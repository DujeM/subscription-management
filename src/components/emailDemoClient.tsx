import * as React from "react";

interface Emailprops {
  clientEmail: string;
}

const emailDemoClient = ({clientEmail}: Emailprops) => (
  <div>
    <p>We client demo request: {clientEmail}</p>
  </div>
);

export default emailDemoClient;