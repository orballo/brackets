//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

struct Tournament {
    uint32 id;
    uint8 numberOfPlayers; // 2 | 4 | 8 | 16 | 32
    uint256 initialPrize;
    uint256 registrationFee;
    string status; // "created" | "started" | "finished" | "canceled"
}

struct TournamentPayload {
    uint32 id;
    uint8 numberOfPlayers;
    uint256 initialPrize;
    uint256 registrationFee;
    string status;
    address admin;
    address[] participants;
}

struct TournamentOptions {
    uint8 numberOfPlayers;
    uint256 initialPrize;
    uint256 registrationFee;
}

struct Bracket {
    address participant;
    string result; // "none" | "win" | "lose"
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
    // The index 0 is reserved for the admin.
    // From 1 to 63 are used for the brackets.
    mapping(uint32 => mapping(uint8 => Bracket)) tournamentToBrackets;

    // Modifiers.

    modifier onlyAdmin(uint32 _tournamentId) {
        bool isAdmin = false;

        if (tournamentToBrackets[_tournamentId][0].participant == msg.sender) {
            isAdmin = true;
        }

        require(isAdmin, "The account is not the admin of this tournament.");
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

    modifier validateTournamentId(uint32 _id) {
        require(
            keccak256(bytes(tournaments[_id].status)) != keccak256(bytes("")),
            "The tournament ID is invalid."
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
        _tournament.initialPrize = _options.initialPrize;
        _tournament.registrationFee = _options.registrationFee;
        _tournament.status = "created";

        // Save the tournament and its relationships.
        tournaments[_tournament.id] = _tournament;
        accountToTournaments[msg.sender].push(_tournament.id);
        tournamentToBrackets[_tournament.id][0] = Bracket({
            participant: msg.sender,
            result: "none"
        });

        // Increase the tournament id.
        tournamentId += 1;
    }

    // /**
    //  * Update a tournament.
    //  */
    function updateTournament(
        uint32 _tournamentId,
        TournamentOptions memory _options
    ) public onlyAdmin(_tournamentId) validateOptions(_options) {
        // Update the tournament.
        tournaments[_tournamentId].numberOfPlayers = _options.numberOfPlayers;
        tournaments[_tournamentId].initialPrize = _options.initialPrize;
        tournaments[_tournamentId].registrationFee = _options.registrationFee;
    }

    /**
     * Register a participant for a tournament.
     */
    function registerParticipant(uint32 _tournamentId)
        public
        payable
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

        if (tournaments[_tournamentId].registrationFee != 0) {
            require(
                msg.value == tournaments[_tournamentId].registrationFee,
                "The account didn't pay the right fee for the tournament."
            );
        }

        // Add the account to the tournament brackets.
        for (
            uint8 i = 1;
            i <= tournaments[_tournamentId].numberOfPlayers;
            i++
        ) {
            // Check that the account is not already registered.
            require(
                tournamentToBrackets[_tournamentId][i].participant !=
                    msg.sender,
                "The account is already registered for this tournament."
            );

            // If there is an empty space, register the account.
            if (
                tournamentToBrackets[_tournamentId][i].participant == address(0)
            ) {
                tournamentToBrackets[_tournamentId][i].participant = msg.sender;
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

    /**
     * Unregister a participant from a tournament.
     */
    function unregisterParticipant(uint32 _tournamentId)
        public
        validateTournamentId(_tournamentId)
    {
        bool removedFromBrackets = false;
        bool isAdmin = tournamentToBrackets[_tournamentId][0].participant ==
            msg.sender;

        // Get the number of iterations we need
        // to explore the mapping.
        uint8 iterations = tournaments[_tournamentId].numberOfPlayers;

        // Start looking for the address of the player
        // in the mapping.
        for (uint8 i = 1; i <= iterations; i++) {
            // If we find it we start pushing the players up
            // in the brackets.
            if (
                removedFromBrackets ||
                tournamentToBrackets[_tournamentId][i].participant == msg.sender
            ) {
                tournamentToBrackets[_tournamentId][i] = tournamentToBrackets[
                    _tournamentId
                ][i + 1];
                removedFromBrackets = true;
            }
        }

        require(
            removedFromBrackets,
            "The account is not registered for this tournament."
        );

        bool removedFromArray = false;

        // Removing the user from the array of tournaments of the account
        // and from the brackets.
        if (removedFromBrackets && !isAdmin) {
            for (
                uint32 i = 0;
                i < accountToTournaments[msg.sender].length;
                i++
            ) {
                // Check if the tournament ID and the id of the array matches,
                // or if the tournament was already removed.
                if (
                    removedFromArray ||
                    (accountToTournaments[msg.sender][i] == _tournamentId)
                ) {
                    // If it is not the last element in the array
                    // we start pushing the elements of the array
                    // one position.
                    if (i != accountToTournaments[msg.sender].length - 1) {
                        accountToTournaments[msg.sender][
                            i
                        ] = accountToTournaments[msg.sender][i + 1];
                    }

                    removedFromArray = true;
                }
            }

            accountToTournaments[msg.sender].pop();
        }

        // Return the payed fee for the tournament to the account.
        if (tournaments[_tournamentId].registrationFee != 0) {
            (bool success, ) = msg.sender.call{
                value: tournaments[_tournamentId].registrationFee
            }("");
            require(success, "Failed to send Ether");
        }
    }

    /**
     * Returns a tournament by id.
     */
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
        _tournament.initialPrize = tournaments[_id].initialPrize;
        _tournament.registrationFee = tournaments[_id].registrationFee;
        _tournament.status = tournaments[_id].status;
        _tournament.admin = tournamentToBrackets[_id][0].participant;
        _tournament.participants = new address[](
            tournaments[_id].numberOfPlayers
        );

        // Populate the participants of the tournament.
        for (uint8 i = 1; i <= _tournament.participants.length; i++) {
            if (tournamentToBrackets[_id][i].participant != address(0)) {
                _tournament.participants[i - 1] = tournamentToBrackets[_id][i]
                    .participant;
            }
        }

        return _tournament;
    }

    /**
     * Returns all the tournaments for one account.
     */
    function getTournaments(address _account)
        public
        view
        returns (TournamentPayload[] memory)
    {
        // // Check that the account has tournaments.
        // require(
        //     accountToTournaments[_account].length > 0,
        //     "The account doesn't have any tournaments."
        // );

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
