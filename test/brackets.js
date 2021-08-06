const { use, expect } = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Brackets", async () => {
  let zeroAddress = "0x0000000000000000000000000000000000000000";

  let Brackets;
  let brackets;

  beforeEach(async () => {
    Brackets = await ethers.getContractFactory("Brackets");
    brackets = await Brackets.deploy();
    await brackets.deployed();
  });

  describe("createTournament", () => {
    it("Should create tournaments with secuential ids.", async () => {
      const [owner] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });

      let tournaments = await brackets.getTournaments(owner.address);

      expect(tournaments.length).to.equal(3);
      expect(tournaments[0].id).to.equal(2);
      expect(tournaments[1].id).to.equal(1);
      expect(tournaments[2].id).to.equal(0);
    });

    it("Should create tournaments with all the possible options for `numberOfPlayers`.", async () => {
      const [owner] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 4,
        initialPrize: 1,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 8,
        initialPrize: 1,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 16,
        initialPrize: 1,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 32,
        initialPrize: 1,
        registrationFee: 1,
      });

      let tournaments = await brackets.getTournaments(owner.address);

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
          initialPrize: 1,
          registrationFee: 1,
        });
      } catch (error) {
        expect(error.message).to.include(
          "Invalid value for `numberOfPlayers`."
        );
      }
    });

    it("Should create tournaments with status `created`.", async () => {
      const [owner] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });

      let tournaments = await brackets.getTournaments(owner.address);

      expect(tournaments.length).to.equal(1);
      expect(tournaments[0].status).to.equal("created");
    });

    it("Should fail if `initialPrize` and `registrationFee` are both 0.");
  });

  describe("updateTournament", () => {
    it("Should update the tournament with the new options.", async () => {
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });

      let tournament = await brackets.getTournament(0);

      expect(tournament.numberOfPlayers).to.equal(2);
      expect(tournament.initialPrize).to.equal(1);
      expect(tournament.registrationFee).to.equal(1);

      await brackets.updateTournament(0, {
        numberOfPlayers: 4,
        initialPrize: 2,
        registrationFee: 2,
      });

      tournament = await brackets.getTournament(0);

      expect(tournament.numberOfPlayers).to.equal(4);
      expect(tournament.initialPrize).to.equal(2);
      expect(tournament.registrationFee).to.equal(2);
    });
    it("Should fail if any value of the options is not valid.");
    it("Should fail if the user is not the admin of the tournament.");
  });

  describe("registerParticipant", () => {
    it("Should register the user for the tournament.", async () => {
      const [owner, one] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      await brackets.registerParticipant(0, {
        value: ethers.utils.parseEther("1"),
      });
      await brackets
        .connect(one)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });

      let tournament = await brackets.getTournament(0);

      expect(tournament.participants[0]).to.equal(owner.address);
      expect(tournament.participants[1]).to.equal(one.address);
    });

    it("Should fail if the account didn't send the fee.", async () => {
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      let error;

      try {
        await brackets.registerParticipant(0);
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include(
        "The account didn't pay the right fee for the tournament."
      );
    });

    it("Should fail if the account is already registered for the tournament.", async () => {
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 0,
      });

      await brackets.registerParticipant(0);

      let error;

      try {
        await brackets.registerParticipant(0);
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include(
        "The account is already registered for this tournament."
      );
    });

    it("Should fail if the tournament is already full.", async () => {
      const [owner, one, two] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      await brackets
        .connect(owner)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });
      await brackets
        .connect(one)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });

      let error;

      try {
        await brackets
          .connect(two)
          .registerParticipant(0, { value: ethers.utils.parseEther("1") });
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include("The tournament is already full.");
    });

    it("Should fail if the tournament is already started.");

    it("Should fail if the tournament doesn't exist", async () => {
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      let error;

      try {
        await brackets.registerParticipant(1, {
          value: ethers.utils.parseEther("1"),
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include("The tournament ID is invalid.");
    });
  });

  describe("unregisterParticipant", () => {
    it("Should unregister the user from the tournament.", async () => {
      const [owner, one, two, three] = await ethers.getSigners();

      brackets.createTournament({
        numberOfPlayers: 4,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      await brackets
        .connect(owner)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });
      await brackets
        .connect(one)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });
      await brackets
        .connect(two)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });
      await brackets
        .connect(three)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });

      let tournament = await brackets.getTournament(0);

      expect(tournament.participants[0]).to.be.equal(owner.address);
      expect(tournament.participants[1]).to.be.equal(one.address);
      expect(tournament.participants[2]).to.be.equal(two.address);
      expect(tournament.participants[3]).to.be.equal(three.address);

      await brackets.connect(three).unregisterParticipant(0);

      tournament = await brackets.getTournament(0);

      expect(tournament.participants[0]).to.be.equal(owner.address);
      expect(tournament.participants[1]).to.be.equal(one.address);
      expect(tournament.participants[2]).to.be.equal(two.address);
      expect(tournament.participants[3]).to.be.equal(zeroAddress);

      await brackets.connect(owner).unregisterParticipant(0);

      tournament = await brackets.getTournament(0);

      expect(tournament.participants[0]).to.be.equal(one.address);
      expect(tournament.participants[1]).to.be.equal(two.address);
      expect(tournament.participants[2]).to.be.equal(zeroAddress);
      expect(tournament.participants[3]).to.be.equal(zeroAddress);
    });

    it("Should return the fee of the tournament to the account", async () => {
      const [owner] = await ethers.getSigners();

      brackets.createTournament({
        numberOfPlayers: 4,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      const balanceBeforeRegister = Math.floor(
        ethers.utils.formatEther(
          await ethers.provider.getBalance(owner.address)
        )
      );

      await brackets
        .connect(owner)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });

      const balanceAfterRegister = Math.floor(
        ethers.utils.formatEther(
          await ethers.provider.getBalance(owner.address)
        )
      );

      expect(balanceAfterRegister).to.be.equal(balanceBeforeRegister - 1);

      await brackets.connect(owner).unregisterParticipant(0);

      const balanceAfterUnregister = Math.floor(
        ethers.utils.formatEther(
          await ethers.provider.getBalance(owner.address)
        )
      );

      expect(balanceAfterUnregister).to.be.equal(balanceBeforeRegister);
    });

    it("Should fail if the tournament id is invalid.", async () => {
      await brackets.createTournament({
        numberOfPlayers: 4,
        initialPrize: 1,
        registrationFee: 1,
      });

      let error;

      try {
        await brackets.unregisterParticipant(1);
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include("The tournament ID is invalid.");
    });

    it("Should fail if the account is not registered for the tournament.", async () => {
      await brackets.createTournament({
        numberOfPlayers: 4,
        initialPrize: 1,
        registrationFee: 1,
      });

      let error;

      try {
        await brackets.unregisterParticipant(0);
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include(
        "The account is not registered for this tournament."
      );
    });

    it("Should fail if the tournament is already started");
  });

  describe("getTournament", () => {
    it("Should return a tournament by id", async () => {
      const [owner, one, two] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      await brackets
        .connect(one)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });
      await brackets
        .connect(two)
        .registerParticipant(0, { value: ethers.utils.parseEther("1") });

      let tournament = await brackets.getTournament(0);

      expect(tournament.id).to.equal(0);
      expect(tournament.numberOfPlayers).to.equal(2);
      expect(tournament.status).to.equal("created");
      expect(tournament.admin).to.equal(owner.address);
      expect(tournament.participants.length).to.equal(2);
      expect(tournament.participants[0]).to.equal(one.address);
      expect(tournament.participants[1]).to.equal(two.address);
    });

    it("Should fail if the tournament id is invalid.", async () => {
      brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });

      let error;

      try {
        await brackets.getTournament(1);
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include("The tournament ID is invalid.");
    });
  });

  describe("getTournaments", () => {
    it("Should return the tournaments by account sorted descending.", async () => {
      const [owner, one, two] = await ethers.getSigners();

      await brackets.connect(owner).createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });
      await brackets.connect(one).createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });
      await brackets.connect(two).createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      await brackets
        .connect(owner)
        .registerParticipant(1, { value: ethers.utils.parseEther("1") });
      await brackets
        .connect(owner)
        .registerParticipant(2, { value: ethers.utils.parseEther("1") });

      let tournaments = await brackets
        .connect(owner)
        .getTournaments(owner.address);

      expect(tournaments.length).to.equal(3);
      expect(tournaments[0].id).to.equal(2);
      expect(tournaments[1].id).to.equal(1);
      expect(tournaments[2].id).to.equal(0);

      tournaments = await brackets.connect(one).getTournaments(one.address);

      expect(tournaments.length).to.equal(1);
      expect(tournaments[0].id).to.equal(1);
    });
  });

  describe("getAllTournaments", () => {
    it("Should get all the tournaments stored in the contract in descendent order.", async () => {
      const [owner, addressOne, addressTwo] = await ethers.getSigners();

      brackets.connect(owner).createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });
      brackets.connect(addressOne).createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });
      brackets.connect(addressTwo).createTournament({
        numberOfPlayers: 2,
        initialPrize: 1,
        registrationFee: 1,
      });

      let tournaments = await brackets.connect(owner).getAllTournaments();

      expect(tournaments.length).to.equal(3);
      expect(tournaments[0].id).to.equal(2);
      expect(tournaments[1].id).to.equal(1);
      expect(tournaments[2].id).to.equal(0);
    });
  });
});
