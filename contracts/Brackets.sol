//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

struct Tournament {
    uint32 id;
    uint8 numberOfPlayers; // 2 | 4 | 8 | 16 | 32
    string status; // "created" | "started" | "finished" | "canceled"
}

struct TournamentPayload {
    uint32 id;
    uint8 numberOfPlayers;
    string status;
    address admin;
    address[] participants;
}

struct TournamentOptions {
    uint8 numberOfPlayers;
}

contract Brackets is Ownable {
    constructor() {
        tournamentId = 0;
    }

    // This is the unique identifier used for tournaments.
    uint32 tournamentId;

    // This is the data object of the tournament.
    mapping(uint32 => Tournament) tournaments;

    // Mappings to get tournaments using the account address.
    mapping(address => uint32[]) accountToTournaments;

    // Asignment of the accounts in the brackets.
    // The index 0 is reserver for the admin.
    // From 1 to 32 are used for the brackets.
    mapping(uint32 => mapping(uint8 => address)) tournamentToBrackets;

    // Modifiers.

    // modifier onlyAdmin(uint32 _tournamentId) {
    //     bool isAdmin = false;

    //     for (uint32 i = 0; i < tournamentsByAdmin[msg.sender].length; i++) {
    //         if (tournamentsByAdmin[msg.sender][i] == _tournamentId) {
    //             isAdmin = true;
    //         }
    //     }

    //     require(isAdmin, "The account is not the admin of this tournament.");
    //     _;
    // }

    modifier validateTournamentId(uint32 _id) {
        require(
            keccak256(bytes(tournaments[_id].status)) != keccak256(bytes("")),
            "The tournament ID is invalid."
        );
        _;
    }

    modifier validateOptions(TournamentOptions memory _options) {
        // Validate `numberOfPlayers` option.
        require(
            _options.numberOfPlayers == 2 ||
                _options.numberOfPlayers == 4 ||
                _options.numberOfPlayers == 8 ||
                _options.numberOfPlayers == 16 ||
                _options.numberOfPlayers == 32,
            "Invalid value for `numberOfPlayers`."
        );
        _;
    }

    /**
     * Create a new tournament.
     */
    function createTournament(TournamentOptions memory _options)
        public
        validateOptions(_options)
    {
        // Populate the tournament.
        Tournament memory _tournament;
        _tournament.id = tournamentId;
        _tournament.numberOfPlayers = _options.numberOfPlayers;
        _tournament.status = "created";

        // Save the tournament and its relationships.
        tournaments[_tournament.id] = _tournament;
        accountToTournaments[msg.sender].push(_tournament.id);
        tournamentToBrackets[_tournament.id][0] = msg.sender;

        // Increase the tournament id.
        tournamentId += 1;
    }

    // /**
    //  * Update a tournament.
    //  */
    // function updateTournament(
    //     uint32 _tournamentId,
    //     TournamentOptions memory _options
    // ) public onlyAdmin(_tournamentId) {}

    /**
     * Register a participant for a tournament.
     */
    function registerParticipant(uint32 _tournamentId)
        public
        validateTournamentId(_tournamentId)
    {
        bool hasRegistered = false;
        bool alreadyExists = false;

        // Check that the tournament is not started.
        require(
            keccak256(bytes(tournaments[_tournamentId].status)) ==
                keccak256(bytes("created")),
            "The tournament has already started."
        );

        // Add the account to the tournament brackets.
        for (
            uint8 i = 1;
            i <= tournaments[_tournamentId].numberOfPlayers;
            i++
        ) {
            // Check that the account is not already registered.
            require(
                tournamentToBrackets[_tournamentId][i] != msg.sender,
                "The account is already registered for this tournament."
            );

            // If there is an empty space, register the account.
            if (tournamentToBrackets[_tournamentId][i] == address(0)) {
                tournamentToBrackets[_tournamentId][i] = msg.sender;
                hasRegistered = true;
                break;
            }
        }

        // Check if the tournament was full.
        require(hasRegistered, "The tournament is already full.");

        // Check if the tournament is already in the
        // list of tournaments for this account.
        for (uint32 i = 0; i < accountToTournaments[msg.sender].length; i++) {
            if (accountToTournaments[msg.sender][i] == _tournamentId) {
                alreadyExists = true;
                break;
            }
        }

        // Add the tournament to the account.
        if (!alreadyExists) {
            accountToTournaments[msg.sender].push(_tournamentId);
        }
    }

    // /**
    //  * Unregister a participant from a tournament.
    //  */
    // function unregisterParticipant(uint32 _tournamentId) public {
    //     bool removed = false;

    //     for (
    //         uint32 i = 0;
    //         i < tournamentsByParticipant[msg.sender].length;
    //         i++
    //     ) {
    //         if (
    //             removed ||
    //             tournamentsByParticipant[msg.sender][i] == _tournamentId
    //         ) {
    //             if (i != tournamentsByParticipant[msg.sender].length - 1) {
    //                 tournamentsByParticipant[msg.sender][
    //                     i
    //                 ] = tournamentsByParticipant[msg.sender][i + 1];
    //             }
    //             removed = true;
    //         }
    //     }

    //     require(removed, "The account is not registered for this tournament.");

    //     tournamentsByParticipant[msg.sender].pop();
    // }

    function getTournament(uint32 _id)
        public
        view
        validateTournamentId(_id)
        returns (TournamentPayload memory)
    {
        // Create a tournament object.
        TournamentPayload memory _tournament;
        _tournament.id = tournaments[_id].id;
        _tournament.numberOfPlayers = tournaments[_id].numberOfPlayers;
        _tournament.status = tournaments[_id].status;
        _tournament.admin = tournamentToBrackets[_id][0];
        _tournament.participants = new address[](
            tournaments[_id].numberOfPlayers
        );

        // Populate the participants of the tournament.
        for (uint8 i = 1; i <= _tournament.participants.length; i++) {
            if (tournamentToBrackets[_id][i] != address(0)) {
                _tournament.participants[i - 1] = tournamentToBrackets[_id][i];
            }
        }

        return _tournament;
    }

    function getTournaments(address _account)
        public
        view
        returns (TournamentPayload[] memory)
    {
        // Check that the account has tournaments.
        require(
            accountToTournaments[_account].length > 0,
            "The account doesn't have any tournaments."
        );

        // Initialize empty arrays.
        TournamentPayload[] memory _tournaments = new TournamentPayload[](
            accountToTournaments[_account].length
        );

        for (uint32 i = 0; i < _tournaments.length; i++) {
            _tournaments[i] = getTournament(
                accountToTournaments[_account][
                    accountToTournaments[_account].length - i - 1
                ]
            );
        }

        return _tournaments;
    }

    /**
     * Return all the tournaments stored in the contract.
     */
    function getAllTournaments()
        public
        view
        returns (TournamentPayload[] memory)
    {
        // Initialize empty array.
        TournamentPayload[] memory _tournaments = new TournamentPayload[](
            tournamentId
        );

        // Assign structs to array.
        for (uint32 i = 0; i < tournamentId; i++) {
            _tournaments[i] = getTournament(
                tournaments[tournamentId - i - 1].id
            );
        }

        return _tournaments;
    }
}
