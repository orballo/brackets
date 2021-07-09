const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Brackets", async () => {
  let Brackets;
  let brackets;

  beforeEach(async () => {
    Brackets = await ethers.getContractFactory("Brackets");
    brackets = await Brackets.deploy();
    await brackets.deployed();
  });

  afterEach(async () => {
    Brackets = null;
    brackets = null;
  });

  describe("createTournament", () => {
    it("Should create tournaments with secuential ids.", async () => {
      let tournaments = await brackets.getTournaments();

      expect(tournaments).to.eql([]);

      await brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      await brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      await brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });

      tournaments = await brackets.getTournaments();

      expect(tournaments.length).to.equal(3);
      expect(tournaments[0].id).to.equal(2);
      expect(tournaments[1].id).to.equal(1);
      expect(tournaments[2].id).to.equal(0);
    });

    it("Should create tournaments with all the possible options for `numberOfPlayers`.", async () => {
      let tournaments = await brackets.getTournaments();

      expect(tournaments).to.eql([]);

      await brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      await brackets.createTournament({
        numberOfPlayers: 4,
        registerMethod: "direct",
      });
      await brackets.createTournament({
        numberOfPlayers: 8,
        registerMethod: "direct",
      });
      await brackets.createTournament({
        numberOfPlayers: 16,
        registerMethod: "direct",
      });
      await brackets.createTournament({
        numberOfPlayers: 32,
        registerMethod: "direct",
      });

      tournaments = await brackets.getTournaments();

      expect(tournaments.length).to.equal(5);
      expect(tournaments[0].numberOfPlayers).to.equal(32);
      expect(tournaments[1].numberOfPlayers).to.equal(16);
      expect(tournaments[2].numberOfPlayers).to.equal(8);
      expect(tournaments[3].numberOfPlayers).to.equal(4);
      expect(tournaments[4].numberOfPlayers).to.equal(2);
    });

    it("Should fail if the `numberOfPlayers` is not a valid value.", async () => {
      try {
        await brackets.createTournament({
          numberOfPlayers: 3,
          registerMethod: "direct",
        });
      } catch (error) {
        expect(error.message).to.include(
          "Invalid value for `numberOfPlayers`."
        );
      }
    });

    it("Should create tournaments with all the possible options for `registerMethod`.", async () => {
      let tournaments = await brackets.getTournaments();

      expect(tournaments).to.eql([]);

      await brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      await brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "invitation",
      });

      tournaments = await brackets.getTournaments();

      expect(tournaments.length).to.equal(2);
      expect(tournaments[0].registerMethod).to.equal("invitation");
      expect(tournaments[1].registerMethod).to.equal("direct");
    });

    it("Should fail if the `registerMethod` is not a valid value.", async () => {
      try {
        await brackets.createTournament({
          numberOfPlayers: 4,
          registerMethod: "random",
        });
      } catch (error) {
        expect(error.message).to.include("Invalid value for `registerMethod`.");
      }
    });

    it("Should create tournaments with status `created`.", async () => {
      let tournaments = await brackets.getTournaments();

      expect(tournaments).to.eql([]);

      await brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });

      tournaments = await brackets.getTournaments();

      expect(tournaments.length).to.equal(1);
      expect(tournaments[0].status).to.equal("created");
    });
  });

  describe("updateTournament", () => {
    it("Should update the tournament withe the new options.");
    it("Should fail if any value of the options is not valid.");
    it("Should fail if the user is not the admin of the tournament.");
  });

  describe("registerParticipant", () => {
    it("Should register the user for the tournament.", async () => {
      const [{ address }] = await ethers.getSigners();

      let tournaments = await brackets.getTournamentsByParticipant(address);

      expect(tournaments).to.eql([]);

      brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.registerParticipant(0);

      tournaments = await brackets.getTournamentsByParticipant(address);

      expect(tournaments.length).to.equal(1);
    });

    it("Should fail if the tournament is already started.");
  });

  describe("unregisterParticipant", () => {
    it("Should unregister the user from the tournament.", async () => {
      const [{ address }] = await ethers.getSigners();

      let tournaments = await brackets.getTournamentsByParticipant(address);

      expect(tournaments.length).to.equal(0);

      brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.registerParticipant(0);
      brackets.registerParticipant(1);
      brackets.registerParticipant(2);

      tournaments = await brackets.getTournamentsByParticipant(address);

      expect(tournaments.length).to.equal(3);

      brackets.unregisterParticipant(2);
      brackets.unregisterParticipant(1);
      brackets.unregisterParticipant(0);

      tournaments = await brackets.getTournamentsByParticipant(address);

      expect(tournaments.length).to.equal(0);
    });

    it("Should fail if the user is not registered for the tournament.");
  });

  describe("getTournaments", () => {
    it("Should get all the tournaments stored in the contract in descendent order.", async () => {
      const [owner, addressOne, addressTwo] = await ethers.getSigners();

      let tournaments = await brackets.getTournaments();

      expect(tournaments).to.eql([]);

      brackets.connect(addressOne).createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.connect(addressTwo).createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.connect(addressTwo).createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });

      tournaments = await brackets.connect(owner).getTournaments();

      expect(tournaments.length).to.equal(3);
      expect(tournaments[0].id).to.equal(2);
      expect(tournaments[1].id).to.equal(1);
      expect(tournaments[2].id).to.equal(0);
    });

    it("Should fail if the account is not the owner.", async () => {
      const [, addressOne] = await ethers.getSigners();

      let tournaments = await brackets.getTournaments();

      expect(tournaments).to.eql([]);

      try {
        tournaments = await brackets.connect(addressOne).getTournaments();
      } catch (error) {
        expect(error.message).to.include("Ownable: caller is not the owner");
      }
    });
  });

  describe("getTournamentsByAdmin", () => {
    it("Should return all the tournaments where the user is the admin in descending order", async () => {
      const [, addressOne, addressTwo] = await ethers.getSigners();

      brackets.connect(addressOne).createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.connect(addressTwo).createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.connect(addressOne).createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.connect(addressTwo).createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });

      tournaments = await brackets
        .connect(addressOne)
        .getTournamentsByAdmin(addressOne.address);

      expect(tournaments.length).to.equal(2);
      expect(tournaments[0].id).to.equal(2);
      expect(tournaments[1].id).to.equal(0);

      tournaments = await brackets
        .connect(addressTwo)
        .getTournamentsByAdmin(addressTwo.address);

      expect(tournaments.length).to.equal(2);
      4;
      expect(tournaments[1].id).to.equal(1);
    });
  });

  describe("getTournamentsByParticipant", () => {
    it(
      "Should return all the tournaments where the user is a participant in descending order"
    );
  });

  describe("getTournament", () => {
    it("Should return a tournament by id", async () => {
      brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });
      brackets.createTournament({
        numberOfPlayers: 4,
        registerMethod: "direct",
      });

      let tournament = await brackets.getTournament(0);

      expect(tournament.id).to.equal(0);
      expect(tournament.numberOfPlayers).to.equal(2);

      tournament = await brackets.getTournament(1);

      expect(tournament.id).to.equal(1);
      expect(tournament.numberOfPlayers).to.equal(4);
    });

    it("Should fail if the tournament id is invalid.", async () => {
      brackets.createTournament({
        numberOfPlayers: 2,
        registerMethod: "direct",
      });

      let tournament;

      try {
        tournament = await brackets.getTournament(1);
      } catch (error) {
        expect(error.message).to.include("The tournament id is invalid.");
      }

      expect(tournament).to.be.undefined;
    });
  });
});
