const { expect } = require("chai");

describe("Tournament", () => {
  it("Should create tournaments correctly", async function () {
    const Brackets = await ethers.getContractFactory("Brackets");
    const brackets = await Brackets.deploy();
    await brackets.deployed();

    let tournaments = await brackets.getTournaments();

    expect(tournaments).to.eql([]);

    await brackets.createTournament({
      name: "First Tournament",
      username: "Orballo",
    });

    tournaments = await brackets.getTournaments();

    expect(tournaments.length).to.equal(1);
    expect(tournaments[0].id).to.equal(1);
    expect(tournaments[0].name).to.equal("First Tournament");

    await brackets.createTournament({
      name: "Second Tournament",
      username: "Orballo",
    });

    tournaments = await brackets.getTournaments();

    expect(tournaments.length).to.equal(2);
    expect(tournaments[1].id).to.equal(2);
    expect(tournaments[1].name).to.equal("Second Tournament");
  });
});
