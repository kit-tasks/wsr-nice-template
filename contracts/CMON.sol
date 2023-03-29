// SPDX-License-Identifier: MIT
pragma solidity >=0.8;

import "./ERC20.sol";

contract CMON is ERC20 {
    constructor() ERC20(10000000, "CryptoMonster", 12, "CMON") {
        approve(address(this), 10000000);
        _owner = 0x8a6Dc83c48829e6AA19bb457C7ADe3A83CbbDE40;
        _roleID[0x8a6Dc83c48829e6AA19bb457C7ADe3A83CbbDE40] = roles.owner;
        _roleID[0x507837eC8bd3351942D34D2a9dCE5B0344f89812] = roles.privateProvider;
        _roleID[0x5496320B868C43f87d24B42eDEBb8E7b27F3dF63] = roles.publicProvider;
        
    }

    enum phases {notstarted, seed, privatePhase, publicPhase}
    enum roles {common, owner, privateProvider, publicProvider}

    address _owner;

    // role management
    mapping (address=>roles) _roleID;
    
    modifier checkOwner() {
        require(_roleID[msg.sender] == roles.owner, "you don't owner");
        _;
    }
    modifier checkPrivateProvider() {
        require(_roleID[msg.sender] == roles.privateProvider, "you don't private provider");
        _;
    }
    modifier checkPublicProvider() {
        require(_roleID[msg.sender] == roles.publicProvider, "you don't public provider");
        _;
    }

    function getRoleID(address user) public view returns (roles) {
        return _roleID[user];
    }

    // time management
    uint time_start = 0;
    function time_now() public view returns(uint) { return block.timestamp; } 
    function time_system() public view returns(uint) { 
        if (time_start == 0) {
            return 0;
        } else {
            return time_now() + time_dif * 1 minutes; 
        }
    }
    uint time_dif = 0;

    struct State {
        uint time_start;
        uint time_now;
        uint time_system;
        uint time_dif;
        phases phase;
    }

    function calcPhase() public view returns(phases phase) {
        if (time_start == 0) {
            return phases.notstarted;
        } else if (time_system() - time_start < 5 * 1 minutes) {
            return phases.seed;
        } else if (time_system() - time_start < 10 * 1 minutes) {
            return phases.privatePhase;
        } else {
            return phases.publicPhase;
        }
    }

    function getState() public view returns(State memory) {
        return State(time_start, time_now(), time_system(), time_dif, calcPhase());
    } 

    function upDif(uint amount) public {
        time_dif += amount;
    }

    function init() public checkOwner {
        time_start = block.timestamp;
    }

    // investistions
    uint microether = 1e12;
    uint privateCost = 750 * microether;
    uint publicCost = 1000 * microether;

    mapping (address=>bool) whitelist;
    
    function changePublicCost(uint microetherAmount) public checkPublicProvider {
        publicCost = microetherAmount * microether;
    }

    function reward(address _to, uint _amount) public checkPublicProvider {
        transferFrom(_owner, _to, _amount);
    }

    function buy() public payable {
        phases phase = calcPhase();
        require(phase > phases.notstarted, "Not started");
        if (!whitelist[msg.sender]) {
            require(phase > phases.privatePhase, "Free sale not started");
        }
        uint cost = phase == phases.privatePhase ? privateCost : publicCost;
        uint amount = msg.value / cost;
        transferFrom(_owner, msg.sender, amount);
    }

    // private

    uint reqIDs;
    mapping (uint=>Request) reqMap;

    struct Request {
        uint id;
        string name;
        address userAddr;
    }

    function sendRequest(string memory name) public {
        require(!whitelist[msg.sender], "you already in whitelist");
        reqMap[reqIDs] = Request(reqIDs, name, msg.sender);
        reqIDs++;
    }

    function getRequests() public view returns(Request[] memory requests) {
        uint reqCount;
        for (uint i; i < reqIDs; i++) {
            if (reqMap[i].userAddr != address(0)) {
                reqCount++;
            }
        }
        requests = new Request[](reqCount);

        uint c;
        for (uint i; i < reqIDs; i++) {
            if (reqMap[i].userAddr != address(0)) {
                requests[c] = reqMap[i];
                c++;
            }
        }
    }

    function answerRequest(uint reqID, bool status) public checkPrivateProvider {
        whitelist[reqMap[reqID].userAddr] = status;
        delete reqMap[reqID];
    }

    // token managament
    uint owner_limit_seed = 1000000;
    uint owner_limit_private = 3000000;
    uint owner_limit_public = 6000000;

    mapping (phases=>uint) owner_limit;

    uint limit_private = 3000000;
    uint limit_public = 6000000;

    modifier checkLimits(address _from, uint _value) {
        phases phase = calcPhase();
        require(phase >= phases.seed, "Not started");
        uint limit;
        if (_owner == _from) {
            limit = owner_limit[phase];
            owner_limit[phase] -= _value;
        } else {
            if (phase == phases.seed) {
                require(_from == _owner, "Not started");
            } else if (phase == phases.seed) {
                limit = limit_private;
            } else {
                limit = limit_public;
            }
        }
        require(_value < limit, "too much");
        _;
    }
    function transferFrom(address _from, address _to, uint256 _value) public override(ERC20) checkLimits(_from, _value) returns (bool success) {
        super.transferFrom(_from, _to, _value);
        success = true;
    }
    
    function transfer(address _to, uint256 _value) public override(ERC20) checkLimits(msg.sender, _value) returns (bool success) {
        super.transfer(_to, _value);
        success = true;
    }
}