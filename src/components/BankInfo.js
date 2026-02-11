import Input from "./Input";



const BankInfo = ({user}) => {
    return(
        <div className="edit-profile-section">
          <h2>Bank details</h2>
          <Input
            type="text"
            placeholder="Account name"
            value={user.accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Account number"
            value={user.accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Sort code"
            value={user.sortCode}
            onChange={(e) => setSortCode(e.target.value)}
          />
        </div>
    )
}

export default BankInfo;