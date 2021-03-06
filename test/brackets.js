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

  async function getBalance(address) {
    return Math.round(
      ethers.utils.formatEther(await ethers.provider.getBalance(address))
    );
  }

  describe("createTournament", () => {
    it("Should create tournaments with secuential ids.", async () => {
      const [owner] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
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
        initialPrize: 0,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 4,
        initialPrize: 0,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 8,
        initialPrize: 0,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 16,
        initialPrize: 0,
        registrationFee: 1,
      });
      await brackets.createTournament({
        numberOfPlayers: 32,
        initialPrize: 0,
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

    it("Should take the initial prize from the account", async () => {
      const [owner] = await ethers.getSigners();

      const balanceBeforeCreate = Math.floor(
        parseInt(
          ethers.utils.formatEther(
            await ethers.provider.getBalance(owner.address)
          )
        )
      );

      await brackets.createTournament(
        {
          numberOfPlayers: 2,
          initialPrize: ethers.utils.parseEther("50"),
          registrationFee: 0,
        },
        { value: ethers.utils.parseEther("50") }
      );

      const balanceAfterCreate = Math.floor(
        parseInt(
          ethers.utils.formatEther(
            await ethers.provider.getBalance(owner.address)
          )
        )
      );

      expect(balanceAfterCreate).to.equal(balanceBeforeCreate - 50);
    });

    it("Should fail if the initial prize is not paid.", async () => {
      let error;
      try {
        await brackets.createTournament({
          numberOfPlayers: 2,
          initialPrize: ethers.utils.parseEther("1"),
          registrationFee: 0,
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include(
        "The account didn't pay the right initial prize for the tournament."
      );
    });

    it("Should fail if the `numberOfPlayers` is not a valid value.", async () => {
      let error;

      try {
        await brackets.createTournament({
          numberOfPlayers: 3,
          initialPrize: 0,
          registrationFee: 1,
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.to.be.undefined;
      expect(error.message).to.include("Invalid value for `numberOfPlayers`.");
    });

    it("Should create tournaments with status `created`.", async () => {
      const [owner] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: 1,
      });

      let tournaments = await brackets.getTournaments(owner.address);

      expect(tournaments.length).to.equal(1);
      expect(tournaments[0].status).to.equal("created");
    });

    it("Should fail if `initialPrize` and `registrationFee` are both 0.");
  });

  describe.only("startTournament", () => {
    it("Should start the tournament.", async () => {
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: 1,
      });

      let tournament = await brackets.getTournament(0);

      expect(tournament.status).to.equal("created");

      await brackets.startTournament(0);

      tournament = await brackets.getTournament(0);

      expect(tournament.status).to.equal("started");
    });

    it("Should fail if the user is not the admin of the tournament.");

    it("Should fail if the tournament does not exist.");

    it("Should fail if the tournament has already started.");

    it("Should fail if the tournament was already canceled.");

    it("Should fail if the tournament has already finished.");
  });

  describe("cancelTournament", () => {
    it("Should cancel the tournament.", async () => {
      await brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("1"),
      });

      let tournament = await brackets.getTournament(0);

      expect(tournament.status).to.equal("created");

      await brackets.cancelTournament(0);

      tournament = await brackets.getTournament(0);

      expect(tournament.status).to.equal("canceled");
    });
    it("Should return the money of the initial prize to the admin.", async () => {
      const [owner] = await ethers.getSigners();

      const balanceBeforeCreate = await getBalance(owner.address);

      await brackets.createTournament(
        {
          numberOfPlayers: 2,
          initialPrize: ethers.utils.parseEther("50"),
          registrationFee: 0,
        },
        { value: ethers.utils.parseEther("50") }
      );

      const balanceAfterCreate = await getBalance(owner.address);

      expect(balanceAfterCreate).to.equal(balanceBeforeCreate - 50);

      await brackets.cancelTournament(0);

      const balanceAfterCancel = await getBalance(owner.address);

      expect(balanceAfterCancel).to.equal(balanceBeforeCreate);
    });
    it("Should return the money of the registration fee to participants.", async () => {
      const [owner, one, two] = await ethers.getSigners();

      await brackets.createTournament({
        numberOfPlayers: 4,
        initialPrize: 0,
        registrationFee: ethers.utils.parseEther("50"),
      });

      const balanceBeforeRegisterOne = await getBalance(one.address);
      const balanceBeforeRegisterTwo = await getBalance(two.address);

      await brackets
        .connect(one)
        .registerParticipant(0, { value: ethers.utils.parseEther("50") });
      await brackets
        .connect(two)
        .registerParticipant(0, { value: ethers.utils.parseEther("50") });

      const balanceAfterRegisterOne = await getBalance(one.address);
      const balanceAfterRegisterTwo = await getBalance(two.address);

      expect(balanceBeforeRegisterOne).to.equal(balanceAfterRegisterOne + 50);
      expect(balanceBeforeRegisterTwo).to.equal(balanceAfterRegisterTwo + 50);

      await brackets.connect(owner).cancelTournament(0);

      const balanceAfterCancelOne = await getBalance(one.address);
      const balanceAfterCancelTwo = await getBalance(two.address);

      expect(balanceAfterCancelOne).to.equal(balanceBeforeRegisterOne);
      expect(balanceAfterCancelTwo).to.equal(balanceBeforeRegisterTwo);
    });
    it("Should fail if the user is not the admin of the tournament.");
    it("Should fail if the tournament does not exist.");
    it("Should fail if the tournament was already canceled.");
    it("Should fail if the tournament was already finished.");
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
        initialPrize: 0,
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
        initialPrize: 0,
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
        initialPrize: 0,
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
        numberOfPlayers: 32,
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
      expect(tournament.numberOfPlayers).to.equal(32);
      expect(tournament.status).to.equal("created");
      expect(tournament.admin).to.equal(owner.address);
      expect(tournament.participants.length).to.equal(32);
      expect(tournament.participants[0]).to.equal(one.address);
      expect(tournament.participants[1]).to.equal(two.address);
      expect(tournament.brackets.length).to.equal(63);
      expect(tournament.brackets[0].participant).to.equal(one.address);
      expect(tournament.brackets[0].result).to.equal("none");
      expect(tournament.brackets[1].participant).to.equal(two.address);
      expect(tournament.brackets[1].result).to.equal("none");
    });

    it("Should fail if the tournament id is invalid.", async () => {
      brackets.createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
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
        initialPrize: 0,
        registrationFee: 1,
      });
      brackets.connect(addressOne).createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
        registrationFee: 1,
      });
      brackets.connect(addressTwo).createTournament({
        numberOfPlayers: 2,
        initialPrize: 0,
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
