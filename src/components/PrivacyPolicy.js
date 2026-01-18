import "./Terms.scss";

import BackButton from "./BackButton";

const PrivacyPolicy = ({ togglePrivacyPolicy }) => {
  return (
    <div className="Terms">
      <div className="screen-width">
        <BackButton onClick={togglePrivacyPolicy} />

        <section>
          <h3>Privacy Policy – Self Tape Battle</h3>
          <p>
            <strong>Last updated:</strong> [01/11/25]
          </p>
        </section>

        <section>
          <h3>1. Introduction</h3>
          <p>
            Self Tape Battle ("we", "our", or "us") is committed to protecting
            your privacy. This Privacy Policy explains how we collect, use,
            store, and protect your personal information when you use our
            platform. By using Self Tape Battle, you agree to the collection and
            use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h3>2. Information We Collect</h3>
          <p>We collect the following types of personal information:</p>
          <p>
            <strong>Account Information:</strong> When you register, we collect
            your name, email address, and profile information including your
            acting experience, headshots, and biography.
          </p>
          <p>
            <strong>Video Submissions:</strong> When you participate in battles,
            we collect and store your self-tape video submissions for your
            showreel.
          </p>
          <p>
            <strong>Payment Information:</strong> When you request a payout of
            your earned coins, we collect your bank details necessary to process
            the payment.
          </p>
          <p>
            <strong>Usage Data:</strong> We collect information about how you
            interact with our platform, including battles entered, votes cast,
            coins earned, and other activity within the app.
          </p>
        </section>

        <section>
          <h3>3. How We Use Your Information</h3>
          <p>We use your personal information for the following purposes:</p>
          <p>
            • To create and manage your account
            <br />
            • To enable you to participate in battles and voting
            <br />
            • To process coin-to-cash conversions and prize payments
            <br />
            • To display your profile and winning entries to other users and,
            where applicable, on our promotional platforms
            <br />
            • To send you important updates about your account, battles, and
            platform changes
            <br />
            • To send you marketing communications if you have opted in to our
            mailing list
            <br />
            • To improve our platform and user experience
            <br />
            • To prevent fraud and ensure platform security
            <br />• To comply with legal obligations
          </p>
        </section>

        <section>
          <h3>4. Legal Basis for Processing (GDPR)</h3>
          <p>
            Under the General Data Protection Regulation (GDPR), we process your
            personal data on the following legal bases:
          </p>
          <p>
            <strong>Contractual Necessity:</strong> Processing is necessary to
            perform our contract with you (providing the Self Tape Battle
            service).
          </p>
          <p>
            <strong>Consent:</strong> You have given explicit consent for
            marketing communications and for us to feature your winning entries
            on our promotional platforms.
          </p>
          <p>
            <strong>Legitimate Interests:</strong> Processing is necessary for
            our legitimate interests in operating and improving our platform,
            preventing fraud, and ensuring security.
          </p>
          <p>
            <strong>Legal Obligation:</strong> Processing is necessary to comply
            with legal and regulatory requirements.
          </p>
        </section>

        <section>
          <h3>5. Third-Party Services</h3>
          <p>
            We use trusted third-party service providers to help us operate our
            platform, including database solutions and email communication
            services. These third parties are GDPR-compliant and only have
            access to your personal information as necessary to perform their
            services. They are obligated to maintain its confidentiality and
            security.
          </p>
        </section>

        <section>
          <h3>6. Data Sharing and Disclosure</h3>
          <p>
            We do not sell, rent, or trade your personal information to third
            parties. We may share your information in the following
            circumstances:
          </p>
          <p>
            <strong>Within the Platform:</strong> Your profile information and
            non-private video submissions are visible to other registered users.
            Private profiles and submissions are only accessible within the app.
          </p>
          <p>
            <strong>Winning Entries:</strong> If you win a battle, your winning
            entry may be featured on our social media channels, website, and
            marketing materials as outlined in our Terms & Conditions.
          </p>
          <p>
            <strong>Service Providers:</strong> We share necessary information
            with trusted third-party service providers who assist in operating
            our platform.
          </p>
          <p>
            <strong>Legal Requirements:</strong> We may disclose your
            information if required by law, court order, or governmental
            authority, or to protect our rights, property, or safety.
          </p>
        </section>

        <section>
          <h3>7. Data Retention</h3>
          <p>
            We retain your personal information for as long as your account is
            active or as needed to provide you with our services. Specific
            retention practices include:
          </p>
          <p>
            <strong>Account Data:</strong> Retained while your account is active
            and for a reasonable period afterwards to comply with legal
            obligations.
          </p>
          <p>
            <strong>Video Submissions:</strong> Stored on the platform as part
            of your showreel. You can delete your videos at any time through
            your account settings. Winning entries featured on our promotional
            platforms may be retained for promotional purposes as outlined in
            our Terms & Conditions.
          </p>
          <p>
            <strong>Payment Information:</strong> Bank details are retained only
            as long as necessary to process payments and comply with financial
            regulations.
          </p>
          <p>
            <strong>Marketing Data:</strong> Retained until you unsubscribe from
            our mailing list.
          </p>
          <p>
            Upon account deletion, all personal data will be permanently
            deleted, except where we are required to retain certain information
            for legal or regulatory purposes.
          </p>
        </section>

        <section>
          <h3>8. Your Rights Under GDPR</h3>
          <p>
            As a user in the United Kingdom, you have the following rights
            regarding your personal data:
          </p>
          <p>
            <strong>Right to Access:</strong> You can request a copy of the
            personal data we hold about you.
          </p>
          <p>
            <strong>Right to Rectification:</strong> You can request that we
            correct any inaccurate or incomplete personal data.
          </p>
          <p>
            <strong>Right to Erasure:</strong> You can request that we delete
            your personal data in certain circumstances.
          </p>
          <p>
            <strong>Right to Restrict Processing:</strong> You can request that
            we restrict the processing of your personal data in certain
            circumstances.
          </p>
          <p>
            <strong>Right to Data Portability:</strong> You can request a copy
            of your personal data in a structured, commonly used format.
          </p>
          <p>
            <strong>Right to Object:</strong> You can object to our processing
            of your personal data for direct marketing purposes.
          </p>
          <p>
            <strong>Right to Withdraw Consent:</strong> Where we rely on consent
            to process your data, you can withdraw that consent at any time.
          </p>
          <p>
            To exercise any of these rights, please contact us at
            info@selftapebattle.com. We will respond to your request as soon as
            possible.
          </p>
        </section>

        <section>
          <h3>9. Marketing Communications</h3>
          <p>
            If you opt in to our mailing list, we will send you marketing emails
            from time to time, including updates about new features, battles,
            and promotional content. You can unsubscribe from marketing emails
            at any time by:
          </p>
          <p>
            • Clicking the "unsubscribe" link at the bottom of any marketing
            email
            <br />
            • Contacting us at info@selftapebattle.com
            <br />• Updating your preferences in your account settings
          </p>
          <p>
            Please note that even if you unsubscribe from marketing emails, we
            will still send you important account-related communications.
          </p>
        </section>

        <section>
          <h3>10. Children's Privacy</h3>
          <p>
            Self Tape Battle is available to users aged 13 and over. Children
            under 13 may join the platform, but their account must be managed by
            a parent or legal guardian. Accounts for users under 13 must clearly
            indicate parental or guardian management in the account bio. Failure
            to do so will result in account removal.
          </p>
          <p>
            For accounts managed by parents or guardians on behalf of children
            under 13, the parent or guardian is responsible for all aspects of
            the account and must provide consent for the collection and use of
            the child's personal information. If you believe an account for a
            child under 13 does not have appropriate parental management
            indicated, please contact us immediately at info@selftapebattle.com.
          </p>
        </section>

        <section>
          <h3>11. Data Security</h3>
          <p>
            We take the security of your personal data seriously and implement
            appropriate technical and organisational measures to protect it
            against unauthorised access, alteration, disclosure, or destruction.
            These measures include:
          </p>
          <p>
            • Secure data storage using industry-standard encryption protocols
            <br />
            • Regular security assessments and updates
            <br />
            • Restricted access to personal data on a need-to-know basis
            <br />• Secure transmission of data using encryption technologies
          </p>
        </section>

        <section>
          <h3>12. International Data Transfers</h3>
          <p>
            Self Tape Battle is available to users in the United Kingdom only,
            and we store all data within the UK/EU. We do not transfer your
            personal data outside of the UK/EU.
          </p>
        </section>

        <section>
          <h3>13. Cookies and Tracking Technologies</h3>
          <p>
            Self Tape Battle does not use cookies or similar tracking
            technologies on our platform.
          </p>
        </section>

        <section>
          <h3>14. Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for legal, operational, or regulatory
            reasons. We will notify you of any material changes by email or
            through a prominent notice on our platform. The "Last updated" date
            at the top of this policy indicates when it was last revised. Your
            continued use of Self Tape Battle after any changes indicates your
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h3>15. Contact Us</h3>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us at:
          </p>
          <p>Email: info@selftapebattle.com</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
