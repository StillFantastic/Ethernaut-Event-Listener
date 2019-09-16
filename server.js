require('dotenv').config()
const express = require('express'); 
const Web3 = require('web3')
const Complete = require('./Complete')

const app = express();

app.listen(3000, function() {
});

app.get('/', function(req, res) {
 res.send("Hello, Ethereum!");
});

web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'))

const ethernautABI = [{
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "newOwner",
            "type": "address"
        }],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "instance",
                "type": "address"
            }
        ],
        "name": "LevelInstanceCreatedLog",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "level",
                "type": "address"
            }
        ],
        "name": "LevelCompletedLog",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_level",
            "type": "address"
        }],
        "name": "registerLevel",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_level",
            "type": "address"
        }],
        "name": "createLevelInstance",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_instance",
            "type": "address"
        }],
        "name": "submitLevelInstance",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

instance = new web3.eth.Contract(
  ethernautABI,
  "0xc833a73d33071725143d7cf7dfd4f4bba6b5ced2"
);

setupEventListner(instance);

function setupEventListner(i) {
  i.events.LevelCompletedLog({fromBlock: 0}, (error, event) => { 
    const result = event.returnValues 
    console.log(result.player, result.level)
    const query = {
      "player": result.player,
      "level": result.level,
    }
    Complete.findOrInsertOne(query)
  })
}
