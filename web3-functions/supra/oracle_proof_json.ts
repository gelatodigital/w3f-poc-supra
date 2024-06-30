export const ORACLE_PROOF = [
    {
      "type": "tuple",
      "name": "OracleProofV2",
      "components": [
        {
          "type": "tuple[]",
          "name": "data",
          "components": [
            {
              "type": "uint64",
              "name": "committee_id"
            },
            {
              "type": "bytes32",
              "name": "root"
            },
            {
              "type": "uint256[2]",
              "name": "sigs"
            },
            {
              "type": "tuple[]",
              "name": "committee_data",
              "components": [
                {
                  "type": "tuple",
                  "name": "committee_feed",
                  "components": [
                    {
                      "type": "uint32",
                      "name": "pair"
                    },
                    {
                      "type": "uint128",
                      "name": "price"
                    },
                    {
                      "type": "uint64",
                      "name": "timestamp"
                    },
                    {
                      "type": "uint16",
                      "name": "decimals"
                    },
                    {
                      "type": "uint64",
                      "name": "round"
                    }
                  ]
                },
                {
                  "type": "bytes32[]",
                  "name": "proof"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
  