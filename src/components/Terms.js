import BackButton from "./BackButton";
import "./Terms.scss";

const Terms = ({ toggleTerms }) => {
  return (
    <div className="Terms">
      <div className="screen-width">
        <BackButton onClick={toggleTerms} />
        <section>
          <h3>1. Eligibility</h3>
          <p>
            Participation in Self Tape Battle is open to actors aged 18 and over
            residing in the United Kingdom. By signing up, you confirm that you
            meet these requirements.
          </p>
        </section>
        <section>
          <h3>2. Account Registration</h3>
          <p>
            Users must create an account to participate in battles, vote, and
            earn coins. You are responsible for maintaining the confidentiality
            of your account details and must provide accurate information during
            registration. Sharing credentials or creating multiple accounts is
            prohibited. Self Tape Battle reserves the right to suspend or
            terminate accounts at our discretion for violations of these Terms &
            Conditions.
          </p>
        </section>
        <section>
          <h3>3. Battles and Voting</h3>
          <p>
            Actors compete in weekly monologue battles. Votes can only be cast
            by other registered actors and help determine the winning entry of
            each battle. Vote manipulation, fraudulent voting tactics, or
            vote-buying are strictly prohibited. Users found to be partaking in
            such activities will have their account suspended or terminated.
            Detailed rules of gameplay can be found in the "How to Play" section
            of the app. Self Tape Battle reserves the right to disqualify
            entries that violate our rules or these Terms & Conditions.
          </p>
        </section>
        <section>
          <h3>4. Coins and Prizes</h3>
          <p>
            Participants earn coins for entering battles, voting, and achieving
            milestones. Coins can be converted into real money at a rate of 1
            coin = 1 pence once the minimum threshold of 500 coins is reached.
            Self Tape Battle reserves the right to change this minimum threshold
            at any time. Coins do not expire. Additional prizes may be awarded
            for winning battles. Users are responsible for any tax implications
            arising from prizes or coin conversions. Upon account termination,
            all coins will be forfeited and cannot be converted or transferred.
          </p>
        </section>
        <section>
          <h3>5. Content and Ownership</h3>
          <p>
            By participating in a battle, you retain ownership of your
            submissions. However, you grant Self Tape Battle a non-exclusive,
            worldwide, royalty-free licence to feature your winning entry on
            Self Tape Battle's social media channels, website, marketing
            materials, or other promotional platforms owned and controlled by
            Self Tape Battle, even if your entry or profile is marked as
            private. Your winning entry will not be distributed to or used by
            any third parties without your express permission.
          </p>
          <p>
            For content (Monologues, scripts, performance material) not provided
            by us, you warrant that you have the right to perform the material,
            that your submission does not infringe upon any copyright,
            trademark, or other intellectual property rights of any third party,
            and that your content does not violate any applicable laws or
            third-party rights.
          </p>
        </section>
        <section>
          <h3>6. Privacy</h3>
          <p>
            Users may choose to make their profiles or submissions private.
            Private profiles and video entries cannot be accessed by anyone
            outside the app. Self Tape Battle will handle all personal data in
            accordance with our Privacy Policy and applicable data protection
            laws, including GDPR.
          </p>
        </section>
        <section>
          <h3>7. Code of Conduct</h3>
          <p>
            All users must behave respectfully towards other participants. The
            following behaviours are strictly prohibited: harassment,
            discriminatory behaviour, abuse, spam, cheating, inappropriate
            content, impersonation, and violation of intellectual property
            rights. Violations may result in warnings, temporary suspension, or
            permanent removal from the platform, depending on the severity and
            frequency of the offence.
          </p>
        </section>
        <section>
          <h3>8. Intellectual Property</h3>
          <p>
            The Self Tape Battle name, logo, and platform format are protected
            intellectual property. Self Tape Battle is a registered trademark
            and registered business with Companies House. Users may not use,
            reproduce, or distribute our intellectual property without express
            written permission.
          </p>
        </section>
        <section>
          <h3>9. Termination</h3>
          <p>
            Users may terminate their account at any time by writing to
            info@selftapebattle.com. Upon termination, all account details,
            achievements, coins, and associated data will be permanently lost
            and cannot be recovered. Self Tape Battle also reserves the right to
            terminate or suspend user accounts at our discretion for violations
            of these Terms & Conditions.
          </p>
        </section>
        <section>
          <h3>10. Dispute Resolution and Governing Law</h3>
          <p>
            These Terms & Conditions are governed by the laws of England and
            Wales. Any disputes arising from your use of Self Tape Battle will
            be subject to the exclusive jurisdiction of the courts of England
            and Wales.
          </p>
        </section>
        <section>
          <h3>11. Limitation of Liability</h3>
          <p>
            Self Tape Battle is provided "as is" and we cannot be held liable
            for any loss or damage arising from participation in the platform,
            including but not limited to loss of coins, prizes, or content.
          </p>
        </section>
        <section>
          <h3>12. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless Self Tape Battle, its
            officers, directors, employees, and agents from any claims, damages,
            losses, or expenses (including legal fees) arising from your use of
            the platform, your content, or your violation of these Terms &
            Conditions.
          </p>
        </section>
        <section>
          <h3>13. Amendments</h3>
          <p>
            Self Tape Battle reserves the right to amend these Terms &
            Conditions at any time. Users will be notified of material changes
            via email or through the platform. Continued use of Self Tape Battle
            after such changes constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
