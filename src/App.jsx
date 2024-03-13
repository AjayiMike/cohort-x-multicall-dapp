import { formatUnits } from "ethers";
import "./App.css";
import useTokensAndBalance from "./hooks/useTokensAndBalance";
import { useState } from "react";

function App() {
    const [account, setAccount] = useState("");
    const { tokens, address } = useTokensAndBalance(account);

    return (
        <div>
            <div
                style={{
                    width: "100%",
                    height: "2.5rem",
                }}
            >
                <input
                    type="text"
                    placeholder="paste an address"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    style={{
                        width: "100%",
                        height: "100%",
                        padding: "0.2rem 0.8rem",
                    }}
                />
                <div>Current Account: {address}</div>
            </div>
            <h1>Balances in Token List</h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                }}
            >
                {tokens.length === 0
                    ? "loading..."
                    : tokens.map((token) => (
                          <div
                              key={token.address}
                              style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "1rem",
                                  alignItems: "flex-start",
                                  borderBottom: "2px solid #ccc",
                                  paddingBottom: "1rem",
                              }}
                          >
                              <div>Address: {token.address}</div>
                              <div>Name: {token.name}</div>
                              <div>Symbol: {token.symbol}</div>
                              <div>
                                  Balance:{" "}
                                  {formatUnits(token.balance, token.decimals)}
                              </div>
                          </div>
                      ))}
            </div>
        </div>
    );
}

export default App;
