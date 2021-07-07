//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Brackets is Ownable {
    struct Tournament {
        uint32 id;
        uint8 numberOfPlayers; // 2 | 4 | 8 | 16 | 32
        string registerMethod; // "direct" | "invitation"
        string status; // "created" | "started" | "finished" | "canceled"
    }

    struct TournamentOptions {
        uint8 numberOfPlayers;
        string registerMethod;
    }

    uint32 tournamentId;

    mapping(uint32 => Tournament) tournaments;
    mapping(address => uint32[]) tournamentsByAdmin;
    mapping(address => uint32[]) tournamentsByParticipant;

    constructor() {
        tournamentId = 0;
    }

    /**
     * Create a new tournament.
     */
    function createTournament(TournamentOptions memory _options) public {
        // Validate `numberOfPlayers` option.
        require(
            _options.numberOfPlayers == 2 ||
                _options.numberOfPlayers == 4 ||
                _options.numberOfPlayers == 8 ||
                _options.numberOfPlayers == 16 ||
                _options.numberOfPlayers == 32,
            "Invalid value for `numberOfPlayers`."
        );

        // Validate `registerMethod` option.
        require(
            keccak256(bytes(_options.registerMethod)) ==
                keccak256(bytes("direct")) ||
                keccak256(bytes(_options.registerMethod)) ==
                keccak256(bytes("invitation")),
            "Invalid value for `registerMethod`."
        );

        // Populate the tournament.
        Tournament memory _tournament;
        _tournament.id = tournamentId;
        _tournament.numberOfPlayers = _options.numberOfPlayers;
        _tournament.registerMethod = _options.registerMethod;
        _tournament.status = "created";

        // Save the tournament and its relationships.
        tournaments[_tournament.id] = _tournament;
        tournamentsByAdmin[msg.sender].push(tournamentId);

        // Increase the tournament id.
        tournamentId += 1;
    }

    /**
     * Register a participant to a tournament.
     */
    function registerPaticipant(uint32 _tournamentId) public {
        tournamentsByParticipant[msg.sender].push(_tournamentId);
    }

    /**
     * Return all the tournaments where the user is the admin.
     */
    function getTournamentsByAdmin() public view returns (Tournament[] memory) {
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

    /**
     * Return all the tournaments where the account is a participant.
     */
    function getTournamentsByParticipant()
        public
        view
        returns (Tournament[] memory)
    {
        // Initialize empty array.
        Tournament[] memory _tournaments = new Tournament[](
            tournamentsByParticipant[msg.sender].length
        );

        // Assign structs to array.
        for (
            uint32 i = 0;
            i < tournamentsByParticipant[msg.sender].length;
            i++
        ) {
            uint32 _tournamentId = tournamentsByParticipant[msg.sender][i];
            _tournaments[i] = tournaments[_tournamentId];
        }

        return _tournaments;
    }

    /**
     * Return all the tournaments stored in the contract.
     */

    function getTournaments()
        public
        view
        onlyOwner
        returns (Tournament[] memory)
    {
        // Initialize empty array.
        Tournament[] memory _tournaments = new Tournament[](tournamentId);

        // Assign structs to array.
        for (uint32 i = 0; i < tournamentId; i++) {
            _tournaments[i] = tournaments[i];
        }

        return _tournaments;
    }
}
