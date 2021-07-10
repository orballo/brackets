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
    function registerParticipant(uint32 _tournamentId) public {
        bool alreadyExists = false;

        // Check if the tournament is already in the
        // list of tournaments for this account.
        for (uint32 i = 0; i < accountToTournaments[msg.sender].length; i++) {
            if (accountToTournaments[msg.sender][i] == _tournamentId) {
                alreadyExists = true;
                break;
            }
        }

        if (!alreadyExists) {
            accountToTournaments[msg.sender].push(_tournamentId);
        }

        // Add the account to the tournament brackets.
        for (
            uint8 i = 1;
            i <= tournaments[_tournamentId].numberOfPlayers;
            i++
        ) {
            require(
                tournamentToBrackets[_tournamentId][i] != msg.sender,
                "The account is already registered for this tournament."
            );

            if (tournamentToBrackets[_tournamentId][i] == address(0)) {
                tournamentToBrackets[_tournamentId][i] = msg.sender;
                break;
            }
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
        returns (TournamentPayload memory)
    {
        require(
            tournaments[_id].numberOfPlayers != 0,
            "The tournament ID is invalid."
        );

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
        returns (Tournament[] memory)
    {
        require(
            accountToTournaments[_account].length > 0,
            "The account doesn't have any tournaments."
        );
        // Initialize empty arrays.

        // Tournament[] memory _adminTournaments = new Tournament[](
        //     tournamentsByAdmin[_sender].length
        // );
    }

    // /**
    //  * Return all the tournaments where the user is the admin.
    //  */
    // function getTournamentsByAdmin(address _sender)
    //     public
    //     view
    //     returns (Tournament[] memory)
    // {
    //     // Initialize empty array.
    //     Tournament[] memory _tournaments = new Tournament[](
    //         tournamentsByAdmin[_sender].length
    //     );

    //     // Assign structs to array.
    //     for (uint32 i = 0; i < tournamentsByAdmin[_sender].length; i++) {
    //         uint32 _tournamentId = tournamentsByAdmin[_sender][
    //             tournamentsByAdmin[_sender].length - i - 1
    //         ];
    //         _tournaments[i] = tournaments[_tournamentId];
    //     }

    //     return _tournaments;
    // }

    // /**
    //  * Return all the tournaments where the account is a participant.
    //  */
    // function getTournamentsByParticipant(address _sender)
    //     public
    //     view
    //     returns (Tournament[] memory)
    // {
    //     // Initialize empty array.
    //     Tournament[] memory _tournaments = new Tournament[](
    //         tournamentsByParticipant[_sender].length
    //     );

    //     // Assign structs to array.
    //     for (uint32 i = 0; i < tournamentsByParticipant[_sender].length; i++) {
    //         uint32 _tournamentId = tournamentsByParticipant[_sender][
    //             tournamentsByParticipant[_sender].length - i - 1
    //         ];
    //         _tournaments[i] = tournaments[_tournamentId];
    //     }

    //     return _tournaments;
    // }

    // /**
    //  * Return all the tournaments stored in the contract.
    //  */
    // function getAllTournaments() public view returns (Tournament[] memory) {
    //     // Initialize empty array.
    //     Tournament[] memory _tournaments = new Tournament[](tournamentId);

    //     // Assign structs to array.
    //     for (uint32 i = 0; i < tournamentId; i++) {
    //         _tournaments[i] = tournaments[tournamentId - i - 1];
    //     }

    //     return _tournaments;
    // }
}
