module.exports = {
  // 1. accountVerificationEmailTemplate
  accountVerificationEmailTemplate: `
       Hi,
            <p>Thank you for creating an account with Healthi Wealthi.</p>
            <p>
            Your email address is not yet verified. To Launch Healthi Wealthi , please click this link to verify your email
            <a href = {{url}}>Click Here</a></p>
            <p>
            If you have further questions, please do not hesitate to ask:)
            </p>
            <p>
            All the best</p>
       `, // 1. resetPasswordEmailTemplate
  resetPasswordEmailTemplate: `
         Hi,
              <p>Forget Pass Key.</p>
              <p>
                Click here to Reset your Password
              <a href = {{url}}>Click Here</a></p>
              <p>
              If you have further questions, please do not hesitate to ask:)
              </p>
              <p>
              All the best</p>
         `,
  newCompanyInvitationEmailTemplate: `Hi,
         <p>Thank you for creating an account with Healthi Wealthi.</p>

         <p>
           email :  {{email}}
         <p>

         <p>
         password :  {{password}}
         <p>

         <p>
         Your email address is not yet verified. To Launch Healthi Wealthi , please click this link to verify your email
         <a href = {{url}}>Click Here</a></p>
         <p>
         If you have further questions, please do not hesitate to ask:)
         </p>
         <p>
         All the best</p>
         `,
  inviteUserViaEmailTemplate: `<div>
        Hi,
        <p>
            You have been invited by <b>Netrust</b>.
            Please find your account credentials attached herewith.
        </p>

        <br />
        <p><b>Email:</b> {{email}}</p>
        <p><b>Password:</b> {{password}}</p>
        <br />

        <p>
            Your email address is not yet verified. To Launch Netrust, please click on
            <b><a href="{{url}}">this link</a></b> to verify your email.
        </p>

        <p>If you have any further questions, please do not hesitate to ask :)</p>
        <p>We welcome you onboard and wish you all the best.</p>
    </div>`,
};
