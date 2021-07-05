//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Brackets is Ownable {
    struct Tournament {
        uint32 id;
        string name;
    }

    struct Participant {
        string username;
        address account;
    }

    struct CreateTournamentOptions {
        string name;
        string username;
    }

    uint32 tournamentId;

    mapping(uint32 => Tournament) tournaments;
    mapping(address => uint32[]) tournamentsByAdmin;
    mapping(address => string) addressToUsername;

    // mapping(address => uint256[]) tournamentsByParticipant;

    constructor() {
        tournamentId = 0;
    }

    function createTournament(CreateTournamentOptions memory _options)
        public
        returns (Tournament memory)
    {
        // Increase the tournament id.
        tournamentId += 1;

        // Create the tournament.
        Tournament memory _tournament;
        _tournament.id = tournamentId;
        _tournament.name = _options.name;

        // Save the tournament and its relationships.
        tournaments[_tournament.id] = _tournament;
        tournamentsByAdmin[msg.sender].push(tournamentId);

        // Save admin username.
        addressToUsername[msg.sender] = _options.username;

        return _tournament;
    }

    function getTournaments() public view returns (Tournament[] memory) {
        // Initialize empty array.
        Tournament[] memory _tournaments = new Tournament[](
            tournamentsByAdmin[msg.sender].length
        );

        // Assign structs to array.
        for (uint32 i = 0; i < tournamentsByAdmin[msg.sender].length; i++) {
            uint32 _tournamentId = tournamentsByAdmin[msg.sender][i];
            _tournaments[i] = tournaments[_tournamentId];
        }

        return _tournaments;
    }
}
