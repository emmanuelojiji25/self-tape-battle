import "./HowToPlay.scss";

const HowToPlay = () => {

  const maxVotes = 5;

  const amountOfExistingEntries = 10;

  return (
    <div className="HowToPlay screen-width">
      <h2>How to play</h2>

      <section>
        <h3>1. Enter Weekly Battles</h3>
        <p>
          Each week, new battles open with unique monologue prompts. Browse the
          available battles, select the one that excites you, and get ready to
          showcase your talent.
        </p>

        <ul>
          <li>
            Entry period: Sunday - Thursday
          </li>
          <li>
            Voting period: Friday - Sunday
          </li>

          <li>
            Sunday evening: Winners announced + New battle commences
          </li>
        </ul>

      </section>

      <section>
        <h3>2. Record Your Self-Tape</h3>
        <p>
          Film your monologue in your own time, on your own setup. The quicker
          you submit, the more chance you have of getting votes.
        </p>
      </section>

      <section>
        <h3>3. Track Your Progress</h3>
        <p>
          Vote counts for all entries remain hidden until the battle ends,
          ensuring voting decisions remain purely based on talent and not
          numbers. You can always see the vote count on your own entry to track
          how you're performing.
        </p>
      </section>

      <section>
        <h3>4. Earn Coins</h3>
        <p>You earn coins for:</p>
        <p>
          • Entering battles
          <br />
          • Voting on performances
          <br />• Winning battles
        </p>
        <br />
        <p>
          <strong>Smart Voting Bonus:</strong> If you vote for an actor and they
          win the battle, you earn 5 extra coins!
        </p>
        <p>
          <br />
          Coins convert at a rate of 1 coin = 1p and can be withdrawn once you
          reach 500 coins.
        </p>
      </section>

      <section>
        <h3>5. Win the Battle</h3>
        <p>
          At the end of each battle, the entry with the highest number of votes
          wins the battle prize. In the event of a tie, the winner is determined
          by who entered first.
        </p>
      </section>

      <section>
        <h3>6. Build Your Portfolio</h3>
        <p>
          By entering more battles, you build a diverse acting portfolio. All
          your entries can be shared with your profile link, making them visible
          to casting directors and industry professionals. With new battles
          launching every week, there's always another chance to compete,
          improve, and win.
        </p>
      </section>

      <section>
        <h3>Important Notes</h3>
        <p>
          • Votes are final and cannot be changed once submitted
          <br />
          • Vote counts are hidden until battles end (except your own)
          <br />
          • In case of tied votes, the earliest entry wins
          <br />
          <br />
          These rules are constantly reviewed and subject to change to ensure
          the best experience for all users.
        </p>
      </section>
    </div>
  );
};

export default HowToPlay;
